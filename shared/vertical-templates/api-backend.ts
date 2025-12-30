import type { VerticalResultsTemplate } from "./types";

export const API_BACKEND_TEMPLATE: VerticalResultsTemplate = {
  vertical: "api-backend",
  routeGuidance: {
    "no-code": {
      recommendation: "Limited viability",
      reasoning: "Backend services need custom code for logic and performance.",
      bestFor: ["Simple CRUD APIs", "Prototypes", "MVP validation"],
      limitations: ["Complex logic", "High performance", "Custom integrations"],
    },
    hybrid: {
      recommendation: "Good for extending existing tools",
      reasoning: "Supabase/Xano for database/auth, custom for complex logic.",
      bestFor: ["CRUD + custom logic", "Moderate complexity", "Early-stage"],
      limitations: ["May outgrow no-code backend"],
    },
    custom: {
      recommendation: "Standard for backend services",
      reasoning: "Full control over logic, performance, scaling, integrations.",
      bestFor: ["Core business APIs", "High-performance", "Complex integrations"],
      limitations: ["Requires backend expertise", "Infrastructure management"],
    },
  },
  typicalFeatures: [
    "RESTful or GraphQL endpoints",
    "Authentication and API keys",
    "Rate limiting",
    "Request validation",
    "Error handling and logging",
    "Database operations",
    "Background jobs",
    "Webhook support",
  ],
  techStackSuggestions: {
    "no-code": "Xano, Supabase, or Firebase",
    hybrid: "Supabase + Edge Functions or AWS Lambda",
    custom: "Node.js/Python/Go + PostgreSQL + Redis + Docker/Kubernetes",
  },
  costRanges: {
    low: { min: 8000, max: 20000 },
    medium: { min: 25000, max: 60000 },
    high: { min: 70000, max: 150000 },
  },
  timelineWeeks: {
    low: { min: 3, max: 6 },
    medium: { min: 6, max: 12 },
    high: { min: 12, max: 24 },
  },
  criticalConsiderations: [
    "API design hard to change",
    "Security is critical",
    "Performance requirements drive architecture",
    "Documentation essential",
    "Versioning strategy needed",
  ],
  commonMistakes: [
    "Poor API design that can't evolve",
    "Insufficient security",
    "No rate limiting",
    "Missing documentation",
    "Not planning for scale",
  ],
};
