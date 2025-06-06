
import React, { useState } from 'react';
import Button from './common/Button';

interface ScriptInputProps {
  onSubmit: (script: string) => void;
  initialScript?: string;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ onSubmit, initialScript = '' }) => {
  const [script, setScript] = useState<string>(initialScript);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (script.trim().length < 50) {
      setError('Script is too short. Please enter at least 50 characters.');
      return;
    }
    if (script.trim().length > 10000) {
      setError('Script is too long. Please limit to 10,000 characters for this demo.');
      return;
    }
    setError('');
    onSubmit(script);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6 text-center">Enter Your Video Script</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="script" className="block text-sm font-medium text-gray-300 mb-1">
            Paste your script below (min 50, max 10,000 characters):
          </label>
          <textarea
            id="script"
            name="script"
            rows={12}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm placeholder-gray-500"
            placeholder="E.g., Welcome to our product demo. Today, we'll explore the amazing features of Gemini Video Studio..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
            aria-describedby="script-error"
          />
          {error && <p id="script-error" className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
        <div className="text-center">
          <Button type="submit" size="lg" disabled={!script.trim()}>
            Next: Choose Avatar
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ScriptInput;