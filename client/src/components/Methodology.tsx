import { Info, Clock, DollarSign, Users, Code } from "lucide-react";
import { useState } from "react";

interface MethodologyProps {
  route: string;
  complexity: string;
  featureCount?: number;
  complexityAnalysis?: {
    reasoning: string;
    enrichedDescription: string;
    detectedFeatures: string[];
    technicalRequirements: string[];
  };
}

export default function Methodology({ route, complexity, featureCount = 0, complexityAnalysis }: MethodologyProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRouteDescription = () => {
    switch (route) {
      case "no-code":
        return "No-code platforms (Bubble, Webflow, etc.) allow 60% faster development compared to custom code, but with some flexibility trade-offs.";
      case "hybrid":
        return "Hybrid approach combines no-code tools with custom code, offering 30% faster development while maintaining flexibility for custom features.";
      case "custom":
        return "Full custom development provides maximum flexibility and scalability, though it requires more time for architecture and implementation.";
      default:
        return "";
    }
  };

  const getComplexityDescription = () => {
    switch (complexity) {
      case "low":
        return "Simple projects with basic features, straightforward data models, and minimal integrations.";
      case "medium":
        return "Standard SaaS features including auth, payments, dashboards, and moderate third-party integrations.";
      case "high":
        return "Complex systems with advanced features, real-time capabilities, sophisticated business logic, and multiple integrations.";
      default:
        return "";
    }
  };

  return (
    <div className="mb-12 bg-white border border-neutral-300 rounded-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-neutral-600" />
          <h3 className="text-lg font-medium text-neutral-900">How We Calculate These Estimates</h3>
        </div>
        <svg
          className={`w-5 h-5 text-neutral-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-neutral-200">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Route Factor */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-amber-600" />
                  <h4 className="font-medium text-neutral-900">Development Approach</h4>
                </div>
                <p className="text-sm text-neutral-700 mb-2">
                  <span className="font-medium capitalize">{route}</span> route
                </p>
                <p className="text-sm text-neutral-600">{getRouteDescription()}</p>
              </div>

              {/* Complexity Factor */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <h4 className="font-medium text-neutral-900">Project Complexity</h4>
                </div>
                <p className="text-sm text-neutral-700 mb-2">
                  <span className="font-medium capitalize">{complexity}</span> complexity
                </p>
                {complexityAnalysis ? (
                  <>
                    <p className="text-sm text-neutral-600 mb-3">{complexityAnalysis.reasoning}</p>
                    {complexityAnalysis.technicalRequirements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-neutral-700 mb-1">Identified Requirements:</p>
                        <ul className="text-xs text-neutral-600 space-y-0.5 ml-4">
                          {complexityAnalysis.technicalRequirements.slice(0, 4).map((req, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-amber-600 mt-0.5">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-neutral-600">{getComplexityDescription()}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Time Estimation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h4 className="font-medium text-neutral-900">Timeline Calculation</h4>
                </div>
                <p className="text-sm text-neutral-600 mb-3">
                  We calculate development time based on:
                </p>
                <ul className="text-sm text-neutral-600 space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Industry benchmarks for each feature type</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Project setup, testing, and deployment overhead</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Developer experience level and AI tool usage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Team coordination and communication time</span>
                  </li>
                </ul>
              </div>

              {/* Cost Calculation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <h4 className="font-medium text-neutral-900">Cost Calculation</h4>
                </div>
                <p className="text-sm text-neutral-600 mb-3">
                  Total project cost reflects:
                </p>
                <ul className="text-sm text-neutral-600 space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>US-based senior developer market rates (2025)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>AI-augmented efficiency gains (25-30% faster)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Experience level impact on execution speed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Team composition and coordination overhead</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 italic">
              <strong>Note:</strong> These estimates assume quality-focused US-based developers using modern AI tools. 
              Actual costs may vary based on specific requirements, developer availability, and project scope changes. 
              We focus on realistic outcomes rather than the lowest possible price.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
