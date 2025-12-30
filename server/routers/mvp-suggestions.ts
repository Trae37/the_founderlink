import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { mvpSuggestions } from "../../drizzle/schema";

export const mvpSuggestionsRouter = router({
  /**
   * Save a user's "Other" product type description for analysis
   */
  saveSuggestion: publicProcedure
    .input(
      z.object({
        userDescription: z.string().min(1),
        problemDescription: z.string().optional(),
        features: z.array(z.string()).optional(),
        selectedRoute: z.string().optional(),
        complexity: z.string().optional(),
        budget: z.string().optional(),
        timeline: z.string().optional(),
        estimatedCostMin: z.number().optional(),
        estimatedCostMax: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const result = await db.insert(mvpSuggestions).values({
        userDescription: input.userDescription,
        problemDescription: input.problemDescription,
        features: input.features,
        selectedRoute: input.selectedRoute,
        complexity: input.complexity,
        budget: input.budget,
        timeline: input.timeline,
        estimatedCostMin: input.estimatedCostMin,
        estimatedCostMax: input.estimatedCostMax,
      });

      return {
        success: true,
        id: Number((result as any).insertId),
      };
    }),
});
