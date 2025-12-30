/**
 * Cost Optimizer - Analyzes budget, timeline, and team size gaps
 * Provides actionable recommendations to help founders launch successfully
 */

import { getCostEstimate, type Route, type Complexity, type CostEstimate } from "./cost-estimator";

export interface BudgetGap {
  userBudgetMin: number;
  userBudgetMax: number;
  realisticBudgetMin: number;
  realisticBudgetMax: number;
  gapAmount: number;
  gapPercentage: number;
  isOverBudget: boolean;
  severity: "none" | "minor" | "moderate" | "severe";
}

export interface TimelineGap {
  userTimelineWeeks: number;
  realisticTimelineWeeks: number;
  gapWeeks: number;
  gapPercentage: number;
  isTooAggressive: boolean;
  severity: "none" | "minor" | "moderate" | "severe";
}

export interface TeamSizeGap {
  userTeamSize: number;
  realisticTeamSize: number;
  gapCount: number;
  gapPercentage: number;
  isTooSmall: boolean;
  severity: "none" | "minor" | "moderate" | "severe";
}

export interface OptimizationRecommendation {
  title: string;
  description: string;
  impact: string;
  savings: string;
  priority: number;
  category: "budget" | "timeline" | "team" | "scope";
}

export interface CostOptimizationPlan {
  budgetGap: BudgetGap;
  timelineGap: TimelineGap;
  teamSizeGap: TeamSizeGap;
  recommendations: OptimizationRecommendation[];
  mvpApproach: {
    phase1: {
      features: string[];
      cost: string;
      timeline: string;
      description: string;
    };
    phase2?: {
      features: string[];
      cost: string;
      timeline: string;
      description: string;
    };
    phase3?: {
      features: string[];
      cost: string;
      timeline: string;
      description: string;
    };
  };
  alternativeTechStack?: {
    current: string;
    suggested: string;
    reasoning: string;
    savings: string;
  };
}

/**
 * Parse user budget string to numbers
 */
function parseBudget(budgetString: string): { min: number; max: number } {
  // Handle formats like "3000-7000", "$3,000-$7,000", "Under $3,000", "Over $15,000"
  const cleaned = budgetString
    .replace(/[$,]/g, "")
    .replace(/–|—/g, "-")
    .trim();
  
  if (cleaned.includes("Under")) {
    const amount = parseInt(cleaned.replace(/\D/g, ""));
    return { min: 0, max: amount };
  }
  
  if (cleaned.includes("Over")) {
    const amount = parseInt(cleaned.replace(/\D/g, ""));
    return { min: amount, max: amount * 2 };
  }
  
  if (cleaned.includes("-")) {
    const nums = cleaned.match(/\d+/g) || [];
    if (nums.length >= 2) {
      const min = parseInt(nums[0] || "0");
      const max = parseInt(nums[1] || "0");
      return { min, max };
    }
  }
  
  // Single number
  const nums = cleaned.match(/\d+/g) || [];
  const amount = nums.length > 0 ? parseInt(nums[0] || "0") : 0;
  return { min: Math.round(amount * 0.8), max: Math.round(amount * 1.2) };
}

/**
 * Parse user timeline string to weeks
 */
function parseTimeline(timelineString: string): number {
  const cleaned = timelineString.toLowerCase();

  // New assessment (Q7) strings
  if (cleaned.includes("asap") && cleaned.includes("1-2")) return 6; // ~6 weeks
  if (cleaned.includes("standard") && cleaned.includes("3-4")) return 14; // ~14 weeks
  if (cleaned.includes("flexible") && cleaned.includes("5+")) return 24;
  if (cleaned.includes("not sure")) return 12;
  
  if (cleaned.includes("4-6")) return 5;
  if (cleaned.includes("6-8")) return 7;
  if (cleaned.includes("8-12")) return 10;
  if (cleaned.includes("12-16")) return 14;
  if (cleaned.includes("16-20")) return 18;
  if (cleaned.includes("20+")) return 24;
  
  // Extract first number
  const match = cleaned.match(/(\d+)/);
  return match ? parseInt(match[1]) : 12;
}

/**
 * Parse user team size string to number
 */
function parseTeamSize(teamSizeString: string): number {
  const cleaned = teamSizeString.toLowerCase();
  
  if (cleaned.includes("just me") || cleaned.includes("1 person")) return 1;
  if (cleaned.includes("2-3")) return 2.5;
  if (cleaned.includes("3-5")) return 4;
  if (cleaned.includes("5+")) return 6;
  
  // Extract first number
  const match = cleaned.match(/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

/**
 * Calculate budget gap and severity
 */
export function analyzeBudgetGap(
  userBudget: string,
  estimate: CostEstimate
): BudgetGap {
  const user = parseBudget(userBudget);
  
  const gapAmount = estimate.budgetMin - user.max;
  const gapPercentage = user.max > 0 
    ? ((gapAmount / user.max) * 100)
    : 0;
  
  let severity: BudgetGap["severity"] = "none";
  if (gapPercentage > 200) severity = "severe";
  else if (gapPercentage > 100) severity = "moderate";
  else if (gapPercentage > 25) severity = "minor";
  
  return {
    userBudgetMin: user.min,
    userBudgetMax: user.max,
    realisticBudgetMin: estimate.budgetMin,
    realisticBudgetMax: estimate.budgetMax,
    gapAmount: Math.max(0, gapAmount),
    gapPercentage: Math.max(0, gapPercentage),
    isOverBudget: gapAmount > 0,
    severity,
  };
}

/**
 * Calculate timeline gap and severity
 */
export function analyzeTimelineGap(
  userTimeline: string,
  estimate: CostEstimate
): TimelineGap {
  const userWeeks = parseTimeline(userTimeline);
  const realisticWeeks = estimate.timelineWeeks;
  
  const gapWeeks = realisticWeeks - userWeeks;
  const gapPercentage = userWeeks > 0
    ? ((gapWeeks / userWeeks) * 100)
    : 0;
  
  let severity: TimelineGap["severity"] = "none";
  if (gapPercentage > 100) severity = "severe";
  else if (gapPercentage > 50) severity = "moderate";
  else if (gapPercentage > 20) severity = "minor";
  
  return {
    userTimelineWeeks: userWeeks,
    realisticTimelineWeeks: realisticWeeks,
    gapWeeks: Math.max(0, gapWeeks),
    gapPercentage: Math.max(0, gapPercentage),
    isTooAggressive: gapWeeks > 0,
    severity,
  };
}

/**
 * Calculate team size gap and severity
 */
export function analyzeTeamSizeGap(
  userTeamSize: string,
  estimate: CostEstimate
): TeamSizeGap {
  const userCount = parseTeamSize(userTeamSize);
  const realisticCount = estimate.teamCount;
  
  const gapCount = realisticCount - userCount;
  const gapPercentage = userCount > 0
    ? ((gapCount / userCount) * 100)
    : 0;
  
  let severity: TeamSizeGap["severity"] = "none";
  if (gapPercentage > 150) severity = "severe";
  else if (gapPercentage > 75) severity = "moderate";
  else if (gapPercentage > 25) severity = "minor";
  
  return {
    userTeamSize: userCount,
    realisticTeamSize: realisticCount,
    gapCount: Math.max(0, gapCount),
    gapPercentage: Math.max(0, gapPercentage),
    isTooSmall: gapCount > 0,
    severity,
  };
}

/**
 * Prioritize features based on ROI and dependencies
 */
export function prioritizeFeatures(
  features: string[],
  projectType: string,
  successMetric: string
): { essential: string[]; highValue: string[]; canWait: string[] } {
  const essential: string[] = [];
  const highValue: string[] = [];
  const canWait: string[] = [];
  
  // Core features that are almost always essential
  const corePatterns = [
    "auth", "login", "sign", "user", "account", "profile",
    "payment", "checkout", "stripe", "billing",
    "database", "data", "storage"
  ];
  
  // High-value revenue/growth features
  const revenuePatterns = [
    "payment", "subscription", "checkout", "billing",
    "onboarding", "signup", "conversion"
  ];
  
  // Nice-to-have features
  const niceToHavePatterns = [
    "analytics", "dashboard", "report", "chart",
    "notification", "email", "sms",
    "social", "share", "invite",
    "search", "filter", "sort",
    "admin", "settings", "preferences"
  ];
  
  features.forEach(feature => {
    const lower = feature.toLowerCase();
    
    // Check if essential
    if (corePatterns.some(pattern => lower.includes(pattern))) {
      essential.push(feature);
    }
    // Check if high-value
    else if (revenuePatterns.some(pattern => lower.includes(pattern))) {
      highValue.push(feature);
    }
    // Check if nice-to-have
    else if (niceToHavePatterns.some(pattern => lower.includes(pattern))) {
      canWait.push(feature);
    }
    // Default to high-value if unclear
    else {
      highValue.push(feature);
    }
  });
  
  return { essential, highValue, canWait };
}

/**
 * Generate cost optimization recommendations
 */
export function generateOptimizationPlan(
  route: Route,
  complexity: Complexity,
  userBudget: string,
  userTimeline: string,
  userTeamSize: string,
  features: string[],
  successMetric: string
): CostOptimizationPlan {
  const estimate = getCostEstimate(route, complexity, features, userTimeline);
  const budgetGap = analyzeBudgetGap(userBudget, estimate);
  const timelineGap = analyzeTimelineGap(userTimeline, estimate);
  const teamSizeGap = analyzeTeamSizeGap(userTeamSize, estimate);
  const prioritized = prioritizeFeatures(features, route, successMetric);
  
  const recommendations: OptimizationRecommendation[] = [];
  
  // Budget Recommendations
  if (budgetGap.severity !== "none" && features.length > 3) {
    const mvpFeatureCount = Math.max(2, Math.floor(features.length / 3));
    const costReduction = Math.floor(budgetGap.gapAmount * 0.6);
    
    recommendations.push({
      title: `Launch with ${mvpFeatureCount} Core Features Instead of ${features.length}`,
      description: `Start with your highest-ROI features: ${prioritized.essential.concat(prioritized.highValue).slice(0, mvpFeatureCount).join(", ")}. Add remaining features after early traction.`,
      impact: "Reduces scope by 60-70%",
      savings: `$${costReduction.toLocaleString()}`,
      priority: 1,
      category: "scope",
    });
  }
  
  if (route === "custom" && budgetGap.severity === "severe") {
    recommendations.push({
      title: "Start with Hybrid Approach Instead of Full Custom",
      description: "Use no-code tools and SaaS APIs for non-differentiating features (auth, payments, email). Build custom code only for your unique value proposition.",
      impact: "Reduces development time by 40-50%",
      savings: `$${Math.floor(budgetGap.gapAmount * 0.4).toLocaleString()}`,
      priority: 2,
      category: "budget",
    });
  }
  
  if (route === "hybrid" && budgetGap.severity !== "none") {
    recommendations.push({
      title: "Maximize No-Code Tools for MVP",
      description: "Use Bubble, Webflow, or Softr for your initial launch. Switch to custom code only when you hit platform limitations (usually after $10K+ MRR).",
      impact: "Reduces initial cost by 50-60%",
      savings: `$${Math.floor(budgetGap.gapAmount * 0.5).toLocaleString()}`,
      priority: 2,
      category: "budget",
    });
  }
  
  // Timeline Recommendations
  if (timelineGap.severity !== "none") {
    const recommendedWeeks = estimate.timelineWeeks;
    const userWeeks = timelineGap.userTimelineWeeks;
    
    if (timelineGap.isTooAggressive) {
      recommendations.push({
        title: `Extend Timeline from ${userWeeks} to ${recommendedWeeks} Weeks`,
        description: `Your ${userWeeks}-week timeline is too aggressive for this scope. A realistic ${recommendedWeeks}-week timeline allows for proper planning, development, testing, and iteration. Rushing leads to technical debt and bugs.`,
        impact: "Improves quality and reduces stress",
        savings: `Avoids 15-25% cost overruns from rushed work`,
        priority: 3,
        category: "timeline",
      });
    }
  }
  
  // Team Size Recommendations
  if (teamSizeGap.severity !== "none" && timelineGap.isTooAggressive) {
    const recommendedTeam = Math.ceil(estimate.teamCount);
    const userTeam = Math.ceil(teamSizeGap.userTeamSize);
    
    recommendations.push({
      title: `Increase Team from ${userTeam} to ${recommendedTeam} Developers to Meet Timeline`,
      description: `To hit your ${timelineGap.userTimelineWeeks}-week deadline with this scope, you need ${recommendedTeam} developers working in parallel. With ${userTeam} developer(s), expect ${estimate.timelineWeeks} weeks instead.`,
      impact: `Meets your timeline goal`,
      savings: `Delivers ${timelineGap.gapWeeks} weeks faster`,
      priority: 4,
      category: "team",
    });
  } else if (teamSizeGap.severity !== "none") {
    const recommendedTeam = Math.ceil(estimate.teamCount);
    
    recommendations.push({
      title: `Consider ${recommendedTeam} Developers for This Scope`,
      description: `This project scope typically requires ${estimate.teamSize}. With fewer developers, expect longer timelines and potential bottlenecks. More developers means parallel workstreams and faster delivery.`,
      impact: "Balances speed and coordination overhead",
      savings: "Optimal team size for this scope",
      priority: 5,
      category: "team",
    });
  }
  
  // Phased Approach Recommendation
  if (budgetGap.severity !== "none" || timelineGap.severity !== "none") {
    recommendations.push({
      title: "Use Phased Development Instead of Big Bang Launch",
      description: "Build and launch incrementally. Get user feedback after each phase before investing more. Reduces wasted development on features users don't want.",
      impact: "Reduces risk and focuses the build",
      savings: "Avoids $5K-15K in wasted features",
      priority: 6,
      category: "scope",
    });
  }
  
  // Generate MVP phasing plan
  const mvpFeatures = prioritized.essential.concat(prioritized.highValue).slice(0, 2);
  const phase2Features = prioritized.highValue.slice(2, 4);
  const phase3Features = prioritized.canWait.slice(0, 3);
  
  const mvpCost = Math.floor(estimate.budgetMin * 0.3);
  const phase2Cost = Math.floor(estimate.budgetMin * 0.3);
  const phase3Cost = Math.floor(estimate.budgetMin * 0.4);
  
  const mvpApproach = {
    phase1: {
      features: mvpFeatures.length > 0 ? mvpFeatures : ["Core user flow", "Basic functionality"],
      cost: `$${mvpCost.toLocaleString()}`,
      timeline: "4-6 weeks",
      description: "Launch MVP with essential features to get early customers",
    },
    phase2: phase2Features.length > 0 ? {
      features: phase2Features,
      cost: `$${phase2Cost.toLocaleString()}`,
      timeline: "4-6 weeks after Phase 1",
      description: "Add high-value features based on user feedback",
    } : undefined,
    phase3: phase3Features.length > 0 ? {
      features: phase3Features,
      cost: `$${phase3Cost.toLocaleString()}`,
      timeline: "6-8 weeks after Phase 2",
      description: "Polish and scale based on usage and traction",
    } : undefined,
  };
  
  // Tech stack alternative
  let alternativeTechStack: CostOptimizationPlan["alternativeTechStack"];
  if (route === "custom") {
    alternativeTechStack = {
      current: "Full custom development",
      suggested: "Hybrid: No-code + Custom code for unique features",
      reasoning: "Use Bubble/Webflow for standard features, custom code only for differentiation",
      savings: `$${Math.floor(estimate.budgetMin * 0.4).toLocaleString()}`,
    };
  } else if (route === "hybrid") {
    alternativeTechStack = {
      current: "Hybrid approach",
      suggested: "Start with pure no-code, add custom later",
      reasoning: "Use no-code to launch faster before investing in custom development",
      savings: `$${Math.floor(estimate.budgetMin * 0.3).toLocaleString()}`,
    };
  }
  
  return {
    budgetGap,
    timelineGap,
    teamSizeGap,
    recommendations: recommendations.sort((a, b) => a.priority - b.priority),
    mvpApproach,
    alternativeTechStack,
  };
}
