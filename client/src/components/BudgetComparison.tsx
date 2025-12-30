import { DollarSign, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface BudgetComparisonProps {
  userBudget: string;
  recommendedBudget: {
    min: number;
    max: number;
  };
  route: "no-code" | "hybrid" | "custom";
  complexity: string;
}

export default function BudgetComparison({
  userBudget,
  recommendedBudget,
  route,
  complexity,
}: BudgetComparisonProps) {
  const [isOpen, setIsOpen] = useState(true);
  const parseBudget = (budget: string): { min: number; max: number } | null => {
    const normalized = String(budget || "").replace(/\u2013|\u2014/g, "-");
    if (budget === "Under $3,000") return { min: 0, max: 3000 };
    if (normalized === "$3,000-$7,000") return { min: 3000, max: 7000 };
    if (normalized === "$7,000-$15,000") return { min: 7000, max: 15000 };
    if (budget === "Over $15,000") return { min: 15000, max: 50000 };
    return null;
  };

  const userBudgetRange = parseBudget(userBudget);
  
  const isBudgetRealistic = userBudgetRange 
    ? userBudgetRange.max >= recommendedBudget.min
    : false;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGapAnalysis = () => {
    if (!userBudgetRange) {
      return "We recommend setting a budget to ensure you can hire quality developers who will deliver reliable work.";
    }

    if (isBudgetRealistic) {
      return "Your budget aligns well with realistic market rates for quality developers. This gives you good options for finding reliable talent.";
    }

    const shortfall = recommendedBudget.min - userBudgetRange.max;
    return `To get quality, reliable work for a ${complexity} ${route} project, you'll likely need ${formatCurrency(shortfall)} more than your current budget. Lower-cost options exist but may result in delays, quality issues, or project failure.`;
  };

  return (
    <div className="mb-6 bg-white border border-neutral-300 rounded-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <DollarSign className="w-5 h-5 text-neutral-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-neutral-900 mb-1">Budget Reality Check</h3>
            <p className="text-sm text-neutral-600">
              Comparing your budget with realistic market rates for quality work
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

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Your Budget */}
        <div className="border border-neutral-200 rounded-sm p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2">Your Budget</p>
          <p className="text-2xl font-medium text-neutral-900 mb-1">{userBudget}</p>
          <p className="text-xs text-neutral-600">What you indicated you can spend</p>
        </div>

        {/* Recommended Budget */}
        <div className="border border-amber-300 bg-amber-50 rounded-sm p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-800 mb-2">
            Realistic Range for Quality Work
          </p>
          <p className="text-2xl font-medium text-neutral-900 mb-1">
            {formatCurrency(recommendedBudget.min)} - {formatCurrency(recommendedBudget.max)}
          </p>
          <p className="text-xs text-neutral-700">
            Based on {complexity} complexity, {route} route, US-based senior developers
          </p>
        </div>
      </div>

      {/* Analysis */}
      <div
        className={`border rounded-sm p-4 flex items-start gap-3 ${
          isBudgetRealistic
            ? "bg-green-50 border-green-300"
            : "bg-amber-50 border-amber-300"
        }`}
      >
        {isBudgetRealistic ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 mb-1">
            {isBudgetRealistic ? "Budget Looks Good" : "Budget Gap Identified"}
          </h4>
          <p className="text-sm text-neutral-700 leading-relaxed">{getGapAnalysis()}</p>
        </div>
      </div>

          {/* Bottom Note */}
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-600 italic">
              <strong>Note:</strong> These estimates reflect 2025 US market rates for experienced developers using modern tools. 
              Lower-cost options (offshore, junior developers) are available but come with trade-offs in quality, communication, and project success rates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
