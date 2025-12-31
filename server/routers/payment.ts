import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import Stripe from "stripe";
import { getDb } from "../db";
import { assessmentResponses } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";

let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (process.env.NODE_ENV !== "production" && key.startsWith("sk_live_")) {
    throw new Error(
      "Refusing to use a live Stripe key in development. Set STRIPE_SECRET_KEY to an sk_test_... key (and make sure you do not have STRIPE_SECRET_KEY set in Windows Environment Variables)."
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export const paymentRouter = router({
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        productType: z.enum(["nocode-matches", "prd-sow-tripwire", "fullstack-waitlist", "mobile-waitlist"]),
        blueprintFormat: z.enum(["docx", "md"]).optional(),
        assessmentEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const stripe = getStripeClient();
        const origin = ctx.req.headers.origin || "https://thefounderlink.com";
        let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
        let successUrl = "";
        let cancelUrl = "";

        if (input.productType === "nocode-matches") {
          lineItems = [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "3 Vetted No-Code Developer Matches",
                  description:
                    "3 hand-picked no-code developers matched to your scope, budget, and timeline. Includes interview scripts, test tasks, and 30-day replacement guarantee.",
                },
                unit_amount: 49700, // $497 in cents
              },
              quantity: 1,
            },
          ];
          successUrl = `${origin}/success?product=nocode`;
          cancelUrl = `${origin}/payment-cancel`;
        } else if (input.productType === "prd-sow-tripwire") {
          lineItems = [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Full Hiring Blueprint (4 Documents)",
                  description:
                    "Four tailored documents generated from your assessment: Project Clarity Brief, Hiring Playbook, PRD, and Working Agreement.",
                },
                unit_amount: 14900, // $149 in cents
              },
              quantity: 1,
            },
          ];
          successUrl = `${origin}/success?product=prd-sow&session_id={CHECKOUT_SESSION_ID}`;
          cancelUrl = `${origin}/payment-cancel`;
        } else if (input.productType === "fullstack-waitlist") {
          lineItems = [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Full-Stack Priority Waitlist",
                  description: "Join the waitlist for full-stack and agency developer matching.",
                },
                unit_amount: 0,
              },
              quantity: 1,
            },
          ];
          successUrl = `${origin}/success?product=fullstack`;
          cancelUrl = `${origin}/payment-cancel`;
        } else if (input.productType === "mobile-waitlist") {
          lineItems = [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Mobile Dev Priority Waitlist",
                  description: "Join the waitlist for mobile developer matching.",
                },
                unit_amount: 0,
              },
              quantity: 1,
            },
          ];
          successUrl = `${origin}/success?product=mobile`;
          cancelUrl = `${origin}/payment-cancel`;
        }

        const metadata: Record<string, string> = {
          product_type: input.productType,
        };

        if (input.productType === "prd-sow-tripwire") {
          if (input.blueprintFormat) {
            metadata.blueprint_format = input.blueprintFormat;
          }
          if (input.assessmentEmail) {
            metadata.assessment_email = input.assessmentEmail;
          }
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer_email: ctx.user?.email || input.assessmentEmail || undefined,
          metadata,
          allow_promotion_codes: true,
        });

        if (input.productType === "prd-sow-tripwire" && input.assessmentEmail) {
          try {
            const db = await getDb();
            if (db) {
              const latest = await db
                .select({ id: assessmentResponses.id })
                .from(assessmentResponses)
                .where(eq(assessmentResponses.email, input.assessmentEmail))
                .orderBy(desc(assessmentResponses.completedAt))
                .limit(1);

              if (latest.length > 0) {
                await db
                  .update(assessmentResponses)
                  .set({ stripeSessionId: session.id })
                  .where(eq(assessmentResponses.id, latest[0].id));
              }
            }
          } catch (dbError) {
            console.warn(
              "[Checkout] Created Stripe session but failed to persist stripeSessionId (database unavailable):",
              dbError
            );
          }
        }

        return {
          checkoutUrl: session.url || "",
          sessionId: session.id,
        };
      } catch (error: any) {
        console.error("Stripe checkout error:", error?.message || error);
        console.error("Stripe error details:", JSON.stringify(error, null, 2));
        throw new Error(`Failed to create checkout session: ${error?.message || "Unknown error"}`);
      }
    }),
});
