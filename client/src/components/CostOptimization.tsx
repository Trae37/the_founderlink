import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingDown, Lightbulb, Rocket, DollarSign, Clock, Users } from "lucide-react";
import type { CostOptimizationPlan } from "@/../../shared/cost-optimizer";

interface CostOptimizationProps {
  plan: CostOptimizationPlan;
}

export default function CostOptimization({ plan }: CostOptimizationProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const { budgetGap, timelineGap, teamSizeGap, recommendations, mvpApproach, alternativeTechStack } = plan;
  
  // Show if there's any significant gap
  const hasSignificantGap = 
    budgetGap.severity !== "none" || 
    timelineGap.severity !== "none" || 
    teamSizeGap.severity !== "none";
  
  if (!hasSignificantGap) {
    return null;
  }
  
  // Categorize recommendations
  const budgetRecs = recommendations.filter(r => r.category === "budget" || r.category === "scope");
  const timelineRecs = recommendations.filter(r => r.category === "timeline");
  const teamRecs = recommendations.filter(r => r.category === "team");
  
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-sm p-6 mb-8">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between gap-4 text-left group"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-medium text-neutral-900 tracking-tight">
              How to Make This Work
            </h3>
          </div>
          <div className="space-y-1 text-sm text-neutral-700">
            {budgetGap.isOverBudget && (
              <p>
                <strong>Budget:</strong> Your ${budgetGap.userBudgetMax.toLocaleString()} vs Realistic ${budgetGap.realisticBudgetMin.toLocaleString()}
                <span className="font-semibold text-amber-700"> (${budgetGap.gapAmount.toLocaleString()} gap)</span>
              </p>
            )}
            {timelineGap.isTooAggressive && (
              <p>
                <strong>Timeline:</strong> Your {timelineGap.userTimelineWeeks}w vs Realistic {timelineGap.realisticTimelineWeeks}w
                <span className="font-semibold text-amber-700"> ({timelineGap.gapWeeks}w short)</span>
              </p>
            )}
            {teamSizeGap.isTooSmall && (
              <p>
                <strong>Team:</strong> Your {Math.ceil(teamSizeGap.userTeamSize)} dev vs Recommended {Math.ceil(teamSizeGap.realisticTeamSize)} devs
                <span className="font-semibold text-amber-700"> ({Math.ceil(teamSizeGap.gapCount)} more needed)</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
          )}
        </div>
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Severity Message */}
          {(budgetGap.severity === "severe" || timelineGap.severity === "severe" || teamSizeGap.severity === "severe") && (
            <div className="bg-amber-100 border border-amber-300 rounded-sm p-4">
              <p className="text-sm text-neutral-800">
                <strong>Reality check:</strong> Your expectations are significantly different from typical projects of this scope. 
                The good news? You can still launch successfully by being strategic about your approach.
              </p>
            </div>
          )}
          
          {/* Budget Recommendations */}
          {budgetRecs.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-600" />
                Ways to Reduce Costs
              </h4>
              <div className="space-y-3">
                {budgetRecs.map((rec, index) => (
                  <div key={index} className="bg-white border border-neutral-200 rounded-sm p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h5 className="font-medium text-neutral-900 text-sm">{rec.title}</h5>
                      <span className="flex-shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-sm">
                        Save {rec.savings}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 mb-2">{rec.description}</p>
                    <p className="text-xs text-neutral-600 italic">{rec.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Timeline Recommendations */}
          {timelineRecs.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Timeline Adjustments
              </h4>
              <div className="space-y-3">
                {timelineRecs.map((rec, index) => (
                  <div key={index} className="bg-white border border-neutral-200 rounded-sm p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h5 className="font-medium text-neutral-900 text-sm">{rec.title}</h5>
                      <span className="flex-shrink-0 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-sm">
                        {rec.savings}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 mb-2">{rec.description}</p>
                    <p className="text-xs text-neutral-600 italic">{rec.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Team Size Recommendations */}
          {teamRecs.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Team Size Options
              </h4>
              <div className="space-y-3">
                {teamRecs.map((rec, index) => (
                  <div key={index} className="bg-white border border-neutral-200 rounded-sm p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h5 className="font-medium text-neutral-900 text-sm">{rec.title}</h5>
                      <span className="flex-shrink-0 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-sm">
                        {rec.savings}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 mb-2">{rec.description}</p>
                    <p className="text-xs text-neutral-600 italic">{rec.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* MVP Phasing */}
          {budgetGap.severity !== "none" && (
            <div>
              <h4 className="text-base font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-amber-600" />
                Recommended Launch Roadmap
              </h4>
              <div className="space-y-3">
                {/* Phase 1 */}
                <div className="bg-white border-2 border-emerald-300 rounded-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-sm uppercase tracking-wide">
                      Phase 1: MVP
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">{mvpApproach.phase1.cost}</span>
                  </div>
                  <p className="text-sm text-neutral-700 mb-2">{mvpApproach.phase1.description}</p>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <span>⏱️ {mvpApproach.phase1.timeline}</span>
                    <span>•</span>
                    <span>Features: {mvpApproach.phase1.features.join(", ")}</span>
                  </div>
                </div>
                
                {/* Phase 2 */}
                {mvpApproach.phase2 && (
                  <div className="bg-white border border-neutral-200 rounded-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2 py-1 rounded-sm uppercase tracking-wide">
                        Phase 2: Growth
                      </span>
                      <span className="text-sm font-semibold text-neutral-900">{mvpApproach.phase2.cost}</span>
                    </div>
                    <p className="text-sm text-neutral-700 mb-2">{mvpApproach.phase2.description}</p>
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <span>⏱️ {mvpApproach.phase2.timeline}</span>
                      <span>•</span>
                      <span>Features: {mvpApproach.phase2.features.join(", ")}</span>
                    </div>
                  </div>
                )}
                
                {/* Phase 3 */}
                {mvpApproach.phase3 && (
                  <div className="bg-white border border-neutral-200 rounded-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2 py-1 rounded-sm uppercase tracking-wide">
                        Phase 3: Scale
                      </span>
                      <span className="text-sm font-semibold text-neutral-900">{mvpApproach.phase3.cost}</span>
                    </div>
                    <p className="text-sm text-neutral-700 mb-2">{mvpApproach.phase3.description}</p>
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <span>⏱️ {mvpApproach.phase3.timeline}</span>
                      <span>•</span>
                      <span>Features: {mvpApproach.phase3.features.join(", ")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Alternative Tech Stack */}
          {alternativeTechStack && (
            <div>
              <h4 className="text-base font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Consider a Leaner Tech Stack
              </h4>
              <div className="bg-white border border-neutral-200 rounded-sm p-4">
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Current Approach:</p>
                    <p className="text-sm font-medium text-neutral-900">{alternativeTechStack.current}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Suggested Alternative:</p>
                    <p className="text-sm font-medium text-emerald-700">{alternativeTechStack.suggested}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 mb-2">{alternativeTechStack.reasoning}</p>
                <p className="text-xs font-semibold text-emerald-700">
                  Potential savings: {alternativeTechStack.savings}
                </p>
              </div>
            </div>
          )}
          
          {/* Bottom CTA */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4 text-center">
            <p className="text-sm text-neutral-700">
              <strong>Bottom line:</strong> {
                budgetGap.severity !== "none" 
                  ? `You can launch for ${mvpApproach.phase1.cost} in ${mvpApproach.phase1.timeline}, get early customers, then invest more only if it's working.`
                  : `Adjust your timeline or team size to match the scope, or reduce scope to fit your constraints.`
              } This approach reduces risk and increases your chances of success.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
