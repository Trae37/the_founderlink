/**
 * MVP Phaser - Intelligent Feature Classification
 * Analyzes user's feature list and determines which belong in MVP vs later phases
 * Provides cost estimates based on MVP scope only
 */

import type { Route, Complexity } from "./cost-estimator";

export interface Feature {
  name: string;
  phase: "mvp" | "phase2" | "phase3";
  reasoning: string;
  complexity: "low" | "medium" | "high";
  estimatedHours: { min: number; max: number };
}

export interface MVPPhaseBreakdown {
  mvpFeatures: Feature[];
  phase2Features: Feature[];
  phase3Features: Feature[];
  mvpCostEstimate: { min: number; max: number };
  phase2CostEstimate: { min: number; max: number };
  phase3CostEstimate: { min: number; max: number };
  totalCostEstimate: { min: number; max: number };
  recommendation: string;
}

type PostMvpPhase = "phase2" | "phase3";
type PostMvpFeature = Omit<Feature, "phase"> & { phase: PostMvpPhase };

/**
 * Core MVP features that should almost always be in Phase 1
 */
const CORE_MVP_FEATURES = [
  "user authentication",
  "login",
  "sign up",
  "basic dashboard",
  "core functionality",
  "main feature",
  "primary use case",
];

/**
 * Features that can wait for Phase 2 (post-launch improvements)
 */
const PHASE2_CANDIDATES = [
  "analytics",
  "reporting",
  "advanced dashboard",
  "admin panel",
  "settings",
  "notifications",
  "email notifications",
  // NOTE: "user profiles" and "search" removed - these are often MVP-critical
];

/**
 * Features that should be Phase 3 (growth features)
 */
const PHASE3_CANDIDATES = [
  "social features",
  "sharing",
  "integrations",
  "api",
  "webhooks",
  "advanced analytics",
  "white label",
  "multi-tenant",
  "internationalization",
  "i18n",
];

function normalizeProductType(projectType: string):
  | "marketplace"
  | "ecommerce"
  | "mobile"
  | "saas"
  | "internal"
  | "api"
  | "other" {
  const t = String(projectType || "").toLowerCase();
  if (t.includes("marketplace")) return "marketplace";
  if (t.includes("e-commerce") || t.includes("ecommerce")) return "ecommerce";
  if (t.includes("mobile")) return "mobile";
  if (
    t.includes("saas") ||
    t.includes("dashboard") ||
    t.includes("portal") ||
    t.includes("web application") ||
    t.includes("business saas") ||
    t.includes("communication platform") ||
    t.includes("fintech") ||
    t.includes("banking") ||
    t.includes("healthcare") ||
    t.includes("telemedicine") ||
    t.includes("education") ||
    t.includes("learning") ||
    t.includes("analytics") ||
    t.includes("data platform")
  ) {
    return "saas";
  }
  if (t.includes("internal")) return "internal";
  if (t.includes("api") || t.includes("backend")) return "api";
  return "other";
}

function containsAny(text: string, needles: string[]): boolean {
  for (const n of needles) {
    if (text.includes(n)) return true;
  }
  return false;
}

function inferMarketplaceNeeds(descLower: string): {
  needsCommunication: boolean;
  needsValueExchange: boolean;
} {
  const needsCommunication = containsAny(descLower, [
    "message",
    "messaging",
    "chat",
    "dm",
    "inbox",
    "contact",
    "communicat",
  ]);

  const needsValueExchange = containsAny(descLower, [
    "pay",
    "payment",
    "checkout",
    "purchase",
    "order",
    "booking",
    "book",
    "schedule",
    "rent",
    "subscription",
    "transaction",
    "escrow",
  ]);

  return { needsCommunication, needsValueExchange };
}

function inferCoreLoopSignals(descLower: string): {
  needsBooking: boolean;
  needsScheduling: boolean;
  needsMessaging: boolean;
  needsDiscovery: boolean;
  needsPayments: boolean;
} {
  const needsBooking = containsAny(descLower, ["booking", "book", "reserve", "appointment"]);
  const needsScheduling = containsAny(descLower, ["schedule", "calendar", "availability", "time slot", "timeslot"]);
  const needsMessaging = containsAny(descLower, ["message", "messaging", "chat", "dm", "inbox", "communicat"]);
  const needsDiscovery = containsAny(descLower, ["search", "discover", "browse", "find", "matching", "match"]);
  const needsPayments = containsAny(descLower, ["pay", "payment", "checkout", "purchase", "subscription", "transaction"]);

  return {
    needsBooking,
    needsScheduling,
    needsMessaging,
    needsDiscovery,
    needsPayments,
  };
}

function isLockedMvpFeature(featureLower: string, normalizedType: ReturnType<typeof normalizeProductType>, descLower: string): boolean {
  if (containsAny(featureLower, ["auth", "authentication", "login", "sign up", "signup", "account"])) return true;
  if (containsAny(featureLower, ["core functionality", "main feature", "primary use case"])) return true;

  if (normalizedType === "marketplace" || descLower.includes("two-sided") || descLower.includes("marketplace")) {
    if (containsAny(featureLower, ["profile", "profiles"])) return true;
    if (containsAny(featureLower, ["listing", "listings", "catalog", "post", "offer"])) return true;
    // Intentionally NOT locking search/discovery/payments for marketplace MVP.
    // Marketplaces often validate the core interaction with manual/concierge matching first.
  }

  if (normalizedType === "ecommerce") {
    if (containsAny(featureLower, ["catalog", "products", "inventory", "cart", "checkout"])) return true;
    if (containsAny(featureLower, ["payment", "payments", "stripe", "billing"])) return true;
  }

  return false;
}

function buildSuggestedPostMvpEnhancements(
  projectType: string,
  projectDescription?: string
): string[] {
  const descLower = String(projectDescription || "").toLowerCase();
  const normalizedType = normalizeProductType(projectType);

  if (normalizedType === "marketplace" || descLower.includes("two-sided") || descLower.includes("marketplace")) {
    return [
      "Reviews & ratings",
      "Admin dashboard",
      "Analytics dashboard",
      "Email notifications",
      "Disputes / refunds",
    ];
  }

  if (normalizedType === "ecommerce") {
    return [
      "Discount codes",
      "Invoices / receipts",
      "Refunds / cancellations",
      "Email notifications",
      "Analytics dashboard",
    ];
  }

  if (normalizedType === "saas") {
    return [
      "Analytics dashboard",
      "Email notifications",
      "Admin dashboard",
      "Audit logs",
      "Role management",
    ];
  }

  if (normalizedType === "mobile") {
    return [
      "Push notifications",
      "Analytics dashboard",
      "Offline mode",
      "In-app notifications",
      "Crash reporting",
    ];
  }

  if (normalizedType === "internal") {
    return [
      "Admin dashboard",
      "Audit logs",
      "Role management",
      "Reporting",
      "Email notifications",
    ];
  }

  return [
    "Analytics dashboard",
    "Admin dashboard",
    "Email notifications",
    "Search + filters",
    "Reports",
  ];
}

function estimateFeatureValue(
  featureLower: string,
  normalizedType: ReturnType<typeof normalizeProductType>,
  descLower: string,
  initialPhase: PostMvpPhase
): number {
  let value = 5;

  if (containsAny(featureLower, ["payment", "payments", "stripe", "billing", "checkout"])) {
    value = normalizedType === "ecommerce" || normalizedType === "saas" ? 9 : 7;
  } else if (containsAny(featureLower, ["search", "browse", "discovery", "filter", "filters", "matching"])) {
    value = normalizedType === "marketplace" || normalizedType === "ecommerce" ? 8 : 6;
  } else if (containsAny(featureLower, ["chat", "message", "messaging", "inbox", "real-time", "live"])) {
    value = normalizedType === "marketplace" || descLower.includes("communicat") ? 8 : 6;
  } else if (containsAny(featureLower, ["notifications", "email"])) {
    value = 6;
  } else if (containsAny(featureLower, ["admin", "admin panel"])) {
    value = 6;
  } else if (containsAny(featureLower, ["analytics", "reporting"])) {
    value = 6;
  } else if (containsAny(featureLower, ["reviews", "ratings", "reputation", "trust", "safety"])) {
    value = normalizedType === "marketplace" ? 7 : 5;
  } else if (containsAny(featureLower, ["integration", "integrations", "api", "webhook", "webhooks"])) {
    value = 5;
  } else if (containsAny(featureLower, ["i18n", "internationalization", "multi-tenant", "white label"])) {
    value = 4;
  } else if (containsAny(featureLower, ["social", "sharing"])) {
    value = 4;
  }

  if (initialPhase === "phase3") value = Math.max(1, value - 2);
  if (descLower.includes("revenue") || descLower.includes("pay") || descLower.includes("subscription")) {
    if (containsAny(featureLower, ["payment", "billing", "checkout"])) value = Math.min(10, value + 1);
  }

  return value;
}

function rankPostMvpPhases(
  features: PostMvpFeature[],
  projectType: string,
  projectDescription?: string
): { phase2: Feature[]; phase3: Feature[] } {
  if (features.length === 0) return { phase2: [], phase3: [] };

  const descLower = String(projectDescription || "").toLowerCase();
  const normalizedType = normalizeProductType(projectType);

  const scored = features
    .map((f) => {
      const featureLower = f.name.toLowerCase();
      const midHours = Math.max(1, (f.estimatedHours.min + f.estimatedHours.max) / 2);
      const value = estimateFeatureValue(featureLower, normalizedType, descLower, f.phase);
      const score = value / midHours;
      return { f, score, value, midHours };
    })
    .sort((a, b) => b.score - a.score);

  const totalEffort = scored.reduce((acc, x) => acc + x.midHours, 0);
  const targetPhase2Effort = totalEffort * 0.6;

  const phase2: Feature[] = [];
  const phase3: Feature[] = [];
  let phase2Effort = 0;

  for (let i = 0; i < scored.length; i++) {
    const { f, score, value, midHours } = scored[i];
    const nextPhase = phase2.length === 0 || phase2Effort + midHours <= targetPhase2Effort ? "phase2" : "phase3";
    const updated: Feature = {
      ...f,
      phase: nextPhase,
      reasoning:
        nextPhase === "phase2"
          ? `${f.reasoning} • Higher value-to-effort opportunity (${value}/10)`
          : `${f.reasoning} • Lower value-to-effort; defer (${value}/10)`,
    };

    if (nextPhase === "phase2") {
      phase2.push(updated);
      phase2Effort += midHours;
    } else {
      phase3.push(updated);
    }
  }

  if (phase2.length === 0 && phase3.length > 0) {
    const first = phase3.shift()!;
    phase2.push({
      ...first,
      phase: "phase2",
      reasoning: `${first.reasoning} • Pulled forward to ensure Phase 2 has at least one item`,
    });
  }

  return { phase2, phase3 };
}

/**
 * Classify a single feature into MVP, Phase 2, or Phase 3
 */
function classifyFeature(
  feature: string,
  allFeatures: string[],
  projectType: string,
  complexity: Complexity,
  projectDescription?: string
): { phase: "mvp" | "phase2" | "phase3"; reasoning: string } {
  const featureLower = feature.toLowerCase();
  const descLower = String(projectDescription || "").toLowerCase();
  const normalizedType = normalizeProductType(projectType);
  const loop = inferCoreLoopSignals(descLower);

  if (normalizedType === "marketplace" || descLower.includes("two-sided") || descLower.includes("marketplace")) {
    const { needsCommunication, needsValueExchange } = inferMarketplaceNeeds(descLower);

    if (
      containsAny(featureLower, [
        "user authentication",
        "authentication",
        "login",
        "sign up",
        "signup",
        "account",
        "roles",
        "permissions",
      ])
    ) {
      return { phase: "mvp", reasoning: "Foundational for a two-sided marketplace (identity + access control)" };
    }

    if (containsAny(featureLower, ["profile", "profiles", "user profile"])) {
      return { phase: "mvp", reasoning: "Required for a two-sided marketplace (participants need profiles)" };
    }

    if (
      containsAny(featureLower, [
        "listing",
        "listings",
        "catalog",
        "inventory",
        "post",
        "offer",
        "service listing",
        "create listing",
      ])
    ) {
      return { phase: "mvp", reasoning: "Required for a two-sided marketplace (supply must be visible to demand)" };
    }

    if (containsAny(featureLower, ["search", "browse", "discovery", "filter", "filters", "matching"])) {
      const explicitlySelfServeDiscovery = containsAny(descLower, [
        "search",
        "browse",
        "filter",
        "discovery",
        "unified search",
        "compare",
        "directory",
      ]);
      return {
        phase: explicitlySelfServeDiscovery ? "mvp" : "phase2",
        reasoning: explicitlySelfServeDiscovery
          ? "Your described value proposition depends on self-serve discovery (search/browse)"
          : "Can validate demand with a curated list or concierge/manual matching first, then add discovery",
      };
    }

    if (containsAny(featureLower, ["chat", "message", "messaging", "inbox"])) {
      return {
        phase: needsCommunication || (!needsValueExchange && loop.needsMessaging) ? "mvp" : "phase2",
        reasoning: needsCommunication || (!needsValueExchange && loop.needsMessaging)
          ? "Core value loop for your marketplace requires communication"
          : "Often valuable, but can follow the initial marketplace value loop",
      };
    }

    if (containsAny(featureLower, ["payment", "payments", "stripe", "billing", "checkout"])) {
      const explicitlyOnPlatformPayments = containsAny(descLower, [
        "pay",
        "payment",
        "checkout",
        "stripe",
        "subscription",
        "transaction",
        "take rate",
        "commission",
      ]);
      return {
        phase: needsValueExchange || explicitlyOnPlatformPayments ? "mvp" : "phase2",
        reasoning: needsValueExchange
          ? "Core marketplace value exchange appears to require payments/transactions"
          : "Can validate transactions off-platform first, then add in-app payments",
      };
    }

    if (containsAny(featureLower, ["booking", "schedule", "calendar", "availability"])) {
      return {
        phase: loop.needsBooking || loop.needsScheduling ? "mvp" : "phase2",
        reasoning: loop.needsBooking || loop.needsScheduling
          ? "Core value loop requires booking/scheduling"
          : "Often helpful, but not required for initial marketplace launch",
      };
    }

    if (containsAny(featureLower, ["reviews", "ratings", "reputation"])) {
      return { phase: "phase2", reasoning: "Improves trust, but not required for initial marketplace launch" };
    }
  }

  if (normalizedType === "ecommerce") {
    if (containsAny(featureLower, ["product catalog", "catalog", "products", "inventory", "cart", "checkout"])) {
      return { phase: "mvp", reasoning: "Core value loop for e-commerce (browse → cart → checkout)" };
    }
    if (containsAny(featureLower, ["payment", "payments", "stripe", "billing"])) {
      return { phase: "mvp", reasoning: "Core value loop for e-commerce requires payments" };
    }
  }
  
  // Core MVP features
  if (CORE_MVP_FEATURES.some(core => featureLower.includes(core))) {
    return {
      phase: "mvp",
      reasoning: "Essential for core product functionality"
    };
  }
  
  // Payment processing - MVP for SaaS, Phase 2 for others
  if (featureLower.includes("payment") || featureLower.includes("stripe") || featureLower.includes("billing")) {
    if (projectType.toLowerCase().includes("saas") || projectType.toLowerCase().includes("subscription")) {
      return {
        phase: "mvp",
        reasoning: "Critical for SaaS revenue model"
      };
    }
    return {
      phase: "phase2",
      reasoning: "Can launch with core flow before adding payments"
    };
  }
  
  // Mobile apps - if it's a mobile project, mobile is MVP
  if (featureLower.includes("mobile") || featureLower.includes("ios") || featureLower.includes("android")) {
    if (projectType.toLowerCase().includes("mobile")) {
      return {
        phase: "mvp",
        reasoning: "Core platform requirement"
      };
    }
    return {
      phase: "phase3",
      reasoning: "Can launch web-first, add mobile after traction"
    };
  }
  
  // AI features - depends on complexity
  if (featureLower.includes("ai") || featureLower.includes("machine learning") || featureLower.includes("ml")) {
    if (complexity === "high" || allFeatures.length <= 5) {
      return {
        phase: "mvp",
        reasoning: "Core differentiator for your product"
      };
    }
    return {
      phase: "phase2",
      reasoning: "Can launch with simpler version first, add AI later"
    };
  }
  
  // Real-time features - usually Phase 2 unless it's the core feature
  if (featureLower.includes("real-time") || featureLower.includes("live") || featureLower.includes("chat")) {
    if (allFeatures.length <= 3) {
      return {
        phase: "mvp",
        reasoning: "Core product feature"
      };
    }
    return {
      phase: "phase2",
      reasoning: "Can start with polling/refresh, add real-time later"
    };
  }
  
  // Check Phase 3 candidates
  if (PHASE3_CANDIDATES.some(p3 => featureLower.includes(p3))) {
    return {
      phase: "phase3",
      reasoning: "Growth feature best added after traction"
    };
  }
  
  // Check Phase 2 candidates
  if (PHASE2_CANDIDATES.some(p2 => featureLower.includes(p2))) {
    return {
      phase: "phase2",
      reasoning: "Important but not critical for initial launch"
    };
  }
  
  // Default: if we have many features, push to Phase 2; otherwise MVP
  if (allFeatures.length > 7) {
    return {
      phase: "phase2",
      reasoning: "Can be added after initial launch"
    };
  }
  
  return {
    phase: "mvp",
    reasoning: "Part of core product experience"
  };
}

/**
 * Estimate hours for a feature based on its complexity
 */
function estimateFeatureHours(
  feature: string,
  route: Route,
  complexity: Complexity
): { min: number; max: number; featureComplexity: "low" | "medium" | "high" } {
  const featureLower = feature.toLowerCase();
  
  // Base hours by feature type
  let baseHours = { min: 20, max: 40 }; // Default
  let featureComplexity: "low" | "medium" | "high" = "medium";
  
  if (featureLower.includes("authentication") || featureLower.includes("login")) {
    baseHours = { min: 15, max: 30 };
    featureComplexity = "medium";
  } else if (featureLower.includes("payment") || featureLower.includes("stripe")) {
    baseHours = { min: 25, max: 40 };
    featureComplexity = "medium";
  } else if (featureLower.includes("dashboard")) {
    baseHours = { min: 30, max: 60 };
    featureComplexity = "medium";
  } else if (featureLower.includes("admin")) {
    baseHours = { min: 25, max: 50 };
    featureComplexity = "medium";
  } else if (featureLower.includes("real-time") || featureLower.includes("chat")) {
    baseHours = { min: 35, max: 70 };
    featureComplexity = "high";
  } else if (featureLower.includes("ai") || featureLower.includes("ml")) {
    baseHours = { min: 40, max: 80 };
    featureComplexity = "high";
  } else if (featureLower.includes("mobile")) {
    baseHours = { min: 50, max: 100 };
    featureComplexity = "high";
  } else if (featureLower.includes("integration") || featureLower.includes("api")) {
    baseHours = { min: 20, max: 40 };
    featureComplexity = "low";
  }
  
  // Route multipliers
  const routeMultiplier = route === "no-code" ? 0.4 : route === "hybrid" ? 0.7 : 1.0;
  
  // Complexity multipliers
  const complexityMultiplier = complexity === "low" ? 0.8 : complexity === "high" ? 1.3 : 1.0;
  
  return {
    min: Math.round(baseHours.min * routeMultiplier * complexityMultiplier),
    max: Math.round(baseHours.max * routeMultiplier * complexityMultiplier),
    featureComplexity
  };
}

/**
 * Generate MVP phase breakdown from user's feature list
 */
export function generateMVPPhaseBreakdown(
  features: string[],
  projectType: string,
  route: Route,
  complexity: Complexity,
  hourlyRate: number,
  projectDescription?: string
): MVPPhaseBreakdown {
  const classifiedFeatures: Feature[] = features.map(feature => {
    const { phase, reasoning } = classifyFeature(feature, features, projectType, complexity, projectDescription);
    const { min, max, featureComplexity } = estimateFeatureHours(feature, route, complexity);
    
    return {
      name: feature,
      phase,
      reasoning,
      complexity: featureComplexity,
      estimatedHours: { min, max }
    };
  });
  
  // Separate MVP vs non-MVP
  let mvpFeatures = classifiedFeatures.filter(f => f.phase === "mvp");
  let nonMvp = classifiedFeatures.filter((f): f is PostMvpFeature => f.phase !== "mvp");

  // MVP cap: keep the minimum value loop in Phase 1 (avoid "everything is MVP")
  if (mvpFeatures.length > 0) {
    const descLower = String(projectDescription || "").toLowerCase();
    const normalizedType = normalizeProductType(projectType);

    const mvpEffort = (items: Feature[]) =>
      items.reduce((acc, x) => acc + Math.max(1, (x.estimatedHours.min + x.estimatedHours.max) / 2), 0);

    const totalEffort = mvpEffort(classifiedFeatures);
    const targetMvpEffort = Math.max(1, totalEffort * 0.55);

    if (totalEffort > 0 && mvpEffort(mvpFeatures) > targetMvpEffort && mvpFeatures.length > 3) {
      const locked = new Set(
        mvpFeatures
          .filter((f) => isLockedMvpFeature(f.name.toLowerCase(), normalizedType, descLower))
          .map((f) => f.name)
      );

      const demotable = mvpFeatures
        .filter((f) => !locked.has(f.name))
        .map((f) => {
          const midHours = Math.max(1, (f.estimatedHours.min + f.estimatedHours.max) / 2);
          const value = estimateFeatureValue(f.name.toLowerCase(), normalizedType, descLower, "phase2");
          const score = value / midHours;
          return { f, score };
        })
        .sort((a, b) => a.score - b.score);

      const nextMvp: Feature[] = [...mvpFeatures];
      const nextNonMvp: PostMvpFeature[] = [...nonMvp];
      let currentEffort = mvpEffort(nextMvp);

      for (const item of demotable) {
        if (currentEffort <= targetMvpEffort) break;
        if (nextMvp.length <= 3) break;

        const idx = nextMvp.findIndex((x) => x.name === item.f.name);
        if (idx === -1) continue;

        nextMvp.splice(idx, 1);
        nextNonMvp.push({
          ...item.f,
          phase: "phase2",
          reasoning: `${item.f.reasoning} • Deferred to keep MVP focused on the core value loop`,
        });

        currentEffort = mvpEffort(nextMvp);
      }

      mvpFeatures = nextMvp;
      nonMvp = nextNonMvp;
    }
  }

  // GUARANTEE: MVP must have at least 2 features (ideally 3)
  const MIN_MVP_FEATURES = 2;
  const IDEAL_MVP_FEATURES = 3;

  if (mvpFeatures.length < MIN_MVP_FEATURES && nonMvp.length > 0) {
    // Pull highest-value features from Phase 2 into MVP
    const phase2Features = nonMvp.filter(f => f.phase === "phase2");
    const toPromote = phase2Features
      .sort((a, b) => {
        // Prioritize by estimated value (lower hours = simpler = promote first for MVP)
        const aHours = (a.estimatedHours.min + a.estimatedHours.max) / 2;
        const bHours = (b.estimatedHours.min + b.estimatedHours.max) / 2;
        return aHours - bHours;
      })
      .slice(0, IDEAL_MVP_FEATURES - mvpFeatures.length);

    for (const feature of toPromote) {
      const idx = nonMvp.findIndex(f => f.name === feature.name);
      if (idx !== -1) {
        nonMvp.splice(idx, 1);
        mvpFeatures.push({
          name: feature.name,
          phase: "mvp",
          reasoning: `${feature.reasoning} • Promoted to ensure viable MVP`,
          complexity: feature.complexity,
          estimatedHours: feature.estimatedHours,
        });
      }
    }
  }

  if (nonMvp.length === 0) {
    const suggested = buildSuggestedPostMvpEnhancements(projectType, projectDescription)
      .map((x) => String(x || "").trim())
      .filter(Boolean)
      .filter((x) => !features.includes(x));

    nonMvp = suggested.map((name) => {
      const hours = estimateFeatureHours(name, route, complexity);
      return {
        name,
        phase: "phase2",
        reasoning: "Suggested after MVP to add user value and strengthen retention/monetization",
        complexity: hours.featureComplexity,
        estimatedHours: { min: hours.min, max: hours.max },
      };
    });
  }

  const ranked = rankPostMvpPhases(nonMvp, projectType, projectDescription);
  const phase2Features = ranked.phase2;
  const phase3Features = ranked.phase3;
  
  // Calculate costs
  const mvpHours = mvpFeatures.reduce((acc, f) => ({
    min: acc.min + f.estimatedHours.min,
    max: acc.max + f.estimatedHours.max
  }), { min: 0, max: 0 });
  
  const phase2Hours = phase2Features.reduce((acc, f) => ({
    min: acc.min + f.estimatedHours.min,
    max: acc.max + f.estimatedHours.max
  }), { min: 0, max: 0 });
  
  const phase3Hours = phase3Features.reduce((acc, f) => ({
    min: acc.min + f.estimatedHours.min,
    max: acc.max + f.estimatedHours.max
  }), { min: 0, max: 0 });
  
  // Add overhead (setup, testing, deployment, bug fixes)
  const overheadMultiplier = 1.5; // 50% overhead
  
  const mvpCost = {
    min: Math.round(mvpHours.min * hourlyRate * overheadMultiplier),
    max: Math.round(mvpHours.max * hourlyRate * overheadMultiplier)
  };
  
  const phase2Cost = {
    min: Math.round(phase2Hours.min * hourlyRate * overheadMultiplier),
    max: Math.round(phase2Hours.max * hourlyRate * overheadMultiplier)
  };
  
  const phase3Cost = {
    min: Math.round(phase3Hours.min * hourlyRate * overheadMultiplier),
    max: Math.round(phase3Hours.max * hourlyRate * overheadMultiplier)
  };
  
  const totalCost = {
    min: mvpCost.min + phase2Cost.min + phase3Cost.min,
    max: mvpCost.max + phase2Cost.max + phase3Cost.max
  };
  
  // Generate recommendation
  const recommendation = generateRecommendation(mvpFeatures, phase2Features, phase3Features, mvpCost);
  
  return {
    mvpFeatures,
    phase2Features,
    phase3Features,
    mvpCostEstimate: mvpCost,
    phase2CostEstimate: phase2Cost,
    phase3CostEstimate: phase3Cost,
    totalCostEstimate: totalCost,
    recommendation
  };
}

/**
 * Generate recommendation based on phase breakdown
 */
function generateRecommendation(
  mvpFeatures: Feature[],
  phase2Features: Feature[],
  phase3Features: Feature[],
  mvpCost: { min: number; max: number }
): string {
  const totalFeatures = mvpFeatures.length + phase2Features.length + phase3Features.length;
  const mvpPercentage = Math.round((mvpFeatures.length / totalFeatures) * 100);
  
  if (mvpFeatures.length <= 3) {
    return `Your MVP is lean and focused (${mvpFeatures.length} core features). This is ideal for getting to market quickly and landing early customers. Budget $${(mvpCost.min / 1000).toFixed(0)}K-$${(mvpCost.max / 1000).toFixed(0)}K for MVP, then add features based on user feedback.`;
  } else if (mvpFeatures.length <= 5) {
    return `Your MVP includes ${mvpFeatures.length} features (${mvpPercentage}% of total scope). This is a good balance between functionality and speed to market. Budget $${(mvpCost.min / 1000).toFixed(0)}K-$${(mvpCost.max / 1000).toFixed(0)}K for MVP launch.`;
  } else {
    return `Your MVP includes ${mvpFeatures.length} features. Consider if all of these are truly essential for initial launch. You could potentially reduce scope to ${Math.ceil(mvpFeatures.length * 0.6)} features and save $${((mvpCost.min * 0.4) / 1000).toFixed(0)}K-$${((mvpCost.max * 0.4) / 1000).toFixed(0)}K on MVP costs.`;
  }
}

/**
 * Generate cost optimization recommendations for expensive projects
 */
export function generateCostOptimizationStrategies(
  mvpCost: { min: number; max: number },
  totalCost: { min: number; max: number },
  userBudget: number
): string[] {
  const strategies: string[] = [];
  
  // If MVP cost exceeds budget
  if (mvpCost.min > userBudget) {
    const gap = mvpCost.min - userBudget;
    strategies.push(`**Reduce MVP scope**: Your MVP is estimated at $${(mvpCost.min / 1000).toFixed(0)}K-$${(mvpCost.max / 1000).toFixed(0)}K, which exceeds your $${(userBudget / 1000).toFixed(0)}K budget by $${(gap / 1000).toFixed(0)}K. Consider cutting 2-3 non-essential features to bring MVP within budget.`);
  }
  
  // If total cost is high, suggest phasing
  if (totalCost.min > 18000) {
    strategies.push(`**Staggered hiring**: Instead of hiring the full team upfront, start with 1 senior developer for MVP ($${(mvpCost.min / 1000).toFixed(0)}K-$${(mvpCost.max / 1000).toFixed(0)}K), then add team members for Phase 2 after early traction.`);
    
    strategies.push(`**Phased development**: Launch MVP first, collect user feedback and revenue, then fund Phase 2 ($${((totalCost.min - mvpCost.min) / 1000).toFixed(0)}K-$${((totalCost.max - mvpCost.max) / 1000).toFixed(0)}K) with initial earnings or additional funding.`);
  }
  
  // If MVP is expensive (>$15K), suggest hybrid approach
  if (mvpCost.min > 15000) {
    strategies.push(`**Hybrid approach**: Use no-code tools (Bubble, Webflow, Airtable) for non-critical features to reduce custom development costs by 30-40%.`);
  }
  
  return strategies;
}
