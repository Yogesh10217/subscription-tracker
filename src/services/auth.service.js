/**
 * @file auth.service.js
 * @module services/auth.service
 * @description Core authentication service integrating JWT generation, account lockout, session management, password lifecycle, and security audit logs.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userRepository from '../repositories/user.repository.js';
import sessionService from './session.service.js';
import passwordService from './password.service.js';
import verificationService from './verification.service.js';
import auditService from './audit.service.js';
import authEvents, { AUTH_EVENT_TYPES } from '../events/auth.events.js';
import ApiError from '../utils/api-error.js';
import SECURITY_CONFIG from '../config/security.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import { sendEmail } from '../utils/send-email.js';

export const authService = {
  /**
   * Generates Access Token (15m) and Refresh Token (7d) pair.
   * @param {Object} user
   * @returns {{ accessToken: string, refreshToken: string }}
   */
  generateTokens(user) {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
      permissions: user.permissions || SECURITY_CONFIG.ROLE_PERMISSIONS[user.role || 'user'] || []
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: SECURITY_CONFIG.ACCESS_TOKEN_TTL || JWT_EXPIRES_IN || '15m'
    });

    const refreshToken = jwt.sign({ userId: user._id.toString(), type: 'refresh' }, JWT_SECRET, {
      expiresIn: SECURITY_CONFIG.REFRESH_TOKEN_TTL || '7d'
    });

    return { accessToken, refreshToken };
  },

  /**
   * Registers a new user account, enforces password strength, generates verification token.
   * @param {Object} userData
   * @param {string} [ipAddress]
   * @param {string} [userAgent]
   * @returns {Promise<{ user: Object, tokens: Object, session: Object }>}
   */
  async signUp(userData, ipAddress = '127.0.0.1', userAgent = 'Unknown') {
    const { name, email, password } = userData;

    // Enforce password policy
    passwordService.validatePasswordPolicy(password);

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      await auditService.logEvent({
        action: 'SIGNUP_FAILED_CONFLICT',
        target: email,
        ipAddress,
        userAgent,
        result: 'FAILURE'
      });
      throw ApiError.conflict('User with this email already exists');
    }

    const defaultRole = 'user';
    const defaultPermissions = SECURITY_CONFIG.ROLE_PERMISSIONS[defaultRole];

    const newUser = await userRepository.create({
      name,
      email,
      password,
      role: defaultRole,
      permissions: defaultPermissions,
      isVerified: false
    });

    // Generate email verification token
    const { rawToken } = await verificationService.createVerificationToken(
      newUser._id,
      'email_verification'
    );

    // Attempt verification email delivery
    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your SubPulse Account',
        message: `Welcome to SubPulse! Please verify your email using token: ${rawToken}`
      });
    } catch (_e) {
      // Non-blocking email failure in dev/test
    }

    const tokens = this.generateTokens(newUser);
    const session = await sessionService.createSession({
      userId: newUser._id.toString(),
      refreshToken: tokens.refreshToken,
      userAgent,
      ipAddress
    });

    await auditService.logEvent({
      action: 'USER_REGISTERED',
      actor: newUser._id.toString(),
      ipAddress,
      userAgent,
      result: 'SUCCESS'
    });

    authEvents.emit(AUTH_EVENT_TYPES.USER_REGISTERED, { user: newUser, rawToken });

    const userObj = newUser.toObject ? newUser.toObject() : newUser;
    delete userObj.password;
    delete userObj.passwordHistory;

    return { user: userObj, tokens, session };
  },

  /**
   * Authenticates user credentials, enforces account lockout, and issues token pair + session.
   * @param {Object} credentials
   * @param {string} [ipAddress]
   * @param {string} [userAgent]
   * @returns {Promise<{ user: Object, token: string, accessToken: string, refreshToken: string, session: Object }>}
   */
  async signIn({ email, password }, ipAddress = '127.0.0.1', userAgent = 'Unknown') {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      await auditService.logEvent({
        action: 'LOGIN_FAILED_USER_NOT_FOUND',
        target: email,
        ipAddress,
        userAgent,
        result: 'FAILURE'
      });
      throw ApiError.notFound('User not found');
    }

    // Account Lockout Verification
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMins = Math.ceil((user.lockUntil - new Date()) / 60000);
      await auditService.logEvent({
        action: 'LOGIN_REJECTED_ACCOUNT_LOCKED',
        actor: user._id.toString(),
        ipAddress,
        userAgent,
        result: 'DENIED'
      });
      throw ApiError.forbidden(
        `Account is temporarily locked. Try again in ${remainingMins} minutes.`
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      let lockUntil = null;

      if (attempts >= SECURITY_CONFIG.ACCOUNT_LOCK_ATTEMPTS) {
        lockUntil = new Date(Date.now() + SECURITY_CONFIG.ACCOUNT_LOCK_DURATION_SEC * 1000);
        await auditService.logEvent({
          action: 'ACCOUNT_LOCKED',
          actor: user._id.toString(),
          ipAddress,
          userAgent,
          result: 'DENIED',
          metadata: { attempts, lockUntil }
        });
        authEvents.emit(AUTH_EVENT_TYPES.ACCOUNT_LOCKED, { user });
      }

      await userRepository.update(user._id, {
        failedLoginAttempts: attempts,
        lockUntil
      });

      await auditService.logEvent({
        action: 'LOGIN_FAILED_BAD_PASSWORD',
        actor: user._id.toString(),
        ipAddress,
        userAgent,
        result: 'FAILURE',
        metadata: { attempts }
      });

      throw ApiError.badRequest('Invalid email or password');
    }

    // Reset failed login attempts on successful password match
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      await userRepository.update(user._id, {
        failedLoginAttempts: 0,
        lockUntil: null
      });
    }

    const tokens = this.generateTokens(user);
    const session = await sessionService.createSession({
      userId: user._id.toString(),
      refreshToken: tokens.refreshToken,
      userAgent,
      ipAddress
    });

    await auditService.logEvent({
      action: 'LOGIN_SUCCESS',
      actor: user._id.toString(),
      ipAddress,
      userAgent,
      result: 'SUCCESS'
    });

    authEvents.emit(AUTH_EVENT_TYPES.USER_LOGGED_IN, { user, session });

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    delete userObj.passwordHistory;

    return {
      user: userObj,
      token: tokens.accessToken, // Backward compatibility
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      session
    };
  },

  /**
   * Rotates refresh token pair using token family rotation.
   * @param {string} refreshToken
   * @param {string} [ipAddress]
   * @param {string} [userAgent]
   * @returns {Promise<{ accessToken: string, refreshToken: string }>}
   */
  async refreshTokens(refreshToken, ipAddress = '127.0.0.1', userAgent = 'Unknown') {
    if (!refreshToken) {
      throw ApiError.badRequest('Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (_err) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await userRepository.findByIdRaw(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    const newTokens = this.generateTokens(user);
    await sessionService.rotateSession(refreshToken, newTokens.refreshToken, ipAddress, userAgent);

    return newTokens;
  },

  /**
   * Initiates forgot password flow.
   * @param {string} email
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return; // Prevent email enumeration attacks
    }

    const { rawToken } = await verificationService.createVerificationToken(
      user._id,
      'password_reset'
    );

    try {
      await sendEmail({
        to: email,
        subject: 'SubPulse Password Reset Instructions',
        message: `Use the following token to reset your password: ${rawToken}`
      });
    } catch (_e) {
      // Non-blocking in test/dev
    }

    await auditService.logEvent({
      action: 'PASSWORD_RESET_REQUESTED',
      actor: user._id.toString()
    });

    authEvents.emit(AUTH_EVENT_TYPES.PASSWORD_RESET_REQUESTED, { user, rawToken });
  },

  /**
   * Resets password using verification token.
   * @param {string} rawToken
   * @param {string} newPassword
   */
  async resetPassword(rawToken, newPassword) {
    passwordService.validatePasswordPolicy(newPassword);

    const tokenDoc = await verificationService.verifyToken(rawToken, 'password_reset');
    const user = await userRepository.findByIdRaw(tokenDoc.user);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Check password reuse against history
    const isReused = await passwordService.isPasswordReused(
      newPassword,
      user.passwordHistory || []
    );
    if (isReused) {
      throw ApiError.badRequest('Cannot reuse recent passwords');
    }

    const newHash = await passwordService.hashPassword(newPassword);
    const updatedHistory = [user.password, ...(user.passwordHistory || [])].slice(
      0,
      SECURITY_CONFIG.PASSWORD_HISTORY_LIMIT
    );

    await userRepository.update(user._id, {
      password: newHash,
      passwordHistory: updatedHistory,
      failedLoginAttempts: 0,
      lockUntil: null
    });

    await verificationService.consumeToken(tokenDoc._id);
    await sessionService.revokeAllSessions(user._id.toString(), 'Password Reset Executed');

    await auditService.logEvent({
      action: 'PASSWORD_RESET_SUCCESS',
      actor: user._id.toString()
    });

    authEvents.emit(AUTH_EVENT_TYPES.PASSWORD_CHANGED, { user });
  },

  /**
   * Changes password for logged in user.
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  async changePassword(userId, currentPassword, newPassword) {
    passwordService.validatePasswordPolicy(newPassword);

    const user = await userRepository.findByIdRaw(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const isReused = await passwordService.isPasswordReused(
      newPassword,
      user.passwordHistory || []
    );
    if (isReused) {
      throw ApiError.badRequest('Cannot reuse recent passwords');
    }

    const newHash = await passwordService.hashPassword(newPassword);
    const updatedHistory = [user.password, ...(user.passwordHistory || [])].slice(
      0,
      SECURITY_CONFIG.PASSWORD_HISTORY_LIMIT
    );

    await userRepository.update(userId, {
      password: newHash,
      passwordHistory: updatedHistory
    });

    await auditService.logEvent({
      action: 'PASSWORD_CHANGED',
      actor: userId
    });

    authEvents.emit(AUTH_EVENT_TYPES.PASSWORD_CHANGED, { user });
  },

  /**
   * Verifies user email.
   * @param {string} rawToken
   */
  async verifyEmail(rawToken) {
    const tokenDoc = await verificationService.verifyToken(rawToken, 'email_verification');
    await userRepository.update(tokenDoc.user, { isVerified: true });
    await verificationService.consumeToken(tokenDoc._id);

    await auditService.logEvent({
      action: 'EMAIL_VERIFIED',
      actor: tokenDoc.user.toString()
    });
  }
};

export default authService;
