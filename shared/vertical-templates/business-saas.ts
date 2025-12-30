import type { VerticalResultsTemplate } from "./types";

export const BUSINESS_SAAS_TEMPLATE: VerticalResultsTemplate = {
  vertical: "business-saas",
  routeGuidance: {
    "no-code": {
      recommendation: "Viable for internal tools and simple SaaS",
      reasoning: "No-code platforms handle CRUD, dashboards, basic workflows.",
      bestFor: ["Internal dashboards", "Simple CRM", "Basic project tracking"],
      limitations: ["Complex workflows", "Heavy integrations", "Scale beyond 10K users"],
    },
    hybrid: {
      recommendation: "Good balance for most B2B SaaS",
      reasoning: "No-code for prototyping, custom code for core logic.",
      bestFor: ["CRM with custom workflows", "Project management", "Team collaboration"],
      limitations: ["May need rebuild later"],
    },
    custom: {
      recommendation: "Best for differentiated SaaS",
      reasoning: "Full control for unique workflows, AI features, complex integrations.",
      bestFor: ["Complex enterprise SaaS", "AI-powered tools", "Heavy integrations"],
      limitations: ["Higher upfront cost", "Longer time to market"],
    },
  },
  typicalFeatures: [
    "User auth with team/workspace support",
    "Role-based access control",
    "Dashboard with key metrics",
    "CRUD operations",
    "Search and filtering",
    "Notifications",
    "Settings and preferences",
    "Data export",
  ],
  techStackSuggestions: {
    "no-code": "Bubble + Airtable + Zapier",
    hybrid: "Next.js + Supabase + Resend",
    custom: "Next.js + Node.js + PostgreSQL + Redis + BullMQ",
  },
  costRanges: {
    low: { min: 10000, max: 25000 },
    medium: { min: 30000, max: 75000 },
    high: { min: 80000, max: 200000 },
  },
  timelineWeeks: {
    low: { min: 4, max: 8 },
    medium: { min: 8, max: 16 },
    high: { min: 16, max: 28 },
  },
  criticalConsiderations: [
    "Multi-tenancy architecture",
    "Role-based permissions complexity",
    "Data model design (hard to change)",
    "Integration requirements",
    "Billing and subscription management",
  ],
  commonMistakes: [
    "Too many features before validation",
    "Underestimating permissions complexity",
    "Not planning for multi-tenant",
    "Ignoring mobile responsiveness",
  ],
};
