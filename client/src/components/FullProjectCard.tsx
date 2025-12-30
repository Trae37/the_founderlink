import { useState } from "react";
import { ChevronDown, ChevronUp, Users, Clock, TrendingDown, TrendingUp } from "lucide-react";
import type { TeamOption } from "@/../../shared/cost-estimator";
import TimelineComparison from "@/components/TimelineComparison";

interface FullProjectCardProps {
  teamOptions: TeamOption[];
  userTimeline?: string;
}

export default function FullProjectCard({ teamOptions, userTimeline }: FullProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSavings = (currentCost: number, previousCost: number) => {
    const savings = previousCost - currentCost;
    const percentage = Math.round((savings / previousCost) * 100);
    return { amount: savings, percentage };
  };

  // Default to showing the first (most expensive) option
  const defaultOption = teamOptions[0];

  return (
    <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium text-neutral-900 tracking-tight">
          Full Project Options
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <span className="text-sm font-medium">
            {isExpanded ? "Hide" : "Show"} team options
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Default Option (collapsed view) */}
      {!isExpanded && (
        <div className="border border-neutral-300 rounded-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1">{defaultOption.name}</h3>
              <p className="text-sm text-neutral-600">{defaultOption.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-medium text-neutral-900">
                {formatCurrency(defaultOption.totalCost.min)} - {formatCurrency(defaultOption.totalCost.max)}
              </div>
              <div className="text-sm text-neutral-500 mt-1">
                {defaultOption.timeline.min}-{defaultOption.timeline.max} weeks
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{defaultOption.members.map(m => `${m.count} ${m.role}`).join(", ")}</span>
            </div>
          </div>
        </div>
      )}

      {/* All Options (expanded view) */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Timeline Comparison Visual */}
          <TimelineComparison teamOptions={teamOptions} />

          {/* Team Options List */}
          <div className="space-y-4">
          {teamOptions.map((option, index) => {
            const previousOption = index > 0 ? teamOptions[index - 1] : null;
            const savings = previousOption
              ? calculateSavings(option.totalCost.min, previousOption.totalCost.min)
              : null;

            return (
              <div
                key={index}
                className="border border-neutral-300 rounded-sm p-6 hover:border-neutral-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-neutral-900">{option.name}</h3>
                      {savings && savings.amount !== 0 && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-sm ${
                          savings.amount > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {savings.amount > 0 ? (
                            <>
                              <TrendingDown className="w-3 h-3" />
                              Save {formatCurrency(savings.amount)} ({savings.percentage}%)
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-3 h-3" />
                              +{formatCurrency(Math.abs(savings.amount))} ({Math.abs(savings.percentage)}%)
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{option.description}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{option.members.map(m => `${m.count} ${m.role}`).join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{option.timeline.min}-{option.timeline.max} weeks</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-2xl font-medium text-neutral-900">
                      {formatCurrency(option.totalCost.min)}
                    </div>
                    <div className="text-lg text-neutral-500">
                      {formatCurrency(option.totalCost.max)}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500">{option.tradeoff}</p>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <p className="text-sm text-neutral-600">
          💡 <strong>Tip:</strong> Cutting developers saves money but extends timeline. Choose based on your priority: speed or budget.
        </p>
      </div>
    </div>
  );
}
