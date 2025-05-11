import React from 'react';
import { useAudio } from '../../contexts/AudioContext';

const PlaybackControls: React.FC = () => {
  const { audioState, playAudio, pauseAudio, stopAudio } = useAudio();
  
  // Enable controls if we have both an audio context and a source type
  const isEnabled = audioState.audioContext !== null && audioState.sourceType !== null;
  const isPlaying = audioState.isPlaying;

  // Common button styles
  const baseButtonStyle = "text-purple-950 border-none py-2.5 px-5 rounded-lg cursor-pointer font-bold transition-all duration-300 disabled:bg-gray-700/70 disabled:text-white/70 disabled:shadow-[0_0_2px_rgba(255,255,255,0.3)] disabled:cursor-not-allowed";
  const playButtonStyle = `bg-cyan-400 w-[80px] ${baseButtonStyle} shadow-[0_0_5px_#00FFFF,0_0_10px_#00FFFF] hover:bg-cyan-500 hover:shadow-[0_0_8px_#00FFFF,0_0_15px_#00FFFF,0_0_20px_#00FFFF]`;
  const stopButtonStyle = `bg-fuchsia-500 w-[80px] ${baseButtonStyle} shadow-[0_0_5px_#FF00FF,0_0_10px_#FF00FF] hover:bg-fuchsia-600 hover:shadow-[0_0_8px_#FF00FF,0_0_15px_#FF00FF,0_0_20px_#FF00FF]`;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <div className="flex gap-4">
      <button 
        onClick={handlePlayPause}
        disabled={!isEnabled}
        className={playButtonStyle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <button 
        onClick={stopAudio}
        disabled={!isEnabled || !isPlaying}
        className={stopButtonStyle}
        aria-label="Stop"
      >
        Stop
      </button>
    </div>
  );
};

export default PlaybackControls;