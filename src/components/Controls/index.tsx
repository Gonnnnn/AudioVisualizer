import React, { useState } from 'react';
import FileInput from './FileInput';
import YouTubeInput from './YouTubeInput';
import PlaybackControls from './PlaybackControls';
import VolumeControl from './VolumeControl';
import ThemeSelector from './ThemeSelector';
import ModeSelector from './ModeSelector';
import EmbeddedAudio from './EmbeddedAudio';
import './styles.css';

const Controls: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`controls-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        className="controls-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse controls' : 'Expand controls'}
      >
        {isExpanded ? '▼' : '▲'}
      </button>
      
      <div className="controls-content">
        <div className="controls-group">
          <EmbeddedAudio />
          <FileInput />
          <YouTubeInput />
        </div>
        
        <div className="controls-group">
          <PlaybackControls />
          <VolumeControl />
        </div>
        
        <div className="controls-group">
          <ThemeSelector />
          <ModeSelector />
        </div>
      </div>
    </div>
  );
};

export default Controls;