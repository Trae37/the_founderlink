import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface UpgradeBlockProps {
  onFreeClick: () => void;
  onPaidClick: () => void;
  isLoading: boolean;
}

export default function UpgradeBlock({ onFreeClick, onPaidClick, isLoading }: UpgradeBlockProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Choose how deep you want to go
        </h2>
        <p className="text-white/70 text-lg">
          Your Smart Fit Snapshot is ready. Here's what you get free, and what unlocks when you grab your Full Hiring Blueprint.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Column */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Free Smart Fit Snapshot</h3>
            <p className="text-white/60 text-sm">Great if you're just exploring.</p>
          </div>

          <ul className="space-y-4 mb-8">
            <FeatureItem text="Build route recommendation" subtext="No‑code, Hybrid, or Custom route matched to your budget, timeline, and tech comfort." />
            <FeatureItem text="Mini hiring plan" subtext="A quick, 3‑bullet summary of who you should hire first, how long for, and what to focus them on." />
            <FeatureItem text="Project Clarity Brief" subtext="A clear summary of your idea, recommended approach, and hiring direction based on your answers." />
            <FeatureItem text="Single starter asset" subtext="One example you can copy‑paste and adapt (either a job post or outreach script) to get moving." />
          </ul>

          <Button
            onClick={onFreeClick}
            disabled={isLoading}
            variant="outline"
            className="w-full text-white border-white/30 hover:bg-white/10 py-3"
          >
            Keep my free Snapshot
          </Button>

          <p className="text-white/40 text-xs text-center mt-3">
            You'll also get the Decode newsletter with practical, founder‑friendly hiring insights.
          </p>
        </div>

        {/* Paid Column */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-2 border-blue-500/40 rounded-lg p-6 relative">
          <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Full Hiring Blueprint</h3>
            <p className="text-white/60 text-sm">Everything you need to run a real hiring process.</p>
            <p className="text-3xl font-bold text-white mt-4">$149</p>
          </div>

          <p className="text-white/80 text-sm mb-4 font-semibold">
            Includes everything in the free Snapshot, plus:
          </p>

          <ul className="space-y-3 mb-8">
            <FeatureItem 
              text="Project Clarity Brief" 
              subtext="Your core idea, the recommended path, and the inputs a developer needs to understand the project." 
              highlight
            />
            <FeatureItem 
              text="Hiring Playbook" 
              subtext="Role definition, where to source, interview questions, and a take-home test task so you can vet confidently." 
              highlight
            />
            <FeatureItem 
              text="PRD (Product Requirements Document)" 
              subtext="A scope-ready PRD: users, MVP features, requirements, and success metrics you can hand to developers." 
              highlight
            />
            <FeatureItem 
              text="Working Agreement" 
              subtext="A working agreement template covering communication, scope changes, timelines, and expectations." 
              highlight
            />
            <FeatureItem 
              text="Downloadable files" 
              subtext="Choose Word (.docx) or Markdown (.md). PDF is coming soon."
              highlight
            />
          </ul>

          <Button
            onClick={onPaidClick}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold"
          >
            {isLoading ? "Processing..." : "Get my Full Hiring Blueprint - $149"}
          </Button>

          <p className="text-white/40 text-xs text-center mt-3">
            Instant access. Your download links arrive in your inbox within a few minutes.
          </p>

          <p className="text-white/60 text-xs text-center mt-4 italic">
            If the Full Hiring Blueprint doesn't make you feel dramatically more prepared to hire, reply within 7 days for a full refund.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text, subtext, highlight }: { text: string; subtext?: string; highlight?: boolean }) {
  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0 mt-1">
        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${highlight ? "bg-blue-500" : "bg-white/20"}`}>
          <Check className="h-3 w-3 text-white" />
        </div>
      </div>
      <div>
        <p className={`${highlight ? "text-white font-semibold" : "text-white/90"} text-sm`}>{text}</p>
        {subtext && <p className="text-white/50 text-xs mt-1">{subtext}</p>}
      </div>
    </li>
  );
}
