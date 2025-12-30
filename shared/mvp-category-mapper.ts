/**
 * Maps user-selected product types to MVP knowledge base categories
 */

export const PRODUCT_TYPE_TO_CATEGORY_MAP: Record<string, string[]> = {
  "Marketplace (connecting buyers/sellers, service providers, freelancers)": [
    "Marketplaces & Platforms",
  ],
  "Business SaaS (CRM, project management, team tools)": [
    "Core Business SaaS",
  ],
  "Communication Platform (chat, video, social network, forums)": [
    "Communication & Social",
  ],
  "Fintech/Banking (payments, lending, financial tools)": [
    "Vertical-Specific SaaS", // Fintech is in this category
  ],
  "Healthcare/Telemedicine (patient care, booking, health tracking)": [
    "Vertical-Specific SaaS", // Healthcare is in this category
  ],
  "E-commerce (online store, shopping platform)": [
    "Marketplaces & Platforms", // Product marketplaces
    "Core Business SaaS", // Inventory management
  ],
  "Education/Learning (courses, LMS, tutoring)": [
    "Vertical-Specific SaaS", // Education/LMS is in this category
    "Marketplaces & Platforms", // Course marketplaces
  ],
  "Analytics/Data Platform (dashboards, reporting, BI tools)": [
    "Technical & Developer Tools", // Analytics/BI is in this category
    "Core Business SaaS", // Business analytics
  ],
  "Internal tool (ops dashboard, admin panel)": [
    "Core Business SaaS",
  ],
  "API / Backend service": [
    "Technical & Developer Tools",
  ],
  "Other (describe below)": [
    // No category filter - search all
  ],
};

/**
 * Get MVP categories to search based on user's product type selection
 */
export function getCategoriesForProductType(productType: string): string[] | null {
  const categories = PRODUCT_TYPE_TO_CATEGORY_MAP[productType];
  
  // If "Other" or not found, return null to search all categories
  if (!categories || categories.length === 0) {
    return null;
  }
  
  return categories;
}

/**
 * Extract keywords from product type selection
 */
export function getKeywordsFromProductType(productType: string): string[] {
  const keywords: string[] = [];
  
  // Extract keywords from the selection text
  const match = productType.match(/^([^(]+)/);
  if (match) {
    const mainText = match[1].trim().toLowerCase();
    keywords.push(...mainText.split(/\s+/));
  }
  
  // Extract keywords from the description in parentheses
  const descMatch = productType.match(/\(([^)]+)\)/);
  if (descMatch) {
    const descText = descMatch[1].toLowerCase();
    keywords.push(...descText.split(/[,\s]+/).filter(k => k.length > 2));
  }
  
  return keywords;
}
