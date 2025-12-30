import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { intakeSubmissions } from "../../drizzle/schema";
import { getDb } from "../db";
import { sendConfirmationEmail } from "../email";
import { eq } from "drizzle-orm";

export const intakeRouter = router({
  submitIntake: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        name: z.string().min(2, "Name must be at least 2 characters"),
        company: z.string().min(2, "Company must be at least 2 characters"),
        context: z.string().optional(),
        productType: z.enum(["nocode-matches", "fullstack-waitlist", "mobile-waitlist"]),
        stripeSessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(intakeSubmissions).values({
          email: input.email,
          name: input.name,
          company: input.company,
          context: input.context || null,
          productType: input.productType,
          stripeSessionId: input.stripeSessionId || null,
          paymentStatus: "pending",
        });

        // Send confirmation email
        await sendConfirmationEmail({
          email: input.email,
          name: input.name,
          company: input.company,
          productType: input.productType,
        }).catch((err) => {
          console.error("Failed to send confirmation email:", err);
          // Don't fail the submission if email fails
        });

        return {
          success: true,
          submissionId: Number((result as any).insertId),
          message: "Intake submission saved successfully",
        };
      } catch (error) {
        console.error("Failed to save intake submission:", error);
        throw new Error("Failed to save intake submission");
      }
    }),

  getSubmissions: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const submissions = await db.select().from(intakeSubmissions);
      return submissions;
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      throw new Error("Failed to fetch submissions");
    }
  }),

  getSubmissionById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const submission = await db
          .select()
          .from(intakeSubmissions)
          .where(eq(intakeSubmissions.id, input.id))
          .limit(1);

        return submission[0] || null;
      } catch (error) {
        console.error("Failed to fetch submission:", error);
        throw new Error("Failed to fetch submission");
      }
    }),

  updatePaymentStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        paymentStatus: z.enum(["pending", "completed", "failed"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db
          .update(intakeSubmissions)
          .set({ paymentStatus: input.paymentStatus })
          .where(eq(intakeSubmissions.id, input.id));

        return { success: true, message: "Payment status updated" };
      } catch (error) {
        console.error("Failed to update payment status:", error);
        throw new Error("Failed to update payment status");
      }
    }),
});
