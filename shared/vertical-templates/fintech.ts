import type { VerticalResultsTemplate } from "./types";

export const FINTECH_TEMPLATE: VerticalResultsTemplate = {
  vertical: "fintech",
  routeGuidance: {
    "no-code": {
      recommendation: "Not recommended",
      reasoning: "Financial apps have strict security and compliance requirements.",
      bestFor: ["Internal dashboards only"],
      limitations: ["PCI compliance", "Security", "Audit trails", "Regulatory"],
    },
    hybrid: {
      recommendation: "Possible for some use cases",
      reasoning: "No-code for non-sensitive features, custom for financial data.",
      bestFor: ["Financial dashboards", "Expense tracking", "Invoice management"],
      limitations: ["Money movement needs custom", "Compliance still required"],
    },
    custom: {
      recommendation: "Required for most fintech",
      reasoning: "PCI-DSS, state regulations, security best practices require custom.",
      bestFor: ["Payment processing", "Lending", "Banking apps", "Investment tools"],
      limitations: ["High cost", "Regulatory complexity", "Long timeline"],
    },
  },
  typicalFeatures: [
    "Secure authentication (MFA)",
    "Bank account linking (Plaid)",
    "Transaction history",
    "Payment processing",
    "KYC/identity verification",
    "Audit logging",
    "Fraud detection",
    "Compliance exports",
  ],
  techStackSuggestions: {
    "no-code": "Not recommended for fintech",
    hybrid: "Next.js + Supabase + Plaid + Stripe",
    custom: "Next.js + Node.js + PostgreSQL + Plaid + Stripe + Unit + Persona",
  },
  costRanges: {
    low: { min: 40000, max: 80000 },
    medium: { min: 100000, max: 200000 },
    high: { min: 250000, max: 500000 },
  },
  timelineWeeks: {
    low: { min: 12, max: 20 },
    medium: { min: 20, max: 32 },
    high: { min: 32, max: 52 },
  },
  criticalConsiderations: [
    "PCI-DSS compliance mandatory for card data",
    "State money transmitter licenses may be required",
    "KYC/AML requirements",
    "BaaS providers can accelerate launch",
    "Security audits and pen testing required",
  ],
  commonMistakes: [
    "Underestimating compliance costs",
    "Building banking infra instead of using BaaS",
    "Launching without proper licenses",
    "Insufficient security",
    "Not budgeting for ongoing compliance",
  ],
};
