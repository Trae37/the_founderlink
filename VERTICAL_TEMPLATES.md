# Vertical Templates for Free Tier

> **Purpose:** Pre-built templates for Results page and Project Clarity Brief by vertical. These eliminate the need for AI generation on the free tier while still providing valuable, vertical-specific guidance.

---

## Implementation Specification

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
| `{{integrations}}` | `responses[14]` | Q14 | `[]` |
| `{{productType}}` | `responses[2]` | Q2 | `"Business SaaS"` |

---

### Conditional Logic Spec

#### Route Selection Logic (affects which guidance block to show)

```typescript
function getRouteGuidance(template: VerticalResultsTemplate, route: Route): RouteGuidanceBlock {
  return template.routeGuidance[route];
}
```

#### Vertical-Specific Sections

| Condition | Action |
|-----------|--------|
| `productType === "Marketplace"` | Include marketplace sections: "Two-sided dynamics", "Payment escrow", "Trust & safety" |
| `productType === "Fintech/Banking"` | Include compliance warning, PCI-DSS requirements, BaaS recommendation |
| `productType === "Healthcare/Telemedicine"` | Include HIPAA requirements, BAA checklist, telehealth regulations |
| `productType === "E-commerce"` | Include Shopify recommendation, shipping/tax considerations |
| `integrations.includes("Stripe")` | Include payment integration guidance in tech stack |
| `hasCompliance === "Yes"` | Force `route = "custom"`, add compliance section |
| `platform.includes("Mobile")` | Add mobile-specific considerations, increase complexity |
| `dayOneNeeds.includes("Real-time")` | Force `route = "custom"`, add real-time infrastructure guidance |

#### MVP Phase Logic

```typescript
function getMVPPhases(productType: string, features: string[], complexity: string): Phase[] {
  const phases = [];

  // Phase 1 always: Core functionality
  phases.push({
    name: "Phase 1: Core MVP",
    weeks: complexity === "simple" ? 4 : complexity === "standard" ? 8 : 12,
    features: features.slice(0, 3),
    focus: getVerticalPhase1Focus(productType)
  });

  // Phase 2: Enhancement
  if (features.length > 3) {
    phases.push({
      name: "Phase 2: Enhancement",
      weeks: complexity === "simple" ? 2 : complexity === "standard" ? 4 : 6,
      features: features.slice(3, 5),
      focus: getVerticalPhase2Focus(productType)
    });
  }

  // Phase 3: Scale
  if (features.length > 5) {
    phases.push({
      name: "Phase 3: Scale",
      weeks: 4,
      features: features.slice(5),
      focus: "Optimization and additional features"
    });
  }

  return phases;
}

function getVerticalPhase1Focus(productType: string): string {
  const focuses = {
    "Marketplace": "Core listing and transaction flow",
    "Business SaaS": "Core workflow and user management",
    "Fintech/Banking": "Secure foundation and compliance",
    "Healthcare/Telemedicine": "HIPAA-compliant core and booking",
    "E-commerce": "Catalog, cart, and checkout",
    "Education/Learning": "Course delivery and enrollment",
    "Communication Platform": "Real-time messaging core",
    "Analytics/Data Platform": "Data pipeline and core dashboard",
    "Internal tool": "Core CRUD and workflows",
    "API / Backend service": "Core endpoints and auth"
  };
  return focuses[productType] || "Core functionality";
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
    // Route recommendation (from template, not AI)
    routeRecommendation: template.routeGuidance[route],

    // Tech stack (from template, not AI)
    techStackSuggestion: template.techStackSuggestions[route],

    // Cost estimate (from template ranges)
    costRange: template.costRanges[mapComplexity(complexity)],

    // Timeline (from template)
    timelineWeeks: template.timelineWeeks[mapComplexity(complexity)],

    // Considerations (from template)
    criticalConsiderations: template.criticalConsiderations,

    // No AI calls for free tier
  };
}

export function generateFreeClarityBrief(responses: AssessmentResponses): string {
  const productType = responses[2];
  const templateMarkdown = CLARITY_BRIEF_TEMPLATES[productType] || CLARITY_BRIEF_TEMPLATES.default;

  // Replace placeholders
  return replacePlaceholders(templateMarkdown, responses);
}

function replacePlaceholders(template: string, responses: AssessmentResponses): string {
  const placeholders = buildPlaceholderMap(responses);

  let result = template;
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  return result;
}

function buildPlaceholderMap(responses: AssessmentResponses): Record<string, string> {
  const q12 = responses[12] || {};
  const q13 = responses[13] || {};
  const q15 = responses[15] || {};

  return {
    projectName: q15.project_name || q12.problem?.slice(0, 50) || "Your Project",
    founderName: [q15.first_name, q15.last_name].filter(Boolean).join(" ") || "Founder",
    founderEmail: q15.email || "",
    currentDate: new Date().toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'}),
    problem: q12.problem || "[Describe the problem you're solving]",
    solution: q12.solution || "[Describe your solution]",
    successGoal: q13.goal || "[Define your success goal]",
    successMetric: q13.metric || "[Primary metric to track]",
    budget: responses[6] || "Not specified",
    timeline: responses[7] || "Not specified",
    platform: responses[3] || "Web",
    buildPreference: responses[8] || "Open to either",
    route: determineRoute(responses).route,
    complexity: determineRoute(responses).complexity,
    hasCompliance: responses[5]?.includes("Compliance") ? "Yes" : "No",
    mustHaveFeatures: formatFeatureList(mergeFeatures(responses).slice(0, 5)),
    postMvpFeatures: formatFeatureList(mergeFeatures(responses).slice(5)),
    productType: responses[2] || "Business SaaS",
  };
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

server/
├── services/
│   ├── free-tier-generator.ts    # Template-based generation (no AI)
│   └── paid-tier-generator.ts    # AI-enhanced generation (existing)
```

---

### Results.tsx Integration Spec

**File:** `client/src/pages/Results.tsx`

#### Current Flow (AI-dependent)

```typescript
// Current: Always calls AI for recommendations
generateRecommendationsMutation.mutateAsync({
  route: computedResult.route,
  responses: parsedResponses,
}).then((recommendation) => {
  setTechRecommendation(recommendation);
});
```

#### New Flow (Template-first, AI for paid)

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

setTemplateResults(templateResults); // New state for template data

// Step 3: Only call AI for paid users OR for enhanced recommendations
if (isPaidUser) {
  generateRecommendationsMutation.mutateAsync({
    route: computedResult.route,
    responses: parsedResponses,
  }).then((recommendation) => {
    setTechRecommendation(recommendation); // Overrides template with AI
  });
}
```

#### Component Updates

**New state variables:**
```typescript
const [templateResults, setTemplateResults] = useState<TemplateResults | null>(null);
const [useTemplateOnly, setUseTemplateOnly] = useState(true); // Free tier flag
```

**Display logic:**
```typescript
// Use AI recommendation if available, otherwise use template
const displayedTechStack = techRecommendation?.techStack || templateResults?.techStackSuggestion;
const displayedCostRange = techRecommendation?.costEstimate || templateResults?.costRange;
```

#### Components to Update

| Component | Current | New |
|-----------|---------|-----|
| `RouteReasoning.tsx` | Uses AI reasoning | Use `template.routeGuidance[route].reasoning` for free |
| `RealisticRangeCard.tsx` | Uses AI cost estimate | Use `template.costRanges[complexity]` for free |
| `SourcingOptions.tsx` | Static | Can use `template.techStackSuggestions` |
| `PhasedDevelopmentCard.tsx` | Uses AI phases | Use `getMVPPhases(productType, features, complexity)` for free |

#### API Changes

**File:** `server/routers/assessment.ts`

Add new endpoint for template-only results:

```typescript
getTemplateResults: publicProcedure
  .input(z.object({
    productType: z.string(),
    route: z.enum(["no-code", "hybrid", "custom"]),
    complexity: z.enum(["simple", "standard", "complex"]),
  }))
  .query(({ input }) => {
    const template = VERTICAL_TEMPLATES[input.productType] || VERTICAL_TEMPLATES.default;
    return {
      routeGuidance: template.routeGuidance[input.route],
      techStackSuggestion: template.techStackSuggestions[input.route],
      costRange: template.costRanges[toBackendComplexity(input.complexity)],
      timelineWeeks: template.timelineWeeks[toBackendComplexity(input.complexity)],
      criticalConsiderations: template.criticalConsiderations,
      typicalFeatures: template.typicalFeatures,
    };
  }),
```

---

### Default Template for "Other" Selection

When user selects "Other (describe below)", use this generic template:

**File:** `shared/vertical-templates/default.ts`

```typescript
export const DEFAULT_TEMPLATE: VerticalResultsTemplate = {
  vertical: "other",
  routeGuidance: {
    "no-code": {
      recommendation: "Consider for simple applications",
      reasoning: "No-code platforms work well for straightforward CRUD applications, landing pages, and MVPs. They let you validate ideas quickly without significant investment.",
      bestFor: ["Simple web apps", "Landing pages", "Basic workflows", "Prototypes"],
      limitations: ["Complex business logic", "Custom integrations", "High-performance needs"]
    },
    "hybrid": {
      recommendation: "Balanced approach for most projects",
      reasoning: "A hybrid approach combines the speed of no-code for standard features with custom code for your unique requirements. Good balance of speed and flexibility.",
      bestFor: ["Custom + standard features", "Moderate complexity", "Integrations needed"],
      limitations: ["Requires both skill sets", "More coordination"]
    },
    "custom": {
      recommendation: "For complex or unique requirements",
      reasoning: "Custom development gives you full control over functionality, performance, and user experience. Best for complex business logic or unique requirements.",
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

**Default Clarity Brief Template:**

```typescript
export const DEFAULT_CLARITY_BRIEF_TEMPLATE = `**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Custom / Other

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
[To be defined - describe your primary user, their role, and context]

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Key Metrics to Consider:**
- User acquisition and activation
- Engagement and retention
- Revenue or conversion (if applicable)
- User satisfaction (NPS)

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**8. RECOMMENDED APPROACH**
- Route: {{route}}
- Complexity: {{complexity}}

**General Guidance:**
Based on your inputs, we recommend a {{route}} approach. This balances your budget, timeline, and feature requirements.

**Suggested Tech Stack:**
- Evaluate based on your specific needs
- Consider: complexity, team skills, long-term maintenance
- Start simple, add complexity as needed

**9. NEXT STEPS**
1. Validate your core assumption with potential users
2. Define your MVP scope (3-5 core features)
3. Choose your technical approach
4. Find the right developer or team
5. Build, launch, iterate

**10. QUESTIONS TO ANSWER**
Since you selected "Other" for product type, consider:
- What existing product category is this most similar to?
- What makes your product unique?
- Who are your closest competitors?
- What's your go-to-market strategy?
`;
```

---

### Template Lookup Logic

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

## Table of Contents

1. [How Templates Work](#how-templates-work)
2. [Template Variables](#template-variables)
3. [Vertical Templates](#vertical-templates)
   - [Marketplace](#1-marketplace)
   - [Business SaaS](#2-business-saas)
   - [Communication Platform](#3-communication-platform)
   - [Fintech/Banking](#4-fintechbanking)
   - [Healthcare/Telemedicine](#5-healthcaretelemedicine)
   - [E-commerce](#6-e-commerce)
   - [Education/Learning](#7-educationlearning)
   - [Analytics/Data Platform](#8-analyticsdata-platform)
   - [Internal Tool](#9-internal-tool)
   - [API/Backend Service](#10-apibackend-service)
   - [Real Estate (Future)](#11-real-estate-future)
   - [Legal Tech (Future)](#12-legal-tech-future)
   - [HR Tech (Future)](#13-hr-tech-future)
   - [Logistics (Future)](#14-logistics-future)

---

## How Templates Work

### Free Tier Flow
```
User completes assessment
    ↓
Get productType from Q2
    ↓
Look up vertical template by productType
    ↓
Replace {{variables}} with user's responses
    ↓
Display Results page with pre-built content
    ↓
Generate Project Clarity Brief from template
```

### Paid Tier Flow (unchanged)
```
User completes assessment
    ↓
AI generates personalized recommendations
    ↓
AI generates enhanced documents
```

---

## Template Variables

These variables are replaced with actual user data:

| Variable | Source | Example |
|----------|--------|---------|
| `{{projectName}}` | Q15.project_name or Q12.problem | "Designer Marketplace" |
| `{{founderName}}` | Q15.first_name + Q15.last_name | "Jane Smith" |
| `{{founderEmail}}` | Q15.email | "jane@example.com" |
| `{{currentDate}}` | Auto-generated | "December 29, 2025" |
| `{{problem}}` | Q12.problem | "Small businesses struggle to find..." |
| `{{solution}}` | Q12.solution | "A curated marketplace..." |
| `{{successGoal}}` | Q13.goal | "100 active designers" |
| `{{successMetric}}` | Q13.metric | "Monthly active designers" |
| `{{budget}}` | Q6 | "$20,000 - $40,000" |
| `{{timeline}}` | Q7 | "Standard (3-4 months)" |
| `{{platform}}` | Q3 | "Web only" |
| `{{buildPreference}}` | Q8 | "Open to either" |
| `{{features}}` | Q4 + Q5 + Q14 merged | ["Auth", "Payments", "Search"] |
| `{{mustHaveFeatures}}` | First 5 of features | Bulleted list |
| `{{postMvpFeatures}}` | Features 6+ | Bulleted list |
| `{{route}}` | Calculated | "hybrid" |
| `{{complexity}}` | Calculated | "standard" |
| `{{hasCompliance}}` | Q5 includes compliance | "Yes" / "No" |
| `{{integrations}}` | Q14 | ["Stripe", "Slack"] |

---

## Vertical Templates

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
      "reasoning": "No-code platforms like Sharetribe or Bubble can handle basic two-sided marketplaces with listings, user profiles, and simple booking. Works well if you don't need complex matching algorithms or custom payment splits.",
      "bestFor": ["Service marketplaces", "Local listings", "Simple booking platforms"],
      "limitations": ["Complex payment escrow", "Custom matching algorithms", "High-volume transactions"]
    },
    "hybrid": {
      "recommendation": "Recommended for most marketplaces",
      "reasoning": "Use no-code for the frontend (listings, profiles, search) and custom code for payment escrow, dispute resolution, and matching logic. This balances speed-to-market with the flexibility marketplaces need.",
      "bestFor": ["Service marketplaces with payments", "Freelancer platforms", "Booking with escrow"],
      "limitations": ["Requires developer for custom backend logic"]
    },
    "custom": {
      "recommendation": "Required for complex marketplaces",
      "reasoning": "If you need sophisticated matching algorithms, complex payment splits, real-time bidding, or plan to scale to high transaction volumes, custom development gives you full control.",
      "bestFor": ["High-volume platforms", "Complex matching/bidding", "Multi-vendor payments"],
      "limitations": ["Higher cost", "Longer timeline"]
    }
  },
  "typicalFeatures": [
    "Two-sided user profiles (buyers + sellers)",
    "Listings with search and filters",
    "Booking or request flow",
    "Payment processing with escrow",
    "Reviews and ratings",
    "Messaging between parties",
    "Admin dashboard for moderation"
  ],
  "techStackSuggestions": {
    "no-code": "Sharetribe, Bubble + Stripe Connect",
    "hybrid": "Webflow/Bubble (frontend) + Node.js/Supabase (backend) + Stripe Connect",
    "custom": "Next.js + Node.js + PostgreSQL + Stripe Connect + Algolia (search)"
  },
  "costRanges": {
    "simple": { "min": 8000, "max": 20000 },
    "standard": { "min": 25000, "max": 60000 },
    "complex": { "min": 75000, "max": 150000 }
  },
  "timelineWeeks": {
    "simple": { "min": 4, "max": 8 },
    "standard": { "min": 8, "max": 14 },
    "complex": { "min": 14, "max": 24 }
  },
  "criticalConsiderations": [
    "Chicken-and-egg problem: Which side do you build first?",
    "Payment escrow and dispute resolution are complex",
    "Trust & safety (verification, reviews, fraud prevention)",
    "Commission structure and payment splits",
    "Geographic considerations (local vs global)"
  ],
  "commonMistakes": [
    "Building both sides simultaneously instead of focusing on supply first",
    "Underestimating payment complexity (escrow, refunds, splits)",
    "Ignoring trust signals (reviews, verification, badges)",
    "Over-building before validating demand"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Marketplace

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
Marketplaces serve two distinct user groups:
- **Supply side (Sellers/Providers):** [Describe who will list services or products]
- **Demand side (Buyers/Customers):** [Describe who will purchase or book]

*Recommendation: Focus on building supply first. A marketplace with 100 quality providers and 10 buyers is more viable than 10 providers and 100 frustrated buyers.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Marketplace-Specific Metrics to Track:**
- Liquidity rate (% of listings that result in transactions)
- Repeat usage (buyers who return, sellers who stay active)
- Time to first transaction
- Take rate / commission earned

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Marketplace Essentials (if not included above):**
- User registration (separate flows for buyers/sellers)
- Listing creation with photos and details
- Search and filtering
- Booking or purchase request flow
- Basic messaging between parties
- Payment processing

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for Marketplaces:**
- Reviews and ratings
- Seller verification/badges
- Advanced search (location, availability)
- Mobile apps
- Analytics dashboard for sellers

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**Marketplace-Specific Constraints:**
- Payment processing requires Stripe Connect or similar (adds complexity)
- Escrow functionality may need custom development
- Trust & safety features are essential but often underestimated
- Consider: Will you need background checks? Identity verification?

**8. RECOMMENDED APPROACH**
- Route: {{route}}
- Complexity: {{complexity}}

**Why this route for marketplaces:**
Marketplaces benefit from a {{route}} approach because payment handling and trust features often need custom logic, while the frontend (listings, search, profiles) can leverage existing tools.

**Suggested Tech Stack:**
- Frontend: Webflow, Bubble, or Next.js
- Backend: Supabase, Xano, or Node.js + PostgreSQL
- Payments: Stripe Connect (handles splits, escrow, payouts)
- Search: Algolia or built-in platform search
- Messaging: Stream, SendBird, or custom

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| No supply (sellers) | Launch in one niche/location, personally recruit first 50 sellers |
| No demand (buyers) | Don't launch until you have enough supply to satisfy searches |
| Payment disputes | Use Stripe Connect's built-in dispute handling |
| Trust issues | Implement reviews, verification badges, and clear policies |
| Regulatory | Check if your category needs licenses (e.g., home services, healthcare) |

**10. NEXT STEPS**
1. Validate demand: Do buyers actively want this? (Interviews, waitlist)
2. Recruit initial supply: Can you get 25-50 quality providers committed?
3. Define your wedge: What's the ONE thing you do better than existing options?
4. Build MVP focused on core transaction flow
5. Launch in one market/niche before expanding
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
      "reasoning": "No-code platforms like Bubble or Retool can handle CRUD operations, dashboards, and basic workflows. Good for validating ideas quickly before investing in custom development.",
      "bestFor": ["Internal dashboards", "Simple CRM", "Basic project tracking"],
      "limitations": ["Complex workflows", "Heavy integrations", "Scale beyond 10K users"]
    },
    "hybrid": {
      "recommendation": "Good balance for most B2B SaaS",
      "reasoning": "Use no-code for rapid prototyping and admin interfaces, custom code for core business logic, integrations, and performance-critical features.",
      "bestFor": ["CRM with custom workflows", "Project management tools", "Team collaboration"],
      "limitations": ["May need to rebuild no-code portions later"]
    },
    "custom": {
      "recommendation": "Best for differentiated SaaS products",
      "reasoning": "If your competitive advantage is in the software itself (unique workflows, AI features, complex integrations), custom development ensures you can build exactly what you need.",
      "bestFor": ["Complex enterprise SaaS", "AI-powered tools", "Heavy integration requirements"],
      "limitations": ["Higher upfront cost", "Longer time to market"]
    }
  },
  "typicalFeatures": [
    "User authentication with team/workspace support",
    "Role-based access control",
    "Dashboard with key metrics",
    "CRUD operations for core entities",
    "Search and filtering",
    "Notifications (in-app and email)",
    "Settings and preferences",
    "Data export (CSV, PDF)"
  ],
  "techStackSuggestions": {
    "no-code": "Bubble + Airtable + Zapier",
    "hybrid": "Next.js (frontend) + Supabase (backend) + Resend (email)",
    "custom": "Next.js + Node.js + PostgreSQL + Redis + BullMQ (jobs)"
  },
  "costRanges": {
    "simple": { "min": 10000, "max": 25000 },
    "standard": { "min": 30000, "max": 75000 },
    "complex": { "min": 80000, "max": 200000 }
  },
  "timelineWeeks": {
    "simple": { "min": 4, "max": 8 },
    "standard": { "min": 8, "max": 16 },
    "complex": { "min": 16, "max": 28 }
  },
  "criticalConsiderations": [
    "Multi-tenancy architecture (workspaces, teams)",
    "Role-based permissions can get complex quickly",
    "Data model design is critical - hard to change later",
    "Integration requirements with existing tools",
    "Billing and subscription management"
  ],
  "commonMistakes": [
    "Building too many features before validating core value",
    "Underestimating permissions/roles complexity",
    "Not planning for multi-tenant architecture from the start",
    "Ignoring mobile responsiveness for field teams"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Business SaaS

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **Primary User:** [Job title/role who uses this daily]
- **Buyer:** [Who makes the purchase decision - may be different from user]
- **Company Size:** [SMB, Mid-market, Enterprise]
- **Industry:** [Specific vertical or horizontal]

*B2B SaaS Tip: The person who buys is often not the person who uses. Design for users, sell to buyers.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**SaaS-Specific Metrics to Track:**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Churn rate (monthly/annual)
- Net Promoter Score (NPS)
- Daily/Weekly Active Users (DAU/WAU)

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**SaaS Essentials (if not included above):**
- User authentication (email/password, SSO for enterprise)
- Team/workspace management
- Role-based permissions (Admin, Member, Viewer)
- Core workflow (the ONE thing your product does)
- Basic dashboard
- Settings page

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for SaaS:**
- Advanced permissions and audit logs
- Integrations (Slack, Zapier, native APIs)
- Custom reporting and analytics
- Mobile app
- White-labeling (for enterprise)

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**SaaS-Specific Constraints:**
- Multi-tenant architecture required (data isolation between customers)
- Consider SOC 2 if selling to enterprise (adds 3-6 months, $20K+)
- Subscription billing adds complexity (Stripe Billing recommended)
- Plan for scale: What happens at 100, 1000, 10000 users?

**8. RECOMMENDED APPROACH**
- Route: {{route}}
- Complexity: {{complexity}}

**Why this route for B2B SaaS:**
Business SaaS typically benefits from {{route}} development because you need flexibility in your core workflow while leveraging existing solutions for auth, payments, and common features.

**Suggested Tech Stack:**
- Frontend: Next.js, React
- Backend: Node.js, Supabase, or Rails
- Database: PostgreSQL (most common for SaaS)
- Auth: Clerk, Auth0, or Supabase Auth
- Payments: Stripe Billing
- Email: Resend, SendGrid

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| Feature creep | Define "done" for MVP, create a parking lot for ideas |
| Long sales cycles | Start with SMB, move upmarket later |
| Churn | Focus on onboarding and time-to-value |
| Competition | Find your wedge - what do you do 10x better? |
| Scaling costs | Design for multi-tenancy from day 1 |

**10. NEXT STEPS**
1. Validate: Talk to 20+ potential users, confirm the pain is real
2. Design core workflow: What's the ONE thing users do repeatedly?
3. Define pricing: Value-based, per-seat, or usage-based?
4. Build MVP with 3-5 core features only
5. Get 5 paying customers before building more features
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
      "reasoning": "Real-time features (chat, video, live updates) are difficult to implement well with no-code tools. Consider hybrid or custom for communication platforms.",
      "bestFor": ["Simple forums using Circle or Discourse", "Community spaces"],
      "limitations": ["Real-time chat", "Video calling", "Push notifications", "Scale"]
    },
    "hybrid": {
      "recommendation": "Possible with third-party SDKs",
      "reasoning": "Use services like Stream (chat), Twilio (video), or Sendbird to handle real-time infrastructure while building custom UI and business logic around them.",
      "bestFor": ["Chat features in an app", "Video calling integration", "Community features"],
      "limitations": ["Vendor lock-in", "Monthly API costs at scale"]
    },
    "custom": {
      "recommendation": "Required for core communication products",
      "reasoning": "If communication IS your product (not just a feature), you need custom development for performance, customization, and cost control at scale.",
      "bestFor": ["Slack/Discord competitors", "Video platforms", "Social networks"],
      "limitations": ["High complexity", "Significant investment"]
    }
  },
  "typicalFeatures": [
    "User profiles and presence indicators",
    "Real-time messaging (1:1 and group)",
    "Channels or rooms",
    "Media sharing (images, files, links)",
    "Push notifications",
    "Read receipts and typing indicators",
    "Search across messages",
    "Moderation tools"
  ],
  "techStackSuggestions": {
    "no-code": "Circle, Discourse, or Mighty Networks (hosted communities)",
    "hybrid": "Next.js + Stream Chat SDK + Twilio Video + Supabase",
    "custom": "Next.js + Node.js + PostgreSQL + Redis + WebSockets + AWS MediaLive"
  },
  "costRanges": {
    "simple": { "min": 15000, "max": 35000 },
    "standard": { "min": 50000, "max": 100000 },
    "complex": { "min": 120000, "max": 300000 }
  },
  "timelineWeeks": {
    "simple": { "min": 6, "max": 10 },
    "standard": { "min": 12, "max": 20 },
    "complex": { "min": 20, "max": 36 }
  },
  "criticalConsiderations": [
    "Real-time infrastructure is complex and expensive",
    "Mobile apps are usually essential (push notifications)",
    "Moderation and trust & safety from day one",
    "Scale considerations: WebSocket connections are resource-intensive",
    "Data retention and privacy (GDPR, message deletion)"
  ],
  "commonMistakes": [
    "Building real-time infrastructure from scratch when SDKs exist",
    "Underestimating moderation needs",
    "Launching without mobile apps",
    "Ignoring notification deliverability"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Communication Platform

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **Primary User:** [Who uses this to communicate?]
- **Use Case:** [Professional, social, community, support?]
- **Context:** [Desktop, mobile, or both?]
- **Frequency:** [All day, periodically, event-driven?]

*Communication products live or die by daily active usage. Design for habits.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Communication Platform Metrics:**
- Daily Active Users (DAU)
- Messages sent per user
- Session duration
- D1/D7/D30 retention
- Notification open rate

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Communication Essentials (if not included above):**
- User registration and profiles
- Real-time messaging (1:1 minimum)
- Push notifications
- Online/offline presence
- Basic moderation (block, report)

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for Communication:**
- Group chats / channels
- Voice and video calling
- Message reactions and threads
- File sharing and media
- Advanced search
- Bots and integrations

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**Communication-Specific Constraints:**
- Real-time features require WebSocket infrastructure
- Mobile apps are nearly essential (push notifications)
- Moderation is legally required in many jurisdictions
- Consider: End-to-end encryption requirements?
- Scale: WebSocket connections are expensive at scale

**8. RECOMMENDED APPROACH**
- Route: {{route}}
- Complexity: {{complexity}}

**Why this route for communication:**
Communication platforms have unique real-time requirements. We recommend {{route}} because real-time infrastructure is complex, but services like Stream, Twilio, and Sendbird can accelerate development.

**Suggested Tech Stack:**
- Frontend: React Native (mobile) + Next.js (web)
- Real-time: Stream Chat, Sendbird, or custom WebSockets
- Video: Twilio, Daily.co, or Agora
- Backend: Node.js + PostgreSQL + Redis
- Push: Firebase Cloud Messaging, OneSignal

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| No network effect | Seed with existing communities (import from Discord, Slack) |
| Real-time complexity | Use SDKs like Stream before building custom |
| Moderation burden | Automate with AI moderation + clear community guidelines |
| Mobile required | Plan for mobile from day 1, not as an afterthought |
| Cost at scale | Monitor WebSocket and API costs, plan for self-hosting |

**10. NEXT STEPS**
1. Define the core communication pattern (chat, video, async?)
2. Identify your wedge vs existing platforms
3. Decide: SDK vs custom for real-time infrastructure
4. Plan mobile strategy (React Native recommended for both platforms)
5. Build community guidelines before launch
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
      "reasoning": "Financial applications have strict security, compliance, and audit requirements that no-code platforms cannot adequately address. Even simple fintech needs custom development.",
      "bestFor": ["Internal financial dashboards only", "Non-customer-facing tools"],
      "limitations": ["PCI compliance", "Security requirements", "Audit trails", "Regulatory needs"]
    },
    "hybrid": {
      "recommendation": "Possible for some use cases",
      "reasoning": "You can use no-code for non-sensitive features (marketing site, basic dashboards) while custom code handles all financial data and transactions.",
      "bestFor": ["Financial dashboards", "Expense tracking", "Invoice management"],
      "limitations": ["All money movement needs custom code", "Compliance still required"]
    },
    "custom": {
      "recommendation": "Required for most fintech",
      "reasoning": "Handling money, financial data, or lending requires custom development to meet PCI-DSS, state regulations, and security best practices.",
      "bestFor": ["Payment processing", "Lending platforms", "Banking apps", "Investment tools"],
      "limitations": ["High cost", "Regulatory complexity", "Long timeline"]
    }
  },
  "typicalFeatures": [
    "Secure user authentication (MFA required)",
    "Bank account linking (Plaid)",
    "Transaction history and statements",
    "Payment processing",
    "KYC/identity verification",
    "Audit logging for all actions",
    "Fraud detection",
    "Reporting and compliance exports"
  ],
  "techStackSuggestions": {
    "no-code": "Not recommended for fintech",
    "hybrid": "Next.js (frontend) + Supabase + Plaid + Stripe (limited scope)",
    "custom": "Next.js + Node.js + PostgreSQL + Plaid + Stripe + Unit/Treasury Prime (banking) + Persona (KYC)"
  },
  "costRanges": {
    "simple": { "min": 40000, "max": 80000 },
    "standard": { "min": 100000, "max": 200000 },
    "complex": { "min": 250000, "max": 500000 }
  },
  "timelineWeeks": {
    "simple": { "min": 12, "max": 20 },
    "standard": { "min": 20, "max": 32 },
    "complex": { "min": 32, "max": 52 }
  },
  "criticalConsiderations": [
    "PCI-DSS compliance is mandatory for card data",
    "State money transmitter licenses may be required",
    "KYC/AML requirements add complexity and cost",
    "Banking-as-a-Service providers can accelerate launch",
    "Security audits and penetration testing required",
    "Consider regulatory sandbox programs"
  ],
  "commonMistakes": [
    "Underestimating compliance requirements and costs",
    "Building banking infrastructure instead of using BaaS",
    "Launching without proper licenses",
    "Insufficient security (encryption, audit logs, access control)",
    "Not budgeting for ongoing compliance costs"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Fintech / Banking

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **Primary User:** [Consumer, SMB, Enterprise?]
- **Financial Sophistication:** [Novice, Intermediate, Expert]
- **Use Case:** [Payments, savings, lending, investing, expense management?]
- **Trust Level Needed:** [High - you're handling their money]

*Fintech users are highly sensitive to security signals. Design and copy must convey trust.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Fintech-Specific Metrics:**
- Total Payment Volume (TPV)
- Assets Under Management (AUM)
- Default rate (lending)
- Customer Acquisition Cost (CAC)
- Fraud rate

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Fintech Essentials (if not included above):**
- Secure authentication with MFA
- Bank account linking (Plaid/Finicity)
- Transaction display
- Identity verification (KYC)
- Audit logging
- Data encryption at rest and in transit

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for Fintech:**
- Advanced fraud detection
- Card issuance
- ACH/wire transfers
- Credit scoring integration
- Tax document generation
- Mobile apps

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: **Yes (Required for Fintech)**
- Technical preferences: {{buildPreference}}

**Fintech-Specific Constraints:**

⚠️ **COMPLIANCE REQUIREMENTS:**
- **PCI-DSS:** Required if handling card data (use Stripe/Plaid to reduce scope)
- **KYC/AML:** Required for most money movement (Persona, Jumio, Alloy)
- **State Licenses:** Money transmitter licenses required in most states
- **SOC 2:** Expected by enterprise customers and partners

⚠️ **SECURITY REQUIREMENTS:**
- Encryption at rest and in transit
- Multi-factor authentication
- Session management and timeout
- Audit logging for all financial actions
- Regular security audits and pen testing

**8. RECOMMENDED APPROACH**
- Route: **custom** (required for fintech)
- Complexity: {{complexity}}

**Why custom development for fintech:**
Financial applications require custom development due to security, compliance, and audit requirements that no-code platforms cannot meet. Use Banking-as-a-Service providers to accelerate.

**Suggested Tech Stack:**
- Frontend: Next.js or React Native
- Backend: Node.js or Python + PostgreSQL
- Auth: Auth0 or custom with MFA
- Banking: Unit, Treasury Prime, or Synapse
- Payments: Stripe, Plaid, Dwolla
- KYC: Persona, Alloy, Jumio
- Infrastructure: AWS or GCP with SOC 2 compliance

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| Regulatory violations | Engage fintech attorney early, use BaaS providers |
| Security breach | SOC 2 compliance, regular audits, bug bounty program |
| Bank partnership rejection | Build compliance-first, document everything |
| High CAC | Focus on niche, word-of-mouth in communities |
| Fraud losses | Implement fraud detection from day 1, use Plaid signals |

**10. NEXT STEPS**
1. **Legal first:** Consult fintech attorney on licensing requirements
2. **Choose BaaS provider:** Unit, Treasury Prime, Synapse - don't build banking infra
3. **Compliance roadmap:** What licenses/certifications do you need and when?
4. **Security design:** Plan encryption, audit logging, access control upfront
5. **Start simple:** Launch with minimal financial features, expand carefully
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
      "reasoning": "HIPAA compliance requires strict access controls, encryption, audit logging, and BAAs with vendors. Most no-code platforms are not HIPAA-compliant.",
      "bestFor": ["Marketing sites", "Non-PHI scheduling", "General wellness (non-medical)"],
      "limitations": ["Cannot store PHI", "No HIPAA compliance", "No telehealth"]
    },
    "hybrid": {
      "recommendation": "Possible with HIPAA-compliant backend",
      "reasoning": "Use no-code for non-sensitive features while a HIPAA-compliant backend (AWS HIPAA, Google Cloud Healthcare) handles patient data.",
      "bestFor": ["Appointment scheduling", "Patient intake forms", "Simple telehealth"],
      "limitations": ["PHI must stay on compliant infrastructure", "Increased complexity"]
    },
    "custom": {
      "recommendation": "Required for most healthcare applications",
      "reasoning": "Healthcare apps need HIPAA compliance, EHR integrations, and strict security. Custom development on HIPAA-eligible infrastructure is the standard approach.",
      "bestFor": ["Telemedicine platforms", "Patient portals", "EHR integrations", "Health tracking with PHI"],
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
    "hybrid": "Webflow (marketing) + HIPAA-compliant backend + Doxy.me (video)",
    "custom": "Next.js + Node.js + PostgreSQL (encrypted) + AWS HIPAA + Twilio HIPAA + Stripe"
  },
  "costRanges": {
    "simple": { "min": 50000, "max": 100000 },
    "standard": { "min": 120000, "max": 250000 },
    "complex": { "min": 300000, "max": 600000 }
  },
  "timelineWeeks": {
    "simple": { "min": 14, "max": 24 },
    "standard": { "min": 24, "max": 40 },
    "complex": { "min": 40, "max": 60 }
  },
  "criticalConsiderations": [
    "HIPAA compliance is mandatory (not optional)",
    "BAAs required with ALL vendors handling PHI",
    "State telemedicine regulations vary significantly",
    "EHR integration (HL7/FHIR) is complex and expensive",
    "Video must be HIPAA-compliant (not regular Zoom)",
    "Insurance/billing adds significant complexity"
  ],
  "commonMistakes": [
    "Using non-HIPAA-compliant tools for PHI",
    "Not signing BAAs with vendors",
    "Underestimating state-by-state telehealth regulations",
    "Building EHR integration before validating demand",
    "Using consumer video tools for telehealth"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Healthcare / Telemedicine

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **Patient Type:** [General, specialty, chronic condition?]
- **Provider Type:** [Physicians, therapists, specialists?]
- **Care Setting:** [Primary care, urgent care, mental health?]
- **Demographics:** [Age, tech comfort, insurance status]

*Healthcare serves vulnerable populations. Design with accessibility, simplicity, and trust as priorities.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Healthcare-Specific Metrics:**
- Patient satisfaction (NPS)
- Appointment completion rate
- No-show rate
- Provider utilization
- Time to first appointment
- Insurance claim success rate

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Healthcare Essentials (if not included above):**
- HIPAA-compliant user authentication
- Patient registration with consent forms
- Appointment scheduling
- Video visit capability (HIPAA-compliant)
- Secure messaging (provider-patient)
- Audit logging for all PHI access

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for Healthcare:**
- EHR integration (Epic, Cerner, Athena)
- E-prescribing (Surescripts)
- Insurance verification and billing
- Lab result integration
- Care plan management
- Mobile apps

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: **Yes (HIPAA Required)**
- Technical preferences: {{buildPreference}}

**Healthcare-Specific Constraints:**

⚠️ **HIPAA COMPLIANCE (MANDATORY):**
- All PHI must be encrypted at rest and in transit
- Access controls and audit logging required
- BAAs required with EVERY vendor touching PHI
- Breach notification procedures required
- Employee training required
- Annual risk assessments required

⚠️ **STATE REGULATIONS:**
- Telemedicine licensure varies by state
- Some states require in-state physicians
- Prescribing regulations vary
- Mental health has additional requirements

⚠️ **VENDOR REQUIREMENTS:**
Must use HIPAA-compliant versions:
- AWS HIPAA Eligible Services
- Google Cloud Healthcare API
- Twilio HIPAA (not regular Twilio)
- Doxy.me, Zoom for Healthcare (not regular Zoom)

**8. RECOMMENDED APPROACH**
- Route: **custom** (required for healthcare)
- Complexity: {{complexity}}

**Why custom development for healthcare:**
Healthcare applications require custom development to ensure HIPAA compliance, proper audit logging, and the ability to sign BAAs with all vendors. No-code platforms cannot meet these requirements.

**Suggested Tech Stack:**
- Frontend: Next.js or React Native
- Backend: Node.js + PostgreSQL (encrypted)
- Infrastructure: AWS HIPAA or Google Cloud Healthcare
- Video: Twilio HIPAA, Doxy.me, or Daily.co HIPAA
- Auth: Auth0 with MFA or custom
- EHR Integration: Healthie, Canvas Medical, or custom FHIR

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| HIPAA violation | Use only HIPAA-eligible services, sign all BAAs, conduct risk assessment |
| State licensing | Start in states with favorable telehealth laws, expand carefully |
| Provider adoption | Design for provider workflow, minimize documentation burden |
| Patient trust | Clear privacy policy, security badges, transparent data practices |
| Insurance complexity | Start with cash-pay, add insurance later, or use billing service |

**10. NEXT STEPS**
1. **HIPAA preparation:** Conduct initial risk assessment, create policies
2. **Legal review:** Consult healthcare attorney on state regulations
3. **Choose compliant infrastructure:** AWS HIPAA, Google Healthcare
4. **Sign BAAs:** Before using any vendor, get BAA in place
5. **Start simple:** Basic scheduling + video before EHR integration
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
      "reasoning": "Platforms like Shopify, WooCommerce, and Webflow E-commerce handle most e-commerce needs out of the box. Only go custom if you have very unique requirements.",
      "bestFor": ["Standard product stores", "Digital products", "Subscription boxes"],
      "limitations": ["Complex B2B pricing", "Custom checkout flows", "Multi-vendor marketplaces"]
    },
    "hybrid": {
      "recommendation": "Good for customized stores",
      "reasoning": "Use Shopify/WooCommerce for core commerce while adding custom features (configurators, custom checkout, integrations) via headless approach.",
      "bestFor": ["Product configurators", "Custom checkout", "Inventory integrations"],
      "limitations": ["More complex than pure Shopify", "Higher ongoing costs"]
    },
    "custom": {
      "recommendation": "Only for complex requirements",
      "reasoning": "Custom e-commerce is expensive and maintenance-heavy. Only justified for multi-vendor marketplaces, complex B2B, or highly unique experiences.",
      "bestFor": ["Multi-vendor marketplaces", "B2B with complex pricing", "Unique shopping experiences"],
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
    "Shipping calculation and tracking",
    "Customer accounts",
    "Email notifications (order confirmation, shipping)"
  ],
  "techStackSuggestions": {
    "no-code": "Shopify, WooCommerce, or Webflow E-commerce",
    "hybrid": "Next.js + Shopify Headless (Hydrogen) or Medusa.js",
    "custom": "Next.js + Medusa.js or Saleor + PostgreSQL + Stripe"
  },
  "costRanges": {
    "simple": { "min": 3000, "max": 15000 },
    "standard": { "min": 20000, "max": 50000 },
    "complex": { "min": 60000, "max": 150000 }
  },
  "timelineWeeks": {
    "simple": { "min": 2, "max": 4 },
    "standard": { "min": 6, "max": 12 },
    "complex": { "min": 12, "max": 24 }
  },
  "criticalConsiderations": [
    "Use Shopify unless you have a specific reason not to",
    "Payment processing is solved (Stripe, PayPal)",
    "Shipping complexity is often underestimated",
    "Tax calculation by jurisdiction is required (TaxJar, Avalara)",
    "PCI compliance needed if handling card data directly"
  ],
  "commonMistakes": [
    "Building custom when Shopify would work",
    "Underestimating shipping and tax complexity",
    "Not planning for returns and refunds",
    "Ignoring mobile shopping experience",
    "Overcomplicating product options"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: E-commerce

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **Customer Type:** [B2C consumers, B2B buyers, or both?]
- **Purchase Frequency:** [One-time, recurring, seasonal?]
- **Average Order Value:** [Low <$50, Medium $50-200, High >$200]
- **Shopping Context:** [Impulse, research-heavy, subscription?]

*E-commerce conversion rates are typically 2-3%. Design every step to reduce friction.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**E-commerce Metrics:**
- Conversion rate
- Average Order Value (AOV)
- Cart abandonment rate
- Customer Lifetime Value (CLV)
- Return rate
- Revenue per visitor

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**E-commerce Essentials (if not included above):**
- Product catalog with images and descriptions
- Shopping cart
- Secure checkout
- Payment processing (cards + alternative methods)
- Order confirmation emails
- Basic order management

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for E-commerce:**
- Customer accounts with order history
- Wishlist / save for later
- Product reviews
- Discount codes and promotions
- Inventory sync with suppliers
- Advanced analytics

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**E-commerce-Specific Constraints:**
- PCI-DSS: Use Stripe/PayPal to minimize compliance scope
- Sales tax: Required in most states (use TaxJar/Avalara)
- Shipping: Integrate with carriers or use ShipStation
- Returns: Plan your return policy and process

**8. RECOMMENDED APPROACH**
- Route: {{route}}
- Complexity: {{complexity}}

**Why {{route}} for e-commerce:**
E-commerce is a well-solved problem. Unless you have unique requirements, platforms like Shopify provide everything you need at a fraction of custom development cost.

**Suggested Tech Stack:**
- Simple: Shopify, Squarespace Commerce, or WooCommerce
- Custom UI: Shopify Hydrogen (headless) or Medusa.js
- Payments: Shopify Payments, Stripe, PayPal
- Shipping: ShipStation, EasyPost
- Tax: TaxJar, Avalara (Shopify has built-in)

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| Low traffic | Focus on marketing before building features |
| Cart abandonment | Abandoned cart emails, guest checkout, fewer steps |
| Shipping costs | Negotiate rates, offer thresholds for free shipping |
| Returns eating margins | Clear product photos/descriptions, size guides |
| Inventory management | Start with dropship or pre-orders to validate demand |

**10. NEXT STEPS**
1. **Start with Shopify** unless you have specific reasons for custom
2. **Focus on product-market fit** before building features
3. **Set up analytics** from day 1 (GA4, conversion tracking)
4. **Plan shipping strategy** (who fulfills, what carriers)
5. **Start with a small catalog** - expand once validated
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
      "reasoning": "Platforms like Teachable, Thinkific, and Kajabi provide everything needed for selling courses. Only build custom if you need features they don't offer.",
      "bestFor": ["Video courses", "Cohort-based courses", "Membership sites"],
      "limitations": ["Custom learning paths", "Gamification", "LTI/LMS integrations"]
    },
    "hybrid": {
      "recommendation": "Good for differentiated platforms",
      "reasoning": "Use existing platforms for video hosting and payments, add custom features for your unique learning experience (cohorts, projects, peer review).",
      "bestFor": ["Bootcamps", "Interactive learning", "Peer-based learning"],
      "limitations": ["Integration complexity", "Multiple vendor management"]
    },
    "custom": {
      "recommendation": "For enterprise LMS or unique experiences",
      "reasoning": "Custom development makes sense for enterprise LMS with SSO/SCORM, highly interactive learning, or when the learning experience IS your differentiator.",
      "bestFor": ["Enterprise LMS", "Interactive simulations", "Tutoring marketplaces"],
      "limitations": ["Video hosting is expensive", "High development cost"]
    }
  },
  "typicalFeatures": [
    "Course catalog and enrollment",
    "Video lessons with progress tracking",
    "Quizzes and assessments",
    "Completion certificates",
    "Student dashboard",
    "Discussion forums or comments",
    "Payment and subscription handling",
    "Admin dashboard for instructors"
  ],
  "techStackSuggestions": {
    "no-code": "Teachable, Thinkific, Kajabi, or Circle (community)",
    "hybrid": "Next.js + Mux (video) + Stripe + custom LMS features",
    "custom": "Next.js + Node.js + PostgreSQL + Mux/Cloudflare Stream + Stripe"
  },
  "costRanges": {
    "simple": { "min": 5000, "max": 15000 },
    "standard": { "min": 25000, "max": 60000 },
    "complex": { "min": 80000, "max": 180000 }
  },
  "timelineWeeks": {
    "simple": { "min": 2, "max": 6 },
    "standard": { "min": 8, "max": 16 },
    "complex": { "min": 16, "max": 28 }
  },
  "criticalConsiderations": [
    "Video hosting costs can be significant at scale",
    "Content is the product - platform is secondary",
    "Completion rates for online courses are low (3-15%)",
    "Mobile experience matters for learning",
    "FERPA compliance if serving K-12 or higher ed in US"
  ],
  "commonMistakes": [
    "Building platform before validating course demand",
    "Overcomplicating the learning experience",
    "Not budgeting for video hosting costs",
    "Ignoring completion rate optimization",
    "Building custom when Teachable would work"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Education / Learning

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **Learner Type:** [Professional upskilling, hobbyist, student, corporate?]
- **Learning Context:** [Self-paced, cohort-based, live instruction?]
- **Skill Level:** [Beginner, intermediate, advanced?]
- **Time Commitment:** [Quick lessons, deep courses, ongoing membership?]

*Course completion rates are notoriously low (3-15%). Design for engagement and accountability.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Education Metrics:**
- Course completion rate
- Student satisfaction (NPS)
- Revenue per student
- Time in platform
- Assessment pass rates
- Referral rate

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Education Essentials (if not included above):**
- Course landing page with curriculum
- Student registration
- Video lessons (or your content format)
- Progress tracking
- Payment processing
- Completion tracking

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for Education:**
- Quizzes and assessments
- Completion certificates
- Discussion forums
- Live sessions
- Mobile app
- Instructor analytics

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**Education-Specific Constraints:**
- Video hosting: Significant cost at scale (use Mux, Cloudflare Stream)
- FERPA: Required for K-12 / higher ed student data
- Accessibility: WCAG compliance increasingly required
- Mobile: Essential for modern learners

**8. RECOMMENDED APPROACH**
- Route: {{route}}
- Complexity: {{complexity}}

**Why {{route}} for education:**
Education platforms benefit from proven solutions. Unless you're building something highly differentiated, platforms like Teachable, Thinkific, or Circle handle the core needs.

**Suggested Tech Stack:**
- Simple courses: Teachable, Thinkific, Podia
- Community + courses: Circle, Mighty Networks
- Custom: Next.js + Mux (video) + Stripe + PostgreSQL
- Live: Zoom API, Daily.co, or 100ms

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| Low completion rates | Cohort-based, accountability partners, shorter modules |
| Content creation bottleneck | Start with live, record and polish later |
| Video hosting costs | Use efficient encoding, consider Cloudflare Stream |
| Competition from free content | Focus on outcomes and community, not just content |
| Pricing pressure | Value-based pricing on outcomes, not hours |

**10. NEXT STEPS**
1. **Validate demand:** Can you pre-sell the course before building?
2. **Create minimum content:** Start with a few modules, not a complete curriculum
3. **Consider existing platforms** before building custom
4. **Plan engagement strategy:** How will you combat low completion?
5. **Start live, then record:** Easier to improve based on feedback
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
      "reasoning": "Tools like Retool, Metabase, or even Google Looker Studio can create dashboards without custom code. Great for internal tools and basic reporting.",
      "bestFor": ["Internal dashboards", "Simple BI", "Report builders"],
      "limitations": ["Large datasets", "Complex transformations", "Custom visualizations"]
    },
    "hybrid": {
      "recommendation": "Common for analytics products",
      "reasoning": "Use established tools (Metabase, Preset) for visualization while custom code handles data pipelines, transformations, and integrations.",
      "bestFor": ["Customer-facing dashboards", "ETL + visualization", "Embedded analytics"],
      "limitations": ["May hit limits of embedded tools"]
    },
    "custom": {
      "recommendation": "For analytics-as-product",
      "reasoning": "If analytics IS your product (not just a feature), custom development gives you full control over the experience, performance, and differentiation.",
      "bestFor": ["BI platforms", "Large-scale data processing", "Real-time analytics"],
      "limitations": ["Expensive", "Complex infrastructure", "Ongoing maintenance"]
    }
  },
  "typicalFeatures": [
    "Dashboard with visualizations",
    "Data connectors and integrations",
    "Query builder or report creator",
    "Filters and drill-downs",
    "Export to PDF/CSV/Excel",
    "Scheduled reports and alerts",
    "User permissions and sharing",
    "Embedded analytics options"
  ],
  "techStackSuggestions": {
    "no-code": "Retool, Metabase, Google Looker Studio, or Preset",
    "hybrid": "Next.js + Metabase/Preset (embedded) + custom data pipelines",
    "custom": "Next.js + Node.js + PostgreSQL/ClickHouse + D3.js/Recharts + dbt"
  },
  "costRanges": {
    "simple": { "min": 10000, "max": 30000 },
    "standard": { "min": 40000, "max": 100000 },
    "complex": { "min": 120000, "max": 300000 }
  },
  "timelineWeeks": {
    "simple": { "min": 4, "max": 8 },
    "standard": { "min": 10, "max": 18 },
    "complex": { "min": 18, "max": 32 }
  },
  "criticalConsiderations": [
    "Data infrastructure is often more work than the UI",
    "Query performance at scale is hard",
    "Data freshness expectations must be set",
    "Security and access control for sensitive data",
    "Embedded analytics has licensing considerations"
  ],
  "commonMistakes": [
    "Building visualization tools when Metabase exists",
    "Underestimating data pipeline complexity",
    "Not planning for query performance at scale",
    "Ignoring data freshness requirements",
    "Over-engineering before validating what users need"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Analytics / Data Platform

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **User Role:** [Analyst, executive, operations, developer?]
- **Technical Level:** [Non-technical, SQL-capable, data engineer?]
- **Use Case:** [Monitoring, exploration, reporting, decisions?]
- **Frequency:** [Real-time, daily, weekly, ad-hoc?]

*Analytics tools are only valuable if people use them. Design for your least technical user.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Analytics Platform Metrics:**
- Daily/Weekly Active Users
- Reports generated per user
- Time to insight (query speed)
- Dashboard engagement
- Export/share frequency

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Analytics Essentials (if not included above):**
- Data connectors to key sources
- Basic dashboard with key metrics
- Filtering and date ranges
- Export capability
- User authentication

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for Analytics:**
- Custom report builder
- Scheduled reports and alerts
- Advanced visualizations
- SQL editor (for technical users)
- Embedded analytics
- API access

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**Analytics-Specific Constraints:**
- Data volume: How much data, how fast does it need to query?
- Data freshness: Real-time, hourly, daily?
- Data sources: How many, how complex to connect?
- Security: Who can see what data?

**8. RECOMMENDED APPROACH**
- Route: {{route}}
- Complexity: {{complexity}}

**Why {{route}} for analytics:**
Analytics platforms require significant data infrastructure. Consider using embedded tools (Metabase, Preset) for visualization while focusing custom development on data pipelines and integrations.

**Suggested Tech Stack:**
- Visualization: Metabase, Preset, or custom (D3.js, Recharts)
- Data warehouse: PostgreSQL, ClickHouse, or BigQuery
- Pipelines: dbt, Airbyte, or Fivetran
- Backend: Node.js or Python
- Caching: Redis for query performance

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| Slow queries | Use OLAP database (ClickHouse), pre-aggregation, caching |
| Data quality issues | Invest in data validation, monitoring, lineage |
| Low adoption | Focus on key metrics users care about, not all data |
| Integration complexity | Start with 1-2 sources, prove value, then expand |
| Scope creep | Define "report" clearly, resist custom one-offs |

**10. NEXT STEPS**
1. **Identify key metrics:** What 3-5 numbers do users NEED to see?
2. **Map data sources:** Where does the data live, how to connect?
3. **Choose visualization approach:** Embedded tool vs custom
4. **Plan data infrastructure:** Warehouse, pipelines, freshness
5. **Start with one dashboard** before building a platform
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
      "reasoning": "Tools like Retool, Appsmith, and Budibase are specifically designed for internal tools. Faster and cheaper than custom development.",
      "bestFor": ["Admin panels", "Ops dashboards", "Data entry tools", "Approval workflows"],
      "limitations": ["Complex integrations", "High-performance requirements", "Customer-facing features"]
    },
    "hybrid": {
      "recommendation": "Good for complex internal tools",
      "reasoning": "Use no-code for CRUD and dashboards, custom code for complex business logic, integrations, or automation.",
      "bestFor": ["Workflow automation", "Complex approval chains", "Multi-system integration"],
      "limitations": ["Increases maintenance complexity"]
    },
    "custom": {
      "recommendation": "Rarely needed for internal tools",
      "reasoning": "Custom development for internal tools is usually overkill. Only consider if no-code truly can't meet requirements.",
      "bestFor": ["Mission-critical ops tools", "High-frequency trading tools", "Complex algorithms"],
      "limitations": ["Expensive for internal use", "Slower to iterate"]
    }
  },
  "typicalFeatures": [
    "CRUD operations on database tables",
    "Dashboard with key metrics",
    "Search and filtering",
    "User management and permissions",
    "Audit logging",
    "Bulk operations",
    "Export/import data",
    "Notifications and alerts"
  ],
  "techStackSuggestions": {
    "no-code": "Retool, Appsmith, Budibase, or Airplane",
    "hybrid": "Retool + custom API endpoints for complex logic",
    "custom": "Next.js + Node.js + PostgreSQL (rarely needed)"
  },
  "costRanges": {
    "simple": { "min": 3000, "max": 10000 },
    "standard": { "min": 15000, "max": 40000 },
    "complex": { "min": 50000, "max": 100000 }
  },
  "timelineWeeks": {
    "simple": { "min": 1, "max": 3 },
    "standard": { "min": 4, "max": 8 },
    "complex": { "min": 8, "max": 16 }
  },
  "criticalConsiderations": [
    "ROI must justify cost (internal tools don't generate revenue)",
    "Maintenance burden falls on your team",
    "Security still matters (internal != unprotected)",
    "User adoption is often the hardest part",
    "Consider SaaS alternatives before building"
  ],
  "commonMistakes": [
    "Over-engineering internal tools",
    "Building when a spreadsheet would work",
    "Ignoring user adoption and training",
    "Not securing internal tools properly",
    "Custom building what Retool can do in hours"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: Internal Tool

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **Role:** [Ops, support, finance, engineering?]
- **Technical Level:** [Non-technical, technical, mixed?]
- **Usage Frequency:** [All day, daily, weekly?]
- **Current Solution:** [Spreadsheets, manual, outdated tool?]

*Internal tools succeed when they save significant time. Quantify the current pain.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Internal Tool Metrics:**
- Time saved per task
- Error reduction rate
- User adoption rate
- Tasks completed per day
- Support ticket reduction

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Internal Tool Essentials (if not included above):**
- User authentication (SSO if available)
- Core CRUD operations
- Search and filtering
- Basic permissions
- Audit logging

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for Internal Tools:**
- Advanced permissions and roles
- Workflow automation
- Slack/email notifications
- Reporting and exports
- API for other tools

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**Internal Tool-Specific Constraints:**
- Must integrate with existing systems
- Security: Internal != unprotected
- Training: Plan for user adoption
- Maintenance: Who owns this long-term?

**8. RECOMMENDED APPROACH**
- Route: **no-code** (recommended for internal tools)
- Complexity: {{complexity}}

**Why no-code for internal tools:**
Internal tools rarely justify custom development costs. Platforms like Retool, Appsmith, and Budibase can build in hours what would take weeks with custom code.

**Suggested Tech Stack:**
- Primary: Retool, Appsmith, Budibase, or Airplane
- Database: Your existing database or Supabase
- Auth: SSO via your identity provider
- Notifications: Slack integration

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| Low adoption | Involve users in design, mandate usage for key workflows |
| Scope creep | Define MVP tightly, resist "while we're at it" |
| Maintenance burden | Choose tools with low maintenance, document thoroughly |
| Security gaps | Treat internal tools with same security as external |
| Over-engineering | Start with Retool, only go custom if truly needed |

**10. NEXT STEPS**
1. **Quantify the pain:** How much time/money is the current process costing?
2. **Evaluate no-code first:** Can Retool/Appsmith solve this in a day?
3. **Start with one workflow** before building a platform
4. **Plan for adoption:** Training, documentation, feedback loop
5. **Assign an owner:** Who maintains this after launch?
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
      "reasoning": "Backend services typically need custom code for business logic, performance, and integrations. No-code backends (Xano, Supabase) work for simple CRUD but hit limits quickly.",
      "bestFor": ["Simple CRUD APIs", "Prototypes", "MVP validation"],
      "limitations": ["Complex logic", "High performance", "Custom integrations"]
    },
    "hybrid": {
      "recommendation": "Good for extending existing tools",
      "reasoning": "Use Supabase or Xano for database and auth, add custom serverless functions for complex business logic.",
      "bestFor": ["CRUD + custom logic", "Moderate complexity APIs", "Early-stage products"],
      "limitations": ["May outgrow no-code backend"]
    },
    "custom": {
      "recommendation": "Standard for backend services",
      "reasoning": "Backend services are code. Custom development gives you full control over logic, performance, scaling, and integrations.",
      "bestFor": ["Core business APIs", "High-performance services", "Complex integrations"],
      "limitations": ["Requires backend expertise", "Infrastructure management"]
    }
  },
  "typicalFeatures": [
    "RESTful or GraphQL API endpoints",
    "Authentication and API keys",
    "Rate limiting",
    "Request validation",
    "Error handling and logging",
    "Database operations",
    "Background job processing",
    "Webhook support"
  ],
  "techStackSuggestions": {
    "no-code": "Xano, Supabase, or Firebase",
    "hybrid": "Supabase + Edge Functions or AWS Lambda",
    "custom": "Node.js/Python/Go + PostgreSQL + Redis + Docker/Kubernetes"
  },
  "costRanges": {
    "simple": { "min": 8000, "max": 20000 },
    "standard": { "min": 25000, "max": 60000 },
    "complex": { "min": 70000, "max": 150000 }
  },
  "timelineWeeks": {
    "simple": { "min": 3, "max": 6 },
    "standard": { "min": 6, "max": 12 },
    "complex": { "min": 12, "max": 24 }
  },
  "criticalConsiderations": [
    "API design is hard to change - plan carefully",
    "Security is critical (auth, rate limiting, validation)",
    "Performance requirements drive architecture",
    "Documentation is essential for developers",
    "Versioning strategy needed for breaking changes"
  ],
  "commonMistakes": [
    "Poor API design that can't evolve",
    "Insufficient security measures",
    "No rate limiting (leads to abuse)",
    "Missing or outdated documentation",
    "Not planning for scale from the start"
  ]
}
```

### Project Clarity Brief Template

```markdown
**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: API / Backend Service

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
- **Developer Type:** [Internal team, external developers, partners?]
- **Use Case:** [Integration, data access, processing, webhook?]
- **Expected Volume:** [Requests per second/minute/hour]
- **Latency Requirements:** [Real-time, near-real-time, batch?]

*APIs serve developers. Design for developer experience (DX) as carefully as user experience.*

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**API Metrics:**
- Requests per second
- P99 latency
- Error rate
- API uptime
- Developer adoption

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**API Essentials (if not included above):**
- Core endpoints for primary use case
- Authentication (API keys or OAuth)
- Rate limiting
- Request/response validation
- Error handling with clear messages
- Basic documentation

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**Typical Post-MVP for APIs:**
- Advanced authentication (OAuth, JWT)
- Webhook support
- SDKs for popular languages
- Interactive documentation (Swagger)
- Usage analytics
- API versioning

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**API-Specific Constraints:**
- Performance: What latency and throughput are required?
- Availability: What uptime SLA do you need?
- Security: What data is exposed, who can access?
- Scalability: How do you handle traffic spikes?

**8. RECOMMENDED APPROACH**
- Route: **custom** (recommended for APIs)
- Complexity: {{complexity}}

**Why custom development for APIs:**
Backend services require code for business logic, performance optimization, and security. Use managed services (databases, queues) but own your core logic.

**Suggested Tech Stack:**
- Runtime: Node.js, Python (FastAPI), Go, or Rust
- Database: PostgreSQL, MongoDB, or Redis
- Queue: BullMQ, RabbitMQ, or SQS
- Hosting: AWS, GCP, Fly.io, or Railway
- Docs: Swagger/OpenAPI, Readme.io

**9. KEY RISKS & MITIGATIONS**

| Risk | Mitigation |
|------|------------|
| Poor API design | Review with API design experts, follow REST/GraphQL best practices |
| Security vulnerabilities | Auth from day 1, rate limiting, input validation, security audit |
| Performance issues | Load testing, caching strategy, async processing |
| Breaking changes | API versioning strategy, deprecation policy |
| Low adoption | Great docs, SDKs, developer relations |

**10. NEXT STEPS**
1. **Design API first:** OpenAPI spec before coding
2. **Choose architecture:** REST, GraphQL, or gRPC?
3. **Plan authentication:** API keys, OAuth, or both?
4. **Set up infrastructure:** CI/CD, monitoring, logging
5. **Write documentation:** API docs are your sales tool
```

---

## 11. Real Estate (Future)

**Q2 Value:** `Real Estate / PropTech (property listings, agent tools, property management)`

*(Template to be implemented when vertical is added)*

### Key Characteristics
- Property listings with rich media
- Map integrations essential
- MLS/IDX integrations (complex, gated)
- Lead management for agents
- Virtual tours and 3D walkthroughs
- Mortgage/financing calculators

---

## 12. Legal Tech (Future)

**Q2 Value:** `Legal Tech (document automation, case management, e-signatures)`

*(Template to be implemented when vertical is added)*

### Key Characteristics
- Document generation and automation
- E-signatures (DocuSign, HelloSign integrations)
- Client portal and communication
- Time tracking and billing
- Case/matter management
- Compliance and confidentiality (privilege)

---

## 13. HR Tech (Future)

**Q2 Value:** `HR Tech (recruiting, onboarding, performance management)`

*(Template to be implemented when vertical is added)*

### Key Characteristics
- Applicant tracking system (ATS)
- Employee onboarding flows
- HRIS integrations (Workday, BambooHR)
- Performance reviews and feedback
- Benefits administration
- Compliance (labor laws, I-9, etc.)

---

## 14. Logistics (Future)

**Q2 Value:** `Logistics / Supply Chain (inventory, shipping, fleet management)`

*(Template to be implemented when vertical is added)*

### Key Characteristics
- Inventory management
- Shipping/carrier integrations
- Route optimization
- Fleet tracking (GPS)
- Warehouse management
- EDI integrations for enterprise