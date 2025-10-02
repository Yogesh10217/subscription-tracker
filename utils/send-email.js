import { emailTemplates } from "./email.template.js"; // ensure .js extension
import dayjs from "dayjs";
import transporter, { accountEmail } from "../config/nodeMailer.js";

export const sendReminderEmail = async (to, type, subscription) => {
  console.log('Attempting to send email:', { to, type });
  
  if (!to || !type || !subscription) {
    console.error('Missing parameters:', { to, type, hasSubscription: !!subscription });
    throw new Error("Missing required parameters");
  }

  try {
    const template = emailTemplates.find((t) => t.label === type);
    console.log('Found template:', template ? 'yes' : 'no');

    if (!template) {
      throw new Error("Invalid email type");
    }

    // Prepare dynamic content for the email
    console.log('Preparing mail info for:', subscription.user.name);
    const mailInfo = {
      userName: subscription.user.name,
      subscriptionName: subscription.name,
      renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
      planName: subscription.planName || subscription.name,
      price: `${subscription.currency} ${subscription.price} per ${subscription.frequency}`,
      paymentMethod: subscription.paymentMethod,
    };

    console.log('Mail info prepared:', mailInfo);
    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  };

  try {
    console.log('Starting email send process...');
    console.log('Email configuration:', {
      from: accountEmail,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHtmlContent: !!mailOptions.html
    });
    
    // Send email using Promise
    console.log('Attempting to send email...');
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error in sendMail:", error);
          console.error("Error details:", {
            code: error.code,
            command: error.command,
            responseCode: error.responseCode,
            response: error.response
          });
          reject(error);
        } else {
          console.log("Raw email response:", info);
          resolve(info);
        }
      });
    });

    console.log("Email sent successfully. Details:", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
  } catch (error) {
    console.error("Failed to send reminder email:", error);
    throw error;
  } 
};