import type { VerticalResultsTemplate } from "./types";

export const ANALYTICS_TEMPLATE: VerticalResultsTemplate = {
  vertical: "analytics",
  routeGuidance: {
    "no-code": {
      recommendation: "Good for simple dashboards",
      reasoning: "Retool, Metabase, Looker Studio work without custom code.",
      bestFor: ["Internal dashboards", "Simple BI", "Report builders"],
      limitations: ["Large datasets", "Complex transformations", "Custom visualizations"],
    },
    hybrid: {
      recommendation: "Common for analytics products",
      reasoning: "Metabase/Preset for visualization, custom for pipelines.",
      bestFor: ["Customer-facing dashboards", "ETL + visualization", "Embedded analytics"],
      limitations: ["May hit limits of embedded tools"],
    },
    custom: {
      recommendation: "For analytics-as-product",
      reasoning: "Full control over experience, performance, differentiation.",
      bestFor: ["BI platforms", "Large-scale data processing", "Real-time analytics"],
      limitations: ["Expensive", "Complex infrastructure", "Ongoing maintenance"],
    },
  },
  typicalFeatures: [
    "Dashboard with visualizations",
    "Data connectors",
    "Query builder or report creator",
    "Filters and drill-downs",
    "Export to PDF/CSV/Excel",
    "Scheduled reports and alerts",
    "User permissions",
    "Embedded analytics",
  ],
  techStackSuggestions: {
    "no-code": "Retool, Metabase, Google Looker Studio, or Preset",
    hybrid: "Next.js + Metabase/Preset (embedded) + custom data pipelines",
    custom: "Next.js + Node.js + PostgreSQL/ClickHouse + D3.js/Recharts + dbt",
  },
  costRanges: {
    low: { min: 10000, max: 30000 },
    medium: { min: 40000, max: 100000 },
    high: { min: 120000, max: 300000 },
  },
  timelineWeeks: {
    low: { min: 4, max: 8 },
    medium: { min: 10, max: 18 },
    high: { min: 18, max: 32 },
  },
  criticalConsiderations: [
    "Data infrastructure often more work than UI",
    "Query performance at scale is hard",
    "Data freshness expectations",
    "Security for sensitive data",
    "Embedded analytics licensing",
  ],
  commonMistakes: [
    "Building visualization when Metabase exists",
    "Underestimating data pipeline complexity",
    "Not planning for query performance",
    "Ignoring data freshness requirements",
    "Over-engineering before validation",
  ],
};
