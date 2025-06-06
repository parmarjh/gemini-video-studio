
export interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface Voice {
  id: string;
  name: string;
  description: string;
}

export interface ScriptSegment {
  paragraphText: string;
  topic: string;
  keywords: string[];
  tone: string;
}

export interface AnalyzedScript {
  segments: ScriptSegment[];
}

export enum AppStep {
  SCRIPT_INPUT = 'SCRIPT_INPUT',
  AVATAR_SELECTION = 'AVATAR_SELECTION',
  VOICE_SELECTION = 'VOICE_SELECTION',
  PREVIEW = 'PREVIEW',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
}

// For Gemini API response parsing
export interface GeminiScriptAnalysisResponse {
  segments: ScriptSegment[];
}
