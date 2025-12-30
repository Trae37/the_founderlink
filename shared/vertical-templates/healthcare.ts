import type { VerticalResultsTemplate } from "./types";

export const HEALTHCARE_TEMPLATE: VerticalResultsTemplate = {
  vertical: "healthcare",
  routeGuidance: {
    "no-code": {
      recommendation: "Not recommended for patient data",
      reasoning: "HIPAA compliance requires strict controls no-code can't provide.",
      bestFor: ["Marketing sites", "Non-PHI scheduling", "General wellness"],
      limitations: ["Cannot store PHI", "No HIPAA compliance", "No telehealth"],
    },
    hybrid: {
      recommendation: "Possible with HIPAA-compliant backend",
      reasoning: "No-code for non-sensitive, compliant backend for patient data.",
      bestFor: ["Appointment scheduling", "Patient intake", "Simple telehealth"],
      limitations: ["PHI must stay compliant", "Increased complexity"],
    },
    custom: {
      recommendation: "Required for most healthcare",
      reasoning: "HIPAA, EHR integrations, strict security require custom.",
      bestFor: ["Telemedicine", "Patient portals", "EHR integrations", "Health tracking"],
      limitations: ["High cost", "Regulatory overhead", "Long timeline"],
    },
  },
  typicalFeatures: [
    "Secure patient authentication",
    "Appointment scheduling",
    "Video consultations (HIPAA-compliant)",
    "Patient intake forms",
    "Medical records access",
    "Prescription management",
    "Secure messaging",
    "Billing and insurance",
  ],
  techStackSuggestions: {
    "no-code": "Not recommended for PHI",
    hybrid: "Webflow + HIPAA backend + Doxy.me",
    custom: "Next.js + Node.js + PostgreSQL (encrypted) + AWS HIPAA + Twilio HIPAA",
  },
  costRanges: {
    low: { min: 50000, max: 100000 },
    medium: { min: 120000, max: 250000 },
    high: { min: 300000, max: 600000 },
  },
  timelineWeeks: {
    low: { min: 14, max: 24 },
    medium: { min: 24, max: 40 },
    high: { min: 40, max: 60 },
  },
  criticalConsiderations: [
    "HIPAA compliance is mandatory",
    "BAAs required with ALL vendors handling PHI",
    "State telemedicine regulations vary",
    "EHR integration (HL7/FHIR) is complex",
    "Video must be HIPAA-compliant",
  ],
  commonMistakes: [
    "Using non-HIPAA-compliant tools",
    "Not signing BAAs",
    "Underestimating state regulations",
    "Building EHR integration before validation",
    "Using consumer video for telehealth",
  ],
};
