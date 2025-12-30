import OpenAI from "openai";
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
  private openai: OpenAI | null;

  constructor() {
    this.openai = null;
  }

  private getOpenAI(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    if (!this.openai) {
      this.openai = new OpenAI({ apiKey });
    }

    return this.openai;
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
      primaryUser: "Primary user needs further exploration from client",
      painPoints: [], // Not currently captured in assessment
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
[Derived from your description: needs further refinement]

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
[Needs further exploration from client]

**Success Metrics:**
${data.successMetrics}

**3. USER TYPES / PERSONAS**
| User Type | Description | Primary Goals |
|---|---|---|
| Primary user | [TBD] | [TBD] |

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
   * Enhance PRD with AI (for paid users)
   */
  async enhancePRD(basicPRD: string, responses: AssessmentResponses): Promise<string> {
    const prompt = `You are a technical product manager helping a non-technical founder create a clear PRD for developers.

Given this basic PRD with placeholder text, enhance it by:
1. Adding technical clarity for developers (e.g., specific tech stack recommendations, API requirements)
2. Adding founder-friendly explanations in parentheses after technical terms
3. Generating 3-step user flows for each feature
4. Creating 3 bullet acceptance criteria for each feature
5. Keeping "[Needs further exploration from client]" for truly vague answers

Original PRD:
${basicPRD}

Assessment Responses:
${JSON.stringify(responses, null, 2)}

Return the enhanced PRD in the same format, but with:
- Technical details added for developers
- Founder-friendly explanations in (parentheses)
- Concrete user flows (3 steps each)
- Specific acceptance criteria (3 bullets each)
- Keep the same structure and section headers`;

    const completion = await this.getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    return completion.choices[0].message.content || basicPRD;
  }

  /**
   * Enhance SOW with AI (for paid users)
   */
  async enhanceSOW(basicSOW: string, responses: AssessmentResponses): Promise<string> {
    const prompt = `You are a technical product manager helping a non-technical founder create a clear SOW for developers.

Given this basic SOW with placeholder text, enhance it by:
1. Adding specific deliverables for each milestone
2. Creating concrete acceptance criteria (3 bullets per milestone)
3. Adding technical details for developers
4. Adding founder-friendly explanations in parentheses
5. Keeping "[Needs further exploration from client]" for truly vague answers

Original SOW:
${basicSOW}

Assessment Responses:
${JSON.stringify(responses, null, 2)}

Return the enhanced SOW in the same format, but with:
- Specific deliverables per milestone
- Concrete acceptance criteria (3 bullets each)
- Technical details for developers
- Founder-friendly explanations in (parentheses)
- Keep the same structure and section headers`;

    const completion = await this.getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content || basicSOW;
  }
}
