/**
 * @file subscription-cancelled.template.js
 * @module notifications/templates/subscription-cancelled.template
 * @description Escaped HTML/text template for subscription cancellation notices.
 */

export const renderSubscriptionCancelled = ({ subscriptionName }) => {
  const safeName = String(subscriptionName || 'Subscription')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const title = `Subscription Cancelled: ${safeName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #dc2626;">Subscription Cancelled</h2>
      <p>Your subscription to <strong>${safeName}</strong> has been marked as cancelled in SubPulse.</p>
    </div>
  `;
  const text = `Subscription Cancelled: ${subscriptionName} has been cancelled.`;

  return { title, html, text };
};

export default renderSubscriptionCancelled;
