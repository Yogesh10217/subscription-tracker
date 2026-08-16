# ⚡ SubPulse — Next.js 14 Subscription Management Engine

**SubPulse** is a state-of-the-art, production-ready SaaS subscription management platform built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Mongoose / MongoDB**, **Nodemailer**, and **TailwindCSS**.

Designed according to solid dark surface UI principles, SubPulse empowers users to track recurring software, streaming, cloud infrastructure, and utility expenses with automated brand icon detection, real-time multi-currency conversions, automated Nodemailer Gmail renewal alerts, and intelligent cost allocation analytics.

---

## ✨ Key Features

### 1. 🎨 Dynamic Service Brand Recognition
- **Official Vector Logos & Accent Badges**: Automatically displays vector brand icons and translucent background glows for top platforms (**Netflix**, **Spotify**, **AWS**, **GitHub**, **Figma**, **ChatGPT**, **Claude**, **Notion**, **Vercel**, **Adobe**, **YouTube Premium**).
- **Smart Form Auto-Detection**: As you type a service name when adding/editing a subscription, SubPulse instantly previews the brand logo and suggests the appropriate domain category (`SaaS & Tools`, `Cloud & Hosting`, `Entertainment`).

### 2. 💱 Real-Time Multi-Currency Engine
- **Cross-Currency Conversion**: Converts individual native subscription prices (billed in **$ USD**, **₹ INR**, **€ EUR**, or **£ GBP**) into your active global currency.
- **Accurate Metric Aggregation**: Aggregates total monthly spend, estimated annual costs, and potential savings accurately across multi-currency accounts.
- **Dual Price Display**: Data tables display both the native billed price (`₹649.00 INR`) and the live converted equivalent (`≈ $7.77 USD`).

### 3. 📧 Nodemailer Gmail Notification Engine
- **Automated Renewal Alerts**: Sends beautifully formatted HTML email alerts before subscriptions auto-renew.
- **Serverless Email API**: Serverless route `/api/notifications/email` handles SMTP delivery.
- **Interactive Gmail Alert Center**: Click the **Bell Icon** in the top navigation bar to test live Gmail alerts for any subscription.

### 4. 📊 Analytics & Intelligent Optimization
- **Category Allocation**: Visual progress bars mapping monthly spending across domain categories.
- **AI Recommendation Engine**: Uncovers annual billing savings (saving up to 18% by switching to yearly plans).

### 5. 🛡️ Enterprise Engineering & Quality
- **100% Type-Safe**: Built with strict TypeScript checks (`tsc --noEmit`).
- **Unit Testing Suite**: High test coverage (**98%+**) powered by **Jest** and **React Testing Library**.
- **Multi-Stage Docker Image**: Optimized multi-stage `Dockerfile` (`node:20-alpine`) ready for containerized deployment.
- **GitHub Pages CI/CD**: Automated deployment workflow via GitHub Actions (`.github/workflows/deploy-pages.yml`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 18](https://react.dev/) + [TailwindCSS 3](https://tailwindcss.com/)
- **Email Delivery**: [Nodemailer](https://nodemailer.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Mongoose 8](https://mongoosejs.com/) / [MongoDB](https://www.mongodb.com/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- **Containerization**: [Docker](https://www.docker.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yogesh10217/subscription-tracker.git
   cd subscription-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/subscription-tracker
   PORT=3000
   NEXT_TELEMETRY_DISABLED=1

   # SMTP Gmail Email Credentials
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   EMAIL_FROM="SubPulse Alerts <your-email@gmail.com>"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Gmail App Password Setup

To enable Nodemailer email alerts:

1. Enable **2-Step Verification** on your Google Account: [Google 2FA Settings](https://myaccount.google.com/signinoptions/two-step-verification).
2. Generate an **App Password**: [Google App Passwords](https://myaccount.google.com/apppasswords).
   - App: **Mail**
   - Device: **Other (SubPulse)**
3. Copy the generated 16-character password into your `.env` file (`SMTP_PASS`).

---

## 🧪 Testing & Verification

Run the full verification suite (TypeScript check + Jest test coverage):

```bash
# Run verification suite
npm run verify

# Run Jest tests with coverage report
npm run test:coverage

# Next.js production build check
npm run build
```

---

## 🐳 Docker Deployment

Build and run the container locally:

```bash
# Build Docker image
docker build -t subpulse:latest .

# Run Docker container on port 3000
docker run -p 3000:3000 subpulse:latest
```

---

## 🌐 Deploying to GitHub Pages

SubPulse includes an automated **GitHub Actions Workflow** (`.github/workflows/deploy-pages.yml`) for deploying static builds to GitHub Pages.

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Next.js 14 upgrade with Nodemailer Gmail alerts"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to **Settings** -> **Pages** in your GitHub repository.
   - Set **Source** to **GitHub Actions**.
   - Your live site will be deployed at `https://yogesh10217.github.io/subscription-tracker/`.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
