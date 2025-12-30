import { DollarSign } from "lucide-react";

interface RealisticRangeCardProps {
  minCost: number;
  maxCost: number;
  route: string;
}

export default function RealisticRangeCard({ minCost, maxCost, route }: RealisticRangeCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-neutral-100 rounded-sm">
          <DollarSign className="w-6 h-6 text-neutral-700" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-medium text-neutral-900 mb-2 tracking-tight">
            Realistic Cost Range
          </h2>
          <p className="text-neutral-600 mb-4">
            Based on your project requirements and 2025 market rates
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-medium text-neutral-900">
              {formatCurrency(minCost)}
            </span>
            <span className="text-2xl text-neutral-500">-</span>
            <span className="text-4xl font-medium text-neutral-900">
              {formatCurrency(maxCost)}
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            Full project cost • All features included • {route === "no-code" ? "No-code platform" : route === "hybrid" ? "Hybrid approach" : "Custom development"}
          </p>
        </div>
      </div>
    </div>
  );
}
