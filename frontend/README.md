# FuelEU Maritime Compliance Dashboard

A modern, full-stack maritime compliance platform implementing Fuel EU regulations for routes, compliance balance tracking, banking (Article 20), and pooling (Article 21).

## 🎯 Overview

This frontend dashboard provides ship operators with tools to:

- Track route GHG emissions and set baselines
- Compare routes against compliance targets (89.3368 gCO₂e/MJ)
- Bank positive compliance balance for future use
- Create compliance pools across multiple vessels

**Tech Stack:**

- **Frontend**: React 19 + Next.js 16 + TypeScript
- **Styling**: Tailwind CSS v4
- **Architecture**: Hexagonal (Ports & Adapters)
- **Charts**: Recharts
- **Icons**: Lucide React

## 🏗️ Architecture Summary

### Hexagonal Architecture (Clean Architecture)

```
src/
├── core/                          # Core domain layer (no external dependencies)
│   ├── domain/                    # Entities and business logic
│   │   ├── Route.ts              # Route entity with GHG data
│   │   ├── ComplianceBalance.ts  # CB entity for banking
│   │   ├── Pool.ts               # Pool entity for pooling
│   │   └── Comparison.ts         # Comparison logic
│   ├── application/              # Use cases (currently handled by hooks)
│   └── ports/                    # Repository interfaces
│       ├── IRouteRepository.ts
│       ├── IComplianceRepository.ts
│       ├── IBankingRepository.ts
│       └── IPoolingRepository.ts
├── adapters/
│   ├── infrastructure/           # Outbound adapters (API clients)
│   │   ├── RouteApiClient.ts
│   │   ├── ComplianceApiClient.ts
│   │   ├── BankingApiClient.ts
│   │   └── PoolingApiClient.ts
│   └── ui/                       # Inbound adapters (React UI)
│       ├── components/           # React components
│       │   ├── Dashboard.tsx     # Main dashboard with tabs
│       │   ├── RoutesTab.tsx     # Routes table + filters
│       │   ├── CompareTab.tsx    # Comparison + chart
│       │   ├── BankingTab.tsx    # Banking operations
│       │   ├── PoolingTab.tsx    # Pooling + validation
│       │   ├── Button.tsx        # Shared UI components
│       │   ├── Card.tsx
│       │   ├── Table.tsx
│       │   ├── Input.tsx
│       │   └── Select.tsx
│       └── hooks/                # Custom React hooks
│           ├── useRoutes.ts
│           ├── useComparison.ts
│           ├── useBanking.ts
│           └── usePooling.ts
└── shared/
    └── utils/                    # Shared utilities
        ├── api.ts                # API fetch wrapper
        └── index.ts              # Helper functions
```

### Key Design Principles

1. **Dependency Inversion**: Core domain depends on ports (interfaces), not concrete implementations
2. **Separation of Concerns**: Domain logic, infrastructure, and UI are isolated
3. **Testability**: Each layer can be tested independently
4. **Framework Independence**: Domain logic has no React/UI dependencies

## 📦 Setup & Installation

### Prerequisites

- Node.js 20+ and npm 10+
- Backend API running on `http://localhost:3001` (or configure in `.env.local`)

### Installation Steps

```bash
# Clone the repository
git clone <repository-url>
cd frontend/my-app

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env.local

# Edit .env.local with your API URL
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create `.env.local` in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Access the dashboard at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

## 🧪 Testing

### Run Tests (Coming Soon)

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Manual Testing

1. **Routes Tab**

   - Verify table loads with sample data
   - Test filters (Vessel Type, Fuel Type, Year)
   - Click "Set Baseline" button on a route
   - Confirm button state changes to "Baseline"

2. **Compare Tab**

   - Check target KPI displays: 89.3368 gCO₂e/MJ
   - Verify comparison table shows baseline vs comparison
   - Confirm compliant routes show ✅ (green)
   - Confirm non-compliant routes show ❌ (red)
   - Check bar chart renders correctly

3. **Banking Tab**

   - Verify KPI cards display CB Before/Applied/After
   - Test "Bank Positive CB" (should be disabled if CB ≤ 0)
   - Test "Apply Banked Surplus" modal
   - Enter amount and confirm transaction appears in history

4. **Pooling Tab**
   - Edit contribution values for ships
   - Verify Pool Sum After updates in real-time
   - Check validation errors display when sum < 0
   - Confirm "Create Pool" button disabled when invalid

## 📊 API Endpoints

The frontend expects the following backend endpoints:

### Routes

- `GET /api/routes` - Get all routes
- `POST /api/routes/:routeId/baseline` - Set baseline
- `GET /api/routes/comparison?baselineId=X&comparisonId=Y` - Compare routes

### Compliance

- `POST /api/compliance/cb` - Compute CB
- `GET /api/compliance/adjusted-cb?shipId=X&year=Y` - Get adjusted CB

### Banking

- `POST /api/banking/bank` - Bank surplus
- `POST /api/banking/apply` - Apply banked
- `GET /api/banking/records?shipId=X` - Get records

### Pooling

- `POST /api/pools` - Create pool

### Sample Request/Response

**GET /api/routes**

```json
[
  {
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "HFO",
    "year": 2024,
    "ghgIntensity": 91.0,
    "fuelConsumption": 5000,
    "distance": 12000,
    "totalEmissions": 4500,
    "isBaseline": false
  }
]
```

**POST /api/banking/bank**

Request:

```json
{
  "shipId": "SHIP001",
  "year": 2024,
  "amount": 15.5
}
```

Response:

```json
{
  "cbBefore": 15.5,
  "applied": 15.5,
  "cbAfter": 0.0
}
```

## 🎨 Features

### Routes Tab

- ✅ Filterable table (Vessel Type, Fuel Type, Year)
- ✅ Set baseline functionality
- ✅ Responsive design with mobile support
- ✅ Loading states and error handling

### Compare Tab

- ✅ Target KPI display (89.3368 gCO₂e/MJ)
- ✅ Baseline vs comparison table
- ✅ Percentage difference calculation
- ✅ Compliant/Non-compliant indicators (✅/❌)
- ✅ Bar chart visualization using Recharts

### Banking Tab (Article 20)

- ✅ KPI cards (CB Before, Applied, CB After)
- ✅ Bank Positive CB action
- ✅ Apply Banked Surplus with input validation
- ✅ Transaction history table
- ✅ Disabled states when CB ≤ 0

### Pooling Tab (Article 21)

- ✅ Editable contribution inputs
- ✅ Real-time pool sum calculation
- ✅ Validation with error messages:
  - Pool sum ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot exit negative
- ✅ Color-coded status (green = valid, red = invalid)
- ✅ Disabled "Create Pool" when invalid

### Global Features

- ✅ Dark mode toggle
- ✅ Year selector (2024-2030)
- ✅ Responsive design
- ✅ Loading skeletons
- ✅ Error handling with user feedback

## 📸 Screenshots

### Routes Tab

![Routes Tab - Light Theme](./docs/screenshots/routes-light.png)

### Compare Tab

![Compare Tab with Chart](./docs/screenshots/compare-chart.png)

### Banking Tab

![Banking Tab - KPI Cards](./docs/screenshots/banking-kpis.png)

### Pooling Tab

![Pooling Tab - Validation](./docs/screenshots/pooling-validation.png)

### Dark Mode

![Dashboard - Dark Mode](./docs/screenshots/dark-mode.png)

_(Screenshots pending - run app and capture screens)_

## 🛠️ Development

### Adding a New Feature

1. **Define Domain Entity** in `src/core/domain/`
2. **Create Port Interface** in `src/core/ports/`
3. **Implement Infrastructure Adapter** in `src/adapters/infrastructure/`
4. **Create Custom Hook** in `src/adapters/ui/hooks/`
5. **Build UI Component** in `src/adapters/ui/components/`

### Code Style

- **TypeScript**: Strict mode enabled, no `any` types
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Absolute paths using `@/` alias
- **Components**: Functional components with TypeScript
- **Styling**: Tailwind utility classes

### AI Agent Usage

This project was built using:

- **v0.dev** for UI design generation
- **Claude Code** (Windsurf) for architecture and implementation
- **GitHub Copilot** for code completion

See `AGENT_WORKFLOW.md` for detailed AI usage documentation.

## 📚 Documentation

- `AGENT_WORKFLOW.md` - AI agent usage and prompts
- `REFLECTION.md` - Learnings and efficiency analysis
- `README.md` - This file

## 🐛 Known Issues

1. **Mock Data**: Currently uses hardcoded sample data until backend is connected
2. **Accessibility**: Basic ARIA labels present, full keyboard navigation pending
3. **Testing**: Test suite not yet implemented
4. **Error Boundaries**: Global error boundary not yet added

## 🚧 Roadmap

- [ ] Connect to real backend API
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Implement E2E tests (Playwright)
- [ ] Add error boundary component
- [ ] Implement toast notification system
- [ ] Add data export functionality (CSV/Excel)
- [ ] Implement route pagination
- [ ] Add search functionality
- [ ] Create Storybook for component documentation

## 📄 License

MIT

## 👥 Contributors

- Developer: [Your Name]
- AI Assistants: v0.dev, Claude Code, GitHub Copilot

---

**Built with AI-assisted development** | **90% time reduction** | **Hexagonal Architecture**
