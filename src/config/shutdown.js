/**
 * @file shutdown.js
 * @module config/shutdown
 * @description Centralized graceful shutdown manager.
 * Handles SIGTERM, SIGINT, unhandledRejection, and uncaughtException.
 * Ensures orderly resource cleanup before process exit.
 */

import logger from '../utils/logger.js';
import { closeDatabaseConnection } from './database.js';

const GRACEFUL_TIMEOUT_MS = 10000; // 10 seconds for in-flight work
const FORCE_TIMEOUT_MS = 15000; // 15 seconds absolute force kill

let isShuttingDown = false;
let serverRef = null;
let cronTaskRef = null;

/**
 * Initiates orderly shutdown sequence.
 * Idempotent — ignores duplicate calls.
 * @param {string} signal - Signal name or reason for shutdown
 */
async function shutdown(signal) {
  if (isShuttingDown) {
    logger.info('Shutdown already in progress, ignoring duplicate signal', { signal });
    return;
  }
  isShuttingDown = true;

  logger.info(`Graceful shutdown initiated`, { signal, gracefulTimeoutMs: GRACEFUL_TIMEOUT_MS });

  // Force kill timeout — absolute safety net
  const forceTimer = setTimeout(() => {
    logger.error('Forced shutdown — graceful timeout exceeded', {
      signal,
      forceTimeoutMs: FORCE_TIMEOUT_MS
    });
    process.exit(1);
  }, FORCE_TIMEOUT_MS);
  forceTimer.unref(); // Don't keep process alive just for this timer

  try {
    // 1. Stop cron scheduler
    if (cronTaskRef) {
      try {
        cronTaskRef.stop();
        logger.info('Cron scheduler stopped');
      } catch (cronErr) {
        logger.warn('Error stopping cron scheduler', { error: cronErr.message });
      }
    }

    // 2. Stop accepting new HTTP connections
    if (serverRef) {
      await new Promise((resolve) => {
        const closeTimer = setTimeout(() => {
          logger.warn('HTTP server close timed out', { timeoutMs: GRACEFUL_TIMEOUT_MS });
          resolve();
        }, GRACEFUL_TIMEOUT_MS);

        serverRef.close((err) => {
          clearTimeout(closeTimer);
          if (err) {
            logger.warn('HTTP server close error', { error: err.message });
            resolve();
          } else {
            logger.info('HTTP server closed — no more incoming connections');
            resolve();
          }
        });
      });
    }

    // 3. Close MongoDB connection
    await closeDatabaseConnection();

    logger.info('Graceful shutdown complete', { signal });
  } catch (shutdownErr) {
    logger.error('Error during graceful shutdown', {
      error: shutdownErr.message,
      stack: shutdownErr.stack
    });
  } finally {
    clearTimeout(forceTimer);
    process.exit(0);
  }
}

/**
 * Initializes shutdown handlers for the given server and cron task.
 * Registers SIGTERM, SIGINT, unhandledRejection, and uncaughtException handlers.
 * @param {import('http').Server} server - HTTP server instance
 * @param {Object} [cronTask=null] - node-cron task instance with .stop() method
 */
export function initShutdown(server, cronTask = null) {
  serverRef = server;
  cronTaskRef = cronTask;

  // Signal handlers
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Process error handlers (Component 4)
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection — initiating shutdown', {
      error: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
      type: 'unhandledRejection'
    });
    shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception — initiating shutdown', {
      error: error.message,
      stack: error.stack,
      type: 'uncaughtException'
    });
    shutdown('uncaughtException');
  });

  logger.info('Shutdown handlers registered', {
    gracefulTimeoutMs: GRACEFUL_TIMEOUT_MS,
    forceTimeoutMs: FORCE_TIMEOUT_MS
  });
}

/**
 * Returns whether the application is currently shutting down.
 * @returns {boolean}
 */
export function isAppShuttingDown() {
  return isShuttingDown;
}

export default initShutdown;
