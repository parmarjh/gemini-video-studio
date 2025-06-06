
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AnalyzedScript, GeminiScriptAnalysisResponse } from '../types';

const getAiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not defined in environment variables.");
    // Throwing an error here ensures it's handled by the caller
    throw new Error("API Key is not configured. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};


export const analyzeScriptWithGemini = async (script: string, modelName: string): Promise<AnalyzedScript> => {
  const ai = getAiClient();
  if (!ai) {
    // This path should ideally not be hit if getAiClient throws, but as a safeguard:
    throw new Error("Gemini AI client could not be initialized.");
  }

  const prompt = `
You are an AI script analyzer for a video creation platform. Analyze the following video script.
For each paragraph, provide:
1. The original paragraph text.
2. A concise topic (2-5 words).
3. An array of 3-5 relevant keywords for B-roll visuals.
4. The dominant emotional tone (e.g., Neutral, Joyful, Serious, Energetic, Calm, Professional, Inspirational, Humorous).

Return your analysis as a JSON object with a single key "segments", which is an array of objects. Each object in the "segments" array should have the following structure:
{
  "paragraphText": "The original text of the paragraph...",
  "topic": "Concise topic...",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "tone": "Detected tone"
}

Ensure the entire output is a valid JSON object starting with { and ending with }. Do not include any explanatory text, comments, or markdown formatting like \`\`\`json ... \`\`\` around the JSON object.

Script:
---
${script}
---
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json", // Request JSON directly
            temperature: 0.2, // Lower temperature for more deterministic analysis
        },
    });

    let jsonStr = response.text.trim();
    
    // Strip markdown fences if present, as per Gemini API guidelines
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim(); // Trim the extracted content itself
    }
    
    // Attempt to parse the JSON string
    try {
      const parsedData = JSON.parse(jsonStr) as GeminiScriptAnalysisResponse;
      if (parsedData && parsedData.segments && Array.isArray(parsedData.segments)) {
        // Basic validation of segment structure
        const isValid = parsedData.segments.every(segment => 
            typeof segment.paragraphText === 'string' &&
            typeof segment.topic === 'string' &&
            Array.isArray(segment.keywords) &&
            typeof segment.tone === 'string' &&
            segment.keywords.every(kw => typeof kw === 'string')
        );
        if (isValid) {
             return parsedData;
        } else {
            console.error("Parsed JSON has invalid segment structure:", parsedData);
            throw new Error("Received invalid data structure from AI. Please check the script or try again.");
        }
      } else {
        console.error("Parsed JSON is not in the expected format (missing segments array):", parsedData);
        throw new Error("AI response is not in the expected format. Please try again.");
      }
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e);
      console.error("Raw Gemini response text (after attempting to strip markdown):", jsonStr);
      // Provide a more user-friendly error, including a snippet of the problematic string
      const snippet = jsonStr.substring(0, 200) + (jsonStr.length > 200 ? "..." : "");
      throw new Error(`Failed to parse AI response. The response format was invalid. Raw snippet: ${snippet}`);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API Key not valid")) {
        throw new Error("Invalid API Key. Please check your API_KEY environment variable.");
    }
     // If the error is from the JSON parsing step, it might already be specific.
    // Otherwise, wrap it.
    if (error instanceof Error && error.message.startsWith("Failed to parse AI response")) {
        throw error; // Re-throw the specific parsing error
    }
    throw new Error(`An error occurred while communicating with the AI: ${error instanceof Error ? error.message : String(error)}`);
  }
};
