
import { Avatar, Voice, AppStep } from './types';

export const APP_TITLE = "Gemini Video Studio";

export const AVATARS: Avatar[] = [
  { id: 'avatar1', name: 'Alex - Professional', imageUrl: 'https://picsum.photos/seed/AlexProfessional/200/200', description: 'Crisp, clear, and business-ready.' },
  { id: 'avatar2', name: 'Mia - Casual Presenter', imageUrl: 'https://picsum.photos/seed/MiaCasual/200/200', description: 'Friendly, engaging, and relatable.' },
  { id: 'avatar3', name: 'Dr. Evelyn Reed - Expert', imageUrl: 'https://picsum.photos/seed/DrEvelynExpert/200/200', description: 'Authoritative, knowledgeable, and trustworthy.' },
  { id: 'avatar4', name: 'Sparky - Animated Sidekick', imageUrl: 'https://picsum.photos/seed/SparkyAnimated/200/200', description: 'Fun, quirky, and eye-catching for dynamic content.' },
];

export const VOICES: Voice[] = [
  { id: 'voice1', name: 'Narrator Pro (Male)', description: 'Deep, smooth, and authoritative for narration.' },
  { id: 'voice2', name: 'Engaging Speaker (Female)', description: 'Warm, clear, and persuasive for presentations.' },
  { id: 'voice3', name: 'Friendly Guide (Unisex)', description: 'Approachable and calm for tutorials and explainers.' },
  { id: 'voice4', name: 'Upbeat Animator (Female)', description: 'Energetic and expressive for animated or vibrant content.' },
];

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const STEP_LABELS: { [key in AppStep]?: string } = {
  [AppStep.SCRIPT_INPUT]: "1. Script",
  [AppStep.AVATAR_SELECTION]: "2. Avatar",
  [AppStep.VOICE_SELECTION]: "3. Voice",
  [AppStep.PREVIEW]: "4. Preview & Generate",
  [AppStep.GENERATING]: "Generating...", // Added for completeness, though not shown in StepIndicator
  [AppStep.COMPLETE]: "5. Finished",
};