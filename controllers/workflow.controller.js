import dayjs from 'dayjs';
import { sendReminderEmail } from '../utils/send-email.js';
import Subscription from '../models/subscription.model.js';

export const sendReminders = async (req, res) => {
  try {
    console.log('Received webhook payload:', req.body);
    
    // Handle QStash webhook format
    let subscriptionId;
    if (Array.isArray(req.body) && req.body[0]?.body) {
      // Decode base64 body
      const decodedBody = Buffer.from(req.body[0].body, 'base64').toString();
      console.log('Decoded webhook body:', decodedBody);
      const payload = JSON.parse(decodedBody);
      subscriptionId = payload.subscriptionId;
    } else {
      subscriptionId = req.body.subscriptionId;
    }

    if (!subscriptionId) {
      console.error('No subscriptionId in webhook payload');
      return res.status(400).json({ error: 'Missing subscriptionId' });
    }

    console.log('Fetching subscription:', subscriptionId);
    const subscription = await Subscription.findById(subscriptionId).populate('user', 'email name');
    
    if (!subscription) {
      console.log(`Subscription not found: ${subscriptionId}`);
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    console.log('Found subscription:', {
      id: subscription._id,
      status: subscription.status,
      renewalDate: subscription.renewalDate
    });

    if (subscription.status !== 'Active') {  // Note the capital 'A'
      console.log(`Subscription is not active: ${subscriptionId}, status: ${subscription.status}`);
      return res.status(400).json({ error: 'Inactive subscription' });
    }

    if (!subscription.user?.email) {
      console.log(`No user email found for subscription: ${subscriptionId}`);
      return res.status(400).json({ error: 'No user email found' });
    }

    const renewalDate = dayjs(subscription.renewalDate);
    console.log('Renewal date:', renewalDate.format('YYYY-MM-DD'));
    
    if (renewalDate.isBefore(dayjs())) {
      console.log(`Renewal date has passed for subscription ${subscriptionId}`);
      return res.status(200).json({ message: 'Renewal date passed' });
    }

    // Calculate days until renewal
    const daysUntilRenewal = renewalDate.diff(dayjs(), 'day');
    console.log('Days until renewal:', daysUntilRenewal);

    // Define reminder thresholds
    const reminderThresholds = [30, 7, 5, 2, 1];
    
    // Find the appropriate reminder day
    let reminderDay = reminderThresholds.find(days => daysUntilRenewal >= days);
    if (!reminderDay) {
      console.log('No appropriate reminder threshold found for days:', daysUntilRenewal);
      return res.status(200).json({ message: 'No reminder needed' });
    }

    // Set the reminder type
    const reminderType = `${reminderDay} days before reminder`;
    console.log('Using reminder type:', reminderType);

    // Add daysUntilRenewal to the subscription object for the email template
    subscription.daysLeft = daysUntilRenewal;

    console.log('About to send reminder email with:', {
      email: subscription.user.email,
      type: reminderType,
      subscriptionDetails: {
        name: subscription.name,
        renewalDate: subscription.renewalDate,
        daysLeft: subscription.daysLeft
      }
    });

    await sendReminderEmail(
      subscription.user.email,
      reminderType,
      subscription
    );
    
    console.log('Reminder email sent successfully');
    return res.status(200).json({ 
      success: true,
      message: 'Reminder email sent successfully',
      details: {
        email: subscription.user.email,
        reminderType,
        subscriptionId: subscription._id
      }
    });
  } catch (error) {
    console.error('Error processing reminder:', error);
    if (error.message.includes('email')) {
      return res.status(500).json({ 
        error: 'Failed to send reminder email',
        details: error.message
      });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
