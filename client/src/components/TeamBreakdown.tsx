import { Users, CheckCircle2 } from "lucide-react";
import type { TeamMemberRecommendation } from "../../../server/services/recommendation-engine";

interface TeamBreakdownProps {
  teamBreakdown: TeamMemberRecommendation[];
  teamSize: number;
}

export default function TeamBreakdown({ teamBreakdown, teamSize }: TeamBreakdownProps) {
  if (!teamBreakdown || teamBreakdown.length === 0) return null;

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "senior":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "mid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "junior":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  return (
    <div className="mb-12 bg-white border border-neutral-300 rounded-sm p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-medium text-neutral-900 tracking-tight">
            Recommended Team Composition
          </h2>
        </div>
        <p className="text-neutral-600">
          Based on your project requirements, here's the ideal team structure with {teamSize} developer{teamSize > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {teamBreakdown.map((member, index) => (
          <div
            key={index}
            className="border border-neutral-200 rounded-sm p-6 hover:border-neutral-300 transition-colors"
          >
            {/* Role Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-medium text-neutral-900">{member.role}</h3>
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wide rounded-sm border ${getLevelBadgeColor(
                    member.level
                  )}`}
                >
                  {member.level}
                </span>
              </div>
              <p className="text-sm text-neutral-600 italic">{member.whyNeeded}</p>
            </div>

            {/* Responsibilities */}
            <div>
              <h4 className="text-xs font-mono text-neutral-600 uppercase tracking-wider mb-3">
                Key Responsibilities
              </h4>
              <ul className="space-y-2">
                {member.responsibilities.map((responsibility, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Team Dynamics Note */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <p className="text-sm text-neutral-600">
          <strong>Note:</strong> This team composition balances cost, speed, and quality. Each role is designed to handle specific aspects of your project efficiently, with clear responsibilities to minimize overlap and maximize productivity.
        </p>
      </div>
    </div>
  );
}
