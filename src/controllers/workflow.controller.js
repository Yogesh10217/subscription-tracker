import workflowService from '../services/workflow.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const sendReminders = asyncHandler(async (req, res) => {
  const result = await workflowService.processSubscriptionReminder(req.body);
  return ApiResponse.success(res, result);
});
