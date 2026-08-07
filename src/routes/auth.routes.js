import { Router } from 'express';
import {
  signIn,
  signUp,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerification,
  getSessions,
  revokeSession
} from '../controllers/auth.controller.js';
import { validateSignIn, validateSignUp } from '../validators/auth.validator.js';
import validateForgotPassword from '../validators/forgot-password.validator.js';
import validateResetPassword from '../validators/reset-password.validator.js';
import validateChangePassword from '../validators/change-password.validator.js';
import validateVerifyEmail from '../validators/verify-email.validator.js';
import validateSessionIdParam from '../validators/session.validator.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { authRateLimiter, passwordResetRateLimiter } from '../middleware/rate-limit.middleware.js';

const authRouter = Router();

// Public Authentication Endpoints
authRouter.post('/sign-up', authRateLimiter, validateSignUp, signUp);
authRouter.post('/sign-in', authRateLimiter, validateSignIn, signIn);
authRouter.post('/refresh', authRateLimiter, refreshToken);
authRouter.post(
  '/forgot-password',
  passwordResetRateLimiter,
  validateForgotPassword,
  forgotPassword
);
authRouter.post('/reset-password', passwordResetRateLimiter, validateResetPassword, resetPassword);
authRouter.post('/verify-email', validateVerifyEmail, verifyEmail);

// Protected Authentication & Session Endpoints
authRouter.post('/logout', authMiddleware, logout);
authRouter.post('/logout-all', authMiddleware, logoutAll);
authRouter.post('/change-password', authMiddleware, validateChangePassword, changePassword);
authRouter.post('/resend-verification', authMiddleware, resendVerification);
authRouter.get('/sessions', authMiddleware, getSessions);
authRouter.delete('/sessions/:id', authMiddleware, validateSessionIdParam, revokeSession);

export default authRouter;
