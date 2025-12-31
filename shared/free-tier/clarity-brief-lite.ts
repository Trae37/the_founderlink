import { migrateProductType } from "@shared/utils/product-type-migrator";

type AssessmentResponses = Record<number, any>;

const DEFAULT_TEMPLATE = `**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: {{projectName}}
- Founder: {{founderName}} ({{founderEmail}})
- Date Generated: {{currentDate}}
- Vertical: {{vertical}}

**2. THE PROBLEM**
{{problem}}

**3. THE SOLUTION**
{{solution}}

**4. TARGET USER**
{{targetUser}}

**5. SUCCESS CRITERIA**
{{successGoal}} (Primary metric: {{successMetric}})

**Key Metrics to Consider:**
- User acquisition and activation
- Engagement and retention
- Revenue or conversion (if applicable)
- User satisfaction (NPS)

**6. MVP SCOPE**

**Must-Have Features (v1):**
{{mustHaveFeatures}}

**Post-MVP Features (Later):**
{{postMvpFeatures}}

**7. CONSTRAINTS**
- Budget: {{budget}}
- Timeline: {{timeline}}
- Platform: {{platform}}
- Compliance: {{hasCompliance}}
- Technical preferences: {{buildPreference}}

**8. RECOMMENDED APPROACH**
- Route: {{route}}
- Complexity: {{complexity}}

**General Guidance:**
Based on your inputs, we recommend a {{route}} approach. This balances your budget, timeline, and feature requirements.

**9. NEXT STEPS**
1. Validate your core assumption with potential users
2. Define your MVP scope (3-5 core features)
3. Choose your technical approach
4. Find the right developer or team
5. Build, launch, iterate
`;

const TEMPLATE_BY_KEY: Record<string, { vertical: string; template: string }> = {
  businessSaas: { vertical: "Business SaaS", template: DEFAULT_TEMPLATE },
  marketplace: { vertical: "Marketplace", template: DEFAULT_TEMPLATE },
  communication: { vertical: "Communication Platform", template: DEFAULT_TEMPLATE },
  fintech: { vertical: "Fintech / Banking", template: DEFAULT_TEMPLATE },
  healthcare: { vertical: "Healthcare / Telemedicine", template: DEFAULT_TEMPLATE },
  mobileApp: { vertical: "Mobile App", template: DEFAULT_TEMPLATE },
  ecommerce: { vertical: "E-commerce", template: DEFAULT_TEMPLATE },
  education: { vertical: "Education / Learning", template: DEFAULT_TEMPLATE },
  analytics: { vertical: "Analytics / Data Platform", template: DEFAULT_TEMPLATE },
  internalTool: { vertical: "Internal Tool", template: DEFAULT_TEMPLATE },
  apiBackend: { vertical: "API / Backend Service", template: DEFAULT_TEMPLATE },
  browserExtension: { vertical: "Browser Extension", template: DEFAULT_TEMPLATE },
  default: { vertical: "Custom / Other", template: DEFAULT_TEMPLATE },
};

function normalizeVerticalKey(productType: string): keyof typeof TEMPLATE_BY_KEY {
  const p = String(productType || "").toLowerCase();

  if (p.includes("web application") || p.includes("saas") || p.includes("dashboard") || p.includes("portal")) {
    return "businessSaas";
  }
  if (p.includes("marketplace")) return "marketplace";
  if (p.includes("communication platform") || p.includes("social network") || p.includes("forums")) return "communication";
  if (p.includes("fintech") || p.includes("banking") || p.includes("lending")) return "fintech";
  if (p.includes("healthcare") || p.includes("telemedicine") || p.includes("patient")) return "healthcare";
  if (p.includes("mobile app") || p.includes("ios") || p.includes("android")) return "mobileApp";
  if (p.includes("e-commerce") || p.includes("ecommerce")) return "ecommerce";
  if (p.includes("education") || p.includes("learning") || p.includes("lms") || p.includes("courses")) return "education";
  if (p.includes("analytics") || p.includes("data platform") || p.includes("bi") || p.includes("reporting")) return "analytics";
  if (p.includes("internal tool")) return "internalTool";
  if (p.includes("browser extension") || p.includes("extension")) return "browserExtension";
  if (p.includes("api") || p.includes("backend")) return "apiBackend";

  return "default";
}

function formatBullets(items: string[], fallback: string): string {
  const cleaned = items.map((x) => String(x || "").trim()).filter(Boolean);
  if (!cleaned.length) return fallback;
  return cleaned.map((x) => `- ${x}`).join("\n");
}

function mergeFeaturesFromResponses(responses: AssessmentResponses): string[] {
  const q4 = responses[4];
  const coreFeatures: string[] = Array.isArray(q4)
    ? q4.map((x) => String(x || "").trim()).filter(Boolean)
    : [];

  const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];

  const integrations = Array.isArray(responses[14])
    ? (responses[14] as string[])
    : Array.isArray((responses[14] as any)?.selected)
      ? (((responses[14] as any).selected as unknown) as string[])
      : [];

  const merged = [...coreFeatures, ...dayOneNeeds, ...integrations]
    .map((x) => String(x || "").trim())
    .filter((x) => x && x !== "None of these");

  const unique: string[] = [];
  for (const x of merged) {
    if (!unique.includes(x)) unique.push(x);
  }

  return unique;
}

function extractQ12ProblemSolution(responses: AssessmentResponses): { problem: string; solution: string } {
  const q12 = responses[12];
  if (typeof q12 === "string") {
    return {
      problem: String(q12 || "").trim() || "[Describe the problem you're solving]",
      solution: "[Describe your solution]",
    };
  }

  return {
    problem: String(q12?.problem || "").trim() || "[Describe the problem you're solving]",
    solution: String(q12?.solution || "").trim() || "[Describe your solution]",
  };
}

function extractQ13GoalMetric(responses: AssessmentResponses): { successGoal: string; successMetric: string } {
  const q13 = responses[13];
  if (typeof q13 === "string") {
    return {
      successGoal: String(q13 || "").trim() || "[Define your success goal]",
      successMetric: "[Primary metric to track]",
    };
  }

  return {
    successGoal: String(q13?.goal || "").trim() || "[Define your success goal]",
    successMetric: String(q13?.metric || "").trim() || "[Primary metric to track]",
  };
}

export function generateClarityBriefLite(input: {
  responses: AssessmentResponses;
  route: string;
  complexity: string;
}): string {
  const responses = input.responses;

  const q15 = (responses as any)[15] || {};
  const founderEmail = String(q15.email || "").trim();
  const first = String(q15.first_name || "").trim();
  const last = String(q15.last_name || "").trim();
  const founderName = [first, last].filter(Boolean).join(" ") || "Founder";

  const { problem, solution } = extractQ12ProblemSolution(responses);
  const fallbackProjectName = String(problem || "").trim().slice(0, 50) || "Your Project";
  const projectName = String(q15.project_name || "").trim() || fallbackProjectName;
  const { successGoal, successMetric } = extractQ13GoalMetric(responses);

  // Extract target user from Q16
  const targetUser = String(responses[16] || "").trim() || "[Define your primary user type]";

  const features = mergeFeaturesFromResponses(responses);
  const mustHaveFeatures = formatBullets(features.slice(0, 5), "- [Define core features]");
  const postMvpFeatures = formatBullets(features.slice(5), "- [Define post-MVP features]");

  const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];
  const hasCompliance = dayOneNeeds.includes("Compliance (HIPAA, SOC2, GDPR, PCI)") ? "Yes" : "No";

  const productType = migrateProductType(String(responses[2] || "").trim());
  const key = normalizeVerticalKey(productType);
  const templateInfo = TEMPLATE_BY_KEY[key] || TEMPLATE_BY_KEY.default;

  const placeholders: Record<string, string> = {
    projectName,
    founderName,
    founderEmail,
    currentDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    vertical: templateInfo.vertical,
    problem,
    solution,
    targetUser,
    successGoal,
    successMetric,
    budget: String(responses[6] || "Not specified"),
    timeline: String(responses[7] || "Not specified"),
    platform: String(responses[3] || "Web"),
    buildPreference: String(responses[8] || "Open to either"),
    route: String(input.route || "hybrid"),
    complexity: String(input.complexity || "standard"),
    hasCompliance,
    mustHaveFeatures,
    postMvpFeatures,
  };

  let out = templateInfo.template;
  for (const [k, v] of Object.entries(placeholders)) {
    out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
  }

  if (!founderEmail) {
    out = out.replace(/- Founder: ([^\n]+)\s*\(\s*\)\s*\n/g, "- Founder: $1\n");
  }

  return out.trim() + "\n";
}
