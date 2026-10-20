# Shebora (শেবোরা) — Dhaka Home Services Marketplace

A modern, full-stack, JavaScript-first on-demand home service marketplace tailored for Dhaka, Bangladesh. Shebora connects homeowners and businesses in Dhaka with background-checked, skilled service professionals across 16+ metropolitan zones.

---

## 1. Strict JavaScript Architecture

Shebora is built strictly in **100% JavaScript (`.js` and `.jsx`)** with zero TypeScript files:
- **Backend**: Pure ES Modules (`.js`) running on Express with JWT auth, password hashing, geolocation, and pricing logic.
- **Frontend**: React components, pages, contexts, and hooks written in `.jsx`.
- **Source Ratio**: **>95% `.js` / `.jsx`** across the entire application codebase.

---

## 2. Three Complete User Roles

### 1. Customer
- **Authentication**: Register, sign in with hashed password, maintain Dhaka neighborhood profile.
- **Service Discovery**: Browse verified categories (AC Repair, Plumbing, Electrical, Home Cleaning, Appliance Repair, Painting).
- **Interactive Dhaka Map**: Select exact service building coordinates using draggable OpenStreetMap pins or manual neighborhood selection.
- **Booking Workflow**: Schedule preferred date and time slots, view transparent BDT (৳) pricing breakdowns with no hidden charges.
- **Tracking & Invoices**: Real-time 6-stage lifecycle progress tracker (`Requested` → `Accepted` → `On the Way` → `Arrived` → `In Progress` → `Completed`), printable digital invoices.
- **Quality Assurance**: Submit star reviews on completed services and lodge complaints for prompt admin mediation.

### 2. Service Provider (Technician)
- **Registration & Verification**: Register skill categories, experience years, and upload NID/trade licenses for admin review.
- **Approval Rule**: Technicians **cannot** receive customer booking dispatches until their accounts are approved by the administrator.
- **Job Execution Queue**: Receive nearby job dispatches, accept or decline, update status in real time.
- **Directions & Location**: Direct route navigation links to customer premises via OpenStreetMap and Google Maps.
- **Earnings & Radius**: View BDT earnings (after 10% platform commission) and configure working hours and service coverage radius (3–25 km).

### 3. Administrator
- **Real-Time Analytics**: Gross GMV in BDT, platform revenue, active jobs, customer count, and provider pipeline.
- **Provider Approval Desk**: Review credentials, approve, reject, suspend, or reactivate technicians with full audit logs.
- **Dispute Resolution**: Track customer complaints, record administrative investigation notes, and mark cases resolved.
- **User Governance**: Search user directories and manage roles.
- **Audit Trail**: Real-time log of security, approval, and booking actions.

---

## 3. Interactive Map & Geolocation System

- **Default Center**: Dhaka, Bangladesh (`23.8103° N, 90.4125° E`).
- **Engine**: Leaflet with OpenStreetMap tiles (standard tile usage policy and attribution compliant).
- **Coverage**: Gulshan, Banani, Dhanmondi, Uttara, Mirpur, Mohammadpur, Bashundhara, Baridhara, Badda, Motijheel, Tejgaon, Lalbagh, Khilgaon, and Malibagh.
- **Features**:
  1. Live interactive map showing approved technicians with category-colored pins and ratings.
  2. "Find Services Near Me" feature with polite browser geolocation permission.
  3. Reverse neighborhood matching (`getClosestNeighborhood`).
  4. Fallback manual address entry for users who decline location sharing or when offline.
  5. Distance calculation on backend using the Haversine formula.

---

## 4. Quick Start & Local Development Commands

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm 9+

### Commands for Windows (PowerShell / Command Prompt) & Linux / macOS:

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start development server (serves frontend & backend on port 3000)
npm run dev

# 4. Production build
npm run build

# 5. Production start
npm start
```

---

## 5. Pre-Seeded Demo Accounts (1-Click Switcher)

For instant evaluation, the top navigation bar includes a **1-click Role Switcher**:
- **Customer**: `customer@shebora.bd` (Password: `password123`)
- **Technician**: `provider@shebora.bd` (Password: `password123`)
- **Administrator**: `admin@shebora.bd` (Password: `password123`)

---

## 6. Payment & External Merchant Approvals

- **Cash on Service (COD)**: Fully operational out of the box. Customers inspect the work and pay upon job completion.
- **Digital Payment Gateway**: Interface ready for **SSLCommerz** and **bKash**. To enable live production payment processing, merchant account credentials must be obtained from SSLCommerz or bKash merchant onboarding and configured in `.env`.
