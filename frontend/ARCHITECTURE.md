# Architecture Diagram - Hexagonal Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                            │
│                     (React Components - UI)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────┐ │
│  │  RoutesTab   │  │  CompareTab  │  │  BankingTab  │  │Pooling │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────┬───┘ │
│         │                 │                  │               │      │
│         ├─────────────────┴──────────────────┴───────────────┤      │
│         │                   CUSTOM HOOKS                     │      │
│         │    (Application Layer - Use Cases)                 │      │
│         │                                                     │      │
│  ┌──────▼─────┐  ┌────────▼─────┐  ┌────────▼────┐  ┌──────▼───┐ │
│  │ useRoutes  │  │useComparison │  │ useBanking  │  │usePooling│ │
│  └──────┬─────┘  └────────┬─────┘  └────────┬────┘  └──────┬───┘ │
│         │                 │                  │               │      │
└─────────┼─────────────────┼──────────────────┼───────────────┼──────┘
          │                 │                  │               │
          │                 │                  │               │
┌─────────┼─────────────────┼──────────────────┼───────────────┼──────┐
│         │                 │   CORE DOMAIN    │               │      │
│         │                 │  (Business Logic)│               │      │
│         │                 │                  │               │      │
│  ┌──────▼─────────────────▼──────────────────▼───────────────▼───┐ │
│  │                      PORT INTERFACES                           │ │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐ │ │
│  │  │IRouteRepository │  │IComplianceRepo   │  │IBankingRepo  │ │ │
│  │  └─────────────────┘  └──────────────────┘  └──────────────┘ │ │
│  │  ┌─────────────────┐                                          │ │
│  │  │IPoolingRepo     │        (Dependency Inversion)            │ │
│  │  └─────────────────┘                                          │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      DOMAIN ENTITIES                           │ │
│  │  ┌─────────┐  ┌──────────────────┐  ┌──────┐  ┌────────────┐ │ │
│  │  │  Route  │  │ComplianceBalance │  │ Pool │  │Comparison  │ │ │
│  │  └─────────┘  └──────────────────┘  └──────┘  └────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
          │                 │                  │               │
          │                 │                  │               │
┌─────────┼─────────────────┼──────────────────┼───────────────┼──────┐
│         │  INFRASTRUCTURE │                  │               │      │
│         │     LAYER       │                  │               │      │
│         │  (Adapters)     │                  │               │      │
│         │                 │                  │               │      │
│  ┌──────▼─────┐  ┌────────▼─────┐  ┌────────▼────┐  ┌──────▼───┐ │
│  │RouteApiCli │  │ComplianceApi │  │BankingApiCli│  │PoolingCli│ │
│  └──────┬─────┘  └────────┬─────┘  └────────┬────┘  └──────┬───┘ │
│         │                 │                  │               │      │
│         └─────────────────┴──────────────────┴───────────────┘      │
│                              │                                       │
│                     ┌────────▼────────┐                             │
│                     │   API WRAPPER   │                             │
│                     │   (apiFetch)    │                             │
│                     └────────┬────────┘                             │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   BACKEND REST API  │
                    │  (http://localhost) │
                    └─────────────────────┘

═══════════════════════════════════════════════════════════════════════

LAYER RESPONSIBILITIES:

1. PRESENTATION LAYER (UI Components)
   - Renders UI
   - Handles user interactions
   - Manages local UI state
   - Calls hooks for business logic

2. APPLICATION LAYER (Custom Hooks)
   - Orchestrates use cases
   - Manages application state
   - Calls domain services
   - Error handling & loading states

3. DOMAIN LAYER (Entities + Ports)
   - Business rules & validation
   - Domain entities (Route, CB, Pool)
   - Port interfaces (contracts)
   - Pure TypeScript (no frameworks)

4. INFRASTRUCTURE LAYER (API Clients)
   - Implements port interfaces
   - Makes HTTP calls
   - Transforms data
   - Handles network errors

═══════════════════════════════════════════════════════════════════════

DEPENDENCY FLOW:

Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑           ↑
 Components     Hooks       Entities    API Clients
     ↓              ↓           ↑           ↑
   React      Use Cases    Validation   HTTP Calls

Key Principle: Domain layer has ZERO dependencies on outer layers
               (React, Next.js, HTTP libraries, etc.)

═══════════════════════════════════════════════════════════════════════

DATA FLOW EXAMPLE (Routes Tab):

1. User clicks "Set Baseline" button
   ↓
2. RoutesTab.tsx calls setBaseline(routeId)
   ↓
3. useRoutes hook receives the call
   ↓
4. Hook calls routeClient.setBaseline(routeId)
   ↓
5. RouteApiClient makes POST /api/routes/:id/baseline
   ↓
6. Backend updates database
   ↓
7. Hook refreshes route list
   ↓
8. Component re-renders with updated data

═══════════════════════════════════════════════════════════════════════
```

## Benefits of This Architecture

### ✅ Testability

- Domain logic can be tested without UI
- Infrastructure can be mocked easily
- Each layer tested independently

### ✅ Maintainability

- Changes to UI don't affect domain
- Can swap React for another framework
- Business rules centralized

### ✅ Flexibility

- Easy to add new features
- Mock API can be swapped for real API
- Multiple UI implementations possible

### ✅ Clarity

- Clear responsibility per layer
- Dependency direction enforced
- Easy to understand flow
