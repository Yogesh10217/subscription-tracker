import { Client as WorkflowClient } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN } from "./env.js";

// Create workflow client with development configuration
export const workflowClient = new WorkflowClient({
  baseUrl: QSTASH_URL || 'http://127.0.0.1:8080',
  token: QSTASH_TOKEN || 'development',
});

// Log QStash configuration on startup
console.log('QStash Configuration:', {
  baseUrl: QSTASH_URL || 'http://127.0.0.1:8080',
  hasToken: !!QSTASH_TOKEN
});
