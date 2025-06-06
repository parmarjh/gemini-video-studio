/
├── index.html              # Main HTML entry point
├── index.tsx               # React root component and rendering
├── metadata.json           # Application metadata
├── App.tsx                 # Main application component, manages state and steps
├── constants.ts            # Shared constants (avatars, voices, API model names)
├── types.ts                # TypeScript type definitions
│
├── components/             # React UI components
│   ├── common/             # Reusable common components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── AvatarSelector.tsx
│   ├── LoadingSpinner.tsx
│   ├── ScriptInput.tsx
│   ├── StepIndicator.tsx
│   ├── VideoPreview.tsx
│   └── VoiceSelector.tsx
│
└── services/               # Services for external API calls
    └── geminiService.ts    # Handles interaction with the Gemini API
