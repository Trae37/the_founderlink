import path from "path";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { assessmentResponses } from "../../drizzle/schema";
import { PRDGenerator } from "./prd-generator";
import { DocumentExporter } from "./document-exporter";
import { sendBlueprintEmail } from "./blueprint-email";
import { RecommendationEngine } from "./recommendation-engine";

export type BlueprintFormat = "docx" | "md";

export async function generateAndSendBlueprintFromStripeSession(input: {
  stripeSessionId: string;
  blueprintFormat: BlueprintFormat;
}): Promise<{ ok: boolean; message: string }>
{
  const db = await getDb();
  if (!db) {
    return { ok: false, message: "Database not available" };
  }

  const [response] = await db
    .select()
    .from(assessmentResponses)
    .where(eq(assessmentResponses.stripeSessionId, input.stripeSessionId))
    .limit(1);

  if (!response) {
    return { ok: false, message: `No assessmentResponses found for stripeSessionId ${input.stripeSessionId}` };
  }

  if (response.webhookSent === 1 && response.eventType === "paid") {
    return { ok: true, message: "Blueprint already delivered (idempotent webhook handling)" };
  }

  const parsedResponses = JSON.parse(response.responses) as Record<string, string | string[] | number>;

  const prdGenerator = new PRDGenerator();
  const prdData = prdGenerator.extractPRDData(
    parsedResponses as Record<string, string | string[]>,
    response.name || "",
    response.route
  );

  const engine = new RecommendationEngine();
  const rec = await engine.generateRecommendations(parsedResponses as any, response.route);

  // Generate basic templates first
  const basicClarityBrief = prdGenerator.generateProjectClarityBrief(prdData, {
    techStackSuggestion: rec.stackDescription,
    routeReasoning: rec.routeReasoning || rec.reasoning,
  });
  const basicHiringPlaybook = prdGenerator.generateHiringPlaybook(prdData, {
    developerType: rec.developerType,
    techStackSuggestion: rec.stackDescription,
  });
  const basicPrd = prdGenerator.generatePRDDocument(prdData, {
    techStackSuggestion: rec.stackDescription,
  });
  const basicWorkingAgreement = prdGenerator.generateWorkingAgreement(prdData);

  // Enhance all 4 documents with AI for paid users (all parallel with Haiku)
  console.log("[Blueprint] Enhancing documents with AI (4 parallel Haiku calls)...");

  const [clarityBrief, hiringPlaybook, prd, workingAgreement] = await Promise.all([
    prdGenerator.enhanceClarityBrief(basicClarityBrief, parsedResponses),
    prdGenerator.enhanceHiringPlaybook(basicHiringPlaybook, parsedResponses),
    prdGenerator.enhancePRD(basicPrd, parsedResponses),
    prdGenerator.enhanceWorkingAgreement(basicWorkingAgreement, parsedResponses),
  ]);

  console.log("[Blueprint] AI enhancement complete (all 4 docs)");

  const outputDir = path.join("/tmp", "generated-documents", response.email, input.stripeSessionId);
  const baseFilename = prdData.productName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-_]/g, "");

  // Force markdown for now (faster than DOCX, fits in timeout)
  const exporter = new DocumentExporter();
  const exported = await exporter.exportDocumentSet(
    [
      { slug: "clarity-brief", title: "PROJECT CLARITY BRIEF", body: clarityBrief },
      { slug: "hiring-playbook", title: "HIRING PLAYBOOK", body: hiringPlaybook },
      { slug: "prd", title: "PRODUCT REQUIREMENTS DOCUMENT (PRD)", body: prd },
      { slug: "working-agreement", title: "WORKING AGREEMENT", body: workingAgreement },
    ],
    baseFilename,
    outputDir,
    "md" // Force markdown for speed - add docx/pdf later
  );

  const emailSent = await sendBlueprintEmail({
    email: response.email,
    name: response.name || "",
    route: response.route,
    format: "md", // Force markdown for speed
    files: {
      clarityBrief: exported["clarity-brief"],
      hiringPlaybook: exported["hiring-playbook"],
      prd: exported["prd"],
      workingAgreement: exported["working-agreement"],
    },
    recommendations: {
      stack: rec.stackDescription,
      devType: rec.developerType,
      reasoning: rec.reasoning,
    },
    calendlyUrl: process.env.CALENDLY_URL || "https://calendly.com/thefounderlink",
  });

  if (!emailSent) {
    return { ok: false, message: "Blueprint email failed to send" };
  }

  try {
    await db
      .update(assessmentResponses)
      .set({ webhookSent: 1, eventType: "paid" })
      .where(eq(assessmentResponses.id, response.id));
  } catch (e) {
    console.error("[Blueprint] Failed to update delivery tracking:", e);
  }

  return { ok: true, message: "Blueprint generated and sent" };
}
