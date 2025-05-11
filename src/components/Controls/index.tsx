import React, { useState } from 'react';
import FileInput from './FileInput';
import YouTubeInput from './YouTubeInput';
import PlaybackControls from './PlaybackControls';
import VolumeControl from './VolumeControl';
import ThemeSelector from './ThemeSelector';
import ModeSelector from './ModeSelector';
import EmbeddedAudio from './EmbeddedAudio';

const Controls: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-10 bg-black/40 p-4 md:p-6 rounded-xl shadow-lg shadow-cyan-400/20 flex flex-col gap-4 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-100'}`}>
      <button 
        className="absolute top-full left-1/2 -translate-x-1/2 bg-black/40 text-cyan-400 w-[30px] h-[30px] rounded-b-[15px] cursor-pointer flex items-center justify-center text-xs shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:text-cyan-300 hover:shadow-cyan-400/40"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse controls' : 'Expand controls'}
      >
        {isExpanded ? '▼' : '▲'}
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 -my-4 pointer-events-none'}`}>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <EmbeddedAudio />
          <FileInput />
          <YouTubeInput />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center justify-center mt-4">
          <PlaybackControls />
          <VolumeControl />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center justify-center mt-4">
          <ThemeSelector />
          <ModeSelector />
        </div>
      </div>
    </div>
  );
};

export default Controls;