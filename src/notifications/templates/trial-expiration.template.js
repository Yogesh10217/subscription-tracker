/**
 * @file trial-expiration.template.js
 * @module notifications/templates/trial-expiration.template
 * @description Escaped HTML/text template for trial expiration notices.
 */

export const renderTrialExpiration = ({ subscriptionName, trialEndDate, price, currency }) => {
  const safeName = String(subscriptionName || 'Subscription')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safeDate = new Date(trialEndDate).toLocaleDateString();

  const title = `Trial Expiration Alert: ${safeName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #d97706;">Trial Expiration Alert</h2>
      <p>Your free trial for <strong>${safeName}</strong> ends on <strong>${safeDate}</strong>.</p>
      <p>Unless cancelled, it will convert to a paid subscription at <strong>${price} ${currency}</strong>.</p>
    </div>
  `;
  const text = `Trial Expiration Alert: Your free trial for ${subscriptionName} ends on ${safeDate}. It will renew at ${price} ${currency}.`;

  return { title, html, text };
};

export default renderTrialExpiration;
