import subscriptionService from '../services/subscription.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const createSubscription = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.user;
  const result = await subscriptionService.createSubscription(req.body, userId);
  return ApiResponse.created(res, result);
});

export const getUserSubscriptions = asyncHandler(async (req, res) => {
  const requestingUserId = req.user ? req.user._id : null;
  const subscriptions = await subscriptionService.getUserSubscriptions(req.params.id, requestingUserId);
  return ApiResponse.success(res, subscriptions);
});

export const getAllSubscriptions = asyncHandler(async (req, res) => {
  const user = req.user || null;
  const subscriptions = await subscriptionService.getAllSubscriptions(user);
  return ApiResponse.success(res, subscriptions);
});

export const getSubscriptionDetails = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.getSubscriptionDetails(req.params.id);
  return ApiResponse.success(res, subscription);
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
  return ApiResponse.success(res, subscription);
});

export const deleteSubscription = asyncHandler(async (req, res) => {
  const result = await subscriptionService.deleteSubscription(req.params.id);
  return ApiResponse.success(res, result);
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.cancelSubscription(req.params.id);
  return ApiResponse.success(res, subscription);
});

export const getUpcomingRenewals = asyncHandler(async (req, res) => {
  const user = req.user || null;
  const subscriptions = await subscriptionService.getUpcomingRenewals(user);
  return ApiResponse.success(res, subscriptions);
});
