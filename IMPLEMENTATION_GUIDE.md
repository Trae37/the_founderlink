# Implementation Guide: Detailed Product Categories

> **Purpose:** This document guides the implementation assistant through adding detailed product categories to the assessment system, connecting them to the MVP knowledge base for better cost estimates and document generation.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Current Assessment Questions Reference](#current-assessment-questions-reference)
3. [Current State Analysis](#current-state-analysis)
4. [Target State](#target-state)
5. [Data Flow Architecture](#data-flow-architecture)
6. [Implementation Tasks](#implementation-tasks)
7. [File Reference](#file-reference)
8. [Testing Checklist](#testing-checklist)
9. [Design Decisions Made](#design-decisions-made)
10. [Appendix A: 2025 Pricing Research](#appendix-a-2025-pricing-research)
11. [Appendix B: MVP Knowledge Base Categories](#appendix-b-mvp-knowledge-base-categories)
12. [Appendix C: Document Output Structures](#appendix-c-document-output-structures)

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
4. **The detailed categories already exist** - They're just not wired up

---

## Current Assessment Questions Reference

**File:** `client/src/lib/assessmentData.ts`

The assessment has 15 questions across 4 sections. Here is the complete reference:

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

#### Q9: How comfortable are you managing a developer?
**Type:** Single select | **Required:** Yes

| Option |
|--------|
| Very comfortable (I've done this before) |
| Somewhat comfortable (I can figure it out) |
| Not comfortable (I'll need guidance) |
| No idea what to expect |

---

#### Q10: Have you hired developers before?
**Type:** Single select | **Required:** Yes

| Option |
|--------|
| Multiple times |
| Once before |
| First time |
| Only worked with agencies |

---

### Section D: Project Details

#### Q11: What are your timezone requirements?
**Type:** Single select | **Required:** Yes

| Option |
|--------|
| Must overlap with my working hours (specify timezone) |
| Prefer overlap, but async is okay |
| No preference (async is fine) |
| Not sure |

---

#### Q12: Describe what you're building
**Type:** Text (free form) | **Required:** Yes

*Used for:*
- AI category validation (matches against Q2 selection)
- PRD document generation (problem/solution statements)
- MVP knowledge base matching

---

#### Q13: How will you measure success?
**Type:** Text (free form) | **Required:** Yes

*Used for:*
- Success criteria in Project Clarity Brief
- Goal/metric definition in documents

---

#### Q14: What tools or services need to integrate with your product?
**Type:** Multi-select | **Required:** Yes

| Option |
|--------|
| Stripe (payments) |
| Google Calendar |
| Slack |
| Twilio (SMS) |
| SendGrid / email service |
| Zapier |
| Google Maps |
| Social login (Google, Apple, etc.) |
| Analytics (Mixpanel, Amplitude, etc.) |

---

#### Q15: Contact details
**Type:** Text (structured) | **Required:** Yes

*Captures:*
- First name
- Last name
- Email
- Project name (optional)

---

### Route Determination Logic Summary

The `determineRoute()` function uses responses to calculate:

**No-Code Score Factors:**
| Factor | Score Impact |
|--------|-------------|
| Budget under $10K | +3 |
| Budget $10K-$20K | +2 |
| Budget $20K-$40K | +1 |
| Web only platform | +3 |
| Platform not sure | +1 |
| Mobile platform | -4 |
| No-code preference | +3 |
| Custom code preference | -3 |
| 3 or fewer features | +2 |
| 5+ features | -1 |
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

**Complexity Score:**
| Factor | Points |
|--------|--------|
| Each core feature (max 5) | +1 each |
| Third-party integrations | +1 |
| Payments/subscriptions | +1 |
| User authentication | +1 |
| Admin dashboard | +1 |
| Real-time features | +2 |
| Mobile requirement | +2 |
| Compliance requirements | +2 |

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

```typescript
export const PRODUCT_TYPE_TO_CATEGORY_MAP: Record<string, string[]> = {
  "Marketplace (connecting buyers/sellers, service providers, freelancers)": [
    "Marketplaces & Platforms",
  ],
  "Business SaaS (CRM, project management, team tools)": [
    "Core Business SaaS",
  ],
  "Communication Platform (chat, video, social network, forums)": [
    "Communication & Social",
  ],
  "Fintech/Banking (payments, lending, financial tools)": [
    "Vertical-Specific SaaS",
  ],
  "Healthcare/Telemedicine (patient care, booking, health tracking)": [
    "Vertical-Specific SaaS",
  ],
  "E-commerce (online store, shopping platform)": [
    "Marketplaces & Platforms",
    "Core Business SaaS",
  ],
  "Education/Learning (courses, LMS, tutoring)": [
    "Vertical-Specific SaaS",
    "Marketplaces & Platforms",
  ],
  "Analytics/Data Platform (dashboards, reporting, BI tools)": [
    "Technical & Developer Tools",
    "Core Business SaaS",
  ],
  "Other (describe below)": [],
};
```

### MVP Knowledge Base Categories

**File:** `shared/mvp-knowledge-base.json`

The knowledge base contains 50 MVP types across these categories:
- `Core Business SaaS` - CRM, Project Management, HR tools, etc.
- `Marketplaces & Platforms` - Two-sided marketplaces, service platforms
- `Communication & Social` - Chat, video, social networks
- `Vertical-Specific SaaS` - Fintech, Healthcare, Education, Legal
- `Technical & Developer Tools` - APIs, analytics, dev tools

### Category Validator (uses simple categories)

**File:** `server/services/category-validator.ts` (lines 5-14)

```typescript
export const PRODUCT_CATEGORIES = [
  "Web application (SaaS, dashboard, portal)",
  "Mobile app",
  "Marketplace (two-sided)",
  "E-commerce",
  "Internal tool",
  "Browser extension",
  "API / Backend service",
  "Other",
] as const;
```

---

## Target State

After implementation:

1. **Q2 will show detailed product categories** matching `mvp-category-mapper.ts`
2. **Q2.5 conditional question** appears when "Other" is selected
3. **Route determination** considers compliance-heavy verticals (Fintech, Healthcare)
4. **Cost estimates** use correct MVP knowledge base category filtering
5. **Documents** include vertical-specific guidance
6. **Category validator** uses detailed categories for AI validation

---

## Data Flow Architecture

### Current Flow (Simplified)

```
Assessment (Q2: simple type)
    ↓
determineRoute() → route + complexity
    ↓
getCostEstimate(route, complexity, features, timeline, description, productType)
    ↓
getCategoriesForProductType(productType) → returns null (no match!)
    ↓
matchProjectToMVP() → searches ALL categories (inefficient)
    ↓
Results page shows estimates
    ↓
PRD Generator uses productType for documents
```

### Target Flow (After Implementation)

```
Assessment (Q2: detailed type from mvp-category-mapper)
    ↓
    ├─→ Q2.5 (conditional, if "Other" selected)
    ↓
determineRoute() → route + complexity + compliance signals
    ↓
getCostEstimate(route, complexity, features, timeline, description, productType)
    ↓
getCategoriesForProductType(productType) → returns ["Vertical-Specific SaaS"] (match!)
    ↓
matchProjectToMVP() → searches ONLY relevant categories (efficient)
    ↓
Results page shows accurate estimates
    ↓
PRD Generator uses productType + vertical guidance for documents
```

---

## Implementation Tasks

### Task 1: Update Assessment Question Data

**File:** `client/src/lib/assessmentData.ts`

**Location:** Lines 52-68 (Q2 question definition)

**Action:** Replace the Q2 options array with detailed product types

**Before:**
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

**After:**
```typescript
{
  id: 2,
  section: "A",
  question: "Q2: What type of product are you building?",
  helperText: "Choose the category that best describes your product. This helps us provide more accurate cost estimates and recommendations.",
  type: "single",
  options: [
    // NOTE: "Mobile app" removed - Q3 already captures platform (Web/Mobile/Both)
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
```

**Then add Q2.5 immediately after Q2 (around line 69):**

```typescript
{
  id: 2.5,
  section: "A",
  question: "Q2.5: Describe your product type",
  helperText: "Tell us more about what you're building so we can provide better recommendations.",
  type: "text",
  required: true,
  conditional: {
    questionId: 2,
    value: "Other (describe below)",
  },
},
```

**Why:** The detailed categories match exactly what `mvp-category-mapper.ts` expects, enabling accurate category filtering for MVP matching.

---

### Task 2: Update Route Determination Logic

**File:** `client/src/lib/assessmentData.ts`

**Location:** `determineRoute()` function (lines 240-366)

**Action:** Add compliance-heavy vertical detection and adjust scoring

**Find this section (around line 242-257):**
```typescript
export function determineRoute(responses: AssessmentResponse): RouteResult {
  const budget = String(responses[6] || "").replace(/\u2013|\u2014/g, "-");
  const projectType = String(responses[2] || "");
  const platform = String(responses[3] || "");
  const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];
  const buildPreference = String(responses[8] || "").replace(/\u2013|\u2014/g, "-");
  const timeline = String(responses[7] || "");

  const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);

  const hasMobilePlatform =
    platform.includes("Mobile") || platform.includes("Web + Mobile") || projectType === "Mobile app";

  const hasRealTime = dayOneNeeds.includes("Real-time features (chat, notifications, live updates)");
  const hasCompliance = dayOneNeeds.includes("Compliance (HIPAA, SOC2, GDPR, PCI)");
  const hasMobileRequirement = dayOneNeeds.includes("Mobile app (native or PWA)") || hasMobilePlatform;
  const hasThirdPartyIntegrations = dayOneNeeds.includes("Third-party integrations");
```

**Add after line 257 (after `hasThirdPartyIntegrations`):**
```typescript
  // Detect compliance-heavy verticals that typically require custom development
  const COMPLIANCE_HEAVY_VERTICALS = [
    "Fintech/Banking (payments, lending, financial tools)",
    "Healthcare/Telemedicine (patient care, booking, health tracking)",
  ];
  const isComplianceHeavyVertical = COMPLIANCE_HEAVY_VERTICALS.includes(projectType);

  // Detect verticals that benefit from custom code for scalability
  const CUSTOM_PREFERRED_VERTICALS = [
    "Analytics/Data Platform (dashboards, reporting, BI tools)",
    "API / Backend service",
  ];
  const isCustomPreferredVertical = CUSTOM_PREFERRED_VERTICALS.includes(projectType);
```

**Find the complexity scoring section (around line 307-317):**
```typescript
  let complexity: "simple" | "standard" | "complex";
  let complexityScore = 0;
  complexityScore += Math.min(coreFeatures.length, 5);

  if (hasThirdPartyIntegrations) complexityScore += 1;
  if (dayOneNeeds.includes("Payments / subscriptions")) complexityScore += 1;
  if (dayOneNeeds.includes("User authentication (login/signup)")) complexityScore += 1;
  if (dayOneNeeds.includes("Admin dashboard")) complexityScore += 1;
  if (hasRealTime) complexityScore += 2;
  if (hasMobileRequirement) complexityScore += 2;
  if (hasCompliance) complexityScore += 2;
```

**Add after line 317 (after `if (hasCompliance) complexityScore += 2;`):**
```typescript
  // Compliance-heavy verticals add complexity even if user didn't select compliance checkbox
  if (isComplianceHeavyVertical) complexityScore += 2;
```

**Find the route forcing logic (around line 293-305):**
```typescript
  if (hasCompliance || hasMobileRequirement) {
    route = "custom";
  } else if (hasRealTime) {
    route = "custom";
  } else if (noCodeScore >= 7) {
    route = "no-code";
  } else if (noCodeScore >= 3) {
    route = "hybrid";
  } else {
    route = "custom";
  }
```

**Replace with:**
```typescript
  if (hasCompliance || hasMobileRequirement) {
    route = "custom";
  } else if (hasRealTime) {
    route = "custom";
  } else if (isComplianceHeavyVertical) {
    // Fintech/Healthcare should default to custom unless user explicitly wants no-code
    // and has a very simple scope
    if (buildPreference.includes("No-code") && noCodeScore >= 10) {
      route = "hybrid"; // Allow hybrid as a compromise
    } else {
      route = "custom";
    }
  } else if (isCustomPreferredVertical) {
    // Analytics/API projects benefit from custom code
    if (noCodeScore >= 10) {
      route = "hybrid";
    } else {
      route = "custom";
    }
  } else if (noCodeScore >= 7) {
    route = "no-code";
  } else if (noCodeScore >= 3) {
    route = "hybrid";
  } else {
    route = "custom";
  }
```

**Why:** Fintech and Healthcare projects almost always need custom development due to compliance requirements (PCI-DSS, HIPAA), even if the user didn't explicitly check the compliance box. This prevents recommending no-code for projects that will inevitably hit compliance walls.

---

### Task 3: Update Category Validator

**File:** `server/services/category-validator.ts`

**Location:** Lines 5-35 (PRODUCT_CATEGORIES and definitions)

**Action:** Replace simple categories with detailed ones

**Replace lines 5-14:**
```typescript
// NOTE: "Mobile app" removed - Q3 captures platform separately
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

**Replace lines 18-35 (PRODUCT_CATEGORY_DEFINITIONS):**
```typescript
const PRODUCT_CATEGORY_DEFINITIONS: Record<ProductCategory, string> = {
  "Marketplace (connecting buyers/sellers, service providers, freelancers)":
    "A platform connecting two distinct user groups for transactions, bookings, or services. Examples: Airbnb, Upwork, Fiverr, TaskRabbit. Core value is matching supply and demand.",
  "Business SaaS (CRM, project management, team tools)":
    "Software-as-a-service for business operations: customer relationship management, project tracking, team collaboration, HR tools. Examples: Salesforce, Asana, Notion, BambooHR.",
  "Communication Platform (chat, video, social network, forums)":
    "Applications focused on communication, social interaction, or community building. Examples: Slack, Discord, community forums, social networks. Often requires real-time features.",
  "Fintech/Banking (payments, lending, financial tools)":
    "Financial technology applications: payment processing, lending platforms, banking services, investment tools, expense tracking. Typically requires PCI-DSS compliance and financial regulations.",
  "Healthcare/Telemedicine (patient care, booking, health tracking)":
    "Healthcare applications: patient portals, telemedicine video visits, appointment booking, health tracking, medical records. Often requires HIPAA compliance in the US.",
  "E-commerce (online store, shopping platform)":
    "Online retail: product catalog, shopping cart, checkout, order management, inventory. Direct-to-consumer or B2B sales platforms.",
  "Education/Learning (courses, LMS, tutoring)":
    "Educational technology: course platforms, learning management systems, tutoring marketplaces, student management. Examples: Teachable, Canvas, Coursera-style platforms.",
  "Analytics/Data Platform (dashboards, reporting, BI tools)":
    "Data visualization and business intelligence: analytics dashboards, reporting tools, data processing pipelines. Heavy focus on data handling and visualization.",
  "Internal tool (ops dashboard, admin panel)":
    "Private applications for internal company use: operations dashboards, admin panels, workflow automation tools. Not customer-facing, focused on efficiency.",
  "API / Backend service":
    "Backend systems exposing APIs for other software. Focus on data processing, integrations, authentication, reliability. No end-user interface.",
  Other:
    "Product doesn't clearly fit above categories, is a hybrid of multiple types, or requires further clarification to categorize.",
};
```

**Why:** The AI validator uses these definitions to check if the user's written description (Q12) matches their selected category. More detailed definitions = more accurate validation.

---

### Task 4: Update MVP Category Mapper

**File:** `shared/mvp-category-mapper.ts`

**Location:** Lines 5-36 (PRODUCT_TYPE_TO_CATEGORY_MAP)

**Action:** Add the two new categories that aren't currently mapped

**Add these entries to `PRODUCT_TYPE_TO_CATEGORY_MAP` (around line 33):**
```typescript
  "Internal tool (ops dashboard, admin panel)": [
    "Core Business SaaS", // Internal tools are similar to business SaaS
  ],
  "API / Backend service": [
    "Technical & Developer Tools",
  ],
```

**Why:** These two categories were in the simple Q2 but weren't in the detailed mapper. Adding them ensures all Q2 options map to MVP knowledge base categories.

---

### Task 5: Update PRD Generator for Vertical-Specific Guidance

**File:** `server/services/prd-generator.ts`

**Location:** `generateProjectClarityBrief()` function (lines 330-376)

**Action:** Add vertical-specific guidance to the Project Clarity Brief

**Find the end of the function (around line 375) and modify the CONSTRAINTS section:**

**Before (around line 364-370):**
```typescript
**7. CONSTRAINTS**
- Budget: ${data.totalBudget}
- Timeline: ${timelineLabel || "TBD"}
- Platform: ${data.platform}
- Compliance: ${complianceLine}
- Technical preferences: ${data.buildPreference || "Not specified"}
```

**After:**
```typescript
**7. CONSTRAINTS**
- Budget: ${data.totalBudget}
- Timeline: ${timelineLabel || "TBD"}
- Platform: ${data.platform}
- Compliance: ${complianceLine}
- Technical preferences: ${data.buildPreference || "Not specified"}
${this.getVerticalSpecificConstraints(data.productType)}
```

**Then add this helper method to the PRDGenerator class (around line 650):**

```typescript
  /**
   * Get vertical-specific constraints and considerations
   */
  private getVerticalSpecificConstraints(productType: string): string {
    const verticalGuidance: Record<string, string> = {
      "Fintech/Banking (payments, lending, financial tools)": `
**Fintech-Specific Considerations:**
- PCI-DSS compliance required for payment card data
- Consider state money transmitter licenses if handling funds
- Bank-level security expectations (encryption, audit trails)
- Integration with banking APIs (Plaid, Stripe Connect, etc.)`,

      "Healthcare/Telemedicine (patient care, booking, health tracking)": `
**Healthcare-Specific Considerations:**
- HIPAA compliance required for protected health information (PHI)
- BAA (Business Associate Agreement) needed with cloud providers
- Audit logging for all PHI access
- Consider telehealth-specific regulations by state`,

      "Marketplace (connecting buyers/sellers, service providers, freelancers)": `
**Marketplace-Specific Considerations:**
- Two-sided marketplace dynamics (chicken-and-egg problem)
- Consider starting with one side first (supply or demand)
- Payment escrow and dispute resolution
- Trust & safety features (reviews, verification)`,

      "E-commerce (online store, shopping platform)": `
**E-commerce-Specific Considerations:**
- PCI compliance for payment processing
- Inventory management and order fulfillment
- Shipping integrations (ShipStation, EasyPost)
- Tax calculation by jurisdiction (TaxJar, Avalara)`,

      "Education/Learning (courses, LMS, tutoring)": `
**EdTech-Specific Considerations:**
- Content hosting and streaming (video, documents)
- Progress tracking and completion certificates
- FERPA compliance if serving K-12 or higher ed
- Accessibility requirements (WCAG compliance)`,
    };

    return verticalGuidance[productType] || "";
  }
```

**Why:** Users building Fintech or Healthcare products need to know about compliance requirements upfront. This adds value to the paid documents by providing vertical-specific guidance.

---

### Task 6: Update Hiring Playbook for Vertical-Specific Skills

**File:** `server/services/prd-generator.ts`

**Location:** `generateHiringPlaybook()` function (lines 378-456)

**Action:** Add vertical-specific skill requirements

**Find the "Required Skills" section (around line 400-403):**
```typescript
**Required Skills:**
- Primary: ${input?.techStackSuggestion || "TBD"}
- Secondary: Product thinking, clear communication, reliable delivery
- Nice-to-have: Prior builds in your category (${data.productType || "TBD"})
```

**Replace with:**
```typescript
**Required Skills:**
- Primary: ${input?.techStackSuggestion || "TBD"}
- Secondary: Product thinking, clear communication, reliable delivery
- Nice-to-have: Prior builds in your category (${data.productType || "TBD"})
${this.getVerticalSpecificSkills(data.productType)}
```

**Add this helper method to the PRDGenerator class (around line 660):**

```typescript
  /**
   * Get vertical-specific skill requirements
   */
  private getVerticalSpecificSkills(productType: string): string {
    const skills: Record<string, string> = {
      "Fintech/Banking (payments, lending, financial tools)": `
**Fintech-Critical Skills:**
- Experience with payment APIs (Stripe, Plaid, Dwolla)
- Understanding of PCI-DSS compliance
- Financial data security best practices
- Prior fintech or banking software experience strongly preferred`,

      "Healthcare/Telemedicine (patient care, booking, health tracking)": `
**Healthcare-Critical Skills:**
- HIPAA compliance implementation experience
- Healthcare data standards (HL7, FHIR) familiarity
- Experience with EHR integrations
- Prior healthtech experience strongly preferred`,

      "Marketplace (connecting buyers/sellers, service providers, freelancers)": `
**Marketplace-Critical Skills:**
- Two-sided marketplace experience
- Payment escrow implementation
- Search and matching algorithms
- Trust & safety systems experience`,

      "Analytics/Data Platform (dashboards, reporting, BI tools)": `
**Analytics-Critical Skills:**
- Data visualization libraries (D3.js, Chart.js, Recharts)
- SQL and data pipeline experience
- Performance optimization for large datasets
- Dashboard/BI tool experience`,
    };

    return skills[productType] || "";
  }
```

**Why:** Different verticals require different specialized skills. A Fintech developer needs payment API experience; a Healthcare developer needs HIPAA knowledge.

---

### Task 7: Fix Complexity Enum Mismatch

**Problem:** Frontend uses `simple | standard | complex`, backend expects `low | medium | high`

**Files to update:**

**Option A: Add mapping function (Recommended)**

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

**File:** `client/src/pages/Results.tsx` (around line 140-145)

**Before:**
```typescript
const complexityMap: Record<string, Complexity> = {
  simple: "low",
  standard: "medium",
  complex: "high",
};
const backendComplexity = complexityMap[computedResult.complexity] || "medium";
```

**After:**
```typescript
import { toBackendComplexity } from "@shared/utils/complexity-mapper";

const backendComplexity = toBackendComplexity(computedResult.complexity);
```

**File:** `shared/cost-estimator.ts` - Update type to accept both:

```typescript
export type Complexity = "low" | "medium" | "high" | "simple" | "standard" | "complex";

// Add normalization at the start of getCostEstimate:
function normalizeComplexity(c: Complexity): "low" | "medium" | "high" {
  if (c === "simple") return "low";
  if (c === "standard") return "medium";
  if (c === "complex") return "high";
  return c;
}
```

---

### Task 8: Update Tests

**File:** `server/assessment.test.ts`

**Action:** Update any test fixtures that use old product type strings

**Search for occurrences of old product types and update:**

Old values to find:
- `"Web application (SaaS, dashboard, portal)"`
- `"Marketplace (two-sided)"`

Replace with appropriate new values:
- `"Business SaaS (CRM, project management, team tools)"`
- `"Marketplace (connecting buyers/sellers, service providers, freelancers)"`

**Add new test cases:**

```typescript
describe("determineRoute with compliance-heavy verticals", () => {
  it("should recommend custom route for Fintech even without explicit compliance checkbox", () => {
    const responses = {
      2: "Fintech/Banking (payments, lending, financial tools)",
      3: "Web only",
      5: [], // No compliance checkbox selected
      6: "$20,000 - $40,000",
      7: "Standard (3-4 months)",
      8: "Open to either (recommend what's best)",
    };

    const result = determineRoute(responses);
    expect(result.route).toBe("custom");
  });

  it("should recommend custom route for Healthcare", () => {
    const responses = {
      2: "Healthcare/Telemedicine (patient care, booking, health tracking)",
      3: "Web only",
      5: [],
      6: "$20,000 - $40,000",
      7: "Standard (3-4 months)",
      8: "Open to either (recommend what's best)",
    };

    const result = determineRoute(responses);
    expect(result.route).toBe("custom");
  });

  it("should allow hybrid for Fintech if user explicitly wants no-code and has high no-code score", () => {
    const responses = {
      2: "Fintech/Banking (payments, lending, financial tools)",
      3: "Web only",
      4: ["auth_email_password"], // Simple features
      5: [],
      6: "Under $5,000",
      7: "Flexible (5+ months)",
      8: "No-code / low-code (Bubble, Webflow, etc.)",
    };

    const result = determineRoute(responses);
    expect(result.route).toBe("hybrid"); // Compromise position
  });
});
```

---

### Task 9: Migration Mapping for Old Q2 Values

**Problem:** Existing assessment responses in the database have old Q2 values that won't match new templates.

**File:** `shared/utils/product-type-migrator.ts` (new file)

```typescript
/**
 * Maps old Q2 product type values to new detailed values
 * Used for backward compatibility with existing assessment data
 */
export const OLD_TO_NEW_PRODUCT_TYPE_MAP: Record<string, string> = {
  // Old value -> New value
  "Web application (SaaS, dashboard, portal)": "Business SaaS (CRM, project management, team tools)",
  "Mobile app": "Business SaaS (CRM, project management, team tools)", // Mobile is now captured by Q3
  "Marketplace (two-sided)": "Marketplace (connecting buyers/sellers, service providers, freelancers)",
  "E-commerce": "E-commerce (online store, shopping platform)",
  "Internal tool": "Internal tool (ops dashboard, admin panel)",
  "Browser extension": "Business SaaS (CRM, project management, team tools)", // Rare, map to SaaS
  "API / Backend service": "API / Backend service",
  "Other": "Other (describe below)",
};

export function migrateProductType(oldValue: string): string {
  // If it's already a new value, return as-is
  if (isNewProductType(oldValue)) {
    return oldValue;
  }

  // Map old to new
  return OLD_TO_NEW_PRODUCT_TYPE_MAP[oldValue] || "Business SaaS (CRM, project management, team tools)";
}

export function isNewProductType(value: string): boolean {
  const newTypes = [
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
  ];
  return newTypes.includes(value);
}
```

**Usage in Results.tsx and document generators:**

```typescript
import { migrateProductType } from "@shared/utils/product-type-migrator";

// When reading responses
const productType = migrateProductType(responses[2]);
```

**Database Migration (Optional):**

If you want to update existing records:

```sql
-- Run this migration to update old values in the database
UPDATE assessment_responses
SET responses = JSON_SET(
  responses,
  '$."2"',
  CASE JSON_EXTRACT(responses, '$."2"')
    WHEN '"Web application (SaaS, dashboard, portal)"' THEN '"Business SaaS (CRM, project management, team tools)"'
    WHEN '"Mobile app"' THEN '"Business SaaS (CRM, project management, team tools)"'
    WHEN '"Marketplace (two-sided)"' THEN '"Marketplace (connecting buyers/sellers, service providers, freelancers)"'
    WHEN '"E-commerce"' THEN '"E-commerce (online store, shopping platform)"'
    WHEN '"Internal tool"' THEN '"Internal tool (ops dashboard, admin panel)"'
    WHEN '"Other"' THEN '"Other (describe below)"'
    ELSE JSON_EXTRACT(responses, '$."2"')
  END
)
WHERE JSON_EXTRACT(responses, '$."2"') IN (
  '"Web application (SaaS, dashboard, portal)"',
  '"Mobile app"',
  '"Marketplace (two-sided)"',
  '"E-commerce"',
  '"Internal tool"',
  '"Browser extension"',
  '"Other"'
);
```

---

## File Reference

| File | Purpose | Changes Required |
|------|---------|------------------|
| `client/src/lib/assessmentData.ts` | Assessment questions + route logic | Replace Q2 options, add Q2.5, update `determineRoute()` |
| `server/services/category-validator.ts` | AI category validation | Update `PRODUCT_CATEGORIES` and definitions |
| `shared/mvp-category-mapper.ts` | Maps product types to knowledge base | Add missing category mappings |
| `server/services/prd-generator.ts` | Document generation | Add vertical-specific guidance methods |
| `shared/cost-estimator.ts` | Cost calculation | Add complexity normalization |
| `shared/utils/complexity-mapper.ts` | Complexity enum conversion | New file |
| `shared/utils/product-type-migrator.ts` | Old→New Q2 value mapping | New file |
| `server/assessment.test.ts` | Tests | Update fixtures, add new test cases |

---

## Testing Checklist

### UI Testing
- [ ] Q2 shows 10 new detailed product type options (Mobile app removed - captured by Q3)
- [ ] Selecting "Other (describe below)" shows Q2.5 text input
- [ ] Q2.5 is required when visible
- [ ] Q2.5 is hidden when other options selected

### Route Determination Testing
- [ ] Fintech selection → custom route (default)
- [ ] Healthcare selection → custom route (default)
- [ ] Fintech + explicit no-code preference + simple scope → hybrid route
- [ ] Analytics/Data Platform → custom route (default)
- [ ] Business SaaS + web only + low budget → no-code route (unchanged behavior)
- [ ] Marketplace + mobile requirement → custom route (unchanged behavior)

### Cost Estimate Testing
- [ ] Business SaaS selection → matches CRM/PM types in knowledge base
- [ ] Marketplace selection → matches marketplace types
- [ ] Fintech selection → matches fintech types in Vertical-Specific SaaS
- [ ] Healthcare selection → matches healthtech types

### Document Generation Testing
- [ ] Project Clarity Brief includes vertical-specific constraints for Fintech
- [ ] Project Clarity Brief includes vertical-specific constraints for Healthcare
- [ ] Hiring Playbook includes vertical-specific skills for Fintech
- [ ] Hiring Playbook includes vertical-specific skills for Healthcare
- [ ] Documents work correctly for non-vertical-specific categories

### Regression Testing
- [ ] All existing tests pass
- [ ] Assessment flow completes successfully
- [ ] Results page loads correctly
- [ ] Free snapshot email sends with correct content
- [ ] Paid blueprint email sends with all 4 documents

---

## Design Decisions Made

The following decisions have been finalized:

| Decision | Resolution | Reasoning |
|----------|------------|-----------|
| Keep "Internal tool" and "API / Backend service" separate? | **YES - Keep both** | Different use cases: Internal tool has UI for employees; API service has no UI |
| Remove "Mobile app" from Q2? | **YES - Remove** | Redundant with Q3 (platform question). Mobile is a delivery platform, not a product type |
| Add more verticals? | **Not now** | Current 10 options cover major categories. Can add Real Estate, Legal Tech, HR Tech later based on user feedback |

---

## Appendix A: 2025 Pricing Research

### Hourly Rate Comparison by Route

| Route | Experience Level | Hourly Rate | Notes |
|-------|-----------------|-------------|-------|
| **No-Code** | Junior | $25-$50/hr | Basic CRUD, simple workflows |
| **No-Code** | Mid-Level | $50-$75/hr | Full MVP builds, integrations |
| **No-Code** | Senior | $75-$120+/hr | Complex data, scaling, architecture |
| **Hybrid** | Mid-Level | $60-$90/hr | No-code + custom code mix |
| **Hybrid** | Senior | $90-$125/hr | Architecture decisions, API work |
| **Custom** | Junior (US) | $50-$75/hr | Basic features, supervision needed |
| **Custom** | Mid-Level (US) | $75-$125/hr | Standard full-stack work |
| **Custom** | Senior (US) | $125-$250/hr | Complex systems, architecture |
| **Custom** | Eastern Europe | $40-$80/hr | 35-50% savings vs US |
| **Custom** | Asia | $20-$80/hr | Wide range based on experience |

### MVP Project Costs by Complexity

| Complexity | No-Code | Hybrid | Custom |
|------------|---------|--------|--------|
| **Simple** | $2K-$10K | $10K-$25K | $10K-$50K |
| **Standard** | $10K-$30K | $25K-$60K | $50K-$100K |
| **Complex** | $30K-$50K | $60K-$100K | $100K-$300K+ |

### Timeline Comparison

| Route | Simple MVP | Standard MVP | Complex MVP |
|-------|-----------|--------------|-------------|
| **No-Code** | 2-4 weeks | 4-8 weeks | 8-12 weeks |
| **Hybrid** | 4-6 weeks | 6-12 weeks | 12-16 weeks |
| **Custom** | 6-10 weeks | 10-16 weeks | 16-24+ weeks |

### Cost Savings Analysis

| Factor | Savings vs Custom |
|--------|-------------------|
| No-code platforms | 40-80% cheaper for simple MVPs |
| Hybrid approach | 30-50% cheaper than full custom |
| Cross-platform (React Native/Flutter) | 30-40% vs separate iOS + Android |
| Eastern Europe outsourcing | 35-50% vs US rates |

### Platform Subscription Costs (No-Code)

| Level | Monthly Cost | Annual |
|-------|-------------|--------|
| Small Business | $50-$200/mo | $600-$2,400/yr |
| Growth/Scale | $200-$500/mo | $2,400-$6,000/yr |
| Enterprise | $5,000+/mo | $60,000+/yr |

### Add-on Costs to Consider

| Service | Monthly Cost |
|---------|-------------|
| Platform subscription (Bubble, Webflow) | $30-$100/mo |
| Plugins/add-ons | $20-$50/mo (2-3 needed) |
| External APIs (Stripe, Twilio, Maps) | $50-$200/mo |
| Post-launch maintenance retainer | $1,000-$3,000/mo |

### Key Insights

1. **No-code is 40-80% cheaper** for simple to moderate MVPs
2. **Hybrid saves 30-50%** while allowing custom features where needed
3. **70% of new apps** will use low-code/no-code by 2025 (Gartner)
4. **Initial build = 20-50%** of total lifetime cost (maintenance matters)
5. **No-code timelines** are 2-6 weeks vs 2-6 months for custom

### Current Codebase Rates vs Research

**File:** `shared/cost-estimator.ts` (lines 67-83)

| Route | Level | Current Code | Research Range | Status |
|-------|-------|--------------|----------------|--------|
| No-Code | Junior | $40/hr | $25-50/hr | Within range |
| No-Code | Mid | $60/hr | $50-75/hr | Within range |
| No-Code | Senior | $90/hr | $75-120/hr | Within range |
| Hybrid | Junior | $50/hr | $40-60/hr | Within range |
| Hybrid | Mid | $75/hr | $60-90/hr | Within range |
| Hybrid | Senior | $105/hr | $90-125/hr | Within range |
| Custom | Junior | $50/hr | $50-75/hr | Within range |
| Custom | Mid | $75/hr | $75-125/hr | Low end |
| Custom | Senior | $107/hr | $125-250/hr | **Below range** |

**Recommendation:** The current rates are reasonable for a global/blended rate perspective. The custom senior rate ($107) is below US market rates ($125-250) but aligns with Eastern European rates. Consider adding a note that these are "blended global rates" or adjusting senior custom to $125/hr to match US low-end.

### Sources
- [FullStack Software Development Price Guide 2025](https://www.fullstack.com/labs/resources/blog/software-development-price-guide-hourly-rate-comparison)
- [The Cost of No-Code App Development 2025](https://www.lowcode.agency/blog/cost-no-code-app-development)
- [MVP Development Cost 2025](https://www.ideas2it.com/blogs/mvp-development-cost)
- [Real Cost of No-Code MVPs](https://www.ptolemay.com/post/the-real-cost-of-no-code-mvps-pricing-pitfalls-when-to-bail)
- [Bubble Developer Rates](https://flexiple.com/cost-to-hire/bubble-developer)
- [How Much Do No-Code Developers Make 2025](https://solowise.com/blog/how-much-do-no-code-developers-make)

---

## Appendix B: MVP Knowledge Base Categories

For reference, here are the categories in `shared/mvp-knowledge-base.json`:

| Category | Example MVP Types |
|----------|-------------------|
| Core Business SaaS | CRM, Project Management, HR/Recruiting, Accounting, Inventory |
| Marketplaces & Platforms | Service marketplace, Product marketplace, Booking platform |
| Communication & Social | Chat/messaging, Video conferencing, Social network, Forum |
| Vertical-Specific SaaS | Fintech (payments, lending), Healthcare (telemedicine), Education (LMS), Legal |
| Technical & Developer Tools | API gateway, Analytics platform, Developer tools, CI/CD |

Each MVP type includes:
- Research summary with cost/timeline benchmarks
- Baseline estimates for mid-tier and senior developers
- Recommended tech stack
- Team composition suggestions

---

## Appendix C: Document Output Structures

### Overview

The system generates 4 documents for paid users and 1 document for free users:

| Tier | Documents |
|------|-----------|
| **Free** | Project Clarity Brief (preview version) |
| **Paid ($149)** | Project Clarity Brief (enhanced), Hiring Playbook, PRD, Working Agreement |

**File:** `server/services/prd-generator.ts`

---

### Document 1: Project Clarity Brief

**Function:** `generateProjectClarityBrief(data: PRDData, input?: { techStackSuggestion?: string; routeReasoning?: string })`

**Purpose:** Executive summary of the project for founder and developer alignment.

#### Structure

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: [from Q15.project_name or Q12.problem]
- Founder: [from Q15.first_name + Q15.last_name] ([Q15.email])
- Date Generated: [auto-generated]

**2. THE PROBLEM**
[from Q12.problem - free text description]

**3. THE SOLUTION**
[from Q12.solution - free text description]

**4. TARGET USER**
[Placeholder: "needs further refinement"]

**5. SUCCESS CRITERIA**
[from Q13.goal + Q13.metric]

**6. MVP SCOPE**
**Must-Have Features (v1):**
- [First 5 features from Q4 + Q5 + Q14]

**Post-MVP Features (Later):**
- [Features 6+ from combined list]

**7. CONSTRAINTS**
- Budget: [from Q6]
- Timeline: [from Q7]
- Platform: [from Q3]
- Compliance: [Yes/No based on Q5 selection]
- Technical preferences: [from Q8]

**8. RECOMMENDED APPROACH**
- Route: [no-code | hybrid | custom]
- Why: [AI-generated or default reasoning]
- Tech stack suggestion: [AI-generated or "TBD"]
```

#### Data Mapping

| Section | Field | Source Question | Data Path |
|---------|-------|-----------------|-----------|
| 1. Overview | Project Name | Q15 or Q12 | `q15.project_name` or `q12.problem` (truncated to 50 chars) |
| 1. Overview | Founder | Q15 | `q15.first_name + q15.last_name` |
| 1. Overview | Email | Q15 | `q15.email` |
| 1. Overview | Date | Auto | `new Date().toLocaleDateString()` |
| 2. Problem | Problem statement | Q12 | `q12.problem` |
| 3. Solution | Solution summary | Q12 | `q12.solution` |
| 4. Target User | User description | - | Placeholder text |
| 5. Success | Criteria | Q13 | `q13.goal` + `q13.metric` |
| 6. Scope | Must-Have | Q4, Q5, Q14 | First 5 from merged array |
| 6. Scope | Post-MVP | Q4, Q5, Q14 | Items 6+ from merged array |
| 7. Constraints | Budget | Q6 | `responses[6]` |
| 7. Constraints | Timeline | Q7 | `responses[7]` |
| 7. Constraints | Platform | Q3 | `responses[3]` |
| 7. Constraints | Compliance | Q5 | Check if "Compliance" in array |
| 7. Constraints | Build Preference | Q8 | `responses[8]` |
| 8. Approach | Route | Calculated | `determineRoute()` result |
| 8. Approach | Reasoning | AI | OpenAI generated or default |
| 8. Approach | Tech Stack | AI | OpenAI generated or "TBD" |

#### Free vs Paid Differences

| Field | Free Tier | Paid Tier |
|-------|-----------|-----------|
| Tech Stack Suggestion | "TBD" | AI-generated recommendation |
| Route Reasoning | Default text | AI-generated explanation |
| Format | Markdown (.md) | Word Document (.docx) + Markdown |

---

### PRDData Interface

**File:** `server/services/prd-generator.ts` (lines 9-40)

```typescript
interface PRDData {
  // Identity
  productName: string;        // Q15.project_name or Q12.problem
  userName: string;           // Q15.first_name + Q15.last_name
  userEmail: string;          // Q15.email
  currentDate: string;        // Auto-generated

  // Project Description
  problem: string;            // Q12.problem
  solution: string;           // Q12.solution
  successMetrics: string;     // Q13.goal + Q13.metric
  primaryUser: string;        // Placeholder (not captured)
  painPoints: string[];       // Empty (not captured)

  // Features & Scope
  topFeatures: string[];      // Q4 + Q5 + Q14 merged
  integrations: string[];     // Q14

  // Technical Requirements
  platform: string;           // Q3
  security: string;           // Placeholder
  performance: string;        // Placeholder

  // Budget & Timeline
  budgetLow: string;          // Parsed from Q6
  budgetHigh: string;         // Parsed from Q6
  totalBudget: string;        // Q6 raw
  timelineWeeks: string;      // Parsed from Q7

  // Preferences
  route: string;              // Calculated
  buildPreference: string;    // Q8
  productStage: string;       // Q1
  productType: string;        // Q2

  // Communication
  timezonePreference: string; // Q11.preference
  timezone: string;           // Q11.timezone

  // Experience
  comfortManagingDevs: string;      // Q9
  previousHiringExperience: string; // Q10

  // Other
  hoursPerWeek: string;       // Placeholder
  experienceLevel: string;    // Placeholder
  milestones: string[];       // Empty
  rawResponses: object;       // Full responses object
}
```

---

### Feature Aggregation Logic

**File:** `server/services/prd-generator.ts` (line 124)

```typescript
topFeatures: [
  ...coreFeatures,      // From Q4 (feature catalog selections)
  ...dayOneNeeds,       // From Q5 (day-one requirements)
  ...integrations       // From Q14 (integration selections)
].filter((f) => f && f !== "None of these")
```

**MVP Scope Split:**
- **Must-Have (v1):** First 5 items from `topFeatures`
- **Post-MVP:** Items 6+ from `topFeatures`

---

### Vertical-Specific Additions (To Be Implemented)

Per Task 5 in Implementation Tasks, the Project Clarity Brief will be enhanced with vertical-specific constraints:

| Product Type | Additional Constraints |
|--------------|----------------------|
| Fintech/Banking | PCI-DSS compliance, money transmitter licenses, banking API integrations |
| Healthcare/Telemedicine | HIPAA compliance, BAA requirements, audit logging, state telehealth regulations |
| Marketplace | Two-sided dynamics, payment escrow, trust & safety features |
| E-commerce | PCI compliance, inventory management, shipping integrations, tax calculation |
| Education/Learning | Content hosting, progress tracking, FERPA compliance, accessibility (WCAG) |

---

### Example Output: Project Clarity Brief

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: Freelancer Marketplace for Designers
- Founder: Jane Smith (jane@example.com)
- Date Generated: December 29, 2025

**2. THE PROBLEM**
Small businesses struggle to find quality freelance designers.
Existing platforms like Fiverr and Upwork are oversaturated with
low-quality providers, making it time-consuming to find reliable talent.

**3. THE SOLUTION**
A curated marketplace connecting vetted freelance designers with
small businesses. Designers go through a portfolio review process
before being listed, ensuring quality. Businesses can browse by
specialty, see verified reviews, and hire with confidence.

**4. TARGET USER**
[Derived from your description: needs further refinement]

**5. SUCCESS CRITERIA**
100 active designers on platform within 3 months (Primary metric: Monthly active designers)

**6. MVP SCOPE**
**Must-Have Features (v1):**
- Email/password login
- User profiles
- Search + filters
- Stripe (payments)
- Email notifications

**Post-MVP Features (Later):**
- In-app chat
- Analytics dashboard
- Zapier integration

**7. CONSTRAINTS**
- Budget: $20,000 - $40,000
- Timeline: Standard (3-4 months)
- Platform: Web only
- Compliance: No
- Technical preferences: Open to either (recommend what's best)

**8. RECOMMENDED APPROACH**
- Route: hybrid
- Why: Your marketplace has standard complexity with payment integration
  and user profiles. A hybrid approach lets you move fast with no-code
  for the frontend while using custom code for the payment escrow logic.
- Tech stack suggestion: Webflow (frontend) + Xano (backend) + Stripe Connect
```
