import { describe, it, expect } from "vitest";
import { getCostEstimate, type Route, type Complexity } from "../shared/cost-estimator";
import { generateOptimizationPlan } from "../shared/cost-optimizer";

describe("Cost math invariants (type-1 correctness)", () => {
  const baseFeatures = [
    "user authentication",
    "payment processing",
    "dashboard",
  ];

  it("adds cost as feature count increases (monotonic)", () => {
    const route: Route = "custom";
    const complexity: Complexity = "medium";
    const timeline = "Standard (3-4 months)";

    const estimate3 = getCostEstimate(route, complexity, baseFeatures, timeline);

    const estimate6 = getCostEstimate(
      route,
      complexity,
      [...baseFeatures, "admin panel", "file upload", "search functionality"],
      timeline
    );

    expect(estimate6.seniorEstimate.budgetMin).toBeGreaterThan(estimate3.seniorEstimate.budgetMin);
    expect(estimate6.seniorEstimate.budgetMax).toBeGreaterThan(estimate3.seniorEstimate.budgetMax);
  });

  it("no-code is cheaper than custom when scope is held constant", () => {
    const complexity: Complexity = "medium";
    const timeline = "Standard (3-4 months)";

    const noCode = getCostEstimate("no-code", complexity, baseFeatures, timeline);
    const custom = getCostEstimate("custom", complexity, baseFeatures, timeline);

    expect(noCode.seniorEstimate.budgetMin).toBeLessThan(custom.seniorEstimate.budgetMin);
    expect(noCode.seniorEstimate.budgetMax).toBeLessThan(custom.seniorEstimate.budgetMax);
  });

  it("high complexity costs more than low complexity when scope is held constant", () => {
    const route: Route = "custom";
    const timeline = "Standard (3-4 months)";

    const low = getCostEstimate(route, "low", baseFeatures, timeline);
    const high = getCostEstimate(route, "high", baseFeatures, timeline);

    expect(high.seniorEstimate.budgetMin).toBeGreaterThan(low.seniorEstimate.budgetMin);
    expect(high.seniorEstimate.budgetMax).toBeGreaterThan(low.seniorEstimate.budgetMax);
  });

  it("applies rush pricing (~+40%) for ASAP timeline vs standard timeline", () => {
    const route: Route = "custom";
    const complexity: Complexity = "medium";

    const standard = getCostEstimate(route, complexity, baseFeatures, "Standard (3-4 months)");
    const rush = getCostEstimate(route, complexity, baseFeatures, "ASAP (1-2 months)");

    // Allow for rounding differences
    const ratio = rush.seniorEstimate.budgetMin / standard.seniorEstimate.budgetMin;
    expect(ratio).toBeGreaterThan(1.36);
    expect(ratio).toBeLessThan(1.39);
  });

  it("parses new assessment budget/timeline strings correctly in optimizer", () => {
    const plan = generateOptimizationPlan(
      "custom",
      "medium",
      "$10,000 – $20,000",
      "Standard (3-4 months)",
      "Just me (1 person)",
      baseFeatures,
      "Revenue"
    );

    expect(plan.budgetGap.userBudgetMin).toBe(10000);
    expect(plan.budgetGap.userBudgetMax).toBe(20000);

    // 3-4 months should map to ~14 weeks in parseTimeline
    expect(plan.timelineGap.userTimelineWeeks).toBe(14);
  });
});
