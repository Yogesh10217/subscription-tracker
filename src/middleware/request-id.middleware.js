/**
 * @file request-id.middleware.js
 * @module middleware/request-id
 * @description Backward-compatible re-export of request context middleware.
 * Original functionality merged into request-context.middleware.js.
 */

export { requestContextMiddleware as requestIdMiddleware } from './request-context.middleware.js';
export { default } from './request-context.middleware.js';
