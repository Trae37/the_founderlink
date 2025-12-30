# Assessment Spec (Export for Claude)

This document captures the **current** assessment questionnaire, **decision logic**, **API parameters**, **outputs**, and **persistence/results** as implemented in this repository.

**Goal:** share this with Claude to improve the logic + outputs.

## Source-of-truth files

- `client/src/lib/assessmentData.ts`
  - `assessmentQuestions` (question bank)
  - `determineRoute(responses)` (route + complexity logic)
- `client/src/pages/Assessment.tsx`
  - assessment UI flow, validation, autosave, submission
- `client/src/pages/Results.tsx`
  - reads computed results/responses from `sessionStorage`
  - calls backend for dynamic recommendations
- `server/routers/assessment.ts`
  - tRPC endpoints for saving progress/submissions and generating recommendations
- `server/services/recommendation-engine.ts`
  - `RecommendationEngine` + output shape `TechRecommendation`
- `drizzle/schema.ts`
  - tables: `assessmentResponses`, `assessmentProgress`

---

# 1) Current “Assessment” definition

## 1.1 What the assessment does

- Collects user answers via a multi-section form.
- Computes a **route** recommendation:
  - `"no-code" | "hybrid" | "custom"`
- Computes a **complexity** rating:
  - `"simple" | "standard" | "complex"` (frontend computed)
- Produces:
  - `recommendation: string`
  - `reasoning: string`
- Persists results and raw responses to DB (**best-effort**, UI continues even if DB save fails).
- On the results page, also generates **AI-based tech/team recommendations** via backend.

## 1.2 UI steps / sections

UI uses 9 sections:

- `A` Your Details
- `B` Your Project
- `C` Features
- `D` Timeline & Budget
- `E` Team & Skills
- `F` Extra Details
- `G` Communication
- `H` Ownership
- `I` Success & Risk

---

# 2) Questions (Question bank)

## 2.1 Question object model

From `client/src/lib/assessmentData.ts`:

- `id: number` (note: fractional IDs exist, e.g. `7.5`, `7.6`)
- `section: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I"`
- `question: string`
- `type: "single" | "multiple" | "text" | "number" | "searchable-multi-select"`
- `options?: string[]`
- `categorizedOptions?: { category: string; options: { value: string; tooltip?: string }[] }[]`
- `required: boolean`
- `maxSelections?: number`
- `conditional?: { questionId: number; value: string | string[] }`

## 2.2 Full question list

Below is the question bank **as currently coded**.

### Section A

- **Q1 (single, required)** `Where is your product right now?`
  - Just an idea
  - First version in progress
  - Live with a few users
  - Live and growing fast

- **Q2 (single, required)** `How much can you spend on development in the next 2–3 months?`
  - Under $3,000
  - $3,000–$7,000
  - $7,000–$15,000
  - Over $15,000
  - I'm not sure, I need guidance

- **Q3 (single, required)** `What are you mainly trying to build in this phase?`
  - A simple website or landing page
  - A web app with logins and a dashboard
  - A more complex tool with many screens or steps
  - I'm not sure, please help me decide

- **Q4 (single, required)** `When do you want real users using this?`
  - ASAP / Rush (1-2 months)
  - Standard timeline (2-4 months)
  - Flexible timeline (4-6 months)
  - Long-term (6+ months)
  - No specific timeline

- **Q5 (single, required)** `Are you working alone or with a team?`
  - I'm solo
  - 2–3 people
  - 4 or more people

- **Q6 (single, required)** `How comfortable are you with tech and managing a developer?`
  - Not comfortable at all, I want them to be very independent
  - Somewhat comfortable, I can manage one developer
  - Very comfortable, I can handle a small dev team

### Section B

- **Q7 (text, required)** `In simple words, what problem are you solving and for who?`

- **Q7.5 (single, required)** `What type of product are you building?`
  - Marketplace (connecting buyers/sellers, service providers, freelancers)
  - Business SaaS (CRM, project management, team tools)
  - Communication Platform (chat, video, social network, forums)
  - Fintech/Banking (payments, lending, financial tools)
  - Healthcare/Telemedicine (patient care, booking, health tracking)
  - E-commerce (online store, shopping platform)
  - Education/Learning (courses, LMS, tutoring)
  - Analytics/Data Platform (dashboards, reporting, BI tools)
  - Other (describe below)

- **Q7.6 (text, optional; conditional)** `Describe your product type in more detail`
  - Shown only if Q7.5 == `Other (describe below)`

- **Q8 (multiple, required; max 3)** `What are the 3 most important things your product must do first?`
  - Let people sign up / log in
  - Charge people money (subscriptions or one-time)
  - Show a dashboard with data
  - Send emails or notifications
  - Let users upload or download files
  - Have an admin area for you/your team
  - Something else (type in)

- **Q9 (single, required)** `How many key features do you think your dev needs to build in this phase?`
  - 1–3 simple features
  - 4–7 features
  - More than 7 or almost a full app
  - I'm not sure

- **Q10 (text, required)** `What does 'success in 3 months' look like for you?`

- **Q11 (multiple, required)** `Do you need any of these from day one?`
  - People can pay online (Stripe or similar)
  - A detailed dashboard with charts or stats
  - Things that update live (chat, live feeds, live numbers)
  - A mobile app (iOS / Android)
  - Extra rules for security or privacy (health data, payments, strict laws)
  - None of these

### Section C

- **Q12 (single, required)** `Do you care how the product is built, or do you just want it done well?`
  - I prefer using 'no-code' tools like Bubble or Webflow
  - I prefer 'custom code' (regular coding)
  - I'm open to a mix
  - I don't know, please recommend the best path

- **Q13 (multiple, required)** `Are there any tools or platforms you already have or want to use?`
  - Bubble
  - Webflow
  - Airtable / Supabase / Postgres
  - Stripe
  - Other (type in)
  - None yet

- **Q14 (multiple, required)** `Which things can wait until after your first version is live?`
  - Mobile apps
  - Fancy reports or analytics
  - AI features
  - Support for many languages
  - Large-company security or access rules
  - I want almost everything in version one

### Section D

- **Q15 (single, required)** `What is the main job you want your next developer to do?`
  - Build the first version of my product
  - Fix or improve something that already exists
  - Make the product faster or ready for more users
  - Be my tech partner who guides big decisions

- **Q16 (single, required)** `How do you plan to work with this developer on time?`
  - A few hours per week, over a longer time
  - Like a full-time role (around 40 hours per week)
  - A short project with a clear start and end date
  - I'm not sure yet

- **Q17 (single, required)** `What level of experience are you okay paying for?`
  - Less experienced, cheaper (may need more guidance)
  - Mid-level, a balance of cost and experience
  - Very experienced, more expensive but faster and safer
  - I don't know, please recommend

- **Q18 (single, required)** `Have you hired developers before?`
  - No, this is my first time
  - I've hired 1–2 developers before
  - I've hired full teams before

- **Q19 (single, required)** `Have you ever had a bad experience hiring a dev or agency?`
  - Yes
  - No
  - Mixed

- **Q20 (multiple, required)** `What are you most worried about with your next hire?`
  - Choosing the wrong person or making the wrong hire
  - Spending too much money for too little progress
  - Missing deadlines
  - Poor communication or time-zone issues
  - My idea or code not working

- **Q21 (single, required)** `Do you need the dev to overlap with US working hours?`
  - Yes, at least a few hours each day
  - No, time-zone doesn't matter much
  - Not sure

### Section E

- **Q22 (single, required)** `Which type of developer do you think you need?`
  - Someone who builds in no-code tools (Bubble/Webflow)
  - Someone who codes the front of the app (what users see)
  - Someone who codes the back of the app (data, rules, and servers)
  - Someone who can do 'a bit of everything'
  - I'm not sure, please recommend

- **Q23 (single, required)** `Would you rather start with one person or more than one?`
  - One main developer to start
  - One main developer plus a helper later
  - A small team from day one
  - I'm not sure

- **Q24 (single, required)** `How often can you realistically meet or review work?`
  - 2–3 times per week
  - Once a week
  - Every 2 weeks
  - Once a month or less

- **Q25 (single, required)** `How do you prefer to communicate with your dev?`
  - Short messages (Slack/Discord/WhatsApp)
  - Video calls (Zoom/Meet)
  - Email
  - A mix of these

### Section F

- **Q26 (text, required)** `Describe your product idea in a bit more detail (plain English).`

- **Q27 (searchable-multi-select, required; max 5 per UI copy)** `Select any must-have tools or compliance requirements (max 5).`
  - Categorized options include:
    - Payment processors (Stripe, PayPal, Square, ...)
    - Compliance (HIPAA, GDPR, SOC 2, PCI-DSS, ...)
    - Auth (Auth0, Clerk, ...)
    - Databases/storage (PostgreSQL, MongoDB, ...)
    - AI/ML (OpenAI, Claude, ...)
    - Infrastructure (AWS, Vercel, ...)
    - Analytics, CRM/support, File/CDN, Scheduling, Web3, etc.

- **Q28 (text, required)** `Anything else your developer MUST know before they start?`

### Section G

- **Q29 (single, required)** `What's your preferred communication style with your developer?`
  - Hands-on: Daily check-ins, same-day responses, real-time collaboration (same timezone)
  - Regular: 2-3 updates/week, respond within 24 hours, some timezone overlap
  - Flexible: Weekly updates, respond within 2-3 days, async-friendly (any timezone)
  - Minimal: Updates as needed, respond within a week, fully async

### Section H

- **Q30 (single, required)** `What's your plan for maintaining the product after launch?`
  - I'll maintain it myself → Need detailed docs + video walkthrough
  - I'll hire someone else later → Need basic docs + setup guide
  - Original developer stays on retainer → Minimal docs needed
  - Not sure yet → Standard docs + optional knowledge transfer

### Section I

- **Q31 (text, required)** `What would make you confident this MVP is ready to show your first 10 customers?`

- **Q32 (multiple, required; max 3)** `What's your biggest concern about hiring a developer? (Select up to 3)`
  - Choosing the wrong person or making the wrong hire
  - Going over budget or hidden costs
  - Missing deadlines or slow progress
  - Poor communication or being ghosted
  - My idea or code not working as expected
  - Not being able to assess code quality

---

# 3) Parameters (Inputs)

## 3.1 Frontend state + storage

- User identity:
  - `userName: string` (required before proceeding past section A)
  - `userEmail: string` (required and must include `@`)

- Responses:
  - `responses: Record<number, string | string[] | number>`

Stored as:
- Local autosave:
  - `localStorage["assessment_userEmail"]`
  - `localStorage["assessment_userName"]`
  - `localStorage["assessment_currentStep"]`
  - `localStorage["assessment_responses"]`
- Submission data for results page:
  - `sessionStorage["assessmentResponses"]`
  - `sessionStorage["assessmentResult"]`

## 3.2 Backend APIs (tRPC) — `server/routers/assessment.ts`

### `assessment.saveProgress` (public)

Input:
- `email: string (email)`
- `name?: string`
- `currentStep: number (int >= 0)`
- `responses: Record<string, unknown>`

Output:
- `{ success: true }`

Side effects:
- Upsert into `assessmentProgress` by unique email.

### `assessment.getProgress` (public query)

Input:
- `email: string (email)`

Output:
- `null` OR `{ email, name, currentStep, responses }`

### `assessment.clearProgress` (public)

Input:
- `email: string (email)`

Output:
- `{ success: true }`

### `assessment.saveAssessment` (public)

Input:
- `email: string (email)`
- `name?: string`
- `route: "no-code" | "hybrid" | "custom"`
- `complexity: "low" | "medium" | "high"`
- `devRole?: string`
- `projectType?: string`
- `timeline?: string`
- `budgetRange?: string`
- `topFeatures?: string[]`
- `responses: Record<any>`

Output:
- `{ success: true }`

### `assessment.generateRecommendations` (public)

Input:
- `route: "no-code" | "hybrid" | "custom"`
- `responses: Record<any>`

Output:
- `TechRecommendation` (see Outputs)

### `assessment.submitReport` (public)

Input:
- `email: string (email)`
- `score: number (int >= 0)`
- `maxScore: number (int > 0)`
- `fitType: "PERFECT NOCODE" | "VIABLE" | "CUSTOM NEEDED"`
- `message: string`
- `cta: string`

Output:
- `{ success: boolean; message: string }`

### `assessment.getAll` (protected; admin)

Output:
- Rows from `assessmentResponses` ordered by `completedAt DESC`

---

# 4) Outputs (What gets produced)

## 4.1 Immediate computed result (frontend)

From `client/src/lib/assessmentData.ts`:

```ts
export interface RouteResult {
  route: "no-code" | "hybrid" | "custom";
  complexity: "simple" | "standard" | "complex";
  recommendation: string;
  reasoning: string;
}
```

Stored to `sessionStorage` under `assessmentResult`.

## 4.2 AI recommendations (backend)

From `server/services/recommendation-engine.ts`:

```ts
export interface TechRecommendation {
  route: "no-code" | "hybrid" | "custom";
  stackDescription: string;
  developerType: string;
  reasoning: string;
  routeReasoning?: string;
  complexityAnalysis?: ComplexityAnalysis;
  teamBreakdown?: TeamMemberRecommendation[];
  teamSize?: number;
}
```

Team breakdown entries:

```ts
export interface TeamMemberRecommendation {
  role: string;
  level: "junior" | "mid" | "senior";
  responsibilities: string[];
  whyNeeded: string;
}
```

---

# 5) Current scoring / decision logic

## 5.1 Route decision: `determineRoute(responses)`

### Inputs used for route

- Q2 budget
- Q3 build type
- Q9 feature count
- Q11 day-one needs (realtime / compliance / mobile)
- Q12 build preference

### No-code score calculation (high level)

- Budget:
  - Under $3k or $3k–$7k => +4
  - $7k–$15k => +2
- Product type (Q3):
  - simple website or web app w/logins => +4
  - complex tool => +1
- Feature count (Q9):
  - 1–3 => +4
  - 4–7 => +2
  - >7 => -3
- Day-one needs (Q11):
  - realtime OR compliance => -5
  - mobile app => -5
- Build preference (Q12):
  - prefers no-code => +3
  - prefers custom => -3

### Route thresholds

- `noCodeScore >= 10` => `route = "no-code"`
- `noCodeScore >= 5` => `route = "hybrid"`
- else => `route = "custom"`

## 5.2 Complexity decision

### Inputs used

- Base from Q9 feature count
- Budget adds signal
- Day-one needs adds signal (mobile/realtime/compliance/payments)
- Q27 “must-have tools” adds signal if it includes compliance/AI/advanced features
- Q26 + Q28 free text keyword scan adds signal (max +2)

### Complexity mapping

- `complexityScore <= 2` => `"simple"`
- `complexityScore >= 5` => `"complex"`
- else => `"standard"`

---

# 6) Persistence / Results storage

## 6.1 Tables (from `drizzle/schema.ts`)

### `assessmentProgress`

- `email` (unique)
- `name`
- `currentStep`
- `responses` (JSON text)
- timestamps

### `assessmentResponses`

- identity: `email`, `name`
- result fields:
  - `route: [no-code|hybrid|custom]`
  - `complexity: [low|medium|high]` (DB enum)
  - `devRole`, `projectType`, `timeline`, `budgetRange`, `topFeatures`
- raw:
  - `responses` (JSON text)
- tracking:
  - `completedAt`, `webhookSent`, `eventType`, `stripeSessionId`, timestamps

---

# 7) Known issues / mismatches (important for improving logic)

## 7.1 Complexity enum mismatch (likely causes DB save failures)

- Frontend `RouteResult.complexity` is: `simple | standard | complex`
- Backend `saveAssessment` expects: `low | medium | high`
- `Assessment.tsx` currently submits `complexity: result.complexity`.

This likely triggers validation errors on `saveAssessment`.

The UI catches DB errors and proceeds, which means you can see results in the UI but **no DB record**.

**Suggested fix:** map:
- `simple -> low`
- `standard -> medium`
- `complex -> high`

## 7.2 Question IDs as numbers (fractional IDs)

IDs like `7.5` and `7.6` are used as object keys. When persisted to JSON, keys become strings. This is fine but can be confusing across layers and for typed systems.

## 7.3 Two different scoring systems exist

There is also `client/src/lib/scoring.ts` that implements a different scoring model (`calculateScores`) and PDF content generation. It appears unused by the current assessment flow.

---

# 8) What to improve (prompt ideas for Claude)

- Normalize/standardize:
  - complexity levels
  - route/complexity explanations
  - topFeatures extraction + mapping to DB
- Make outputs more structured for downstream use:
  - add a stable schema for results (route, complexity, confidence, key drivers)
  - return “drivers” list: which answers caused penalties/boosts
- Reduce brittle string comparisons (exact option strings) by adding stable option IDs.
- Add tests for `determineRoute()`.

---

# Appendix A) Recommended JSON schema for Claude to propose

If you want Claude to propose a new output contract, suggest something like:

```json
{
  "route": "no-code|hybrid|custom",
  "complexity": "low|medium|high",
  "confidence": 0.0,
  "drivers": [
    { "signal": "budget", "effect": "+4", "evidence": "Under $7k" },
    { "signal": "day_one_mobile", "effect": "-5", "evidence": "Mobile app" }
  ],
  "recommendations": {
    "summary": "...",
    "team": [ ... ],
    "stack": { ... }
  }
}
```
