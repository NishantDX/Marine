# AI Agent Workflow Log

## Agents Used

**Primary:** GitHub Copilot (VS Code extension)

- Used for autocomplete, generating boilerplate code, and suggesting patterns
- Honestly saved me tons of time on repetitive stuff

**Supplementary:** Copilot Chat

- Asked questions about TypeScript patterns and PostgreSQL queries
- Helped debug a few tricky issues

---

## Development Journey

### Getting Started (Day 1, Morning)

**The Problem:** I needed to build a backend with hexagonal architecture but wasn't 100% sure how to structure everything.

**What I Did:**
I started by asking Copilot Chat:

> "How should I structure a Node.js project with hexagonal architecture for a compliance tracking system?"

**What I Got:**
It suggested this folder structure:

```
src/
  core/
    domain/
    application/
    ports/
  adapters/
  infrastructure/
  shared/
```

**Did it work?** YES! But I had to tweak the `ports` folder to separate `inbound` and `outbound` interfaces myself.

---

### Building Domain Entities (Day 1, Afternoon)

**Example Prompt:**

```typescript
// Route entity with vessel type, fuel type, year validation
```

**Copilot Generated:**

```typescript
export class Route {
  constructor(private props: RouteProps) {
    this.validate();
  }

  private validate(): void {
    if (!this.props.routeId) throw new Error("Route ID required");
    // ... more validation
  }
}
```

**My Edits:**

- Changed year validation from `>= 2025` to `>= 2020` (needed historical data)
- Added `setAsBaseline()` and `removeAsBaseline()` methods manually
- Fixed TypeScript types that Copilot got wrong

**Time Saved:** ~40 minutes on boilerplate. I would've spent way more time writing getters/setters.

---

### PostgreSQL Repositories (Day 1, Evening)

**The Challenge:** Writing SQL queries with proper parameterization.

**My Approach:**
Started typing:

```typescript
async findByShipAndYear(shipId: string, year: number) {
  // Copilot autocompleted the entire query!
}
```

**Copilot Suggested:**

```typescript
const result = await pool.query(
  "SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2",
  [shipId, year]
);
```

**Validation:**

- ✅ Parameterized query (prevents SQL injection)
- ✅ Correct PostgreSQL syntax
- ❌ Forgot to handle null results initially - I added the null check myself

**Observation:** Copilot is REALLY good at SQL queries. Like suspiciously good.

---

### Use Cases & Business Logic (Day 2)

**Where Copilot Helped:**

- Generated the skeleton for all 9 use case files
- Suggested dependency injection pattern
- Auto-imported interfaces

**Where I Had to Step In:**
The FuelEU compliance formulas were assignment-specific:

```typescript
// I wrote this manually - Copilot had no clue about FuelEU regulations
const cbGco2eq = (TARGET_GHG_INTENSITY - actualGHG) * energyInScope;
```

**Lesson Learned:** AI is great for patterns, terrible for domain-specific calculations.

---

### Express Controllers (Day 2)

**Prompt (via comment):**

```typescript
// POST endpoint to compute compliance balance for a ship
```

**Copilot Output:**
Generated the entire controller method with error handling! But it used `res.send()` instead of `res.json()`.

**My Fix:**

```typescript
// Changed from res.send() to res.json() for proper JSON response
res.json({ success: true, data: compliance.toJSON() });
```

**Time Saved:** ~2 hours. Writing REST controllers manually is so tedious.

---

## Corrections & Debugging

### Issue 1: Year Validation Too Strict

**Problem:** Backend rejected year 2024 with "Year must be 2025 or later"

**How I Found It:**

```bash
curl -X POST localhost:5000/api/compliance/cb \
  -d '{"shipId":"SHIP001","year":2024}'
# Got error!
```

**Fix:**

```typescript
// Changed in ShipCompliance.ts
if (props.year < 2020) throw new Error("Year must be 2020 or later");
// Was: if (props.year < 2025)
```

**Copilot's Role:** It generated the strict validation. I had to relax it based on requirements.

---

### Issue 2: Banking Logic Confusion

**Problem:** The `BankSurplus` use case wasn't returning the right response format for the frontend.

**What I Did:**

1. Read the frontend contract specs
2. Manually changed return type from `BankEntry` to custom object:

```typescript
return {
  cbBefore: compliance.cbGco2eq,
  applied: amountToBank,
  cbAfter: compliance.cbGco2eq - amountToBank,
};
```

**Copilot Fail:** It couldn't infer what the frontend needed. I had to design this myself.

---

## Where AI Shined ✨

1. **Boilerplate Code** - Saved me HOURS on:
   - Interface definitions
   - Repository CRUD methods
   - Express route setup
   - TypeScript type definitions

2. **SQL Queries** - Generated perfect parameterized queries every time

3. **Error Handling** - Autocompleted try-catch blocks with proper status codes

4. **Imports** - Auto-imported everything I needed (huge time saver!)

---

## Where AI Failed 😅

1. **Business Logic** - Had zero knowledge of FuelEU regulations or formulas

2. **API Contracts** - Couldn't figure out what exact response format frontend needed

3. **Database Seeds** - Generated test data but with wrong years (2025 instead of 2024/2025 mix)

4. **Context Switching** - Sometimes suggested code from completely wrong files

---

## My Workflow Pattern

Here's what worked best for me:

```
1. Write a comment describing what I need
2. Let Copilot generate the skeleton
3. Review and fix types/logic
4. Test with actual API calls
5. Iterate if needed
```

**Example:**

```typescript
// Repository method to find all routes with optional filters
// ↑ I write this
// ↓ Copilot generates this:
async findAll(filters?: FilterParams): Promise<Route[]> {
  let query = "SELECT * FROM routes WHERE 1=1";
  const params: any[] = [];
  // ... rest of implementation
}
```

Then I'd verify the SQL syntax and add missing edge case handling.

---

## Efficiency Gains

**Estimated Time:**

- **Without AI:** ~12-14 hours
- **With AI:** ~3-4 hours
- **Time Saved:** ~70-75%

**Breakdown:**

- Setup & structure: AI saved 80% (would've googled for hours)
- Domain entities: AI saved 60% (still needed validation logic)
- Repositories: AI saved 85% (SQL autocomplete is magic)
- Controllers: AI saved 70% (still had to match specs)
- Business logic: AI saved 30% (wrote formulas myself)

---

## Best Practices I Followed

1. **Never blindly accepted suggestions** - Always reviewed generated code
2. **Tested everything** - Ran curl commands after each endpoint
3. **Used types extensively** - TypeScript caught AI mistakes
4. **Wrote comments first** - Helped Copilot generate better code
5. **Version control** - Committed frequently to track what AI generated vs what I wrote

---

## Observations

**Copilot is like a junior developer:**

- Great at patterns and syntax
- Needs supervision on business logic
- Sometimes makes stupid mistakes (wrong imports, etc.)
- Learns from your coding style over time

**Best Use Cases:**

- ✅ Boilerplate & repetitive code
- ✅ Converting comments to code
- ✅ Suggesting error handling patterns
- ✅ Writing tests (didn't use this much but it works)

**Worst Use Cases:**

- ❌ Domain-specific calculations
- ❌ Understanding product requirements
- ❌ Complex architectural decisions

---

## What I'd Do Differently Next Time

1. **Start with better comments** - More detailed descriptions = better AI output
2. **Use Copilot for tests** - I wrote tests manually, should've let AI help
3. **Ask more questions in Chat** - I googled a lot when I could've asked Copilot Chat
4. **Set up .copilotignore** - It sometimes read .env files (not great)

---

## Final Thoughts

Using GitHub Copilot felt like pair programming with someone who knows syntax really well but doesn't understand the business. I still had to be the "senior developer" making architectural decisions, but Copilot made implementation WAY faster.

**Would I use it again?** Absolutely. But with realistic expectations.

**Grade:** A- (would be A+ if it understood domain logic better)
