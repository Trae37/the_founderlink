import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { assessmentQuestions } from "@/lib/assessmentData";
import { getCoreFeaturesFromQ4Answer } from "@shared/feature-catalog";

interface UserAnswersProps {
  responses: Record<number, any>;
}

export default function UserAnswers({ responses }: UserAnswersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatAnswer = (questionId: number, answer: any) => {
    if (questionId === 4) {
      return getCoreFeaturesFromQ4Answer(answer).join(", ");
    }

    if (questionId === 11) {
      if (typeof answer === "string") return answer;
      const v = answer || {};
      const pref = String(v.preference || "").trim();
      const tz = String(v.timezone || "").trim();
      return tz ? `${pref} (${tz})` : pref;
    }

    if (questionId === 12) {
      if (typeof answer === "string") return answer;
      const v = answer || {};
      const problem = String(v.problem || "").trim();
      const solution = String(v.solution || "").trim();
      if (problem && solution) return `Problem: ${problem} | Solution: ${solution}`;
      return problem || solution;
    }

    if (questionId === 13) {
      if (typeof answer === "string") return answer;
      const v = answer || {};
      const goal = String(v.goal || "").trim();
      const metric = String(v.metric || "").trim();
      if (goal && metric) return `Goal: ${goal} | Metric: ${metric}`;
      return goal || metric;
    }

    if (questionId === 14) {
      if (Array.isArray(answer)) return answer.join(", ");
      const v = answer || {};
      const selected = Array.isArray(v.selected) ? v.selected : [];
      const other = String(v.other || "").trim();
      return [...selected, ...(other ? [other] : [])].join(", ");
    }

    if (questionId === 15) {
      const v = answer || {};
      const projectName = String(v.project_name || "").trim();
      const first = String(v.first_name || "").trim();
      const last = String(v.last_name || "").trim();
      const email = String(v.email || "").trim();
      const name = [first, last].filter(Boolean).join(" ");
      return [projectName ? `Project: ${projectName}` : null, name ? `Name: ${name}` : null, email ? `Email: ${email}` : null]
        .filter(Boolean)
        .join(" | ");
    }

    if (Array.isArray(answer)) {
      return answer.join(", ");
    }

    if (answer && typeof answer === "object") {
      return JSON.stringify(answer);
    }

    return String(answer);
  };

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      A: "Basics",
      B: "MVP Scope",
      C: "Budget & Build",
      D: "Details",
    };
    return titles[section] || section;
  };

  // Group questions by section
  const questionsBySection = assessmentQuestions.reduce((acc, q) => {
    if (!acc[q.section]) {
      acc[q.section] = [];
    }
    acc[q.section].push(q);
    return acc;
  }, {} as Record<string, typeof assessmentQuestions>);

  return (
    <div className="mb-12 bg-white border border-neutral-300 rounded-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 text-xs font-medium">✓</span>
          </div>
          <h3 className="text-lg font-medium text-neutral-900">Your Assessment Answers</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-neutral-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-600" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 mt-4 mb-6">
            Here's a summary of what you told us. These answers were used to generate your personalized recommendations.
          </p>

          <div className="space-y-8">
            {Object.entries(questionsBySection).map(([section, questions]) => (
              <div key={section}>
                <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
                  {getSectionTitle(section)}
                </h4>
                <div className="space-y-4">
                  {questions.map((q) => {
                    const answer = responses[q.id];
                    if (answer === undefined || answer === null || answer === "") return null;

                    return (
                      <div key={q.id} className="pl-4 border-l-2 border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900 mb-1">{q.question}</p>
                        <p className="text-sm text-neutral-700">{formatAnswer(q.id, answer)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
