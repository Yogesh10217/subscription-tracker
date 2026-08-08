import fileAssetService from '../services/file-asset.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const getFiles = asyncHandler(async (req, res) => {
  const files = await fileAssetService.getFileAssets(req.params.id, req.user._id.toString());
  return ApiResponse.success(res, files, 'File assets retrieved successfully');
});

export const addFile = asyncHandler(async (req, res) => {
  const file = await fileAssetService.addFileAsset(
    req.params.id,
    req.user._id.toString(),
    req.body
  );
  return ApiResponse.created(res, file, 'File asset metadata created successfully');
});

export const deleteFile = asyncHandler(async (req, res) => {
  await fileAssetService.deleteFileAsset(req.params.fileId, req.user._id.toString());
  return ApiResponse.success(res, null, 'File asset deleted successfully');
});
