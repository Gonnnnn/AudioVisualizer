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
    <div className="flex gap-2">
      <button 
        onClick={handlePlayPause}
        disabled={!isEnabled}
        className="bg-cyan-400 text-purple-950 border-none py-2.5 px-4 rounded-lg cursor-pointer font-bold transition-all duration-300 shadow-[0_0_5px_#00FFFF,0_0_10px_#00FFFF] hover:bg-cyan-500 hover:shadow-[0_0_8px_#00FFFF,0_0_15px_#00FFFF,0_0_20px_#00FFFF] disabled:bg-gray-700/50 disabled:shadow-none disabled:cursor-not-allowed"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <button 
        onClick={stopAudio}
        disabled={!isEnabled || !isPlaying}
        className="bg-fuchsia-500 text-purple-950 border-none py-2.5 px-4 rounded-lg cursor-pointer font-bold transition-all duration-300 shadow-[0_0_5px_#FF00FF,0_0_10px_#FF00FF] hover:bg-fuchsia-600 hover:shadow-[0_0_8px_#FF00FF,0_0_15px_#FF00FF,0_0_20px_#FF00FF] disabled:bg-gray-700/50 disabled:shadow-none disabled:cursor-not-allowed"
        aria-label="Stop"
      >
        Stop
      </button>
    </div>
  );
};

export default PlaybackControls;