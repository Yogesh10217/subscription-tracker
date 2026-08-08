/**
 * @file backoff.util.js
 * @module notifications/utils/backoff.util
 * @description Exponential backoff delay calculator for retries.
 */

export class BackoffUtil {
  /**
   * Calculates retry delay in seconds.
   * @param {number} attempt - 1-indexed attempt number
   * @returns {number} Delay in seconds
   */
  static getDelaySeconds(attempt = 1) {
    const delays = [60, 300, 900, 1800, 3600]; // 1m, 5m, 15m, 30m, 60m
    const index = Math.min(Math.max(0, attempt - 1), delays.length - 1);
    return delays[index];
  }
}

export default BackoffUtil;
