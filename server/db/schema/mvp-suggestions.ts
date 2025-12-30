import { mysqlTable, int, text, varchar, json, timestamp } from "drizzle-orm/mysql-core";

/**
 * Collects user-provided product type descriptions when they select "Other"
 * Helps us identify new MVP types to add to the knowledge base
 */
export const mvpSuggestions = mysqlTable("mvp_suggestions", {
  id: int("id").primaryKey().autoincrement(),
  
  // User's product type description
  userDescription: text("user_description").notNull(),
  
  // Additional context from assessment
  problemDescription: text("problem_description"), // Q7
  features: json("features").$type<string[]>(), // Selected features
  
  // Project details
  selectedRoute: varchar("selected_route", { length: 50 }),
  complexity: varchar("complexity", { length: 20 }),
  budget: varchar("budget", { length: 50 }),
  timeline: varchar("timeline", { length: 50 }),
  
  // Cost estimate that was generated
  estimatedCostMin: int("estimated_cost_min"),
  estimatedCostMax: int("estimated_cost_max"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
});

export type MVPSuggestion = typeof mvpSuggestions.$inferSelect;
export type NewMVPSuggestion = typeof mvpSuggestions.$inferInsert;
