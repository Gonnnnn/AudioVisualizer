import React from 'react';
import { useAudio } from '../../contexts/AudioContext';

const PlaybackControls: React.FC = () => {
  const { audioState, playAudio, pauseAudio, stopAudio } = useAudio();
  
  // Enable controls if we have both an audio context and a source type
  const isEnabled = audioState.audioContext !== null && audioState.sourceType !== null;
  const isPlaying = audioState.isPlaying;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <div className="playback-controls">
      <button 
        onClick={handlePlayPause}
        disabled={!isEnabled}
        className="playback-btn"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <button 
        onClick={stopAudio}
        disabled={!isEnabled || !isPlaying}
        className="playback-btn stop-btn"
        aria-label="Stop"
      >
        Stop
      </button>
    </div>
  );
};

export default PlaybackControls;