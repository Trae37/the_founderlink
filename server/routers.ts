import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { assessmentRouter } from "./routers/assessment";
import { paymentRouter } from "./routers/payment";
import { intakeRouter } from "./routers/intake";
import { matchesRouter } from "./routers/matches";
import { webhookRouter } from "./routers/webhook";
import { documentsRouter } from "./routers/documents";
import { feedbackRouter } from "./routers/feedback";
import { mvpSuggestionsRouter } from "./routers/mvp-suggestions";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  assessment: assessmentRouter,
  payment: paymentRouter,
  intake: intakeRouter,
  matches: matchesRouter,
  webhook: webhookRouter,
  documents: documentsRouter,
  feedback: feedbackRouter,
  mvpSuggestions: mvpSuggestionsRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
