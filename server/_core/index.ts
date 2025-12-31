import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import JSZip from "jszip";
import path from "path";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { handleStripeWebhook } from "../webhooks/stripe";
import { getDb } from "../db";
import { assessmentResponses } from "../../drizzle/schema";

const app = express();
const server = createServer(app);

// Configure body parser with larger size limit for file uploads
// NOTE: Stripe webhook needs raw body, so it must be registered BEFORE express.json()
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"] as string;
  try {
    const result = await handleStripeWebhook(req.body as Buffer, signature);
    res.json(result);
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: "Webhook processing failed" });
  }
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// OAuth callback under /api/oauth/callback
registerOAuthRoutes(app);
// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/blueprint/:stripeSessionId/download/:slug", async (req, res) => {
  const stripeSessionId = String(req.params.stripeSessionId || "");
  const slug = String(req.params.slug || "");

  const allowedSlugs = ["clarity-brief", "hiring-playbook", "prd", "working-agreement"] as const;
  if (!allowedSlugs.includes(slug as (typeof allowedSlugs)[number])) {
    res.status(400).json({ error: "Invalid document type" });
    return;
  }

  const db = await getDb();
  if (!db) {
    res.status(503).json({ error: "Database not available" });
    return;
  }

  const [response] = await db
    .select({
      email: assessmentResponses.email,
      webhookSent: assessmentResponses.webhookSent,
      eventType: assessmentResponses.eventType,
    })
    .from(assessmentResponses)
    .where(eq(assessmentResponses.stripeSessionId, stripeSessionId))
    .limit(1);

  if (!response) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const paid = response.webhookSent === 1 && response.eventType === "paid";
  if (!paid) {
    res.status(409).json({ error: "Documents are not ready yet" });
    return;
  }

  const outputDir = path.join(process.cwd(), "generated-documents", response.email, stripeSessionId);
  let files: string[];
  try {
    files = await fs.readdir(outputDir);
  } catch {
    res.status(404).json({ error: "Documents not found" });
    return;
  }

  const filename = files.find((f) => f.endsWith(`-${slug}.docx`) || f.endsWith(`-${slug}.md`)) || null;
  if (!filename) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  const filePath = path.join(outputDir, filename);
  const ext = filename.endsWith(".docx") ? "docx" : "md";
  const downloadNameBySlug: Record<string, string> = {
    "clarity-brief": "Project-Clarity-Brief",
    "hiring-playbook": "Hiring-Playbook",
    prd: "PRD",
    "working-agreement": "Working-Agreement",
  };

  res.download(filePath, `${downloadNameBySlug[slug] || slug}.${ext}`);
});

app.get("/api/blueprint/:stripeSessionId/download.zip", async (req, res) => {
  const stripeSessionId = String(req.params.stripeSessionId || "");

  const db = await getDb();
  if (!db) {
    res.status(503).json({ error: "Database not available" });
    return;
  }

  const [response] = await db
    .select({
      email: assessmentResponses.email,
      webhookSent: assessmentResponses.webhookSent,
      eventType: assessmentResponses.eventType,
    })
    .from(assessmentResponses)
    .where(eq(assessmentResponses.stripeSessionId, stripeSessionId))
    .limit(1);

  if (!response) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const paid = response.webhookSent === 1 && response.eventType === "paid";
  if (!paid) {
    res.status(409).json({ error: "Documents are not ready yet" });
    return;
  }

  const outputDir = path.join(process.cwd(), "generated-documents", response.email, stripeSessionId);
  let files: string[];
  try {
    files = await fs.readdir(outputDir);
  } catch {
    res.status(404).json({ error: "Documents not found" });
    return;
  }

  const slugs = ["clarity-brief", "hiring-playbook", "prd", "working-agreement"] as const;
  const downloadNameBySlug: Record<string, string> = {
    "clarity-brief": "Project-Clarity-Brief",
    "hiring-playbook": "Hiring-Playbook",
    prd: "PRD",
    "working-agreement": "Working-Agreement",
  };

  const filenames = slugs.map((slug) => {
    const filename = files.find((f) => f.endsWith(`-${slug}.docx`) || f.endsWith(`-${slug}.md`)) || null;
    return { slug, filename };
  });

  if (filenames.some((x) => !x.filename)) {
    res.status(409).json({ error: "Documents are not ready yet" });
    return;
  }

  const zip = new JSZip();
  for (const item of filenames) {
    const filename = item.filename!;
    const filePath = path.join(outputDir, filename);
    const ext = filename.endsWith(".docx") ? "docx" : "md";
    const downloadName = `${downloadNameBySlug[item.slug] || item.slug}.${ext}`;
    const buf = await fs.readFile(filePath);
    zip.file(downloadName, buf);
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="Hiring-Blueprint-${stripeSessionId}.zip"`);
  res.send(zipBuffer);
});

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const { serveStatic, setupVite } = await import("./vite");
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Warn if Stripe webhook secret is not configured
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn(
      "[WARNING] STRIPE_WEBHOOK_SECRET not configured. Stripe webhooks will not be processed."
    );
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Stripe webhook endpoint: POST http://localhost:${port}/api/webhooks/stripe`);
  });
}

if (process.env.VERCEL !== "1") {
  startServer().catch(console.error);
}

export default app;
