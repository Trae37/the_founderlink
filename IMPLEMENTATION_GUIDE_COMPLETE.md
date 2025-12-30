# Complete Implementation Guide: Vertical Templates & Product Categories

> **Purpose:** This comprehensive guide provides everything the implementation assistant needs to add detailed product categories to the assessment system, create vertical-specific templates for the free tier, and connect them to the MVP knowledge base for better cost estimates and document generation.

---

## Table of Contents

### Part 1: Overview & Analysis
1. [Problem Statement](#problem-statement)
2. [Current Assessment Questions Reference](#current-assessment-questions-reference)
3. [Current State Analysis](#current-state-analysis)
4. [Target State](#target-state)
5. [Data Flow Architecture](#data-flow-architecture)

### Part 2: Implementation Specification
6. [Template System Specification](#template-system-specification)
7. [Results.tsx Integration Spec](#resultstsx-integration-spec)
8. [Default Template for "Other"](#default-template-for-other)
9. [Template Lookup Logic](#template-lookup-logic)

### Part 3: Implementation Tasks
10. [Task 1: Update Assessment Questions](#task-1-update-assessment-question-data)
11. [Task 2: Update Route Determination](#task-2-update-route-determination-logic)
12. [Task 3: Update Category Validator](#task-3-update-category-validator)
13. [Task 4: Update MVP Category Mapper](#task-4-update-mvp-category-mapper)
14. [Task 5: Update PRD Generator](#task-5-update-prd-generator-for-vertical-specific-guidance)
15. [Task 6: Update Hiring Playbook](#task-6-update-hiring-playbook-for-vertical-specific-skills)
16. [Task 7: Fix Complexity Enum](#task-7-fix-complexity-enum-mismatch)
17. [Task 8: Update Tests](#task-8-update-tests)
18. [Task 9: Migration Mapping](#task-9-migration-mapping-for-old-q2-values)

### Part 4: Vertical Templates
19. [Marketplace Template](#1-marketplace)
20. [Business SaaS Template](#2-business-saas)
21. [Communication Platform Template](#3-communication-platform)
22. [Fintech/Banking Template](#4-fintechbanking)
23. [Healthcare/Telemedicine Template](#5-healthcaretelemedicine)
24. [E-commerce Template](#6-e-commerce)
25. [Education/Learning Template](#7-educationlearning)
26. [Analytics/Data Platform Template](#8-analyticsdata-platform)
27. [Internal Tool Template](#9-internal-tool)
28. [API/Backend Service Template](#10-apibackend-service)
29. [Future Verticals](#future-verticals)

### Part 5: Reference & Appendices
30. [File Reference](#file-reference)
31. [Testing Checklist](#testing-checklist)
32. [Design Decisions Made](#design-decisions-made)
33. [Appendix A: 2025 Pricing Research](#appendix-a-2025-pricing-research)
34. [Appendix B: MVP Knowledge Base Categories](#appendix-b-mvp-knowledge-base-categories)
35. [Appendix C: Document Output Structures](#appendix-c-document-output-structures)

---

# Part 1: Overview & Analysis

---

## Problem Statement

### The Gap

The assessment currently asks users a **simple product type question (Q2)** with 8 generic options:

```
Web application (SaaS, dashboard, portal)
Mobile app
Marketplace (two-sided)
E-commerce
Internal tool
Browser extension
API / Backend service
Other
```

However, the system has a **750KB MVP knowledge base** (`shared/mvp-knowledge-base.json`) with 50 detailed MVP types organized into 5 categories, AND a **detailed product type mapper** (`shared/mvp-category-mapper.ts`) with 9 industry-specific categories that are **NOT connected** to the assessment.

### Why This Matters

1. **Cost estimates are less accurate** - The MVP matcher can't filter by category effectively
2. **Document generation is generic** - PRD/Clarity Brief don't include vertical-specific guidance
3. **Route determination misses compliance signals** - Fintech/Healthcare should bias toward custom development
4. **Free tier requires AI** - No templates exist for free users
5. **The detailed categories already exist** - They're just not wired up

---

## Current Assessment Questions Reference

**File:** `client/src/lib/assessmentData.ts`

The assessment has 15 questions across 4 sections:

### Section A: Product Basics

#### Q1: What stage is your product at?
**Type:** Single select | **Required:** Yes

| Option |
|--------|
| Have customer interviews (clear pain point) |
| Have a waitlist or early customers |
| Have designs/mockups |
| Have a prototype |
| Live product (needs rebuild/features) |

---

#### Q2: What type of product are you building? *(TO BE UPDATED)*
**Type:** Single select | **Required:** Yes

**CURRENT OPTIONS (Simple):**
| Option |
|--------|
| Web application (SaaS, dashboard, portal) |
| Mobile app |
| Marketplace (two-sided) |
| E-commerce |
| Internal tool |
| Browser extension |
| API / Backend service |
| Other |

**TARGET OPTIONS (Detailed) - 10 options:**

> **Note:** "Mobile app" removed as standalone option because Q3 already captures platform (Web/Mobile/Both). Mobile is a delivery platform, not a product type.

| Option | Maps to MVP Knowledge Base Category |
|--------|-------------------------------------|
| Marketplace (connecting buyers/sellers, service providers, freelancers) | Marketplaces & Platforms |
| Business SaaS (CRM, project management, team tools) | Core Business SaaS |
| Communication Platform (chat, video, social network, forums) | Communication & Social |
| Fintech/Banking (payments, lending, financial tools) | Vertical-Specific SaaS |
| Healthcare/Telemedicine (patient care, booking, health tracking) | Vertical-Specific SaaS |
| E-commerce (online store, shopping platform) | Marketplaces & Platforms, Core Business SaaS |
| Education/Learning (courses, LMS, tutoring) | Vertical-Specific SaaS, Marketplaces & Platforms |
| Analytics/Data Platform (dashboards, reporting, BI tools) | Technical & Developer Tools, Core Business SaaS |
| Internal tool (ops dashboard, admin panel) | Core Business SaaS |
| API / Backend service | Technical & Developer Tools |
| Other (describe below) | (searches all categories) |

---

#### Q3: What platform(s) do you need?
**Type:** Single select | **Required:** Yes

| Option |
|--------|
| Web only |
| Mobile only (iOS, Android, or both) |
| Web + Mobile |
| Not sure yet |

---

### Section B: Features

#### Q4: What are the 3-5 core features your MVP must have?
**Type:** Searchable multi-select | **Required:** Yes | **Max selections:** 5

**Feature Categories:**

| Category | Available Features |
|----------|-------------------|
| **Auth & Accounts** | Email/password login, Magic link / passwordless login, Social login (Google/Apple/etc.), Password reset, Email verification, User profiles, Teams / workspaces, Roles & permissions |
| **Billing & Monetization** | One-time payments, Subscriptions, Free trial, Usage-based billing, Checkout / paywall, Invoices / receipts, Discount codes, Cancellations / refunds |
| **Core Product (SaaS)** | Dashboard / home, Settings, Search + filters, Data import, Data export, Audit logs, Activity feed, Feature flags |
| **Collaboration** | Comments + @mentions, In-app chat, Shared workspaces, Invites + member management, Approvals / review flows, Version history, In-app notifications, Email notifications |
| **Admin & Analytics** | Admin dashboard, User management, Role management, Analytics dashboard, Reports, Support / ticketing tools, Admin impersonation |
| **Files & Content** | File uploads, Rich text editor, Document viewer, Templates, Content moderation, Public sharing links |
| **Integrations & API** | Third-party integrations, OAuth integrations, API keys, Public API, Incoming webhooks, Outgoing webhooks, Zapier integration, Slack integration |

---

#### Q5: Which of these does your MVP need on day one?
**Type:** Multi-select | **Required:** Yes

| Option | Impact on Route/Complexity |
|--------|---------------------------|
| Payments / subscriptions | +1 complexity |
| User authentication (login/signup) | +1 complexity |
| Real-time features (chat, notifications, live updates) | +2 complexity, forces `custom` route |
| Mobile app (native or PWA) | +2 complexity, forces `custom` route |
| Compliance (HIPAA, SOC2, GDPR, PCI) | +2 complexity, forces `custom` route |
| Third-party integrations | +1 complexity, -2 no-code score |
| Admin dashboard | +1 complexity |
| None of these | (no impact) |

---

### Section C: Budget, Timeline & Preferences

#### Q6: What's your budget for the initial build?
**Type:** Single select | **Required:** Yes

| Option | Impact on No-Code Score |
|--------|------------------------|
| Under $5,000 | +3 |
| $5,000 - $10,000 | +3 |
| $10,000 - $20,000 | +2 |
| $20,000 - $40,000 | +1 |
| $40,000 - $75,000 | 0 |
| Over $75,000 | 0 |
| Not sure yet | 0 |

---

#### Q7: When do you need the MVP launched?
**Type:** Single select | **Required:** Yes

| Option | Cost Multiplier |
|--------|----------------|
| ASAP (1-2 months) | 1.375x (+37.5% rush premium) |
| Standard (3-4 months) | 1.0x (baseline) |
| Flexible (5+ months) | 0.85x (-15% discount) |
| Not sure yet | 1.0x |

---

#### Q8: Do you have a preference for how it's built?
**Type:** Single select | **Required:** Yes

| Option | Impact on No-Code Score |
|--------|------------------------|
| No-code / low-code (Bubble, Webflow, etc.) | +3 |
| Custom code | -3 |
| Open to either (recommend what's best) | 0 |
| Not sure | 0 |

---

#### Q9-Q15: Additional Questions

- **Q9:** Comfort managing developers (single select)
- **Q10:** Previous hiring experience (single select)
- **Q11:** Timezone requirements (single select)
- **Q12:** Project description (text - problem/solution)
- **Q13:** Success criteria (text - goal/metric)
- **Q14:** Integration requirements (multi-select)
- **Q15:** Contact details (structured text)

---

### Route Determination Logic Summary

**No-Code Score Factors:**
| Factor | Score Impact |
|--------|-------------|
| Budget under $10K | +3 |
| Budget $10K-$20K | +2 |
| Budget $20K-$40K | +1 |
| Web only platform | +3 |
| No-code preference | +3 |
| Custom code preference | -3 |
| Real-time features | -4 |
| Compliance requirements | -5 |
| Mobile requirement | -5 |
| Third-party integrations | -2 |

**Route Assignment:**
| Condition | Route |
|-----------|-------|
| Has compliance OR mobile requirement | `custom` |
| Has real-time features | `custom` |
| No-code score >= 7 | `no-code` |
| No-code score >= 3 | `hybrid` |
| Otherwise | `custom` |

**Complexity Assignment:**
| Score | Complexity |
|-------|------------|
| <= 4 | `simple` |
| 5-7 | `standard` |
| >= 8 | `complex` |

---

## Current State Analysis

### Q2 Product Type (ACTIVE - in assessment)

**File:** `client/src/lib/assessmentData.ts` (lines 52-68)

```typescript
{
  id: 2,
  section: "A",
  question: "Q2: What type of product are you building?",
  type: "single",
  options: [
    "Web application (SaaS, dashboard, portal)",
    "Mobile app",
    "Marketplace (two-sided)",
    "E-commerce",
    "Internal tool",
    "Browser extension",
    "API / Backend service",
    "Other",
  ],
  required: true,
},
```

### Detailed Product Types (ORPHANED - not connected)

**File:** `shared/mvp-category-mapper.ts` (lines 5-36)

The detailed categories exist but are not connected to the assessment.

### Category Validator (uses simple categories)

**File:** `server/services/category-validator.ts` (lines 5-14)

Uses the old simple categories - needs updating.

---

## Target State

After implementation:

1. **Q2 will show detailed product categories** matching `mvp-category-mapper.ts`
2. **Q2.5 conditional question** appears when "Other" is selected
3. **Route determination** considers compliance-heavy verticals (Fintech, Healthcare)
4. **Cost estimates** use correct MVP knowledge base category filtering
5. **Documents** include vertical-specific guidance
6. **Category validator** uses detailed categories for AI validation
7. **Free tier uses templates** - no AI calls required

---

## Data Flow Architecture

### Current Flow (Simplified)

```
Assessment (Q2: simple type)
    ↓
determineRoute() → route + complexity
    ↓
getCostEstimate() → getCategoriesForProductType(productType) → returns null!
    ↓
matchProjectToMVP() → searches ALL categories (inefficient)
    ↓
Results page (requires AI for all users)
    ↓
PRD Generator (generic documents)
```

### Target Flow (After Implementation)

```
Assessment (Q2: detailed type)
    ↓
    ├─→ Q2.5 (conditional, if "Other")
    ↓
determineRoute() → route + complexity + compliance signals
    ↓
┌────────────────────┬─────────────────────────┐
│    FREE TIER       │      PAID TIER          │
├────────────────────┼─────────────────────────┤
│ Look up template   │ Call AI for personalized│
│ by productType     │ recommendations         │
│        ↓           │           ↓             │
│ Replace {{vars}}   │ AI-generated content    │
│        ↓           │           ↓             │
│ Display Results    │ Display Results         │
│        ↓           │           ↓             │
│ Template Clarity   │ AI-enhanced documents   │
│ Brief (.md)        │ (.docx)                 │
└────────────────────┴─────────────────────────┘
```

---

# Part 2: Implementation Specification

---

## Template System Specification

### Template Inventory

| Template Name | Tier | Format | Purpose |
|--------------|------|--------|---------|
| **Results Summary** | Free | JSON → React component | Route recommendation, tech stack, cost range, timeline |
| **Project Clarity Brief Lite** | Free | Markdown with placeholders | Downloadable .md file, no AI enhancement |
| **Project Clarity Brief Enhanced** | Paid ($149) | AI-generated Markdown → .docx | AI-personalized with tech stack reasoning |
| **Hiring Playbook** | Paid ($149) | AI-generated Markdown → .docx | Vertical-specific hiring guidance |
| **PRD Document** | Paid ($149) | AI-generated Markdown → .docx | Full product requirements |
| **Working Agreement** | Paid ($149) | AI-generated Markdown → .docx | Contract template |

### Template Format

**Results templates:** JSON objects with display data
```typescript
interface VerticalResultsTemplate {
  vertical: string;
  routeGuidance: Record<Route, RouteGuidanceBlock>;
  typicalFeatures: string[];
  techStackSuggestions: Record<Route, string>;
  costRanges: Record<Complexity, { min: number; max: number }>;
  timelineWeeks: Record<Complexity, { min: number; max: number }>;
  criticalConsiderations: string[];
  commonMistakes: string[];
}
```

**Clarity Brief templates:** Markdown strings with `{{placeholder}}` syntax

---

### Placeholder Mapping Spec

| Placeholder | Source | Question | Fallback |
|-------------|--------|----------|----------|
| `{{projectName}}` | `responses[15].project_name` OR `responses[12].problem` | Q15 or Q12 | `"Your Project"` |
| `{{founderName}}` | `responses[15].first_name + " " + responses[15].last_name` | Q15 | `"Founder"` |
| `{{founderEmail}}` | `responses[15].email` | Q15 | `""` (omit line if empty) |
| `{{currentDate}}` | `new Date().toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'})` | Auto | N/A |
| `{{problem}}` | `responses[12].problem` | Q12 | `"[Describe the problem you're solving]"` |
| `{{solution}}` | `responses[12].solution` | Q12 | `"[Describe your solution]"` |
| `{{successGoal}}` | `responses[13].goal` | Q13 | `"[Define your success goal]"` |
| `{{successMetric}}` | `responses[13].metric` | Q13 | `"[Primary metric to track]"` |
| `{{budget}}` | `responses[6]` | Q6 | `"Not specified"` |
| `{{timeline}}` | `responses[7]` | Q7 | `"Not specified"` |
| `{{platform}}` | `responses[3]` | Q3 | `"Web"` |
| `{{buildPreference}}` | `responses[8]` | Q8 | `"Open to either"` |
| `{{route}}` | `determineRoute(responses).route` | Calculated | `"hybrid"` |
| `{{complexity}}` | `determineRoute(responses).complexity` | Calculated | `"standard"` |
| `{{hasCompliance}}` | `responses[5].includes("Compliance")` | Q5 | `"No"` |
| `{{mustHaveFeatures}}` | First 5 from `mergeFeatures(Q4, Q5, Q14)` | Q4+Q5+Q14 | `"- [Define core features]"` |
| `{{postMvpFeatures}}` | Items 6+ from `mergeFeatures(Q4, Q5, Q14)` | Q4+Q5+Q14 | `"- [Define post-MVP features]"` |
| `{{productType}}` | `responses[2]` | Q2 | `"Business SaaS"` |

---

### Conditional Logic Spec

#### Vertical-Specific Sections

| Condition | Action |
|-----------|--------|
| `productType === "Marketplace..."` | Include: "Two-sided dynamics", "Payment escrow", "Trust & safety" |
| `productType === "Fintech/Banking..."` | Include: compliance warning, PCI-DSS, BaaS recommendation |
| `productType === "Healthcare/Telemedicine..."` | Include: HIPAA requirements, BAA checklist |
| `productType === "E-commerce..."` | Include: Shopify recommendation, shipping/tax |
| `integrations.includes("Stripe")` | Include payment integration guidance |
| `hasCompliance === "Yes"` | Force `route = "custom"`, add compliance section |
| `platform.includes("Mobile")` | Add mobile considerations, increase complexity |

#### MVP Phase Logic

```typescript
function getMVPPhases(productType: string, features: string[], complexity: string): Phase[] {
  const phases = [];

  phases.push({
    name: "Phase 1: Core MVP",
    weeks: complexity === "simple" ? 4 : complexity === "standard" ? 8 : 12,
    features: features.slice(0, 3),
    focus: getVerticalPhase1Focus(productType)
  });

  if (features.length > 3) {
    phases.push({
      name: "Phase 2: Enhancement",
      weeks: complexity === "simple" ? 2 : complexity === "standard" ? 4 : 6,
      features: features.slice(3, 5),
    });
  }

  if (features.length > 5) {
    phases.push({
      name: "Phase 3: Scale",
      weeks: 4,
      features: features.slice(5),
    });
  }

  return phases;
}
```

---

### Free Tier Implementation Flow

```typescript
// server/services/free-tier-generator.ts

import { VERTICAL_TEMPLATES } from '@shared/vertical-templates';

export function generateFreeResults(responses: AssessmentResponses): FreeResults {
  const productType = responses[2];
  const template = VERTICAL_TEMPLATES[productType] || VERTICAL_TEMPLATES.default;
  const { route, complexity } = determineRoute(responses);

  return {
    routeRecommendation: template.routeGuidance[route],
    techStackSuggestion: template.techStackSuggestions[route],
    costRange: template.costRanges[mapComplexity(complexity)],
    timelineWeeks: template.timelineWeeks[mapComplexity(complexity)],
    criticalConsiderations: template.criticalConsiderations,
  };
}

export function generateFreeClarityBrief(responses: AssessmentResponses): string {
  const productType = responses[2];
  const templateMarkdown = CLARITY_BRIEF_TEMPLATES[productType] || CLARITY_BRIEF_TEMPLATES.default;
  return replacePlaceholders(templateMarkdown, responses);
}
```

---

### File Structure for Implementation

```
shared/
├── vertical-templates/
│   ├── index.ts              # Export all templates
│   ├── types.ts              # TypeScript interfaces
│   ├── marketplace.ts        # Marketplace template
│   ├── business-saas.ts      # Business SaaS template
│   ├── communication.ts      # Communication platform template
│   ├── fintech.ts            # Fintech template
│   ├── healthcare.ts         # Healthcare template
│   ├── ecommerce.ts          # E-commerce template
│   ├── education.ts          # Education template
│   ├── analytics.ts          # Analytics template
│   ├── internal-tool.ts      # Internal tool template
│   ├── api-backend.ts        # API/Backend template
│   └── default.ts            # Fallback template
├── utils/
│   ├── complexity-mapper.ts      # Complexity enum conversion
│   └── product-type-migrator.ts  # Old→New Q2 mapping

server/
├── services/
│   ├── free-tier-generator.ts    # Template-based generation (no AI)
│   └── paid-tier-generator.ts    # AI-enhanced generation (existing)
```

---

## Results.tsx Integration Spec

**File:** `client/src/pages/Results.tsx`

### Current Flow (AI-dependent)

```typescript
generateRecommendationsMutation.mutateAsync({
  route: computedResult.route,
  responses: parsedResponses,
}).then((recommendation) => {
  setTechRecommendation(recommendation);
});
```

### New Flow (Template-first, AI for paid)

```typescript
import { VERTICAL_TEMPLATES } from "@shared/vertical-templates";
import { migrateProductType } from "@shared/utils/product-type-migrator";

// Step 1: Get template-based results immediately (no API call)
const productType = migrateProductType(responses[2]);
const template = VERTICAL_TEMPLATES[productType] || VERTICAL_TEMPLATES.default;
const { route, complexity } = determineRoute(responses);

// Step 2: Set template-based data immediately (free tier)
const templateResults = {
  routeGuidance: template.routeGuidance[route],
  techStackSuggestion: template.techStackSuggestions[route],
  costRange: template.costRanges[toBackendComplexity(complexity)],
  timelineWeeks: template.timelineWeeks[toBackendComplexity(complexity)],
  criticalConsiderations: template.criticalConsiderations,
  typicalFeatures: template.typicalFeatures,
};

setTemplateResults(templateResults);

// Step 3: Only call AI for paid users
if (isPaidUser) {
  generateRecommendationsMutation.mutateAsync({...})
    .then((recommendation) => setTechRecommendation(recommendation));
}
```

### Components to Update

| Component | Current | New |
|-----------|---------|-----|
| `RouteReasoning.tsx` | Uses AI reasoning | Use `template.routeGuidance[route].reasoning` for free |
| `RealisticRangeCard.tsx` | Uses AI cost estimate | Use `template.costRanges[complexity]` for free |
| `SourcingOptions.tsx` | Static | Can use `template.techStackSuggestions` |
| `PhasedDevelopmentCard.tsx` | Uses AI phases | Use `getMVPPhases()` for free |

---

## Default Template for "Other"

**File:** `shared/vertical-templates/default.ts`

```typescript
export const DEFAULT_TEMPLATE: VerticalResultsTemplate = {
  vertical: "other",
  routeGuidance: {
    "no-code": {
      recommendation: "Consider for simple applications",
      reasoning: "No-code platforms work well for straightforward CRUD applications, landing pages, and MVPs.",
      bestFor: ["Simple web apps", "Landing pages", "Basic workflows", "Prototypes"],
      limitations: ["Complex business logic", "Custom integrations", "High-performance needs"]
    },
    "hybrid": {
      recommendation: "Balanced approach for most projects",
      reasoning: "A hybrid approach combines the speed of no-code with custom code for unique requirements.",
      bestFor: ["Custom + standard features", "Moderate complexity", "Integrations needed"],
      limitations: ["Requires both skill sets", "More coordination"]
    },
    "custom": {
      recommendation: "For complex or unique requirements",
      reasoning: "Custom development gives you full control over functionality and performance.",
      bestFor: ["Complex logic", "Unique UX", "Performance-critical", "Enterprise"],
      limitations: ["Higher cost", "Longer timeline"]
    }
  },
  typicalFeatures: [
    "User authentication",
    "Dashboard",
    "Data management (CRUD)",
    "Search and filtering",
    "Notifications",
    "Settings and preferences",
    "Admin panel",
    "Reporting and exports"
  ],
  techStackSuggestions: {
    "no-code": "Bubble, Webflow, or Retool depending on use case",
    "hybrid": "Next.js + Supabase + no-code for specific features",
    "custom": "Next.js + Node.js + PostgreSQL"
  },
  costRanges: {
    low: { min: 5000, max: 15000 },
    medium: { min: 20000, max: 50000 },
    high: { min: 60000, max: 150000 }
  },
  timelineWeeks: {
    low: { min: 3, max: 6 },
    medium: { min: 6, max: 12 },
    high: { min: 12, max: 24 }
  },
  criticalConsiderations: [
    "Define your unique value proposition clearly",
    "Start with core features only",
    "Plan for iteration based on user feedback",
    "Consider your technical maintenance capacity",
    "Validate demand before building"
  ],
  commonMistakes: [
    "Building too many features before validation",
    "Over-engineering for hypothetical scale",
    "Not talking to users before building",
    "Ignoring mobile responsiveness",
    "Underestimating maintenance needs"
  ]
};
```

---

## Template Lookup Logic

**File:** `shared/vertical-templates/index.ts`

```typescript
import { MARKETPLACE_TEMPLATE } from "./marketplace";
import { BUSINESS_SAAS_TEMPLATE } from "./business-saas";
import { COMMUNICATION_TEMPLATE } from "./communication";
import { FINTECH_TEMPLATE } from "./fintech";
import { HEALTHCARE_TEMPLATE } from "./healthcare";
import { ECOMMERCE_TEMPLATE } from "./ecommerce";
import { EDUCATION_TEMPLATE } from "./education";
import { ANALYTICS_TEMPLATE } from "./analytics";
import { INTERNAL_TOOL_TEMPLATE } from "./internal-tool";
import { API_BACKEND_TEMPLATE } from "./api-backend";
import { DEFAULT_TEMPLATE } from "./default";

export const VERTICAL_TEMPLATES: Record<string, VerticalResultsTemplate> = {
  "Marketplace (connecting buyers/sellers, service providers, freelancers)": MARKETPLACE_TEMPLATE,
  "Business SaaS (CRM, project management, team tools)": BUSINESS_SAAS_TEMPLATE,
  "Communication Platform (chat, video, social network, forums)": COMMUNICATION_TEMPLATE,
  "Fintech/Banking (payments, lending, financial tools)": FINTECH_TEMPLATE,
  "Healthcare/Telemedicine (patient care, booking, health tracking)": HEALTHCARE_TEMPLATE,
  "E-commerce (online store, shopping platform)": ECOMMERCE_TEMPLATE,
  "Education/Learning (courses, LMS, tutoring)": EDUCATION_TEMPLATE,
  "Analytics/Data Platform (dashboards, reporting, BI tools)": ANALYTICS_TEMPLATE,
  "Internal tool (ops dashboard, admin panel)": INTERNAL_TOOL_TEMPLATE,
  "API / Backend service": API_BACKEND_TEMPLATE,
  "Other (describe below)": DEFAULT_TEMPLATE,
  "default": DEFAULT_TEMPLATE,
};

export function getTemplateForProductType(productType: string): VerticalResultsTemplate {
  return VERTICAL_TEMPLATES[productType] || VERTICAL_TEMPLATES.default;
}
```

---

# Part 3: Implementation Tasks

---

## Task 1: Update Assessment Question Data

**File:** `client/src/lib/assessmentData.ts`
**Location:** Lines 52-68

Replace Q2 options and add Q2.5:

```typescript
{
  id: 2,
  section: "A",
  question: "Q2: What type of product are you building?",
  helperText: "Choose the category that best describes your product.",
  type: "single",
  options: [
    "Marketplace (connecting buyers/sellers, service providers, freelancers)",
    "Business SaaS (CRM, project management, team tools)",
    "Communication Platform (chat, video, social network, forums)",
    "Fintech/Banking (payments, lending, financial tools)",
    "Healthcare/Telemedicine (patient care, booking, health tracking)",
    "E-commerce (online store, shopping platform)",
    "Education/Learning (courses, LMS, tutoring)",
    "Analytics/Data Platform (dashboards, reporting, BI tools)",
    "Internal tool (ops dashboard, admin panel)",
    "API / Backend service",
    "Other (describe below)",
  ],
  required: true,
},
{
  id: 2.5,
  section: "A",
  question: "Q2.5: Describe your product type",
  helperText: "Tell us more about what you're building.",
  type: "text",
  required: true,
  conditional: {
    questionId: 2,
    value: "Other (describe below)",
  },
},
```

---

## Task 2: Update Route Determination Logic

**File:** `client/src/lib/assessmentData.ts`
**Location:** `determineRoute()` function

Add compliance-heavy vertical detection:

```typescript
// Add after line 257:
const COMPLIANCE_HEAVY_VERTICALS = [
  "Fintech/Banking (payments, lending, financial tools)",
  "Healthcare/Telemedicine (patient care, booking, health tracking)",
];
const isComplianceHeavyVertical = COMPLIANCE_HEAVY_VERTICALS.includes(projectType);

const CUSTOM_PREFERRED_VERTICALS = [
  "Analytics/Data Platform (dashboards, reporting, BI tools)",
  "API / Backend service",
];
const isCustomPreferredVertical = CUSTOM_PREFERRED_VERTICALS.includes(projectType);

// Add to complexity scoring:
if (isComplianceHeavyVertical) complexityScore += 2;

// Update route forcing logic:
if (isComplianceHeavyVertical) {
  if (buildPreference.includes("No-code") && noCodeScore >= 10) {
    route = "hybrid";
  } else {
    route = "custom";
  }
}
```

---

## Task 3: Update Category Validator

**File:** `server/services/category-validator.ts`

```typescript
export const PRODUCT_CATEGORIES = [
  "Marketplace (connecting buyers/sellers, service providers, freelancers)",
  "Business SaaS (CRM, project management, team tools)",
  "Communication Platform (chat, video, social network, forums)",
  "Fintech/Banking (payments, lending, financial tools)",
  "Healthcare/Telemedicine (patient care, booking, health tracking)",
  "E-commerce (online store, shopping platform)",
  "Education/Learning (courses, LMS, tutoring)",
  "Analytics/Data Platform (dashboards, reporting, BI tools)",
  "Internal tool (ops dashboard, admin panel)",
  "API / Backend service",
  "Other",
] as const;
```

---

## Task 4: Update MVP Category Mapper

**File:** `shared/mvp-category-mapper.ts`

Add missing mappings:

```typescript
"Internal tool (ops dashboard, admin panel)": [
  "Core Business SaaS",
],
"API / Backend service": [
  "Technical & Developer Tools",
],
```

---

## Task 5: Update PRD Generator for Vertical-Specific Guidance

**File:** `server/services/prd-generator.ts`

Add helper method `getVerticalSpecificConstraints(productType)` that returns vertical-specific guidance for Fintech, Healthcare, Marketplace, E-commerce, and Education.

---

## Task 6: Update Hiring Playbook for Vertical-Specific Skills

**File:** `server/services/prd-generator.ts`

Add helper method `getVerticalSpecificSkills(productType)` that returns skill requirements for Fintech, Healthcare, Marketplace, and Analytics verticals.

---

## Task 7: Fix Complexity Enum Mismatch

**File:** `shared/utils/complexity-mapper.ts` (new file)

```typescript
export type FrontendComplexity = "simple" | "standard" | "complex";
export type BackendComplexity = "low" | "medium" | "high";

export function toBackendComplexity(frontend: FrontendComplexity): BackendComplexity {
  const map: Record<FrontendComplexity, BackendComplexity> = {
    simple: "low",
    standard: "medium",
    complex: "high",
  };
  return map[frontend] || "medium";
}

export function toFrontendComplexity(backend: BackendComplexity): FrontendComplexity {
  const map: Record<BackendComplexity, FrontendComplexity> = {
    low: "simple",
    medium: "standard",
    high: "complex",
  };
  return map[backend] || "standard";
}
```

---

## Task 8: Update Tests

**File:** `server/assessment.test.ts`

Update test fixtures with new product type strings and add tests for:
- Fintech → custom route
- Healthcare → custom route
- Fintech + no-code preference → hybrid route

---

## Task 9: Migration Mapping for Old Q2 Values

**File:** `shared/utils/product-type-migrator.ts` (new file)

```typescript
export const OLD_TO_NEW_PRODUCT_TYPE_MAP: Record<string, string> = {
  "Web application (SaaS, dashboard, portal)": "Business SaaS (CRM, project management, team tools)",
  "Mobile app": "Business SaaS (CRM, project management, team tools)",
  "Marketplace (two-sided)": "Marketplace (connecting buyers/sellers, service providers, freelancers)",
  "E-commerce": "E-commerce (online store, shopping platform)",
  "Internal tool": "Internal tool (ops dashboard, admin panel)",
  "Browser extension": "Business SaaS (CRM, project management, team tools)",
  "API / Backend service": "API / Backend service",
  "Other": "Other (describe below)",
};

export function migrateProductType(oldValue: string): string {
  if (isNewProductType(oldValue)) return oldValue;
  return OLD_TO_NEW_PRODUCT_TYPE_MAP[oldValue] || "Business SaaS (CRM, project management, team tools)";
}
```

---

# Part 4: Vertical Templates

Each vertical includes a **Results Template** (JSON) and **Project Clarity Brief Template** (Markdown).

---

## 1. Marketplace

**Q2 Value:** `Marketplace (connecting buyers/sellers, service providers, freelancers)`

### Results Template

```json
{
  "vertical": "marketplace",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Good for simple listing marketplaces",
      "reasoning": "No-code platforms like Sharetribe or Bubble can handle basic two-sided marketplaces.",
      "bestFor": ["Service marketplaces", "Local listings", "Simple booking"],
      "limitations": ["Complex payment escrow", "Custom matching", "High-volume"]
    },
    "hybrid": {
      "recommendation": "Recommended for most marketplaces",
      "reasoning": "Use no-code for frontend, custom code for payment escrow and matching logic.",
      "bestFor": ["Service marketplaces with payments", "Freelancer platforms"],
      "limitations": ["Requires developer for backend"]
    },
    "custom": {
      "recommendation": "Required for complex marketplaces",
      "reasoning": "Sophisticated matching, complex payment splits, real-time bidding.",
      "bestFor": ["High-volume platforms", "Complex matching/bidding"],
      "limitations": ["Higher cost", "Longer timeline"]
    }
  },
  "typicalFeatures": [
    "Two-sided user profiles",
    "Listings with search and filters",
    "Booking or request flow",
    "Payment processing with escrow",
    "Reviews and ratings",
    "Messaging between parties",
    "Admin dashboard for moderation"
  ],
  "techStackSuggestions": {
    "no-code": "Sharetribe, Bubble + Stripe Connect",
    "hybrid": "Webflow/Bubble + Node.js/Supabase + Stripe Connect",
    "custom": "Next.js + Node.js + PostgreSQL + Stripe Connect + Algolia"
  },
  "costRanges": {
    "low": { "min": 8000, "max": 20000 },
    "medium": { "min": 25000, "max": 60000 },
    "high": { "min": 75000, "max": 150000 }
  },
  "timelineWeeks": {
    "low": { "min": 4, "max": 8 },
    "medium": { "min": 8, "max": 14 },
    "high": { "min": 14, "max": 24 }
  },
  "criticalConsiderations": [
    "Chicken-and-egg problem: Which side first?",
    "Payment escrow and dispute resolution",
    "Trust & safety (verification, reviews, fraud)",
    "Commission structure and payment splits"
  ],
  "commonMistakes": [
    "Building both sides simultaneously",
    "Underestimating payment complexity",
    "Ignoring trust signals",
    "Over-building before validation"
  ]
}
```

---

## 2. Business SaaS

**Q2 Value:** `Business SaaS (CRM, project management, team tools)`

### Results Template

```json
{
  "vertical": "business-saas",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Viable for internal tools and simple SaaS",
      "reasoning": "No-code platforms handle CRUD, dashboards, basic workflows.",
      "bestFor": ["Internal dashboards", "Simple CRM", "Basic project tracking"],
      "limitations": ["Complex workflows", "Heavy integrations", "Scale beyond 10K users"]
    },
    "hybrid": {
      "recommendation": "Good balance for most B2B SaaS",
      "reasoning": "No-code for prototyping, custom code for core logic.",
      "bestFor": ["CRM with custom workflows", "Project management", "Team collaboration"],
      "limitations": ["May need rebuild later"]
    },
    "custom": {
      "recommendation": "Best for differentiated SaaS",
      "reasoning": "Full control for unique workflows, AI features, complex integrations.",
      "bestFor": ["Complex enterprise SaaS", "AI-powered tools", "Heavy integrations"],
      "limitations": ["Higher upfront cost", "Longer time to market"]
    }
  },
  "typicalFeatures": [
    "User auth with team/workspace support",
    "Role-based access control",
    "Dashboard with key metrics",
    "CRUD operations",
    "Search and filtering",
    "Notifications",
    "Settings and preferences",
    "Data export"
  ],
  "techStackSuggestions": {
    "no-code": "Bubble + Airtable + Zapier",
    "hybrid": "Next.js + Supabase + Resend",
    "custom": "Next.js + Node.js + PostgreSQL + Redis + BullMQ"
  },
  "costRanges": {
    "low": { "min": 10000, "max": 25000 },
    "medium": { "min": 30000, "max": 75000 },
    "high": { "min": 80000, "max": 200000 }
  },
  "timelineWeeks": {
    "low": { "min": 4, "max": 8 },
    "medium": { "min": 8, "max": 16 },
    "high": { "min": 16, "max": 28 }
  },
  "criticalConsiderations": [
    "Multi-tenancy architecture",
    "Role-based permissions complexity",
    "Data model design (hard to change)",
    "Integration requirements",
    "Billing and subscription management"
  ],
  "commonMistakes": [
    "Too many features before validation",
    "Underestimating permissions complexity",
    "Not planning for multi-tenant",
    "Ignoring mobile responsiveness"
  ]
}
```

---

## 3. Communication Platform

**Q2 Value:** `Communication Platform (chat, video, social network, forums)`

### Results Template

```json
{
  "vertical": "communication",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Limited viability",
      "reasoning": "Real-time features are difficult with no-code.",
      "bestFor": ["Simple forums", "Community spaces"],
      "limitations": ["Real-time chat", "Video calling", "Push notifications", "Scale"]
    },
    "hybrid": {
      "recommendation": "Possible with third-party SDKs",
      "reasoning": "Use Stream, Twilio, Sendbird for real-time infrastructure.",
      "bestFor": ["Chat features", "Video calling integration", "Community"],
      "limitations": ["Vendor lock-in", "API costs at scale"]
    },
    "custom": {
      "recommendation": "Required for core communication products",
      "reasoning": "Full control for performance, customization, cost.",
      "bestFor": ["Slack/Discord competitors", "Video platforms", "Social networks"],
      "limitations": ["High complexity", "Significant investment"]
    }
  },
  "typicalFeatures": [
    "User profiles and presence",
    "Real-time messaging",
    "Channels or rooms",
    "Media sharing",
    "Push notifications",
    "Read receipts and typing indicators",
    "Search",
    "Moderation tools"
  ],
  "techStackSuggestions": {
    "no-code": "Circle, Discourse, Mighty Networks",
    "hybrid": "Next.js + Stream Chat + Twilio Video + Supabase",
    "custom": "Next.js + Node.js + PostgreSQL + Redis + WebSockets"
  },
  "costRanges": {
    "low": { "min": 15000, "max": 35000 },
    "medium": { "min": 50000, "max": 100000 },
    "high": { "min": 120000, "max": 300000 }
  },
  "timelineWeeks": {
    "low": { "min": 6, "max": 10 },
    "medium": { "min": 12, "max": 20 },
    "high": { "min": 20, "max": 36 }
  },
  "criticalConsiderations": [
    "Real-time infrastructure is complex and expensive",
    "Mobile apps usually essential",
    "Moderation from day one",
    "WebSocket connections are resource-intensive",
    "Data retention and privacy"
  ],
  "commonMistakes": [
    "Building real-time from scratch when SDKs exist",
    "Underestimating moderation",
    "Launching without mobile",
    "Ignoring notification deliverability"
  ]
}
```

---

## 4. Fintech/Banking

**Q2 Value:** `Fintech/Banking (payments, lending, financial tools)`

### Results Template

```json
{
  "vertical": "fintech",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Not recommended",
      "reasoning": "Financial apps have strict security and compliance requirements.",
      "bestFor": ["Internal dashboards only"],
      "limitations": ["PCI compliance", "Security", "Audit trails", "Regulatory"]
    },
    "hybrid": {
      "recommendation": "Possible for some use cases",
      "reasoning": "No-code for non-sensitive features, custom for financial data.",
      "bestFor": ["Financial dashboards", "Expense tracking", "Invoice management"],
      "limitations": ["Money movement needs custom", "Compliance still required"]
    },
    "custom": {
      "recommendation": "Required for most fintech",
      "reasoning": "PCI-DSS, state regulations, security best practices require custom.",
      "bestFor": ["Payment processing", "Lending", "Banking apps", "Investment tools"],
      "limitations": ["High cost", "Regulatory complexity", "Long timeline"]
    }
  },
  "typicalFeatures": [
    "Secure authentication (MFA)",
    "Bank account linking (Plaid)",
    "Transaction history",
    "Payment processing",
    "KYC/identity verification",
    "Audit logging",
    "Fraud detection",
    "Compliance exports"
  ],
  "techStackSuggestions": {
    "no-code": "Not recommended for fintech",
    "hybrid": "Next.js + Supabase + Plaid + Stripe",
    "custom": "Next.js + Node.js + PostgreSQL + Plaid + Stripe + Unit + Persona"
  },
  "costRanges": {
    "low": { "min": 40000, "max": 80000 },
    "medium": { "min": 100000, "max": 200000 },
    "high": { "min": 250000, "max": 500000 }
  },
  "timelineWeeks": {
    "low": { "min": 12, "max": 20 },
    "medium": { "min": 20, "max": 32 },
    "high": { "min": 32, "max": 52 }
  },
  "criticalConsiderations": [
    "PCI-DSS compliance mandatory for card data",
    "State money transmitter licenses may be required",
    "KYC/AML requirements",
    "BaaS providers can accelerate launch",
    "Security audits and pen testing required"
  ],
  "commonMistakes": [
    "Underestimating compliance costs",
    "Building banking infra instead of using BaaS",
    "Launching without proper licenses",
    "Insufficient security",
    "Not budgeting for ongoing compliance"
  ]
}
```

---

## 5. Healthcare/Telemedicine

**Q2 Value:** `Healthcare/Telemedicine (patient care, booking, health tracking)`

### Results Template

```json
{
  "vertical": "healthcare",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Not recommended for patient data",
      "reasoning": "HIPAA compliance requires strict controls no-code can't provide.",
      "bestFor": ["Marketing sites", "Non-PHI scheduling", "General wellness"],
      "limitations": ["Cannot store PHI", "No HIPAA compliance", "No telehealth"]
    },
    "hybrid": {
      "recommendation": "Possible with HIPAA-compliant backend",
      "reasoning": "No-code for non-sensitive, compliant backend for patient data.",
      "bestFor": ["Appointment scheduling", "Patient intake", "Simple telehealth"],
      "limitations": ["PHI must stay compliant", "Increased complexity"]
    },
    "custom": {
      "recommendation": "Required for most healthcare",
      "reasoning": "HIPAA, EHR integrations, strict security require custom.",
      "bestFor": ["Telemedicine", "Patient portals", "EHR integrations", "Health tracking"],
      "limitations": ["High cost", "Regulatory overhead", "Long timeline"]
    }
  },
  "typicalFeatures": [
    "Secure patient authentication",
    "Appointment scheduling",
    "Video consultations (HIPAA-compliant)",
    "Patient intake forms",
    "Medical records access",
    "Prescription management",
    "Secure messaging",
    "Billing and insurance"
  ],
  "techStackSuggestions": {
    "no-code": "Not recommended for PHI",
    "hybrid": "Webflow + HIPAA backend + Doxy.me",
    "custom": "Next.js + Node.js + PostgreSQL (encrypted) + AWS HIPAA + Twilio HIPAA"
  },
  "costRanges": {
    "low": { "min": 50000, "max": 100000 },
    "medium": { "min": 120000, "max": 250000 },
    "high": { "min": 300000, "max": 600000 }
  },
  "timelineWeeks": {
    "low": { "min": 14, "max": 24 },
    "medium": { "min": 24, "max": 40 },
    "high": { "min": 40, "max": 60 }
  },
  "criticalConsiderations": [
    "HIPAA compliance is mandatory",
    "BAAs required with ALL vendors handling PHI",
    "State telemedicine regulations vary",
    "EHR integration (HL7/FHIR) is complex",
    "Video must be HIPAA-compliant"
  ],
  "commonMistakes": [
    "Using non-HIPAA-compliant tools",
    "Not signing BAAs",
    "Underestimating state regulations",
    "Building EHR integration before validation",
    "Using consumer video for telehealth"
  ]
}
```

---

## 6. E-commerce

**Q2 Value:** `E-commerce (online store, shopping platform)`

### Results Template

```json
{
  "vertical": "ecommerce",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Great for standard e-commerce",
      "reasoning": "Shopify, WooCommerce handle most needs out of the box.",
      "bestFor": ["Standard stores", "Digital products", "Subscription boxes"],
      "limitations": ["Complex B2B pricing", "Custom checkout", "Multi-vendor"]
    },
    "hybrid": {
      "recommendation": "Good for customized stores",
      "reasoning": "Shopify/WooCommerce + custom features via headless.",
      "bestFor": ["Product configurators", "Custom checkout", "Inventory integrations"],
      "limitations": ["More complex", "Higher ongoing costs"]
    },
    "custom": {
      "recommendation": "Only for complex requirements",
      "reasoning": "Custom e-commerce is expensive. Only for multi-vendor or complex B2B.",
      "bestFor": ["Multi-vendor marketplaces", "B2B complex pricing", "Unique experiences"],
      "limitations": ["High cost", "Ongoing maintenance", "Reinventing solved problems"]
    }
  },
  "typicalFeatures": [
    "Product catalog with categories",
    "Search and filtering",
    "Shopping cart",
    "Checkout with multiple payment options",
    "Order management",
    "Inventory tracking",
    "Shipping calculation",
    "Customer accounts",
    "Email notifications"
  ],
  "techStackSuggestions": {
    "no-code": "Shopify, WooCommerce, or Webflow E-commerce",
    "hybrid": "Next.js + Shopify Headless (Hydrogen) or Medusa.js",
    "custom": "Next.js + Medusa.js or Saleor + PostgreSQL + Stripe"
  },
  "costRanges": {
    "low": { "min": 3000, "max": 15000 },
    "medium": { "min": 20000, "max": 50000 },
    "high": { "min": 60000, "max": 150000 }
  },
  "timelineWeeks": {
    "low": { "min": 2, "max": 4 },
    "medium": { "min": 6, "max": 12 },
    "high": { "min": 12, "max": 24 }
  },
  "criticalConsiderations": [
    "Use Shopify unless you have specific reason not to",
    "Payment processing is solved (Stripe, PayPal)",
    "Shipping complexity is underestimated",
    "Tax calculation required (TaxJar, Avalara)",
    "PCI compliance if handling card data"
  ],
  "commonMistakes": [
    "Building custom when Shopify would work",
    "Underestimating shipping and tax",
    "Not planning for returns",
    "Ignoring mobile shopping",
    "Overcomplicating product options"
  ]
}
```

---

## 7. Education/Learning

**Q2 Value:** `Education/Learning (courses, LMS, tutoring)`

### Results Template

```json
{
  "vertical": "education",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Great for course creators",
      "reasoning": "Teachable, Thinkific provide everything for selling courses.",
      "bestFor": ["Video courses", "Cohort-based courses", "Membership sites"],
      "limitations": ["Custom learning paths", "Gamification", "LTI/LMS integrations"]
    },
    "hybrid": {
      "recommendation": "Good for differentiated platforms",
      "reasoning": "Existing platforms for video/payments, custom for unique experience.",
      "bestFor": ["Bootcamps", "Interactive learning", "Peer-based learning"],
      "limitations": ["Integration complexity", "Multiple vendors"]
    },
    "custom": {
      "recommendation": "For enterprise LMS or unique experiences",
      "reasoning": "Enterprise LMS with SSO/SCORM, interactive learning.",
      "bestFor": ["Enterprise LMS", "Interactive simulations", "Tutoring marketplaces"],
      "limitations": ["Video hosting expensive", "High development cost"]
    }
  },
  "typicalFeatures": [
    "Course catalog and enrollment",
    "Video lessons with progress tracking",
    "Quizzes and assessments",
    "Completion certificates",
    "Student dashboard",
    "Discussion forums",
    "Payment handling",
    "Admin dashboard"
  ],
  "techStackSuggestions": {
    "no-code": "Teachable, Thinkific, Kajabi, or Circle",
    "hybrid": "Next.js + Mux + Stripe + custom LMS features",
    "custom": "Next.js + Node.js + PostgreSQL + Mux/Cloudflare Stream + Stripe"
  },
  "costRanges": {
    "low": { "min": 5000, "max": 15000 },
    "medium": { "min": 25000, "max": 60000 },
    "high": { "min": 80000, "max": 180000 }
  },
  "timelineWeeks": {
    "low": { "min": 2, "max": 6 },
    "medium": { "min": 8, "max": 16 },
    "high": { "min": 16, "max": 28 }
  },
  "criticalConsiderations": [
    "Video hosting costs at scale",
    "Content is the product - platform is secondary",
    "Completion rates are low (3-15%)",
    "Mobile experience matters",
    "FERPA if serving K-12/higher ed"
  ],
  "commonMistakes": [
    "Building platform before validating course demand",
    "Overcomplicating learning experience",
    "Not budgeting for video hosting",
    "Ignoring completion rate optimization",
    "Building custom when Teachable works"
  ]
}
```

---

## 8. Analytics/Data Platform

**Q2 Value:** `Analytics/Data Platform (dashboards, reporting, BI tools)`

### Results Template

```json
{
  "vertical": "analytics",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Good for simple dashboards",
      "reasoning": "Retool, Metabase, Looker Studio work without custom code.",
      "bestFor": ["Internal dashboards", "Simple BI", "Report builders"],
      "limitations": ["Large datasets", "Complex transformations", "Custom visualizations"]
    },
    "hybrid": {
      "recommendation": "Common for analytics products",
      "reasoning": "Metabase/Preset for visualization, custom for pipelines.",
      "bestFor": ["Customer-facing dashboards", "ETL + visualization", "Embedded analytics"],
      "limitations": ["May hit limits of embedded tools"]
    },
    "custom": {
      "recommendation": "For analytics-as-product",
      "reasoning": "Full control over experience, performance, differentiation.",
      "bestFor": ["BI platforms", "Large-scale data processing", "Real-time analytics"],
      "limitations": ["Expensive", "Complex infrastructure", "Ongoing maintenance"]
    }
  },
  "typicalFeatures": [
    "Dashboard with visualizations",
    "Data connectors",
    "Query builder or report creator",
    "Filters and drill-downs",
    "Export to PDF/CSV/Excel",
    "Scheduled reports and alerts",
    "User permissions",
    "Embedded analytics"
  ],
  "techStackSuggestions": {
    "no-code": "Retool, Metabase, Google Looker Studio, or Preset",
    "hybrid": "Next.js + Metabase/Preset (embedded) + custom data pipelines",
    "custom": "Next.js + Node.js + PostgreSQL/ClickHouse + D3.js/Recharts + dbt"
  },
  "costRanges": {
    "low": { "min": 10000, "max": 30000 },
    "medium": { "min": 40000, "max": 100000 },
    "high": { "min": 120000, "max": 300000 }
  },
  "timelineWeeks": {
    "low": { "min": 4, "max": 8 },
    "medium": { "min": 10, "max": 18 },
    "high": { "min": 18, "max": 32 }
  },
  "criticalConsiderations": [
    "Data infrastructure often more work than UI",
    "Query performance at scale is hard",
    "Data freshness expectations",
    "Security for sensitive data",
    "Embedded analytics licensing"
  ],
  "commonMistakes": [
    "Building visualization when Metabase exists",
    "Underestimating data pipeline complexity",
    "Not planning for query performance",
    "Ignoring data freshness requirements",
    "Over-engineering before validation"
  ]
}
```

---

## 9. Internal Tool

**Q2 Value:** `Internal tool (ops dashboard, admin panel)`

### Results Template

```json
{
  "vertical": "internal-tool",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Excellent choice for internal tools",
      "reasoning": "Retool, Appsmith, Budibase designed specifically for this.",
      "bestFor": ["Admin panels", "Ops dashboards", "Data entry", "Approval workflows"],
      "limitations": ["Complex integrations", "High-performance", "Customer-facing"]
    },
    "hybrid": {
      "recommendation": "Good for complex internal tools",
      "reasoning": "No-code for CRUD, custom for complex business logic.",
      "bestFor": ["Workflow automation", "Complex approvals", "Multi-system integration"],
      "limitations": ["Increases maintenance complexity"]
    },
    "custom": {
      "recommendation": "Rarely needed for internal tools",
      "reasoning": "Custom is usually overkill for internal tools.",
      "bestFor": ["Mission-critical ops tools", "Complex algorithms"],
      "limitations": ["Expensive for internal use", "Slower to iterate"]
    }
  },
  "typicalFeatures": [
    "CRUD operations",
    "Dashboard with key metrics",
    "Search and filtering",
    "User management and permissions",
    "Audit logging",
    "Bulk operations",
    "Export/import data",
    "Notifications"
  ],
  "techStackSuggestions": {
    "no-code": "Retool, Appsmith, Budibase, or Airplane",
    "hybrid": "Retool + custom API endpoints",
    "custom": "Next.js + Node.js + PostgreSQL (rarely needed)"
  },
  "costRanges": {
    "low": { "min": 3000, "max": 10000 },
    "medium": { "min": 15000, "max": 40000 },
    "high": { "min": 50000, "max": 100000 }
  },
  "timelineWeeks": {
    "low": { "min": 1, "max": 3 },
    "medium": { "min": 4, "max": 8 },
    "high": { "min": 8, "max": 16 }
  },
  "criticalConsiderations": [
    "ROI must justify cost (no revenue)",
    "Maintenance falls on your team",
    "Security still matters",
    "User adoption is hardest part",
    "Consider SaaS alternatives"
  ],
  "commonMistakes": [
    "Over-engineering",
    "Building when spreadsheet would work",
    "Ignoring user adoption",
    "Not securing properly",
    "Custom building what Retool can do"
  ]
}
```

---

## 10. API/Backend Service

**Q2 Value:** `API / Backend service`

### Results Template

```json
{
  "vertical": "api-backend",
  "routeGuidance": {
    "no-code": {
      "recommendation": "Limited viability",
      "reasoning": "Backend services need custom code for logic and performance.",
      "bestFor": ["Simple CRUD APIs", "Prototypes", "MVP validation"],
      "limitations": ["Complex logic", "High performance", "Custom integrations"]
    },
    "hybrid": {
      "recommendation": "Good for extending existing tools",
      "reasoning": "Supabase/Xano for database/auth, custom for complex logic.",
      "bestFor": ["CRUD + custom logic", "Moderate complexity", "Early-stage"],
      "limitations": ["May outgrow no-code backend"]
    },
    "custom": {
      "recommendation": "Standard for backend services",
      "reasoning": "Full control over logic, performance, scaling, integrations.",
      "bestFor": ["Core business APIs", "High-performance", "Complex integrations"],
      "limitations": ["Requires backend expertise", "Infrastructure management"]
    }
  },
  "typicalFeatures": [
    "RESTful or GraphQL endpoints",
    "Authentication and API keys",
    "Rate limiting",
    "Request validation",
    "Error handling and logging",
    "Database operations",
    "Background jobs",
    "Webhook support"
  ],
  "techStackSuggestions": {
    "no-code": "Xano, Supabase, or Firebase",
    "hybrid": "Supabase + Edge Functions or AWS Lambda",
    "custom": "Node.js/Python/Go + PostgreSQL + Redis + Docker/Kubernetes"
  },
  "costRanges": {
    "low": { "min": 8000, "max": 20000 },
    "medium": { "min": 25000, "max": 60000 },
    "high": { "min": 70000, "max": 150000 }
  },
  "timelineWeeks": {
    "low": { "min": 3, "max": 6 },
    "medium": { "min": 6, "max": 12 },
    "high": { "min": 12, "max": 24 }
  },
  "criticalConsiderations": [
    "API design hard to change",
    "Security is critical",
    "Performance requirements drive architecture",
    "Documentation essential",
    "Versioning strategy needed"
  ],
  "commonMistakes": [
    "Poor API design that can't evolve",
    "Insufficient security",
    "No rate limiting",
    "Missing documentation",
    "Not planning for scale"
  ]
}
```

---

## Future Verticals

### Real Estate / PropTech
**Key characteristics:** Property listings, MLS/IDX integrations, virtual tours, mortgage calculators

### Legal Tech
**Key characteristics:** Document automation, e-signatures, case management, billing, compliance

### HR Tech
**Key characteristics:** ATS, onboarding, HRIS integrations, performance management, compliance

### Logistics
**Key characteristics:** Inventory management, shipping integrations, route optimization, fleet tracking

---

# Part 5: Reference & Appendices

---

## File Reference

| File | Purpose | Changes Required |
|------|---------|------------------|
| `client/src/lib/assessmentData.ts` | Assessment questions + route logic | Replace Q2, add Q2.5, update `determineRoute()` |
| `server/services/category-validator.ts` | AI category validation | Update `PRODUCT_CATEGORIES` |
| `shared/mvp-category-mapper.ts` | Maps product types to knowledge base | Add missing mappings |
| `server/services/prd-generator.ts` | Document generation | Add vertical-specific methods |
| `shared/cost-estimator.ts` | Cost calculation | Add complexity normalization |
| `shared/utils/complexity-mapper.ts` | Complexity enum conversion | New file |
| `shared/utils/product-type-migrator.ts` | Old→New Q2 mapping | New file |
| `shared/vertical-templates/*.ts` | Vertical templates | New directory with 11 files |
| `server/services/free-tier-generator.ts` | Template-based generation | New file |
| `server/assessment.test.ts` | Tests | Update fixtures, add new tests |

---

## Testing Checklist

### UI Testing
- [ ] Q2 shows 10 detailed product type options
- [ ] "Other (describe below)" shows Q2.5 text input
- [ ] Q2.5 is required when visible, hidden otherwise

### Route Determination
- [ ] Fintech → custom route
- [ ] Healthcare → custom route
- [ ] Fintech + no-code preference + simple scope → hybrid
- [ ] Analytics/Data Platform → custom route
- [ ] Business SaaS + web only + low budget → no-code

### Cost Estimates
- [ ] Each vertical matches correct MVP knowledge base category

### Document Generation
- [ ] Fintech includes PCI-DSS, compliance guidance
- [ ] Healthcare includes HIPAA requirements

### Free Tier Templates
- [ ] Results page loads without AI call
- [ ] Template content matches vertical
- [ ] Placeholders replaced correctly
- [ ] Project Clarity Brief downloads as .md

### Regression
- [ ] All existing tests pass
- [ ] Paid tier still works with AI

---

## Design Decisions Made

| Decision | Resolution | Reasoning |
|----------|------------|-----------|
| Keep "Internal tool" and "API / Backend service" separate? | **YES** | Different use cases: Internal has UI, API has no UI |
| Remove "Mobile app" from Q2? | **YES** | Redundant with Q3 (platform question) |
| Add more verticals? | **Not now** | 10 options covers major categories |

---

## Appendix A: 2025 Pricing Research

### Hourly Rate Comparison by Route

| Route | Junior | Mid | Senior |
|-------|--------|-----|--------|
| No-Code | $25-50/hr | $50-75/hr | $75-120/hr |
| Hybrid | $40-60/hr | $60-90/hr | $90-125/hr |
| Custom (US) | $50-75/hr | $75-125/hr | $125-250/hr |
| Custom (Eastern Europe) | $25-50/hr | $40-80/hr | $60-120/hr |

### MVP Project Costs

| Complexity | No-Code | Hybrid | Custom |
|------------|---------|--------|--------|
| Simple | $2K-$10K | $10K-$25K | $10K-$50K |
| Standard | $10K-$30K | $25K-$60K | $50K-$100K |
| Complex | $30K-$50K | $60K-$100K | $100K-$300K+ |

### Key Insights
- No-code is 40-80% cheaper for simple MVPs
- Hybrid saves 30-50% vs full custom
- 70% of new apps will use low-code/no-code by 2025 (Gartner)

---

## Appendix B: MVP Knowledge Base Categories

| Category | Examples |
|----------|----------|
| Core Business SaaS | CRM, Project Management, HR |
| Marketplaces & Platforms | Service marketplace, Booking platform |
| Communication & Social | Chat, Video, Social network |
| Vertical-Specific SaaS | Fintech, Healthcare, Education |
| Technical & Developer Tools | API gateway, Analytics, Dev tools |

---

## Appendix C: Document Output Structures

### Project Clarity Brief Structure

1. **PROJECT OVERVIEW** - Name, Founder, Date
2. **THE PROBLEM** - From Q12
3. **THE SOLUTION** - From Q12
4. **TARGET USER** - Placeholder or vertical-specific
5. **SUCCESS CRITERIA** - From Q13
6. **MVP SCOPE** - Must-Have (first 5), Post-MVP (6+)
7. **CONSTRAINTS** - Budget, Timeline, Platform, Compliance, Preferences
8. **RECOMMENDED APPROACH** - Route, Reasoning, Tech Stack

### Free vs Paid Differences

| Field | Free | Paid |
|-------|------|------|
| Tech Stack | Template-based | AI-generated |
| Route Reasoning | Template-based | AI-generated |
| Format | .md | .docx |
| Vertical Guidance | Template | AI-enhanced |

---

## Appendix D: Clarity Brief Templates (Free Tier)

### Base Template Structure

All verticals use this base structure with vertical-specific sections injected where noted.

```markdown
# PROJECT CLARITY BRIEF: {{projectName}}

**Prepared for:** {{founderName}}
**Email:** {{founderEmail}}
**Date:** {{currentDate}}

---

## 1. THE PROBLEM

{{problem}}

---

## 2. THE SOLUTION

{{solution}}

---

## 3. TARGET USER

{{targetUserDescription}}

---

## 4. SUCCESS CRITERIA

**Goal:** {{successGoal}}

**Primary Metric:** {{successMetric}}

---

## 5. MVP SCOPE

### Must-Have Features (Phase 1)
{{mustHaveFeatures}}

### Post-MVP Features (Phase 2+)
{{postMvpFeatures}}

---

## 6. CONSTRAINTS

| Constraint | Value |
|------------|-------|
| **Budget** | {{budget}} |
| **Timeline** | {{timeline}} |
| **Platform** | {{platform}} |
| **Build Preference** | {{buildPreference}} |
| **Compliance Required** | {{hasCompliance}} |

---

## 7. RECOMMENDED APPROACH

**Route:** {{route}}

**Why this route:**
{{routeReasoning}}

**Suggested Tech Stack:**
{{techStackSuggestion}}

---

## 8. CRITICAL CONSIDERATIONS

{{criticalConsiderations}}

---

## 9. COMMON MISTAKES TO AVOID

{{commonMistakes}}

---

*This document was generated by Founder Link. For the full Hiring Toolkit with PRD, Hiring Playbook, and Working Agreement, upgrade to the Pro tier.*
```

---

### Vertical-Specific Injections

Each vertical overrides these placeholders:

#### Marketplace Template Overrides

```typescript
{
  targetUserDescription: "Two-sided marketplace users: suppliers/service providers AND buyers/customers. Your MVP strategy must address the chicken-and-egg problem—typically by focusing on one side first.",

  routeReasoning: {
    "no-code": "No-code platforms like Sharetribe can handle basic listing marketplaces. Good for validating demand before investing in custom payment escrow.",
    "hybrid": "Recommended. Use no-code for frontend/listings, custom backend for payment escrow and matching logic. Stripe Connect handles split payments.",
    "custom": "Required for complex matching algorithms, real-time bidding, or high-volume transaction processing."
  },

  criticalConsiderations: `
- **Chicken-and-egg problem:** Which side will you seed first? Most successful marketplaces start supply-constrained.
- **Payment escrow:** Holding funds between booking and delivery requires Stripe Connect or custom escrow logic.
- **Trust & safety:** Plan for verification, reviews, dispute resolution from day one.
- **Take rate:** What % commission? Too high kills supply, too low kills unit economics.
`,

  commonMistakes: `
- Building both sides simultaneously instead of focusing on supply first
- Underestimating payment escrow complexity (refunds, disputes, splits)
- Launching without trust signals (reviews, verification badges)
- Over-building before validating liquidity on both sides
`
}
```

#### Fintech/Banking Template Overrides

```typescript
{
  targetUserDescription: "Users handling financial data or money movement. Compliance requirements (PCI-DSS, state licenses, KYC/AML) significantly impact architecture and timeline.",

  routeReasoning: {
    "no-code": "Not recommended for fintech. Security, compliance, and audit requirements cannot be met with no-code platforms.",
    "hybrid": "Possible for non-sensitive features (dashboards, reporting). All money movement and PII must be custom-built or use BaaS.",
    "custom": "Required for most fintech applications. Use Banking-as-a-Service (BaaS) providers like Unit, Treasury Prime, or Stripe Treasury to accelerate."
  },

  criticalConsiderations: `
- **PCI-DSS compliance** is mandatory if you touch card data. Consider using Stripe/Plaid to avoid scope.
- **State money transmitter licenses** may be required. BaaS providers often handle this.
- **KYC/AML requirements** - identity verification (Persona, Alloy) is non-negotiable.
- **Security audits** - budget for pen testing and SOC 2 Type II.
- **Audit logging** - every financial transaction must be traceable.
`,

  commonMistakes: `
- Underestimating compliance costs ($50K-$200K+ for licenses)
- Building banking infrastructure instead of using BaaS
- Launching without proper state/federal licenses
- Insufficient security (no MFA, weak encryption)
- Not budgeting for ongoing compliance maintenance
`
}
```

#### Healthcare/Telemedicine Template Overrides

```typescript
{
  targetUserDescription: "Patients, healthcare providers, or health-adjacent users. If handling Protected Health Information (PHI), HIPAA compliance is mandatory.",

  routeReasoning: {
    "no-code": "Only viable for non-PHI applications (wellness, fitness tracking without medical claims).",
    "hybrid": "Possible if PHI stays in HIPAA-compliant backend (AWS HIPAA, Google Cloud Healthcare API).",
    "custom": "Required for telemedicine, EHR integrations, or any PHI handling. Must use HIPAA-compliant infrastructure."
  },

  criticalConsiderations: `
- **HIPAA compliance** is mandatory for PHI. Requires BAA with all vendors.
- **HIPAA-eligible infrastructure:** AWS, GCP, Azure all offer HIPAA-eligible services.
- **Video consultations** require HIPAA-compliant video (Twilio, Doxy.me, Zoom for Healthcare).
- **EHR integration** (Epic, Cerner) adds 3-6 months and significant cost.
- **State telehealth regulations** vary—some require in-state providers.
`,

  commonMistakes: `
- Using non-HIPAA-compliant tools (regular Zoom, standard cloud storage)
- Forgetting Business Associate Agreements (BAAs) with vendors
- Underestimating EHR integration complexity
- Launching telemedicine without understanding state licensing
- Storing PHI without proper encryption (at rest AND in transit)
`
}
```

#### E-commerce Template Overrides

```typescript
{
  targetUserDescription: "Online shoppers and/or merchants. Consider whether you're building a single-brand store or a multi-vendor marketplace.",

  routeReasoning: {
    "no-code": "Shopify, WooCommerce, or Squarespace handle 90% of e-commerce needs. Start here unless you have unique requirements.",
    "hybrid": "Custom product configurators, unique checkout flows, or inventory integrations may need custom code on top of Shopify.",
    "custom": "Only needed for highly customized experiences, complex B2B pricing, or marketplace-style multi-vendor setups."
  },

  criticalConsiderations: `
- **Platform choice:** Shopify handles payments, taxes, shipping out of the box. Don't rebuild this.
- **Inventory management:** Real-time sync with warehouse/fulfillment is harder than it looks.
- **Sales tax compliance:** Use TaxJar or Avalara—tax nexus rules are complex.
- **Shipping rates:** Real-time carrier rates require API integrations (EasyPost, Shippo).
- **Mobile experience:** 70%+ of e-commerce traffic is mobile.
`,

  commonMistakes: `
- Building a custom checkout when Shopify Checkout exists
- Underestimating inventory sync complexity
- Ignoring sales tax until it becomes a legal problem
- Poor mobile experience (slow load times, clunky checkout)
- Not planning for returns/refunds workflow
`
}
```

#### Default Template Overrides (Other/Unknown)

```typescript
{
  targetUserDescription: "Your target users based on the problem you're solving. Define their pain points, current alternatives, and why they'll switch to your solution.",

  routeReasoning: {
    "no-code": "No-code platforms are ideal for validating ideas quickly. You can always migrate to custom code once you've proven demand.",
    "hybrid": "A hybrid approach lets you launch fast with no-code while building custom features that differentiate your product.",
    "custom": "Custom development gives you full control but takes longer. Best when you have specific technical requirements or proven demand."
  },

  criticalConsiderations: `
- **Validate before building:** Can you prove demand with a landing page, waitlist, or concierge MVP?
- **Start smaller:** What's the smallest version that delivers value?
- **Technical moat:** What will be hard for competitors to copy?
- **Distribution:** How will users find you?
`,

  commonMistakes: `
- Building too many features before finding product-market fit
- Choosing technology based on what's "cool" vs. what ships fastest
- Underestimating ongoing maintenance costs
- Not talking to users before/during development
`
}
```

---

### Template Generation Function

```typescript
// shared/utils/clarity-brief-generator.ts

import { VERTICAL_TEMPLATES } from '@shared/vertical-templates';
import { determineRoute } from '@/lib/assessmentData';

interface ClarityBriefData {
  projectName: string;
  founderName: string;
  founderEmail: string;
  currentDate: string;
  problem: string;
  solution: string;
  targetUserDescription: string;
  successGoal: string;
  successMetric: string;
  mustHaveFeatures: string;
  postMvpFeatures: string;
  budget: string;
  timeline: string;
  platform: string;
  buildPreference: string;
  hasCompliance: string;
  route: string;
  routeReasoning: string;
  techStackSuggestion: string;
  criticalConsiderations: string;
  commonMistakes: string;
}

export function generateClarityBriefData(responses: Record<number, any>): ClarityBriefData {
  const productType = responses[2] || "Other";
  const template = VERTICAL_TEMPLATES[productType] || VERTICAL_TEMPLATES.default;
  const { route, complexity } = determineRoute(responses);

  // Parse Q4 features (searchable multi-select returns array)
  const selectedFeatures = responses[4] || [];
  const mustHaveFeatures = selectedFeatures.slice(0, 5)
    .map((f: string) => `- ${f}`)
    .join('\n') || "- [Define your core features]";
  const postMvpFeatures = selectedFeatures.slice(5)
    .map((f: string) => `- ${f}`)
    .join('\n') || "- To be determined based on MVP learnings";

  // Parse Q15 contact details
  const contact = responses[15] || {};
  const founderName = [contact.first_name, contact.last_name]
    .filter(Boolean)
    .join(' ') || "Founder";

  // Parse Q12 problem/solution (structured text)
  const projectDesc = responses[12] || {};

  // Parse Q13 success criteria
  const successCriteria = responses[13] || {};

  // Derive project name from problem statement or contact
  const projectName = contact.project_name ||
    (projectDesc.problem?.split(' ').slice(0, 3).join(' ') + " Solution") ||
    "Your Project";

  return {
    projectName,
    founderName,
    founderEmail: contact.email || "",
    currentDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    problem: projectDesc.problem || "[Describe the problem you're solving]",
    solution: projectDesc.solution || "[Describe your proposed solution]",
    targetUserDescription: template.targetUserDescription,
    successGoal: successCriteria.goal || "[Define your success goal]",
    successMetric: successCriteria.metric || "[Primary metric to track]",
    mustHaveFeatures,
    postMvpFeatures,
    budget: responses[6] || "Not specified",
    timeline: responses[7] || "Not specified",
    platform: responses[3] || "Web",
    buildPreference: responses[8] || "Open to either",
    hasCompliance: (responses[5] || []).includes("Compliance") ? "Yes" : "No",
    route: route.charAt(0).toUpperCase() + route.slice(1),
    routeReasoning: template.routeReasoning[route],
    techStackSuggestion: template.techStackSuggestions[route],
    criticalConsiderations: template.criticalConsiderations,
    commonMistakes: template.commonMistakes,
  };
}

export function generateClarityBriefMarkdown(data: ClarityBriefData): string {
  // Use the base template and replace all placeholders
  let markdown = BASE_CLARITY_BRIEF_TEMPLATE;

  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    markdown = markdown.replace(new RegExp(placeholder, 'g'), value || '');
  }

  // Remove email line if empty
  if (!data.founderEmail) {
    markdown = markdown.replace(/\*\*Email:\*\*\s*\n/g, '');
  }

  return markdown;
}
```

---

## Appendix E: Output Format Specification

### Free Tier Download Flow

```
User clicks "Download Clarity Brief"
         ↓
    generateClarityBriefMarkdown(responses)
         ↓
    Returns Markdown string
         ↓
    Client creates Blob and triggers download
```

### Implementation (Client-Side Download)

```typescript
// client/src/pages/Results.tsx

function downloadClarityBrief() {
  const data = generateClarityBriefData(responses);
  const markdown = generateClarityBriefMarkdown(data);

  // Create downloadable file
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.projectName.replace(/\s+/g, '_')}_Clarity_Brief.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

### Output Formats by Tier

| Tier | Document | Format | Generation | Delivery |
|------|----------|--------|------------|----------|
| **Free** | Clarity Brief Lite | `.md` (Markdown) | Template + placeholders (client-side) | Direct download |
| **Paid** | Clarity Brief Enhanced | `.docx` | AI-generated → docx conversion (server-side) | Email + dashboard |
| **Paid** | Hiring Playbook | `.docx` | AI-generated → docx conversion | Email + dashboard |
| **Paid** | PRD Document | `.docx` | AI-generated → docx conversion | Email + dashboard |
| **Paid** | Working Agreement | `.docx` | AI-generated → docx conversion | Email + dashboard |

### Why Markdown for Free Tier?

1. **No server call needed** - 100% client-side generation
2. **Universal format** - Opens in any text editor, GitHub, Notion, etc.
3. **Easy to convert** - Users can paste into Google Docs, Notion, or use pandoc
4. **Small file size** - Instant download

### Results Page UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  YOUR RESULTS                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Route Card]  [Tech Stack Card]  [Cost Range Card]             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  YOUR DOCUMENTS                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Project Clarity Brief     [Download .md]                    │
│     Your project scope doc                                      │
│                                                                 │
│  🔒 Hiring Playbook           [Unlock - $149]                   │
│     Interview guides & eval criteria                            │
│                                                                 │
│  🔒 Product Requirements Doc  [Unlock - $149]                   │
│     Complete PRD for developers                                 │
│                                                                 │
│  🔒 Working Agreement         [Unlock - $149]                   │
│     Contract template                                           │
│                                                                 │
│  ─────────────────────────────────────────                      │
│  [Get All 4 Documents - $149]                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Button States

```typescript
interface DocumentCardProps {
  title: string;
  description: string;
  isUnlocked: boolean;
  onDownload?: () => void;
  onUpgrade?: () => void;
}

// Free tier user sees:
// - Clarity Brief: isUnlocked=true, onDownload=downloadClarityBrief
// - Other 3 docs: isUnlocked=false, onUpgrade=goToCheckout

// Paid tier user sees:
// - All 4 docs: isUnlocked=true, onDownload=downloadFromDashboard
```

---

## Appendix F: Add Target User Question

### Problem

The Project Clarity Brief and PRD both have empty "Target User" sections because the assessment doesn't ask about target users.

**Current state in `prd-generator.ts:129`:**
```typescript
primaryUser: "Primary user needs further exploration from client",
painPoints: [], // Not currently captured in assessment
```

### Solution: Add New Assessment Question

Add Q16 (or insert as Q3.5) to capture target user information.

#### Question Design (Research-Backed)

Based on [HubSpot buyer persona research](https://blog.hubspot.com/marketing/buyer-persona-questions) and [UX persona best practices](https://www.userinterviews.com/ux-research-field-guide-chapter/personas):

**Q16: Who is your primary user?**

```typescript
// In client/src/lib/assessmentData.ts - add after Q15

{
  id: 16,
  section: "E",  // Project Success Definition section
  question: "Q16: Who is your primary user?",
  helperText: "Select the type that best describes who will use your product daily.",
  type: "single",
  options: [
    "Consumers (B2C - individuals buying for personal use)",
    "Small business owners or freelancers",
    "Enterprise employees (B2B - using at work)",
    "Internal team members (company tool)",
    "Two-sided: Both buyers AND sellers/providers",
    "Healthcare professionals (doctors, nurses, staff)",
    "Students, teachers, or trainers",
    "Developers or technical users",
    "Other (describe below)",
  ],
  required: true,
},
{
  id: 17,
  section: "E",
  question: "Q17: Describe your target user's main pain point",
  helperText: "What frustrates them most about their current solution or process? Be specific.",
  type: "text",
  required: true,
},
```

#### Why This Design Works

1. **Multiple choice first** - Quick to answer, enables segmentation
2. **Pain point as open text** - Extracts the "why" that drives buying decisions
3. **Placed in Section E** - After they've described the product, before contact info
4. **Options cover all verticals** - Maps to existing product types

#### Mapping Table

| Q16 Answer | Maps to Vertical | Document Language |
|------------|------------------|-------------------|
| Consumers (B2C) | E-commerce, Communication | "Your end users are individual consumers..." |
| Small business owners | Business SaaS | "Your primary users are SMB owners and operators..." |
| Enterprise employees | Business SaaS, Analytics | "Your users are enterprise employees who..." |
| Internal team | Internal Tool | "Your internal team members will use this to..." |
| Two-sided | Marketplace | "You have two user types: [supply side] and [demand side]..." |
| Healthcare professionals | Healthcare | "Healthcare providers using your platform..." |
| Students/teachers | Education | "Your learning platform serves..." |
| Developers | API/Backend | "Technical users integrating your API..." |

#### Update PRD Generator

```typescript
// In server/services/prd-generator.ts - update extractPRDData()

extractPRDData(responses: AssessmentResponses, userName: string, route: string): PRDData {
  // ... existing code ...

  // NEW: Extract target user from Q16 and Q17
  const userTypeAnswer = String(responses[16] || "").trim();
  const userPainPoint = String(responses[17] || "").trim();

  const primaryUser = userTypeAnswer
    ? `${userTypeAnswer}${userPainPoint ? `. Pain point: ${userPainPoint}` : ""}`
    : "Primary user needs further exploration from client";

  return {
    // ... existing fields ...
    primaryUser,  // Now populated from assessment
    painPoints: userPainPoint ? [userPainPoint] : [],
  };
}
```

#### Update Document Templates

**Project Clarity Brief (line 351-352):**
```typescript
**4. TARGET USER**
${data.primaryUser}
```

**PRD Document (line 477-478):**
```typescript
**Target Users:**
${data.primaryUser}
```

**PRD Personas Table (line 484-486):**
```typescript
| User Type | Description | Primary Goals |
|---|---|---|
| ${data.primaryUser.split('.')[0]} | ${data.primaryUser} | Solve: ${data.painPoints[0] || '[TBD]'} |
```

---

## Appendix G: Fix MVP Phase Feature Distribution

### Problem

Two different systems generate phase breakdowns with inconsistent results:

| Component | Source | Current Behavior |
|-----------|--------|------------------|
| `PhasedDevelopmentCard` (top) | `mvp-phaser.ts` | Shows only 1 feature in MVP |
| `CostOptimization` (bottom) | `cost-optimizer.ts` | Always shows exactly 2 features |

**User expectation:** MVP should have 2-3 features minimum.

### Root Cause Analysis

#### Issue 1: `mvp-phaser.ts` - Overly Aggressive PHASE2_CANDIDATES

```typescript
// Lines 47-57 - These keywords push features to Phase 2 even when they're MVP-critical
const PHASE2_CANDIDATES = [
  "analytics", "reporting", "advanced dashboard", "admin panel",
  "user profiles",  // ← PROBLEM: Profiles are often MVP-critical
  "settings", "notifications", "email",
  "search",         // ← PROBLEM: Search is often MVP-critical
];
```

**Example:** For a CRM (Client Tracker):
- `user_profiles` → matched "user profiles" → Phase 2 (WRONG)
- `search_filter` → matched "search" → Phase 2 (WRONG)
- `dashboard_home` → no match → Phase 2 (if >7 features) or MVP
- Only `file_uploads` made it to MVP

#### Issue 2: `cost-optimizer.ts` - Hardcoded Slicing

```typescript
// Lines 416-418 - Always exactly 2/2/3, ignores product context
const mvpFeatures = prioritized.essential.concat(prioritized.highValue).slice(0, 2);
const phase2Features = prioritized.highValue.slice(2, 4);
const phase3Features = prioritized.canWait.slice(0, 3);
```

### Solution: Unified Phase System with Minimum Guarantees

#### Step 1: Remove Conflicting System

Delete the `mvpApproach` generation from `cost-optimizer.ts` (lines 416-443) and have `CostOptimization.tsx` use `phaseBreakdown` from `mvp-phaser.ts` instead.

```typescript
// Results.tsx - pass phaseBreakdown to both components
<PhasedDevelopmentCard phaseBreakdown={mvpPhaseBreakdown} ... />
<CostOptimization plan={optimizationPlan} phaseBreakdown={mvpPhaseBreakdown} />
```

```typescript
// CostOptimization.tsx - use phaseBreakdown instead of plan.mvpApproach
interface CostOptimizationProps {
  plan: CostOptimizationPlan;
  phaseBreakdown?: MVPPhaseBreakdown;  // Add this
}

// In the component, replace plan.mvpApproach with:
const mvpApproach = phaseBreakdown ? {
  phase1: {
    features: phaseBreakdown.mvpFeatures.map(f => f.name),
    cost: `$${(phaseBreakdown.mvpCostEstimate.min / 1000).toFixed(0)}K-$${(phaseBreakdown.mvpCostEstimate.max / 1000).toFixed(0)}K`,
    timeline: "4-8 weeks",
    description: "Launch MVP with essential features",
  },
  phase2: phaseBreakdown.phase2Features.length > 0 ? {
    features: phaseBreakdown.phase2Features.map(f => f.name),
    cost: `$${(phaseBreakdown.phase2CostEstimate.min / 1000).toFixed(0)}K-$${(phaseBreakdown.phase2CostEstimate.max / 1000).toFixed(0)}K`,
    timeline: "4-6 weeks after Phase 1",
    description: "Add high-value features based on feedback",
  } : undefined,
  phase3: phaseBreakdown.phase3Features.length > 0 ? {
    features: phaseBreakdown.phase3Features.map(f => f.name),
    cost: `$${(phaseBreakdown.phase3CostEstimate.min / 1000).toFixed(0)}K-$${(phaseBreakdown.phase3CostEstimate.max / 1000).toFixed(0)}K`,
    timeline: "6-8 weeks after Phase 2",
    description: "Scale based on traction",
  } : undefined,
} : plan.mvpApproach;
```

#### Step 2: Fix `mvp-phaser.ts` Classification Logic

**A. Move product-critical features OUT of PHASE2_CANDIDATES:**

```typescript
// BEFORE (too aggressive)
const PHASE2_CANDIDATES = [
  "analytics", "reporting", "advanced dashboard", "admin panel",
  "user profiles", "settings", "notifications", "email", "search",
];

// AFTER (only truly deferrable items)
const PHASE2_CANDIDATES = [
  "analytics",
  "reporting",
  "advanced dashboard",  // Keep "advanced" qualifier
  "admin panel",
  "settings",
  "notifications",
  "email notifications",  // Be more specific
  // REMOVED: "user profiles", "search" - these are often MVP-critical
];
```

**B. Add minimum MVP feature guarantee:**

```typescript
// In generateMVPPhaseBreakdown(), after classification (around line 720)

// GUARANTEE: MVP must have at least 2 features (ideally 3)
const MIN_MVP_FEATURES = 2;
const IDEAL_MVP_FEATURES = 3;

if (mvpFeatures.length < MIN_MVP_FEATURES && nonMvp.length > 0) {
  // Pull highest-value features from Phase 2 into MVP
  const toPromote = nonMvp
    .filter(f => f.phase === "phase2")
    .sort((a, b) => {
      // Prioritize by estimated value (lower hours = simpler = promote first for MVP)
      const aHours = (a.estimatedHours.min + a.estimatedHours.max) / 2;
      const bHours = (b.estimatedHours.min + b.estimatedHours.max) / 2;
      return aHours - bHours;
    })
    .slice(0, IDEAL_MVP_FEATURES - mvpFeatures.length);

  for (const feature of toPromote) {
    const idx = nonMvp.findIndex(f => f.name === feature.name);
    if (idx !== -1) {
      nonMvp.splice(idx, 1);
      mvpFeatures.push({
        ...feature,
        phase: "mvp",
        reasoning: `${feature.reasoning} • Promoted to ensure viable MVP`,
      });
    }
  }
}
```

**C. Add product-type-aware MVP requirements:**

```typescript
// Add before the classification loop

const VERTICAL_MVP_REQUIREMENTS: Record<string, string[]> = {
  "marketplace": ["profiles", "listings", "search"],
  "saas": ["dashboard", "user management"],
  "ecommerce": ["catalog", "cart", "checkout"],
  "internal": ["dashboard", "data entry"],
  "crm": ["contacts", "search", "dashboard"],  // Add CRM pattern
};

function getVerticalMvpRequirements(projectType: string, description: string): string[] {
  const descLower = description.toLowerCase();
  const typeLower = projectType.toLowerCase();

  // Detect CRM/client tracker pattern
  if (descLower.includes("client") || descLower.includes("crm") ||
      descLower.includes("contact") || descLower.includes("customer")) {
    return VERTICAL_MVP_REQUIREMENTS["crm"];
  }

  // ... existing vertical detection ...

  return [];
}
```

**D. Use vertical requirements in classification:**

```typescript
// In classifyFeature(), before checking PHASE2_CANDIDATES

const verticalMvpKeywords = getVerticalMvpRequirements(projectType, projectDescription || "");

// If feature matches vertical MVP requirement, force MVP
for (const keyword of verticalMvpKeywords) {
  if (featureLower.includes(keyword)) {
    return {
      phase: "mvp",
      reasoning: `Critical for ${projectType} - core to minimum viable product`,
    };
  }
}

// Then continue with existing PHASE2_CANDIDATES check...
```

### Expected Result After Fix

**Before (Client Tracker):**
- MVP: file_uploads (1 feature)
- Phase 2: user_profiles, dashboard_home, search_filter (3 features)
- Phase 3: Third-party integrations (1 feature)

**After (Client Tracker):**
- MVP: user_profiles, dashboard_home, search_filter (3 features)
- Phase 2: file_uploads, Third-party integrations (2 features)
- Phase 3: (suggested enhancements like analytics, reports)

### Testing Checklist

- [ ] CRM/Client Tracker shows 2-3 features in MVP
- [ ] Marketplace shows profiles + listings in MVP
- [ ] E-commerce shows catalog + cart + checkout in MVP
- [ ] Both PhasedDevelopmentCard and CostOptimization show same features
- [ ] Phase costs match between sections
- [ ] Minimum 2 features always in MVP (never 0 or 1)

---

## Summary: Priority Fixes for Launch

| Priority | Task | File(s) | Effort |
|----------|------|---------|--------|
| **P0** | Add target user question (Q16, Q17) | `assessmentData.ts`, `prd-generator.ts` | 1-2 hours |
| **P0** | Fix MVP minimum feature count | `mvp-phaser.ts` | 1-2 hours |
| **P1** | Unify phase display systems | `cost-optimizer.ts`, `CostOptimization.tsx`, `Results.tsx` | 1-2 hours |
| **P1** | Remove aggressive PHASE2_CANDIDATES | `mvp-phaser.ts` | 30 min |

Sources:
- [HubSpot: 40+ Buyer Persona Questions](https://blog.hubspot.com/marketing/buyer-persona-questions)
- [User Interviews: Personas Guide](https://www.userinterviews.com/ux-research-field-guide-chapter/personas)
- [Interaction Design Foundation: User Persona Guide](https://www.interaction-design.org/literature/article/user-persona-guide)

---

## Appendix H: Vercel Deployment

### Challenge

This app has two parts:
- **Frontend:** React/Vite (Vercel handles natively)
- **Backend:** Express/tRPC (needs serverless adaptation)

Vercel doesn't run traditional Express servers - it uses serverless functions.

### Option A: Vercel Serverless (Recommended)

Create `api/index.ts` to wrap Express as a serverless function:

```typescript
// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/_core/index';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
```

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": null,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.ts" }
  ],
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@3",
      "maxDuration": 30
    }
  }
}
```

**Required changes to server code:**

1. Export the Express app from `server/_core/index.ts`:
```typescript
// At the end of server/_core/index.ts
export default app;
```

2. Make server start conditional (only when not serverless):
```typescript
// server/_core/index.ts
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
```

### Option B: Split Deployment (Simpler)

Deploy frontend and backend separately:

| Part | Platform | Why |
|------|----------|-----|
| Frontend | Vercel | Native Vite support |
| Backend | Railway ($5/mo) | Native Express support |

**Steps:**

1. **Frontend (Vercel):**
   - Connect repo to Vercel
   - Set build command: `vite build`
   - Set output directory: `dist/public`
   - Add env var: `VITE_API_URL=https://your-railway-app.up.railway.app`

2. **Backend (Railway):**
   - Create new project → Deploy from GitHub
   - Set start command: `npm run start`
   - Add all env vars (DATABASE_URL, STRIPE keys, etc.)

3. **Update frontend API calls:**
   - Point tRPC client to Railway URL instead of relative `/api`

### Environment Variables for Vercel

Add these in Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL=mysql://...@tidbcloud.com:4000/test
STRIPE_SECRET_KEY=sk_live_xxx (or sk_test_xxx for testing)
STRIPE_WEBHOOK_SECRET=whsec_xxx
RESEND_API_KEY=re_xxx
JWT_SECRET=xxx
NODE_ENV=production
```

### Domain Configuration

1. In Vercel dashboard → Settings → Domains
2. Add `thefounderlink.com`
3. Vercel will provide DNS records
4. Add records at your domain registrar
5. Wait for SSL provisioning (automatic)

### Testing Webhook in Production

After deploying, test Stripe webhook:

1. Go to Stripe Dashboard → Webhooks
2. Find your endpoint
3. Click "Send test webhook"
4. Select `checkout.session.completed`
5. Check Vercel logs for successful processing

### Recommendation

For fastest path to launch tonight:
- **Use Option B (Split Deployment)** - No code changes needed
- Frontend stays on Vercel, backend on Railway
- Can migrate to Option A later if desired
