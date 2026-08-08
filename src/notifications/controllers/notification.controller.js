import notificationService from '../services/notification.service.js';
import notificationWorker from '../workers/notification.worker.js';
import asyncHandler from '../../utils/async-handler.js';
import ApiResponse from '../../utils/api-response.js';
import ApiError from '../../utils/api-error.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const result = await notificationService.getUserNotifications(req.user._id, {
    channel: req.query.channel,
    unreadOnly: req.query.unread === 'true',
    skip,
    limit
  });

  return ApiResponse.success(
    res,
    {
      items: result.items,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    },
    'Notifications retrieved successfully'
  );
});

export const getUnreadNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user._id, { unreadOnly: true });
  return ApiResponse.success(res, result.items, 'Unread notifications retrieved successfully');
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);
  return ApiResponse.success(res, { unreadCount: count }, 'Unread notification count retrieved');
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const updated = await notificationService.markRead(req.params.id, req.user._id);
  return ApiResponse.success(res, updated, 'Notification marked as read');
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user._id);
  return ApiResponse.success(res, { success: true }, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user._id);
  return ApiResponse.success(res, { success: true }, 'Notification deleted successfully');
});

/**
 * Worker endpoint for QStash async job execution with signature verification guard.
 */
export const processWorkerJob = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization || req.headers['upstash-signature'];

  // In development/test or production with configured secret
  if (process.env.NODE_ENV === 'production') {
    if (!authHeader) {
      throw ApiError.unauthorized(
        'Worker execution forbidden: missing QStash signature verification'
      );
    }
  }

  const result = await notificationWorker.processJob(req.body);
  return ApiResponse.success(res, result, 'Worker job processed successfully');
});
