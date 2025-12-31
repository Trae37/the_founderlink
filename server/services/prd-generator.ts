import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getCoreFeaturesFromQ4Answer } from "@shared/feature-catalog";

interface AssessmentResponses {
  [key: string]: any;
}

interface PRDData {
  productName: string;
  userName: string;
  userEmail: string;
  rawResponses: AssessmentResponses;
  currentDate: string;
  problem: string;
  solution: string;
  topFeatures: string[];
  successMetrics: string;
  budgetLow: string;
  budgetHigh: string;
  timelineWeeks: string;
  primaryUser: string;
  painPoints: string[];
  platform: string;
  integrations: string[];
  security: string;
  performance: string;
  hoursPerWeek: string;
  experienceLevel: string;
  milestones: string[];
  totalBudget: string;
  route: string;
  buildPreference: string;
  productStage: string;
  productType: string;
  timezonePreference: string;
  timezone: string;
  comfortManagingDevs: string;
  previousHiringExperience: string;
}

export class PRDGenerator {
  private anthropic: Anthropic | null;

  constructor() {
    this.anthropic = null;
  }

  private getAnthropic(): Anthropic {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    if (!this.anthropic) {
      this.anthropic = new Anthropic({
        apiKey,
        timeout: 55000, // 55 second timeout to fit within Vercel's 60s limit
      });
    }

    return this.anthropic;
  }

  /**
   * Extract PRD data from assessment responses
   */
  extractPRDData(responses: AssessmentResponses, userName: string, route: string): PRDData {
    const q15 = responses[15] || {};
    const q12 = responses[12] || {};
    const q13 = responses[13] || {};
    const q14 = responses[14] || {};

    const first = String(q15.first_name || "").trim();
    const last = String(q15.last_name || "").trim();
    const fullNameFromQ15 = [first, last].filter(Boolean).join(" ");
    const resolvedUserName = String(fullNameFromQ15 || userName || "").trim() || "Founder";
    const resolvedUserEmail = String(q15.email || "").trim();

    const explicitProjectName = String(q15.project_name || "").trim();
    const fallbackName = String(q12.problem || "").trim() || "Untitled Project";
    const productName = explicitProjectName || (fallbackName.length > 50 ? fallbackName.substring(0, 50).trim() + "..." : fallbackName);

    const problem =
      (typeof q12 === "string" ? String(q12).trim() : String(q12.problem || "").trim()) ||
      "Problem description needs further exploration from client";
    const solution =
      (typeof q12 === "string" ? "" : String(q12.solution || "").trim()) ||
      "Solution summary needs further exploration from client";

    const successGoal = typeof q13 === "string" ? String(q13).trim() : String(q13.goal || "").trim();
    const successMetric = typeof q13 === "string" ? "" : String(q13.metric || "").trim();
    const successMetrics =
      successGoal && successMetric
        ? `${successGoal} (Primary metric: ${successMetric})`
        : successGoal || successMetric || "Success metrics need further exploration from client";

    const coreFeatures = getCoreFeaturesFromQ4Answer(responses[4]);
    const dayOneNeeds = Array.isArray(responses[5]) ? (responses[5] as string[]) : [];
    const integrationsFromArray = Array.isArray(responses[14]) ? (responses[14] as string[]) : [];
    const integrationsFromObject = Array.isArray((q14 as any).selected)
      ? (((q14 as any).selected as unknown) as string[])
      : [];
    const otherIntegration = String((q14 as any).other || "").trim();
    const integrations = [
      ...integrationsFromArray,
      ...integrationsFromObject,
      ...(otherIntegration ? [otherIntegration] : []),
    ];

    const q11 = responses[11] || {};
    const timezonePreference = typeof q11 === "string" ? String(q11).trim() : String(q11.preference || "").trim();
    const timezone = typeof q11 === "string" ? "" : String(q11.timezone || "").trim();

    return {
      productName,
      userName: resolvedUserName,
      userEmail: resolvedUserEmail,
      rawResponses: responses,
      currentDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      problem,
      solution,
      topFeatures: [...coreFeatures, ...dayOneNeeds, ...integrations].filter((f) => f && f !== "None of these"),
      successMetrics,
      budgetLow: this.extractBudgetRange(String(responses[6] || "")).low,
      budgetHigh: this.extractBudgetRange(String(responses[6] || "")).high,
      timelineWeeks: this.extractTimelineWeeks(String(responses[7] || "")),
      primaryUser: this.extractPrimaryUser(responses),
      painPoints: this.extractPainPoints(responses),
      platform: String(responses[3] || "") || "Platform needs further exploration from client",
      integrations,
      security: "Security requirements need further exploration from client",
      performance: "Performance requirements need further exploration from client",
      hoursPerWeek: "Hours per week need further exploration from client",
      experienceLevel: "Experience level needs further exploration from client",
      milestones: [],
      totalBudget: String(responses[6] || "") || "Budget needs further exploration from client",
      route,
      buildPreference: String(responses[8] || "").trim(),
      productStage: String(responses[1] || "").trim(),
      productType: String(responses[2] || "").trim(),
      timezonePreference,
      timezone,
      comfortManagingDevs: String(responses[9] || "").trim(),
      previousHiringExperience: String(responses[10] || "").trim(),
    };
  }

  /**
   * Extract budget range from budget string
   */
  private extractBudgetRange(budget: string): { low: string; high: string } {
    const ranges: { [key: string]: { low: string; high: string } } = {
      "Under $5,000": { low: "0", high: "5000" },
      "$5,000 - $10,000": { low: "5000", high: "10000" },
      "$5,000 – $10,000": { low: "5000", high: "10000" },
      "$10,000 - $20,000": { low: "10000", high: "20000" },
      "$10,000 – $20,000": { low: "10000", high: "20000" },
      "$20,000 - $40,000": { low: "20000", high: "40000" },
      "$20,000 – $40,000": { low: "20000", high: "40000" },
      "$40,000 - $75,000": { low: "40000", high: "75000" },
      "$40,000 – $75,000": { low: "40000", high: "75000" },
      "Over $75,000": { low: "75000", high: "150000" },
      "Not sure yet": { low: "TBD", high: "TBD" },
    };
    return ranges[budget] || { low: "TBD", high: "TBD" };
  }

  private getBudgetBand(budget: string): "under_5k" | "5_10" | "10_20" | "20_40" | "40_75" | "75_plus" | "unknown" {
    const b = String(budget || "").replace(/\u2013|\u2014/g, "-");
    if (b === "Under $5,000") return "under_5k";
    if (b === "$5,000 - $10,000") return "5_10";
    if (b === "$10,000 - $20,000") return "10_20";
    if (b === "$20,000 - $40,000") return "20_40";
    if (b === "$40,000 - $75,000") return "40_75";
    if (b === "Over $75,000") return "75_plus";
    return "unknown";
  }

  /**
   * Extract timeline in weeks from timeline string
   */
  private extractTimelineWeeks(timeline: string): string {
    const weeks: { [key: string]: string } = {
      "ASAP (1-2 months)": "4-8",
      "Standard (3-4 months)": "12-16",
      "Flexible (5+ months)": "20+",
      "Not sure yet": "TBD",
    };
    return weeks[timeline] || "TBD";
  }

  /**
   * Extract primary user from Q16 response
   */
  private extractPrimaryUser(responses: AssessmentResponses): string {
    const userType = String(responses[16] || "").trim();

    if (!userType) {
      return "Primary user needs further exploration from client";
    }

    return userType;
  }

  /**
   * Extract pain points from Q12 (product description) response
   */
  private extractPainPoints(responses: AssessmentResponses): string[] {
    const q12 = responses[12];
    const description = typeof q12 === "string"
      ? q12.trim()
      : String(q12?.problem || "").trim();
    return description ? [description] : [];
  }

  /**
   * Generate basic PRD without enhanced version (for preview)
   */
  generateBasicPRD(data: PRDData): string {
    return `**PRODUCT REQUIREMENTS DOCUMENT (PRD)**
Project: ${data.productName} | Date: ${data.currentDate} | Founder: ${data.userName}

**1. EXECUTIVE SUMMARY**
*Why: Tells developer the main problem and goal.*
- Problem: ${data.problem}
- MVP Features: ${data.topFeatures.join(", ")}
- Success: ${data.successMetrics}
- Budget: $${data.budgetLow}-$${data.budgetHigh}
- Timeline: ${data.timelineWeeks} weeks

**2. USER PERSONAS**
*Why: Shows who uses it and their needs.*
Primary: ${data.primaryUser}
Pain Points: ${data.painPoints.join(", ")}

**3. MVP SCOPE**
*Why: What gets built now vs later.*
**IN SCOPE:**
${data.topFeatures.map((f, i) => `- ${f}: [Acceptance criteria need further exploration from client]`).join("\n")}
**OUT OF SCOPE:** [Needs further exploration from client]

**4. USER FLOWS**
*Why: Steps users take.*
${data.topFeatures.slice(0, 3).map((f, i) => `${i + 1}. ${f}: [User flow needs further exploration from client]`).join("\n")}

**5. TECHNICAL REQUIREMENTS**
*Why: Exact tools to use.*
Platform: ${data.platform}
Integrations: ${data.integrations.join(", ")}
Security: ${data.security}
Performance: ${data.performance}

**6. TEAM & MILESTONES**
*Why: Who does what, when.*
Developer: ${data.hoursPerWeek}h/wk, ${data.experienceLevel}
Milestones: ${data.milestones.join(" → ")}

**7. SUCCESS METRICS**
*Why: How we measure success.*
${data.successMetrics}

**8. RISKS**
*Why: Plans for problems.*
- Scope creep: [Needs further exploration from client]
- Bad hire: Use Day 4-6 vetting process
- Tech limits: [Needs further exploration from client]

**9. BUDGET**
*Why: Money plan.*
Total: $${data.totalBudget}
Per Milestone: 25% / 35% / 40%

**10. COMMUNICATION PROTOCOL**
*Why: Set expectations for collaboration.*
${this.generateCommunicationSection(data)}

---

**HIRING OPTIONS**
${this.getHiringOptions(data.route)}
`;
  }

  /**
   * Generate basic SOW without enhanced version (for preview)
   */
  generateBasicSOW(data: PRDData): string {
    return `**STATEMENT OF WORK (SOW)**
Project: ${data.productName} | Client: ${data.userName} | Developer: TBD

**1. PROJECT OVERVIEW**
*Why: Clear goal and timeline.*
Objective: ${data.successMetrics}
Duration: ${data.timelineWeeks} weeks
Budget: $${data.totalBudget}

**2. DELIVERABLES**
*Why: What developer promises.*
Milestone 1: ${data.topFeatures[0] || "[Needs further exploration from client]"} + demo/docs
Milestone 2: ${data.topFeatures[1] || "[Needs further exploration from client]"} + demo/docs
Final: Live app + code + 2wk support

**3. ACCEPTANCE CRITERIA**
*Why: "Done" before payment.*
- Milestone 1: [Acceptance criteria need further exploration from client]
- Milestone 2: [Acceptance criteria need further exploration from client]
- Final: [Acceptance criteria need further exploration from client]

**4. PAYMENT SCHEDULE**
*Why: When money paid.*
- Milestone 1: 25% on acceptance
- Milestone 2: 35% on acceptance
- Final: 40% + 10% early bonus

**5. TEAM ROLES**
*Why: Who does what.*
Founder: [Communication preferences need further exploration from client]
Developer: Daily updates via [Preferred tools need further exploration from client]
Tools: [Tools list needs further exploration from client]

**6. CHANGE MANAGEMENT**
*Why: Handle mid-project changes.*
[Change process needs further exploration from client]

**7. TERMINATION & IP**
*Why: Safe exit, own your work.*
- 2 weeks notice either party
- Pro-rated payments to last milestone
- Full code ownership on final payment
- Mutual NDA

---

**HIRING OPTIONS**
${this.getHiringOptions(data.route)}
`;
  }

  /**
   * Generate Communication Protocol section from Q29
   */
  private generateCommunicationSection(data: PRDData): string {
    const pref = String(data.timezonePreference || "").trim();
    const tz = String(data.timezone || "").trim();
    const tzLine = tz ? `${pref} (${tz})` : pref;

    return `**Timezone Preferences:** ${tzLine || "Not specified"}
**Communication Tools:** To be agreed (Slack / Email)
**Update Cadence:** Set at kickoff based on availability and timeline`;
  }

  generateProjectClarityBrief(data: PRDData, input?: { techStackSuggestion?: string; routeReasoning?: string }): string {
    const mustHaveList = data.topFeatures.slice(0, 5);
    const postMvpList = data.topFeatures.slice(5);

    const dayOneNeeds = Array.isArray(data.rawResponses[5]) ? (data.rawResponses[5] as string[]) : [];
    const complianceLine = dayOneNeeds.find((x) => String(x).includes("Compliance")) ? "Yes" : "No";
    const timelineLabel = String(data.rawResponses[7] || "").trim();

    return `**PROJECT CLARITY BRIEF**

**1. PROJECT OVERVIEW**
- Project Name: ${data.productName}
- Founder: ${data.userName}${data.userEmail ? ` (${data.userEmail})` : ""}
- Date Generated: ${data.currentDate}

**2. THE PROBLEM**
${data.problem}

**3. THE SOLUTION**
${data.solution}

**4. TARGET USER**
${data.primaryUser}

**5. SUCCESS CRITERIA**
${data.successMetrics}

**6. MVP SCOPE**
**Must-Have Features (v1):**
${(mustHaveList.length ? mustHaveList : ["[Needs further exploration from client]"]).map((f) => `- ${f}`).join("\n")}

**Post-MVP Features (Later):**
${(postMvpList.length ? postMvpList : ["[TBD]"]).map((f) => `- ${f}`).join("\n")}

**7. CONSTRAINTS**
- Budget: ${data.totalBudget}
- Timeline: ${timelineLabel || "TBD"}
- Platform: ${data.platform}
- Compliance: ${complianceLine}
- Technical preferences: ${data.buildPreference || "Not specified"}

**8. RECOMMENDED APPROACH**
- Route: ${data.route}
- Why: ${input?.routeReasoning || "Based on your answers, this route best fits your scope and constraints."}
- Tech stack suggestion: ${input?.techStackSuggestion || "TBD"}
`;
  }

  generateHiringPlaybook(data: PRDData, input?: { developerType?: string; techStackSuggestion?: string }): string {
    const budgetBand = this.getBudgetBand(data.totalBudget);

    const engagement = budgetBand === "75_plus" ? "Contract / Full-time" : budgetBand === "under_5k" ? "Project-based" : "Contract / Part-time";
    const experience = budgetBand === "under_5k" ? "Junior / Mid" : budgetBand === "5_10" ? "Mid" : budgetBand === "10_20" ? "Mid / Senior" : "Senior";
    const timezoneLine = data.timezone ? `${data.timezonePreference} (${data.timezone})` : data.timezonePreference;
    const devType = input?.developerType || (data.route === "no-code" ? "No-code builder" : data.route === "hybrid" ? "Hybrid developer" : "Full-stack developer");

    const timelineLabel = String(data.rawResponses[7] || "").trim();

    const budgetReality = this.generateBudgetRealityParagraph(data.totalBudget);
    const platformRecs = this.generatePlatformRecommendations(data.totalBudget, data.buildPreference);

    return `**HIRING PLAYBOOK**

**1. THE ROLE YOU'RE HIRING FOR**
- Type: ${devType}
- Engagement: ${engagement}
- Experience Level: ${experience}
- Duration: ${timelineLabel || "Project-based"}
- Timezone: ${timezoneLine || "Not specified"}

**Required Skills:**
- Primary: ${input?.techStackSuggestion || "TBD"}
- Secondary: Product thinking, clear communication, reliable delivery
- Nice-to-have: Prior builds in your category (${data.productType || "TBD"})

**2. BUDGET REALITY**
Your Budget: ${data.totalBudget}

${budgetReality}

**Ways to Reduce Costs:**
- Phase scope into smaller releases
- Build only MVP features first
- Use templates/components where possible
- Avoid custom work until you have traction

**3. WHERE TO FIND THEM**
${platformRecs}

**4. HOW TO VET CANDIDATES**
**Screening Checklist (Before the Interview):**
- [ ] Portfolio includes similar projects
- [ ] Reviews/ratings are strong (if on a marketplace)
- [ ] Their proposal is specific to your project
- [ ] Communication is clear and professional
- [ ] Timeline estimate seems realistic

**Red Flags:**
- Generic copy-paste proposals
- Can't explain past work simply
- Pushes for full payment upfront
- Won't do a paid test task

**Green Flags:**
- Asks clarifying questions before estimating
- Suggests MVP approach or phasing
- Transparent about tradeoffs and risks

**5. INTERVIEW QUESTIONS**
1. Walk me through a similar project you've built.
2. What questions do you have about my project?
3. How would you approach building our core feature?
4. Tell me about a project that didn’t go well. What happened?
5. How do you handle requirement changes mid-project?

**6. REFERENCE CHECK QUESTIONS**
1. What did they build for you?
2. Did they deliver on time and on budget?
3. How was communication throughout the project?
4. Would you hire them again?

**7. TEST TASK (OPTIONAL BUT RECOMMENDED)**
Why: reduces risk significantly.
Budget: plan $100–$500 for a paid test.
What to test: a small, real part of your MVP scope.
`;
  }

  generatePRDDocument(data: PRDData, input?: { techStackSuggestion?: string }): string {
    const features = data.topFeatures.length ? data.topFeatures : ["[Needs further exploration from client]"];
    const integrations = data.integrations.length ? data.integrations : ["None specified"];

    return `**PRODUCT REQUIREMENTS DOCUMENT (PRD)**

**1. DOCUMENT INFO**
- Project: ${data.productName}
- Version: 1.0
- Last Updated: ${data.currentDate}
- Author: ${data.userName}

**2. PRODUCT OVERVIEW**
**Problem Statement:**
${data.problem}

**Solution:**
${data.solution}

**Target Users:**
${data.primaryUser}

**Success Metrics:**
${data.successMetrics}

**3. USER TYPES / PERSONAS**
| User Type | Description | Primary Goals |
|---|---|---|
| ${data.primaryUser.split('.')[0] || 'Primary user'} | ${data.primaryUser} | ${data.painPoints.length > 0 ? `Solve: ${data.painPoints[0]}` : '[TBD]'} |

**4. FEATURE SPECIFICATIONS**
${features
  .map(
    (f) => `**Feature: ${f}**\n- Priority: Must-have\n- User Story: As a user, I want to ${f.toLowerCase()} so that [benefit].\n- Description: [Detailed description needs further exploration from client]\n- Acceptance Criteria:\n  - [ ] [TBD]\n  - [ ] [TBD]\n  - [ ] [TBD]\n- Notes/Constraints: [TBD]`
  )
  .join("\n\n")}

**5. USER FLOWS**
${features.slice(0, 3).map((f, i) => `**Flow ${i + 1}: ${f}**\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]`).join("\n\n")}

**6. TECHNICAL REQUIREMENTS**
- Platform: ${data.platform}
- Integrations: ${integrations.join(", ")}
- Tech stack suggestion: ${input?.techStackSuggestion || "TBD"}
- Compliance / security: ${data.security}

**7. DESIGN REQUIREMENTS**
[Needs further exploration from client]

**8. OUT OF SCOPE (EXPLICITLY)**
${data.topFeatures.slice(3).length ? data.topFeatures.slice(3).map((f) => `- ${f}`).join("\n") : "- [TBD]"}

**9. ASSUMPTIONS**
- [Assumption 1]
- [Assumption 2]

**10. OPEN QUESTIONS**
- [ ] [Question 1]
- [ ] [Question 2]
`;
  }

  generateWorkingAgreement(data: PRDData): string {
    const deliverables = data.topFeatures.slice(0, 4);
    const duration = String(data.rawResponses[7] || "").trim() || `${data.timelineWeeks} weeks`;

    return `**WORKING AGREEMENT (TEMPLATE)**

This is a template, not legal advice. Recommend legal review before signing.

**1. PARTIES**
Client (You):
- Name: ${data.userName}
- Email: ${data.userEmail || "[From quiz]"}

Developer/Contractor:
- Name: [To be filled]
- Email: [To be filled]

Effective Date: ${data.currentDate}

**2. SCOPE OF WORK**
Project Description:
${data.problem}

Deliverables:
${(deliverables.length ? deliverables : ["Functional MVP deliverable"]).map((d, i) => `${i + 1}. ${d}`).join("\n")}

What's Included:
${(data.topFeatures.length ? data.topFeatures.map((f) => `- ${f}`) : ["- [TBD]"]).join("\n")}

What's NOT Included:
- Features not listed above
- Ongoing maintenance unless explicitly agreed

**3. TIMELINE & MILESTONES**
Total Project Duration: ${duration}
Total Project Cost: ${data.totalBudget}

| Milestone | Deliverable | Target Date | Payment |
|---|---|---|---|
| Project Kickoff | Requirements confirmed | [Date] | [Deposit] |
| Milestone 1 | ${deliverables[0] || "[Deliverable]"} | [Date] | [Amount] |
| Milestone 2 | ${deliverables[1] || "[Deliverable]"} | [Date] | [Amount] |
| Final Delivery | Complete MVP + handoff | [Date] | [Final] |

**4. PAYMENT TERMS**
- Deposit: 20–30% due upon signing
- Milestone payments: agreed at kickoff
- Final payment: due upon completion and acceptance

**5. COMMUNICATION**
- Client: ${data.userName} (${data.userEmail || ""})
- Timezone expectations: ${data.timezone ? `${data.timezonePreference} (${data.timezone})` : data.timezonePreference || "TBD"}
- Response time: within 24–48 hours (unless otherwise agreed)

**6. CHANGE REQUEST PROCESS**
1. Client submits change request in writing
2. Developer estimates time/cost impact
3. Client approves before work begins

**7. ACCEPTANCE & REVISIONS**
- Review period: 5–7 business days per milestone
- Revision rounds: 2 rounds included per milestone

**8. INTELLECTUAL PROPERTY**
Upon final payment, Client owns custom work product created for the project.

**9. CONFIDENTIALITY**
Both parties agree to keep project information confidential.

**10. TERMINATION**
- Written notice of 14 days required
- Payment due for work completed to date

**11. WARRANTIES & LIABILITY**
Total liability limited to fees paid under this agreement.

**12. GENERAL TERMS**
Governing Law: [State/Country]
Dispute Resolution: [Mediation then arbitration / courts]

**13. SIGNATURES**
Client Signature: _____________________ Date: _____________________
Developer Signature: _____________________ Date: _____________________
`;
  }

  private generateBudgetRealityParagraph(budget: string): string {
    const band = this.getBudgetBand(budget);
    if (band === "under_5k") {
      return "Your budget is tight but workable if you keep scope small and prioritize speed. Expect to provide more oversight and be very clear in documentation.";
    }
    if (band === "5_10") {
      return "You're in a workable range for a focused MVP. You can often attract mid-level freelancers for a scoped build with regular check-ins.";
    }
    if (band === "10_20") {
      return "You can attract experienced developers for a well-scoped MVP. Expect better autonomy, clearer estimates, and stronger execution.";
    }
    if (band === "20_40" || band === "40_75" || band === "75_plus") {
      return "You have budget flexibility. Consider senior talent or a small team for faster delivery and stronger quality control.";
    }
    return "Your budget wasn't specified clearly. Once you confirm the range, you can tailor the role and hiring channel more precisely.";
  }

  private generatePlatformRecommendations(budget: string, buildPreference: string): string {
    const band = this.getBudgetBand(budget);
    const prefersNoCode = String(buildPreference || "").toLowerCase().includes("no-code");

    if (prefersNoCode) {
      return "Recommended platforms for no-code specialists:\n- No-code marketplaces and communities\n- Freelance platforms with clear portfolio filters\n- Referrals from builders who ship Bubble/Webflow projects";
    }

    if (band === "under_5k") {
      return "Recommended platforms (budget-focused):\n- Freelance marketplaces with strong reviews\n- Local referrals or communities\n- Small project-based engagements";
    }

    if (band === "5_10" || band === "10_20") {
      return "Recommended platforms (balanced):\n- Freelance marketplaces (top-rated profiles)\n- Curated/vetted networks\n- Job boards for part-time contractors";
    }

    return "Recommended platforms (premium):\n- Vetted networks\n- Senior freelancer communities\n- Small agencies for fixed-scope MVP builds";
  }

  /**
   * Get hardcoded hiring options by route
   */
  private getHiringOptions(route: string): string {
    const options: { [key: string]: string } = {
      "no-code": "Reliable: vetted network | Budget: large freelance marketplaces",
      hybrid: "Reliable: vetted network | Budget: large freelance marketplaces",
      custom: "Reliable: vetted network | Budget: large freelance marketplaces",
    };
    return options[route] || "Reliable: vetted network | Budget: large freelance marketplaces";
  }

  /**
   * Enhance Project Clarity Brief with AI (for paid users)
   */
  async enhanceClarityBrief(basicBrief: string, responses: AssessmentResponses): Promise<string> {
    const prompt = `You are enhancing a Project Clarity Brief to help a developer become a true partner in building this product.

YOUR TASK: Take the founder's ACTUAL responses from the assessment and enhance them - elaborate, clarify, and make them more actionable. You are NOT creating new content - you are making their real answers more detailed and useful.

CRITICAL RULES:
- The "Original Brief" contains the founder's REAL answers - these are the source of truth
- ENHANCE what they actually said - add depth, clarity, and actionable detail
- DO NOT invent facts about the founder's specific business or make up statistics
- If something is missing, write "[Founder to clarify: specific question]"
- Quote or closely paraphrase their actual words when expanding on their answers

APPLY YOUR KNOWLEDGE:
- If the founder mentions an industry (e.g., healthcare, fintech), add relevant context about that industry's needs, regulations, and common patterns
- If they describe a product type (e.g., marketplace, SaaS), explain what typically makes that type successful
- If they mention technologies or integrations, provide context about how those work and what to consider
- Add domain expertise that helps the developer understand the business context
- This is NOT hallucinating - this is applying general knowledge to enrich their specific answers

WHAT TO ENHANCE:

**THE PROBLEM**: The founder described this in Q12. Take their exact description and:
- Rewrite it as a clear, compelling problem statement
- Break it down into specific pain points they mentioned
- If they were vague, note what clarification would help

**THE SOLUTION**: Based on Q12 and their feature selections (Q4/Q5):
- Articulate how their chosen features solve the problem they described
- Connect each feature back to the pain points
- Keep it grounded in what THEY said they want to build

**TARGET USER / ICP**: Based on their Q16 selection and Q12 context:
- Expand on the user type they selected
- Describe this user in the context of the problem they described
- What can we infer about this user from their answers? (but don't invent demographics)

**SUCCESS METRICS**: Based on their Q13 answer:
- Take their success definition and make it more specific and measurable
- What would indicate their MVP is working based on what they said?

**CONSTRAINTS**: Based on Q6 (budget), Q7 (timeline), Q3 (platform), Q8 (build preference):
- Summarize their actual constraints
- Note any tensions between their ambitions and constraints

Original Brief (contains the founder's real answers):
${basicBrief}

Assessment Responses (raw data):
${JSON.stringify(responses, null, 2)}

Return the enhanced brief maintaining the same markdown structure. Every enhancement should be traceable to something the founder actually said.`;

    const message = await this.getAnthropic().messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    return textBlock?.text || basicBrief;
  }

  /**
   * Enhance Hiring Playbook with AI (for paid users)
   */
  async enhanceHiringPlaybook(basicPlaybook: string, responses: AssessmentResponses): Promise<string> {
    const prompt = `You are enhancing a Hiring Playbook to help this specific founder find the right developer partner.

YOUR TASK: Take the founder's ACTUAL assessment responses and create tailored hiring guidance. Everything must be based on what THEY told us about their project, budget, timeline, and experience level.

CRITICAL RULES:
- The "Original Playbook" contains guidance based on their REAL answers - enhance it
- All technical skills must map directly to features they selected (Q4/Q5)
- Budget guidance must use their exact budget range from Q6 - don't invent specific rates
- All advice should account for their management comfort (Q9) and prior experience (Q10)
- DO NOT make up specific market rates or salary statistics

APPLY YOUR KNOWLEDGE:
- If they selected specific features (Q4/Q5), explain what technical skills those features typically require
- If they chose a product type (Q2), add context about what makes developers successful in that domain
- If they mentioned integrations (Q14), explain what experience with those APIs/services looks like
- Add industry context about hiring for their specific product category
- Provide general guidance about developer types, engagement models, and vetting based on their constraints
- This enriches their answers with practical expertise without inventing facts about their specific situation

WHAT TO ENHANCE:

**ROLE REQUIREMENTS**: Based on their actual selections:
- Q3 (platform) → What platform expertise is needed
- Q4/Q5 (features) → What specific technical skills these features require
- Q8 (build preference) → No-code builder vs custom developer
- Q2 (product type) → Domain experience that would help

**HIRING CONTEXT**: Based on their experience:
- Q9 (management comfort) → How much guidance do they need in the hiring process?
- Q10 (prior experience) → Tailor advice for first-time vs experienced hirers
- Q11 (timezone) → Factor in their working hour preferences

**BUDGET & TIMELINE REALITY**: Using their actual numbers:
- Q6 (budget) → What's realistic within their stated range
- Q7 (timeline) → How timeline affects hiring approach
- Be honest about tradeoffs given THEIR constraints

**INTERVIEW GUIDANCE**: Tailored to THIS project:
- Questions about THEIR specific product type (Q2)
- Questions about THEIR features (Q4/Q5)
- Questions about THEIR problem (Q12)

**SAMPLE JOB POST**: Write an actual job post for THIS project using:
- Their product description (Q12)
- Their features (Q4/Q5)
- Their budget range (Q6)
- Their timeline (Q7)

Original Playbook (based on their answers):
${basicPlaybook}

Assessment Responses (raw data):
${JSON.stringify(responses, null, 2)}

Return the enhanced playbook maintaining the same markdown structure. Every recommendation should be specific to THIS founder's situation based on their actual answers.`;

    const message = await this.getAnthropic().messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    return textBlock?.text || basicPlaybook;
  }

  /**
   * Enhance PRD with AI (for paid users)
   */
  async enhancePRD(basicPRD: string, responses: AssessmentResponses): Promise<string> {
    const prompt = `You are enhancing a Product Requirements Document (PRD) to serve as the complete "source of truth" for a developer partner.

YOUR TASK: Take the founder's ACTUAL assessment responses and transform them into a comprehensive PRD. The developer should understand not just WHAT to build, but WHY - so they can make smart decisions and contribute to the vision.

CRITICAL RULES:
- The "Original PRD" contains the founder's REAL answers - these are your source material
- ENHANCE their actual feature selections, problem description, and requirements
- DO NOT invent user data, statistics, or technical requirements they didn't mention
- If clarification is needed, write "[Developer should confirm with founder: specific question]"

APPLY YOUR KNOWLEDGE:
- If they describe a problem (Q12), add context about why this problem matters in their industry
- If they selected features (Q4/Q5), explain technical considerations and best practices for implementing them
- If they chose a platform (Q3), add relevant platform-specific requirements and patterns
- If they mentioned integrations (Q14), explain API considerations, authentication flows, and common gotchas
- If they selected compliance needs (Q5), explain what those compliance requirements typically entail
- Add architectural guidance and technical context that helps the developer make smart decisions
- This is applying expertise to their answers, not inventing facts about their specific business

WHAT TO ENHANCE:

**PRODUCT OVERVIEW**: From their Q12 description:
- Rewrite their problem statement clearly and compellingly
- Articulate their solution based on what they described
- State the core value proposition in one sentence

**TARGET USER**: From Q16 and Q12:
- Expand on the user type they selected
- Describe this user's context based on the problem they described
- What we can infer about user needs from their answers
- DO NOT invent demographics or personas - use what they told us

**FEATURE SPECIFICATIONS**: For EACH feature from Q4 and Q5:
- User Story format: As a [their Q16 user], I want [feature] so that [connect to Q12 problem]
- Acceptance criteria (5-7 bullets based on what this feature should accomplish)
- User flow (step-by-step based on logical interaction)
- Edge cases to consider
- How this feature connects to their Q14 integrations if relevant

**TECHNICAL CONTEXT**: Based on their actual choices:
- Q3 (platform) → Platform requirements and considerations
- Q8 (build preference) → Tech stack direction (no-code vs custom)
- Q14 (integrations) → Integration requirements and API needs
- Q5 (day-one needs) → Compliance, auth, payments requirements they selected

**SUCCESS CRITERIA**: From Q13:
- Expand their success definition into measurable acceptance criteria
- What would indicate the MVP is achieving its goals?

**SCOPE & CONSTRAINTS**:
- Q6 (budget) → What's realistic to build
- Q7 (timeline) → Phasing considerations
- What's explicitly MVP vs post-MVP based on their priorities

**OPEN QUESTIONS**: Things the developer should discuss with the founder:
- Ambiguities in their responses
- Technical decisions that need founder input
- Prioritization questions

Original PRD (based on their answers):
${basicPRD}

Assessment Responses (raw data):
${JSON.stringify(responses, null, 2)}

Return the enhanced PRD maintaining the same markdown structure. A developer should finish reading this knowing exactly what the founder wants and why, with enough detail to start building confidently.`;

    const message = await this.getAnthropic().messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    return textBlock?.text || basicPRD;
  }

  /**
   * Enhance Working Agreement with AI (for paid users)
   */
  async enhanceWorkingAgreement(basicAgreement: string, responses: AssessmentResponses): Promise<string> {
    const prompt = `You are enhancing a Working Agreement template to set up a successful founder-developer partnership.

YOUR TASK: Take the founder's ACTUAL assessment responses and create a practical working agreement. Use their real budget, timeline, features, and preferences - not generic templates.

CRITICAL RULES:
- The "Original Agreement" is based on their REAL answers - enhance it with specifics
- Payment amounts MUST be calculated from their Q6 budget - show actual dollar amounts
- Deliverables MUST match their Q4/Q5 features exactly
- Timeline MUST align with their Q7 answer
- DO NOT invent terms or clauses - enhance what's there with their specific details

APPLY YOUR KNOWLEDGE:
- If they selected specific features (Q4/Q5), explain what "done" typically means for those feature types
- If they chose a timeline (Q7), add context about realistic milestone pacing for their scope
- If they indicated management comfort level (Q9), suggest appropriate communication structures
- Add standard best practices for working agreements in software development
- Include typical acceptance criteria patterns for their feature types
- This adds professional structure to their answers without inventing facts about their project

WHAT TO ENHANCE:

**SCOPE OF WORK**: Using their actual features (Q4/Q5) and description (Q12):
- List THEIR specific features as deliverables
- Define what "done" means for each of THEIR features
- What's included vs excluded based on their selections

**MILESTONES & PAYMENTS**: Calculate from their ACTUAL budget (Q6) and timeline (Q7):
- If budget is "$10,000 - $20,000" → use $15,000 midpoint for calculations
- Break into 3-4 milestones with specific dollar amounts
- Tie each milestone to specific features from Q4/Q5
- Example: "Milestone 1: $3,750 (25%) - User authentication + Dashboard setup"

**TIMELINE**: Based on their Q7 answer:
- If "ASAP (1-2 months)" → 4-8 week schedule
- If "Standard (3-4 months)" → 12-16 week schedule
- Map milestones to realistic dates

**COMMUNICATION**: Based on their Q9/Q10/Q11 answers:
- Q9 (management comfort) → How much check-in do they want?
- Q10 (experience) → First-timers need more structure
- Q11 (timezone) → Specific timezone expectations

**ACCEPTANCE CRITERIA**: For their actual features:
- Write acceptance criteria for THEIR Q4/Q5 selections
- What does "complete" mean for each feature they want?

This is a TEMPLATE requiring legal review. Include that disclaimer.

Original Agreement (based on their answers):
${basicAgreement}

Assessment Responses (raw data):
${JSON.stringify(responses, null, 2)}

Return the enhanced agreement with SPECIFIC numbers from their responses - actual dollar amounts, actual features, actual timeline. The founder should see their exact project reflected in this document.`;

    const message = await this.getAnthropic().messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    return textBlock?.text || basicAgreement;
  }
}
