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

export const VERTICAL_TEMPLATES = {
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
  default: DEFAULT_TEMPLATE,
} as const;

export type VerticalTemplateKey = keyof typeof VERTICAL_TEMPLATES;

export function getTemplateForProductType(productType: string) {
  return (VERTICAL_TEMPLATES as Record<string, typeof DEFAULT_TEMPLATE>)[productType] || VERTICAL_TEMPLATES.default;
}

export * from "./types";
