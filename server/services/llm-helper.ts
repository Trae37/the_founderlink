import { invokeLLM } from "../_core/llm";

interface SimpleLLMParams {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Extract JSON from response that might be wrapped in markdown code blocks
 */
function extractJSON(text: string): string {
  // Remove markdown code blocks if present
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  return text.trim();
}

/**
 * Simplified wrapper around invokeLLM for single-prompt use cases
 * Converts simple prompt string to messages array format
 */
export async function callLLM(params: SimpleLLMParams): Promise<string> {
  const { model, prompt, temperature = 0.7, maxTokens = 1000 } = params;
  
  const response = await invokeLLM({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  
  // Extract text content from response
  const firstChoice = response.choices[0];
  if (!firstChoice) {
    throw new Error("No response from LLM");
  }
  
  const content = firstChoice.message.content;
  if (typeof content === "string") {
    return content;
  }
  
  // Handle array of content blocks
  if (Array.isArray(content)) {
    const textBlocks = content.filter((block) => block.type === "text");
    return textBlocks.map((block) => block.text).join("\n");
  }
  
  throw new Error("Unexpected response format from LLM");
}

/**
 * Call LLM and parse JSON response (strips markdown formatting)
 */
export async function callLLMForJSON<T = any>(params: SimpleLLMParams): Promise<T> {
  const response = await callLLM(params);
  const jsonText = extractJSON(response);
  return JSON.parse(jsonText);
}
