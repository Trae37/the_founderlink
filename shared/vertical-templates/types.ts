import type { Route, Complexity } from "../cost-estimator";

export interface RouteGuidanceBlock {
  recommendation: string;
  reasoning: string;
  bestFor: string[];
  limitations: string[];
}

export interface VerticalResultsTemplate {
  vertical: string;
  routeGuidance: Record<Route, RouteGuidanceBlock>;
  typicalFeatures: string[];
  techStackSuggestions: Record<Route, string>;
  costRanges: Record<Complexity, { min: number; max: number }>;
  timelineWeeks: Record<Complexity, { min: number; max: number }>;
  criticalConsiderations: string[];
  commonMistakes: string[];
}
