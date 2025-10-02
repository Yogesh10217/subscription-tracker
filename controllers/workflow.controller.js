// send-reminders.workflow.js
import { createRequire } from 'module';
import dayjs from 'dayjs';
import { sendReminderEmail } from '../utils/send-email.js';
import Subscription from '../models/subscription.model.js';

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/qstash/nextjs');

const reminderDays = [7, 5, 2, 1]; // Days before renewal to send reminders

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== 'active') {
    console.log(`Subscription is invalid or not active: ${subscriptionId}`);
    return;
  }

  if (!subscription.user?.email) {
    console.log(`No user email found for subscription: ${subscriptionId}`);
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);
  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`);
    return;
  }

  for (const daysBefore of reminderDays) {
    const label = `${daysBefore} days before reminder`;
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    const today = dayjs();

    console.log(
      `[${label}] Reminder Date: ${reminderDate.format('YYYY-MM-DD')} | Today: ${today.format('YYYY-MM-DD')}`
    );

    if (reminderDate.isAfter(today)) {
      await sleepUntilReminder(context, label, reminderDate);
    }

    if (reminderDate.isSame(today, 'day') || reminderDate.isBefore(today)) {
      await triggerReminder(context, label, subscription);
    }
  }
});

// Fetch subscription with populated user
const fetchSubscription = async (context, subscriptionId) => {
  return context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'email name');
  });
};

// Sleep until the reminder date
const sleepUntilReminder = async (context, label, reminderDate) => {
  console.log(`Sleeping until ${label} (${reminderDate.format('YYYY-MM-DD')})`);
  await context.sleepUntil(label, reminderDate.toDate());
};

// Trigger reminder and send email
const triggerReminder = async (context, label, subscription) => {
  return context.run(label, async () => {
    console.log(`Triggering ${label} reminder for ${subscription.user.email}`);
    try {
      await sendReminderEmail(
        subscription.user.email,  // to
        label,                   // type
        subscription            // subscription data
      );
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw error,
      subscription 
    }
  });
}
