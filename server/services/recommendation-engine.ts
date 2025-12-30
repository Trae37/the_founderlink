import { callLLM, callLLMForJSON } from "./llm-helper";
import { ComplexityAnalyzer, ComplexityAnalysis } from "./complexity-analyzer";
import { getCoreFeaturesFromQ4Answer } from "@shared/feature-catalog";

interface AssessmentResponses {
  [key: string]: any;
}

export interface TeamMemberRecommendation {
  role: string;
  level: "junior" | "mid" | "senior";
  responsibilities: string[];
  whyNeeded: string;
}

export interface TechRecommendation {
  route: "no-code" | "hybrid" | "custom";
  stackDescription: string;
  developerType: string;
  reasoning: string;
  routeReasoning?: string;
  complexityAnalysis?: ComplexityAnalysis;
  teamBreakdown?: TeamMemberRecommendation[];
  teamSize?: number;
}

export class RecommendationEngine {
  private complexityAnalyzer: ComplexityAnalyzer;

  constructor() {
    this.complexityAnalyzer = new ComplexityAnalyzer();
  }
  /**
   * Generate AI analysis explaining WHY the route was chosen
   */
  async generateRouteReasoning(
    responses: AssessmentResponses,
    route: "no-code" | "hybrid" | "custom"
  ): Promise<string> {
    const q12 = responses[12] || {};
    const q13 = responses[13] || {};
    const q4 = responses[4] || {};
    const q14 = responses[14] || {};

    const problemDescription = typeof q12 === "string" ? q12 : String(q12.problem || "");
    const detailedDescription = typeof q12 === "string" ? "" : String(q12.solution || "");
    const buildingWhat = String(responses[2] || "");
    const buildPreference = String(responses[8] || "");

    const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);
    const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];
    const integrations = Array.isArray(responses[14])
      ? (responses[14] as string[])
      : Array.isArray((q14 as any).selected)
        ? (((q14 as any).selected as unknown) as string[])
        : [];
    const features = [...coreFeatures, ...dayOneNeeds, ...integrations]
      .filter((f, i, arr) => arr.indexOf(f) === i);
    
    const prompt = `You are a technical advisor explaining to a non-technical founder WHY a specific development approach was recommended for their project.

Based on their assessment responses, explain in 2-3 sentences why the ${route.toUpperCase()} route is the best fit for their specific needs.

Focus on:
1. What they described in their typed responses that led to this recommendation
2. How their feature requirements align with this approach
3. Why this route balances their budget, timeline, and complexity needs

Project Details:
- What they're building: ${buildingWhat}
- Problem description: ${problemDescription}
- Detailed description: ${detailedDescription}
- Features needed: ${features.join(", ")}
- Build preference: ${buildPreference}

Return ONLY the explanation text (2-3 sentences, no JSON, no markdown).`;

    // Analyze complexity first to determine which model to use
    const complexityAnalysis = await this.complexityAnalyzer.analyzeComplexity(responses);
    const isComplex = complexityAnalysis.complexity === "complex";
    const model = isComplex ? "gemini-2.0-pro-exp" : "gemini-2.0-flash-exp";

    try {
      const response = await callLLM({
        model,
        prompt,
        temperature: 0.4,
        maxTokens: 200,
      });

      return response.trim();
    } catch (error) {
      console.error("Route reasoning generation error:", error);
      return this.getFallbackRouteReasoning(route);
    }
  }

  /**
   * Generate dynamic, contextual tech stack and developer recommendations
   * based on actual quiz responses
   */
  async generateRecommendations(
    responses: AssessmentResponses,
    route: "no-code" | "hybrid" | "custom"
  ): Promise<TechRecommendation> {
    // Extract key information
    const q12 = responses[12] || {};
    const q4 = responses[4] || {};
    const q14 = responses[14] || {};
    const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];

    const problemDescription = typeof q12 === "string" ? q12 : String(q12.problem || "");

    const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);
    const integrations = Array.isArray(responses[14])
      ? (responses[14] as string[])
      : Array.isArray((q14 as any).selected)
        ? (((q14 as any).selected as unknown) as string[])
        : [];
    const features = [...coreFeatures, ...dayOneNeeds, ...integrations]
      .filter((f, i, arr) => arr.indexOf(f) === i);
    const featureCount = features.length;
    const timeline = String(responses[7] || "");
    const budget = String(responses[6] || "");
    
    const prompt = `You are a technical advisor helping a non-technical founder choose the right tech stack and team composition for their project.

Based on the assessment responses below, provide specific, accurate recommendations for:
1. Tech stack (specific tools/platforms that match their needs)
2. Developer type (specific role/expertise needed)
3. Team breakdown (if multiple developers needed, specify roles and responsibilities)

IMPORTANT RULES:
- Route is already determined as: ${route.toUpperCase()}
- For NO-CODE: Recommend specific no-code platforms (Bubble, Webflow, Softr, Glide, etc.) based on their features
- For HYBRID: Recommend specific no-code platform + where custom code is needed (e.g., "Bubble for UI + custom Node.js API for payments")
- For CUSTOM: Recommend specific tech stack (React/Vue/Next.js, Node/Python/Rails, PostgreSQL/MongoDB, etc.) based on requirements
- Be SPECIFIC - mention actual tools, not generic categories
- Base recommendations on their actual responses (features, integrations, performance needs, budget, timeline)
- Keep stack description under 100 characters
- Keep developer type under 50 characters
- If project needs multiple developers, provide detailed team breakdown with specific roles
- For team breakdown, specify: role (e.g., "Frontend React Developer"), level (junior/mid/senior), responsibilities (array of 2-3 items), and why needed
- Only include teamBreakdown if project clearly needs 2+ developers (complex features, tight timeline, or high feature count)

Project Context:
- Problem: ${problemDescription}
- Features needed: ${features.join(", ")}
- Feature count: ${featureCount}
- Timeline: ${timeline}
- Budget: ${budget}

Full Assessment Responses:
${JSON.stringify(responses, null, 2)}

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "stackDescription": "specific tools/platforms",
  "developerType": "specific role",
  "reasoning": "2-sentence explanation of why this stack fits their needs",
  "teamSize": 1 or 2 or 3 (number of developers needed),
  "teamBreakdown": [
    {
      "role": "Specific role title",
      "level": "junior" | "mid" | "senior",
      "responsibilities": ["task 1", "task 2", "task 3"],
      "whyNeeded": "One sentence explaining why this role is necessary"
    }
  ]
}`;

    // Analyze complexity first to determine which model to use
    const complexityAnalysis = await this.complexityAnalyzer.analyzeComplexity(responses);
    const isComplex = complexityAnalysis.complexity === "complex";
    const model = isComplex ? "gemini-2.0-pro-exp" : "gemini-2.0-flash-exp";

    try {
      const parsed = await callLLMForJSON({
        model,
        prompt,
        temperature: 0.3, // Lower temperature for more consistent, factual recommendations
        maxTokens: 500,
      });
      
      // Also generate route reasoning
      const routeReasoning = await this.generateRouteReasoning(responses, route);
      
      return {
        route,
        stackDescription: parsed.stackDescription,
        developerType: parsed.developerType,
        reasoning: parsed.reasoning,
        routeReasoning,
        complexityAnalysis,
        teamSize: parsed.teamSize || 1,
        teamBreakdown: parsed.teamBreakdown || undefined,
      };
    } catch (error) {
      console.error("Recommendation generation error:", error);
      
      // Fallback to basic recommendations if AI fails
      return this.getFallbackRecommendation(route);
    }
  }

  /**
   * Fallback recommendations if AI fails
   */
  private getFallbackRecommendation(route: "no-code" | "hybrid" | "custom"): TechRecommendation {
    const fallbacks = {
      "no-code": {
        route: "no-code" as const,
        stackDescription: "No-Code Platforms (Bubble, Webflow, or Softr)",
        developerType: "No-Code Builder",
        reasoning: "Based on your requirements, a no-code platform will get you to market fastest while staying within budget.",
      },
      hybrid: {
        route: "hybrid" as const,
        stackDescription: "Hybrid: No-Code UI + Custom Backend",
        developerType: "Hybrid Developer (Low-Code + Custom)",
        reasoning: "Your project needs both speed and flexibility, combining no-code tools with custom development where needed.",
      },
      custom: {
        route: "custom" as const,
        stackDescription: "Full Custom Stack (React, Node.js, PostgreSQL)",
        developerType: "Full-Stack Developer",
        reasoning: "Your requirements need a fully custom solution built from the ground up with modern web technologies.",
      },
    };

    return {
      ...fallbacks[route],
      routeReasoning: this.getFallbackRouteReasoning(route),
    };
  }

  /**
   * Fallback route reasoning if AI fails
   */
  private getFallbackRouteReasoning(route: "no-code" | "hybrid" | "custom"): string {
    const fallbacks = {
      "no-code": "Based on your project requirements and budget constraints, a no-code platform offers the fastest path to launch while keeping costs manageable. Your feature set aligns well with what modern no-code tools can deliver without custom coding.",
      hybrid: "Your project needs a balance between speed and customization. The hybrid approach lets you use no-code tools for standard features while adding custom code for specialized requirements, optimizing both timeline and capability.",
      custom: "Your requirements demand full control and scalability that only custom development can provide. The complexity of your feature set and long-term growth plans justify the investment in a fully custom solution.",
    };
    return fallbacks[route];
  }
}
