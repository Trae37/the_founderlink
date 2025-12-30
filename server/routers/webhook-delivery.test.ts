import { describe, it, expect } from "vitest";

describe("Webhook Delivery Test", () => {
  it("should successfully send test payload to Zapier webhook", async () => {
    const webhookUrl = process.env.BEEHIIV_WEBHOOK_URL;
    
    expect(webhookUrl).toBeDefined();
    expect(webhookUrl).toContain("hooks.zapier.com");

    const testPayload = {
      email: "test@founderlink.com",
      name: "Test User",
      dev_role: "no-code-builder",
      project_type: "landing-page",
      timeline: "4-6-weeks",
      budget_range: "under-3000",
      top_features: [
        "Let people sign up / log in",
        "Charge people money (subscriptions or one-time)"
      ],
      route: "no-code",
      complexity: "low",
      event_type: "free",
      stripe_session_id: "",
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });
});
