# FuelEU Maritime Compliance Backend

A comprehensive backend system for managing FuelEU Maritime compliance, implementing **Hexagonal Architecture** (Ports & Adapters) with Node.js, TypeScript, and PostgreSQL.

## 🏗️ Architecture

This project follows **Clean Architecture / Hexagonal Architecture** principles:

```
src/
├── core/                      # Business Logic (Framework-Independent)
│   ├── domain/               # Entities & Value Objects
│   ├── application/          # Use Cases & Services
│   └── ports/                # Interfaces (Contracts)
├── adapters/                 # External World Connections
│   ├── inbound/http/        # Controllers & Routes
│   └── outbound/postgres/   # Database Repositories
├── infrastructure/          # Framework & Server Setup
│   ├── db/                  # Database Connection & Migrations
│   └── server/              # Express App Configuration
└── shared/                  # Common Utilities
    ├── constants/           # FuelEU Constants
    ├── types/               # TypeScript Types
    └── utils/               # Calculation Functions
```

## 🚀 Features

### ✅ Routes Management

- Store and retrieve shipping routes
- Set baseline routes for comparison
- Filter by vessel type, fuel type, and year

### ✅ Compliance Calculation

- Compute Compliance Balance (CB) based on FuelEU formula
- Track surplus and deficit per ship
- Calculate adjusted CB including banked amounts

### ✅ Banking (Article 20)

- Bank positive compliance balance
- Apply banked surplus to deficits
- Track banking history

### ✅ Pooling (Article 21)

- Create pools with multiple ships
- Greedy allocation algorithm
- Validate pooling rules (sum ≥ 0, no ship exits worse)

## 📋 Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+
- **npm** or **yarn**

## 🔧 Installation

### 1. Clone the repository

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=nishant
DB_PASSWORD=Secret#4545
DB_NAME=marine_project
NODE_ENV=development
```

### 4. Setup PostgreSQL Database

```bash
# Create database in PostgreSQL
psql -U nishant -h localhost
CREATE DATABASE marine_project;
\q
```

### 5. Run migrations and seed data

```bash
npm run db:setup
```

This will:

- Create all tables (routes, ship_compliance, bank_entries, pools, pool_members)
- Seed sample routes from assignment (R001-R005)
- Seed sample ship compliance data

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

Server will start at: **http://localhost:5000**

## 📡 API Endpoints

### Routes

```http
GET    /api/routes                    # Get all routes (with filters)
GET    /api/routes/comparison         # Get baseline comparison
POST   /api/routes/:routeId/baseline  # Set route as baseline
```

### Compliance

```http
GET    /api/compliance/cb?shipId=XXX&year=YYYY           # Compute CB
GET    /api/compliance/adjusted-cb?shipId=XXX&year=YYYY  # Get adjusted CB
```

### Banking

```http
GET    /api/banking/records?shipId=XXX&year=YYYY  # Get bank records
POST   /api/banking/bank                          # Bank surplus
POST   /api/banking/apply                         # Apply banked
```

### Pooling

```http
POST   /api/pools        # Create pool
GET    /api/pools?year=YYYY  # Get pools by year
```

## 📊 Sample API Calls

### Get all routes

```bash
curl http://localhost:5000/api/routes
```

### Set baseline

```bash
curl -X POST http://localhost:5000/api/routes/R004/baseline
```

### Compute CB

```bash
curl http://localhost:5000/api/compliance/cb?shipId=SHIP-001&year=2025
```

### Bank surplus

```bash
curl -X POST http://localhost:5000/api/banking/bank \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP-001","year":2025}'
```

### Create pool

```bash
curl -X POST http://localhost:5000/api/pools \
  -H "Content-Type: application/json" \
  -d '{"year":2025,"shipIds":["SHIP-001","SHIP-002"]}'
```

## 🧮 FuelEU Formulas

### Target GHG Intensity (2025)

```
89.3368 gCO₂e/MJ (2% below 91.16)
```

### Compliance Balance

```
CB = (Target - Actual) × Energy in scope
Energy in scope = Fuel consumption (t) × 41,000 MJ/t
```

### Comparison Percentage

```
% Diff = ((Comparison / Baseline) - 1) × 100
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

## 📝 Code Quality

```bash
# Lint
npm run lint

# Format
npm run format
```

## 📁 Project Structure Details

| Layer              | Purpose                    | Dependencies           |
| ------------------ | -------------------------- | ---------------------- |
| **Domain**         | Business entities & rules  | None (pure TypeScript) |
| **Application**    | Use cases & business logic | Domain only            |
| **Ports**          | Interface contracts        | Domain & Application   |
| **Adapters**       | External integrations      | Ports                  |
| **Infrastructure** | Framework setup            | Everything             |

## 🛡️ Design Principles

- ✅ **Dependency Inversion**: Core doesn't depend on frameworks
- ✅ **Single Responsibility**: Each layer has one job
- ✅ **Interface Segregation**: Small, focused interfaces
- ✅ **Separation of Concerns**: Clear boundaries between layers

## 📚 Key Dependencies

| Package      | Purpose               |
| ------------ | --------------------- |
| `express`    | HTTP server framework |
| `pg`         | PostgreSQL client     |
| `typescript` | Type safety           |
| `dotenv`     | Environment variables |
| `cors`       | Cross-origin requests |

## 🐛 Troubleshooting

### Database connection fails

```bash
# Check PostgreSQL is running
pg_isready -U nishant

# Test connection
psql -U nishant -d marine_project -c "SELECT 1"
```

### Port already in use

```bash
# Change PORT in .env file
PORT=3000
```

### TypeScript errors

```bash
# Rebuild
npm run build
```

## 📖 References

- **FuelEU Maritime Regulation**: (EU) 2023/1805
- **Article 20**: Banking mechanism
- **Article 21**: Pooling arrangements
- **Annex IV**: Calculation methodologies

## 👨‍💻 Development

Built with:

- **Hexagonal Architecture** for maintainability
- **TypeScript** for type safety
- **PostgreSQL** for data persistence
- **Express.js** for HTTP layer

## 📄 License

ISC

---

**Made for FuelEU Maritime Compliance Assignment** 🚢
