/**
 * @file subscription-created.template.js
 * @module notifications/templates/subscription-created.template
 * @description Escaped HTML/text template for new subscription creation notices.
 */

export const renderSubscriptionCreated = ({ subscriptionName, price, currency, frequency }) => {
  const safeName = String(subscriptionName || 'Subscription')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const title = `Subscription Added: ${safeName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #16a34a;">Subscription Added</h2>
      <p>You have successfully added <strong>${safeName}</strong> to SubPulse.</p>
      <p>Cost: <strong>${price} ${currency} (${frequency})</strong></p>
    </div>
  `;
  const text = `Subscription Added: ${subscriptionName} added for ${price} ${currency} (${frequency}).`;

  return { title, html, text };
};

export default renderSubscriptionCreated;
