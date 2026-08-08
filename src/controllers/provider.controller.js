import providerService from '../services/provider.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const getProviders = asyncHandler(async (req, res) => {
  const providers = await providerService.getProviders(req.user._id);
  return ApiResponse.success(res, providers, 'Providers retrieved successfully');
});

export const createProvider = asyncHandler(async (req, res) => {
  const provider = await providerService.createProvider(req.body, req.user._id);
  return ApiResponse.created(res, provider, 'Provider created successfully');
});

export const updateProvider = asyncHandler(async (req, res) => {
  const provider = await providerService.updateProvider(req.params.id, req.user._id, req.body);
  return ApiResponse.success(res, provider, 'Provider updated successfully');
});

export const deleteProvider = asyncHandler(async (req, res) => {
  await providerService.deleteProvider(req.params.id, req.user._id);
  return ApiResponse.success(res, null, 'Provider deleted successfully');
});
