import subscriptionService from '../services/subscription.service.js';
import searchService from '../services/search.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const createSubscription = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.user;
  const result = await subscriptionService.createSubscription(req.body, userId);
  return ApiResponse.created(res, result);
});

export const getUserSubscriptions = asyncHandler(async (req, res) => {
  const requestingUserId = req.user ? req.user._id : null;
  const subscriptions = await subscriptionService.getUserSubscriptions(
    req.params.id,
    requestingUserId
  );
  return ApiResponse.success(res, subscriptions);
});

export const getAllSubscriptions = asyncHandler(async (req, res) => {
  // If search/filter query parameters are passed, route to search engine
  if (Object.keys(req.query).length > 0 && req.user) {
    const searchResult = await searchService.searchSubscriptions(
      req.query,
      req.user._id.toString()
    );
    return ApiResponse.success(res, searchResult);
  }

  const user = req.user || null;
  const subscriptions = await subscriptionService.getAllSubscriptions(user);
  return ApiResponse.success(res, subscriptions);
});

export const getSubscriptionDetails = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.getSubscriptionDetails(req.params.id);
  return ApiResponse.success(res, subscription);
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id.toString() : null;
  const subscription = await subscriptionService.updateSubscription(
    req.params.id,
    req.body,
    userId
  );
  return ApiResponse.success(res, subscription);
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.toggleFavorite(
    req.params.id,
    req.user._id.toString()
  );
  return ApiResponse.success(res, subscription, 'Favorite status toggled');
});

export const togglePin = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.togglePin(req.params.id, req.user._id.toString());
  return ApiResponse.success(res, subscription, 'Pin status toggled');
});

export const archiveSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.archiveSubscription(
    req.params.id,
    req.user._id.toString()
  );
  return ApiResponse.success(res, subscription, 'Subscription archived successfully');
});

export const restoreSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.restoreSubscription(
    req.params.id,
    req.user._id.toString()
  );
  return ApiResponse.success(res, subscription, 'Subscription restored successfully');
});

export const deleteSubscription = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id.toString() : null;
  const result = await subscriptionService.deleteSubscription(req.params.id, userId);
  return ApiResponse.success(res, result);
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id.toString() : null;
  const subscription = await subscriptionService.cancelSubscription(req.params.id, userId);
  return ApiResponse.success(res, subscription);
});

export const bulkOperation = asyncHandler(async (req, res) => {
  const { action, ids, categoryRef, categoryName, tags } = req.body;
  const result = await subscriptionService.bulkOperation(action, ids, req.user._id.toString(), {
    categoryRef,
    categoryName,
    tags
  });
  return ApiResponse.success(res, result, `Bulk ${action} executed successfully`);
});

export const getUpcomingRenewals = asyncHandler(async (req, res) => {
  const user = req.user || null;
  const subscriptions = await subscriptionService.getUpcomingRenewals(user);
  return ApiResponse.success(res, subscriptions);
});
