// Assessment questionnaire data structure - 28 questions across 6 sections
// Maps to PRD/SOW generation

import { Q4_FEATURE_CATALOG, getCoreFeaturesFromQ4Answer } from "@shared/feature-catalog";
import { migrateProductType } from "@shared/utils/product-type-migrator";

export interface OptionItem {
  value: string;
  label?: string;
  tooltip?: string;
}

export interface CategoryGroup {
  category: string;
  options: OptionItem[];
}

export interface AssessmentQuestion {
  id: number;
  section: "A" | "B" | "C" | "D" | "E";
  question: string;
  helperText?: string;
  type: "single" | "multiple" | "text" | "number" | "searchable-multi-select";
  options?: string[];
  categorizedOptions?: CategoryGroup[];
  required: boolean;
  maxSelections?: number;
  conditional?: {
    questionId: number;
    value: string | string[];
  };
}

export interface AssessmentResponse {
  [key: number]: any;
}

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    section: "A",
    question: "Q1: What stage is your product at?",
    type: "single",
    options: [
      "Have customer interviews (clear pain point)",
      "Have a waitlist or early customers",
      "Have designs/mockups",
      "Have a prototype",
      "Live product (needs rebuild/features)",
    ],
    required: true,
  },
  {
    id: 2,
    section: "A",
    question: "Q2: What type of product are you building?",
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
  {
    id: 3,
    section: "A",
    question: "Q3: What platform(s) do you need?",
    type: "single",
    options: [
      "Web only",
      "Mobile only (iOS, Android, or both)",
      "Web + Mobile",
      "Not sure yet",
    ],
    required: true,
  },
  {
    id: 4,
    section: "B",
    question: "Q4: What are the 3-5 core features your MVP must have?",
    helperText:
      "Select up to 5 total features. Start typing to search, then pick matches from the list.\n\nIf you don't see a feature, add it in the Other box below (one per line or comma-separated). It counts toward the same total of 5.\n\nOrder matters: move your most important features to the top.",
    type: "searchable-multi-select",
    categorizedOptions: Q4_FEATURE_CATALOG,
    maxSelections: 5,
    required: true,
  },
  {
    id: 5,
    section: "B",
    question: "Q5: Which of these does your MVP need on day one?",
    type: "multiple",
    options: [
      "Payments / subscriptions",
      "User authentication (login/signup)",
      "Real-time features (chat, notifications, live updates)",
      "Mobile app (native or PWA)",
      "Compliance (HIPAA, SOC2, GDPR, PCI)",
      "Third-party integrations",
      "Admin dashboard",
      "None of these",
    ],
    required: true,
  },
  {
    id: 6,
    section: "C",
    question: "Q6: What's your budget for the initial build?",
    type: "single",
    options: [
      "Under $5,000",
      "$5,000 - $10,000",
      "$10,000 - $20,000",
      "$20,000 - $40,000",
      "$40,000 - $75,000",
      "Over $75,000",
      "Not sure yet",
    ],
    required: true,
  },
  {
    id: 7,
    section: "C",
    question: "Q7: When do you need the MVP launched?",
    type: "single",
    options: [
      "ASAP (1-2 months)",
      "Standard (3-4 months)",
      "Flexible (5+ months)",
      "Not sure yet",
    ],
    required: true,
  },
  {
    id: 8,
    section: "C",
    question: "Q8: Do you have a preference for how it's built?",
    type: "single",
    options: [
      "No-code / low-code (Bubble, Webflow, etc.)",
      "Custom code",
      "Open to either (recommend what's best)",
      "Not sure",
    ],
    required: true,
  },
  {
    id: 9,
    section: "C",
    question: "Q9: How comfortable are you managing a developer?",
    type: "single",
    options: [
      "Very comfortable (I've done this before)",
      "Somewhat comfortable (I can figure it out)",
      "Not comfortable (I'll need guidance)",
      "No idea what to expect",
    ],
    required: true,
  },
  {
    id: 10,
    section: "C",
    question: "Q10: Have you hired developers before?",
    type: "single",
    options: ["Multiple times", "Once before", "First time", "Only worked with agencies"],
    required: true,
  },
  {
    id: 11,
    section: "D",
    question: "Q11: What are your timezone requirements?",
    type: "single",
    options: [
      "Must overlap with my working hours (specify timezone)",
      "Prefer overlap, but async is okay",
      "No preference (async is fine)",
      "Not sure",
    ],
    required: true,
  },
  {
    id: 12,
    section: "D",
    question: "Q12: Describe what you're building",
    type: "text",
    required: true,
  },
  {
    id: 13,
    section: "D",
    question: "Q13: How will you measure success?",
    type: "text",
    required: true,
  },
  {
    id: 14,
    section: "D",
    question: "Q14: What tools or services need to integrate with your product?",
    type: "multiple",
    options: [
      "Stripe (payments)",
      "Google Calendar",
      "Slack",
      "Twilio (SMS)",
      "SendGrid / email service",
      "Zapier",
      "Google Maps",
      "Social login (Google, Apple, etc.)",
      "Analytics (Mixpanel, Amplitude, etc.)",
    ],
    required: true,
  },
  {
    id: 15,
    section: "D",
    question: "Q15: Contact details",
    type: "text",
    required: true,
  },
  {
    id: 16,
    section: "E",
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
];

// Route determination logic
export interface RouteResult {
  route: "no-code" | "hybrid" | "custom";
  complexity: "simple" | "standard" | "complex";
  recommendation: string;
  reasoning: string;
  devRole?: string;
  projectType?: string;
  timeline?: string;
  budgetRange?: string;
  topFeatures?: string[];
}

export function determineRoute(responses: AssessmentResponse): RouteResult {
  const budget = String(responses[6] || "").replace(/\u2013|\u2014/g, "-");
  const projectType = migrateProductType(String(responses[2] || ""));
  const platform = String(responses[3] || "");
  const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];
  const buildPreference = String(responses[8] || "").replace(/\u2013|\u2014/g, "-");
  const timeline = String(responses[7] || "");

  const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);

  const hasMobilePlatform = platform.includes("Mobile") || platform.includes("Web + Mobile");

  const hasRealTime = dayOneNeeds.includes("Real-time features (chat, notifications, live updates)");
  const hasCompliance = dayOneNeeds.includes("Compliance (HIPAA, SOC2, GDPR, PCI)");
  const hasMobileRequirement = dayOneNeeds.includes("Mobile app (native or PWA)") || hasMobilePlatform;
  const hasThirdPartyIntegrations = dayOneNeeds.includes("Third-party integrations");

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

  let noCodeScore = 0;

  if (budget === "Under $5,000" || budget === "$5,000 - $10,000") {
    noCodeScore += 3;
  } else if (budget === "$10,000 - $20,000") {
    noCodeScore += 2;
  } else if (budget === "$20,000 - $40,000") {
    noCodeScore += 1;
  }

  if (platform === "Web only") {
    noCodeScore += 3;
  } else if (platform === "Not sure yet") {
    noCodeScore += 1;
  } else {
    noCodeScore -= 4;
  }

  if (buildPreference.includes("No-code")) {
    noCodeScore += 3;
  } else if (buildPreference === "Custom code") {
    noCodeScore -= 3;
  }

  if (coreFeatures.length <= 3) {
    noCodeScore += 2;
  } else if (coreFeatures.length >= 5) {
    noCodeScore -= 1;
  }

  if (hasRealTime) noCodeScore -= 4;
  if (hasCompliance) noCodeScore -= 5;
  if (hasMobileRequirement) noCodeScore -= 5;
  if (hasThirdPartyIntegrations) noCodeScore -= 2;
  if (isCustomPreferredVertical) noCodeScore -= 2;

  let route: "no-code" | "hybrid" | "custom";

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

  if (isComplianceHeavyVertical) {
    if (buildPreference.includes("No-code") && noCodeScore >= 10) {
      route = "hybrid";
    } else {
      route = "custom";
    }
  }

  if (isCustomPreferredVertical && route === "no-code") {
    route = "hybrid";
  }

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
  if (isComplianceHeavyVertical) complexityScore += 2;

  if (complexityScore <= 4) {
    complexity = "simple";
  } else if (complexityScore >= 8) {
    complexity = "complex";
  } else {
    complexity = "standard";
  }

  const recommendation =
    route === "no-code"
      ? "Start with a no-code / low-code build to ship quickly and get early customers."
      : route === "hybrid"
        ? "Use a hybrid approach: no-code where it speeds you up, custom code where it matters."
        : "Plan for a custom build for flexibility, performance, and scalability."
      ;

  const reasoning =
    route === "no-code"
      ? "Your platform needs and day-one requirements are a strong fit for no-code tools, and your scope can be shipped quickly."
      : route === "hybrid"
        ? "You have some requirements that benefit from custom code, but parts of the product can still ship faster with no-code."
        : "Your requirements (like mobile, compliance, or real-time) tend to require custom engineering from day one.";

  const devRole =
    hasMobileRequirement
      ? "mobile-developer"
      : route === "no-code"
        ? "no-code-builder"
        : route === "hybrid"
          ? "hybrid-developer"
          : "fullstack-developer";

  const topFeatures = [...coreFeatures, ...dayOneNeeds].filter(
    (x) => x && x !== "None of these"
  );

  return {
    route,
    complexity,
    recommendation,
    reasoning,
    devRole,
    projectType,
    timeline,
    budgetRange: budget,
    topFeatures,
  };
}
