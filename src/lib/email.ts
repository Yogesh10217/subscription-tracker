import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface RenewalEmailData {
  to: string;
  serviceName: string;
  price: number;
  currency: string;
  frequency: string;
  renewalDate: string;
  daysLeft?: number;
}

export interface TrialExpiryEmailData {
  to: string;
  serviceName: string;
  trialEndDate: string;
  priceAfterTrial: number;
  currency: string;
}

/**
 * Creates and configures the Nodemailer SMTP transporter.
 */
export function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('⚠️ SMTP_USER or SMTP_PASS environment variables are missing.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: user && pass ? { user, pass } : undefined,
  });
}

/**
 * Sends a general email using Nodemailer.
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  const from = process.env.EMAIL_FROM || '"SubPulse Alerts" <noreply@subpulse.com>';
  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html,
    });

    console.log(`✉️ Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Failed to send email via Nodemailer:', error);
    return { success: false, error: error.message || 'Email delivery failed' };
  }
}

/**
 * Sends an official SubPulse Subscription Renewal Reminder Email.
 */
export async function sendRenewalReminderEmail({
  to,
  serviceName,
  price,
  currency,
  frequency,
  renewalDate,
  daysLeft = 3,
}: RenewalEmailData) {
  const formattedDate = new Date(renewalDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const subject = `⏰ Subscription Renewal Alert: ${serviceName} renews in ${daysLeft} days`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #13131b; color: #e4e1ed; margin: 0; padding: 20px; }
          .card { max-width: 520px; margin: 0 auto; background-color: #1f1f27; border: 1px solid #292932; border-radius: 16px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .logo { font-size: 20px; font-weight: bold; color: #ffffff; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
          .accent { color: #8083ff; }
          .badge { display: inline-block; padding: 4px 10px; background-color: rgba(245, 158, 11, 0.15); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 99px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
          .amount-box { background-color: #1b1b23; border: 1px solid #292932; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }
          .amount { font-family: monospace; font-size: 32px; font-weight: bold; color: #ffffff; }
          .details { font-size: 14px; color: #908fa0; line-height: 1.6; }
          .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #292932; font-size: 12px; color: #908fa0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">
            ⚡ SubPulse<span class="accent">Alerts</span>
          </div>
          <div class="badge">⏰ Renewal Due in ${daysLeft} Days</div>
          <h2 style="color: #ffffff; margin-top: 0;">${serviceName} Renewal Alert</h2>
          <p class="details">Your recurring subscription for <strong>${serviceName}</strong> is scheduled for auto-renewal on <strong>${formattedDate}</strong>.</p>
          
          <div class="amount-box">
            <div style="font-size: 12px; color: #908fa0; text-transform: uppercase; margin-bottom: 4px;">Renewal Charge Amount</div>
            <div class="amount">${currency === 'INR' ? '₹' : '$'}${Number(price).toFixed(2)} <span style="font-size: 14px; font-weight: normal; color: #908fa0;">/${frequency}</span></div>
          </div>

          <p class="details">If you no longer use this service, remember to cancel your subscription before <strong>${formattedDate}</strong> to avoid being charged.</p>

          <div class="footer">
            Sent by SubPulse Subscription Intelligence Engine.<br/>
            © ${new Date().getFullYear()} SubPulse Inc. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}
