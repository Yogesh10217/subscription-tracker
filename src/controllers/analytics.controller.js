import analyticsService from '../analytics/analytics.service.js';
import AnalyticsQueryContext from '../analytics/context/analytics-query-context.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

const createContext = (req) => {
  return new AnalyticsQueryContext({
    userId: req.user._id,
    period: req.query.period,
    from: req.query.from,
    to: req.query.to,
    currency: req.query.currency,
    includeArchived: req.query.includeArchived,
    includeDeleted: req.query.includeDeleted,
    timezone: req.query.timezone || 'UTC',
    granularity: req.query.granularity
  });
};

export const getSummary = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getSummary(context);
  return ApiResponse.success(res, data, 'Summary analytics retrieved successfully');
});

export const getSpending = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getSpending(context);
  return ApiResponse.success(res, data, 'Spending analytics retrieved successfully');
});

export const getSubscriptions = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getSubscriptions(context);
  return ApiResponse.success(res, data, 'Subscription metrics retrieved successfully');
});

export const getCategories = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getCategories(context);
  return ApiResponse.success(res, data, 'Category analytics retrieved successfully');
});

export const getProviders = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getProviders(context);
  return ApiResponse.success(res, data, 'Provider analytics retrieved successfully');
});

export const getRenewals = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getRenewals(context);
  return ApiResponse.success(res, data, 'Renewal analytics retrieved successfully');
});

export const getTrials = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getTrials(context);
  return ApiResponse.success(res, data, 'Trial analytics retrieved successfully');
});

export const getTrends = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getTrends(context);
  return ApiResponse.success(res, data, 'Trend analytics retrieved successfully');
});

export const getPriceChanges = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getPriceChanges(context);
  return ApiResponse.success(res, data, 'Price change analytics retrieved successfully');
});

export const getInsights = asyncHandler(async (req, res) => {
  const context = createContext(req);
  const data = await analyticsService.getInsights(context);
  return ApiResponse.success(res, data, 'Analytics insights retrieved successfully');
});
