/**
 * @file price-change.template.js
 * @module notifications/templates/price-change.template
 * @description Escaped HTML/text template for price change alerts.
 */

export const renderPriceChange = ({ subscriptionName, oldPrice, newPrice, currency }) => {
  const safeName = String(subscriptionName || 'Subscription')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const diff = Number(newPrice) - Number(oldPrice);
  const direction = diff > 0 ? 'increased' : 'decreased';

  const title = `Price Change Alert: ${safeName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2563eb;">Price Change Alert</h2>
      <p>The price for <strong>${safeName}</strong> has ${direction}.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0;">Previous Price: ${oldPrice} ${currency}</p>
        <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">New Price: ${newPrice} ${currency}</p>
      </div>
    </div>
  `;
  const text = `Price Change Alert: ${subscriptionName} price has ${direction} from ${oldPrice} ${currency} to ${newPrice} ${currency}.`;

  return { title, html, text };
};

export default renderPriceChange;
