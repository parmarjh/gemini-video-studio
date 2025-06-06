
import React from 'react';
import { Avatar } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface AvatarSelectorProps {
  avatars: Avatar[];
  onSelect: (avatar: Avatar) => void;
  selectedAvatarId?: string | null;
  onBack: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ avatars, onSelect, selectedAvatarId, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-sky-400 mb-8 text-center">Choose Your Avatar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {avatars.map((avatar) => (
          <Card 
            key={avatar.id} 
            onClick={() => onSelect(avatar)}
            isSelected={avatar.id === selectedAvatarId}
            className="flex flex-col items-center p-4"
          >
            <img src={avatar.imageUrl} alt={avatar.name} className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-gray-600" />
            <h3 className="text-lg font-medium text-sky-300">{avatar.name}</h3>
            <p className="text-sm text-gray-400 text-center mt-1">{avatar.description}</p>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <Button onClick={onBack} variant="secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Script
        </Button>
        <p className="text-sm text-gray-400">
          {selectedAvatarId ? "Selected! Proceed by choosing an avatar." : "Select an avatar to continue."}
        </p>
      </div>
    </div>
  );
};

export default AvatarSelector;
