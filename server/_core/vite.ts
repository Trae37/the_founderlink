import type { Express } from "express";
import type { Server } from "http";
import type { ViteDevServer } from "vite";

export async function setupVite(app: Express, server: Server): Promise<ViteDevServer> {
  const { createServer: createViteServer } = await import("vite");

  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "spa",
  });

  app.use(vite.middlewares);

  // Fallback to index.html for SPA routing
  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const template = await vite.transformIndexHtml(
        url,
        await import("fs").then((fs) =>
          fs.promises.readFile("index.html", "utf-8")
        )
      );
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return vite;
}
