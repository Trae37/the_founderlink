import type { VerticalResultsTemplate } from "./types";

export const INTERNAL_TOOL_TEMPLATE: VerticalResultsTemplate = {
  vertical: "internal-tool",
  routeGuidance: {
    "no-code": {
      recommendation: "Excellent choice for internal tools",
      reasoning: "Retool, Appsmith, Budibase designed specifically for this.",
      bestFor: ["Admin panels", "Ops dashboards", "Data entry", "Approval workflows"],
      limitations: ["Complex integrations", "High-performance", "Customer-facing"],
    },
    hybrid: {
      recommendation: "Good for complex internal tools",
      reasoning: "No-code for CRUD, custom for complex business logic.",
      bestFor: ["Workflow automation", "Complex approvals", "Multi-system integration"],
      limitations: ["Increases maintenance complexity"],
    },
    custom: {
      recommendation: "Rarely needed for internal tools",
      reasoning: "Custom is usually overkill for internal tools.",
      bestFor: ["Mission-critical ops tools", "Complex algorithms"],
      limitations: ["Expensive for internal use", "Slower to iterate"],
    },
  },
  typicalFeatures: [
    "CRUD operations",
    "Dashboard with key metrics",
    "Search and filtering",
    "User management and permissions",
    "Audit logging",
    "Bulk operations",
    "Export/import data",
    "Notifications",
  ],
  techStackSuggestions: {
    "no-code": "Retool, Appsmith, Budibase, or Airplane",
    hybrid: "Retool + custom API endpoints",
    custom: "Next.js + Node.js + PostgreSQL (rarely needed)",
  },
  costRanges: {
    low: { min: 3000, max: 10000 },
    medium: { min: 15000, max: 40000 },
    high: { min: 50000, max: 100000 },
  },
  timelineWeeks: {
    low: { min: 1, max: 3 },
    medium: { min: 4, max: 8 },
    high: { min: 8, max: 16 },
  },
  criticalConsiderations: [
    "ROI must justify cost (no revenue)",
    "Maintenance falls on your team",
    "Security still matters",
    "User adoption is hardest part",
    "Consider SaaS alternatives",
  ],
  commonMistakes: [
    "Over-engineering",
    "Building when spreadsheet would work",
    "Ignoring user adoption",
    "Not securing properly",
    "Custom building what Retool can do",
  ],
};
