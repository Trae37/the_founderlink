import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userFeedback } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const feedbackRouter = router({
  // Submit feedback (public)
  submit: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        category: z.enum(["bug", "feature", "question", "other"]),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db.insert(userFeedback).values({
        email: input.email,
        name: input.name || null,
        category: input.category,
        message: input.message,
        status: "new",
      });

      return { success: true };
    }),

  // Get all feedback (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const db = await getDb();
    if (!db) {
      return [];
    }

    const feedback = await db
      .select()
      .from(userFeedback)
      .orderBy(desc(userFeedback.createdAt));

    return feedback;
  }),

  // Respond to feedback (admin only)
  respond: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        response: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .update(userFeedback)
        .set({
          adminResponse: input.response,
          respondedAt: new Date(),
          status: "resolved",
        })
        .where(eq(userFeedback.id, input.id));

      return { success: true };
    }),

  // Update feedback status (admin only)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "in-progress", "resolved", "closed"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .update(userFeedback)
        .set({ status: input.status })
        .where(eq(userFeedback.id, input.id));

      return { success: true };
    }),
});
