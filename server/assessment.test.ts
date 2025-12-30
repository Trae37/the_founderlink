import { describe, it, expect } from "vitest";
import { determineRoute, AssessmentResponse } from "../client/src/lib/assessmentData";

// Note: This test imports from client-side code for testing routing logic
// In production, this logic should be moved to shared or server-side

describe("Assessment Routing Logic", () => {
  describe("No-Code Route", () => {
    it("should return no-code route for low budget, simple product, no real-time", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings"],
        5: ["None of these"],
        6: "Under $5,000",
        8: "No-code / low-code (Bubble, Webflow, etc.)",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("no-code");
    });

    it("should force custom route for compliance-heavy verticals", () => {
      const responses: AssessmentResponse = {
        2: "Fintech/Banking (payments, lending, financial tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings"],
        5: ["None of these"],
        6: "$20,000 - $40,000",
        8: "Open to either (recommend what's best)",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("custom");
    });

    it("should force custom route for healthcare vertical", () => {
      const responses: AssessmentResponse = {
        2: "Healthcare/Telemedicine (patient care, booking, health tracking)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings"],
        5: ["None of these"],
        6: "$20,000 - $40,000",
        8: "Open to either (recommend what's best)",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("custom");
    });

    it("should allow hybrid route for fintech with strong no-code preference + simple scope", () => {
      const responses: AssessmentResponse = {
        2: "Fintech/Banking (payments, lending, financial tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings"],
        5: ["None of these"],
        6: "Under $5,000",
        8: "No-code / low-code (Bubble, Webflow, etc.)",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("hybrid");
    });

    it("should return no-code route for mid budget, web app, no compliance", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings"],
        5: ["User authentication (login/signup)"],
        6: "$10,000 - $20,000",
        8: "No-code / low-code (Bubble, Webflow, etc.)",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("no-code");
    });

    it("should have simple complexity for small MVP", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings"],
        5: ["None of these"],
        6: "Under $5,000",
        8: "No-code / low-code (Bubble, Webflow, etc.)",
      };

      const result = determineRoute(responses);
      expect(result.complexity).toBe("simple");
    });
  });

  describe("Hybrid Route", () => {
    it("should return hybrid route for mid budget with moderate complexity", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings", "Data export"],
        5: ["Payments / subscriptions"],
        6: "$20,000 - $40,000",
        8: "Open to either (recommend what's best)",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("hybrid");
    });

    it("should have standard complexity for mid-range project", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings", "Data export"],
        5: ["User authentication (login/signup)"],
        6: "$10,000 - $20,000",
        8: "Open to either (recommend what's best)",
      };

      const result = determineRoute(responses);
      expect(result.complexity).toBe("standard");
    });
  });

  describe("Custom Route", () => {
    it("should return custom route for high budget", () => {
      const responses: AssessmentResponse = {
        2: "Analytics/Data Platform (dashboards, reporting, BI tools)",
        3: "Web only",
        4: ["Dashboard / home", "Analytics dashboard", "Reports", "Data import", "Data export"],
        5: ["Third-party integrations"],
        6: "Over $75,000",
        8: "Custom code",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("custom");
    });

    it("should return custom route for real-time + compliance needs", () => {
      const responses: AssessmentResponse = {
        2: "Communication Platform (chat, video, social network, forums)",
        3: "Web only",
        4: ["Email/password login", "In-app chat", "In-app notifications", "Settings"],
        5: [
          "Real-time features (chat, notifications, live updates)",
          "Compliance (HIPAA, SOC2, GDPR, PCI)",
        ],
        6: "$20,000 - $40,000",
        8: "Custom code",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("custom");
    });

    it("should return custom route for many features", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web only",
        4: [
          "Email/password login",
          "Dashboard / home",
          "Settings",
          "Data import",
          "Data export",
        ],
        5: ["Third-party integrations"],
        6: "$10,000 - $20,000",
        8: "Open to either (recommend what's best)",
      };

      const result = determineRoute(responses);
      expect(result.route).toBe("custom");
    });

    it("should have complex complexity for large projects", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web + Mobile",
        4: ["Email/password login", "Dashboard / home", "Settings", "Data import", "Data export"],
        5: [
          "Real-time features (chat, notifications, live updates)",
          "Mobile app (native or PWA)",
          "Third-party integrations",
        ],
        6: "Over $75,000",
        8: "Custom code",
      };

      const result = determineRoute(responses);
      expect(result.complexity).toBe("complex");
    });
  });

  describe("Mobile App Detection", () => {
    it("should penalize no-code score for mobile app requirement", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web + Mobile",
        4: ["Email/password login", "Dashboard / home", "Settings"],
        5: ["Mobile app (native or PWA)"],
        6: "$10,000 - $20,000",
        8: "Custom code",
      };

      const result = determineRoute(responses);
      // Mobile app + custom preference should push to custom route
      expect(result.route).toBe("custom");
    });
  });

  describe("Result Recommendations", () => {
    it("should provide recommendation text for no-code route", () => {
      const responses: AssessmentResponse = {
        2: "Business SaaS (CRM, project management, team tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings"],
        5: ["None of these"],
        6: "Under $5,000",
        8: "No-code / low-code (Bubble, Webflow, etc.)",
      };

      const result = determineRoute(responses);
      expect(result.recommendation).toContain("no-code");
      expect(result.reasoning).toBeTruthy();
    });

    it("should provide recommendation text for custom route", () => {
      const responses: AssessmentResponse = {
        2: "Fintech/Banking (payments, lending, financial tools)",
        3: "Web only",
        4: ["Email/password login", "Dashboard / home", "Settings", "Invoices / receipts"],
        5: ["Payments / subscriptions"],
        6: "Over $75,000",
        8: "Custom code",
      };

      const result = determineRoute(responses);
      expect(result.recommendation).toContain("full-stack");
      expect(result.reasoning).toBeTruthy();
    });
  });
});
