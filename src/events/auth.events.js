/**
 * @file auth.events.js
 * @module events/auth.events
 * @description Internal decoupled event emitter extension point for authentication lifecycle events.
 */

import { EventEmitter } from 'events';

class AuthEventEmitter extends EventEmitter {}

export const authEvents = new AuthEventEmitter();

export const AUTH_EVENT_TYPES = {
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  PASSWORD_RESET_REQUESTED: 'password.reset_requested',
  PASSWORD_CHANGED: 'password.changed',
  EMAIL_VERIFIED: 'email.verified',
  SESSION_REVOKED: 'session.revoked',
  ACCOUNT_LOCKED: 'account.locked'
};

export default authEvents;
