# Reflection on AI Agent Usage

## What I Learned

### 1. AI Agents Excel at Structure, Not Strategy

The most valuable lesson from this assignment was understanding the **division of labor** between AI and human developers:

**AI Strengths:**

- Generating boilerplate code consistently
- Implementing well-known patterns (repository, use case)
- Creating CRUD operations
- Writing SQL schemas with proper constraints

**Human Strengths:**

- Making architectural decisions (why hexagonal over layered?)
- Understanding business domain (what is "banking" in FuelEU context?)
- Validating formulas and calculations
- Catching edge cases (what if pool sum is negative?)

I learned that AI is a **powerful accelerator** but not a replacement for domain knowledge and critical thinking.

---

## Efficiency Gains vs Manual Coding

### Quantitative Gains

**Time Comparison:**

- **Manual Estimate:** 16 hours for complete backend
- **With AI:** ~2 hours (setup + validation + corrections)
- **Time Saved:** 14 hours (87%)

**Code Volume:**

- Generated: ~3,500 lines of production code
- Corrected: ~150 lines (imports, types, edge cases)
- Efficiency: 95% usable code on first generation

### Qualitative Gains

**What I Gained:**

1. **Consistency**
   - All repositories follow identical patterns
   - Controllers have uniform error handling
   - No "style drift" across files

2. **Completeness**
   - AI doesn't forget edge cases in well-known patterns
   - Generated indexes, constraints, comments automatically
   - Included TypeScript types everywhere

3. **Learning Acceleration**
   - Saw hexagonal architecture implemented correctly
   - Learned PostgreSQL transaction patterns
   - Understood dependency injection in practice

**What I Lost:**

1. **Deep Understanding** (Initially)
   - Had to trace through generated code to understand flow
   - Didn't internalize patterns as well as manual coding
   - Required deliberate effort to learn from generated code

2. **Problem-Solving Practice**
   - AI solved structural problems I didn't get to think through
   - Less practice debugging (code mostly worked)

---

## The Reality of AI-Assisted Development

### Myth vs Reality

**Myth:** "AI writes code, you just click accept"
**Reality:** More like "AI generates 90%, you architect and validate 100%"

The process looked like:

1. **Human:** Design architecture (hexagonal, layers, dependencies)
2. **AI:** Generate structure based on design
3. **Human:** Validate business logic, formulas, edge cases
4. **AI:** Implement patterns (repositories, controllers)
5. **Human:** Integrate, test, document

It's not passive; it's **collaborative**.

### Where AI Surprised Me

**Positive Surprises:**

1. **SQL Transactions**

   ```typescript
   await client.query("BEGIN");
   // Clear existing baseline
   await client.query(
     "UPDATE routes SET is_baseline = false WHERE is_baseline = true"
   );
   // Set new baseline
   await client.query(
     "UPDATE routes SET is_baseline = true WHERE route_id = $1",
     [routeId]
   );
   await client.query("COMMIT");
   ```

   AI automatically wrapped this in transaction with rollback—I didn't ask for it!

2. **Greedy Algorithm**
   The pooling allocation service was logically correct on first try:
   - Sort by CB descending
   - Transfer only available surplus
   - Stop when deficit covered

3. **Documentation Comments**
   Generated JSDoc comments were actually helpful:
   ```typescript
   /**
    * Calculate Compliance Balance (CB)
    * Formula: (Target - Actual) × Energy in scope
    * @param actualGhgIntensity - Actual GHG intensity (gCO₂e/MJ)
    */
   ```

**Negative Surprises:**

1. **Import Path Confusion**
   AI sometimes used `../../../../../node_modules/pg` instead of `'pg'`
   Needed manual correction in ~10 files

2. **Missing Business Validation**
   Example: Didn't initially check if CB > 0 before banking
   Had to add:

   ```typescript
   if (!compliance.hasSurplus()) {
     throw new Error("Cannot bank deficit or zero CB");
   }
   ```

3. **Type Annotations**
   Missed adding `any` type to arrow function parameters:

   ```typescript
   // Generated (error):
   result.rows.map((row) => this.mapToEntity(row));

   // Needed:
   result.rows.map((row: any) => this.mapToEntity(row));
   ```

---

## Improvements for Next Time

### 1. Better Prompt Engineering

**Current Approach:**
"Create a RouteRepository with PostgreSQL"

**Improved Approach:**

```
Create a RouteRepository implementing IRouteRepository:
- Use pg client from infrastructure/db/connection
- Implement parameterized queries for SQL injection prevention
- Include filtering by vesselType, fuelType, year
- setAsBaseline should use transaction to ensure only one baseline exists
- Map database rows to Route entities using private mapToEntity method
```

**Lesson:** More specific prompts = better first-pass code

### 2. Incremental Validation

**Current Approach:**

- Generate all 10 use cases
- Validate at the end
- Fix all issues

**Improved Approach:**

- Generate one complete flow (entity → use case → repository → controller)
- Validate immediately
- Use working example as template for rest
- Catch patterns early

**Lesson:** Validate early, template often

### 3. Domain-First, Not Code-First

**Current Mistake:**
Started generating code before fully understanding FuelEU rules

**Better Approach:**

1. Read regulation (EU 2023/1805)
2. Document formulas, constraints, rules
3. Design domain model on paper
4. THEN use AI to implement

**Lesson:** AI codes fast but doesn't understand your domain

### 4. Test-Driven with AI

**Missed Opportunity:**
Could have asked AI to generate tests first:

```
Write Jest tests for BankSurplusUseCase covering:
- Success case: positive CB gets banked
- Error case: cannot bank zero CB
- Error case: cannot bank negative CB
- Verify CB resets to zero after banking
```

Then generate implementation to pass tests.

**Lesson:** AI can do TDD, but you have to ask

### 5. Iterative Refinement

**What Worked:**
"Make this code follow SOLID principles" → AI refactored

**What I'd Do More:**

- Ask AI to review its own code
- Request specific improvements: "Add error handling", "Extract magic numbers"
- Iterate on generated code, not just accept first version

---

## The Real Value of AI in This Project

### Not Just Speed

Yes, I saved 14 hours. But the real value was:

1. **Learning by Example**
   - Saw hexagonal architecture done right
   - Learned PostgreSQL transaction patterns
   - Understood dependency injection

2. **Removing Creative Block**
   - "How do I structure this?" → AI shows a way
   - Not staring at blank files
   - Focus on business logic, not boilerplate

3. **Confidence Building**
   - Validated my architectural decisions (AI generated what I envisioned)
   - Correcting AI code reinforced my understanding
   - Realized I could evaluate code quality objectively

### The Human Role Remains Critical

AI cannot:

- Decide if hexagonal architecture is right for this project
- Understand FuelEU regulation nuances
- Make tradeoffs (consistency vs flexibility)
- Prioritize what to build first

**AI is a senior pair programmer, not a tech lead.**

---

## Final Thoughts

### Before This Assignment

I thought AI would make me "worse" at coding by removing practice.

### After This Assignment

AI makes me **focus on higher-value work**:

- Architecture decisions
- Business logic validation
- User experience
- System integration

The mundane work (repositories, DTOs, boilerplate) is automated.
The creative work (design, strategy, innovation) is amplified.

### The Future I See

**2024:** AI writes repetitive code  
**2025:** AI implements entire features from specs  
**2026:** AI architects systems from business requirements

But in all scenarios, **humans validate, strategize, and own the product**.

---

## Concrete Recommendations

For developers starting with AI agents:

1. **Start Small**
   - Don't generate entire projects
   - Generate one file, understand it, then continue

2. **Validate Everything**
   - AI is confident but not always correct
   - Test generated code
   - Review for business logic errors

3. **Learn from Generated Code**
   - Don't just copy-paste
   - Ask "why did AI do it this way?"
   - Improve your own patterns

4. **Combine Tools**
   - AI for structure
   - Copilot for completion
   - Human for validation
   - Each has its strength

5. **Document Prompts**
   - Good prompts are reusable
   - Build a library of effective prompts
   - Treat prompts like code—version and refine

---

## Conclusion

This assignment proved that AI agents are **transformative tools** for software development, but they amplify human expertise rather than replace it.

**The developer who thrives with AI is not the one who lets AI do everything, but the one who knows:**

- What to ask AI to do
- How to validate what AI produces
- When to override AI decisions
- How to integrate AI output into a coherent system

I'm more productive with AI.  
I'm more strategic with AI.  
I'm more confident with AI.

But I'm still the architect.

---

**Time to value with AI: 87% faster**  
**Learning curve: Steeper than expected**  
**Would I use AI agents again? Absolutely, with refinements**
