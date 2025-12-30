import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function CollapsibleSection({
  title,
  icon,
  subtitle,
  children,
  defaultOpen = true,
  className = "",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mb-6 bg-white border border-neutral-300 rounded-sm ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          {icon && <div className="mt-0.5">{icon}</div>}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-neutral-900 mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
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
      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
