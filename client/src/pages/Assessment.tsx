import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { assessmentQuestions, determineRoute, AssessmentResponse } from "@/lib/assessmentData";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SearchableMultiSelect } from "@/components/SearchableMultiSelect";

const Q4_KNOWN_IDS = new Set(
  (assessmentQuestions
    .find((q) => q.id === 4)
    ?.categorizedOptions?.flatMap((g) => g.options.map((o) => o.value) as string[]) ||
    []) as string[]
);

const normalizeQ4AnswerToArray = (q4: unknown): string[] => {
  if (Array.isArray(q4)) {
    return q4.map((x) => String(x || "").trim()).filter(Boolean);
  }

  if (q4 && typeof q4 === "object") {
    const v = q4 as any;
    return [v?.feature1, v?.feature2, v?.feature3, v?.feature4, v?.feature5]
      .map((x: any) => String(x || "").trim())
      .filter(Boolean);
  }

  return [];
};

const splitQ4Answer = (q4: unknown): { selectedIds: string[]; other: string } => {
  const all = normalizeQ4AnswerToArray(q4);
  const selectedIds = all.filter((x) => Q4_KNOWN_IDS.has(x));
  const other = all.find((x) => !Q4_KNOWN_IDS.has(x)) || "";
  return { selectedIds, other };
};

const parseQ4OtherList = (raw: string): string[] => {
  const parts = String(raw || "")
    .split(/[\n,]/g)
    .map((x) => String(x || "").trim())
    .filter(Boolean);

  const unique: string[] = [];
  for (const p of parts) {
    if (!unique.includes(p)) unique.push(p);
  }

  return unique;
};

const sanitizeQ4Answer = (q4: unknown): string[] => {
  const all = normalizeQ4AnswerToArray(q4);
  const selectedIds: string[] = [];
  const otherItems: string[] = [];

  for (const item of all) {
    if (Q4_KNOWN_IDS.has(item)) {
      if (!selectedIds.includes(item)) selectedIds.push(item);
    } else {
      for (const other of parseQ4OtherList(item)) {
        if (!otherItems.includes(other)) otherItems.push(other);
      }
    }
  }

  return [...selectedIds, ...otherItems].slice(0, 5);
};

export default function Assessment() {
  const [location, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse>({});
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [backendSaveEnabled, setBackendSaveEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = ["A", "B", "C", "D"];
  const clampStep = (step: number) => {
    if (Number.isNaN(step)) return 0;
    return Math.max(0, Math.min(step, sections.length - 1));
  };

  // tRPC mutations for backend progress
  const saveProgressMutation = trpc.assessment.saveProgress.useMutation();
  const clearProgressMutation = trpc.assessment.clearProgress.useMutation();
  const { data: backendProgress } = trpc.assessment.getProgress.useQuery(
    { email: userEmail },
    { enabled: !!userEmail && userEmail.includes("@") }
  );

  // Load saved data from localStorage on mount
  useEffect(() => {
    // Check if reset parameter is present
    const searchParams = new URLSearchParams(location.split('?')[1]);
    if (searchParams.get('reset') === 'true') {
      localStorage.removeItem("assessment_userEmail");
      localStorage.removeItem("assessment_userName");
      localStorage.removeItem("assessment_currentStep");
      localStorage.removeItem("assessment_responses");
      setCurrentStep(0);
      setResponses({});
      setUserEmail("");
      setUserName("");
      // Remove reset param from URL
      navigate('/assessment');
      return;
    }
    
    const savedEmail = localStorage.getItem("assessment_userEmail");
    const savedName = localStorage.getItem("assessment_userName");
    const savedStep = localStorage.getItem("assessment_currentStep");
    const savedResponses = localStorage.getItem("assessment_responses");
    
    if (savedEmail) setUserEmail(savedEmail);
    if (savedName) setUserName(savedName);
    if (savedStep) setCurrentStep(clampStep(parseInt(savedStep)));
    if (savedResponses) {
      try {
        setResponses(JSON.parse(savedResponses));
      } catch (e) {
        console.error("Failed to parse saved responses", e);
      }
    }
  }, [location, navigate]);

  // Load from backend when email is entered and backend data is available
  useEffect(() => {
    if (backendProgress && !backendSaveEnabled) {
      // Only load from backend if localStorage is empty or older
      const localResponses = localStorage.getItem("assessment_responses");
      if (Object.keys(responses).length === 0 && (!localResponses || Object.keys(backendProgress.responses).length > 0)) {
        setUserName(backendProgress.name || "");
        setCurrentStep(clampStep(backendProgress.currentStep));
        setResponses(backendProgress.responses);
        setBackendSaveEnabled(true);
      }
    }
  }, [backendProgress, backendSaveEnabled, responses]);

  // Derive user identity from Q15 when present (new assessment schema)
  useEffect(() => {
    const q15 = (responses as any)[15] || {};
    const email = String(q15.email || "").trim();
    const first = String(q15.first_name || "").trim();
    const last = String(q15.last_name || "").trim();
    const fullName = [first, last].filter(Boolean).join(" ");

    if (email && email !== userEmail) setUserEmail(email);
    if (fullName && fullName !== userName) setUserName(fullName);
  }, [responses, userEmail, userName]);

  // Auto-save responses to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      localStorage.setItem("assessment_responses", JSON.stringify(responses));
    }
  }, [responses]);

  // Auto-save current step
  useEffect(() => {
    localStorage.setItem("assessment_currentStep", currentStep.toString());
  }, [currentStep]);

  // Auto-save user info
  useEffect(() => {
    if (userEmail) localStorage.setItem("assessment_userEmail", userEmail);
    if (userName) localStorage.setItem("assessment_userName", userName);
  }, [userEmail, userName]);

  // Hard-normalize Q4 to prevent any saved/legacy payload from containing >5 items
  useEffect(() => {
    if (responses[4] === undefined || responses[4] === null) return;
    const current = normalizeQ4AnswerToArray(responses[4]);
    const sanitized = sanitizeQ4Answer(responses[4]);
    if (JSON.stringify(current) !== JSON.stringify(sanitized)) {
      setResponses((prev) => ({
        ...prev,
        4: sanitized,
      }));
    }
  }, [responses]);

  // Auto-save to backend with debouncing (only when email is valid)
  useEffect(() => {
    if (!userEmail || !userEmail.includes("@") || Object.keys(responses).length === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      saveProgressMutation.mutate(
        {
          email: userEmail,
          name: userName,
          currentStep,
          responses: responses as unknown as Record<string, unknown>,
        },
        {
          onError: (error) => {
            console.error("Backend save failed:", error);
          },
          onSuccess: () => {
            console.log("✅ Progress saved to backend");
          },
        }
      );
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, userName, currentStep, responses]);

  // Get current section questions
  const sectionTitles = [
    "Basics",
    "MVP Scope",
    "Budget & Build",
    "Details"
  ];
  const clampedCurrentStep = clampStep(currentStep);
  const currentSection = sections[clampedCurrentStep];

  useEffect(() => {
    if (currentStep !== clampedCurrentStep) {
      setCurrentStep(clampedCurrentStep);
    }
  }, [currentStep, clampedCurrentStep]);
  
  // Filter questions by section AND conditional logic
  const sectionQuestions = assessmentQuestions.filter((q) => {
    if (q.section !== currentSection) return false;
    
    // Check if question has conditional logic
    if (q.conditional) {
      const conditionValue = responses[q.conditional.questionId];
      
      // If conditional value is an array, check if it includes the required value
      if (Array.isArray(q.conditional.value)) {
        return q.conditional.value.includes(conditionValue as string);
      }
      
      // Otherwise, check for exact match
      return conditionValue === q.conditional.value;
    }
    
    return true;
  });
  
  const totalSteps = sections.length;

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isQuestionAnswered = (questionId: number) => {
    const value = responses[questionId];

    if (questionId === 4) {
      if (Array.isArray(value)) {
        const count = value.map((x) => String(x || "").trim()).filter(Boolean).length;
        return count >= 3 && count <= 5;
      }
      const v = value || {};
      return Boolean(
        String((v as any).feature1 || "").trim() &&
          String((v as any).feature2 || "").trim() &&
          String((v as any).feature3 || "").trim()
      );
    }

    if (questionId === 11) {
      const v = value || {};
      const pref = String(v.preference || "");
      if (!pref.trim()) return false;
      if (pref.includes("Must overlap")) {
        return Boolean(String(v.timezone || "").trim());
      }
      return true;
    }

    if (questionId === 12) {
      const v = value || {};
      return Boolean(String(v.problem || "").trim().length >= 20 && String(v.solution || "").trim().length >= 20);
    }

    if (questionId === 13) {
      const v = value || {};
      return Boolean(String(v.goal || "").trim() && String(v.metric || "").trim());
    }

    if (questionId === 14) {
      const v = value || {};
      return Array.isArray(v.selected) && v.selected.length > 0;
    }

    if (questionId === 15) {
      const v = value || {};
      return Boolean(
        String(v.first_name || "").trim() &&
          String(v.last_name || "").trim() &&
          isValidEmail(String(v.email || ""))
      );
    }

    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== "";
  };

  // Check if a section is completed (all required questions answered)
  const isSectionCompleted = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    
    // Filter questions by section AND conditional logic
    const questions = assessmentQuestions.filter((q) => {
      if (q.section !== section) return false;
      
      // Check if question has conditional logic
      if (q.conditional) {
        const conditionValue = responses[q.conditional.questionId];
        
        // If conditional value is an array, check if it includes the required value
        if (Array.isArray(q.conditional.value)) {
          return q.conditional.value.includes(conditionValue as string);
        }
        
        // Otherwise, check for exact match
        return conditionValue === q.conditional.value;
      }
      
      return true;
    });
    
    return questions.every((q) => {
      if (!q.required) return true;
      return isQuestionAnswered(q.id);
    });
  };

  // Handle section navigation
  const handleSectionClick = (sectionIndex: number) => {
    setCurrentStep(sectionIndex);
  };

  const handleResponse = (questionId: number | string, value: unknown) => {
    setResponses((prev) => {
      if (questionId === 4) {
        return {
          ...prev,
          4: sanitizeQ4Answer(value),
        };
      }

      return {
        ...prev,
        [questionId]: value,
      };
    });
  };

  const handleNext = () => {
    // Check if all required questions in current section are answered
    const allAnswered = sectionQuestions.every((q) => {
      if (!q.required) return true;
      return isQuestionAnswered(q.id);
    });

    if (!allAnswered) {
      alert("Please answer all required questions before continuing.");
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit assessment
      submitAssessment();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const saveAssessmentMutation = trpc.assessment.saveAssessment.useMutation();

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const q15 = (responses as any)[15] || {};
      const email = String(q15.email || userEmail || "").trim();
      const fullName = [String(q15.first_name || "").trim(), String(q15.last_name || "").trim()]
        .filter(Boolean)
        .join(" ");
      const name = fullName || userName;

      if (!email || !email.includes("@")) {
        alert("Please provide a valid email in the final Contact Details question before submitting.");
        setLoading(false);
        return;
      }

      const result = determineRoute(responses);

      const complexityMap: Record<string, "low" | "medium" | "high"> = {
        simple: "low",
        standard: "medium",
        complex: "high",
      };
      const backendComplexity = complexityMap[result.complexity] || "medium";
      
      // Store responses and result in sessionStorage for Results page
      sessionStorage.setItem("assessmentResponses", JSON.stringify(responses));
      sessionStorage.setItem("assessmentResult", JSON.stringify(result));
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("userName", name);

      // Save to database
      try {
        await saveAssessmentMutation.mutateAsync({
          email,
          name,
          route: result.route,
          complexity: backendComplexity,
          devRole: result.devRole,
          projectType: result.projectType,
          timeline: result.timeline,
          budgetRange: result.budgetRange,
          topFeatures: result.topFeatures,
          responses: responses as unknown as Record<string, unknown>,
        });
      } catch (dbError) {
        console.error("Failed to save assessment to database:", dbError);
        // Continue even if database save fails
      }

      // Clear localStorage after successful submission
      localStorage.removeItem("assessment_responses");
      localStorage.removeItem("assessment_currentStep");
      localStorage.removeItem("assessment_userEmail");
      localStorage.removeItem("assessment_userName");

      // Clear backend progress
      try {
        await clearProgressMutation.mutateAsync({ email });
      } catch (error) {
        console.error("Failed to clear backend progress:", error);
      }
      
      navigate("/results");
    } catch (error) {
      console.error("Assessment submission error:", error);
      alert("Error submitting assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#F3F2EE] text-[#111110]">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(#d4d4d0 1px, transparent 1px),
            linear-gradient(90deg, #d4d4d0 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#d4d4d0] bg-[#F3F2EE]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-5 h-5 bg-black flex items-center justify-center rounded-sm transition-transform group-hover:rotate-12">
              <span className="text-white font-mono font-medium text-xs">F</span>
            </div>
            <span className="font-medium tracking-tight text-sm text-neutral-800">The Founder Link</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Section {currentSection} of {totalSteps}
            </span>

            <button
              type="button"
              onClick={() => setIsSidebarOpen((v) => !v)}
              className="sm:hidden text-xs font-mono px-2 py-1 border border-neutral-300 rounded-sm hover:bg-white/60"
            >
              {isSidebarOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </nav>

      {/* Left Sidebar Navigation */}
      <div
        className={`fixed left-0 top-14 bottom-0 w-64 bg-white/50 backdrop-blur-sm border-r border-[#d4d4d0] z-40 ${
          isSidebarOpen ? "block" : "hidden"
        } sm:block`}
      >
        <div className="p-6">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-4">Sections</div>
          <nav className="space-y-2">
            {sections.map((section, index) => {
              const isCompleted = isSectionCompleted(index);
              const isCurrent = currentStep === index;
              
              return (
                <button
                  key={section}
                  onClick={() => handleSectionClick(index)}
                  className={`w-full text-left px-3 py-2.5 rounded-sm transition-all ${
                    isCurrent
                      ? "bg-black text-white"
                      : "hover:bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center text-xs font-mono ${
                      isCurrent
                        ? "bg-white/20 text-white"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}>
                      {isCompleted && !isCurrent ? <Check className="w-3 h-3" /> : section}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        isCurrent ? "text-white" : "text-neutral-900"
                      }`}>
                        {sectionTitles[index]}
                      </div>
                      <div className={`text-xs ${
                        isCurrent ? "text-white/70" : "text-neutral-500"
                      }`}>
                        Section {section}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-8">
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-3">Questions</div>
            <div className="space-y-1">
              {sectionQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    const el = document.getElementById(`question-${q.id}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-full text-left px-3 py-2 rounded-sm hover:bg-neutral-100 text-neutral-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-neutral-500">{idx + 1}</span>
                    <span className="text-sm flex-1 truncate">{q.question}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-12 relative z-10 sm:ml-64">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              Progress
            </span>
            <span className="text-xs font-mono text-neutral-900 font-medium">
              {Math.round(((clampedCurrentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${((clampedCurrentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-8">
          <div className="inline-block px-2 py-0.5 bg-white border border-neutral-300 text-neutral-600 text-[10px] font-semibold uppercase tracking-wide rounded-sm mb-4">
            Section {currentSection}
          </div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-900">
            {clampedCurrentStep === 0 && "Start with the basics"}
            {clampedCurrentStep === 1 && "Define your MVP scope"}
            {clampedCurrentStep === 2 && "Budget and build preferences"}
            {clampedCurrentStep === 3 && "Wrap up with final details"}
          </h1>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {sectionQuestions.map((question, index) => (
            <div id={`question-${question.id}`} key={question.id} className="bg-white border border-[#d4d4d0] rounded-sm p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-neutral-100 rounded-sm flex items-center justify-center font-mono text-sm text-neutral-900">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    {question.question}
                    {question.required && <span className="text-amber-600 ml-1">*</span>}
                  </h3>
                  {question.helperText ? (
                    <p className="text-sm text-neutral-600 mb-4 whitespace-pre-line">
                      {question.helperText}
                    </p>
                  ) : null}

                  {null}

                  {/* Q11 timezone */}
                  {question.id === 11 && (
                    <div className="space-y-3">
                      <select
                        className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                        value={((responses[11] as any)?.preference as string) || ""}
                        onChange={(e) =>
                          handleResponse(11, {
                            ...((responses[11] as any) || {}),
                            preference: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select one...
                        </option>
                        {question.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {String((responses[11] as any)?.preference || "").includes("Must overlap") ? (
                        <label className="block">
                          <div className="text-sm text-neutral-700">Your timezone</div>
                          <input
                            type="text"
                            value={((responses[11] as any)?.timezone as string) || ""}
                            onChange={(e) =>
                              handleResponse(11, {
                                ...((responses[11] as any) || {}),
                                timezone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                            placeholder="e.g., PST / GMT+1"
                          />
                        </label>
                      ) : null}
                    </div>
                  )}

                  {/* Q12 problem/solution */}
                  {question.id === 12 && (
                    <div className="space-y-4">
                      <label className="block">
                        <div className="text-sm text-neutral-700">What problem does your product solve?</div>
                        <textarea
                          value={((responses[12] as any)?.problem as string) || ""}
                          onChange={(e) =>
                            handleResponse(12, {
                              ...((responses[12] as any) || {}),
                              problem: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                          rows={4}
                          maxLength={500}
                          placeholder="Describe the problem..."
                        />
                      </label>
                      <label className="block">
                        <div className="text-sm text-neutral-700">How does your product solve it?</div>
                        <textarea
                          value={((responses[12] as any)?.solution as string) || ""}
                          onChange={(e) =>
                            handleResponse(12, {
                              ...((responses[12] as any) || {}),
                              solution: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                          rows={4}
                          maxLength={500}
                          placeholder="Describe your solution..."
                        />
                      </label>
                    </div>
                  )}

                  {/* Q13 goal/metric */}
                  {question.id === 13 && (
                    <div className="space-y-4">
                      <label className="block">
                        <div className="text-sm text-neutral-700">What's your primary goal for the MVP?</div>
                        <textarea
                          value={((responses[13] as any)?.goal as string) || ""}
                          onChange={(e) =>
                            handleResponse(13, {
                              ...((responses[13] as any) || {}),
                              goal: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                          rows={2}
                          maxLength={200}
                          placeholder="e.g., Get 50 paying users..."
                        />
                      </label>
                      <label className="block">
                        <div className="text-sm text-neutral-700">What's the one metric that tells you it's working?</div>
                        <textarea
                          value={((responses[13] as any)?.metric as string) || ""}
                          onChange={(e) =>
                            handleResponse(13, {
                              ...((responses[13] as any) || {}),
                              metric: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                          rows={2}
                          maxLength={200}
                          placeholder="e.g., Monthly recurring revenue (MRR)"
                        />
                      </label>
                    </div>
                  )}

                  {/* Q14 integrations */}
                  {question.id === 14 && (
                    <div className="space-y-2">
                      {question.options?.map((option) => {
                        const currentSelections = ((responses[14] as any)?.selected as string[]) || [];
                        const isChecked = currentSelections.includes(option);
                        return (
                          <label
                            key={option}
                            className="flex items-center gap-3 p-3 border border-neutral-200 rounded-sm cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={isChecked}
                              onChange={(e) => {
                                const current = ((responses[14] as any)?.selected as string[]) || [];
                                const nextSelected = e.target.checked
                                  ? [...current, option]
                                  : current.filter((v) => v !== option);
                                handleResponse(14, {
                                  ...((responses[14] as any) || {}),
                                  selected: nextSelected,
                                });
                              }}
                              className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-sm text-neutral-900">{option}</span>
                          </label>
                        );
                      })}
                      <div className="mt-3">
                        <input
                          type="text"
                          value={((responses[14] as any)?.other as string) || ""}
                          onChange={(e) =>
                            handleResponse(14, {
                              ...((responses[14] as any) || {}),
                              other: e.target.value,
                            })
                          }
                          placeholder="Other (optional)"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Q15 contact */}
                  {question.id === 15 && (
                    <div className="space-y-4">
                      <label className="block">
                        <div className="text-sm text-neutral-700">Project name (optional)</div>
                        <input
                          type="text"
                          value={((responses[15] as any)?.project_name as string) || ""}
                          onChange={(e) =>
                            handleResponse(15, {
                              ...((responses[15] as any) || {}),
                              project_name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                          placeholder="My MVP"
                        />
                      </label>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="block">
                          <div className="text-sm text-neutral-700">First name</div>
                          <input
                            type="text"
                            value={((responses[15] as any)?.first_name as string) || ""}
                            onChange={(e) =>
                              handleResponse(15, {
                                ...((responses[15] as any) || {}),
                                first_name: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                            placeholder="First"
                          />
                        </label>
                        <label className="block">
                          <div className="text-sm text-neutral-700">Last name</div>
                          <input
                            type="text"
                            value={((responses[15] as any)?.last_name as string) || ""}
                            onChange={(e) =>
                              handleResponse(15, {
                                ...((responses[15] as any) || {}),
                                last_name: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                            placeholder="Last"
                          />
                        </label>
                      </div>

                      <label className="block">
                        <div className="text-sm text-neutral-700">Email</div>
                        <input
                          type="email"
                          value={((responses[15] as any)?.email as string) || ""}
                          onChange={(e) =>
                            handleResponse(15, {
                              ...((responses[15] as any) || {}),
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                          placeholder="you@company.com"
                        />
                      </label>
                    </div>
                  )}

                  {/* Single Choice (Radio) */}
                  {question.type === "single" && ![11].includes(question.id) && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-3 border border-neutral-200 rounded-sm cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={responses[question.id] === option}
                            onChange={(e) => handleResponse(question.id, e.target.value)}
                            className="w-4 h-4 text-black border-neutral-300 focus:ring-amber-500"
                          />
                          <span className="text-sm text-neutral-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Multiple Choice (Checkboxes) */}
                  {question.type === "multiple" && ![14].includes(question.id) && (
                    <div className="space-y-2">
                      {question.maxSelections && (
                        <p className="text-xs text-neutral-500 font-mono mb-2">
                          Select up to {question.maxSelections} options
                        </p>
                      )}
                      {question.options?.map((option) => {
                        const currentSelections = (responses[question.id] as string[]) || [];
                        const isChecked = currentSelections.includes(option);
                        const isMaxReached = Boolean(
                          question.maxSelections && currentSelections.length >= question.maxSelections
                        );

                        return (
                          <label
                            key={option}
                            className={`flex items-center gap-3 p-3 border border-neutral-200 rounded-sm cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors ${
                              isMaxReached && !isChecked ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={isChecked}
                              disabled={isMaxReached && !isChecked}
                              onChange={(e) => {
                                const current = (responses[question.id] as string[]) || [];
                                if (e.target.checked) {
                                  handleResponse(question.id, [...current, option]);
                                } else {
                                  handleResponse(
                                    question.id,
                                    current.filter((v) => v !== option)
                                  );
                                }
                              }}
                              className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-sm text-neutral-900">{option}</span>
                          </label>
                        );
                      })}
                      {/* Conditional text input for "Something else (type in)" */}
                      {question.options?.some(opt => opt.toLowerCase().includes("type in") || opt.toLowerCase().includes("something else")) && 
                       (responses[question.id] as string[])?.some(sel => sel.toLowerCase().includes("type in") || sel.toLowerCase().includes("something else")) && (
                        <div className="mt-3 pl-7">
                          <input
                            type="text"
                            value={((responses as unknown as Record<string, unknown>)[`${question.id}_other`] as string) || ""}
                            onChange={(e) => handleResponse(`${question.id}_other`, e.target.value)}
                            placeholder="Please specify..."
                            className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Input */}
                  {question.type === "text" && ![4, 12, 13, 15].includes(question.id) && (
                    <input
                      type="text"
                      value={(responses[question.id] as string) || ""}
                      onChange={(e) => handleResponse(question.id, e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                      placeholder="Type your answer..."
                    />
                  )}

                  {/* Number Input */}
                  {question.type === "number" && (
                    <input
                      type="number"
                      value={(responses[question.id] as number) || ""}
                      onChange={(e) => handleResponse(question.id, parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900"
                      placeholder="Enter a number..."
                    />
                  )}

                  {/* Searchable Multi-Select */}
                  {question.type === "searchable-multi-select" && (
                    <>
                      {question.id === 4 ? (
                        (() => {
                          const all = normalizeQ4AnswerToArray(responses[4]);
                          const selectedIds = all.filter((x) => Q4_KNOWN_IDS.has(x));
                          const otherItems = all.filter((x) => !Q4_KNOWN_IDS.has(x));
                          const used = selectedIds.length + otherItems.length;
                          const remaining = Math.max(0, 5 - used);
                          const multiDisabled = otherItems.length >= 5;
                          const otherDisabled = selectedIds.length >= 5 && otherItems.length === 0;
                          const multiLimit = Math.max(0, 5 - otherItems.length);

                          return (
                            <>
                              <SearchableMultiSelect
                                categorizedOptions={question.categorizedOptions || []}
                                value={selectedIds}
                                onChange={(value) => {
                                  const nextSelectedIds = value
                                    .map((x) => String(x || "").trim())
                                    .filter(Boolean)
                                    .filter((x) => Q4_KNOWN_IDS.has(x))
                                    .slice(0, multiLimit);

                                  const maxOther = Math.max(0, 5 - nextSelectedIds.length);
                                  const nextOtherItems = otherItems.slice(0, maxOther);
                                  handleResponse(4, [...nextSelectedIds, ...nextOtherItems]);
                                }}
                                maxSelections={5}
                                selectionLimit={multiLimit}
                                disabled={multiDisabled}
                                placeholder="Type to search or select from dropdown..."
                                enableOrdering
                              />

                              <div className="mt-4">
                                <label className="block">
                                  <div className="text-sm text-neutral-700">Other (optional)</div>
                                  <textarea
                                    value={otherItems.join("\n")}
                                    onChange={(e) => {
                                      const typed = String(e.target.value || "");
                                      const nextOtherAll = parseQ4OtherList(typed);
                                      const maxOther = Math.max(0, 5 - selectedIds.length);
                                      const nextOtherItems = nextOtherAll.slice(0, maxOther);
                                      handleResponse(4, [...selectedIds, ...nextOtherItems]);
                                    }}
                                    disabled={otherDisabled}
                                    rows={4}
                                    placeholder="Type one feature per line (or comma-separated)..."
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-neutral-900 disabled:opacity-50"
                                  />
                                </label>

                                <p className="text-xs text-neutral-500 mt-2">Up to 5 total. Remaining slots: {remaining}.</p>
                              </div>
                            </>
                          );
                        })()
                      ) : (
                      <SearchableMultiSelect
                        categorizedOptions={question.categorizedOptions || []}
                        value={
                          question.id === 4
                            ? splitQ4Answer(responses[4]).selectedIds
                            : (responses[question.id] as string[]) || []
                        }
                        onChange={(value) => {
                          if (question.id !== 4) {
                            handleResponse(question.id, value);
                            return;
                          }

                          const { other } = splitQ4Answer(responses[4]);
                          const nextSelectedIdsRaw = value
                            .map((x) => String(x || "").trim())
                            .filter(Boolean)
                            .filter((x) => Q4_KNOWN_IDS.has(x));
                          const maxForMulti = 5 - (other ? 1 : 0);
                          const nextSelectedIds = nextSelectedIdsRaw.slice(0, Math.max(0, maxForMulti));

                          if (other) {
                            handleResponse(4, [...nextSelectedIds, other]);
                          } else {
                            handleResponse(4, nextSelectedIds);
                          }
                        }}
                        maxSelections={
                          question.id === 4
                            ? Math.max(
                                0,
                                (question.maxSelections || 5) - (splitQ4Answer(responses[4]).other ? 1 : 0)
                              )
                            : question.maxSelections || 5
                        }
                        placeholder="Type to search or select from dropdown..."
                        enableOrdering={question.id === 4}
                      />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-900 rounded-sm hover:bg-neutral-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 0 ? "Home" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-sm hover:bg-neutral-800 active:scale-95 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Submitting..."
            ) : currentStep === totalSteps - 1 ? (
              <>
                Submit Assessment
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
