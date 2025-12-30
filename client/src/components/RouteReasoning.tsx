import { Lightbulb } from "lucide-react";

interface RouteReasoningProps {
  route: "no-code" | "hybrid" | "custom";
  reasoning: string;
  aiAnalysis?: string;
}

export default function RouteReasoning({ route, reasoning, aiAnalysis }: RouteReasoningProps) {
  const routeLabels: Record<string, string> = {
    "no-code": "No-Code Route",
    hybrid: "Hybrid Route",
    custom: "Custom Development Route",
  };

  const routeColors: Record<string, string> = {
    "no-code": "bg-emerald-50 border-emerald-300",
    hybrid: "bg-amber-50 border-amber-300",
    custom: "bg-purple-50 border-purple-300",
  };

  return (
    <div className={`mb-8 border-2 rounded-sm p-6 ${routeColors[route]}`}>
      <div className="flex items-start gap-3 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-1">
            Why We Recommend the {routeLabels[route]}
          </h3>
          <p className="text-sm text-neutral-700">{reasoning}</p>
        </div>
      </div>

      {aiAnalysis && (
        <div className="mt-4 pt-4 border-t border-neutral-300">
          <h4 className="text-sm font-semibold text-neutral-800 mb-2">Based on Your Responses:</h4>
          <p className="text-sm text-neutral-700 leading-relaxed">{aiAnalysis}</p>
        </div>
      )}
    </div>
  );
}
