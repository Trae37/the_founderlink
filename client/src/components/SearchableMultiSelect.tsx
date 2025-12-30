import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Info } from "lucide-react";

interface OptionItem {
  value: string;
  label?: string;
  tooltip?: string;
}

interface CategoryGroup {
  category: string;
  options: OptionItem[];
}

interface SearchableMultiSelectProps {
  categorizedOptions: CategoryGroup[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  selectionLimit?: number;
  disabled?: boolean;
  placeholder?: string;
  enableOrdering?: boolean;
}

// Mock recently selected data (in production, this would come from analytics)
const RECENTLY_SELECTED = [
  "auth_email_password",
  "payments_one_time",
  "admin_dashboard",
  "file_uploads",
  "third_party_api_integration",
];

export function SearchableMultiSelect({
  categorizedOptions,
  value,
  onChange,
  maxSelections = 5,
  selectionLimit,
  disabled = false,
  placeholder = "Type to search or select from dropdown...",
  enableOrdering = false,
}: SearchableMultiSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten all options for search
  const allOptions = categorizedOptions.flatMap((group) => group.options);

  // Filter options based on search term and exclude already selected
  const getFilteredCategories = () => {
    if (!searchTerm) {
      // Show recently selected first, then all categories
      const recentlySelectedOptions = RECENTLY_SELECTED
        .map((val) => allOptions.find((opt) => opt.value === val))
        .filter((opt): opt is OptionItem => opt !== undefined && !value.includes(opt.value));

      const filteredCategories = categorizedOptions
        .map((group) => ({
          ...group,
          options: group.options.filter((opt) => !value.includes(opt.value)),
        }))
        .filter((group) => group.options.length > 0);

      if (recentlySelectedOptions.length > 0) {
        return [
          {
            category: "Recently Selected",
            options: recentlySelectedOptions,
          },
          ...filteredCategories,
        ];
      }

      return filteredCategories;
    }

    // Search across all options
    const searchLower = searchTerm.toLowerCase();
    return categorizedOptions
      .map((group) => ({
        ...group,
        options: group.options.filter(
          (opt) =>
            !value.includes(opt.value) &&
            (opt.value.toLowerCase().includes(searchLower) ||
              String(opt.label || "").toLowerCase().includes(searchLower))
        ),
      }))
      .filter((group) => group.options.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHoveredOption(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const effectiveLimit = Math.max(0, Math.min(selectionLimit ?? maxSelections, maxSelections));
  const isMaxReached = disabled || value.length >= effectiveLimit;

  const handleSelect = (option: string) => {
    if (!disabled && value.length < effectiveLimit) {
      onChange([...value, option]);
      setSearchTerm("");
      inputRef.current?.focus();
    }
  };

  const handleRemove = (option: string) => {
    onChange(value.filter((v) => v !== option));
  };

  const moveSelected = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= value.length || toIndex >= value.length) return;

    const next = [...value];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input container with bubbles */}
      <div
        className={`min-h-[44px] w-full px-3 py-2 border border-neutral-300 rounded-sm bg-white transition-all ${
          isOpen ? "ring-1 ring-black" : ""
        } ${isMaxReached ? "bg-neutral-50" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        onClick={() => !isMaxReached && !disabled && inputRef.current?.focus()}
      >
        {/* Selected items as bubbles */}
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((item, index) => {
            const option = allOptions.find((opt) => opt.value === item);
            const display = option?.label || option?.value || item;
            return (
            <div
              key={item}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white text-sm rounded-sm"
            >
              <span>{display}</span>
              {enableOrdering && value.length > 1 ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSelected(index, index - 1);
                    }}
                    disabled={index === 0}
                    className="hover:bg-white/20 rounded-sm p-0.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSelected(index, index + 1);
                    }}
                    disabled={index === value.length - 1}
                    className="hover:bg-white/20 rounded-sm p-0.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item);
                }}
                className="hover:bg-white/20 rounded-sm p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
          })}
        </div>

        {/* Input field */}
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={isMaxReached}
            placeholder={
              isMaxReached
                ? `Maximum ${maxSelections} total selections reached`
                : value.length === 0
                ? placeholder
                : "Type to search..."
            }
            className="flex-1 outline-none bg-transparent text-sm placeholder:text-neutral-400 disabled:cursor-not-allowed"
          />
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Selection counter */}
        {value.length > 0 && (
          <div className="text-xs text-neutral-500 mt-1">
            {value.length}/{maxSelections} selected
          </div>
        )}
      </div>

      {/* Dropdown with categories */}
      {isOpen && !isMaxReached && !disabled && filteredCategories.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-sm shadow-lg max-h-96 overflow-y-auto">
          {filteredCategories.map((group, groupIndex) => (
            <div key={group.category}>
              {/* Category header */}
              <div className="sticky top-0 bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600 uppercase tracking-wide border-b border-neutral-200">
                {group.category}
              </div>

              {/* Options in this category */}
              {group.options.map((option) => {
                const isHovered = hoveredOption === option.value;
                return (
                  <div key={option.value} className="relative">
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      onMouseEnter={() => setHoveredOption(option.value)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 transition-colors flex items-center justify-between gap-2"
                    >
                      <span>{option.label || option.value}</span>
                      {option.tooltip && (
                        <Info className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      )}
                    </button>

                    {/* Tooltip */}
                    {isHovered && option.tooltip && (
                      <div className="absolute left-full top-0 ml-2 z-[100] w-64 px-3 py-2 bg-neutral-900 text-white text-xs rounded-sm shadow-lg pointer-events-none">
                        {option.tooltip}
                        {/* Arrow */}
                        <div className="absolute right-full top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-neutral-900" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Divider between categories (except last) */}
              {groupIndex < filteredCategories.length - 1 && (
                <div className="border-b border-neutral-200" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && !isMaxReached && searchTerm && filteredCategories.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-sm shadow-lg px-3 py-2 text-sm text-neutral-500">
          No matching options found
        </div>
      )}
    </div>
  );
}
