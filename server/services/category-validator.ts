import { createHash } from "crypto";
import { z } from "zod";
import { callLLMForJSON } from "./llm-helper";

export const PRODUCT_CATEGORIES = [
  "Marketplace (connecting buyers/sellers, service providers, freelancers)",
  "Business SaaS (CRM, project management, team tools)",
  "Communication Platform (chat, video, social network, forums)",
  "Fintech/Banking (payments, lending, financial tools)",
  "Healthcare/Telemedicine (patient care, booking, health tracking)",
  "E-commerce (online store, shopping platform)",
  "Education/Learning (courses, LMS, tutoring)",
  "Analytics/Data Platform (dashboards, reporting, BI tools)",
  "Internal tool (ops dashboard, admin panel)",
  "API / Backend service",
  "Other (describe below)",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const PRODUCT_CATEGORY_DEFINITIONS: Record<ProductCategory, string> = {
  "Marketplace (connecting buyers/sellers, service providers, freelancers)":
    "A two-sided (or multi-sided) platform connecting distinct participant groups (e.g., buyers/sellers, clients/providers). Core value loop is matching + coordination. Often starts manual-first (concierge) before automation.",
  "Business SaaS (CRM, project management, team tools)":
    "A B2B web app that helps teams manage work (CRM, projects, workflows, dashboards). Typically includes accounts/roles, data management, settings, and reporting.",
  "Communication Platform (chat, video, social network, forums)":
    "A product whose core loop is communication and content exchange (messaging, communities, feeds, video calls). Engagement, moderation, and notifications are common.",
  "Fintech/Banking (payments, lending, financial tools)":
    "A financial product involving payments, lending, wallets, or money movement. Often requires higher security/compliance (PCI, KYC/AML), careful auditability, and risk controls.",
  "Healthcare/Telemedicine (patient care, booking, health tracking)":
    "A healthcare product involving patient data, booking, telehealth, or health tracking. Often requires HIPAA considerations, BAAs, and heightened privacy/security.",
  "E-commerce (online store, shopping platform)":
    "An online store selling products. Core flow is browse products → cart → checkout → payment → order management/fulfillment.",
  "Education/Learning (courses, LMS, tutoring)":
    "A learning product involving courses, content delivery, tutoring/booking, progress tracking, assessments, and learner management.",
  "Analytics/Data Platform (dashboards, reporting, BI tools)":
    "A product centered on data ingestion, transformation, dashboards, reporting, and analytics. Reliability, performance, data modeling, and access control are key.",
  "Internal tool (ops dashboard, admin panel)":
    "A private tool used by a team to run operations: admin panels, workflows, approvals, internal dashboards, and reporting. Focused on efficiency and permissions.",
  "API / Backend service":
    "A backend-first system exposing APIs (auth, data processing, integrations). Focus is reliability, performance, auth, observability, and docs rather than end-user UI.",
  "Other (describe below)":
    "The product does not clearly fit the above categories, is a hybrid, or needs further clarification.",
};

export const CategoryValidationVerdictSchema = z.object({
  matchesSelectedCategory: z.boolean(),
  suggestedCategory: z.enum(PRODUCT_CATEGORIES),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
  keySignals: z.array(z.string()).optional(),
});

export type CategoryValidationVerdict = z.infer<typeof CategoryValidationVerdictSchema> & {
  aiAvailable: boolean;
};

const cache = new Map<string, CategoryValidationVerdict>();

function hashKey(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export async function validateProductCategoryWithAI(params: {
  selectedCategory: string;
  q12Text: string;
  q13Text: string;
}): Promise<CategoryValidationVerdict> {
  const selectedCategory = String(params.selectedCategory || "").trim();
  const q12Text = String(params.q12Text || "").trim();
  const q13Text = String(params.q13Text || "").trim();

  const cacheKey = hashKey({ selectedCategory, q12Text, q13Text });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const definitionsText = PRODUCT_CATEGORIES.map((c) => {
    return `- ${c}: ${PRODUCT_CATEGORY_DEFINITIONS[c]}`;
  }).join("\n");

  const prompt = `You are a product analyst.

Task:
Given (1) the product category selected by the user and (2) the user's raw written description, determine whether the description matches the selected category.

Rules:
- Do NOT rewrite or expand the user's text.
- Only classify based on the words provided.
- If the selected category is ambiguous (e.g. "Other (describe below)"), treat it as likely matching unless the description strongly indicates a specific known category.

Allowed categories (must choose exactly one):
${PRODUCT_CATEGORIES.map((c) => `- ${c}`).join("\n")}

Category definitions (use these as the reference meaning for each category):
${definitionsText}

User selected category:
${selectedCategory}

User written description (Q12):
${q12Text}

Success metrics / goal (Q13):
${q13Text}

Return ONLY valid JSON with exactly this shape:
{
  "matchesSelectedCategory": boolean,
  "suggestedCategory": "one of the allowed categories",
  "confidence": number,
  "rationale": "short explanation",
  "keySignals": ["keyword1", "keyword2", "keyword3"]
}`;

  try {
    const parsed = await callLLMForJSON({
      model: "gemini-2.0-flash-exp",
      prompt,
      temperature: 0.1,
      maxTokens: 220,
    });

    const validated = CategoryValidationVerdictSchema.parse(parsed);
    const result: CategoryValidationVerdict = { ...validated, aiAvailable: true };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    const fallback: CategoryValidationVerdict = {
      matchesSelectedCategory: true,
      suggestedCategory: (PRODUCT_CATEGORIES.includes(selectedCategory as any)
        ? (selectedCategory as ProductCategory)
        : "Other (describe below)"),
      confidence: 0,
      rationale: "AI category validation unavailable; using the selected category.",
      keySignals: [],
      aiAvailable: false,
    };
    cache.set(cacheKey, fallback);
    return fallback;
  }
}
