import type { VerticalResultsTemplate } from "./types";

export const MARKETPLACE_TEMPLATE: VerticalResultsTemplate = {
  vertical: "marketplace",
  routeGuidance: {
    "no-code": {
      recommendation: "Good for simple listing marketplaces",
      reasoning: "No-code platforms like Sharetribe or Bubble can handle basic two-sided marketplaces.",
      bestFor: ["Service marketplaces", "Local listings", "Simple booking"],
      limitations: ["Complex payment escrow", "Custom matching", "High-volume"],
    },
    hybrid: {
      recommendation: "Recommended for most marketplaces",
      reasoning: "Use no-code for frontend, custom code for payment escrow and matching logic.",
      bestFor: ["Service marketplaces with payments", "Freelancer platforms"],
      limitations: ["Requires developer for backend"],
    },
    custom: {
      recommendation: "Required for complex marketplaces",
      reasoning: "Sophisticated matching, complex payment splits, real-time bidding.",
      bestFor: ["High-volume platforms", "Complex matching/bidding"],
      limitations: ["Higher cost", "Longer timeline"],
    },
  },
  typicalFeatures: [
    "Two-sided user profiles",
    "Listings with search and filters",
    "Booking or request flow",
    "Payment processing with escrow",
    "Reviews and ratings",
    "Messaging between parties",
    "Admin dashboard for moderation",
  ],
  techStackSuggestions: {
    "no-code": "Sharetribe, Bubble + Stripe Connect",
    hybrid: "Webflow/Bubble + Node.js/Supabase + Stripe Connect",
    custom: "Next.js + Node.js + PostgreSQL + Stripe Connect + Algolia",
  },
  costRanges: {
    low: { min: 8000, max: 20000 },
    medium: { min: 25000, max: 60000 },
    high: { min: 75000, max: 150000 },
  },
  timelineWeeks: {
    low: { min: 4, max: 8 },
    medium: { min: 8, max: 14 },
    high: { min: 14, max: 24 },
  },
  criticalConsiderations: [
    "Chicken-and-egg problem: Which side first?",
    "Payment escrow and dispute resolution",
    "Trust & safety (verification, reviews, fraud)",
    "Commission structure and payment splits",
  ],
  commonMistakes: [
    "Building both sides simultaneously",
    "Underestimating payment complexity",
    "Ignoring trust signals",
    "Over-building before validation",
  ],
};
