import { Clock } from "lucide-react";
import type { TeamOption } from "@/../../shared/cost-estimator";

interface TimelineComparisonProps {
  teamOptions: TeamOption[];
}

export default function TimelineComparison({ teamOptions }: TimelineComparisonProps) {
  // Find the fastest and slowest timelines for scaling
  const allTimelines = teamOptions.flatMap(opt => [opt.timeline.min, opt.timeline.max]);
  const maxWeeks = Math.max(...allTimelines);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 rounded-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-neutral-700" />
        <h3 className="text-lg font-medium text-neutral-900">Timeline Comparison</h3>
      </div>
      <p className="text-sm text-neutral-600 mb-6">
        How team size affects delivery speed and cost
      </p>

      <div className="space-y-4">
        {teamOptions.map((option, index) => {
          const avgWeeks = (option.timeline.min + option.timeline.max) / 2;
          const barWidth = (avgWeeks / maxWeeks) * 100;
          const isFastest = index === 0;
          const isSlowest = index === teamOptions.length - 1;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">{option.name}</span>
                  {isFastest && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-sm">
                      Fastest
                    </span>
                  )}
                  {isSlowest && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-sm">
                      Slowest
                    </span>
                  )}
                </div>
                <span className="text-neutral-600">
                  {option.timeline.min}-{option.timeline.max} weeks
                </span>
              </div>

              {/* Timeline bar */}
              <div className="relative h-8 bg-white rounded-sm border border-neutral-200 overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                    isFastest
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                      : isSlowest
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-gradient-to-r from-blue-400 to-blue-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <span className="text-xs font-medium text-white drop-shadow">
                      {Math.round(avgWeeks)}w avg
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost info */}
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{option.members.map(m => `${m.count} ${m.role}`).join(", ")}</span>
                <span className="font-medium">
                  {formatCurrency(option.totalCost.min)}-{formatCurrency(option.totalCost.max)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-300">
        <p className="text-xs text-neutral-600">
          <strong>Trade-off:</strong> Larger teams deliver faster but cost more. Smaller teams are more budget-friendly but take longer.
        </p>
      </div>
    </div>
  );
}
