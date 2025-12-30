import type { VerticalResultsTemplate } from "./types";

export const COMMUNICATION_TEMPLATE: VerticalResultsTemplate = {
  vertical: "communication",
  routeGuidance: {
    "no-code": {
      recommendation: "Limited viability",
      reasoning: "Real-time features are difficult with no-code.",
      bestFor: ["Simple forums", "Community spaces"],
      limitations: ["Real-time chat", "Video calling", "Push notifications", "Scale"],
    },
    hybrid: {
      recommendation: "Possible with third-party SDKs",
      reasoning: "Use Stream, Twilio, Sendbird for real-time infrastructure.",
      bestFor: ["Chat features", "Video calling integration", "Community"],
      limitations: ["Vendor lock-in", "API costs at scale"],
    },
    custom: {
      recommendation: "Required for core communication products",
      reasoning: "Full control for performance, customization, cost.",
      bestFor: ["Slack/Discord competitors", "Video platforms", "Social networks"],
      limitations: ["High complexity", "Significant investment"],
    },
  },
  typicalFeatures: [
    "User profiles and presence",
    "Real-time messaging",
    "Channels or rooms",
    "Media sharing",
    "Push notifications",
    "Read receipts and typing indicators",
    "Search",
    "Moderation tools",
  ],
  techStackSuggestions: {
    "no-code": "Circle, Discourse, Mighty Networks",
    hybrid: "Next.js + Stream Chat + Twilio Video + Supabase",
    custom: "Next.js + Node.js + PostgreSQL + Redis + WebSockets",
  },
  costRanges: {
    low: { min: 15000, max: 35000 },
    medium: { min: 50000, max: 100000 },
    high: { min: 120000, max: 300000 },
  },
  timelineWeeks: {
    low: { min: 6, max: 10 },
    medium: { min: 12, max: 20 },
    high: { min: 20, max: 36 },
  },
  criticalConsiderations: [
    "Real-time infrastructure is complex and expensive",
    "Mobile apps usually essential",
    "Moderation from day one",
    "WebSocket connections are resource-intensive",
    "Data retention and privacy",
  ],
  commonMistakes: [
    "Building real-time from scratch when SDKs exist",
    "Underestimating moderation",
    "Launching without mobile",
    "Ignoring notification deliverability",
  ],
};
