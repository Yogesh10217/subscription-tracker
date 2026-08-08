/**
 * @file renewal-reminder.template.js
 * @module notifications/templates/renewal-reminder.template
 * @description Escaped HTML/text template for subscription renewal reminders.
 */

export const renderRenewalReminder = ({
  subscriptionName,
  price,
  currency,
  renewalDate,
  daysBefore
}) => {
  const safeName = String(subscriptionName || 'Subscription')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safePrice = String(price || '0');
  const safeCurrency = String(currency || 'USD');
  const safeDate = new Date(renewalDate).toLocaleDateString();

  const title = `Renewal Reminder: ${safeName} in ${daysBefore} Day(s)`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Subscription Renewal Reminder</h2>
      <p>Your subscription to <strong>${safeName}</strong> is scheduled to renew on <strong>${safeDate}</strong>.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px;">Amount: <strong>${safePrice} ${safeCurrency}</strong></p>
      </div>
      <p>Log into SubPulse to manage or cancel your subscription before the renewal date.</p>
    </div>
  `;
  const text = `Renewal Reminder: Your ${subscriptionName} subscription is renewing on ${safeDate} for ${price} ${currency}.`;

  return { title, html, text };
};

export default renderRenewalReminder;
