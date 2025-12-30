import type { VerticalResultsTemplate } from "./types";

export const DEFAULT_TEMPLATE: VerticalResultsTemplate = {
  vertical: "other",
  routeGuidance: {
    "no-code": {
      recommendation: "Consider for simple applications",
      reasoning: "No-code platforms work well for straightforward CRUD applications, landing pages, and MVPs.",
      bestFor: ["Simple web apps", "Landing pages", "Basic workflows", "Prototypes"],
      limitations: ["Complex business logic", "Custom integrations", "High-performance needs"],
    },
    hybrid: {
      recommendation: "Balanced approach for most projects",
      reasoning: "A hybrid approach combines the speed of no-code with custom code for unique requirements.",
      bestFor: ["Custom + standard features", "Moderate complexity", "Integrations needed"],
      limitations: ["Requires both skill sets", "More coordination"],
    },
    custom: {
      recommendation: "For complex or unique requirements",
      reasoning: "Custom development gives you full control over functionality and performance.",
      bestFor: ["Complex logic", "Unique UX", "Performance-critical", "Enterprise"],
      limitations: ["Higher cost", "Longer timeline"],
    },
  },
  typicalFeatures: [
    "User authentication",
    "Dashboard",
    "Data management (CRUD)",
    "Search and filtering",
    "Notifications",
    "Settings and preferences",
    "Admin panel",
    "Reporting and exports",
  ],
  techStackSuggestions: {
    "no-code": "Bubble, Webflow, or Retool depending on use case",
    hybrid: "Next.js + Supabase + no-code for specific features",
    custom: "Next.js + Node.js + PostgreSQL",
  },
  costRanges: {
    low: { min: 5000, max: 15000 },
    medium: { min: 20000, max: 50000 },
    high: { min: 60000, max: 150000 },
  },
  timelineWeeks: {
    low: { min: 3, max: 6 },
    medium: { min: 6, max: 12 },
    high: { min: 12, max: 24 },
  },
  criticalConsiderations: [
    "Define your unique value proposition clearly",
    "Start with core features only",
    "Plan for iteration based on user feedback",
    "Consider your technical maintenance capacity",
    "Validate demand before building",
  ],
  commonMistakes: [
    "Building too many features before validation",
    "Over-engineering for hypothetical scale",
    "Not talking to users before building",
    "Ignoring mobile responsiveness",
    "Underestimating maintenance needs",
  ],
};
