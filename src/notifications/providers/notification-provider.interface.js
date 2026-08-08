/**
 * @file notification-provider.interface.js
 * @module notifications/providers/notification-provider.interface
 * @description Base abstract interface contract for delivery providers.
 */

export class NotificationProviderInterface {
  async send(_notification) {
    throw new Error('Method send() must be implemented');
  }

  async validate(_notification) {
    throw new Error('Method validate() must be implemented');
  }

  async healthCheck() {
    throw new Error('Method healthCheck() must be implemented');
  }
}

export default NotificationProviderInterface;
