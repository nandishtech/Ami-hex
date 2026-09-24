# RESQFOOD — Full-Stack AI Food Rescue Platform
> **“Rescue Food. Route Hope.”**

A production-ready, full-stack AI SaaS platform that connects surplus edible food from commercial donors (restaurants, banquets, supermarkets, tech cafeterias) with verified recipient shelters, soup kitchens, and volunteer EV dispatch drivers in real time.

---

## 🌟 Key Highlights & Signature Interactions

1. **3D Cinematic Opening Experience (`/`)**
   - Human food handoff scene in a dark cinematic 3D environment.
   - Food transforms into glowing particles that morph into a living city rescue network.
   - Mouse parallax, 3D orbit camera, and reduced-motion fallback.

2. **AI Donation Assistant (`/donor`)**
   - Natural language text parsing: *"30 trays of paneer rice and naan, prepared at 6 PM, available until 8 PM"* is autonomously structured into quantities, categories, temperature hold limits, and allergens.
   - Computer vision estimation from kitchen chafing dish photos.
   - Voice donation dictation.
   - Explicit confidence scoring & user verification prior to dispatch.

3. **Intelligent Explainable Matching Engine (`/matching`)**
   - Calculates a 0–100 **Rescue Score** across 5 logistical dimensions:
     - **Urgency (25 pts)**: Time decay analysis based on food perishability.
     - **Distance (25 pts)**: Haversine distance between donor and recipient.
     - **Capacity (20 pts)**: Recipient intake capacity vs. donation volume.
     - **Compatibility (15 pts)**: Shelter dietary requirements and current deficit gaps.
     - **Driver Proximity (15 pts)**: Nearest available driver with sufficient vehicle capacity.
   - **Explainability API** (`GET /api/matches/:id/explanation`): Generates plain-language bullet points answering *"Why this match?"*.
   - **Donation Splitting Optimizer**: If a single shelter cannot absorb 100 KG, algorithm calculates an optimal multi-stop partition (e.g. 40 KG + 35 KG + 25 KG).

4. **Recipient Dynamic Capacity Slider (`/recipient`)**
   - Dragging the intake capacity slider triggers real-time matching recalculation with a signature banner: `MATCHING OPPORTUNITIES UPDATED!`.
   - Current Needs Gaps tracker (e.g. Prepared Meals: Need 40 KG, Received 12 KG, Deficit 28 KG).

5. **Mobile-First Driver App (`/driver`)**
   - Availability toggle (`AVAILABLE`, `ON RESCUE`, `OFFLINE`).
   - 1-tap / swipe rescue acceptance card with large touch targets.
   - Turn-by-turn route navigation with ETA countdown.
   - Dual-custody QR code scan, temperature log (68°C hot-held), and photo verification.

6. **Delivery Handoff & Visual Impact Ripple (`/rescues/[id]`)**
   - Shelter officer handoff confirmation triggers a visual **Impact Ripple** and confetti celebration.
   - Real-time updates across donor, recipient, driver, and municipal dashboards without page reload.
   - Printable & downloadable **Certified Digital Rescue Receipt** with cryptographic audit hash.

7. **Municipal Operations Command Center (`/admin`)**
   - Metropolitan surplus vs. demand heatmap.
   - Critical rescue queue with `<1h` urgency countdown timers.
   - Live cryptographic audit trail stream.

8. **Corporate ESG & Environmental Reporting (`/impact`)**
   - Audited using standard **EPA WARM v15** and ReFED lifecycle emissions factors:
     - $1\text{ KG Food Rescued} \approx 4\text{ Meals Supported}$
     - $1\text{ KG Food Rescued} \approx 2.5\text{ KG }\text{CO}_2\text{e Avoided}$
     - $1\text{ KG Food Rescued} \approx 520\text{ Litres Water Conserved}$
   - Quarterly/monthly filtering and one-click ESG CSV report export.

---

## 🛠 Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (Strict), Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti.
- **3D Graphics**: Three.js WebGL canvas particle systems and interactive spatial networks.
- **Maps & Routing**: Vector Canvas Map abstraction with layer filtering (Donors, Shelters, Drivers, Critical corridors) and animated driver waypoint interpolation.
- **Backend**: Next.js App Router REST API endpoints and service abstraction layer (`server/services`).
- **Database & ORM**: PostgreSQL ready (`prisma/schema.postgresql.prisma`) + zero-config local SQLite default (`dev.db`).
- **Real-Time Engine**: `BroadcastChannel` & Event Bus abstraction for multi-tab and client-server state synchronization.
- **Validation**: Strict TypeScript domain models and Zod schema compatibility.

---

## 🚀 Quick Start Guide

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-org/resqfood.git
cd resqfood

# Install dependencies
npm install
```

### 2. Database Setup & Seed

```bash
# Generate Prisma Client
npm run prisma:generate

# Push database schema (creates local dev.db)
npm run prisma:push

# Populate realistic demo seed data (18 Organizations, 12 Drivers, 30+ Donations)
npm run prisma:seed
```

### 3. Run Automated Tests

```bash
npm test
```
*All 17 core unit and matching engine tests will execute and pass.*

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 End-to-End Demo Walkthrough

Navigate directly to **`/demo`** in the application for an interactive guided walkthrough:

1. **Intake**: Chef Vikram Adiga at GreenFork Restaurant logs *"30 trays of paneer rice and naan, prepared at 6 PM, available until 8 PM"*.
2. **AI Structuring**: AI structures 30 KG (120 meals) with 94% extraction confidence.
3. **AI Matching**: Hope Community Shelter scores **96/100** based on urgency, 3.8 KM distance, available capacity, and driver proximity.
4. **Driver Dispatch**: Rahul Sharma (1.2 KM away in EV Car) accepts via mobile card.
5. **Pickup**: QR scan, 68°C hot-holding check, and GPS timestamp verified.
6. **Live Transit**: Live waypoint animation on map along Old Airport Road.
7. **Delivery Ripple**: Sister Teresa Mathews confirms handoff → visual Impact Ripple triggered (+30 KG, +120 meals, +75 KG CO2e).
8. **Digital Receipt**: Downloadable certified PDF/printable rescue receipt.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/donations` | List donations with optional status/donor filters |
| `POST` | `/api/donations` | Post structured surplus food donation |
| `POST` | `/api/matches` | Calculate candidate recipient matches & Rescue Scores |
| `GET` | `/api/matches/:id/explanation` | Retrieve plain-language matching explainability |
| `GET` | `/api/rescues` | List active and historical rescues |
| `POST` | `/api/rescues` | Dispatch confirmed rescue to recipient and driver |
| `POST` | `/api/rescues/:id/pickup` | Confirm pickup with QR code and location audit |
| `POST` | `/api/rescues/:id/delivery` | Confirm delivery with recipient signature & impact creation |
| `PATCH` | `/api/recipients/:id/capacity` | Update shelter intake capacity and trigger rematching |
| `PATCH` | `/api/drivers/:id/location` | Stream real-time driver GPS coordinates |
| `POST` | `/api/ai/parse` | Parse natural language text into donation parameters |
| `POST` | `/api/ai/analyze-image` | Analyze food image for volume & category estimation |
| `GET` | `/api/impact` | Aggregate global and city-wide impact statistics |
| `GET` | `/api/audit-logs` | Cryptographic chronological audit logs |

---

## 🏛 Clean Architecture Directory Structure

```
├── app/
│   ├── (marketing)/
│   ├── admin/                # City Operations Command Center
│   ├── api/                  # Complete REST API routes
│   │   ├── ai/               # AI NLP, vision, dispatch routes
│   │   ├── audit-logs/       # Audit trail API
│   │   ├── donations/        # Donation intake and CRUD
│   │   ├── drivers/          # Driver fleet & location streaming
│   │   ├── impact/           # ESG & metrics calculation API
│   │   ├── matches/          # Matching engine & explainability API
│   │   ├── notifications/    # Operational alert broadcasts
│   │   ├── recipients/       # Shelter capacity & requests
│   │   └── rescues/          # Full rescue lifecycle & verifications
│   ├── demo/                 # End-to-end interactive guided demo flow
│   ├── developers/           # REST API developer portal & schemas
│   ├── donor/                # Donor dashboard with floating operational KPIs
│   ├── driver/               # Mobile-first driver app with swipe acceptance
│   ├── impact/               # Corporate ESG reporting & CSV export
│   ├── matching/             # AI Matcher & Rescue Score simulation
│   ├── network/              # Metropolitan interactive ecosystem map
│   ├── notifications/        # Live alert notifications
│   ├── recipient/            # Recipient dashboard with capacity slider
│   ├── rescues/              # Active rescues list and live GPS tracking
│   └── settings/             # Organization profile, API keys, webhooks, billing
├── components/
│   ├── 3d/                   # Three.js 3D Opening Experience & Network Spheres
│   ├── admin/                # Command center widgets
│   ├── donor/                # AI donation modal & natural text parser
│   ├── driver/               # Swipe acceptance card & mobile controls
│   ├── maps/                 # Vector canvas map with marker inspection drawer
│   ├── matching/             # Score breakdown meters & explainability cards
│   ├── recipient/            # Reactive capacity slider & need gap meters
│   ├── rescue/               # Live tracking view, QR pickup/delivery modals, receipt
│   └── ui/                   # Navbar, MobileBottomNav, CommandPalette, Badges, Toasts
├── lib/
│   ├── ai/                   # AI provider abstraction (NLP, Vision, Dispatch)
│   ├── auth/                 # RBAC and instant persona switcher
│   ├── db/                   # Prisma client singleton
│   ├── impact/               # EPA WARM impact formula & receipt generator
│   ├── maps/                 # Haversine distance, routes, waypoint interpolator
│   ├── matching/             # Intelligent matching engine & donation splitter
│   ├── realtime/             # Cross-tab BroadcastChannel & event broker
│   ├── safety/               # Perishability thresholds & food safety guidance
│   └── types/                # Domain TypeScript models & API interfaces
├── prisma/
│   ├── schema.prisma         # SQLite development schema
│   └── schema.postgresql.prisma # PostgreSQL cloud production schema
├── scripts/
│   ├── seed.mjs              # Realistic seed data (18 orgs, 12 drivers, 30 donations)
│   ├── test-runner.mjs       # Zero-dependency test runner
│   └── test-suite.mjs        # Full 25-point automated test suite
└── tailwind.config.ts        # Design system colors, shadows, and animations
```

---

## 🛡 Security & Food Safety Disclaimers

- **RBAC & Authorization**: Server-side role validation across `DONOR`, `RECIPIENT`, `DRIVER`, and `ADMIN`. Client-side role claims are never trusted for mutations.
- **Tenant Isolation**: All operations are scoped by `organizationId` to prevent cross-tenant data leakage.
- **Operational Safety Guidance**: RESQFOOD computes dynamic perishable windows (`CRITICAL <1h`, `HIGH 1-2h`, `MEDIUM 2-4h`, `LOW >4h`) for operational routing priority. The platform explicitly advises all donors and recipients to follow applicable municipal public health regulations and does not claim statutory certification.
- **Audit Logs**: Every status transition (posted, matched, accepted, picked up, delivered) generates an immutable audit record with user ID, GPS coordinates, and sensor logs.

---

## 📄 License

MIT License. Designed and built for the RESQFOOD Initiative.
