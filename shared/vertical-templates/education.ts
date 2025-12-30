import type { VerticalResultsTemplate } from "./types";

export const EDUCATION_TEMPLATE: VerticalResultsTemplate = {
  vertical: "education",
  routeGuidance: {
    "no-code": {
      recommendation: "Great for course creators",
      reasoning: "Teachable, Thinkific provide everything for selling courses.",
      bestFor: ["Video courses", "Cohort-based courses", "Membership sites"],
      limitations: ["Custom learning paths", "Gamification", "LTI/LMS integrations"],
    },
    hybrid: {
      recommendation: "Good for differentiated platforms",
      reasoning: "Existing platforms for video/payments, custom for unique experience.",
      bestFor: ["Bootcamps", "Interactive learning", "Peer-based learning"],
      limitations: ["Integration complexity", "Multiple vendors"],
    },
    custom: {
      recommendation: "For enterprise LMS or unique experiences",
      reasoning: "Enterprise LMS with SSO/SCORM, interactive learning.",
      bestFor: ["Enterprise LMS", "Interactive simulations", "Tutoring marketplaces"],
      limitations: ["Video hosting expensive", "High development cost"],
    },
  },
  typicalFeatures: [
    "Course catalog and enrollment",
    "Video lessons with progress tracking",
    "Quizzes and assessments",
    "Completion certificates",
    "Student dashboard",
    "Discussion forums",
    "Payment handling",
    "Admin dashboard",
  ],
  techStackSuggestions: {
    "no-code": "Teachable, Thinkific, Kajabi, or Circle",
    hybrid: "Next.js + Mux + Stripe + custom LMS features",
    custom: "Next.js + Node.js + PostgreSQL + Mux/Cloudflare Stream + Stripe",
  },
  costRanges: {
    low: { min: 5000, max: 15000 },
    medium: { min: 25000, max: 60000 },
    high: { min: 80000, max: 180000 },
  },
  timelineWeeks: {
    low: { min: 2, max: 6 },
    medium: { min: 8, max: 16 },
    high: { min: 16, max: 28 },
  },
  criticalConsiderations: [
    "Video hosting costs at scale",
    "Content is the product - platform is secondary",
    "Completion rates are low (3-15%)",
    "Mobile experience matters",
    "FERPA if serving K-12/higher ed",
  ],
  commonMistakes: [
    "Building platform before validating course demand",
    "Overcomplicating learning experience",
    "Not budgeting for video hosting",
    "Ignoring completion rate optimization",
    "Building custom when Teachable works",
  ],
};
