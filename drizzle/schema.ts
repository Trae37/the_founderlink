import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Intake submissions table for storing post-purchase form data
 * Captures customer information after payment for developer matching
 */
export const intakeSubmissions = mysqlTable("intakeSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  context: text("context"),
  productType: mysqlEnum("productType", ["nocode-matches", "fullstack-waitlist", "mobile-waitlist"]).notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IntakeSubmission = typeof intakeSubmissions.$inferSelect;
export type InsertIntakeSubmission = typeof intakeSubmissions.$inferInsert;

/**
 * Developer profiles table for storing vetted developer information
 */
export const developers = mysqlTable("developers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  specialization: mysqlEnum("specialization", ["nocode", "fullstack", "mobile"]).notNull(),
  bio: text("bio"),
  portfolioUrl: varchar("portfolioUrl", { length: 500 }),
  hourlyRate: int("hourlyRate"),
  yearsExperience: int("yearsExperience"),
  skills: text("skills"), // JSON array stored as text
  verified: int("verified").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Developer = typeof developers.$inferSelect;
export type InsertDeveloper = typeof developers.$inferInsert;

/**
 * Match assignments table linking intake submissions to developers
 */
export const matchAssignments = mysqlTable("matchAssignments", {
  id: int("id").autoincrement().primaryKey(),
  intakeSubmissionId: int("intakeSubmissionId").notNull(),
  developerId: int("developerId").notNull(),
  matchReason: text("matchReason"), // Why this developer was matched
  sentAt: timestamp("sentAt"), // When match email was sent
  status: mysqlEnum("status", ["assigned", "sent", "viewed", "contacted"]).default("assigned").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatchAssignment = typeof matchAssignments.$inferSelect;
export type InsertMatchAssignment = typeof matchAssignments.$inferInsert;

/**
 * Assessment responses table for storing user assessment data
 * Captures all answers and derived results for webhook integration
 */
export const assessmentResponses = mysqlTable("assessmentResponses", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  // Assessment results
  route: mysqlEnum("route", ["no-code", "hybrid", "custom"]).notNull(),
  complexity: mysqlEnum("complexity", ["low", "medium", "high"]).notNull(),
  devRole: varchar("devRole", { length: 255 }), // e.g., "no-code-builder", "fullstack-developer"
  projectType: varchar("projectType", { length: 255 }), // e.g., "landing-page", "web-app"
  timeline: varchar("timeline", { length: 100 }), // e.g., "4-6-weeks"
  budgetRange: varchar("budgetRange", { length: 100 }), // e.g., "under-3000"
  topFeatures: text("topFeatures"), // JSON array stored as text
  // Raw responses (JSON)
  responses: text("responses").notNull(), // All question responses as JSON
  // Tracking
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  webhookSent: int("webhookSent").default(0).notNull(), // 0 = false, 1 = true
  eventType: mysqlEnum("eventType", ["paid", "free", "waitlist"]),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertAssessmentResponse = typeof assessmentResponses.$inferInsert;

/**
 * User feedback table for collecting and responding to user feedback
 */
export const userFeedback = mysqlTable("userFeedback", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  message: text("message").notNull(),
  category: mysqlEnum("category", ["bug", "feature", "question", "other"]).default("other").notNull(),
  status: mysqlEnum("status", ["new", "in-progress", "resolved", "closed"]).default("new").notNull(),
  adminResponse: text("adminResponse"),
  respondedAt: timestamp("respondedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = typeof userFeedback.$inferInsert;

/**
 * Document templates table for storing PRD and SOW templates
 */
export const documentTemplates = mysqlTable("documentTemplates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["prd", "sow"]).notNull(),
  route: mysqlEnum("route", ["no-code", "hybrid", "custom"]).notNull(),
  content: text("content").notNull(), // Template content with placeholders
  isActive: int("isActive").default(1).notNull(), // 0 = false, 1 = true
  version: int("version").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = typeof documentTemplates.$inferInsert;
/**
 * MVP Suggestions table for collecting "Other" product type responses
 * Helps identify new MVP types to add to the knowledge base
 */
export const mvpSuggestions = mysqlTable("mvpSuggestions", {
  id: int("id").autoincrement().primaryKey(),
  userDescription: text("userDescription").notNull(),
  problemDescription: text("problemDescription"),
  features: json("features").$type<string[]>(),
  selectedRoute: varchar("selectedRoute", { length: 50 }),
  complexity: varchar("complexity", { length: 20 }),
  budget: varchar("budget", { length: 50 }),
  timeline: varchar("timeline", { length: 50 }),
  estimatedCostMin: int("estimatedCostMin"),
  estimatedCostMax: int("estimatedCostMax"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MVPSuggestion = typeof mvpSuggestions.$inferSelect;
export type InsertMVPSuggestion = typeof mvpSuggestions.$inferInsert;

/**
 * Assessment progress table for saving in-progress assessments
 * Allows users to resume from any device or after clearing browser data
 */
export const assessmentProgress = mysqlTable("assessmentProgress", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(), // One progress record per email
  name: varchar("name", { length: 255 }),
  currentStep: int("currentStep").default(0).notNull(),
  responses: text("responses").notNull(), // JSON object of all responses
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentProgress = typeof assessmentProgress.$inferSelect;
export type InsertAssessmentProgress = typeof assessmentProgress.$inferInsert;
