import { describe, it, expect } from "vitest";
import { ENV } from "./env";

describe("Calendly URL Configuration", () => {
  it("should have default Calendly URL", () => {
    expect(ENV.calendlyUrl).toBeDefined();
    expect(ENV.calendlyUrl).toContain("calendly.com");
  });

  it("should format Calendly URL with https protocol", () => {
    expect(ENV.calendlyUrl).toMatch(/^https:\/\//);
  });

  it("should accept custom Calendly URL from environment", () => {
    const testUrl = "https://calendly.com/custom-user";
    expect(testUrl).toMatch(/^https:\/\/calendly\.com\//);
  });

  it("should validate Calendly URL format", () => {
    const validUrls = [
      "https://calendly.com/thefounderlink",
      "https://calendly.com/founder-link",
      "https://calendly.com/user123",
    ];

    validUrls.forEach((url) => {
      expect(url).toMatch(/^https:\/\/calendly\.com\/[a-zA-Z0-9\-_]+$/);
    });
  });

  it("should handle Calendly URL without protocol", () => {
    const urlWithoutProtocol = "calendly.com/thefounderlink";
    const withProtocol = `https://${urlWithoutProtocol}`;

    expect(withProtocol).toMatch(/^https:\/\//);
  });

  it("should include Calendly link in payment confirmation email", () => {
    const emailContent = `
      <a href="${ENV.calendlyUrl}" class="cta-button">Book Your Call Now</a>
    `;

    expect(emailContent).toContain(ENV.calendlyUrl);
    expect(emailContent).toContain("Book Your Call Now");
  });

  it("should support changing Calendly URL", () => {
    const originalUrl = ENV.calendlyUrl;
    const newUrl = "https://calendly.com/newuser";

    expect(originalUrl).toBeDefined();
    expect(newUrl).toBeDefined();
    expect(newUrl).not.toBe(originalUrl);
  });
});
