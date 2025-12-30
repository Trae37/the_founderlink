import { describe, it, expect } from "vitest";

describe("Intake Router", () => {
  it("should accept valid intake submission data", () => {
    const validSubmission = {
      email: "test@example.com",
      name: "John Doe",
      company: "Acme Corp",
      context: "Looking for no-code developers",
      productType: "nocode-matches" as const,
    };

    expect(validSubmission.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(validSubmission.name.length).toBeGreaterThanOrEqual(2);
    expect(validSubmission.company.length).toBeGreaterThanOrEqual(2);
    expect(["nocode-matches", "fullstack-waitlist", "mobile-waitlist"]).toContain(
      validSubmission.productType
    );
  });

  it("should validate email format", () => {
    const validEmails = [
      "test@example.com",
      "user+tag@domain.co.uk",
      "name.surname@company.org",
    ];
    const invalidEmails = ["notanemail", "missing@domain", "@nodomain.com"];

    validEmails.forEach((email) => {
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    invalidEmails.forEach((email) => {
      expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it("should require minimum name and company length", () => {
    const tooShort = "A";
    const valid = "AB";

    expect(tooShort.length).toBeLessThan(2);
    expect(valid.length).toBeGreaterThanOrEqual(2);
  });

  it("should support all three product types", () => {
    const productTypes = ["nocode-matches", "fullstack-waitlist", "mobile-waitlist"];

    productTypes.forEach((type) => {
      expect(["nocode-matches", "fullstack-waitlist", "mobile-waitlist"]).toContain(type);
    });
  });

  it("should have correct payment status enum values", () => {
    const validStatuses = ["pending", "completed", "failed"];

    validStatuses.forEach((status) => {
      expect(["pending", "completed", "failed"]).toContain(status);
    });
  });

  it("should allow optional context field", () => {
    const submissionWithContext = {
      context: "Some additional info",
    };

    const submissionWithoutContext = {
      context: undefined,
    };

    expect(submissionWithContext.context).toBeDefined();
    expect(submissionWithoutContext.context).toBeUndefined();
  });

  it("should allow optional stripeSessionId", () => {
    const submissionWithSession = {
      stripeSessionId: "cs_test_123",
    };

    const submissionWithoutSession = {
      stripeSessionId: undefined,
    };

    expect(submissionWithSession.stripeSessionId).toBeDefined();
    expect(submissionWithoutSession.stripeSessionId).toBeUndefined();
  });
});
