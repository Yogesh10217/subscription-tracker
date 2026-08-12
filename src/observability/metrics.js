/**
 * @file metrics.js
 * @module observability/metrics
 * @description Lightweight zero-dependency in-process metrics collector with Prometheus text exposition format.
 */

class Counter {
  constructor(name, help) {
    this.name = name;
    this.help = help;
    this.values = new Map();
  }

  inc(labels = {}, value = 1) {
    const key = this._serializeLabels(labels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  get(labels = {}) {
    return this.values.get(this._serializeLabels(labels)) || 0;
  }

  reset() {
    this.values.clear();
  }

  _serializeLabels(labels) {
    const entries = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b));
    return entries.map(([k, v]) => `${k}="${v}"`).join(',');
  }

  toPrometheus() {
    const lines = [`# HELP ${this.name} ${this.help}`, `# TYPE ${this.name} counter`];
    for (const [labelStr, value] of this.values) {
      const labelPart = labelStr ? `{${labelStr}}` : '';
      lines.push(`${this.name}${labelPart} ${value}`);
    }
    return lines.join('\n');
  }
}

class Histogram {
  constructor(name, help, buckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]) {
    this.name = name;
    this.help = help;
    this.buckets = buckets.sort((a, b) => a - b);
    this.observations = new Map();
  }

  observe(value, labels = {}) {
    const key = this._serializeLabels(labels);
    if (!this.observations.has(key)) {
      this.observations.set(key, {
        sum: 0,
        count: 0,
        bucketCounts: new Array(this.buckets.length + 1).fill(0)
      });
    }
    const obs = this.observations.get(key);
    obs.sum += value;
    obs.count += 1;
    for (let i = 0; i < this.buckets.length; i++) {
      if (value <= this.buckets[i]) obs.bucketCounts[i] += 1;
    }
    obs.bucketCounts[this.buckets.length] += 1; // +Inf bucket
  }

  reset() {
    this.observations.clear();
  }

  _serializeLabels(labels) {
    const entries = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b));
    return entries.map(([k, v]) => `${k}="${v}"`).join(',');
  }

  toPrometheus() {
    const lines = [`# HELP ${this.name} ${this.help}`, `# TYPE ${this.name} histogram`];
    for (const [labelStr, obs] of this.observations) {
      const baseLabels = labelStr ? `${labelStr},` : '';
      for (let i = 0; i < this.buckets.length; i++) {
        lines.push(
          `${this.name}_bucket{${baseLabels}le="${this.buckets[i]}"} ${obs.bucketCounts[i]}`
        );
      }
      lines.push(`${this.name}_bucket{${baseLabels}le="+Inf"} ${obs.count}`);
      lines.push(`${this.name}_sum{${labelStr ? labelStr : ''}} ${obs.sum}`);
      lines.push(`${this.name}_count{${labelStr ? labelStr : ''}} ${obs.count}`);
    }
    return lines.join('\n');
  }
}

class MetricsRegistry {
  constructor() {
    this.counters = new Map();
    this.histograms = new Map();
  }

  counter(name, help) {
    if (!this.counters.has(name)) this.counters.set(name, new Counter(name, help));
    return this.counters.get(name);
  }

  histogram(name, help, buckets) {
    if (!this.histograms.has(name)) this.histograms.set(name, new Histogram(name, help, buckets));
    return this.histograms.get(name);
  }

  reset() {
    this.counters.forEach((c) => c.reset());
    this.histograms.forEach((h) => h.reset());
  }

  toPrometheus() {
    const sections = [];
    for (const counter of this.counters.values()) {
      if (counter.values.size > 0) sections.push(counter.toPrometheus());
    }
    for (const histogram of this.histograms.values()) {
      if (histogram.observations.size > 0) sections.push(histogram.toPrometheus());
    }
    // Process metrics
    sections.push(collectProcessMetrics());
    return sections.join('\n\n') + '\n';
  }
}

function collectProcessMetrics() {
  const mem = process.memoryUsage();
  const lines = [
    '# HELP process_uptime_seconds Process uptime in seconds',
    '# TYPE process_uptime_seconds gauge',
    `process_uptime_seconds ${process.uptime().toFixed(2)}`,
    '# HELP process_heap_used_bytes Process heap used in bytes',
    '# TYPE process_heap_used_bytes gauge',
    `process_heap_used_bytes ${mem.heapUsed}`,
    '# HELP process_heap_total_bytes Process heap total in bytes',
    '# TYPE process_heap_total_bytes gauge',
    `process_heap_total_bytes ${mem.heapTotal}`,
    '# HELP process_rss_bytes Process RSS in bytes',
    '# TYPE process_rss_bytes gauge',
    `process_rss_bytes ${mem.rss}`
  ];
  return lines.join('\n');
}

export const metricsRegistry = new MetricsRegistry();

// Pre-register known metrics
export const httpRequestsTotal = metricsRegistry.counter(
  'http_requests_total',
  'Total HTTP requests'
);
export const httpRequestDuration = metricsRegistry.histogram(
  'http_request_duration_seconds',
  'HTTP request duration in seconds'
);
export const authLoginTotal = metricsRegistry.counter('auth_login_total', 'Total login attempts');
export const authLoginFailureTotal = metricsRegistry.counter(
  'auth_login_failure_total',
  'Total failed login attempts'
);
export const authLockoutTotal = metricsRegistry.counter(
  'auth_lockout_total',
  'Total account lockouts'
);
export const authRefreshRotationTotal = metricsRegistry.counter(
  'auth_refresh_rotation_total',
  'Total refresh token rotations'
);
export const authRefreshReplayTotal = metricsRegistry.counter(
  'auth_refresh_replay_total',
  'Total refresh token replay detections'
);
export const notificationCreatedTotal = metricsRegistry.counter(
  'notification_created_total',
  'Total notifications created'
);
export const notificationClaimedTotal = metricsRegistry.counter(
  'notification_claimed_total',
  'Total notifications claimed by worker'
);
export const notificationCasConflictTotal = metricsRegistry.counter(
  'notification_cas_conflict_total',
  'Total CAS conflicts during worker claiming'
);
export const notificationSentTotal = metricsRegistry.counter(
  'notification_sent_total',
  'Total notifications sent'
);
export const notificationDeliveredTotal = metricsRegistry.counter(
  'notification_delivered_total',
  'Total notifications delivered'
);
export const notificationFailedTotal = metricsRegistry.counter(
  'notification_failed_total',
  'Total notifications failed'
);
export const notificationRetryingTotal = metricsRegistry.counter(
  'notification_retrying_total',
  'Total notifications retrying'
);
export const notificationStaleRecoveredTotal = metricsRegistry.counter(
  'notification_stale_recovered_total',
  'Total stale notifications recovered'
);
export const qstashPublishAttemptTotal = metricsRegistry.counter(
  'qstash_publish_attempt_total',
  'Total QStash publish attempts'
);
export const qstashPublishSuccessTotal = metricsRegistry.counter(
  'qstash_publish_success_total',
  'Total successful QStash publishes'
);
export const qstashPublishFailureTotal = metricsRegistry.counter(
  'qstash_publish_failure_total',
  'Total failed QStash publishes'
);
export const qstashWorkerExecutionTotal = metricsRegistry.counter(
  'qstash_worker_execution_total',
  'Total QStash worker executions'
);
export const qstashSignatureFailureTotal = metricsRegistry.counter(
  'qstash_signature_failure_total',
  'Total QStash signature failures'
);
export const mongodbConnectionFailureTotal = metricsRegistry.counter(
  'mongodb_connection_failure_total',
  'Total MongoDB connection failures'
);
export const mongodbConnectionRecoveryTotal = metricsRegistry.counter(
  'mongodb_connection_recovery_total',
  'Total MongoDB connection recoveries'
);

export { Counter, Histogram, MetricsRegistry, collectProcessMetrics };
export default metricsRegistry;
