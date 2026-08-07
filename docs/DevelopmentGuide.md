# Development Guide — Subscription Tracker (SubPulse)

## Overview
This guide helps new and existing engineers quickly onboard, set up their environment, run the project locally, and understand developer workflows.

---

## 🚀 Quick Onboarding Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas connection URI

### Installation & Execution
```bash
# 1. Clone & Install Dependencies
git clone <repo-url>
cd subscription-tracker
npm install

# 2. Configure Environment Variables
cp .env.development.local .env.local

# 3. Start Development Server
npm run dev
```

The application will start on **http://localhost:5500**.

---

## 🛠️ Key Developer Workflows

### Code Formatting & Linting
Before submitting changes, format and lint all code:
```bash
npm run check        # Runs linting and format verification
npm run lint:fix     # Auto-fixes linting issues
npm run format       # Auto-formats all JS files using Prettier
```

### Running Tests
```bash
npm run test         # Runs full unit and integration test suite
npm run test:coverage# Generates test coverage report
```
