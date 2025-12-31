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
        timeout: 25000, // 25 second timeout per call
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
    const mvpFeatures = features.slice(0, 5);
    const postMvpFeatures = features.slice(5);

    return `**PRODUCT REQUIREMENTS DOCUMENT (PRD)**

**1. DOCUMENT INFO**
- Project: ${data.productName}
- Version: 1.0
- Last Updated: ${data.currentDate}
- Author: ${data.userName}
- Status: Ready for Developer Review

---

**2. EXECUTIVE SUMMARY**

**Problem Statement:**
${data.problem}

**Solution:**
${data.solution}

**Target Users:**
${data.primaryUser}

**Success Metrics:**
${data.successMetrics}

**MVP Scope:** ${mvpFeatures.length} core features | **Timeline:** ${data.timelineWeeks} weeks | **Budget:** ${data.totalBudget}

---

**3. TARGET USER PROFILE**

**Primary User Type:** ${data.primaryUser.split('.')[0] || 'Primary user'}

**User Context:**
${data.primaryUser}

**Pain Points This Product Solves:**
${data.painPoints.length > 0 ? data.painPoints.map(p => `- ${p}`).join("\n") : "- [AI will expand based on problem statement]"}

**User Goals:**
- [AI will generate based on problem/solution]

---

**4. MVP FEATURE SPECIFICATIONS**

${mvpFeatures
  .map(
    (f, i) => `### Feature ${i + 1}: ${f}

**Priority:** P${i === 0 ? '0 - Critical' : i < 3 ? '1 - High' : '2 - Medium'}

**User Story:**
As a ${data.primaryUser.split('.')[0] || 'user'}, I want to ${f.toLowerCase()} so that [AI will connect to problem statement].

**Acceptance Criteria:**
- [ ] [AI will generate 5-7 specific, testable criteria]
- [ ] [Based on feature type and industry standards]
- [ ] [Include edge cases]

**User Flow:**
1. User [action]
2. System [response]
3. User [sees/does]
4. [Complete flow]

**Technical Notes:**
- [AI will add implementation considerations]
- [Integration points if applicable]`
  )
  .join("\n\n---\n\n")}

---

**5. DATA MODEL (CORE ENTITIES)**

*[AI will generate based on features - example structure:]*

| Entity | Key Fields | Relationships |
|--------|------------|---------------|
| User | id, email, name, created_at | has_many: [related entities] |
| [Entity2] | [fields] | [relationships] |
| [Entity3] | [fields] | [relationships] |

---

**6. API ENDPOINTS (IF APPLICABLE)**

*[AI will generate if building custom/hybrid - example structure:]*

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/[resource] | Create new [resource] | Yes |
| GET | /api/[resource]/:id | Get [resource] by ID | Yes |

---

**7. TECHNICAL REQUIREMENTS**

**Platform:** ${data.platform}
**Build Approach:** ${data.buildPreference || 'Not specified'}
**Tech Stack:** ${input?.techStackSuggestion || "[AI will recommend based on requirements]"}

**Integrations Required:**
${integrations.map(i => `- ${i}: [AI will add implementation notes]`).join("\n")}

**Security & Compliance:**
${data.security || "Standard security practices"}

---

**8. POST-MVP FEATURES (BACKLOG)**

${postMvpFeatures.length ? postMvpFeatures.map((f, i) => `${i + 1}. ${f}`).join("\n") : "- Features beyond MVP scope to be defined after launch"}

---

**9. OUT OF SCOPE (EXPLICITLY)**

The following are NOT included in this MVP:
- Features not listed in Section 4
- Mobile apps (unless specified in platform)
- Advanced analytics/reporting
- Multi-language support
- [AI will add based on context]

---

**10. ASSUMPTIONS & DEPENDENCIES**

**Assumptions:**
- [AI will generate based on requirements]
- [Technical assumptions]
- [Business assumptions]

**Dependencies:**
- Third-party services: ${integrations.join(", ") || "None specified"}
- [AI will add relevant dependencies]

---

**11. OPEN QUESTIONS FOR FOUNDER**

*[AI will generate specific questions based on gaps in requirements]*

- [ ] [Question about unclear requirement]
- [ ] [Prioritization question]
- [ ] [Technical decision needing input]

---

**12. GLOSSARY**

*[AI will define any domain-specific terms used]*

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
    const prompt = `INSTRUCTION: Generate the enhanced Project Clarity Brief immediately. Do NOT ask questions. Output ONLY the final document in markdown. Start with "**PROJECT CLARITY BRIEF**".

Enhance this Project Clarity Brief to help a developer become a true partner in building this product.

CRITICAL RULES:
- Output ONLY the enhanced brief in markdown format
- DO NOT ask for confirmation or include preamble
- START your response with "**PROJECT CLARITY BRIEF**"
- ENHANCE the founder's actual answers with depth and clarity
- DO NOT invent facts - apply domain expertise to enrich their answers

WHAT TO ENHANCE:

**THE PROBLEM**: Rewrite as a clear, compelling problem statement with specific pain points.

**THE SOLUTION**: Articulate how their chosen features solve the problem.

**TARGET USER / ICP**: Expand on the user type with context from the problem they described.

**SUCCESS METRICS**: Make their success definition more specific and measurable.

**CONSTRAINTS**: Summarize budget, timeline, platform constraints. Note any tensions.

APPLY YOUR KNOWLEDGE:
- Add industry context (healthcare, fintech, etc.)
- Add product type patterns (marketplace, SaaS, etc.)
- Add integration/technology context

Original Brief:
${basicBrief}

Assessment Responses:
${JSON.stringify(responses, null, 2)}

BEGIN OUTPUT (start with "**PROJECT CLARITY BRIEF**"):`;

    const message = await this.getAnthropic().messages.create({
      model: "claude-3-5-haiku-20241022",
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
    const prompt = `INSTRUCTION: Generate the enhanced Hiring Playbook immediately. Do NOT ask questions. Output ONLY the final document in markdown. Start with "**HIRING PLAYBOOK**".

Enhance this Hiring Playbook with tailored guidance for this specific founder's project.

CRITICAL RULES:
- Output ONLY the enhanced playbook in markdown format
- DO NOT ask for confirmation or include preamble
- START your response with "**HIRING PLAYBOOK**"
- Base all recommendations on their ACTUAL assessment answers
- Apply your expertise to their specific situation

WHAT TO ENHANCE:

**ROLE REQUIREMENTS**: Map their features (Q4/Q5) to specific technical skills needed.

**BUDGET REALITY**: Use their exact budget (Q6) and be honest about tradeoffs.

**INTERVIEW GUIDANCE**: Tailor questions to their product type and features.

**SAMPLE JOB POST**: Write a COMPLETE, ready-to-post job listing for their project using their problem (Q12), features (Q4/Q5), budget (Q6), and timeline (Q7).

APPLY YOUR KNOWLEDGE:
- What skills their specific features require
- Hiring patterns for their product type
- Realistic expectations for their budget range

Original Playbook:
${basicPlaybook}

Assessment Responses:
${JSON.stringify(responses, null, 2)}

BEGIN OUTPUT (start with "**HIRING PLAYBOOK**"):`;

    const message = await this.getAnthropic().messages.create({
      model: "claude-3-5-haiku-20241022",
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
    const prompt = `INSTRUCTION: Generate the complete PRD document immediately. Do NOT ask questions or request confirmation. Output ONLY the final PRD markdown content.

You are creating a DEVELOPER-READY Product Requirements Document (PRD). A developer should be able to read this and start building immediately.

YOUR TASK: Replace ALL placeholders (anything in [brackets]) with REAL, SPECIFIC content based on the founder's assessment answers and your domain expertise.

CRITICAL RULES:
- DO NOT leave any [placeholders] or [TBD] in your output
- DO NOT ask for confirmation or clarification
- DO NOT include preamble like "Here is the PRD" or "I'll generate..."
- START your response with "**PRODUCT REQUIREMENTS DOCUMENT (PRD)**"
- Output ONLY the PRD content in markdown format

SOURCE MATERIAL:
- The "Original PRD" contains the founder's actual answers from their assessment
- Use their EXACT feature selections, problem description, and requirements as your foundation
- Then ENHANCE with your knowledge of industry standards and best practices

GENERATE THESE SECTIONS WITH REAL CONTENT:

**EXECUTIVE SUMMARY**: Rewrite their problem/solution clearly and compellingly.

**TARGET USER PROFILE**:
- Expand their user type into a real profile
- List 3-5 specific pain points based on the problem they described
- List 3-5 user goals this product helps achieve

**FOR EACH FEATURE**:
- User Story: "As a [user type], I want to [feature] so that [benefit]."
- Acceptance Criteria: 5-7 SPECIFIC, TESTABLE criteria like:
  - [ ] User can create an account with email and password
  - [ ] System validates email format before submission
  - [ ] Password must be at least 8 characters with 1 number
- User Flow: Step-by-step interaction flow
- Technical Notes: Implementation considerations

**DATA MODEL**: Generate entity tables with fields and relationships based on features.

**API ENDPOINTS**: If custom build, generate RESTful endpoints table.

**INTEGRATIONS**: For each integration, explain API, auth method, and implementation notes.

**OPEN QUESTIONS**: 3-5 specific questions for the founder about gaps in requirements.

APPLY YOUR DOMAIN EXPERTISE:
- Marketplace → add listings, transactions, reviews entities
- SaaS → add subscription/billing considerations
- Specific integrations → explain implementation patterns
- Compliance needs → explain typical requirements

Original PRD (contains their real answers):
${basicPRD}

Assessment Responses (raw data):
${JSON.stringify(responses, null, 2)}

BEGIN OUTPUT (start with "**PRODUCT REQUIREMENTS DOCUMENT (PRD)**"):`;

    const message = await this.getAnthropic().messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4000, // PRD needs more tokens for complete developer-ready content
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    return textBlock?.text || basicPRD;
  }

  /**
   * Enhance Working Agreement with AI (for paid users)
   */
  async enhanceWorkingAgreement(basicAgreement: string, responses: AssessmentResponses): Promise<string> {
    const prompt = `INSTRUCTION: Generate the enhanced Working Agreement immediately. Do NOT ask questions. Output ONLY the final document in markdown. Start with "**WORKING AGREEMENT (TEMPLATE)**".

Enhance this Working Agreement with specific details from the founder's project.

CRITICAL RULES:
- Output ONLY the enhanced agreement in markdown format
- DO NOT ask for confirmation or include preamble
- START your response with "**WORKING AGREEMENT (TEMPLATE)**"
- Include disclaimer that this requires legal review
- Use ACTUAL numbers from their responses

WHAT TO ENHANCE:

**SCOPE OF WORK**: List their exact features (Q4/Q5) as deliverables with "done" definitions.

**MILESTONES & PAYMENTS**: Calculate from their budget (Q6):
- Use midpoint of their range for calculations
- Break into 3-4 milestones with dollar amounts
- Example: "Milestone 1: $3,750 (25%) - User auth + Dashboard"

**TIMELINE**: Map their Q7 timeline to specific milestone dates.

**ACCEPTANCE CRITERIA**: Define "complete" for each of their features.

Original Agreement:
${basicAgreement}

Assessment Responses:
${JSON.stringify(responses, null, 2)}

BEGIN OUTPUT (start with "**WORKING AGREEMENT (TEMPLATE)**"):`;

    const message = await this.getAnthropic().messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    return textBlock?.text || basicAgreement;
  }
}
