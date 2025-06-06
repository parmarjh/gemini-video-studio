
import React from 'react';
import { AnalyzedScript, Avatar, Voice, ScriptSegment } from '../types';
import Button from './common/Button';

interface VideoPreviewProps {
  analyzedScript: AnalyzedScript;
  avatar: Avatar;
  voice: Voice;
  onGenerate: () => void;
  onBack: () => void;
}

const BrollImage: React.FC<{ keyword: string, index: number }> = ({ keyword, index }) => {
    // Using index to vary images slightly for same keyword if it appears multiple times
    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(keyword)}${index}/300/180`;
    return (
        <div className="relative group aspect-[16/10] bg-gray-600 rounded overflow-hidden shadow-md">
            <img 
                src={imageUrl} 
                alt={`B-roll for ${keyword}`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/fallback/300/180')} // Fallback
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm px-2 py-1 bg-black bg-opacity-70 rounded">{keyword}</p>
            </div>
        </div>
    );
};


const VideoPreview: React.FC<VideoPreviewProps> = ({ analyzedScript, avatar, voice, onGenerate, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-sky-400 mb-2 text-center">Video Concept Preview</h2>
      <p className="text-gray-400 text-center mb-8">Review your selections and the AI-analyzed script with suggested B-roll visuals.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-700 rounded-lg shadow-xl">
        <div>
          <h3 className="text-xl font-semibold text-sky-300 mb-3">Selected Avatar</h3>
          <div className="flex items-center space-x-4">
            <img src={avatar.imageUrl} alt={avatar.name} className="w-24 h-24 rounded-full object-cover border-2 border-sky-500" />
            <div>
              <p className="text-lg font-medium text-gray-100">{avatar.name}</p>
              <p className="text-sm text-gray-400">{avatar.description}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-sky-300 mb-3">Selected Voice</h3>
          <div className="flex items-center space-x-4">
             <div className="bg-sky-500 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
            <div>
              <p className="text-lg font-medium text-gray-100">{voice.name}</p>
              <p className="text-sm text-gray-400">{voice.description}</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-sky-300 mb-6 text-center">Storyboard & Script Analysis</h3>
      <div className="space-y-8">
        {analyzedScript.segments.map((segment, index) => (
          <div key={index} className="p-6 bg-gray-700 rounded-lg shadow-xl">
            <div className="md:flex md:space-x-6">
              <div className="md:w-2/3">
                <h4 className="text-lg font-semibold text-sky-400 mb-1">Scene {index + 1}: {segment.topic}</h4>
                <p className="text-xs text-gray-500 mb-2 uppercase">Tone: <span className="font-semibold text-sky-500">{segment.tone}</span></p>
                <p className="text-gray-300 leading-relaxed mb-4">{segment.paragraphText}</p>
              </div>
              <div className="md:w-1/3 mt-4 md:mt-0">
                <h5 className="text-md font-semibold text-sky-400 mb-2">Suggested B-Roll:</h5>
                {segment.keywords && segment.keywords.length > 0 ? (
                   <div className="grid grid-cols-2 gap-2">
                     {segment.keywords.slice(0, 2).map((keyword, kwIndex) => ( // Show max 2 keywords/images
                        <BrollImage key={kwIndex} keyword={keyword} index={index * 10 + kwIndex} />
                     ))}
                   </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No specific keywords identified for B-roll.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-600 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <Button onClick={onBack} variant="secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Voice Selection
        </Button>
        <Button onClick={onGenerate} size="lg">
          Generate Video Concept
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;
