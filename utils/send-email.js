import { emailTemplates } from "./email.template.js"; // ensure .js extension
import dayjs from "dayjs";
import transporter, { accountEmail } from "../config/nodeMailer.js";

export const sendReminderEmail = async (to, type, subscription) => {
  if (!to || !type || !subscription) {
    throw new Error("Missing required parameters");
  }

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) {
    throw new Error("Invalid email type");
  }

  // Prepare dynamic content for the email
  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    planName: subscription.planName || subscription.name,
    price: `$${subscription.currency} ${subscription.price} per ${subscription.frequency}`,
    paymentMethod: subscription.paymentMethod,
  };

  // FIXED typo: tyemplate → template
  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
