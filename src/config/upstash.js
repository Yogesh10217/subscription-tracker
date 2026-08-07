import { Client as WorkflowClient } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN } from "./env.js";
import logger from "../utils/logger.js";

export const workflowClient = new WorkflowClient({
  baseUrl: QSTASH_URL || 'http://127.0.0.1:8090',
  token: QSTASH_TOKEN || 'development',
});

logger.info('QStash Configuration Initialized', {
  baseUrl: QSTASH_URL || 'http://127.0.0.1:8090',
  hasToken: !!QSTASH_TOKEN
});

export default workflowClient;
