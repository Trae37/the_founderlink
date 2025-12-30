import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { getCostEstimate, type Route, type Complexity } from "@/../../shared/cost-estimator";
import { generateOptimizationPlan, type CostOptimizationPlan } from "@/../../shared/cost-optimizer";
import { generateMVPPhaseBreakdown, generateCostOptimizationStrategies, type MVPPhaseBreakdown } from "@/../../shared/mvp-phaser";
import { RouteResult } from "@/lib/assessmentData";
import { determineRoute } from "@/lib/assessmentData";
import { getCoreFeaturesFromQ4Answer } from "@shared/feature-catalog";
import { generateClarityBriefLite } from "@shared/free-tier/clarity-brief-lite";
import { migrateProductType } from "@shared/utils/product-type-migrator";
import { toBackendComplexity } from "@shared/utils/complexity-mapper";
import { getTemplateForProductType } from "@shared/vertical-templates";
import DocumentSkeleton from "@/components/DocumentSkeleton";
import WaitlistSignup from "@/components/WaitlistSignup";
import CostOptimization from "@/components/CostOptimization";
import Methodology from "@/components/Methodology";
import UserAnswers from "@/components/UserAnswers";
import RouteReasoning from "@/components/RouteReasoning";
import RealisticRangeCard from "@/components/RealisticRangeCard";
import SourcingOptions from "@/components/SourcingOptions";

import PhasedDevelopmentCard from "@/components/PhasedDevelopmentCard";
import BudgetRealityCard from "@/components/BudgetRealityCard";
import { CheckCircle2, Calendar, DollarSign, Users, ArrowRight, Download } from "lucide-react";
import type { TechRecommendation } from "../../../server/services/recommendation-engine";

export default function Results() {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [showUpgrade, setShowUpgrade] = useState(true);
  const [blueprintFormat, setBlueprintFormat] = useState<"docx" | "md">("docx");
  const [clarityBriefPreview, setClarityBriefPreview] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [techRecommendation, setTechRecommendation] = useState<TechRecommendation | null>(null);
  const [optimizationPlan, setOptimizationPlan] = useState<CostOptimizationPlan | null>(null);
  const [costEstimate, setCostEstimate] = useState<ReturnType<typeof getCostEstimate> | null>(null);
  const [mvpPhaseBreakdown, setMvpPhaseBreakdown] = useState<MVPPhaseBreakdown | null>(null);
  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation();
  const sendWebhookMutation = trpc.webhook.sendAssessmentWebhook.useMutation();

  const rawProductType = String((responses as any)?.[2] || "").trim();
  const migratedProductType = migrateProductType(rawProductType);
  const verticalTemplate = getTemplateForProductType(migratedProductType);

  const downloadMarkdown = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAllSelectedFeatures = () => {
    const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);

    const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];
    const integrations = Array.isArray(responses[14])
      ? (responses[14] as string[])
      : Array.isArray((responses[14] as any)?.selected)
        ? (((responses[14] as any).selected as unknown) as string[])
        : [];

    return [...coreFeatures, ...dayOneNeeds, ...integrations]
      .filter((f) => f && f !== "None of these")
      .filter((f, i, arr) => arr.indexOf(f) === i);
  };

  useEffect(() => {
    const isDevTestSeed = sessionStorage.getItem("dev_test_seed") === "1";
    const storedResultRaw = sessionStorage.getItem("assessmentResult");
    const storedResponsesRaw = sessionStorage.getItem("assessmentResponses");
    const localResponsesRaw = isDevTestSeed ? localStorage.getItem("assessment_responses") : null;

    let parsedResponses: Record<number, any> | null = null;

    const tryParse = (raw: string | null) => {
      if (!raw) return null;
      try {
        return JSON.parse(raw) as Record<number, any>;
      } catch {
        return null;
      }
    };

    const sessionResponses = tryParse(storedResponsesRaw);
    const localResponses = tryParse(localResponsesRaw);

    parsedResponses = sessionResponses || localResponses;
    if (isDevTestSeed && sessionResponses && localResponses) {
      const merged: Record<number, any> = { ...sessionResponses };
      for (const k of Object.keys(localResponses)) {
        const key = Number(k);
        const fromLocal = (localResponses as any)[key];
        if (merged[key] === undefined || (key >= 11 && key <= 14)) {
          (merged as any)[key] = fromLocal;
        }
      }
      parsedResponses = merged;
    }

    if (!parsedResponses) return;

    setResponses(parsedResponses);
    if (isDevTestSeed) {
      sessionStorage.setItem("assessmentResponses", JSON.stringify(parsedResponses));
    }

    const computedResult = storedResultRaw
      ? (JSON.parse(storedResultRaw) as RouteResult)
      : isDevTestSeed
        ? determineRoute(parsedResponses as any)
        : null;

    if (!computedResult) return;

    setResult(computedResult);
    if (isDevTestSeed) {
      sessionStorage.setItem("assessmentResult", JSON.stringify(computedResult));
    }

    void (async () => {
      try {
      const coreFeatures = getCoreFeaturesFromQ4Answer(parsedResponses[4]);

      const dayOneNeeds = Array.isArray(parsedResponses[5]) ? (parsedResponses[5] as string[]) : [];
      const integrations = Array.isArray(parsedResponses[14])
        ? (parsedResponses[14] as string[])
        : Array.isArray((parsedResponses[14] as any)?.selected)
          ? (((parsedResponses[14] as any).selected as unknown) as string[])
          : [];

      const featureArray = [...coreFeatures, ...dayOneNeeds, ...integrations].filter(
        (f, i, arr) => arr.indexOf(f) === i
      );

      const backendComplexity: Complexity = toBackendComplexity(computedResult.complexity);

      const q12 = parsedResponses[12];
      const q13 = parsedResponses[13];
      const q12Text =
        typeof q12 === "string"
          ? q12
          : [q12?.problem, q12?.solution].map((x: any) => String(x || "").trim()).filter(Boolean).join(" ");
      const q13Text =
        typeof q13 === "string"
          ? q13
          : [q13?.goal, q13?.metric].map((x: any) => String(x || "").trim()).filter(Boolean).join(" ");
      const projectDescription = [q12Text, q13Text]
        .map((x: any) => String(x || "").trim())
        .filter(Boolean)
        .join(" ");

      const productType = migrateProductType(String(parsedResponses[2] || "").trim());
      const selectedCategory = productType;
      const effectiveCategory = selectedCategory;

      const estimate = getCostEstimate(
        computedResult.route as Route,
        backendComplexity,
        featureArray,
        parsedResponses[7],
        projectDescription,
        effectiveCategory
      );
      setCostEstimate(estimate);

      const plan = generateOptimizationPlan(
        computedResult.route as Route,
        backendComplexity,
        parsedResponses[6] || "$10,000 - $20,000",
        parsedResponses[7] || "Standard (3-4 months)",
        "Just me (1 person)",
        featureArray,
        String(parsedResponses[13]?.goal || "")
      );

      setOptimizationPlan(plan);

      const allFeatures = featureArray;
      if (allFeatures.length > 0) {
        const fallbackHourlyRates: Record<Route, number> = {
          "no-code": 90,
          hybrid: 105,
          custom: 107,
        };

        const senior = estimate.seniorEstimate;
        const hourlyRate = senior
          ? senior.budgetMin / (Math.max(1, senior.timelineWeeks.min) * 40 * Math.max(1, senior.teamCount || 1))
          : fallbackHourlyRates[computedResult.route as Route] || 100;

        const mvpBreakdown = generateMVPPhaseBreakdown(
          allFeatures,
          effectiveCategory || productType || "web-app",
          computedResult.route as Route,
          backendComplexity,
          hourlyRate,
          projectDescription
        );
        setMvpPhaseBreakdown(mvpBreakdown);
      }
      } catch (error) {
        console.error("Failed to generate cost estimate and optimization plan:", error);
      }
    })();
  }, []);

  const handleFreeSnapshot = async () => {
    setShowUpgrade(false);
    setIsGeneratingPreview(true);
    
    // Get user info from session storage
    const userEmail = sessionStorage.getItem("userEmail") || "";
    const userName = sessionStorage.getItem("userName") || "";

    // Send webhook for free snapshot
    try {
      const webhookComplexity: "low" | "medium" | "high" = toBackendComplexity(result?.complexity || "standard");

      const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);

      const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];
      const integrations = Array.isArray(responses[14])
        ? (responses[14] as string[])
        : Array.isArray((responses[14] as any)?.selected)
          ? (((responses[14] as any).selected as unknown) as string[])
          : [];
      const topFeatures = [...coreFeatures, ...dayOneNeeds, ...integrations]
        .filter((f) => f && f !== "None of these")
        .filter((f, i, arr) => arr.indexOf(f) === i);

      await sendWebhookMutation.mutateAsync({
        email: userEmail,
        name: userName,
        route: result?.route || "no-code",
        complexity: webhookComplexity,
        devRole: result?.route === "no-code" ? "no-code-builder" : result?.route === "hybrid" ? "hybrid-developer" : "fullstack-developer",
        projectType: migrateProductType(String((responses[2] as string) || "").trim()) || "web-app",
        timeline: (responses[7] as string) || "Standard (3-4 months)",
        budgetRange: (responses[6] as string) || "$10,000 - $20,000",
        topFeatures,
        responses,
        eventType: "free",
      });
    } catch (error) {
      console.error("Webhook error:", error);
      // Don't block user flow if webhook fails
    }

    // Generate free document
    try {
      const fullBrief = generateClarityBriefLite({
        responses,
        route: result?.route || "no-code",
        complexity: result?.complexity || "standard",
      });

      setClarityBriefPreview(fullBrief);
      setShowPreview(true);

      downloadMarkdown("project-clarity-brief.md", fullBrief);
    } catch (error) {
      console.error("Clarity brief generation error:", error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handlePaidBlueprint = async () => {
    try {
      const userEmail = sessionStorage.getItem("userEmail") || "";
      if (!userEmail) {
        alert("Please enter your email before upgrading so we can deliver your Blueprint.");
        return;
      }

      setIsLoading(true);
      const response = await createCheckoutMutation.mutateAsync({ 
        productType: "prd-sow-tripwire",
        blueprintFormat,
        assessmentEmail: userEmail,
      });
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F3F2EE] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">No Results Found</h1>
          <p className="text-neutral-600 mb-8">Please complete the assessment first.</p>
          <button
            onClick={() => navigate("/assessment")}
            className="bg-black text-white px-6 py-3 rounded-sm hover:bg-neutral-800 transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const getRecommendationCard = () => {
    const { route, complexity, recommendation, reasoning } = result;

    const routeKey = route as Route;

    const routeColors: { [key: string]: string } = {
      "no-code": "bg-emerald-50 border-emerald-300",
      hybrid: "bg-amber-50 border-amber-300",
      custom: "bg-purple-50 border-purple-300",
    };

    const routeTextColors: { [key: string]: string } = {
      "no-code": "text-emerald-900",
      hybrid: "text-amber-900",
      custom: "text-purple-900",
    };

    const routeLabels: { [key: string]: string } = {
      "no-code": "No-Code Route",
      hybrid: "Hybrid Route",
      custom: "Custom Development Route",
    };

    return (
      <div className={`${routeColors[route]} border-2 rounded-sm p-8`}>
        <div className="mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-600">Your Recommended Path</span>
          <h2 className={`text-3xl font-medium mt-2 tracking-tight ${routeTextColors[route]}`}>{routeLabels[route]}</h2>
        </div>
        <p className="text-lg mb-4 text-neutral-800">{recommendation}</p>
        
        {/* Recommended Stack */}
        <div className="mt-6 pt-6 border-t border-neutral-300">
          <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-600 mb-3">Recommended Stack</h3>
          {techRecommendation ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Tech Stack</p>
                  <p className="font-medium text-neutral-900">{techRecommendation.stackDescription}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Developer Type Needed</p>
                  <p className="font-medium text-neutral-900">{techRecommendation.developerType}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-700 italic">{techRecommendation.reasoning}</p>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-600 mb-1">Tech Stack</p>
                <p className="font-medium text-neutral-900">
                  {verticalTemplate.techStackSuggestions[routeKey] ||
                    (route === "no-code"
                      ? "No-Code Platforms (Bubble, Webflow, Softr)"
                      : route === "hybrid"
                        ? "Low-Code + Custom (Supabase, Next.js, Tailwind)"
                        : "Full Custom Stack (React, Node.js, PostgreSQL)")}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 mb-1">Developer Type Needed</p>
                <p className="font-medium text-neutral-900">
                  {route === "no-code" && "No-Code Builder"}
                  {route === "hybrid" && "Hybrid Developer (Low-Code + Custom)"}
                  {route === "custom" && "Full-Stack Developer"}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-300">
          <span className="text-sm font-mono text-neutral-600">Complexity Level: <strong className="text-neutral-900">{complexity.toUpperCase()}</strong></span>
        </div>
      </div>
    );
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
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Your Results</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 relative z-10">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 border border-neutral-300 bg-white px-3 py-1.5 rounded-sm shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-xs font-mono text-neutral-600 font-medium">ASSESSMENT COMPLETE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
            Your Smart Fit Snapshot
          </h1>
          <p className="text-xl text-neutral-600 font-light">
            Based on your answers, here's exactly what you need to succeed
          </p>
        </div>

        {/* Main Recommendation Card */}
        <div className="mb-12">{getRecommendationCard()}</div>

        {/* Snapshot / Blueprint CTA (moved near the top) */}
        {showUpgrade && (
          <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
            <h3 className="text-2xl font-medium text-neutral-900 mb-4 tracking-tight">Choose Your Next Step</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Option */}
              <div className="border border-neutral-300 rounded-sm p-6 hover:border-neutral-400 transition-colors">
                <div className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-semibold uppercase tracking-wide rounded-sm mb-3">Free</div>
                <h4 className="text-lg font-medium text-neutral-900 mb-2">Keep my free Smart Fit Snapshot</h4>
                <p className="text-sm text-neutral-600 mb-4">Download your Project Clarity Brief</p>
                <button
                  onClick={handleFreeSnapshot}
                  className="w-full border border-neutral-300 text-neutral-900 px-4 py-2 rounded-sm hover:bg-neutral-50 transition-colors font-medium"
                >
                  Download Clarity Brief
                </button>
              </div>

              {/* Paid Option */}
              <div className="border-2 border-amber-400 rounded-sm p-6 bg-amber-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200 -mr-10 -mt-10 rounded-full blur-2xl opacity-50"></div>
                <div className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold uppercase tracking-wide rounded-sm mb-3">Recommended</div>
                <h4 className="text-lg font-medium text-neutral-900 mb-2">Upgrade to Full Blueprint for $149</h4>
                <p className="text-sm text-neutral-700 mb-4">Unlock Hiring Playbook, PRD, and Working Agreement (plus the enhanced Clarity Brief)</p>
                <button
                  onClick={handlePaidBlueprint}
                  disabled={isLoading}
                  className="w-full bg-black text-white px-4 py-2 rounded-sm hover:bg-neutral-800 active:scale-95 transition-all font-medium shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? "Processing..." : "Upgrade for $149"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isGeneratingPreview && (
          <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
            <h3 className="text-2xl font-medium text-neutral-900 mb-4 tracking-tight">Generating Your Documents</h3>
            <p className="text-neutral-600 mb-6">Please wait while we create your Project Clarity Brief...</p>
            <DocumentSkeleton />
          </div>
        )}

        {/* User's Assessment Answers */}
        {Object.keys(responses).length > 0 && (
          <UserAnswers responses={responses} />
        )}

        {/* Route Reasoning - Why this route was chosen */}
        {result && (
          <RouteReasoning
            route={result.route}
            reasoning={result.reasoning}
            aiAnalysis={
              techRecommendation?.routeReasoning ||
              verticalTemplate.routeGuidance[result.route as Route].reasoning
            }
          />
        )}

        {/* NEW PRICING STRUCTURE */}
        
        {/* 1. Realistic Range - Top summary */}
        {costEstimate && (() => {
          const teamOptions = costEstimate.teamOptions || [];
          const minFromTeams = teamOptions.length
            ? Math.min(...teamOptions.map((t) => t.totalCost.min))
            : costEstimate.budgetMin;
          const maxFromTeams = teamOptions.length
            ? Math.max(...teamOptions.map((t) => t.totalCost.max))
            : costEstimate.budgetMax;

          return (
            <RealisticRangeCard
              minCost={minFromTeams}
              maxCost={maxFromTeams}
              route={result.route}
            />
          );
        })()}

        {/* 2. Phased Development - MVP breakdown with team options */}
        {mvpPhaseBreakdown && (
          <PhasedDevelopmentCard
            phaseBreakdown={mvpPhaseBreakdown}
            route={result.route}
            teamOptions={costEstimate?.teamOptions}
          />
        )}

        {mvpPhaseBreakdown && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 bg-white border border-neutral-200 rounded-sm flex items-center justify-center">
                <Calendar className="w-4 h-4 text-neutral-700" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-900">Timeline disclaimer</div>
                <div className="text-sm text-neutral-600 mt-1">
                  Timelines are estimates assuming a 40-hour work week and may vary based on developer output,
                  scope changes, and feedback cycles.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Budget Reality - What user can afford */}
        {costEstimate && responses[6] && (
          <BudgetRealityCard
            userBudget={responses[6] as string}
            teamOptions={costEstimate.teamOptions}
            route={result.route}
            mvpCost={mvpPhaseBreakdown?.mvpCostEstimate}
          />
        )}

        {/* Sourcing Options - Where to find developers */}
        {result && (
          <SourcingOptions
            route={result.route}
            complexity={result.complexity}
            teamOptions={costEstimate?.teamOptions}
          />
        )}

        {/* Methodology */}
        {result && (
          <Methodology
            route={result.route}
            complexity={result.complexity}
            featureCount={getAllSelectedFeatures().length}
            complexityAnalysis={techRecommendation?.complexityAnalysis}
          />
        )}
        
        {/* Cost Optimization Recommendations */}
        {optimizationPlan && <CostOptimization plan={optimizationPlan} />}

        {/* PRD/SOW Preview (shown after free snapshot) */}
        {showPreview && clarityBriefPreview && (
          <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-medium text-neutral-900 mb-2 tracking-tight">Your Project Clarity Brief</h3>
                <p className="text-neutral-600">Download your Clarity Brief below.</p>
              </div>
              <button
                onClick={() => {
                  downloadMarkdown("project-clarity-brief.md", clarityBriefPreview);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-sm hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
            <p className="text-neutral-600 mb-6 text-sm">Upgrade to $149 to unlock Hiring Playbook, PRD, and Working Agreement.</p>
            
            <div className="space-y-8">
              {/* Project Clarity Brief */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-neutral-900">Project Clarity Brief</h4>
                  <span className="text-xs font-mono text-neutral-500 uppercase">Included</span>
                </div>
                <pre className="text-neutral-700 text-sm whitespace-pre-wrap font-mono overflow-x-auto bg-white p-4 rounded-sm border border-neutral-200">
                  {clarityBriefPreview}
                </pre>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-neutral-600 text-sm italic">Save this file and share it with developers when requesting quotes.</p>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="text-center bg-amber-50 border border-amber-300 rounded-sm p-6">
                <h4 className="text-lg font-medium text-neutral-900 mb-2">Want the complete version?</h4>
                <p className="text-neutral-700 mb-4 text-sm">Unlock the Hiring Playbook, full PRD, and Working Agreement</p>
                <div className="mb-4 max-w-sm mx-auto text-left">
                  <label className="block text-xs font-mono text-neutral-600 uppercase tracking-wider mb-2">
                    Choose your delivery format
                  </label>
                  <select
                    value={blueprintFormat}
                    onChange={(e) => setBlueprintFormat(e.target.value as "docx" | "md")}
                    className="w-full bg-white border border-neutral-300 rounded-sm px-3 py-2 text-sm"
                    disabled={isLoading}
                  >
                    <option value="docx">Word (.docx)</option>
                    <option value="md">Markdown (.md)</option>
                  </select>
                  <p className="mt-2 text-xs text-neutral-600">
                    PDF is coming soon.
                  </p>
                </div>
                <button
                  onClick={handlePaidBlueprint}
                  disabled={isLoading}
                  className="bg-black text-white px-8 py-3 rounded-sm hover:bg-neutral-800 active:scale-95 transition-all font-medium shadow-md inline-flex items-center gap-2"
                >
                  {isLoading ? "Processing..." : "Upgrade to Full Blueprint for $149"}
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
          <h3 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">Your Next Steps</h3>
          <div className="space-y-4">
            <StepCard
              number="1"
              title="Choose Your Path"
              description="Download your free Project Clarity Brief, or upgrade for $149 to unlock the Hiring Playbook, PRD, and Working Agreement"
            />
            <StepCard
              number="2"
              title="Check Your Email"
              description="Your documents will arrive in your inbox within minutes in your chosen format (Word or Markdown) - ready to share with developers"
            />
            <StepCard
              number="3"
              title="Use the Blueprint to Hire"
              description="Use the PRD + Working Agreement to get accurate quotes and protect scope"
            />
          </div>
        </div>

        {/* Waitlist Signup */}
        <div className="mb-8">
          <WaitlistSignup />
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-[#d4d4d0] rounded-sm p-8 mb-8 shadow-sm">
          <h3 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <FAQItem
              question="How long until I receive my documents?"
              answer="If you upgraded to the Full Blueprint ($149), you'll receive your documents via email within 5-10 minutes. Check your spam folder if you don't see it in your inbox."
            />
            <FAQItem
              question="What formats are the documents available in?"
              answer="You can choose to receive your Blueprint in Word (.docx) or Markdown (.md) at checkout. PDF support is coming soon."
            />
            <FAQItem
              question="Can I request revisions to the documents?"
              answer="The documents are generated based on your assessment responses. If you need changes, you can edit the Word version directly or reach out to us at support@founderlink.com for guidance."
            />
            <FAQItem
              question="What's included in the enhanced version?"
              answer="The enhanced version adds technical clarity, detailed user flows, acceptance criteria for each feature, and implementation recommendations tailored to your project's complexity and requirements."
            />
            <FAQItem
              question="What if I have questions about my Blueprint?"
              answer="Feel free to reach out to us at support@founderlink.com with any questions about your documents or next steps. We're here to help you succeed!"
            />
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="border border-neutral-300 text-neutral-900 px-6 py-3 rounded-sm hover:bg-neutral-50 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#d4d4d0] rounded-sm p-6 text-center shadow-sm hover:border-neutral-400 transition-colors">
      <div className="flex justify-center mb-3 text-neutral-600">{icon}</div>
      <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider mb-2">{title}</p>
      <p className="text-neutral-900 font-medium text-lg">{value}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-200 last:border-0 pb-6 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-4 text-left group"
      >
        <span className="font-medium text-neutral-900 group-hover:text-amber-700 transition-colors">
          {question}
        </span>
        <span className="text-neutral-400 group-hover:text-amber-600 transition-colors flex-shrink-0">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <p className="mt-3 text-neutral-700 text-sm leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-10 w-10 rounded-sm bg-black text-white font-mono font-medium shadow-sm">
          {number}
        </div>
      </div>
      <div>
        <h4 className="text-neutral-900 font-medium mb-1">{title}</h4>
        <p className="text-neutral-600">{description}</p>
      </div>
    </div>
  );
}
