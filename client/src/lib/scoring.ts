export interface AssessmentResults {
  techScore: number;
  teamScore: number;
  totalScore: number;
  recommendation: string;
  description: string;
  skills: string[];
  teamStructure: string[];
}

export function calculateScores(formData: Record<string, string>): AssessmentResults {
  // Tech Complexity Score (max 12)
  let techScore = 0;

  // Q3: Integrations (0-3 points)
  if (formData.q3 === "A few") techScore += 1;
  if (formData.q3 === "Many") techScore += 3;

  // Q5: Mobile requirements (0-3 points)
  if (formData.q5 === "Simple mobile web") techScore += 1;
  if (formData.q5 === "Full mobile app") techScore += 3;

  // Q7: Security level (0-3 points)
  if (formData.q7 === "Enhanced security") techScore += 1;
  if (formData.q7 === "Strict compliance") techScore += 3;

  // Q1: Product type (0-3 points)
  const complexProducts = ["Backend API", "Web application"];
  if (complexProducts.includes(formData.q1)) techScore += 2;
  if (formData.q1 === "Mobile app") techScore += 1;

  // Team Size Score (max 12)
  let teamScore = 0;

  // Q10: Team size (0-3 points)
  if (formData.q10 === "2-3 people") teamScore += 1;
  if (formData.q10 === "4-10 people") teamScore += 2;
  if (formData.q10 === "10+ people") teamScore += 3;

  // Q14: Support duration (0-3 points)
  if (formData.q14 === "3-6 months support") teamScore += 1;
  if (formData.q14 === "Long-term (6+ months)") teamScore += 3;

  // Q18: DevOps needs (0-3 points)
  if (formData.q18 === "Some help") teamScore += 1;
  if (formData.q18 === "Full DevOps support") teamScore += 3;

  // Q22: Testing needs (0-3 points)
  if (formData.q22 === "Basic testing") teamScore += 1;
  if (formData.q22 === "Full test coverage") teamScore += 3;

  const totalScore = techScore + teamScore;

  // Determine recommendation based on scores
  let recommendation = "";
  let description = "";
  let skills: string[] = [];
  let teamStructure: string[] = [];

  if (totalScore <= 6 && formData.q9 === "Under $3K") {
    recommendation = "No-Code Builder";
    description =
      "Your project is ideal for no-code solutions. Use Bubble, Webflow, or Make to build quickly without hiring developers.";
    skills = ["No-code platform expertise", "UI/UX design", "Zapier integrations"];
    teamStructure = ["1 No-code specialist"];
  } else if (totalScore <= 12) {
    recommendation = "Single Full-Stack Developer";
    description =
      "You need one experienced full-stack developer who can handle frontend, backend, and basic DevOps.";
    skills = [
      "Full-stack development",
      "React or Vue.js",
      "Node.js or Python",
      "Database design",
      "Basic DevOps",
    ];
    teamStructure = ["1 Senior Full-Stack Developer"];
  } else if (totalScore <= 20) {
    recommendation = "2-3 Person Team";
    description =
      "Your project requires a small specialized team with clear role separation for better quality and faster delivery.";
    skills = [
      "Frontend development (React/Vue)",
      "Backend development (Node/Python)",
      "Database architecture",
      "API design",
      "Testing",
    ];
    teamStructure = [
      "1 Senior Backend Developer",
      "1 Frontend Developer",
      "1 QA/Testing specialist (part-time)",
    ];
  } else {
    recommendation = "Specialized Full Team";
    description =
      "Your project is complex and requires a full team with specialized roles across backend, frontend, DevOps, and QA.";
    skills = [
      "Advanced backend architecture",
      "Advanced frontend development",
      "DevOps/Cloud infrastructure",
      "Database optimization",
      "Security/Compliance",
      "QA automation",
    ];
    teamStructure = [
      "1 Senior Backend Engineer",
      "1 Senior Frontend Engineer",
      "1 DevOps/Infrastructure Engineer",
      "1 QA Automation Engineer",
      "1 Tech Lead/Architect (oversight)",
    ];
  }

  return {
    techScore,
    teamScore,
    totalScore,
    recommendation,
    description,
    skills,
    teamStructure,
  };
}

export function generatePDFContent(
  name: string,
  email: string,
  results: AssessmentResults
): string {
  const timestamp = new Date().toLocaleDateString();

  return `
THE FOUNDER LINK
Smart Fit Snapshot Report
Generated: ${timestamp}

CANDIDATE: ${name}
EMAIL: ${email}

---

YOUR ASSESSMENT RESULTS

Tech Complexity Score: ${results.techScore}/12
Team Size Score: ${results.teamScore}/12
Total Score: ${results.totalScore}/24

---

RECOMMENDED HIRING PROFILE

${results.recommendation}

${results.description}

---

KEY SKILLS NEEDED

${results.skills.map((skill) => `• ${skill}`).join("\n")}

---

RECOMMENDED TEAM STRUCTURE

${results.teamStructure.map((role) => `• ${role}`).join("\n")}

---

NEXT STEPS

1. Review this profile carefully
2. Share with your team to align on hiring needs
3. Reply "CONNECT" and we'll introduce you to pre-vetted developers who match this profile
4. Schedule interviews with your top candidates

---

Questions? Reply to this email or visit thefounderlink.com

Build smart,
The Founder Link Team
`;
}
