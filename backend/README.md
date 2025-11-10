# FuelEU Maritime Compliance Backend

A TypeScript/Node.js backend API for tracking ship compliance with EU Regulation 2023/1805 (FuelEU Maritime). Built with hexagonal architecture and PostgreSQL.

---

## What This Does

This API helps track whether ships comply with EU greenhouse gas intensity regulations. It handles:

- **Route Management** - Track ship routes with GHG intensity data
- **Compliance Balance (CB)** - Calculate if ships are above/below emission targets
- **Banking (Article 20)** - Allow ships to save surplus compliance for future use
- **Pooling (Article 21)** - Let ships share compliance balances (surplus helps deficit)

---

## Tech Stack

- **Runtime:** Node.js 20+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 16
- **Architecture:** Hexagonal (Ports & Adapters)

---

## Architecture Overview

I structured this using **hexagonal architecture** to keep business logic separate from frameworks:

```
src/
├── core/                    # Business logic (framework-independent)
│   ├── domain/             # Entities & value objects
│   │   ├── entities/       # Route, ShipCompliance, BankEntry, Pool
│   │   └── value-objects/  # ComplianceBalance
│   ├── application/        # Use cases (business operations)
│   │   ├── use-cases/      # One file per operation
│   │   └── services/       # Reusable services (pooling algorithm)
│   └── ports/              # Interfaces (contracts)
│       ├── inbound/        # What the app can do
│       └── outbound/       # What the app needs (repos)
│
├── adapters/               # Framework implementations
│   ├── inbound/
│   │   └── http/           # Express controllers & routes
│   └── outbound/
│       └── postgres/       # Database repositories
│
├── infrastructure/         # External services
│   ├── db/                 # Database connection & migrations
│   └── server/             # Express app setup
│
└── shared/                 # Shared utilities
    ├── constants/          # FuelEU regulation values
    ├── types/              # TypeScript types
    └── utils/              # Helper functions
```

**Why Hexagonal?**

- Business logic in `core/` doesn't know about Express or PostgreSQL
- Can swap databases or frameworks without touching business rules
- Easy to test (mock the ports)

---

## Prerequisites

Make sure you have:

- Node.js 20+ installed
- PostgreSQL 16+ installed and running
- Git

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/NishantDX/Marine.git
cd Marine/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the `backend/` folder:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marine_project
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# Server
PORT=5000
NODE_ENV=development
```

**Note:** Replace `your_postgres_username` and `your_postgres_password` with your actual PostgreSQL credentials.

### 4. Create Database

Open pgAdmin or psql and create the database:

```sql
CREATE DATABASE marine_project;
```

Or via command line:

```bash
psql -U postgres -c "CREATE DATABASE marine_project;"
```

### 5. Run Migrations & Seed Data

```bash
npm run db:setup
```

This will:

- Create 5 tables (routes, ship_compliance, bank_entries, pools, pool_members)
- Insert sample route data (R001-R005)
- Insert sample ship compliance data (4 ships)

### 6. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

You should see:

```
============================================================
🚀 FuelEU Maritime Compliance API
============================================================
📍 Server URL: http://localhost:5000
🗄️  Database: marine_project
📅 Environment: development
============================================================

✅ Server is ready to accept connections
```

---

## API Endpoints

### Routes

| Method | Endpoint                                             | Description                            |
| ------ | ---------------------------------------------------- | -------------------------------------- |
| GET    | `/api/routes`                                        | Get all routes (with optional filters) |
| POST   | `/api/routes/:routeId/baseline`                      | Set a route as baseline                |
| GET    | `/api/routes/comparison?baselineId=X&comparisonId=Y` | Compare routes                         |

### Compliance

| Method | Endpoint                                      | Description                           |
| ------ | --------------------------------------------- | ------------------------------------- |
| POST   | `/api/compliance/cb`                          | Compute compliance balance for a ship |
| GET    | `/api/compliance/cb-all?year=YYYY`            | Get all ships' CB for a year          |
| GET    | `/api/compliance/adjusted-cb?shipId=X&year=Y` | Get adjusted CB (after banking)       |

### Banking (Article 20)

| Method | Endpoint                               | Description                     |
| ------ | -------------------------------------- | ------------------------------- |
| POST   | `/api/banking/bank`                    | Bank surplus compliance balance |
| POST   | `/api/banking/apply`                   | Apply banked balance to deficit |
| GET    | `/api/banking/records?shipId=X&year=Y` | Get banking transaction history |

### Pooling (Article 21)

| Method | Endpoint               | Description                         |
| ------ | ---------------------- | ----------------------------------- |
| POST   | `/api/pools`           | Create a pool and allocate balances |
| GET    | `/api/pools?year=YYYY` | Get pools for a year                |

---

## Example API Calls

### Get All Routes

```bash
curl http://localhost:5000/api/routes
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "routeId": "R001",
      "vesselType": "Container",
      "fuelType": "HFO",
      "year": 2024,
      "ghgIntensity": 91.0,
      "isBaseline": false
    }
  ],
  "message": "Routes retrieved successfully"
}
```

### Compute Compliance Balance

```bash
curl -X POST http://localhost:5000/api/compliance/cb \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP001","year":2025}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cbValue": -236071440,
    "shipId": "SHIP001",
    "year": 2025,
    "isHistorical": false
  },
  "message": "Compliance balance computed successfully"
}
```

### Get All Ships for Banking Tab

```bash
curl http://localhost:5000/api/compliance/cb-all?year=2025
```

**Response:**

```json
{
  "success": true,
  "data": {
    "year": 2025,
    "isHistorical": false,
    "ships": [
      {
        "shipId": "SHIP-001",
        "cbValue": 15000.5,
        "hasSurplus": true,
        "hasDeficit": false
      },
      {
        "shipId": "SHIP-002",
        "cbValue": -8500.75,
        "hasSurplus": false,
        "hasDeficit": true
      }
    ]
  }
}
```

### Bank Surplus

```bash
curl -X POST http://localhost:5000/api/banking/bank \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP-003","year":2025,"amount":15000}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cbBefore": 22000.0,
    "applied": 15000,
    "cbAfter": 7000.0
  },
  "message": "Surplus banked successfully"
}
```

### Create a Pool

```bash
curl -X POST http://localhost:5000/api/pools \
  -H "Content-Type: application/json" \
  -d '{"year":2025,"shipIds":["SHIP-001","SHIP-002","SHIP-003"]}'
```

---

## Database Schema

### routes table

- route_id (unique)
- vessel_type, fuel_type, year
- ghg_intensity, fuel_consumption, distance
- is_baseline (boolean)

### ship_compliance table

- ship_id, year (composite unique)
- cb_gco2eq (compliance balance in gCO₂e)

### bank_entries table

- ship_id, year, amount_gco2eq
- positive = banked, negative = applied

### pools table

- pool_id, year

### pool_members table

- pool_id, ship_id
- cb_before, cb_after, contribution

---

## Key Formulas

### Target GHG Intensity (2025)

```
Target = 91.16 × (1 - 0.02) = 89.3368 gCO₂e/MJ
```

### Compliance Balance

```
CB = (Target - Actual GHG Intensity) × Energy in Scope
Energy in Scope = Fuel Consumption (tonnes) × 41,000 MJ/tonne
```

### Percentage Difference

```
% Diff = ((Comparison GHG / Baseline GHG) - 1) × 100
```

---

## Running Tests

(Tests not implemented yet - would use Jest + Supertest)

```bash
npm test
```

---

## Troubleshooting

### Server won't start

**Error:** `ECONNREFUSED` or database connection fails

**Fix:**

1. Make sure PostgreSQL is running
2. Check your `.env` credentials
3. Verify database `marine_project` exists

### Migrations fail

**Error:** `relation "routes" already exists`

**Fix:** Tables already exist. Either:

- Drop and recreate database: `DROP DATABASE marine_project; CREATE DATABASE marine_project;`
- Or skip migrations and just seed: Modify `seed.ts` to only run seed part

### Year validation error

**Error:** `Year must be 2020 or later`

**Fix:** Make sure you're using years 2020-2025 in requests (historical data supported from 2020)

---

## Project Structure Details

### Dependency Flow

```
HTTP Request
  ↓
Controller (adapters/inbound)
  ↓
Use Case (core/application)
  ↓
Repository Interface (core/ports/outbound)
  ↓
Repository Implementation (adapters/outbound)
  ↓
PostgreSQL Database
```

**Key Principle:** Core business logic only depends on interfaces (ports), never on concrete implementations.

---

## Future Improvements

- [ ] Add unit tests for domain entities
- [ ] Add integration tests for API endpoints
- [ ] Implement authentication & authorization
- [ ] Add request validation with Joi or Zod
- [ ] Set up Docker for easy deployment
- [ ] Add API documentation with Swagger
- [ ] Implement caching with Redis
- [ ] Add logging with Winston

---

## License

MIT

---

## Author

Built as part of a maritime compliance internship project.

---

## Questions?

Check `SETUP.md` for detailed setup help or `AGENT_WORKFLOW.md` to see how AI assisted development.
