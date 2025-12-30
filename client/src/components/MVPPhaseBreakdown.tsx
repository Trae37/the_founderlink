import { CheckCircle2, Clock, DollarSign, AlertCircle } from "lucide-react";
import type { MVPPhaseBreakdown } from "@shared/mvp-phaser";

interface MVPPhaseBreakdownProps {
  phaseBreakdown: MVPPhaseBreakdown;
  userBudget: number;
}

export default function MVPPhaseBreakdownComponent({ phaseBreakdown, userBudget }: MVPPhaseBreakdownProps) {
  const {
    mvpFeatures,
    phase2Features,
    phase3Features,
    mvpCostEstimate,
    phase2CostEstimate,
    phase3CostEstimate,
    totalCostEstimate,
    recommendation
  } = phaseBreakdown;

  const mvpWithinBudget = userBudget > 0 && mvpCostEstimate.max <= userBudget;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-sm p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-3">
          Phased Development Roadmap
        </h3>
        <p className="text-neutral-700 leading-relaxed">
          {recommendation}
        </p>
      </div>

      {/* MVP Phase */}
      <div className="bg-white border-2 border-amber-500 rounded-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              <h4 className="text-lg font-semibold text-neutral-900">
                Phase 1: MVP Launch
              </h4>
            </div>
            <p className="text-sm text-neutral-600">
              {mvpFeatures.length} core features • Essential for initial launch
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-neutral-900">
              ${mvpCostEstimate.min.toLocaleString()}-${mvpCostEstimate.max.toLocaleString()}
            </div>
            {userBudget > 0 && (
              <div className="mt-1">
                {mvpWithinBudget ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    Within budget
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-sm">
                    <AlertCircle className="w-3 h-3" />
                    ${(mvpCostEstimate.min - userBudget).toLocaleString()} over budget
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {mvpFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-neutral-900">{feature.name}</div>
                <div className="text-xs text-neutral-600 mt-1">{feature.reasoning}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {feature.estimatedHours.min}-{feature.estimatedHours.max}h
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 2 */}
      {phase2Features.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <h4 className="text-lg font-semibold text-neutral-900">
                  Phase 2: Post-Launch Improvements
                </h4>
              </div>
              <p className="text-sm text-neutral-600">
                {phase2Features.length} features • Add after launch
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-neutral-900">
                ${phase2CostEstimate.min.toLocaleString()}-${phase2CostEstimate.max.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Additional cost
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {phase2Features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-sm">
                <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-900">{feature.name}</div>
                  <div className="text-xs text-neutral-600 mt-1">{feature.reasoning}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {feature.estimatedHours.min}-{feature.estimatedHours.max}h
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 3 */}
      {phase3Features.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-500" />
                <h4 className="text-lg font-semibold text-neutral-900">
                  Phase 3: Growth & Scale
                </h4>
              </div>
              <p className="text-sm text-neutral-600">
                {phase3Features.length} features • Add after traction
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-neutral-900">
                ${phase3CostEstimate.min.toLocaleString()}-${phase3CostEstimate.max.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Additional cost
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {phase3Features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-sm">
                <DollarSign className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-900">{feature.name}</div>
                  <div className="text-xs text-neutral-600 mt-1">{feature.reasoning}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {feature.estimatedHours.min}-{feature.estimatedHours.max}h
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Cost Summary */}
      <div className="bg-neutral-900 text-white rounded-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-400 mb-1">Total Project Cost (All Phases)</div>
            <div className="text-3xl font-bold">
              ${totalCostEstimate.min.toLocaleString()}-${totalCostEstimate.max.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-400 mb-1">Recommended Approach</div>
            <div className="text-lg font-semibold text-amber-400">
              Start with MVP (${(mvpCostEstimate.min / 1000).toFixed(0)}K-${(mvpCostEstimate.max / 1000).toFixed(0)}K)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
