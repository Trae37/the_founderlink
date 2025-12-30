import { AlertCircle, CheckCircle2, TrendingDown } from "lucide-react";
import type { TeamOption } from "@/../../shared/cost-estimator";

interface BudgetRealityCardProps {
  userBudget: string;
  teamOptions: TeamOption[];
  route: string;
  mvpCost?: { min: number; max: number };
}

export default function BudgetRealityCard({
  userBudget,
  teamOptions,
  route,
  mvpCost,
}: BudgetRealityCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Parse user budget - remove $ and commas first
  const cleanBudget = userBudget.replace(/[$,]/g, '');
  const budgetMatch = cleanBudget.match(/\d+/g);
  const budgetMin = budgetMatch ? parseInt(budgetMatch[0]) : 0;
  const budgetMax = budgetMatch && budgetMatch.length > 1 ? parseInt(budgetMatch[1]) : budgetMin;

  const sortedTeamOptions = [...teamOptions].sort((a, b) => b.totalCost.max - a.totalCost.max);

  // Find what user can afford
  const affordableOptions = sortedTeamOptions.filter(
    option => option.totalCost.min <= budgetMax
  );

  const idealOption = sortedTeamOptions[0]; // Most expensive = ideal
  const canAffordIdeal = budgetMax >= idealOption.totalCost.min;
  const canAffordMVP = mvpCost ? budgetMax >= mvpCost.min : false;

  // No-code alternative calculation
  const noCodeEstimate = {
    min: Math.round(budgetMin * 0.3), // No-code is typically 30-50% of custom cost
    max: Math.round(budgetMax * 0.5),
  };

  return (
    <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
      <h2 className="text-2xl font-medium text-neutral-900 tracking-tight mb-6">
        Budget Reality Check
      </h2>

      {/* User's Budget */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-sm">
        <p className="text-sm text-neutral-600 mb-1">Your Budget</p>
        <p className="text-2xl font-medium text-neutral-900">
          {formatCurrency(budgetMin)}
          {budgetMax > budgetMin && ` - ${formatCurrency(budgetMax)}`}
        </p>
      </div>

      {/* What You Can Afford */}
      <div className="space-y-6">
        {/* Ideal Configuration */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {canAffordIdeal ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            )}
            <h3 className="text-lg font-medium text-neutral-900">Ideal Configuration</h3>
          </div>
          <div className="pl-7 border-l-2 border-neutral-200 ml-2">
            <p className="text-neutral-700 mb-2">
              <strong>{idealOption.name}</strong> - {formatCurrency(idealOption.totalCost.min)}-{formatCurrency(idealOption.totalCost.max)}
            </p>
            <p className="text-sm text-neutral-600 mb-2">{idealOption.description}</p>
            {!canAffordIdeal && (
              <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-sm">
                <strong>Gap:</strong> You need {formatCurrency(idealOption.totalCost.min - budgetMax)} more to afford this option
              </p>
            )}
          </div>
        </div>

        {/* What Your Budget Can Buy */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-medium text-neutral-900">What Your Budget Can Buy</h3>
          </div>
          <div className="pl-7 border-l-2 border-emerald-200 ml-2 space-y-3">
            {affordableOptions.length > 0 ? (
              affordableOptions.map((option, index) => (
                <div key={index} className="bg-emerald-50 px-3 py-2 rounded-sm">
                  <p className="text-neutral-900 font-medium mb-1">
                    {option.name} - {formatCurrency(option.totalCost.min)}-{formatCurrency(option.totalCost.max)}
                  </p>
                  <p className="text-sm text-neutral-700">{option.description}</p>
                  <p className="text-xs text-neutral-600 mt-1">
                    Timeline: {option.timeline.min}-{option.timeline.max} weeks
                  </p>
                </div>
              ))
            ) : (
              <div>
                {canAffordMVP && mvpCost ? (
                  <div className="bg-emerald-50 px-3 py-2 rounded-sm">
                    <p className="text-neutral-900 font-medium mb-1">
                      MVP Phase Only - {formatCurrency(mvpCost.min)}-{formatCurrency(mvpCost.max)}
                    </p>
                    <p className="text-sm text-neutral-700">
                      Your budget covers the MVP phase. Launch with core features, then raise funding or bootstrap to add more.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-700">
                    Your budget is below the minimum for this development approach. See no-code alternative below.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* No-Code Alternative */}
        {route !== "no-code" && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-neutral-900">No-Code Alternative</h3>
            </div>
            <div className="pl-7 border-l-2 border-blue-200 ml-2">
              <p className="text-neutral-700 mb-2">
                <strong>Estimated Cost:</strong> {formatCurrency(noCodeEstimate.min)}-{formatCurrency(noCodeEstimate.max)}
              </p>
              <p className="text-sm text-neutral-600 mb-2">
                Build with platforms like Bubble, Webflow, or Softr to launch faster at 30-50% of custom development cost.
              </p>
              <div className="bg-blue-50 px-3 py-2 rounded-sm text-sm text-blue-900">
                <p className="font-medium mb-1">Beachhead Strategy:</p>
                <p>Launch fast with no-code, get early customers, then upgrade to custom as traction grows</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <p className="text-sm text-neutral-600">
          💡 <strong>Recommendation:</strong> {
            canAffordIdeal
              ? "Your budget aligns well with the ideal configuration. You can proceed with confidence."
              : canAffordMVP
              ? "Consider phased development. Launch MVP first, then expand as you generate revenue or raise funding."
              : route === "no-code"
              ? "Your budget is tight. Focus on absolute MVP features and consider DIY with no-code tools."
              : "Your budget is below market rates for custom development. Consider no-code to launch faster and reduce upfront cost."
          }
        </p>
      </div>
    </div>
  );
}
