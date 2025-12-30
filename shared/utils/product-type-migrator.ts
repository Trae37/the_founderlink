export const PRODUCT_TYPE_MIGRATION_MAP: Record<string, string> = {
  "Marketplace (two-sided)": "Marketplace (connecting buyers/sellers, service providers, freelancers)",
  "E-commerce": "E-commerce (online store, shopping platform)",
  "Internal tool": "Internal tool (ops dashboard, admin panel)",
  "Web application (SaaS, dashboard, portal)": "Business SaaS (CRM, project management, team tools)",
  "API / Backend service": "API / Backend service",
  "Browser extension": "Business SaaS (CRM, project management, team tools)",
  "Mobile app": "Business SaaS (CRM, project management, team tools)",
  "Other": "Other (describe below)",
};

export function migrateProductType(productType: string): string {
  const raw = String(productType || "").trim();
  return PRODUCT_TYPE_MIGRATION_MAP[raw] || raw;
}
