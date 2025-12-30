import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { sendReportEmail } from "../email";
import { getDb } from "../db";
import { assessmentResponses, assessmentProgress } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { RecommendationEngine } from "../services/recommendation-engine";
import { PRODUCT_CATEGORIES, validateProductCategoryWithAI } from "../services/category-validator";
import { migrateProductType } from "@shared/utils/product-type-migrator";

export const assessmentRouter = router({
  submitReport: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        score: z.number().int().min(0),
        maxScore: z.number().int().positive(),
        fitType: z.enum(["PERFECT NOCODE", "VIABLE", "CUSTOM NEEDED"]),
        message: z.string(),
        cta: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await sendReportEmail({
        email: input.email,
        score: input.score,
        maxScore: input.maxScore,
        fitType: input.fitType,
        message: input.message,
        cta: input.cta,
      });

      return {
        success,
        message: success
          ? "Report sent successfully"
          : "Failed to send report. Please try again.",
      };
    }),

  saveAssessment: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        route: z.enum(["no-code", "hybrid", "custom"]),
        complexity: z.enum(["low", "medium", "high"]),
        devRole: z.string().optional(),
        projectType: z.string().optional(),
        timeline: z.string().optional(),
        budgetRange: z.string().optional(),
        topFeatures: z.array(z.string()).optional(),
        responses: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db.insert(assessmentResponses).values({
        email: input.email,
        name: input.name || null,
        route: input.route,
        complexity: input.complexity,
        devRole: input.devRole || null,
        projectType: input.projectType || null,
        timeline: input.timeline || null,
        budgetRange: input.budgetRange || null,
        topFeatures: input.topFeatures ? JSON.stringify(input.topFeatures) : null,
        responses: JSON.stringify(input.responses),
        webhookSent: 0,
      });

      return { success: true };
    }),

  generateRecommendations: publicProcedure
    .input(
      z.object({
        route: z.enum(["no-code", "hybrid", "custom"]),
        responses: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(async ({ input }) => {
      const engine = new RecommendationEngine();
      const recommendation = await engine.generateRecommendations(
        input.responses,
        input.route
      );
      return recommendation;
    }),

  validateProductCategory: publicProcedure
    .input(
      z.object({
        selectedCategory: z.preprocess(
          (val) => {
            const migrated = migrateProductType(String(val || "").trim());
            return migrated || "Other (describe below)";
          },
          z.enum(PRODUCT_CATEGORIES)
        ),
        q12Text: z.string().max(4000).optional(),
        q13Text: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return validateProductCategoryWithAI({
        selectedCategory: input.selectedCategory,
        q12Text: String(input.q12Text || ""),
        q13Text: String(input.q13Text || ""),
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const db = await getDb();
    if (!db) {
      return [];
    }

    const assessments = await db
      .select()
      .from(assessmentResponses)
      .orderBy(desc(assessmentResponses.completedAt));

    return assessments;
  }),

  // Progress save/load/clear procedures for backend auto-save
  saveProgress: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        currentStep: z.number().int().min(0),
        responses: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Check if progress already exists for this email
      const existing = await db
        .select()
        .from(assessmentProgress)
        .where(eq(assessmentProgress.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        // Update existing progress
        await db
          .update(assessmentProgress)
          .set({
            name: input.name || null,
            currentStep: input.currentStep,
            responses: JSON.stringify(input.responses),
            updatedAt: new Date(),
          })
          .where(eq(assessmentProgress.email, input.email));
      } else {
        // Insert new progress
        await db.insert(assessmentProgress).values({
          email: input.email,
          name: input.name || null,
          currentStep: input.currentStep,
          responses: JSON.stringify(input.responses),
        });
      }

      return { success: true };
    }),

  getProgress: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return null;
      }

      const progress = await db
        .select()
        .from(assessmentProgress)
        .where(eq(assessmentProgress.email, input.email))
        .limit(1);

      if (progress.length === 0) {
        return null;
      }

      return {
        email: progress[0].email,
        name: progress[0].name,
        currentStep: progress[0].currentStep,
        responses: JSON.parse(progress[0].responses),
      };
    }),

  clearProgress: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .delete(assessmentProgress)
        .where(eq(assessmentProgress.email, input.email));

      return { success: true };
    }),
});
