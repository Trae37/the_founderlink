export type FrontendComplexity = "simple" | "standard" | "complex";
export type BackendComplexity = "low" | "medium" | "high";

export function toBackendComplexity(frontend: FrontendComplexity): BackendComplexity {
  const map: Record<FrontendComplexity, BackendComplexity> = {
    simple: "low",
    standard: "medium",
    complex: "high",
  };
  return map[frontend] || "medium";
}

export function toFrontendComplexity(backend: BackendComplexity): FrontendComplexity {
  const map: Record<BackendComplexity, FrontendComplexity> = {
    low: "simple",
    medium: "standard",
    high: "complex",
  };
  return map[backend] || "standard";
}
