import authService from '../services/auth.service.js';
import sessionService from '../services/session.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

const getClientInfo = (req) => ({
  ipAddress: req.ip || req.headers?.['x-forwarded-for'] || '127.0.0.1',
  userAgent: req.headers?.['user-agent'] || 'Unknown'
});

export const signUp = asyncHandler(async (req, res) => {
  const { ipAddress, userAgent } = getClientInfo(req);
  const result = await authService.signUp(req.body, ipAddress, userAgent);

  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth'
  });

  return ApiResponse.created(res, result, 'User registered successfully. Verification email sent.');
});

export const signIn = asyncHandler(async (req, res) => {
  const { ipAddress, userAgent } = getClientInfo(req);
  const result = await authService.signIn(req.body, ipAddress, userAgent);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth'
  });

  return ApiResponse.success(res, result, 'User signed in successfully');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  const { ipAddress, userAgent } = getClientInfo(req);

  const tokens = await authService.refreshTokens(token, ipAddress, userAgent);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth'
  });

  return ApiResponse.success(res, tokens, 'Tokens refreshed successfully');
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (token) {
    const hash = sessionService.hashToken(token);
    await sessionService.revokeSession(hash, req.user?._id?.toString(), 'User Logout');
  }

  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  return ApiResponse.success(res, null, 'Logged out successfully');
});

export const logoutAll = asyncHandler(async (req, res) => {
  await sessionService.revokeAllSessions(req.user._id.toString(), 'User Logout All Sessions');
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  return ApiResponse.success(res, null, 'All sessions logged out successfully');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return ApiResponse.success(
    res,
    null,
    'If an account exists, password reset instructions have been sent.'
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const token = req.body.token || req.query.token;
  await authService.resetPassword(token, req.body.newPassword);
  return ApiResponse.success(res, null, 'Password reset successfully');
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(
    req.user._id.toString(),
    req.body.currentPassword,
    req.body.newPassword
  );
  return ApiResponse.success(res, null, 'Password changed successfully');
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body.token || req.query.token;
  await authService.verifyEmail(token);
  return ApiResponse.success(res, null, 'Email verified successfully');
});

export const resendVerification = asyncHandler(async (req, res) => {
  if (req.user) {
    await authService.forgotPassword(req.user.email);
  }
  return ApiResponse.success(res, null, 'Verification email sent');
});

export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await sessionService.getUserSessions(req.user._id.toString());
  return ApiResponse.success(res, sessions, 'Active user sessions retrieved');
});

export const revokeSession = asyncHandler(async (req, res) => {
  await sessionService.revokeSession(req.params.id, req.user._id.toString(), 'Manual Revocation');
  return ApiResponse.success(res, null, 'Session revoked successfully');
});
