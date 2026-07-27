# Wrench Wise Command Center

**Business Intelligence & Operations Portal**

A modern Business Intelligence platform built for **Wrench Wise Operations** to monitor business performance using live Zoho Sheet data.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🚀 Features

- **Executive Dashboard**: Real-time business health score (0–100), 14 live financial & candidate KPI cards, interactive Recharts visualizations, and 7 automated summary cards.
- **Revenue Analytics**: Financial breakdown, training course yields, gross quotation vs net contracted revenue tracking, and monthly revenue trends.
- **Sales Executive Intelligence**: Representative performance leaderboards, health scores, conversion rates, performance badges, side-by-side executive comparison tools, and searchable master tables.
- **Learner Analytics**: Candidate search, risk assessment scorecards (Low, Medium, High, Critical), 5-stage lifecycle milestone timeline, payment realization progress gauges, and assigned representative stats.
- **Operations Command Center**: Operational health overview, automated priority action cards, interactive follow-up queue cards, and real-time work queue tables.
- **Reports & Export**: 6 pre-configured business report templates (Executive, Sales, Revenue, Learner, Operations, Receivables), live interactive table previews with multi-column toggles, export history audit log, and instant multi-format downloads (**Excel .xlsx, CSV, PDF, Print**).
- **AI Business Insights**: Dynamic data-driven decision engine featuring CEO 30-second briefings, root cause analysis, and severity-ranked executive risk alerts.
- **Live Zoho Sheet Integration**: Direct ingestion from published live Zoho Sheet CSV stream via CORS proxy with 30-second in-memory caching.
- **Interactive Charts**: Responsive SVG chart visualizations powered by Recharts with high-contrast labels and tooltips.
- **Responsive Design**: Designed for smooth display across `1920px`, `1600px`, `1440px`, `1366px`, `1280px`, and `1024px` viewports.

---

## 🛠️ Tech Stack

- **Next.js**: 14 (App Router)
- **TypeScript**: 5.4 (Strict Type System)
- **React**: 18
- **Tailwind CSS**: 3.4 (White Card Enterprise Design System)
- **Recharts**: 3.10 (SVG Data Visualization)
- **PapaParse**: 5.4 (CSV Engine)
- **Lucide React**: Vector Icon System
- **Vercel**: Production Hosting & Serverless Platform
- **Zoho Public Sheet**: Live Operational Data Stream

---

## 📂 Project Structure

```
wrenchwise-command-center/
├── app/                        # Next.js App Router Page Routes
│   ├── api/zoho/route.ts       # Live Zoho Sheet CORS Proxy API
│   ├── executive/page.tsx      # Executive Dashboard
│   ├── sales-executive/page.tsx # Sales Executive Intelligence
│   ├── operations/page.tsx     # Operations Command Center
│   ├── revenue/page.tsx        # Revenue Analytics
│   ├── learners/page.tsx       # Learner 360° CRM
│   ├── reports/page.tsx        # Reports & Export Center
│   ├── insights/page.tsx       # Decision Intelligence
│   └── globals.css             # Global Enterprise Design System Styles
├── components/                 # Organized UI Components
│   ├── ui/                     # Atomic UI Primitives (Button, Card, Badge)
│   ├── common/                 # Shared Table, Header, Alert & Skeleton Components
│   ├── dashboard/              # Executive Dashboard Cards & Visualizations
│   ├── decision-intelligence/  # Scenario Simulator & CEO Briefings
│   ├── filters/                # Global Filter Toolbar & Selectors
│   ├── insights/               # Business Insight Summary Cards
│   ├── layout/                 # Sidebar Navigation & Header Bar
│   ├── learners/               # Learner 360° CRM Components
│   ├── operations/             # Operations Overview, Priority Queue & Work Queue
│   ├── reports/                # Report Category Cards, Toolbar & Export Engine
│   └── sales-executive/        # Leaderboards, Profiles & Comparison Components
├── context/                    # DataContext & FilterContext State Management
├── hooks/                      # Custom Analytical Hooks (useDashboard, useOperations, etc.)
├── lib/                        # Core Analytical Engines & Calculation Business Logic
├── services/                   # Dedicated External Integration Services (zohoService, etc.)
├── types/                      # Strict Domain Types (types/index.ts)
├── utils/                      # Formatter, Sorting, and Filtering Utilities
├── public/                     # Static Brand Assets (wrenchwise-logo.jpg)
├── .env.example                # Config Template
├── .env.local                  # Local Environment Variables
├── README.md                   # Enterprise Documentation
└── package.json                # Project Dependencies & Scripts
```

---

## 💻 Installation

### 1. Clone Repository
```bash
git clone https://github.com/Mathiarasan64/wrenchwise-command-center.git
cd wrenchwise-command-center
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Build

To generate an optimized production build:
```bash
npm run build
```

To test the production build locally:
```bash
npm run start
```

---

## 🌐 Deployment

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import `wrenchwise-command-center` into [Vercel](https://vercel.com).
3. Vercel automatically detects Next.js 14 and configures the production environment.
4. Add `NEXT_PUBLIC_ZOHO_SHEET_CSV_URL` to Vercel Environment Variables.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Required variables:
```env
NEXT_PUBLIC_ZOHO_SHEET_CSV_URL="https://sheet.zohopublic.in/sheet/publishedsheet/e76b115181d779105a1479b70e57f43bf358190fbae635973df5ab54d68944bf?type=grid&download=csv"
NEXT_PUBLIC_APP_NAME="Wrench Wise Business Intelligence Platform"
NEXT_PUBLIC_COMPANY_NAME="Wrench Wise Operations"
```

---

## 📊 Data Source

The platform connects to a **Live Zoho Public Sheet**:
- **Live Sync**: All dashboard metrics, KPI cards, tables, charts, and report exports are calculated in real time directly from the live Zoho Sheet dataset stream.
- **Caching**: Includes an in-memory 30-second TTL cache to ensure ultra-fast navigation while staying updated.

---

## 📸 Screenshots

| Executive Dashboard | Revenue Analytics |
| :---: | :---: |
| ![Executive Dashboard Placeholder](public/wrenchwise-logo.jpg) | ![Revenue Analytics Placeholder](public/wrenchwise-logo.jpg) |

| Sales Executive Intelligence | Learner Analytics |
| :---: | :---: |
| ![Sales Executive Placeholder](public/wrenchwise-logo.jpg) | ![Learner Analytics Placeholder](public/wrenchwise-logo.jpg) |

| Operations Command Center | Reports & Export Center |
| :---: | :---: |
| ![Operations Placeholder](public/wrenchwise-logo.jpg) | ![Reports Placeholder](public/wrenchwise-logo.jpg) |

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **Historical Trend Analytics**: Multi-month longitudinal performance tracking.
- [ ] **Predictive Revenue Forecasting**: ML-based forecast models for collection realization.
- [ ] **Bi-directional Zoho API Integration**: Direct writeback for operational notes and status updates.
- [ ] **Automated Email Reporting**: Scheduled PDF executive digest distribution.

---

## 🏷️ Repository Metadata Recommendation

- **Repository Name**: `Wrench-Wise-Command-Center`
- **Description**: Business Intelligence & Operations Portal built for Wrench Wise using Next.js, TypeScript and live Zoho Sheet integration.
- **Topics**: `nextjs`, `typescript`, `business-intelligence`, `dashboard`, `analytics`, `zoho`, `recharts`, `tailwindcss`, `react`, `operations-dashboard`

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
