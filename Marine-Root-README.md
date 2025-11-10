# FuelEU Maritime Compliance Platform

A complete full-stack application for managing FuelEU Maritime regulation compliance, featuring route management, emissions comparison, compliance banking (Article 20), and pooling mechanisms (Article 21).

## 📁 Repository Structure

```
Marine/
├── frontend/          # React + Next.js frontend application
├── backend/           # Node.js + Express backend API
├── AGENT_WORKFLOW.md  # AI development workflow documentation
├── REFLECTION.md      # Development reflection and learnings
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **PostgreSQL/MySQL** (as per backend configuration)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

Backend API will be available at `http://localhost:5000`

## 📖 Documentation

- **Frontend Documentation:** [`frontend/README.md`](./frontend/README.md)
- **Backend Documentation:** [`backend/README.md`](./backend/README.md)
- **AI Development Workflow:** [`AGENT_WORKFLOW.md`](./AGENT_WORKFLOW.md)
- **Development Reflection:** [`REFLECTION.md`](./REFLECTION.md)

## ✨ Features

### 🚢 Routes Management

- Track maritime routes with detailed emissions data
- Filter by vessel type, fuel type, and year
- Set baseline routes for compliance comparison
- Sortable tables with pagination

### 📊 Route Comparison

- Compare routes against FuelEU target (89.34 gCO₂e/MJ)
- Visual bar charts showing compliance status
- Color-coded indicators (✅ compliant / ❌ non-compliant)
- Percentage difference calculations

### 🏦 Compliance Banking (Article 20)

- View compliance balance before/after banking
- Bank positive surplus for future years
- Apply banked surplus to current deficits
- Transaction history with timestamps

### 🤝 Pooling Mechanism (Article 21)

- Create compliance pools across multiple ships
- Real-time pool sum validation
- Editable contribution management
- Validation rules enforcement:
  - Pool sum must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot exit negative

## 🛠 Tech Stack

### Frontend

- **Framework:** React 19 + Next.js 16
- **Language:** TypeScript 5.0+
- **Styling:** Tailwind CSS 4
- **Architecture:** Hexagonal (Ports & Adapters)
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL/MySQL
- **ORM:** Prisma/Sequelize
- **Validation:** Express Validator

## 📝 API Endpoints

### Routes

- `GET /api/routes` - Get all routes
- `POST /api/routes/:routeId/baseline` - Set baseline
- `GET /api/routes/comparison` - Compare routes

### Compliance

- `POST /api/compliance/cb` - Compute compliance balance
- `GET /api/compliance/cb-all` - Get all ships' compliance balances

### Banking

- `POST /api/banking/bank` - Bank positive surplus
- `POST /api/banking/apply` - Apply banked surplus
- `GET /api/banking/records` - Get banking transaction history

### Pooling

- `GET /api/pools` - Get all compliance pools
- `POST /api/pools` - Create new compliance pool

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm run test
```

### Backend Tests

```bash
cd backend
npm run test
```

## 🎯 Development Approach

This project was developed using **AI-assisted development** with:

- **v0.dev** - Initial UI design and component generation
- **GitHub Copilot** - Code completion and suggestions
- **Claude Code (Windsurf)** - Architecture design and refactoring

**Time Efficiency:** 90% reduction (20 hours → 2 hours)

See [`AGENT_WORKFLOW.md`](./AGENT_WORKFLOW.md) for detailed AI usage documentation.

## 📊 Project Metrics

- **Total Development Time:** ~2 hours (AI-assisted)
- **Lines of Code:** ~5,000 (frontend + backend)
- **Components:** 15+ React components
- **API Endpoints:** 10+ REST endpoints
- **Features:** 4 major tabs with full functionality

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- **Developer:** Nishant
- **AI Assistants:** v0.dev, GitHub Copilot, Claude Code

## 🙏 Acknowledgments

- **FuelEU Maritime Regulation** - EU emissions standards
- **Hexagonal Architecture** - Clean architecture principles
- **AI Development Tools** - Accelerated development workflow

---

**Built with ❤️ and AI assistance for maritime compliance management**
