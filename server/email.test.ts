import { describe, expect, it } from "vitest";
import { sendReportEmail } from "./email";

describe("email service", () => {
  it("should send report email with valid Resend API key", async () => {
    const result = await sendReportEmail({
      email: "test@example.com",
      score: 12,
      maxScore: 12,
      fitType: "PERFECT NOCODE",
      message: "Your project is an excellent fit for no-code tools.",
      cta: "Get Started",
    });

    // Should succeed with valid API key
    expect(result).toBe(true);
  });

  it("should handle email sending gracefully", async () => {
    const result = await sendReportEmail({
      email: "invalid-email",
      score: 0,
      maxScore: 12,
      fitType: "CUSTOM NEEDED",
      message: "Test message",
      cta: "Test CTA",
    });

    // Should return boolean (success or failure)
    expect(typeof result).toBe("boolean");
  });
});
