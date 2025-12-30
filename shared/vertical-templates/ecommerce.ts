import type { VerticalResultsTemplate } from "./types";

export const ECOMMERCE_TEMPLATE: VerticalResultsTemplate = {
  vertical: "ecommerce",
  routeGuidance: {
    "no-code": {
      recommendation: "Great for standard e-commerce",
      reasoning: "Shopify, WooCommerce handle most needs out of the box.",
      bestFor: ["Standard stores", "Digital products", "Subscription boxes"],
      limitations: ["Complex B2B pricing", "Custom checkout", "Multi-vendor"],
    },
    hybrid: {
      recommendation: "Good for customized stores",
      reasoning: "Shopify/WooCommerce + custom features via headless.",
      bestFor: ["Product configurators", "Custom checkout", "Inventory integrations"],
      limitations: ["More complex", "Higher ongoing costs"],
    },
    custom: {
      recommendation: "Only for complex requirements",
      reasoning: "Custom e-commerce is expensive. Only for multi-vendor or complex B2B.",
      bestFor: ["Multi-vendor marketplaces", "B2B complex pricing", "Unique experiences"],
      limitations: ["High cost", "Ongoing maintenance", "Reinventing solved problems"],
    },
  },
  typicalFeatures: [
    "Product catalog with categories",
    "Search and filtering",
    "Shopping cart",
    "Checkout with multiple payment options",
    "Order management",
    "Inventory tracking",
    "Shipping calculation",
    "Customer accounts",
    "Email notifications",
  ],
  techStackSuggestions: {
    "no-code": "Shopify, WooCommerce, or Webflow E-commerce",
    hybrid: "Next.js + Shopify Headless (Hydrogen) or Medusa.js",
    custom: "Next.js + Medusa.js or Saleor + PostgreSQL + Stripe",
  },
  costRanges: {
    low: { min: 3000, max: 15000 },
    medium: { min: 20000, max: 50000 },
    high: { min: 60000, max: 150000 },
  },
  timelineWeeks: {
    low: { min: 2, max: 4 },
    medium: { min: 6, max: 12 },
    high: { min: 12, max: 24 },
  },
  criticalConsiderations: [
    "Use Shopify unless you have specific reason not to",
    "Payment processing is solved (Stripe, PayPal)",
    "Shipping complexity is underestimated",
    "Tax calculation required (TaxJar, Avalara)",
    "PCI compliance if handling card data",
  ],
  commonMistakes: [
    "Building custom when Shopify would work",
    "Underestimating shipping and tax",
    "Not planning for returns",
    "Ignoring mobile shopping",
    "Overcomplicating product options",
  ],
};
