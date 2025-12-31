import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { PRDGenerator } from "../services/prd-generator";
import { DocumentExporter } from "../services/document-exporter";
import { sendSnapshotEmail } from "../services/snapshot-email";
import { sendBlueprintEmail } from "../services/blueprint-email";
import { RecommendationEngine } from "../services/recommendation-engine";
import { getDb } from "../db";
import { assessmentResponses } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

const prdGenerator = new PRDGenerator();
const documentExporter = new DocumentExporter();
const recommendationEngine = new RecommendationEngine();

export const documentsRouter = router({
  getBlueprintDownloads: publicProcedure
    .input(
      z.object({
        stripeSessionId: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database connection failed" });
      }

      const [response] = await db
        .select({
          email: assessmentResponses.email,
          webhookSent: assessmentResponses.webhookSent,
          eventType: assessmentResponses.eventType,
        })
        .from(assessmentResponses)
        .where(eq(assessmentResponses.stripeSessionId, input.stripeSessionId))
        .limit(1);

      if (!response) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }

      const outputDir = path.join("/tmp", "generated-documents", response.email, input.stripeSessionId);
      let files: string[] | null = null;
      try {
        files = await fs.readdir(outputDir);
      } catch {
        files = null;
      }

      const paid = response.webhookSent === 1 && response.eventType === "paid";
      if (!paid) {
        return {
          status: "processing" as const,
          message: "Payment is still processing. Your documents will be available here shortly.",
        };
      }

      if (!files || files.length === 0) {
        return {
          status: "processing" as const,
          message: "We’re generating your documents. Refresh this page in a moment.",
        };
      }

      const slugs = ["clarity-brief", "hiring-playbook", "prd", "working-agreement"] as const;
      const findFilename = (slug: (typeof slugs)[number]) =>
        files!.find((f) => f.endsWith(`-${slug}.docx`) || f.endsWith(`-${slug}.md`)) || null;

      const found = slugs.map((slug) => ({ slug, filename: findFilename(slug) }));
      if (found.some((x) => !x.filename)) {
        return {
          status: "processing" as const,
          message: "Your documents are almost ready. Refresh in a moment.",
        };
      }

      const format = found.some((x) => x.filename!.endsWith(".docx")) ? ("docx" as const) : ("md" as const);

      return {
        status: "ready" as const,
        format,
        documents: found.map((x) => ({
          slug: x.slug,
          downloadUrl: `/api/blueprint/${encodeURIComponent(input.stripeSessionId)}/download/${encodeURIComponent(x.slug)}`,
        })),
      };
    }),

  /**
   * Generate basic PRD/SOW preview (no enhanced version)
   */
  generatePreview: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        route: z.string(),
        responses: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(async ({ input }) => {
      const prdData = prdGenerator.extractPRDData(input.responses, input.name, input.route);

      const brief = prdGenerator.generateProjectClarityBrief(prdData);

      // Return first ~60% as preview
      const clarityBriefPreview = brief
        .split("\n")
        .slice(0, Math.floor(brief.split("\n").length * 0.6))
        .join("\n");

      // Get AI recommendations for email
      const rec = await recommendationEngine.generateRecommendations(input.responses, input.route as any);
      const recommendations = {
        stack: rec.stackDescription,
        devType: rec.developerType,
        reasoning: rec.reasoning,
      };

      // Send email with preview documents
      const emailSent = await sendSnapshotEmail({
        email: input.email,
        name: input.name,
        route: input.route,
        clarityBrief: brief,
        recommendations,
      });

      console.log(`[Documents] Preview email sent to ${input.email}:`, emailSent);

      return {
        clarityBriefPreview,
        message: "Upgrade to $149 to unlock all 4 documents (Clarity Brief, Hiring Playbook, PRD, Working Agreement)",
        emailSent,
      };
    }),

  /**
   * Generate enhanced PRD/SOW with AI (for paid users)
   * This should be called after payment is confirmed
   */
  generateEnhanced: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        route: z.string(),
        stripeSessionId: z.string(),
        blueprintFormat: z.enum(["docx", "md"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Fetch assessment responses from database
      const db = await getDb();
      if (!db) {
        throw new Error("Database connection failed");
      }

      const [response] = await db
        .select()
        .from(assessmentResponses)
        .where(eq(assessmentResponses.stripeSessionId, input.stripeSessionId))
        .limit(1);

      if (!response) {
        throw new Error("Assessment responses not found");
      }

      const responses = JSON.parse(response.responses) as Record<string, string | string[] | number>;
      const prdData = prdGenerator.extractPRDData(responses as any, response.name || "", response.route);

      const rec = await recommendationEngine.generateRecommendations(responses as any, response.route);

      const clarityBrief = prdGenerator.generateProjectClarityBrief(prdData, {
        techStackSuggestion: rec.stackDescription,
        routeReasoning: rec.routeReasoning || rec.reasoning,
      });
      const hiringPlaybook = prdGenerator.generateHiringPlaybook(prdData, {
        developerType: rec.developerType,
        techStackSuggestion: rec.stackDescription,
      });
      const prd = prdGenerator.generatePRDDocument(prdData, {
        techStackSuggestion: rec.stackDescription,
      });
      const workingAgreement = prdGenerator.generateWorkingAgreement(prdData);

      const outputDir = path.join("/tmp", "generated-documents", response.email, input.stripeSessionId);
      const baseFilename = prdData.productName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-_]/g, "");

      const format = input.blueprintFormat || "docx";

      const exported = await documentExporter.exportDocumentSet(
        [
          { slug: "clarity-brief", title: "PROJECT CLARITY BRIEF", body: clarityBrief },
          { slug: "hiring-playbook", title: "HIRING PLAYBOOK", body: hiringPlaybook },
          { slug: "prd", title: "PRODUCT REQUIREMENTS DOCUMENT (PRD)", body: prd },
          { slug: "working-agreement", title: "WORKING AGREEMENT", body: workingAgreement },
        ],
        baseFilename,
        outputDir,
        format
      );
      const recommendations = {
        stack: rec.stackDescription,
        devType: rec.developerType,
        reasoning: rec.reasoning,
      };

      // Get Calendly URL from environment
      const calendlyUrl = process.env.CALENDLY_URL || 'https://calendly.com/thefounderlink';

      // Send email with full documents
      const emailSent = await sendBlueprintEmail({
        email: response.email,
        name: response.name || "",
        route: response.route,
        format,
        files: {
          clarityBrief: exported["clarity-brief"],
          hiringPlaybook: exported["hiring-playbook"],
          prd: exported["prd"],
          workingAgreement: exported["working-agreement"],
        },
        recommendations,
        calendlyUrl,
      });

      console.log(`[Documents] Blueprint email sent to ${input.email}:`, emailSent);

      // TODO: Store file paths in database

      return {
        prd,
        files: exported,
        emailSent,
        message: "Your 4 documents were generated successfully. Check your email for attachments.",
      };
    }),
});
