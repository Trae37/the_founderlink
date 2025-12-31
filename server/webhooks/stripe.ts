import Stripe from "stripe";
import { getDb } from "../db";
import { intakeSubmissions, assessmentResponses } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendPaymentConfirmationEmail } from "../email";
import { generateAndSendBlueprintFromStripeSession } from "../services/blueprint-delivery";
import { getCoreFeaturesFromQ4Answer } from "@shared/feature-catalog";

let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2025-12-15.clover",
    });
  }

  return stripeClient;
}

export async function handleStripeWebhook(
  body: Buffer,
  signature: string
): Promise<{ success: boolean; message: string }> {
  console.log("[Stripe Webhook] Starting processing...");
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET");
      return { success: false, message: "Stripe webhook not configured (missing STRIPE_WEBHOOK_SECRET)" };
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[Stripe Webhook] Missing STRIPE_SECRET_KEY");
      return { success: false, message: "Stripe not configured (missing STRIPE_SECRET_KEY)" };
    }

    console.log("[Stripe Webhook] Verifying signature...");
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("[Stripe Webhook] Event type:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        console.log("[Stripe Webhook] Processing checkout.session.completed...");
        return await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      case "charge.refunded":
        return await handleChargeRefunded(event.data.object as Stripe.Charge);
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return { success: true, message: "Event received but not processed" };
    }
  } catch (error: any) {
    console.error("[Stripe Webhook] Error:", error?.message || error);
    console.error("[Stripe Webhook] Stack:", error?.stack);
    throw error;
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Checkout] Starting handleCheckoutSessionCompleted for session:", session.id);
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    console.log("[Checkout] Database connected");

    const productType = session.metadata?.product_type || session.metadata?.productType;
    if (productType === "prd-sow-tripwire") {
      const blueprintFormat = session.metadata?.blueprint_format === "md" ? "md" : "docx";

      const delivery = await generateAndSendBlueprintFromStripeSession({
        stripeSessionId: session.id,
        blueprintFormat,
      });

      const webhookUrl = process.env.BEEHIIV_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          const assessmentData = await db
            .select()
            .from(assessmentResponses)
            .where(eq(assessmentResponses.stripeSessionId, session.id))
            .limit(1);

          if (assessmentData.length > 0) {
            const data = assessmentData[0];

            let topFeatures: string[] = [];
            try {
              const responses = JSON.parse(data.responses);
              const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);
              const dayOneNeeds = Array.isArray(responses[5]) ? responses[5] : [];
              const integrations = Array.isArray(responses[14]?.selected) ? responses[14].selected : [];
              const other = String(responses[14]?.other || "").trim();
              topFeatures = [...coreFeatures, ...dayOneNeeds, ...integrations, ...(other ? [other] : [])]
                .filter((f) => f && f !== "None of these")
                .filter((f, i, arr) => arr.indexOf(f) === i);
            } catch (e) {
              console.error("Failed to parse assessment responses:", e);
            }

            const webhookPayload = {
              email: data.email,
              name: data.name,
              dev_role: data.devRole || "",
              project_type: data.projectType || "",
              timeline: data.timeline || "",
              budget_range: data.budgetRange || "",
              top_features: topFeatures,
              route: data.route,
              complexity: data.complexity,
              event_type: "paid",
              stripe_session_id: session.id,
              product_type: "prd-sow-tripwire",
              timestamp: new Date().toISOString(),
            };

            const webhookResponse = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(webhookPayload),
            });

            if (webhookResponse.ok) {
              console.log(`[Stripe] Webhook sent to Beehiiv for ${data.email}`);
            } else {
              console.error(`[Stripe] Webhook failed: ${webhookResponse.statusText}`);
            }
          }
        } catch (webhookError) {
          console.error("[Stripe] Webhook delivery error:", webhookError);
        }
      }

      return {
        success: delivery.ok,
        message: `[Stripe] Blueprint payment confirmed for session ${session.id}. ${delivery.message}`,
      };
    }

    // Find the intake submission by stripe session ID
    const submissions = await db
      .select()
      .from(intakeSubmissions)
      .where(eq(intakeSubmissions.stripeSessionId, session.id));

    if (submissions.length > 0) {
      const submission = submissions[0];
      
      // Update payment status to completed
      await db
        .update(intakeSubmissions)
        .set({ paymentStatus: "completed" })
        .where(eq(intakeSubmissions.stripeSessionId, session.id));

      // Send payment confirmation email
      const emailSent = await sendPaymentConfirmationEmail({
        customerEmail: submission.email,
        customerName: submission.name,
        productType: submission.productType,
        amount: (session.amount_total || 0) / 100, // Convert cents to dollars
      });

      console.log(`[Stripe] Payment confirmed for session ${session.id}`);
      if (emailSent) {
        console.log(`[Stripe] Confirmation email sent to ${submission.email}`);
      }

      // Send webhook for paid customers to Beehiiv/Zapier
      const webhookUrl = process.env.BEEHIIV_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          // Fetch assessment data from database
          const assessmentData = await db
            .select()
            .from(assessmentResponses)
            .where(eq(assessmentResponses.email, submission.email))
            .limit(1);

          if (assessmentData.length > 0) {
            const data = assessmentData[0];
            
            // Parse responses to extract top_features
            let topFeatures: string[] = [];
            try {
              const responses = JSON.parse(data.responses);
              const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);
              const dayOneNeeds = Array.isArray(responses[5]) ? responses[5] : [];
              const integrations = Array.isArray(responses[14]?.selected) ? responses[14].selected : [];
              const other = String(responses[14]?.other || "").trim();
              topFeatures = [...coreFeatures, ...dayOneNeeds, ...integrations, ...(other ? [other] : [])]
                .filter((f: any) => f && f !== "None of these")
                .filter((f: any, i: number, arr: any[]) => arr.indexOf(f) === i);
            } catch (e) {
              console.error("Failed to parse assessment responses:", e);
            }

            const webhookPayload = {
              email: data.email,
              name: data.name || submission.name,
              dev_role: data.devRole || "",
              project_type: data.projectType || "",
              timeline: data.timeline || "",
              budget_range: data.budgetRange || "",
              top_features: topFeatures,
              route: data.route,
              complexity: data.complexity,
              event_type: "paid",
              stripe_session_id: session.id,
              product_type: submission.productType,
              timestamp: new Date().toISOString(),
            };

            const webhookResponse = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(webhookPayload),
            });

            if (webhookResponse.ok) {
              console.log(`[Stripe] Webhook sent to Beehiiv for ${submission.email}`);
            } else {
              console.error(`[Stripe] Webhook failed: ${webhookResponse.statusText}`);
            }
          }
        } catch (webhookError) {
          console.error("[Stripe] Webhook delivery error:", webhookError);
        }
      }

      return {
        success: true,
        message: `Payment confirmed for session ${session.id}. Email sent: ${emailSent}`,
      };
    } else {
      console.warn(`[Stripe] No intake submission found for session ${session.id}`);
      return {
        success: false,
        message: `No intake submission found for session ${session.id}`,
      };
    }
  } catch (error) {
    console.error("Failed to handle checkout session completed:", error);
    throw error;
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Find the intake submission by stripe session ID (from charge metadata)
    const sessionId = charge.metadata?.sessionId;
    if (!sessionId) {
      console.warn("[Stripe] Refund received but no session ID in metadata");
      return {
        success: false,
        message: "No session ID found in refund metadata",
      };
    }

    // Find the submission to get customer email
    const submissions = await db
      .select()
      .from(intakeSubmissions)
      .where(eq(intakeSubmissions.stripeSessionId, sessionId));

    // Update payment status to failed/refunded
    await db
      .update(intakeSubmissions)
      .set({ paymentStatus: "failed" })
      .where(eq(intakeSubmissions.stripeSessionId, sessionId));

    // Optionally send refund notification email
    if (submissions.length > 0) {
      const submission = submissions[0];
      console.log(`[Stripe] Refund processed for session ${sessionId}. Customer: ${submission.email}`);
    }

    console.log(`[Stripe] Refund processed for session ${sessionId}`);
    return {
      success: true,
      message: `Refund processed for session ${sessionId}`,
    };
  } catch (error) {
    console.error("Failed to handle charge refunded:", error);
    throw error;
  }
}

/**
 * Helper function to get product amount in dollars
 */
function getProductAmount(productType: string): number {
  const amounts: Record<string, number> = {
    "nocode-matches": 497,
    "fullstack-waitlist": 0,
    "mobile-waitlist": 0,
  };
  return amounts[productType] || 0;
}
