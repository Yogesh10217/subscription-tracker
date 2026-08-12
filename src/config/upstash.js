import { Client as WorkflowClient } from '@upstash/workflow';
import { QSTASH_URL, QSTASH_TOKEN } from './env.js';
import logger from '../utils/logger.js';

export const workflowClient = new WorkflowClient({
  baseUrl: QSTASH_URL || 'http://127.0.0.1:8090',
  token: QSTASH_TOKEN || 'development'
});

logger.info('QStash Configuration Initialized', {
  baseUrl: QSTASH_URL || 'http://127.0.0.1:8090',
  hasToken: !!QSTASH_TOKEN
});

/**
 * Checks if QStash is properly configured for cloud execution.
 * @returns {boolean}
 */
export function isQStashConfigured() {
  return Boolean(
    QSTASH_TOKEN &&
      QSTASH_TOKEN !== 'development' &&
      QSTASH_TOKEN !== 'mock_qstash_token' &&
      QSTASH_URL &&
      !QSTASH_URL.includes('127.0.0.1') &&
      !QSTASH_URL.includes('localhost')
  );
}

/**
 * Safely triggers an Upstash workflow with timeout and error handling.
 * Falls back gracefully when QStash is unreachable or unconfigured.
 * @param {Object} options
 * @param {string} options.url - Webhook endpoint URL
 * @param {Object} options.body - Payload object
 * @param {string} [options.cron] - Optional cron schedule
 * @param {number} [options.retries=3] - Number of retries
 * @returns {Promise<{ success: boolean, workflowId?: string, skipped?: boolean, reason?: string }>}
 */
export async function triggerWorkflowSafely({ url, body, cron, retries = 3 }) {
  if (!isQStashConfigured()) {
    logger.info('QStash unconfigured for environment; relying on in-process node-cron scheduler');
    return { success: false, skipped: true, reason: 'QStash unconfigured for environment' };
  }

  if (!workflowClient) {
    logger.info('Workflow client not initialized; skipping QStash trigger');
    return { success: false, skipped: true, reason: 'Client uninitialized' };
  }

  try {
    const response = await workflowClient.trigger({
      url,
      body,
      headers: {
        'Content-Type': 'application/json'
      },
      retries,
      ...(cron ? { cron } : {})
    });

    const workflowId = response?.scheduleId || response?.messageId || response?.id;
    logger.info('QStash workflow triggered successfully', { workflowId, url });
    return { success: true, workflowId, response };
  } catch (error) {
    const isConnError =
      error.message?.includes('fetch failed') ||
      error.message?.includes('ECONNREFUSED') ||
      error.message?.includes('ENOTFOUND') ||
      error.code === 'ECONNREFUSED';

    if (isConnError) {
      logger.info('QStash server offline/unreachable; continuing with local scheduler fallback', {
        reason: error.message
      });
      return { success: false, skipped: true, reason: 'QStash server unreachable' };
    }

    logger.warn('QStash workflow trigger returned error', { error: error.message });
    return { success: false, skipped: true, reason: error.message };
  }
}

export default workflowClient;

