import tagService from '../services/tag.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const getTags = asyncHandler(async (req, res) => {
  const tags = await tagService.getTags(req.user._id);
  return ApiResponse.success(res, tags, 'Tags retrieved successfully');
});

export const createTag = asyncHandler(async (req, res) => {
  const tag = await tagService.createTag(req.body, req.user._id);
  return ApiResponse.created(res, tag, 'Tag created successfully');
});

export const updateTag = asyncHandler(async (req, res) => {
  const tag = await tagService.updateTag(req.params.id, req.user._id, req.body);
  return ApiResponse.success(res, tag, 'Tag updated successfully');
});

export const deleteTag = asyncHandler(async (req, res) => {
  await tagService.deleteTag(req.params.id, req.user._id);
  return ApiResponse.success(res, null, 'Tag deleted successfully');
});
