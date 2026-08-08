import reminderRuleService from '../services/reminder-rule.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const getRules = asyncHandler(async (req, res) => {
  const rules = await reminderRuleService.getRules(req.params.id, req.user._id.toString());
  return ApiResponse.success(res, rules, 'Reminder rules retrieved successfully');
});

export const addRule = asyncHandler(async (req, res) => {
  const rule = await reminderRuleService.addRule(req.params.id, req.user._id.toString(), req.body);
  return ApiResponse.created(res, rule, 'Reminder rule created successfully');
});

export const updateRule = asyncHandler(async (req, res) => {
  const rule = await reminderRuleService.updateRule(
    req.params.ruleId,
    req.user._id.toString(),
    req.body
  );
  return ApiResponse.success(res, rule, 'Reminder rule updated successfully');
});

export const deleteRule = asyncHandler(async (req, res) => {
  await reminderRuleService.deleteRule(req.params.ruleId, req.user._id.toString());
  return ApiResponse.success(res, null, 'Reminder rule deleted successfully');
});
