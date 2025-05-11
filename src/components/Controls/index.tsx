import React, { useState } from 'react';
import PlaybackControls from './PlaybackControls';
import VolumeControl from './VolumeControl';
import ThemeSelector from './ThemeSelector';
import ModeSelector from './ModeSelector';
import AudioSourceSelector from './AudioSourceSelector';
import { useAudio } from '../../contexts/AudioContext';

const Controls: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { audioState } = useAudio();

  // Extract long class strings into variables for better readability
  const containerClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 z-10 bg-black/40 rounded-xl shadow-lg shadow-cyan-400/20 flex flex-col transition-all duration-300";
  const toggleButtonClasses = "absolute bottom-full left-1/2 -translate-x-1/2 bg-black/40 text-cyan-400 w-[30px] h-[30px] rounded-t-[15px] cursor-pointer flex items-center justify-center text-xs shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:text-cyan-300 hover:shadow-cyan-400/40";
  
  return (
    <div className={`${containerClasses} ${isExpanded ? 'opacity-100' : 'opacity-100'} max-w-[600px] w-full`}>
      <button 
        className={toggleButtonClasses}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse controls' : 'Expand controls'}
      >
        {isExpanded ? '▲' : '▼'}
      </button>
      
      <div className={`w-full transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        {/* Container with padding around all content */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Current Audio Display */}
          {audioState.fileName && (
            <div className="w-full text-center mb-2">
              <div className="text-fuchsia-400 text-sm font-medium">Currently Playing:</div>
              <div className="text-white text-base truncate">{audioState.fileName}</div>
            </div>
          )}
          
          {/* Audio source selector */}
          <div className="mb-6">
            <AudioSourceSelector />
          </div>

          {/* Middle row - playback controls and volume */}
          <div className="flex justify-between items-center gap-6">
            <div className="w-full px-4">
              <PlaybackControls />
            </div>
            <div className="w-full px-4">
              <VolumeControl />
            </div>
          </div>

          {/* Bottom row - theme and mode selectors */}
          <div className="flex justify-between items-center gap-6">
            <div className="w-full px-4">
              <ThemeSelector />
            </div>
            <div className="w-full px-4">
              <ModeSelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;