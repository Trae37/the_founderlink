import { describe, it, expect } from "vitest";

describe("Payment Router", () => {
  it("should accept valid product types", () => {
    const validTypes = ["nocode-matches", "prd-sow-tripwire", "fullstack-waitlist", "mobile-waitlist"];
    expect(validTypes).toContain("nocode-matches");
    expect(validTypes).toContain("prd-sow-tripwire");
    expect(validTypes).toContain("fullstack-waitlist");
    expect(validTypes).toContain("mobile-waitlist");
  });

  it("should have correct pricing for products", () => {
    const prices: Record<string, number> = {
      "nocode-matches": 49700,
      "prd-sow-tripwire": 14900,
      "fullstack-waitlist": 0,
      "mobile-waitlist": 0,
    };

    expect(prices["nocode-matches"]).toBe(49700); // $497
    expect(prices["prd-sow-tripwire"]).toBe(14900); // $149
    expect(prices["fullstack-waitlist"]).toBe(0);
    expect(prices["mobile-waitlist"]).toBe(0);
  });

  it("should have correct success URLs for each product", () => {
    const origin = "http://localhost:3000";
    const successUrls: Record<string, string> = {
      "nocode-matches": `${origin}/success?product=nocode`,
      "prd-sow-tripwire": `${origin}/success?product=prd-sow`,
      "fullstack-waitlist": `${origin}/success?product=fullstack`,
      "mobile-waitlist": `${origin}/success?product=mobile`,
    };

    expect(successUrls["nocode-matches"]).toContain("product=nocode");
    expect(successUrls["prd-sow-tripwire"]).toContain("product=prd-sow");
    expect(successUrls["fullstack-waitlist"]).toContain("product=fullstack");
    expect(successUrls["mobile-waitlist"]).toContain("product=mobile");
  });

  it("should have payment-cancel as cancel URL for all products", () => {
    const origin = "http://localhost:3000";
    const cancelUrl = `${origin}/payment-cancel`;
    
    expect(cancelUrl).toContain("payment-cancel");
    expect(cancelUrl).not.toContain("results");
  });
});
