
import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, Avatar, Voice, AnalyzedScript } from './types';
import { AVATARS, VOICES, APP_TITLE, GEMINI_MODEL_NAME } from './constants';
import ScriptInput from './components/ScriptInput';
import AvatarSelector from './components/AvatarSelector';
import VoiceSelector from './components/VoiceSelector';
import VideoPreview from './components/VideoPreview';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeScriptWithGemini } from './services/geminiService';
import StepIndicator from './components/StepIndicator';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SCRIPT_INPUT);
  const [scriptText, setScriptText] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [analyzedScript, setAnalyzedScript] = useState<AnalyzedScript | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetToStep = (step: AppStep) => {
    setCurrentStep(step);
    setError(null); // Clear errors when navigating back
    if (step === AppStep.SCRIPT_INPUT) {
        setAnalyzedScript(null);
        setSelectedAvatar(null);
        setSelectedVoice(null);
    } else if (step === AppStep.AVATAR_SELECTION) {
        setAnalyzedScript(null);
        setSelectedVoice(null);
    } else if (step === AppStep.VOICE_SELECTION) {
        setAnalyzedScript(null);
    }
  };
  
  const handleScriptSubmit = (script: string) => {
    setScriptText(script);
    setCurrentStep(AppStep.AVATAR_SELECTION);
    setError(null);
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setCurrentStep(AppStep.VOICE_SELECTION);
    setError(null);
  };

  const handleVoiceSelect = async (voice: Voice) => {
    setSelectedVoice(voice);
    setIsLoading(true);
    setError(null);
    setAnalyzedScript(null); // Clear previous analysis

    if (!process.env.API_KEY) {
      setError("API Key is not configured. Please set the API_KEY environment variable.");
      setIsLoading(false);
      setCurrentStep(AppStep.VOICE_SELECTION); // Stay on current step or specific error step
      return;
    }
    
    try {
      const analysis = await analyzeScriptWithGemini(scriptText, GEMINI_MODEL_NAME);
      setAnalyzedScript(analysis);
      setCurrentStep(AppStep.PREVIEW);
    } catch (e) {
      console.error("Error analyzing script:", e);
      setError(e instanceof Error ? e.message : "Failed to analyze script. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = () => {
    setIsLoading(true);
    setError(null);
    setCurrentStep(AppStep.GENERATING);
    // Simulate video generation
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(AppStep.COMPLETE);
    }, 3000);
  };

  const handleStartOver = () => {
    setScriptText('');
    setSelectedAvatar(null);
    setSelectedVoice(null);
    setAnalyzedScript(null);
    setError(null);
    setCurrentStep(AppStep.SCRIPT_INPUT);
  };
  
  // Effect to clear error when changing relevant state
  useEffect(() => {
    if (error) {
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptText, selectedAvatar, selectedVoice]);


  const renderStepContent = () => {
    if (isLoading && (currentStep === AppStep.VOICE_SELECTION || currentStep === AppStep.PREVIEW || currentStep === AppStep.GENERATING)) {
      return <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-sky-400">
          {currentStep === AppStep.GENERATING ? "Generating your video concept..." : "Analyzing script with AI..."}
        </p>
      </div>;
    }

    switch (currentStep) {
      case AppStep.SCRIPT_INPUT:
        return <ScriptInput onSubmit={handleScriptSubmit} initialScript={scriptText} />;
      case AppStep.AVATAR_SELECTION:
        return <AvatarSelector 
                  avatars={AVATARS} 
                  onSelect={handleAvatarSelect} 
                  selectedAvatarId={selectedAvatar?.id}
                  onBack={() => resetToStep(AppStep.SCRIPT_INPUT)} 
                />;
      case AppStep.VOICE_SELECTION:
        return <VoiceSelector 
                  voices={VOICES} 
                  onSelect={handleVoiceSelect} 
                  selectedVoiceId={selectedVoice?.id}
                  onBack={() => resetToStep(AppStep.AVATAR_SELECTION)} 
                />;
      case AppStep.PREVIEW:
        if (!analyzedScript || !selectedAvatar || !selectedVoice) {
          // This case should ideally not be reached if logic is correct
          // but as a fallback, navigate to an appropriate step or show error.
          setError("Missing data for preview. Please go back and complete previous steps.");
          return <div className="text-center text-red-400 p-4">{error}</div>
        }
        return <VideoPreview
                  analyzedScript={analyzedScript}
                  avatar={selectedAvatar}
                  voice={selectedVoice}
                  onGenerate={handleGenerateVideo}
                  onBack={() => resetToStep(AppStep.VOICE_SELECTION)}
                />;
      case AppStep.COMPLETE:
        return (
          <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold text-sky-400 mb-4">Video Concept Ready!</h2>
            <p className="text-gray-300 mb-6">Your AI-generated video concept has been processed.</p>
            <p className="text-sm text-gray-400 mb-6">(This is a simulation. In a full version, your video would be available for download.)</p>
            <button
              onClick={handleStartOver}
              className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
            >
              Create Another Video
            </button>
          </div>
        );
      default:
        return <p>Unknown step.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
        <header className="bg-gray-700 p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-sky-400">{APP_TITLE}</h1>
          <p className="text-center text-gray-300 mt-1">Automated Video Creation Concept</p>
        </header>
        
        {currentStep !== AppStep.GENERATING && currentStep !== AppStep.COMPLETE && (
          <div className="p-4 sm:p-6 bg-gray-700 border-b border-gray-600">
            <StepIndicator currentStep={currentStep} />
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-800 border border-red-700 text-red-200 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-1">An Error Occurred</h3>
              <p>{error}</p>
              {error.includes("API Key") && <p className="mt-2 text-sm">Please ensure your `process.env.API_KEY` is correctly set up in your environment.</p>}
            </div>
          )}
          {renderStepContent()}
        </main>
      </div>
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved (Conceptual Demo).</p>
      </footer>
    </div>
  );
};

export default App;