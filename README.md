# Gemini Video Studio

A platform to conceptualize AI-powered video creation by analyzing scripts, selecting avatars and voices, and previewing a storyboard with AI-suggested B-roll. This application demonstrates the use of the Google Gemini API for creative content generation.

## Features

*   **Script Input:** Users can paste or type their video script (min 50, max 10,000 characters).
*   **Avatar Selection:** Choose from a predefined list of virtual presenters.
*   **Voice Selection:** Select a voice style for the video narration.
*   **AI-Powered Script Analysis:**
    *   The script is analyzed paragraph by paragraph using the Gemini API (`gemini-2.5-flash-preview-04-17`).
    *   Identifies **topic**, **keywords** (for B-roll), and **emotional tone** for each segment.
*   **Storyboard Preview:** Displays the analyzed script segments with:
    *   Original paragraph text.
    *   Identified topic and tone.
    *   AI-suggested B-roll visuals (simulated using placeholder images from `picsum.photos` based on keywords).
*   **Selected Choices:** Shows the chosen avatar and voice alongside the preview.
*   **Simulated Video Generation:** A final step simulates the video creation process.
*   **Step-by-Step Workflow:** Guides the user through the creation process with a visual step indicator.
*   **Responsive Design:** Adapts to different screen sizes using Tailwind CSS.
*   **Error Handling:** Provides feedback for common issues, including API key misconfiguration.

## Tech Stack

*   **Frontend:**
    *   React 19 (via `esm.sh`)
    *   TypeScript
    *   Tailwind CSS (CDN version)
    *   ESM modules for direct browser imports (no build step required for development).
*   **AI Integration:**
    *   `@google/genai` SDK (v1.4.0 via `esm.sh`) for interacting with the Google Gemini API.
    *   Model used for script analysis: `gemini-2.5-flash-preview-04-17`.

## Core Gemini API Usage (`services/geminiService.ts`)

The application utilizes the Google Gemini API to analyze the user-provided script.

*   **Initialization:** The `GoogleGenAI` client is initialized using an API key fetched from `process.env.API_KEY`.
*   **Prompt Engineering:** A detailed prompt is constructed to instruct the `gemini-2.5-flash-preview-04-17` model. The prompt directs the AI to:
    *   Break down the script into segments (paragraphs).
    *   For each segment, extract:
        *   `paragraphText`: The original text.
        *   `topic`: A concise topic.
        *   `keywords`: An array of relevant keywords for B-roll.
        *   `tone`: The dominant emotional tone.
    *   Return the analysis as a single JSON object.
*   **JSON Output Configuration:** The API call specifies `responseMimeType: "application/json"` to request a structured JSON response directly from the model. A low `temperature` (0.2) is set for more deterministic and consistent analysis.
*   **Response Parsing:**
    *   The service retrieves the `text` property from the `GenerateContentResponse`.
    *   It attempts to strip potential markdown fences (e.g., ` ```json ... ``` `) from the response string.
    *   The cleaned string is then parsed into a JavaScript object conforming to the `GeminiScriptAnalysisResponse` type.
    *   Includes validation to check if the parsed data contains the expected `segments` array and if each segment has the correct structure.
*   **Error Handling:**
    *   Throws an error if the `API_KEY` is not found in `process.env`.
    *   Catches errors during the API call (e.g., invalid API key messages from the API).
    *   Handles JSON parsing errors, providing a snippet of the raw response if parsing fails.
    *   Provides user-friendly error messages that are displayed in the UI.

## Project Structure

```
/
├── index.html                # Main HTML entry point, includes Tailwind CSS CDN and import map
├── index.tsx                 # React root component and rendering logic
├── metadata.json             # Application metadata (name, description)
├── README.md                 # This file
├── App.tsx                   # Main application component, manages state, steps, and renders UI conditionally
├── constants.ts              # Shared constants (app title, avatar/voice data, API model name, step labels)
├── types.ts                  # TypeScript type definitions (Avatar, Voice, ScriptSegment, AppStep, etc.)
│
├── components/               # React UI components
│   ├── common/               # Reusable common components
│   │   ├── Button.tsx        # Generic button component with variants and sizes
│   │   └── Card.tsx          # Generic card component with selection state
│   ├── AvatarSelector.tsx    # UI for selecting an avatar
│   ├── LoadingSpinner.tsx    # Animated loading spinner
│   ├── ScriptInput.tsx       # UI for script text area input and validation
│   ├── StepIndicator.tsx     # Visual progress indicator for the steps
│   ├── VideoPreview.tsx      # UI for displaying analyzed script, selections, and B-roll
│   └── VoiceSelector.tsx     # UI for selecting a voice
│
└── services/                 # Services for external API calls
    └── geminiService.ts      # Handles interaction with the Google Gemini API for script analysis
```

## Setup and Running Locally

### Prerequisites

*   A modern web browser that supports ES6 modules (e.g., Chrome, Firefox, Edge, Safari).
*   An active internet connection (for fetching dependencies from `esm.sh`, Tailwind CSS, and for API calls).

### API Key Configuration

**CRITICAL:** This application requires a Google Gemini API key.

1.  **Obtain an API Key:** Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Set Environment Variable:** The application is hardcoded (in `services/geminiService.ts`) to look for the API key in `process.env.API_KEY`.
    *   **For client-side JavaScript served directly (like this project), `process.env.API_KEY` will not be automatically available from a system environment variable or a `.env` file without a build process or server-side templating.**
    *   **How to make the API key available for local testing (choose one):**
        *   **Temporary Modification (Not Recommended for Sharing/Production):** For quick local testing, you *could* temporarily modify `services/geminiService.ts` to hardcode your API key:
            ```typescript
            // In services/geminiService.ts, inside getAiClient function:
            // const apiKey = "YOUR_API_KEY_HERE"; // Instead of process.env.API_KEY
            ```
            **Remember to remove this before committing or sharing your code.**
        *   **Using a Local Server with Environment Variable Injection:** If you use a local development server that can inject environment variables into your `index.html` (e.g., by replacing a placeholder string before serving), that's a more secure local option. This project's current setup doesn't include this.
        *   **Browser Developer Tools (for very temporary testing):** You *could* define `process = { env: { API_KEY: "YOUR_API_KEY_HERE" } };` in your browser's console before the app loads, but this is cumbersome and not persistent.

    *   **Deployment:** When deploying to platforms like Vercel, Netlify, Google Cloud Run, etc., you can set environment variables (like `API_KEY`) through their respective dashboards. These platforms will then make them available to the server-side environment or build process, which can then expose them to the client if configured to do so.

**The application will display an error message and script analysis will fail if the API key is not correctly accessible when `getAiClient()` is called.**

### Running the Application

1.  **Download or Clone:** Get all the project files (`index.html`, `index.tsx`, `App.tsx`, etc.) and maintain the directory structure.
2.  **Serve `index.html`:**
    *   You need to serve `index.html` through a local HTTP server because browser security restrictions prevent ES modules from loading correctly via `file:///` URLs.
    *   If you have Node.js installed, open your terminal in the project's root directory and run:
        ```bash
        npx serve .
        ```
        This will typically serve the site at `http://localhost:3000`.
    *   Alternatively, use an extension like "Live Server" in VS Code (right-click `index.html` and select "Open with Live Server").
3.  **Open in Browser:** Navigate to the local URL provided by your HTTP server (e.g., `http://localhost:3000`).

## How to Use

1.  **Enter Script:**
    *   The application starts at the "Script Input" step.
    *   Type or paste your video script into the text area. The script must be between 50 and 10,000 characters.
    *   Click "Next: Choose Avatar".
2.  **Select Avatar:**
    *   A grid of available avatars is displayed.
    *   Click on an avatar card to select it. The selected card will be highlighted.
    *   Click "Back to Script" to modify your script.
    *   Once an avatar is selected, its choice is registered, and the app implicitly moves to enable voice selection (though you remain on the Avatar screen until you click on a voice in the next step, or if you explicitly clicked a "Next" button if one were present for avatar selection). The `AvatarSelector` itself does not automatically navigate; selection allows the next step `VoiceSelector` to become active. *Correction from previous mental model: Avatar selection directly transitions to Voice selection in `App.tsx`'s `handleAvatarSelect`.*
3.  **Select Voice:**
    *   A list of voice options is shown.
    *   Click on a voice card. This action will:
        *   Register your voice selection.
        *   **Trigger the AI script analysis** using the Gemini API. A loading indicator will appear.
        *   If the API key is missing or invalid, an error message will be displayed.
    *   Click "Back to Avatar" to change your avatar selection.
4.  **Preview & Generate:**
    *   If script analysis is successful, this screen displays:
        *   Your selected Avatar and Voice details.
        *   The "Storyboard & Script Analysis" section, where each paragraph of your script is shown as a "Scene."
        *   For each scene: the topic, emotional tone, original text, and suggested B-roll keywords (with placeholder images).
    *   Review the details.
    *   Click "Back to Voice Selection" to change the voice (which will re-trigger analysis).
    *   Click "Generate Video Concept" to proceed.
5.  **Generating/Complete:**
    *   A loading screen with "Generating your video concept..." is displayed for a few seconds (simulating video processing).
    *   A "Video Concept Ready!" confirmation screen appears.
    *   Click "Create Another Video" to reset the application and start over from the script input step.

## Important Note on API Key

*   The API key **must** be obtained **exclusively** from the environment variable `process.env.API_KEY` as read by `services/geminiService.ts`.
*   Due to the client-side nature of this project (no build step), making this environment variable securely available during local development requires specific workarounds (see "API Key Configuration" above).
*   The application **does not** include any UI or mechanism for users to enter or manage the API key directly within the app.

## Disclaimer

This is a **conceptual demo application**.
*   The video generation process is **simulated**. No actual video files are produced or downloadable.
*   B-roll images are placeholders loaded from `https://picsum.photos/` based on keywords and do not represent actual AI-generated B-roll imagery.
*   The purpose is to showcase a potential workflow and the capabilities of the Google Gemini API for script analysis and content ideation in a video creation context.
      
