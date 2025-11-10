# Reflection: Building with AI Coding Assistants

## What I Learned

This was my first time using AI tools extensively for a complete project, and honestly, it changed how I think about coding. I used GitHub Copilot throughout the backend development, and while it wasn't perfect, it fundamentally changed my workflow.

### The Good Parts

**Speed is Insane**
What would have taken me 12-14 hours took about 3-4 hours with AI assistance. The difference wasn't in the complexity of the code—it was in eliminating the "thinking about syntax" time. When you know what you want to build but need to Google "how to write a parameterized PostgreSQL query in Node.js," Copilot just... does it. No context switching to Stack Overflow. No wondering if you're using the latest syntax.

**Boilerplate Became Trivial**
I used to hate writing repositories. They're necessary but boring—same CRUD operations, slightly different SQL each time. Copilot generated probably 80% of my repository code. I'd write:

```typescript
// Find ship compliance by ship ID and year
```

And it would autocomplete the entire method with proper parameterization. This alone saved hours.

**Learning by Example**
Copilot showed me patterns I didn't know existed. For instance, I wasn't using TypeScript's `Omit<>` utility type correctly. When generating the repository interfaces, Copilot suggested:

```typescript
create(data: Omit<ShipComplianceProps, 'id'>): Promise<ShipCompliance>
```

I looked it up, understood why that's better than making `id` optional everywhere, and started using that pattern myself. The AI became a teaching tool.

### The Bad Parts

**Domain Logic? Nope.**
This is where AI completely fell apart. The FuelEU compliance formulas are specific to EU regulations:

```typescript
const cbGco2eq = (TARGET_GHG_INTENSITY - actualGHG) * energyInScope;
```

Copilot had zero idea what this should be. It suggested generic formulas that made no sense. I had to read the assignment specs carefully and implement all business logic manually.

**Confidence Without Correctness**
Copilot autocompletes with such confidence that you start trusting it too much. I caught it suggesting `res.send()` when I needed `res.json()` for proper API responses. Small mistake, but if I hadn't tested the endpoint, it would've caused issues later. The lesson: **AI suggestions need the same code review as a junior developer's code.**

**Context Confusion**
Sometimes Copilot would suggest code from completely wrong files. I'd be writing a controller and it would suggest database migration syntax. Or it would import from non-existent files. This happened maybe 20% of the time—enough to be annoying but not deal-breaking.

---

## Efficiency Gains vs Manual Coding

### Time Breakdown

| Task                      | Manual Time     | With AI      | Saved    |
| ------------------------- | --------------- | ------------ | -------- |
| Project setup & structure | 2-3 hours       | 30 min       | **83%**  |
| Domain entities (4 files) | 2 hours         | 45 min       | **63%**  |
| Repositories (4 files)    | 3 hours         | 30 min       | **83%**  |
| Use cases (9 files)       | 2 hours         | 1 hour       | **50%**  |
| Controllers & routes      | 2 hours         | 45 min       | **63%**  |
| Business logic & formulas | 1.5 hours       | 1.5 hours    | **0%**   |
| **Total**                 | **12-14 hours** | **~4 hours** | **~70%** |

The pattern is clear: AI excels at structural code, fails at domain-specific logic.

### Where the Gains Came From

1. **No more context switching** - Didn't need to Google syntax or browse documentation
2. **Faster iteration** - Generated code → test → fix was much quicker than write → test → debug
3. **Consistent patterns** - AI maintained code style better than I do manually
4. **Import management** - Automatic imports saved tons of tiny time taxes

### What Didn't Speed Up

- Understanding requirements (still had to read specs carefully)
- Architectural decisions (AI can't decide if you need a service layer)
- Business logic implementation (formulas, validation rules)
- Debugging complex issues (AI suggests fixes but rarely gets it right)

---

## What I'd Do Differently Next Time

### 1. Start with Better Prompts

I learned that detailed comments produce better code. Instead of:

```typescript
// create user
```

I should write:

```typescript
// Create user with email validation, hash password with bcrypt, and return user without password field
```

The more specific, the better Copilot performs.

### 2. Use AI for Tests

I wrote zero tests because I was focused on functionality. But Copilot is apparently really good at generating test cases. I should have:

- Let AI generate test skeletons for each use case
- Written assertions myself
- Saved hours on test boilerplate

### 3. Combine Tools Better

I only used Copilot's inline autocomplete. I should have used:

- **Copilot Chat** more for architecture questions ("How should I structure a repository pattern?")
- **AI for documentation** (generating JSDoc comments, API docs)
- **AI for migrations** (I wrote SQL manually when Copilot could have helped)

### 4. Trust But Verify

I got burned a few times by accepting suggestions too quickly. Next time:

- Always run tests after accepting AI code
- Read the suggestion before pressing Tab
- Check types (TypeScript helps catch AI mistakes)
- Test edge cases manually (AI doesn't think about null/undefined)

---

## Bigger Lessons

### AI Isn't a Replacement, It's an Accelerator

The mental model I developed: **AI is like a junior developer who knows syntax perfectly but understands zero business context.**

You still need to:

- Design the architecture
- Understand the requirements
- Make trade-off decisions
- Review and test everything

But you spend way less time on mechanical coding tasks.

### The "Autopilot Problem"

There's a danger in using AI too much: you stop thinking about _why_ the code works. I caught myself accepting suggestions without understanding them a few times. This is dangerous for learning.

**My rule now:** If I don't understand what Copilot generated, I research it before accepting. This way I'm learning, not just copying.

### AI Made Me a Better Coder

Surprisingly, using AI improved my skills:

- I wrote better comments (to get better suggestions)
- I thought more about interfaces (AI needs clear contracts)
- I focused more on business logic (less time on syntax)
- I learned new TypeScript patterns by example

---

## Would I Use AI Again?

**Absolutely yes.** But with realistic expectations.

**Use AI for:**

- ✅ Boilerplate code (repos, controllers, routes)
- ✅ SQL queries and type definitions
- ✅ Error handling patterns
- ✅ Test skeleton generation
- ✅ Converting comments to code

**Don't rely on AI for:**

- ❌ Business logic and domain formulas
- ❌ Architectural decisions
- ❌ Understanding product requirements
- ❌ Complex debugging
- ❌ Security-critical code (review VERY carefully)

---

## Final Grade: A-

**Pros:**

- Saved 70% of development time
- Made boring tasks trivial
- Taught me new patterns
- Kept me in flow state (less context switching)

**Cons:**

- Needed constant supervision
- Failed completely on domain logic
- Sometimes confidently wrong
- Can create learning dependency if not careful

**Bottom line:** GitHub Copilot transformed a tedious 2-day project into a 4-hour sprint. But I still had to be the one who understood what needed to be built and why. The AI was the fast typist; I was still the architect.

Would recommend to any developer, but with one warning: Don't let it think for you. Use it to type faster, not think less.

---

**Time:** November 2025  
**Project:** FuelEU Maritime Compliance Backend  
**AI Used:** GitHub Copilot  
**Skill Level:** Intermediate backend developer  
**Experience:** First major project using AI extensively
