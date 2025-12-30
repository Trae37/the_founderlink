/**
 * Cost Estimator - Three-tier realistic project estimates
 * Based on route, complexity, and developer experience level
 * AI-adjusted rates reflecting 2025 market realities
 * Now with MVP matching for research-based baseline estimates
 */

import { matchProjectToMVP } from './mvp-matcher';
import { getCategoriesForProductType } from './mvp-category-mapper';

export type Route = "no-code" | "hybrid" | "custom";
export type Complexity = "low" | "medium" | "high";
export type ExperienceLevel = "junior" | "mid" | "senior";

export interface TeamMember {
  level: ExperienceLevel;
  count: number;
  role: string;
}

export interface TeamOption {
  name: string;
  members: TeamMember[];
  totalCost: { min: number; max: number };
  timeline: { min: number; max: number }; // weeks
  description: string;
  tradeoff: string;
}

export interface CostEstimate {
  // Single tier estimate (for backward compatibility)
  budgetRange: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  timelineWeeks: number;
  teamSize: string;
  teamCount: number;
  
  // Three-tier breakdown
  juniorEstimate?: TierEstimate;
  midEstimate: TierEstimate;
  seniorEstimate: TierEstimate;
  
  // Team composition options
  teamOptions: TeamOption[];
}

export interface TierEstimate {
  level: ExperienceLevel;
  budgetRange: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  timelineWeeks: { min: number; max: number };
  teamSize: string;
  teamCount: number;
  benefits: string[];
  tradeoffs: string[];
}

/**
 * AI-Adjusted Hourly Rates (2025 Market)
 * Assumes developers use AI tools (Cursor, Copilot, v0)
 * Reflects 25-30% efficiency gain for seniors, 15-20% for mid-level, 10-15% for juniors
 */
const HOURLY_RATES = {
  "no-code": {
    junior: 40,   // Early-stage no-code builders ($40-60/hr)
    mid: 60,      // Competent no-code developers ($60-90/hr)
    senior: 90,   // Experienced no-code architects ($90-125/hr)
  },
  hybrid: {
    junior: 50,   // Junior hybrid developers ($40-60/hr)
    mid: 75,      // Mid-level hybrid developers ($60-90/hr)
    senior: 105,  // Senior hybrid developers ($90-125/hr)
  },
  custom: {
    junior: 50,   // Junior full-stack developers ($40-60/hr)
    mid: 75,      // Mid-level full-stack developers ($60-90/hr)
    senior: 107,  // Senior full-stack developers ($90-125/hr)
  },
};

/**
 * Feature Complexity Benchmarks (hours per feature)
 * Based on industry data for AI-augmented development
 */
const FEATURE_HOURS = {
  "user-authentication": { min: 15, max: 30 },
  "payment-processing": { min: 25, max: 40 },
  "dashboard": { min: 30, max: 60 },
  "admin-panel": { min: 25, max: 50 },
  "file-upload": { min: 15, max: 30 },
  "email-notifications": { min: 10, max: 25 },
  "real-time-updates": { min: 30, max: 60 },
  "api-integration": { min: 15, max: 35 },
  "mobile-responsive": { min: 20, max: 40 },
  "search-functionality": { min: 20, max: 40 },
  "user-profiles": { min: 15, max: 30 },
  "messaging-chat": { min: 35, max: 70 },
  "analytics-reporting": { min: 25, max: 50 },
  "third-party-integrations": { min: 20, max: 40 },
};

/**
 * Project Overhead Multipliers
 */
const OVERHEAD = {
  setup: 15,           // Initial setup & architecture (hours)
  testing: 0.20,       // 20% of dev time
  deployment: 15,      // Deployment & DevOps (hours)
  bugFixes: 0.15,      // 15% of dev time
  coordination: 0.10,  // 10% for team communication
};

/**
 * Route Speed Multipliers
 */
const ROUTE_MULTIPLIERS = {
  "no-code": 0.4,   // 60% faster than custom
  hybrid: 0.7,      // 30% faster than custom
  custom: 1.0,      // Baseline
};

/**
 * Experience Level Speed Multipliers
 */
const EXPERIENCE_MULTIPLIERS = {
  junior: 1.4,   // 40% slower than senior
  mid: 1.15,     // 15% slower than senior
  senior: 1.0,   // Baseline
};

/**
 * Timeline-Based Pricing Multipliers (2025 Market Data)
 * Based on Perplexity research on rush pricing and flexible timelines
 */
const TIMELINE_MULTIPLIERS: Record<string, number> = {
  "ASAP / Rush (1-2 months)": 1.375,           // +37.5% premium (mean of 25-50%)
  "Standard timeline (2-4 months)": 1.0,      // Baseline
  "Flexible timeline (4-6 months)": 0.85,     // -15% discount (mid-range of -10-20%)
  "Long-term (6+ months)": 0.80,              // -20% discount (mid-range of -15-25%)
  "No specific timeline": 0.85,               // Same as flexible
  // New assessment (Q7) option strings
  "ASAP (1-2 months)": 1.375,
  "Standard (3-4 months)": 1.0,
  "Flexible (5+ months)": 0.85,
  "Not sure yet": 1.0,
  // Legacy support for old timeline format
  "In about 4-6 weeks": 1.375,                 // Map old rush to new rush
  "In about 6-8 weeks": 1.0,                  // Map old standard to new standard
  "In about 8-12 weeks": 0.85,                // Map old flexible to new flexible
  "I'm flexible on timing": 0.85,             // Map old flexible to new flexible
};

/**
 * Calculate total project hours based on features
 */
function calculateProjectHours(
  features: string[],
  route: Route,
  complexity: Complexity
): { min: number; max: number } {
  let minHours = 0;
  let maxHours = 0;

  // Sum feature hours
  features.forEach((feature) => {
    const featureKey = feature.toLowerCase().replace(/\s+/g, "-");
    const hours = FEATURE_HOURS[featureKey as keyof typeof FEATURE_HOURS] || { min: 20, max: 40 };
    minHours += hours.min;
    maxHours += hours.max;
  });

  // Apply route multiplier
  const routeMultiplier = ROUTE_MULTIPLIERS[route];
  minHours *= routeMultiplier;
  maxHours *= routeMultiplier;

  // Add overhead
  const setupHours = OVERHEAD.setup;
  const testingHours = (minHours + maxHours) / 2 * OVERHEAD.testing;
  const deploymentHours = OVERHEAD.deployment;
  const bugFixHours = (minHours + maxHours) / 2 * OVERHEAD.bugFixes;
  const coordinationHours = (minHours + maxHours) / 2 * OVERHEAD.coordination;

  const totalOverhead = setupHours + testingHours + deploymentHours + bugFixHours + coordinationHours;
  
  minHours += totalOverhead * 0.8; // Lower bound overhead
  maxHours += totalOverhead * 1.2; // Upper bound overhead

  // Complexity adjustment
  const complexityMultiplier = complexity === "low" ? 0.8 : complexity === "high" ? 1.3 : 1.0;
  minHours *= complexityMultiplier;
  maxHours *= complexityMultiplier;

  return { min: Math.round(minHours), max: Math.round(maxHours) };
}

/**
 * Calculate cost and timeline for a specific experience level
 */
function calculateTierEstimate(
  route: Route,
  hours: { min: number; max: number },
  level: ExperienceLevel,
  teamCount: number
): TierEstimate {
  const hourlyRate = HOURLY_RATES[route][level];
  const experienceMultiplier = EXPERIENCE_MULTIPLIERS[level];

  // Adjust hours for experience level
  const adjustedHours = {
    min: Math.round(hours.min * experienceMultiplier),
    max: Math.round(hours.max * experienceMultiplier),
  };

  // Calculate cost
  const budgetMin = adjustedHours.min * hourlyRate;
  const budgetMax = adjustedHours.max * hourlyRate;

  // Calculate timeline (assuming 40 hours/week per developer)
  const timelineMin = Math.ceil(adjustedHours.min / (40 * teamCount));
  const timelineMax = Math.ceil(adjustedHours.max / (40 * teamCount));

  // Benefits and tradeoffs
  const benefits: Record<ExperienceLevel, string[]> = {
    junior: ["Most cost-effective", "Good for simple projects", "Eager to prove themselves"],
    mid: ["Balanced cost and quality", "Reliable execution", "Good for standard features"],
    senior: ["Fastest delivery", "Best architecture", "Handles complexity well"],
  };

  const tradeoffs: Record<ExperienceLevel, string[]> = {
    junior: ["Slower execution", "Needs clear requirements", "Best for simpler scope"],
    mid: ["Moderate speed", "May need guidance on complex features"],
    senior: ["Higher cost", "May be overkill for simple projects"],
  };

  return {
    level,
    budgetRange: `$${(budgetMin / 1000).toFixed(0)}K-$${(budgetMax / 1000).toFixed(0)}K`,
    budgetMin,
    budgetMax,
    timeline: `${timelineMin}-${timelineMax} weeks`,
    timelineWeeks: { min: timelineMin, max: timelineMax },
    teamSize: teamCount === 1 ? `1 ${level} developer` : `${teamCount} ${level} developers`,
    teamCount,
    benefits: benefits[level],
    tradeoffs: tradeoffs[level],
  };
}

/**
 * Calculate cost for a team working in parallel
 * 
 * Key insight: When multiple developers work in parallel, they split the work.
 * - Total project hours remain the same
 * - Each developer works (total_hours / team_size) hours
 * - Cost = sum of (hours_per_dev × rate_per_dev) for each developer
 * - Timeline = max(hours_per_dev) / 40 hours per week
 */
function calculateTeamCost(
  totalHours: { min: number; max: number },
  members: TeamMember[],
  route: Route
): { cost: { min: number; max: number }; timeline: { min: number; max: number } } {
  
  // Calculate total team size
  const teamSize = members.reduce((sum, m) => sum + m.count, 0);
  
  // For parallel work: each developer works (total_hours / team_size) hours
  const hoursPerDev = {
    min: totalHours.min / teamSize,
    max: totalHours.max / teamSize,
  };
  
  // Calculate cost for each team member type
  let totalCostMin = 0;
  let totalCostMax = 0;
  let maxTimelineMin = 0;
  let maxTimelineMax = 0;
  
  for (const member of members) {
    const rate = HOURLY_RATES[route][member.level];
    const multiplier = EXPERIENCE_MULTIPLIERS[member.level];
    
    // Each developer of this level works their portion
    const memberHoursMin = hoursPerDev.min * multiplier;
    const memberHoursMax = hoursPerDev.max * multiplier;
    
    // Cost = hours × rate × count
    totalCostMin += memberHoursMin * rate * member.count;
    totalCostMax += memberHoursMax * rate * member.count;
    
    // Timeline is determined by the slowest developer
    const timelineMin = memberHoursMin / 40; // weeks
    const timelineMax = memberHoursMax / 40;
    
    maxTimelineMin = Math.max(maxTimelineMin, timelineMin);
    maxTimelineMax = Math.max(maxTimelineMax, timelineMax);
  }
  
  return {
    cost: {
      min: Math.round(totalCostMin),
      max: Math.round(totalCostMax),
    },
    timeline: {
      min: Math.ceil(maxTimelineMin),
      max: Math.ceil(maxTimelineMax),
    },
  };
}

/**
 * Generate team composition options based on complexity
 */
function generateTeamOptions(
  route: Route,
  complexity: Complexity,
  hours: { min: number; max: number }
): TeamOption[] {
  const options: TeamOption[] = [];

  if (complexity === "low") {
    // Low complexity - solo developers
    
    // Only include junior for no-code route
    if (route === "no-code") {
      const juniorCalc = calculateTeamCost(
        hours,
        [{ level: "junior", count: 1, role: "No-Code Builder" }],
        route
      );
      
      options.push({
        name: "Solo Junior No-Code Builder",
        members: [{ level: "junior", count: 1, role: "No-Code Builder" }],
        totalCost: juniorCalc.cost,
        timeline: juniorCalc.timeline,
        description: "Most affordable option",
        tradeoff: "Slower execution, may need guidance",
      });
    }

    const midCalc = calculateTeamCost(
      hours,
      [{ level: "mid", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer" }],
      route
    );
    
    options.push({
      name: `Solo Mid-Level ${route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer"}`,
      members: [{ level: "mid", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer" }],
      totalCost: midCalc.cost,
      timeline: midCalc.timeline,
      description: "Balanced cost and quality",
      tradeoff: "Good execution speed, reliable delivery",
    });

    const seniorCalc = calculateTeamCost(
      hours,
      [{ level: "senior", count: 1, role: route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Senior Hybrid Developer" : "Senior Full-Stack Developer" }],
      route
    );
    
    options.push({
      name: `Solo Senior ${route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer"}`,
      members: [{ level: "senior", count: 1, role: route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Senior Hybrid Developer" : "Senior Full-Stack Developer" }],
      totalCost: seniorCalc.cost,
      timeline: seniorCalc.timeline,
      description: "Fastest delivery, best architecture",
      tradeoff: "Higher cost, but highest quality and speed",
    });
    
  } else if (complexity === "medium") {
    // Medium complexity - 2-person teams
    
    // Option 1: 2 Senior Devs (fastest, most expensive)
    const twoSeniorCalc = calculateTeamCost(
      hours,
      [{ level: "senior", count: 2, role: route === "no-code" ? "No-Code Architects" : route === "hybrid" ? "Senior Hybrid Developers" : "Senior Full-Stack Developers" }],
      route
    );
    
    options.push({
      name: "2 Senior Developers",
      members: [{ level: "senior", count: 2, role: route === "no-code" ? "No-Code Architects" : route === "hybrid" ? "Senior Hybrid Developers" : "Senior Full-Stack Developers" }],
      totalCost: twoSeniorCalc.cost,
      timeline: twoSeniorCalc.timeline,
      description: "Fastest delivery, highest quality",
      tradeoff: "Most expensive option",
    });

    // Option 2: 1 Senior + 1 Mid (balanced)
    const seniorMidCalc = calculateTeamCost(
      hours,
      [
        { level: "senior", count: 1, role: route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Senior Hybrid Developer" : "Senior Full-Stack Developer" },
        { level: "mid", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer" },
      ],
      route
    );
    
    options.push({
      name: "1 Senior + 1 Mid-Level Developer",
      members: [
        { level: "senior", count: 1, role: route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Senior Hybrid Developer" : "Senior Full-Stack Developer" },
        { level: "mid", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer" },
      ],
      totalCost: seniorMidCalc.cost,
      timeline: seniorMidCalc.timeline,
      description: "Balanced speed and cost",
      tradeoff: "Good quality, moderate timeline",
    });

    // Option 3: 1 Senior + 1 Junior (most cost-effective)
    const seniorJuniorCalc = calculateTeamCost(
      hours,
      [
        { level: "senior", count: 1, role: route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Senior Hybrid Developer" : "Senior Full-Stack Developer" },
        { level: "junior", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Junior Hybrid Developer" : "Junior Full-Stack Developer" },
      ],
      route
    );
    
    options.push({
      name: "1 Senior + 1 Junior Developer",
      members: [
        { level: "senior", count: 1, role: route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Senior Hybrid Developer" : "Senior Full-Stack Developer" },
        { level: "junior", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Junior Hybrid Developer" : "Junior Full-Stack Developer" },
      ],
      totalCost: seniorJuniorCalc.cost,
      timeline: seniorJuniorCalc.timeline,
      description: "Most cost-effective team option",
      tradeoff: "Longer timeline, senior handles complex work",
    });
    
  } else {
    // High complexity - 3-person teams
    
    // Option 1: 3 Senior Devs (premium option)
    const threeSeniorCalc = calculateTeamCost(
      hours,
      [{ level: "senior", count: 3, role: route === "no-code" ? "No-Code Architects" : route === "hybrid" ? "Senior Hybrid Developers" : "Senior Full-Stack Developers" }],
      route
    );
    
    options.push({
      name: "3 Senior Developers",
      members: [{ level: "senior", count: 3, role: route === "no-code" ? "No-Code Architects" : route === "hybrid" ? "Senior Hybrid Developers" : "Senior Full-Stack Developers" }],
      totalCost: threeSeniorCalc.cost,
      timeline: threeSeniorCalc.timeline,
      description: "Fastest delivery, best for complex systems",
      tradeoff: "Highest cost, premium quality",
    });

    // Option 2: 2 Senior + 1 Mid (balanced premium)
    const twoSeniorMidCalc = calculateTeamCost(
      hours,
      [
        { level: "senior", count: 2, role: route === "no-code" ? "No-Code Architects" : route === "hybrid" ? "Senior Hybrid Developers" : "Senior Full-Stack Developers" },
        { level: "mid", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer" },
      ],
      route
    );
    
    options.push({
      name: "2 Senior + 1 Mid-Level Developer",
      members: [
        { level: "senior", count: 2, role: route === "no-code" ? "No-Code Architects" : route === "hybrid" ? "Senior Hybrid Developers" : "Senior Full-Stack Developers" },
        { level: "mid", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer" },
      ],
      totalCost: twoSeniorMidCalc.cost,
      timeline: twoSeniorMidCalc.timeline,
      description: "Balanced team for complex projects",
      tradeoff: "Good speed and quality, moderate cost",
    });

    // Option 3: 1 Senior + 1 Mid + 1 Junior (most cost-effective)
    const mixedTeamCalc = calculateTeamCost(
      hours,
      [
        { level: "senior", count: 1, role: route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Senior Hybrid Developer" : "Senior Full-Stack Developer" },
        { level: "mid", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer" },
        { level: "junior", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Junior Hybrid Developer" : "Junior Full-Stack Developer" },
      ],
      route
    );
    
    options.push({
      name: "1 Senior + 1 Mid + 1 Junior Developer",
      members: [
        { level: "senior", count: 1, role: route === "no-code" ? "No-Code Architect" : route === "hybrid" ? "Senior Hybrid Developer" : "Senior Full-Stack Developer" },
        { level: "mid", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Hybrid Developer" : "Full-Stack Developer" },
        { level: "junior", count: 1, role: route === "no-code" ? "No-Code Builder" : route === "hybrid" ? "Junior Hybrid Developer" : "Junior Full-Stack Developer" },
      ],
      totalCost: mixedTeamCalc.cost,
      timeline: mixedTeamCalc.timeline,
      description: "Most cost-effective for large projects",
      tradeoff: "Longer timeline, good for budget-conscious founders",
    });
  }

  return options;
}

/**
 * Get cost estimate for a project
 * Now with MVP matching for more accurate baseline estimates
 */
export function getCostEstimate(
  route: Route,
  complexity: Complexity,
  features: string[] = [],
  timeline?: string,
  projectDescription?: string,
  productType?: string
): CostEstimate {
  // Try to match project to known MVP types for better baseline estimates
  let mvpMatch = null;
  if (projectDescription && features.length > 0) {
    // Get category filter from product type selection
    const categoryFilter = productType ? getCategoriesForProductType(productType) : null;
    
    const matches = matchProjectToMVP(projectDescription, features, categoryFilter);
    if (matches.length > 0 && matches[0].confidence > 0.3) {
      mvpMatch = matches[0];
      console.log(`[MVP Match] ${mvpMatch.name} (${(mvpMatch.confidence * 100).toFixed(0)}% confidence)`);
    }
  }

  // Calculate base project hours
  const hours = features.length > 0
    ? calculateProjectHours(features, route, complexity)
    : getDefaultHours(route, complexity);

  // Apply timeline multiplier if provided
  const timelineKey = timeline ? String(timeline).replace(/\u2013|\u2014/g, "-") : "";
  const timelineMultiplier = timelineKey ? (TIMELINE_MULTIPLIERS[timelineKey] || 1.0) : 1.0;

  // Generate team options
  const teamOptions = generateTeamOptions(route, complexity, hours).map(option => ({
    ...option,
    totalCost: {
      min: Math.round(option.totalCost.min * timelineMultiplier),
      max: Math.round(option.totalCost.max * timelineMultiplier),
    },
  }));

  // Calculate tier estimates (assuming solo developer for each tier)
  const seniorEstimate = {
    ...calculateTierEstimate(route, hours, "senior", 1),
    budgetMin: Math.round(calculateTierEstimate(route, hours, "senior", 1).budgetMin * timelineMultiplier),
    budgetMax: Math.round(calculateTierEstimate(route, hours, "senior", 1).budgetMax * timelineMultiplier),
  };
  seniorEstimate.budgetRange = `$${(seniorEstimate.budgetMin / 1000).toFixed(0)}K-$${(seniorEstimate.budgetMax / 1000).toFixed(0)}K`;

  const midEstimate = {
    ...calculateTierEstimate(route, hours, "mid", 1),
    budgetMin: Math.round(calculateTierEstimate(route, hours, "mid", 1).budgetMin * timelineMultiplier),
    budgetMax: Math.round(calculateTierEstimate(route, hours, "mid", 1).budgetMax * timelineMultiplier),
  };
  midEstimate.budgetRange = `$${(midEstimate.budgetMin / 1000).toFixed(0)}K-$${(midEstimate.budgetMax / 1000).toFixed(0)}K`;

  const juniorEstimate = (route === "no-code" && complexity === "low")
    ? (() => {
        const base = calculateTierEstimate(route, hours, "junior", 1);
        const adjusted = {
          ...base,
          budgetMin: Math.round(base.budgetMin * timelineMultiplier),
          budgetMax: Math.round(base.budgetMax * timelineMultiplier),
        };
        adjusted.budgetRange = `$${(adjusted.budgetMin / 1000).toFixed(0)}K-$${(adjusted.budgetMax / 1000).toFixed(0)}K`;
        return adjusted;
      })()
    : undefined;

  // Default to senior estimate for backward compatibility
  return {
    budgetRange: seniorEstimate.budgetRange,
    budgetMin: seniorEstimate.budgetMin,
    budgetMax: seniorEstimate.budgetMax,
    timeline: seniorEstimate.timeline,
    timelineWeeks: seniorEstimate.timelineWeeks.min,
    teamSize: seniorEstimate.teamSize,
    teamCount: seniorEstimate.teamCount,
    juniorEstimate,
    midEstimate,
    seniorEstimate,
    teamOptions,
  };
}

/**
 * Get default hours for route/complexity when features not provided
 */
function getDefaultHours(route: Route, complexity: Complexity): { min: number; max: number } {
  const baseHours: Record<Complexity, { min: number; max: number }> = {
    low: { min: 80, max: 160 },
    medium: { min: 160, max: 320 },
    high: { min: 320, max: 600 },
  };

  const hours = baseHours[complexity];
  const routeMultiplier = ROUTE_MULTIPLIERS[route];

  return {
    min: Math.round(hours.min * routeMultiplier),
    max: Math.round(hours.max * routeMultiplier),
  };
}
