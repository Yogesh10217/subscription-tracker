/**
 * @file insight-engine.js
 * @module analytics/insights/insight-engine
 * @description Evaluates all deterministic insight rules against aggregated metric datasets.
 */

import INSIGHT_RULES from './insights.rules.js';

export class InsightEngine {
  /**
   * Generates explainable insights from aggregated metrics data.
   * @param {Object} aggregatedMetrics
   * @returns {Array<Object>} List of evaluated insights
   */
  static generateInsights(aggregatedMetrics = {}) {
    const allInsights = [];

    INSIGHT_RULES.forEach((rule) => {
      try {
        const results = rule.evaluate(aggregatedMetrics);
        if (Array.isArray(results) && results.length > 0) {
          allInsights.push(...results);
        }
      } catch (_err) {
        // Safe execution per rule
      }
    });

    return allInsights;
  }
}

export default InsightEngine;
