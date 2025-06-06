
import React from 'react';
import { STEP_LABELS } from '../constants';
import { AppStep } from '../types'; // Import AppStep from its source

const STEPS_ORDER: AppStep[] = [
  AppStep.SCRIPT_INPUT,
  AppStep.AVATAR_SELECTION,
  AppStep.VOICE_SELECTION,
  AppStep.PREVIEW,
  AppStep.COMPLETE
];


interface StepIndicatorProps {
  currentStep: AppStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentStepIndex = STEPS_ORDER.indexOf(currentStep);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center space-x-2 sm:space-x-4">
        {STEPS_ORDER.map((step, stepIdx) => {
          // Do not show "Complete" step in the progress bar itself unless it's active
          if (step === AppStep.COMPLETE && currentStep !== AppStep.COMPLETE) return null;
          // Do not show "Generating" step
          if (step === AppStep.GENERATING) return null;


          const stepLabel = STEP_LABELS[step] || `Step ${stepIdx + 1}`;
          const isCompleted = stepIdx < currentStepIndex;
          const isActive = stepIdx === currentStepIndex;

          return (
            <li key={step} className="relative flex-1">
              {stepIdx > 0 && (
                 <div className={`absolute inset-0 top-4 left-[-50%] h-0.5 w-full ${(isCompleted || isActive) && step !== AppStep.COMPLETE ? 'bg-sky-600' : 'bg-gray-600'}`} aria-hidden="true" />
              )}
              <div
                className={`relative flex flex-col items-center text-center transition-colors duration-300 ${isActive ? 'text-sky-400' : isCompleted ? 'text-sky-500' : 'text-gray-500'}`}
              >
                <span className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${isActive ? 'border-sky-500 bg-sky-700' : isCompleted ? 'border-sky-600 bg-sky-600' : 'border-gray-600 bg-gray-700 group-hover:border-gray-400'}`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className={`text-xs sm:text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>{stepIdx + 1}</span>
                  )}
                </span>
                <span className="mt-2 text-xs sm:text-sm font-medium whitespace-nowrap">{stepLabel.substring(stepLabel.indexOf(' ') + 1)}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;
