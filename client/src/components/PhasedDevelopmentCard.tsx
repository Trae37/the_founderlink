import { useState } from "react";
import { ChevronDown, ChevronUp, Layers, Clock, DollarSign, AlertTriangle } from "lucide-react";
import type { MVPPhaseBreakdown } from "@/../../shared/mvp-phaser";

interface TeamOption {
  name: string;
  members: Array<{ level: string; count: number; role: string }>;
  totalCost: { min: number; max: number };
  timeline: { min: number; max: number };
  description: string;
  tradeoff: string;
}

interface PhasedDevelopmentCardProps {
  phaseBreakdown: MVPPhaseBreakdown;
  route: string;
  teamOptions?: TeamOption[];
}

export default function PhasedDevelopmentCard({ phaseBreakdown, route, teamOptions }: PhasedDevelopmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompact = (amount: number) => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  // Calculate phase costs for each team option
  const calculatePhaseCostsForTeam = (teamOption: TeamOption, phaseIndex: number) => {
    // Get the base phase cost
    const baseCosts = [
      phaseBreakdown.mvpCostEstimate,
      phaseBreakdown.phase2CostEstimate,
      phaseBreakdown.phase3CostEstimate,
    ];
    const baseCost = baseCosts[phaseIndex];

    // Preserve phase distribution from the base estimate, but scale to the team's total quote.
    // This ensures phase totals do not exceed the team option's overall cost range.
    const totalProjectCost = phaseBreakdown.totalCostEstimate;
    const minShare = totalProjectCost.min > 0 ? baseCost.min / totalProjectCost.min : 0;
    const maxShare = totalProjectCost.max > 0 ? baseCost.max / totalProjectCost.max : 0;

    return {
      min: Math.round(teamOption.totalCost.min * minShare),
      max: Math.round(teamOption.totalCost.max * maxShare),
    };
  };

  const phases = [
    {
      name: "Phase 1: MVP",
      description: "Core features to get your first customers and launch quickly",
      features: phaseBreakdown.mvpFeatures,
      cost: phaseBreakdown.mvpCostEstimate,
      timeline: "4-8 weeks",
      teamRecommendation: "1 Senior Developer or 1 Senior + 1 Mid",
      phaseIndex: 0,
    },
    {
      name: "Phase 2: Growth",
      description: "Enhanced features to improve user experience and retention",
      features: phaseBreakdown.phase2Features,
      cost: phaseBreakdown.phase2CostEstimate,
      timeline: "3-6 weeks",
      teamRecommendation: "1 Mid-Level Developer (can scale down after MVP)",
      phaseIndex: 1,
      warning: "⚠️ Cost may change based on MVP learnings and scope adjustments",
    },
    {
      name: "Phase 3: Scale",
      description: "Advanced features for scaling and optimization",
      features: phaseBreakdown.phase3Features,
      cost: phaseBreakdown.phase3CostEstimate,
      timeline: "4-8 weeks",
      teamRecommendation: "1 Mid-Level Developer or outsource specific features",
      phaseIndex: 2,
      warning: "⚠️ Cost may change based on Phase 1 & 2 outcomes and market feedback",
    },
  ];

  const formatPercent = (value: number) => {
    if (!Number.isFinite(value)) return "0%";
    return `${Math.round(value * 100)}%`;
  };

  const getPhaseShare = (phaseCost: { min: number; max: number }) => {
    const total = phaseBreakdown.totalCostEstimate;
    const minShare = total.min > 0 ? phaseCost.min / total.min : 0;
    const maxShare = total.max > 0 ? phaseCost.max / total.max : 0;
    return { minShare, maxShare };
  };

  // Calculate total cost range from team options
  const totalCost = teamOptions && teamOptions.length > 0 ? (() => {
    // For each team option, calculate total across all 3 phases
    const teamTotals = teamOptions.map(option => {
      const phase1 = calculatePhaseCostsForTeam(option, 0);
      const phase2 = calculatePhaseCostsForTeam(option, 1);
      const phase3 = calculatePhaseCostsForTeam(option, 2);
      return {
        min: phase1.min + phase2.min + phase3.min,
        max: phase1.max + phase2.max + phase3.max,
      };
    });
    
    // Find the overall min (cheapest team) and max (most expensive team)
    return {
      min: Math.min(...teamTotals.map(t => t.min)),
      max: Math.max(...teamTotals.map(t => t.max)),
    };
  })() : {
    // Fallback to base costs if no team options
    min: phaseBreakdown.mvpCostEstimate.min + phaseBreakdown.phase2CostEstimate.min + phaseBreakdown.phase3CostEstimate.min,
    max: phaseBreakdown.mvpCostEstimate.max + phaseBreakdown.phase2CostEstimate.max + phaseBreakdown.phase3CostEstimate.max,
  };

  return (
    <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-medium text-neutral-900 tracking-tight mb-2">
            Phased Development Approach
          </h2>
          <p className="text-neutral-600">
            Break your project into phases to launch faster and reduce upfront cost
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <span className="text-sm font-medium">
            {isExpanded ? "Hide" : "Show"} details
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Summary with Team Options Table (collapsed view) */}
      {!isExpanded && teamOptions && teamOptions.length > 0 && (
        <div className="border border-neutral-300 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 border-b border-neutral-300">
                <tr>
                  <th className="text-left p-3 font-medium text-neutral-700">Team Option</th>
                  <th className="text-right p-3 font-medium text-neutral-700">Phase 1 (MVP)</th>
                  <th className="text-right p-3 font-medium text-neutral-700">Phase 2 (Growth)</th>
                  <th className="text-right p-3 font-medium text-neutral-700">Phase 3 (Scale)</th>
                  <th className="text-right p-3 font-medium text-neutral-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {teamOptions.map((option, index) => {
                  const phase1Cost = calculatePhaseCostsForTeam(option, 0);
                  const phase2Cost = calculatePhaseCostsForTeam(option, 1);
                  const phase3Cost = calculatePhaseCostsForTeam(option, 2);
                  const totalTeamCost = {
                    min: phase1Cost.min + phase2Cost.min + phase3Cost.min,
                    max: phase1Cost.max + phase2Cost.max + phase3Cost.max,
                  };
                  
                  return (
                    <tr key={index} className="border-b border-neutral-200 last:border-0 hover:bg-neutral-50">
                      <td className="p-3">
                        <div className="font-medium text-neutral-900">{option.name}</div>
                        <div className="text-xs text-neutral-600">{option.description}</div>
                      </td>
                      <td className="p-3 text-right font-mono text-neutral-900">
                        {formatCompact(phase1Cost.min)}-{formatCompact(phase1Cost.max)}
                      </td>
                      <td className="p-3 text-right font-mono text-neutral-600">
                        {formatCompact(phase2Cost.min)}-{formatCompact(phase2Cost.max)}
                      </td>
                      <td className="p-3 text-right font-mono text-neutral-600">
                        {formatCompact(phase3Cost.min)}-{formatCompact(phase3Cost.max)}
                      </td>
                      <td className="p-3 text-right font-mono font-medium text-neutral-900">
                        {formatCompact(totalTeamCost.min)}-{formatCompact(totalTeamCost.max)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-amber-50 border-t border-amber-200 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-900">
              <strong>Note:</strong> Phase 2 & 3 costs are estimates and may change based on learnings from earlier phases and scope adjustments.
            </p>
          </div>
        </div>
      )}

      {/* Fallback for no team options */}
      {!isExpanded && (!teamOptions || teamOptions.length === 0) && (
        <div className="border border-neutral-300 rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1">3-Phase Breakdown</h3>
              <p className="text-sm text-neutral-600">MVP, Growth, Scale</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-medium text-neutral-900">
                {formatCurrency(totalCost.min)} - {formatCurrency(totalCost.max)}
              </div>
              <div className="text-sm text-neutral-500 mt-1">
                Total across all phases
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {(
              [
                { label: "Phase 1", cost: phaseBreakdown.mvpCostEstimate },
                { label: "Phase 2", cost: phaseBreakdown.phase2CostEstimate },
                { label: "Phase 3", cost: phaseBreakdown.phase3CostEstimate },
              ] as const
            ).map((p) => {
              const share = getPhaseShare(p.cost);
              return (
                <div key={p.label} className="text-center p-3 bg-neutral-50 rounded-sm">
                  <div className="font-medium text-neutral-900">{p.label}</div>
                  <div className="text-neutral-600">
                    {formatCurrency(p.cost.min)} - {formatCurrency(p.cost.max)}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {formatPercent(share.minShare)}-{formatPercent(share.maxShare)} of total
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Phases (expanded view) */}
      {isExpanded && (
        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="border border-neutral-300 rounded-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers className="w-5 h-5 text-neutral-600" />
                    <h3 className="text-lg font-medium text-neutral-900">{phase.name}</h3>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">{phase.description}</p>
                  
                  {/* Warning for Phase 2 & 3 */}
                  {phase.warning && (
                    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-sm p-3 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-900">{phase.warning}</p>
                    </div>
                  )}
                  
                  {/* Features */}
                  <div className="mb-4">
                    <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                      Features ({phase.features.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.features.slice(0, 5).map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-sm"
                        >
                          {feature.name}
                        </span>
                      ))}
                      {phase.features.length > 5 && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-500 text-xs rounded-sm">
                          +{phase.features.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Phase cost share
                    </p>
                    {(() => {
                      const share = getPhaseShare(phase.cost);
                      return (
                        <p className="text-sm text-neutral-700">
                          {formatCurrency(phase.cost.min)} - {formatCurrency(phase.cost.max)}
                          <span className="text-neutral-500"> ({formatPercent(share.minShare)}-{formatPercent(share.maxShare)} of total)</span>
                        </p>
                      );
                    })()}
                  </div>

                  {/* Team Options for this phase */}
                  {teamOptions && teamOptions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        Team Options & Costs
                      </p>
                      <div className="space-y-2">
                        {teamOptions.map((option, i) => {
                          const phaseCost = calculatePhaseCostsForTeam(option, phase.phaseIndex);
                          return (
                            <div key={i} className="flex justify-between items-center text-sm bg-neutral-50 rounded-sm p-2">
                              <span className="text-neutral-700">{option.name}</span>
                              <span className="font-mono text-neutral-900">
                                {formatCompact(phaseCost.min)}-{formatCompact(phaseCost.max)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Team Recommendation */}
                  <div className="mb-4">
                    <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Recommended Team
                    </p>
                    <p className="text-sm text-neutral-700">{phase.teamRecommendation}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{phase.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="border-t-2 border-neutral-300 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-neutral-900">Total (All Phases)</h3>
                <p className="text-sm text-neutral-600">Complete project cost</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-medium text-neutral-900">
                  {formatCurrency(totalCost.min)} - {formatCurrency(totalCost.max)}
                </div>
              </div>
            </div>
            <div className="mt-3 bg-neutral-50 border border-neutral-200 rounded-sm p-3">
              <p className="text-xs text-neutral-600">
                <strong>Cost range explained:</strong> {formatCurrency(totalCost.min)} represents the most cost-effective team option (typically 1 Senior + 1 Junior Developer) across all three phases. {formatCurrency(totalCost.max)} represents the premium team option (typically 2 Senior Developers) for faster delivery and higher expertise.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <p className="text-sm text-neutral-600">
          💡 <strong>Smart Scaling:</strong> {phaseBreakdown.recommendation}
        </p>
      </div>
    </div>
  );
}
