import userService from '../services/user.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers();
  return ApiResponse.success(res, users);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return ApiResponse.success(res, user);
});
