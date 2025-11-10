# FuelEU Maritime Compliance Platform

A complete full-stack application for managing ship compliance with EU Regulation 2023/1805 (FuelEU Maritime). Track emissions, compare routes, bank surplus compliance, and create pooling agreements.

---

##  What This Project Does

This platform helps maritime companies:
-  **Track Routes** - Monitor vessel routes with GHG intensity data
-  **Compare Performance** - Compare routes against compliance targets  
-  **Bank Surplus** (Article 20) - Save positive compliance balance for future years
-  **Create Pools** (Article 21) - Share compliance balances between ships

**Live Demo:** [Add your deployed URL]

---

##  Project Structure

```
Marine/
 frontend/           # React + Next.js + TailwindCSS + shadcn/ui
    src/
       core/      # Domain logic (entities, ports)
       adapters/  # API clients & UI components  
       app/       # Next.js pages & routing
    README.md      # Frontend-specific docs

 backend/            # Node.js + TypeScript + PostgreSQL
    src/
       core/      # Business logic (hexagonal architecture)
       adapters/  # Express controllers & PostgreSQL repos
       infrastructure/  # Server & database setup
    README.md      # Backend-specific docs

 AGENT_WORKFLOW.md   # AI development workflow (this doc)
 REFLECTION.md       # Learning & insights from AI usage
 README.md          # Project overview (you are here)
```

---

##  Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 16+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/NishantDX/Marine.git
cd Marine
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your PostgreSQL credentials
npm run db:setup      # Create tables & seed data
npm run dev           # Start on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local  # Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                 # Start on http://localhost:3000
```

### 4. Access the Dashboard
Open http://localhost:3000 and start managing compliance!

---

##  Key Features

### Routes Tab
- View all ship routes with GHG intensity, fuel consumption, distance
- Filter by vessel type, fuel type, year
- Set baseline routes for comparison
- Sortable columns, pagination

### Compare Tab  
- Compare any route against the baseline
- See percentage difference in GHG intensity
- Visual indicators ( compliant /  non-compliant)
- Target: 89.3368 gCOe/MJ (2% below 2025 reference)

### Banking Tab (Article 20)
- View compliance balance (CB) for ships
- Bank positive CB for future use
- Apply banked surplus to deficits
- Transaction history with timestamps

### Pooling Tab (Article 21)
- Select multiple ships to create a pool
- Greedy allocation algorithm (surplus  deficit)
- Validation: pool sum  0, no ship exits worse
- Visual feedback on contributions

---

##  Architecture

### Backend: Hexagonal Architecture
```
core/domain/         Business entities (Route, Ship, Pool)
core/application/    Use cases (BankSurplus, CreatePool)
core/ports/          Interfaces (inbound/outbound)
adapters/            Express controllers + PostgreSQL repos
infrastructure/      Server setup, DB connection
```

**Why Hexagonal?**
- Business logic independent of frameworks
- Easy to test (mock the ports)
- Can swap database or API without touching core

### Frontend: Clean Architecture
```
core/domain/         TypeScript entities
core/ports/          Repository interfaces
adapters/infrastructure/   API clients (fetch calls)
adapters/ui/         React components, hooks, layouts
```

---

##  Technology Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Components:** shadcn/ui (Radix UI primitives)
- **Charts:** Recharts
- **State:** React hooks (useState, useEffect)
- **API Client:** Fetch API

### Backend
- **Runtime:** Node.js 20+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 16
- **ORM:** Raw SQL with pg library
- **Validation:** Custom domain validation

---

##  Development

### Run Tests
```bash
# Backend (when implemented)
cd backend
npm test

# Frontend (when implemented)
cd frontend  
npm test
```

### Build for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Database Management
```bash
cd backend
npm run db:setup    # Run migrations + seed
npm run db:cleanup  # Clean old data
```

---

##  API Endpoints

Full API documentation available in [ackend/README.md](backend/README.md)

**Quick Reference:**
- GET /api/routes - All routes
- POST /api/compliance/cb - Compute compliance balance
- GET /api/compliance/cb-all?year=2025 - All ships' CB
- POST /api/banking/bank - Bank surplus
- POST /api/pools - Create pool

---

##  AI Usage

This project was built with significant AI assistance:

- **Frontend:** v0.dev for UI design, Claude for architecture  
- **Backend:** GitHub Copilot for boilerplate, manual coding for business logic
- **Time Saved:** ~70% (from ~20 hours to ~6 hours)

See [AGENT_WORKFLOW.md](AGENT_WORKFLOW.md) for detailed AI usage log.  
See [REFLECTION.md](REFLECTION.md) for lessons learned.

---

##  Screenshots

[Add screenshots of your dashboard here]

---

##  Contributing

This is an internship project. Contributions welcome after review.

---

##  License

MIT

---

##  Author

Built as part of Marine Compliance Internship Project  
November 2025

---

##  Resources

- [FuelEU Maritime Regulation (EU 2023/1805)](https://eur-lex.europa.eu/eli/reg/2023/1805/oj)
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [AI Workflow Log](AGENT_WORKFLOW.md)
- [Development Reflection](REFLECTION.md)
