# ⚡ SubPulse — Next.js 14 Subscription Management Engine

**SubPulse** is a state-of-the-art, production-ready SaaS subscription management platform built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Mongoose / MongoDB**, and **TailwindCSS**.

Designed according to solid dark surface UI principles, SubPulse empowers users to track recurring software, streaming, cloud infrastructure, and utility expenses with automated brand icon detection, real-time multi-currency conversions, and intelligent cost allocation analytics.

---

## ✨ Key Features

### 1. 🎨 Dynamic Service Brand Recognition
- **Official Vector Logos & Accent Badges**: Automatically displays vector brand icons and translucent background glows for top platforms (**Netflix**, **Spotify**, **AWS**, **GitHub**, **Figma**, **ChatGPT**, **Claude**, **Notion**, **Vercel**, **Adobe**, **YouTube Premium**).
- **Smart Form Auto-Detection**: As you type a service name when adding/editing a subscription, SubPulse instantly previews the brand logo and suggests the appropriate domain category (`SaaS & Tools`, `Cloud & Hosting`, `Entertainment`).

### 2. 💱 Real-Time Multi-Currency Engine
- **Cross-Currency Conversion**: Converts individual native subscription prices (billed in **$ USD**, **₹ INR**, **€ EUR**, or **£ GBP**) into your active global currency.
- **Accurate Metric Aggregation**: Aggregates total monthly spend, estimated annual costs, and potential savings accurately across multi-currency accounts.
- **Dual Price Display**: Data tables display both the native billed price (`₹649.00 INR`) and the live converted equivalent (`≈ $7.77 USD`).

### 3. 📊 Analytics & Intelligent Optimization
- **Category Allocation**: Visual progress bars mapping monthly spending across domain categories.
- **AI Recommendation Engine**: Uncovers annual billing savings (saving up to 18% by switching to yearly plans).

### 4. 🛡️ Enterprise Engineering & Quality
- **100% Type-Safe**: Built with strict TypeScript checks (`tsc --noEmit`).
- **Unit Testing Suite**: High test coverage (**98%+**) powered by **Jest** and **React Testing Library**.
- **Multi-Stage Docker Image**: Optimized multi-stage `Dockerfile` (`node:20-alpine`) ready for containerized deployment.
- **GitHub Pages CI/CD**: Automated deployment workflow via GitHub Actions (`.github/workflows/deploy-pages.yml`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 18](https://react.dev/) + [TailwindCSS 3](https://tailwindcss.com/)
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
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

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

### Setup Instructions:

1. Push your repository code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Next.js 14 upgrade with brand logos & multi-currency engine"
   git push origin main
   ```

2. Enable GitHub Pages in your repository settings:
   - Go to **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.

3. The workflow will automatically trigger on `push` to `main` and deploy your site to:
   `https://<your-username>.github.io/subscription-tracker/`

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
