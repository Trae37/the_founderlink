import { ExternalLink, Users, AlertCircle, Star, TrendingUp, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";

interface SourcingPlatform {
  name: string;
  url: string;
  description: string;
  priceRange: string;
  hourlyRate: string;
  quality: "budget" | "mid" | "premium";
  pros: string[];
  cons: string[];
  bestFor: string;
}

interface TeamOption {
  name: string;
  members: Array<{ level: string; count: number; role: string }>;
  totalCost: { min: number; max: number };
  timeline: { min: number; max: number }; // weeks
  description: string;
  tradeoff: string;
}

interface SourcingOptionsProps {
  route: "no-code" | "hybrid" | "custom";
  complexity: string;
  teamOptions?: TeamOption[];
}

export const SOURCING_PLATFORMS: SourcingPlatform[] = [
  {
    name: "Upwork",
    url: "https://www.upwork.com",
    description: "Large freelance marketplace with developers at all skill levels",
    priceRange: "Varies by seniority and region",
    hourlyRate: "Varies",
    quality: "mid",
    pros: ["Large talent pool", "Escrow protection", "Time tracking tools", "Wide range of experience levels"],
    cons: ["Quality varies widely", "High platform fees (10-20%)", "Requires careful vetting"],
    bestFor: "Standard projects when you have time to vet candidates",
  },
  {
    name: "Toptal",
    url: "https://www.toptal.com",
    description: "Pre-vetted 'top 3%' of freelance developers",
    priceRange: "Varies by seniority and location",
    hourlyRate: "Varies",
    quality: "premium",
    pros: ["Highly vetted talent", "Quality guarantee", "Fast matching", "Senior expertise"],
    cons: ["Premium pricing", "Toptal takes ~50% margin", "Minimum engagement requirements"],
    bestFor: "Complex projects requiring vetted senior developers",
  },
  {
    name: "Fiverr",
    url: "https://www.fiverr.com",
    description: "Project-based marketplace with budget to mid-tier developers",
    priceRange: "Varies widely by gig and scope",
    hourlyRate: "Varies",
    quality: "budget",
    pros: ["Affordable project pricing", "Quick turnaround", "Good for simple MVPs", "Fixed-price options"],
    cons: ["Quality varies widely", "Communication challenges", "Not suitable for complex projects"],
    bestFor: "Simple projects or prototypes on tight budgets",
  },
  {
    name: "Gun.io",
    url: "https://www.gun.io",
    description: "Vetted freelance developers for startups",
    priceRange: "Varies by seniority and specialization",
    hourlyRate: "Varies",
    quality: "premium",
    pros: ["Pre-vetted developers", "Startup-focused", "Flexible engagements", "Quality guarantee"],
    cons: ["Premium pricing", "Limited availability", "Requires minimum commitment"],
    bestFor: "Startups needing vetted senior developers",
  },
  {
    name: "Contra",
    url: "https://www.contra.com",
    description: "Commission-free platform for independent professionals",
    priceRange: "Varies by experience and skill",
    hourlyRate: "Varies",
    quality: "mid",
    pros: ["No platform fees (0% commission)", "Modern interface", "Direct communication", "Growing community"],
    cons: ["Newer platform", "Less established", "Limited vetting", "Smaller talent pool"],
    bestFor: "Mid-level developers without platform fees eating into budget",
  },
  {
    name: "Freelancer.com",
    url: "https://www.freelancer.com",
    description: "Global freelance marketplace with competitive bidding",
    priceRange: "Varies widely by region and competition",
    hourlyRate: "Varies",
    quality: "budget",
    pros: ["Very large global pool", "Competitive bidding", "Contest feature", "Offshore rates"],
    cons: ["Highly variable quality", "Many low-quality bids", "Time-intensive vetting", "Communication barriers"],
    bestFor: "Budget projects with time to vet offshore candidates",
  },
];

export default function SourcingOptions({ route, complexity, teamOptions }: SourcingOptionsProps) {
  const [isOpen, setIsOpen] = useState(true);

  const platforms = SOURCING_PLATFORMS;

  const getQualityBadge = (quality: string) => {
    const badges = {
      budget: { label: "Budget", color: "bg-blue-100 text-blue-800" },
      mid: { label: "Mid-Tier", color: "bg-purple-100 text-purple-800" },
      premium: { label: "Premium", color: "bg-amber-100 text-amber-800" },
    };
    const badge = badges[quality as keyof typeof badges];
    return (
      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  // Map team options to platform quality tiers
  const getTeamOptionForPlatform = (platform: SourcingPlatform): TeamOption | undefined => {
    if (!teamOptions || teamOptions.length === 0) return undefined;

    const sortedTeamOptions = [...teamOptions].sort((a, b) => b.totalCost.max - a.totalCost.max);
    
    // Map platform quality to team option index
    const qualityMap: { [key: string]: number } = {
      premium: 0, // Senior team
      mid: Math.floor(sortedTeamOptions.length / 2), // Mid-level team
      budget: sortedTeamOptions.length - 1, // Junior team
    };
    
    const index = qualityMap[platform.quality] || 0;
    const baseTeamOption = sortedTeamOptions[Math.min(index, sortedTeamOptions.length - 1)];

    return baseTeamOption;
  };

  return (
    <div className="mb-6 bg-white border border-neutral-300 rounded-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <Users className="w-5 h-5 text-neutral-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-neutral-900 mb-1">Where to Find Developers</h3>
            <p className="text-sm text-neutral-600">
              Popular platforms with team options and realistic guidance for each
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
      {/* Other Platforms with Team Options */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-3">
          Other Sourcing Platforms
        </h4>
        {platforms.map((platform) => {
          const teamOption = getTeamOptionForPlatform(platform);
          
          return (
            <div key={platform.name} className="border border-neutral-200 rounded-sm p-4 hover:border-neutral-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-neutral-900">{platform.name}</h4>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                {getQualityBadge(platform.quality)}
              </div>
              <p className="text-sm text-neutral-700 mb-3">{platform.description}</p>
              
              {/* Team Option for this platform */}
              {teamOption && (
                <div className="bg-neutral-50 rounded-sm p-3 mb-3 border border-neutral-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-1">Estimated Team</p>
                      <p className="text-xs text-neutral-600">{teamOption.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-neutral-600">
                        <Clock className="w-3 h-3" />
                        <span>{teamOption.timeline.min}-{teamOption.timeline.max} weeks</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {teamOption.members.map((member, i) => {
                      return (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-neutral-700">
                            {member.count}x {member.role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-xs text-neutral-600 mb-0.5">Typical Pricing</p>
                  <p className="text-sm font-semibold text-neutral-900">{platform.priceRange}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-neutral-600 mb-0.5">Best For</p>
                  <p className="text-sm text-neutral-800">{platform.bestFor}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-green-700 mb-1">✓ Pros</p>
                  <ul className="text-neutral-700 space-y-0.5">
                    {platform.pros.map((pro, i) => (
                      <li key={i}>• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-neutral-600 mb-1">⚠ Cons</p>
                  <ul className="text-neutral-600 space-y-0.5">
                    {platform.cons.map((con, i) => (
                      <li key={i}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}

        {/* Warning about lower-quality options */}
        <div className="mt-6 border border-amber-300 bg-amber-50 rounded-sm p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-1">Important Note on Budget Options</h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Very low hourly rates (around $10-$30/hr) usually mean less screening, less proven SaaS experience, and less structured project management. That can increase the chances of misalignment, missed expectations, and rebuilds, especially for non‑technical founders. If this is your first SaaS or you're on a tight runway, mid‑tier or premium devs with a track record of shipped projects and good references are usually a safer choice.
            </p>
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}
