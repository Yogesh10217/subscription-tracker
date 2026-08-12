import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';

export const accountEmail = 'eyogesh104@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: EMAIL_PASSWORD
  },
  // Component 16: Explicit network timeouts
  connectionTimeout: 10000, // 10s connection timeout
  greetingTimeout: 5000, // 5s greeting timeout
  socketTimeout: 15000 // 15s socket timeout
});

export default transporter;
