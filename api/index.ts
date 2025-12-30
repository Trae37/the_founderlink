// @ts-nocheck
import type { IncomingMessage, ServerResponse } from "http";

const appModulePromise =
  process.env.VERCEL === "1"
    ? import("../dist/index.js")
    : import("../server/_core/index");

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const { default: app } = await appModulePromise;
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => unknown)(req, res);
}
