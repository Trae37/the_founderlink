import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "../routers";
import type { inferProcedureInput } from "@trpc/server";
import type { AppRouter } from "../routers";
import { getDb } from "../db";
import { assessmentProgress } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Assessment Progress Router", () => {
  const testEmail = `test-progress-${Date.now()}@example.com`;
  const caller = appRouter.createCaller({ req: {} as any, res: {} as any, user: null });

  afterAll(async () => {
    // Cleanup test data
    const db = await getDb();
    if (db) {
      await db.delete(assessmentProgress).where(eq(assessmentProgress.email, testEmail));
    }
  });

  it("should save progress to backend", async () => {
    type SaveProgressInput = inferProcedureInput<AppRouter["assessment"]["saveProgress"]>;
    
    const input: SaveProgressInput = {
      email: testEmail,
      name: "Test User",
      currentStep: 0,
      responses: {
        1: "Just an idea",
        2: "Under $3,000",
      },
    };

    const result = await caller.assessment.saveProgress(input);
    expect(result.success).toBe(true);
  });

  it("should retrieve saved progress", async () => {
    const progress = await caller.assessment.getProgress({ email: testEmail });
    
    expect(progress).toBeDefined();
    expect(progress?.email).toBe(testEmail);
    expect(progress?.name).toBe("Test User");
    expect(progress?.currentStep).toBe(0);
    expect(progress?.responses).toHaveProperty("1");
    expect(progress?.responses["1"]).toBe("Just an idea");
  });

  it("should update existing progress", async () => {
    type SaveProgressInput = inferProcedureInput<AppRouter["assessment"]["saveProgress"]>;
    
    const input: SaveProgressInput = {
      email: testEmail,
      name: "Test User Updated",
      currentStep: 1,
      responses: {
        1: "Just an idea",
        2: "Under $3,000",
        3: "A simple website or landing page",
      },
    };

    const result = await caller.assessment.saveProgress(input);
    expect(result.success).toBe(true);

    const progress = await caller.assessment.getProgress({ email: testEmail });
    expect(progress?.currentStep).toBe(1);
    expect(progress?.name).toBe("Test User Updated");
    expect(Object.keys(progress?.responses || {}).length).toBe(3);
  });

  it("should clear progress", async () => {
    const result = await caller.assessment.clearProgress({ email: testEmail });
    expect(result.success).toBe(true);

    const progress = await caller.assessment.getProgress({ email: testEmail });
    expect(progress).toBeNull();
  });

  it("should return null for non-existent progress", async () => {
    const progress = await caller.assessment.getProgress({ email: "nonexistent@example.com" });
    expect(progress).toBeNull();
  });
});
