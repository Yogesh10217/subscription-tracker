import categoryService from '../services/category.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories(req.user._id);
  return ApiResponse.success(res, categories, 'Categories retrieved successfully');
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user._id);
  return ApiResponse.created(res, category, 'Category created successfully');
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.user._id, req.body);
  return ApiResponse.success(res, category, 'Category updated successfully');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id, req.user._id);
  return ApiResponse.success(res, null, 'Category deleted successfully');
});
