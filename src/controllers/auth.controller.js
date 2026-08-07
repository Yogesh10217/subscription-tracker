import authService from '../services/auth.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const signUp = asyncHandler(async (req, res) => {
  const result = await authService.signUp(req.body);
  return ApiResponse.created(res, result, "User created successfully");
});

export const signIn = asyncHandler(async (req, res) => {
  const result = await authService.signIn(req.body);
  return ApiResponse.success(res, result, "User signed in successfully");
});
