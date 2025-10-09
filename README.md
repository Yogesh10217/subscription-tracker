# Subscription Tracker

A Node.js application for managing and tracking user subscriptions, built with Express.js, MongoDB, and integrated with Upstash Workflows for automation and Nodemailer for email notifications.

## Features

- User authentication and authorization
- Subscription management (create, update, delete, view)
- Workflow automation using Upstash
- Email notifications via Nodemailer
- Security middleware with Arcjet
- MongoDB for data storage

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd subscription-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create `.env.development.local` or `.env.production.local` with the required variables (refer to `config/env.js` for details).

4. Start the application:
   - Development: `npm run dev`
   - Production: `npm start`

## Usage

- Register/Login users
- Manage subscriptions through the API endpoints
- Workflows handle automated tasks
- Email notifications are sent for subscription events

## API Endpoints

- Auth: `/api/auth`
- Subscriptions: `/api/subscriptions`
- Users: `/api/users`
- Workflows: `/api/workflows`

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Upstash Workflows
- Nodemailer
- Arcjet for security
- JWT for authentication
- bcryptjs for password hashing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a pull request

## License

This project is private.
