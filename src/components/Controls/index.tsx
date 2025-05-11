import React, { useState } from 'react';
import FileInput from './FileInput';
import PlaybackControls from './PlaybackControls';
import VolumeControl from './VolumeControl';
import ThemeSelector from './ThemeSelector';
import ModeSelector from './ModeSelector';
import EmbeddedAudio from './EmbeddedAudio';

const Controls: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Extract long class strings into variables for better readability
  const containerClasses = "fixed top-5 left-1/2 -translate-x-1/2 z-10 bg-black/40 rounded-xl shadow-lg shadow-cyan-400/20 flex flex-col transition-all duration-300";
  const toggleButtonClasses = "absolute top-full left-1/2 -translate-x-1/2 bg-black/40 text-cyan-400 w-[30px] h-[30px] rounded-b-[15px] cursor-pointer flex items-center justify-center text-xs shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:text-cyan-300 hover:shadow-cyan-400/40";
  
  return (
    <div className={`${containerClasses} ${isExpanded ? 'opacity-100' : 'opacity-100'} max-w-[600px] w-full`}>
      <button 
        className={toggleButtonClasses}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse controls' : 'Expand controls'}
      >
        {isExpanded ? '▼' : '▲'}
      </button>
      
      <div className={`w-full transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        {/* Container with padding around all content */}
        <div className="p-6 md:p-8">
          {/* Top row - audio input sources */}
          <div className="flex justify-between items-center gap-6 mb-6">
            <div className="w-full px-4">
              <EmbeddedAudio />
            </div>
            <div className="w-full px-4">
              <FileInput />
            </div>
          </div>

          {/* Middle row - playback controls and volume */}
          <div className="flex justify-between items-center gap-6 mb-6">
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