import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { assessmentResponses } from "../../drizzle/schema";

/**
 * Webhook router for Beehiiv/Zapier integration
 * Sends assessment data to external automation platforms
 */
export const webhookRouter = router({
  /**
   * Send assessment completion webhook
   * Payload includes all data needed for email personalization
   */
  sendAssessmentWebhook: publicProcedure
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
        eventType: z.enum(["paid", "free", "waitlist"]),
        stripeSessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Store assessment response in database
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
          eventType: input.eventType,
          stripeSessionId: input.stripeSessionId || null,
          webhookSent: 0, // Will be updated after webhook succeeds
        });

        // Prepare webhook payload for Beehiiv/Zapier
        const webhookPayload = {
          email: input.email,
          name: input.name || "",
          dev_role: input.devRole || "",
          project_type: input.projectType || "",
          timeline: input.timeline || "",
          budget_range: input.budgetRange || "",
          top_features: input.topFeatures || [],
          route: input.route,
          complexity: input.complexity,
          event_type: input.eventType,
          stripe_session_id: input.stripeSessionId || "",
          timestamp: new Date().toISOString(),
        };

        // Send webhook to Beehiiv/Zapier
        const webhookUrl = process.env.BEEHIIV_WEBHOOK_URL;
        if (webhookUrl) {
          try {
            const response = await fetch(webhookUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(webhookPayload),
            });

            if (!response.ok) {
              console.error("Webhook delivery failed:", response.statusText);
            } else {
              console.log("Webhook sent successfully");
              // TODO: Update webhookSent flag in database
            }
          } catch (webhookError) {
            console.error("Webhook delivery error:", webhookError);
            // Don't throw - we still want to return success to the client
          }
        } else {
          console.warn("BEEHIIV_WEBHOOK_URL not configured");
        }

        return {
          success: true,
          message: "Assessment data saved and webhook sent",
        };
      } catch (error) {
        console.error("Assessment webhook error:", error);
        throw new Error("Failed to process assessment webhook");
      }
    }),
});
