import notificationPreferenceService from '../services/notification-preference.service.js';
import asyncHandler from '../../utils/async-handler.js';
import ApiResponse from '../../utils/api-response.js';

export const getPreferences = asyncHandler(async (req, res) => {
  const prefs = await notificationPreferenceService.getPreferences(req.user._id);
  return ApiResponse.success(res, prefs, 'Notification preferences retrieved successfully');
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const updated = await notificationPreferenceService.updatePreferences(req.user._id, req.body);
  return ApiResponse.success(res, updated, 'Notification preferences updated successfully');
});
