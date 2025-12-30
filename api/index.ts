import app from "../server/_core/index";

import type { IncomingMessage, ServerResponse } from "http";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}
