import { Check, TrendingDown, TrendingUp, Clock, DollarSign, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { TeamOption } from "@/../../shared/cost-estimator";

interface TeamComparisonProps {
  teamOptions: TeamOption[];
  userBudget?: string;
  userTimeline?: string;
}

export default function TeamComparison({ teamOptions, userBudget, userTimeline }: TeamComparisonProps) {
  const [isOpen, setIsOpen] = useState(true);
  if (!teamOptions || teamOptions.length === 0) return null;

  // Parse user budget to get max value
  const parseUserBudget = (budget: string): number => {
    const normalized = budget.replace(/\u2013|\u2014/g, "-");
    const match = normalized.match(/\$?([\d,]+)(?:K|k)?-?\$?([\d,]+)?(?:K|k)?/);
    if (!match) return 0;
    const max = match[2] || match[1];
    return parseInt(max.replace(/,/g, "")) * 1000;
  };

  // Parse user timeline to get max weeks
  const parseUserTimeline = (timeline: string): number => {
    const normalized = timeline.replace(/\u2013|\u2014/g, "-");
    const match = normalized.match(/(\d+)-?(\d+)?\s*weeks?/i);
    if (!match) return 0;
    return parseInt(match[2] || match[1]);
  };

  const userBudgetMax = userBudget ? parseUserBudget(userBudget) : 0;
  const userTimelineMax = userTimeline ? parseUserTimeline(userTimeline) : 0;

  // Determine which option is recommended (middle option, balanced)
  const recommendedIndex = Math.floor(teamOptions.length / 2);

  return (
    <div className="mb-6 bg-white border border-neutral-300 rounded-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <Users className="w-5 h-5 text-neutral-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-neutral-900 mb-1">Team Options</h3>
            <p className="text-sm text-neutral-600">
              Choose the team composition that best fits your budget and timeline
            </p>
          </div>
        </div>
        <div className="ml-4">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-neutral-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-600" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">

      <div className="grid md:grid-cols-3 gap-6">
        {teamOptions.map((option, index) => {
          const isRecommended = index === recommendedIndex;
          const isAffordable = userBudgetMax > 0 && option.totalCost.max <= userBudgetMax;
          const meetsTimeline = userTimelineMax > 0 && option.timeline.max <= userTimelineMax;

          return (
            <div
              key={option.name}
              className={`relative border rounded-sm p-6 transition-all ${
                isRecommended
                  ? "border-2 border-amber-400 bg-amber-50 shadow-lg"
                  : "border-neutral-300 bg-white hover:border-neutral-400 hover:shadow-md"
              }`}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-block px-3 py-1 bg-amber-400 text-neutral-900 text-xs font-semibold uppercase tracking-wide rounded-sm shadow-sm">
                    Recommended
                  </span>
                </div>
              )}

              {/* Team Name */}
              <h3 className="text-lg font-medium text-neutral-900 mb-4 mt-2">{option.name}</h3>

              {/* Team Members */}
              <div className="mb-4 space-y-2">
                {option.members.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-neutral-500" />
                    <span className="text-neutral-700">
                      {member.count}x {member.role}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost */}
              <div className="mb-3 pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-mono text-neutral-600 uppercase">Total Cost</span>
                </div>
                <div className="text-2xl font-semibold text-neutral-900">
                  ${option.totalCost.min.toLocaleString()}-${option.totalCost.max.toLocaleString()}
                </div>
                {userBudgetMax > 0 && (
                  <div className="mt-1">
                    {isAffordable ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-sm">
                        <Check className="w-3 h-3" />
                        Within budget
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-sm">
                        <TrendingUp className="w-3 h-3" />
                        ${(option.totalCost.min - userBudgetMax).toLocaleString()} over budget
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="mb-4 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-mono text-neutral-600 uppercase">Timeline</span>
                </div>
                <div className="text-lg font-medium text-neutral-900">
                  {option.timeline.min}-{option.timeline.max} weeks
                </div>
                {userTimelineMax > 0 && (
                  <div className="mt-1">
                    {meetsTimeline ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-sm">
                        <Check className="w-3 h-3" />
                        Meets timeline
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-sm">
                        <Clock className="w-3 h-3" />
                        {option.timeline.min - userTimelineMax}w longer
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-700 mb-2">{option.description}</p>
              <p className="text-xs text-neutral-600 italic">{option.tradeoff}</p>
            </div>
          );
        })}
      </div>
      </div>
      )}
    </div>
  );
}
