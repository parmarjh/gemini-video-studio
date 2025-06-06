
import React from 'react';
import { Voice } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface VoiceSelectorProps {
  voices: Voice[];
  onSelect: (voice: Voice) => void;
  selectedVoiceId?: string | null;
  onBack: () => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ voices, onSelect, selectedVoiceId, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-sky-400 mb-8 text-center">Choose Your Voice</h2>
      <div className="space-y-4 mb-8">
        {voices.map((voice) => (
          <Card 
            key={voice.id}
            onClick={() => onSelect(voice)}
            isSelected={voice.id === selectedVoiceId}
            className="p-6"
          >
            <div className="flex items-center">
              <div className="mr-4 bg-sky-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-sky-300">{voice.name}</h3>
                <p className="text-sm text-gray-400">{voice.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <Button onClick={onBack} variant="secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Avatar
        </Button>
        <p className="text-sm text-gray-400">
          {selectedVoiceId ? "Selected! Click a voice to analyze script & preview." : "Select a voice to analyze script & preview."}
        </p>
      </div>
    </div>
  );
};

export default VoiceSelector;
