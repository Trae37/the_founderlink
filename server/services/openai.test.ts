import { describe, it, expect } from "vitest";
import OpenAI from "openai";

describe("OpenAI API Integration", () => {
  it("should validate OpenAI API key with a simple completion", async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^sk-/);

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Say 'API key valid' if you can read this.",
        },
      ],
      max_tokens: 10,
    });

    expect(completion.choices[0].message.content).toBeTruthy();
    expect(completion.choices[0].message.content?.toLowerCase()).toContain("valid");
  }, 15000); // 15 second timeout for API call
});
