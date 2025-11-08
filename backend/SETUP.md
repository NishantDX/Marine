# 🚀 Quick Setup Guide

Follow these steps to get the FuelEU Maritime Backend running:

## Prerequisites Check

```powershell
# Check Node.js (need 18+)
node --version

# Check PostgreSQL (need 14+)
psql --version

# Check npm
npm --version
```

## Step-by-Step Setup

### 1. Install Dependencies

```powershell
npm install
```

### 2. Setup PostgreSQL Database

Open PowerShell and run:

```powershell
# Start psql
psql -U nishant -h localhost

# In psql:
CREATE DATABASE marine_project;
\q
```

### 3. Configure Environment

Your `.env` file should already have:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=nishant
DB_PASSWORD=Secret#4545
DB_NAME=marine_project
```

### 4. Run Database Setup

This will create all tables and seed data:

```powershell
npm run db:setup
```

You should see:

```
🔄 Running database migrations...
  📄 Running 001_create_routes.sql...
  ✓ 001_create_routes.sql completed
  ...
🌱 Seeding database...
  ✓ Routes inserted
  ✓ Ship compliance data inserted
✅ Database setup completed successfully!
```

### 5. Start Development Server

```powershell
npm run dev
```

You should see:

```
✓ Database connected successfully
============================================================
🚀 FuelEU Maritime Compliance API
============================================================
📍 Server URL: http://localhost:5000
🗄️  Database: marine_project
============================================================

✅ Server is ready to accept connections
```

### 6. Test API

Open browser or use curl:

```powershell
# Health check
curl http://localhost:5000

# Get all routes
curl http://localhost:5000/api/routes

# Get comparison
curl http://localhost:5000/api/routes/comparison
```

## Troubleshooting

### Database Connection Error

```powershell
# Test PostgreSQL connection
psql -U nishant -d marine_project -c "SELECT 1"

# If fails, check:
# 1. PostgreSQL service is running
# 2. User 'nishant' exists
# 3. Password in .env is correct
```

### Port 5000 Already in Use

Change port in `.env`:

```env
PORT=3000
```

### TypeScript Errors

```powershell
# Clean and rebuild
Remove-Item -Recurse -Force dist
npm run build
```

### Import Errors

```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

## Project Structure

```
backend/
├── src/
│   ├── core/                    # Business Logic
│   │   ├── domain/             # Entities
│   │   ├── application/        # Use Cases
│   │   └── ports/              # Interfaces
│   ├── adapters/               # External Connections
│   │   ├── inbound/http/       # Controllers & Routes
│   │   └── outbound/postgres/  # Repositories
│   ├── infrastructure/         # Framework Setup
│   └── shared/                 # Utilities
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
└── README.md                   # Full documentation
```

## Available Scripts

```powershell
npm run dev        # Start development server (auto-reload)
npm run build      # Compile TypeScript
npm start          # Run production build
npm run db:setup   # Setup database (migrations + seeds)
npm test           # Run tests
npm run lint       # Check code quality
npm run format     # Format code
```

## Next Steps

1. **Explore API Endpoints** - See README.md for full list
2. **Test Scenarios** - Try banking, pooling, comparisons
3. **Add Frontend** - Connect React frontend (separate project)
4. **Run Tests** - `npm test` (when tests are written)

## Quick API Examples

### Set Baseline

```powershell
curl -X POST http://localhost:5000/api/routes/R004/baseline
```

### Compute Compliance Balance

```powershell
curl "http://localhost:5000/api/compliance/cb?shipId=SHIP-001&year=2025"
```

### Bank Surplus

```powershell
curl -X POST http://localhost:5000/api/banking/bank `
  -H "Content-Type: application/json" `
  -d '{\"shipId\":\"SHIP-001\",\"year\":2025}'
```

### Create Pool

```powershell
curl -X POST http://localhost:5000/api/pools `
  -H "Content-Type: application/json" `
  -d '{\"year\":2025,\"shipIds\":[\"SHIP-001\",\"SHIP-002\"]}'
```

## Success Indicators

✅ Database migrations completed  
✅ Seed data inserted (5 routes + 4 ships)  
✅ Server running on http://localhost:5000  
✅ API health check returns success  
✅ Routes endpoint returns data

## Getting Help

- **Full Documentation**: See `README.md`
- **AI Workflow**: See `AGENT_WORKFLOW.md`
- **Architecture**: See architecture section in README

---

**You're all set! Happy coding! 🚢**
