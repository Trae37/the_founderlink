import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { developers, matchAssignments, intakeSubmissions } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";

export const matchesRouter = router({
  // Create a new developer profile
  createDeveloper: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        title: z.string().min(2, "Title must be at least 2 characters"),
        specialization: z.enum(["nocode", "fullstack", "mobile"]),
        bio: z.string().optional(),
        portfolioUrl: z.string().url().optional(),
        hourlyRate: z.number().positive().optional(),
        yearsExperience: z.number().nonnegative().optional(),
        skills: z.string().optional(), // JSON array as string
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(developers).values({
          name: input.name,
          title: input.title,
          specialization: input.specialization,
          bio: input.bio || null,
          portfolioUrl: input.portfolioUrl || null,
          hourlyRate: input.hourlyRate || null,
          yearsExperience: input.yearsExperience || null,
          skills: input.skills || null,
          verified: 0,
        });

        return {
          success: true,
          developerId: Number((result as any).insertId),
          message: "Developer profile created successfully",
        };
      } catch (error) {
        console.error("Failed to create developer:", error);
        throw new Error("Failed to create developer profile");
      }
    }),

  // Get all developers
  getDevelopers: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allDevelopers = await db.select().from(developers);
      return allDevelopers;
    } catch (error) {
      console.error("Failed to fetch developers:", error);
      throw new Error("Failed to fetch developers");
    }
  }),

  // Get developers by specialization
  getDevelopersBySpecialization: publicProcedure
    .input(z.object({ specialization: z.enum(["nocode", "fullstack", "mobile"]) }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const devs = await db
          .select()
          .from(developers)
          .where(eq(developers.specialization, input.specialization));

        return devs;
      } catch (error) {
        console.error("Failed to fetch developers:", error);
        throw new Error("Failed to fetch developers");
      }
    }),

  // Assign developers to an intake submission
  assignMatches: publicProcedure
    .input(
      z.object({
        intakeSubmissionId: z.number(),
        developerIds: z.array(z.number()).min(1, "At least one developer must be assigned"),
        matchReasons: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Verify intake submission exists
        const submission = await db
          .select()
          .from(intakeSubmissions)
          .where(eq(intakeSubmissions.id, input.intakeSubmissionId))
          .limit(1);

        if (!submission || submission.length === 0) {
          throw new Error("Intake submission not found");
        }

        // Create match assignments
        const assignments = input.developerIds.map((devId, index) => ({
          intakeSubmissionId: input.intakeSubmissionId,
          developerId: devId,
          matchReason: input.matchReasons?.[index] || null,
          status: "assigned" as const,
        }));

        const result = await db.insert(matchAssignments).values(assignments);

        return {
          success: true,
          matchCount: input.developerIds.length,
          message: `${input.developerIds.length} matches assigned successfully`,
        };
      } catch (error) {
        console.error("Failed to assign matches:", error);
        throw new Error("Failed to assign matches");
      }
    }),

  // Get matches for an intake submission
  getMatchesForSubmission: publicProcedure
    .input(z.object({ intakeSubmissionId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const matches = await db
          .select({
            match: matchAssignments,
            developer: developers,
          })
          .from(matchAssignments)
          .innerJoin(developers, eq(matchAssignments.developerId, developers.id))
          .where(eq(matchAssignments.intakeSubmissionId, input.intakeSubmissionId));

        return matches;
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        throw new Error("Failed to fetch matches");
      }
    }),

  // Update match status
  updateMatchStatus: publicProcedure
    .input(
      z.object({
        matchId: z.number(),
        status: z.enum(["assigned", "sent", "viewed", "contacted"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const updateData: any = { status: input.status };
        if (input.status === "sent") {
          updateData.sentAt = new Date();
        }

        await db
          .update(matchAssignments)
          .set(updateData)
          .where(eq(matchAssignments.id, input.matchId));

        return { success: true, message: "Match status updated" };
      } catch (error) {
        console.error("Failed to update match status:", error);
        throw new Error("Failed to update match status");
      }
    }),

  // Delete a match assignment
  deleteMatch: publicProcedure
    .input(z.object({ matchId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(matchAssignments).where(eq(matchAssignments.id, input.matchId));

        return { success: true, message: "Match deleted successfully" };
      } catch (error) {
        console.error("Failed to delete match:", error);
        throw new Error("Failed to delete match");
      }
    }),
});
