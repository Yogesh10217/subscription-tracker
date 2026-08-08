import importService from '../services/import.service.js';
import exportService from '../services/export.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const previewImport = asyncHandler(async (req, res) => {
  const result = importService.previewImport(req.body.records);
  return ApiResponse.success(res, result, 'Import validation preview generated');
});

export const dryRunImport = asyncHandler(async (req, res) => {
  const result = await importService.dryRunImport(req.body.records, req.user._id.toString());
  return ApiResponse.success(res, result, 'Import dry run executed successfully');
});

export const executeImport = asyncHandler(async (req, res) => {
  const result = await importService.executeImport(
    req.body.records,
    req.user._id.toString(),
    req.body.options
  );
  return ApiResponse.created(res, result, 'Import executed successfully');
});

export const exportSubscriptions = asyncHandler(async (req, res) => {
  const format = (req.query.format || 'json').toLowerCase();
  const userId = req.user._id.toString();

  if (format === 'csv') {
    const csvData = await exportService.exportCSV(userId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscriptions.csv"');
    return res.status(200).send(csvData);
  }

  const jsonData = await exportService.exportJSON(userId);
  return ApiResponse.success(res, jsonData, 'Subscriptions exported successfully');
});
