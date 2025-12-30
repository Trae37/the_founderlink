import { callLLMForJSON } from "./llm-helper";
import { getCoreFeaturesFromQ4Answer } from "@shared/feature-catalog";

interface AssessmentResponses {
  [key: string]: any;
}

export interface ComplexityAnalysis {
  complexity: "simple" | "standard" | "complex";
  confidence: number;
  reasoning: string;
  enrichedDescription: string;
  detectedFeatures: string[];
  technicalRequirements: string[];
  integrationNeeds: string[];
  scalabilityNeeds: string[];
}

export class ComplexityAnalyzer {
  /**
   * Analyze project complexity based on typed responses and feature selections
   * This runs BEFORE recommendations to determine true complexity
   */
  async analyzeComplexity(responses: AssessmentResponses): Promise<ComplexityAnalysis> {
    const q12 = responses[12] || {};
    const q4 = responses[4] || {};
    const q14 = responses[14] || {};

    const problemDescription = String(q12.problem || "");
    const detailedDescription = String(q12.solution || "");
    const mustHaveTools = [
      ...(Array.isArray(q14.selected) ? (q14.selected as string[]) : []),
      ...(String(q14.other || "").trim() ? [String(q14.other).trim()] : []),
    ].join(", ");
    const anythingElse = "";

    const primaryFeatures = getCoreFeaturesFromQ4Answer(responses[4]);
    const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];
    const existingTools: string[] = [];
    
    // Build comprehensive context
    const fullContext = `
Product Type: ${String(responses[2] || "")}
Platform: ${String(responses[3] || "")}
Build Preference: ${String(responses[8] || "")}
Budget: ${String(responses[6] || "")}
Timeline: ${String(responses[7] || "")}
Problem: ${problemDescription}
Detailed Description: ${detailedDescription}
Must-Have Tools/Rules: ${mustHaveTools}
Additional Requirements: ${anythingElse}
Primary Features: ${primaryFeatures.join(", ")}
Day-One Needs: ${dayOneNeeds.join(", ")}
Existing Tools: ${existingTools.join(", ")}
`.trim();

    const prompt = `You are a technical project analyst. Analyze this software project description and determine its TRUE complexity level.

COMPLEXITY DEFINITIONS:
- SIMPLE: Landing pages, basic websites, simple forms, content display, minimal interactivity, no user accounts
- STANDARD: Web apps with user accounts, basic dashboards, standard CRUD operations, simple integrations, typical SaaS features
- COMPLEX: Multi-tenant systems, real-time features, complex data processing, multiple integrations, advanced security/compliance, scalability requirements, admin systems with permissions

ANALYZE FOR:
1. **Keyword signals** indicating complexity:
   - Complex: "multi-tenant", "admin dashboard", "analytics", "real-time", "API", "integrations", "payments", "user roles", "permissions", "scale", "security", "compliance", "HIPAA", "SOC2", "enterprise"
   - Standard: "user accounts", "dashboard", "notifications", "uploads", "basic admin", "subscriptions"
   - Simple: "landing page", "contact form", "blog", "portfolio", "static", "basic"

2. **Technical requirements** mentioned or implied:
   - Authentication systems
   - Payment processing
   - Data analytics/reporting
   - Third-party integrations
   - Real-time updates
   - Mobile apps
   - Compliance requirements

3. **Enrichment** - If description is vague, infer likely requirements based on:
   - Industry context
   - Common patterns for similar products
   - Features that typically go together

4. **Scalability indicators**:
   - Multiple user types/roles
   - Large data volumes
   - High traffic expectations
   - Complex business logic

PROJECT DESCRIPTION:
${fullContext}

Return ONLY a JSON object (no markdown, no explanation):
{
  "complexity": "simple" | "standard" | "complex",
  "confidence": 0.0-1.0 (how confident you are in this assessment),
  "reasoning": "2-3 sentence explanation of why this complexity level",
  "enrichedDescription": "Enhanced version of their description with inferred requirements filled in (2-3 sentences)",
  "detectedFeatures": ["feature1", "feature2", ...] (key features identified from description),
  "technicalRequirements": ["req1", "req2", ...] (technical needs like "user authentication", "payment processing"),
  "integrationNeeds": ["integration1", ...] (third-party services needed),
  "scalabilityNeeds": ["need1", ...] (scaling considerations if any)
}`;

    try {
      const parsed = await callLLMForJSON({
        model: "gemini-2.0-flash-exp", // Use Flash for analysis, save Pro for recommendations
        prompt,
        temperature: 0.2, // Low temperature for consistent analysis
        maxTokens: 800,
      });
      
      return {
        complexity: parsed.complexity,
        confidence: parsed.confidence,
        reasoning: parsed.reasoning,
        enrichedDescription: parsed.enrichedDescription,
        detectedFeatures: parsed.detectedFeatures || [],
        technicalRequirements: parsed.technicalRequirements || [],
        integrationNeeds: parsed.integrationNeeds || [],
        scalabilityNeeds: parsed.scalabilityNeeds || [],
      };
    } catch (error) {
      console.error("Complexity analysis error:", error);
      
      // Fallback to keyword-based analysis if AI fails
      return this.fallbackKeywordAnalysis(fullContext, primaryFeatures, dayOneNeeds);
    }
  }

  /**
   * Fallback keyword-based complexity analysis if AI fails
   */
  private fallbackKeywordAnalysis(
    context: string,
    primaryFeatures: any[],
    dayOneNeeds: any[]
  ): ComplexityAnalysis {
    const lowerContext = context.toLowerCase();
    
    // Complex indicators
    const complexKeywords = [
      "multi-tenant", "admin dashboard", "analytics", "real-time", "api", 
      "integrations", "payments", "user roles", "permissions", "scale",
      "security", "compliance", "hipaa", "soc2", "enterprise", "saas"
    ];
    
    // Standard indicators
    const standardKeywords = [
      "user accounts", "login", "dashboard", "notifications", "uploads",
      "subscription", "profile", "settings"
    ];
    
    // Simple indicators
    const simpleKeywords = [
      "landing page", "contact form", "blog", "portfolio", "static", "basic"
    ];
    
    const complexMatches = complexKeywords.filter(k => lowerContext.includes(k)).length;
    const standardMatches = standardKeywords.filter(k => lowerContext.includes(k)).length;
    const simpleMatches = simpleKeywords.filter(k => lowerContext.includes(k)).length;
    
    // Check for complex day-one needs
    const hasComplexFeatures = dayOneNeeds.some((need: string) =>
      need.includes("Payments") ||
        need.includes("Real-time") ||
        need.includes("Mobile") ||
        need.includes("Compliance")
    );
    
    let complexity: "simple" | "standard" | "complex";
    let reasoning: string;
    
    if (complexMatches >= 2 || hasComplexFeatures) {
      complexity = "complex";
      reasoning = "Project requires advanced features like integrations, real-time updates, or complex business logic that demand custom development.";
    } else if (standardMatches >= 2 || primaryFeatures.length >= 3) {
      complexity = "standard";
      reasoning = "Project needs user accounts, dashboards, and standard web app features typical of modern SaaS products.";
    } else {
      complexity = "simple";
      reasoning = "Project is primarily focused on content display and basic interactivity without complex backend requirements.";
    }
    
    return {
      complexity,
      confidence: 0.6, // Lower confidence for fallback
      reasoning,
      enrichedDescription: context.substring(0, 200) + "...",
      detectedFeatures: primaryFeatures.map((f) => String(f)),
      technicalRequirements: [],
      integrationNeeds: [],
      scalabilityNeeds: [],
    };
  }
}
