import ApiError from '../utils/api-error.js';

export const validateAnalyticsQuery = (req, res, next) => {
  const { period, granularity, currency } = req.query;

  const validPeriods = [
    'today',
    'this_week',
    'this_month',
    'last_month',
    'this_quarter',
    'last_quarter',
    'this_year',
    'last_year',
    'custom'
  ];

  if (period && !validPeriods.includes(period)) {
    return next(ApiError.badRequest(`Invalid analytics period specified: ${period}`));
  }

  const validGranularity = ['day', 'week', 'month', 'year'];
  if (granularity && !validGranularity.includes(granularity)) {
    return next(ApiError.badRequest(`Invalid granularity specified: ${granularity}`));
  }

  if (currency && typeof currency === 'string' && currency.length !== 3) {
    return next(ApiError.badRequest('Currency code must be a 3-letter ISO 4217 code'));
  }

  next();
};

export default validateAnalyticsQuery;
