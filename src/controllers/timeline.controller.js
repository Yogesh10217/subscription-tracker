import timelineService from '../services/timeline.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const getTimeline = asyncHandler(async (req, res) => {
  const events = await timelineService.getEntityTimeline(req.params.id, 'Subscription');
  return ApiResponse.success(res, events, 'Subscription timeline events retrieved');
});

export const getPriceHistory = asyncHandler(async (req, res) => {
  const history = await timelineService.getPriceHistory(req.params.id);
  return ApiResponse.success(res, history, 'Price history retrieved successfully');
});

export const getRenewalHistory = asyncHandler(async (req, res) => {
  const history = await timelineService.getRenewalHistory(req.params.id);
  return ApiResponse.success(res, history, 'Renewal history retrieved successfully');
});
