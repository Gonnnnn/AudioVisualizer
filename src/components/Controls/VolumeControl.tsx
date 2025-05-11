import React, { useEffect, useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const VolumeControl: React.FC = () => {
  const { audioState, setVolume } = useAudio();
  const [volumeValue, setVolumeValue] = useState(0.5);
  
  // Update local state when context changes
  useEffect(() => {
    setVolumeValue(audioState.volume);
  }, [audioState.volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolumeValue(value);
    setVolume(value);
    
    // Save to localStorage
    try {
      const settings = localStorage.getItem('visualizerSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        localStorage.setItem(
          'visualizerSettings', 
          JSON.stringify({ ...parsedSettings, volume: value })
        );
      }
    } catch (error) {
      console.error('Error saving volume to localStorage:', error);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="volumeControl" className="text-white font-medium text-center">
        Volume:
      </label>
      <input
        type="range"
        id="volumeControl"
        min="0"
        max="1"
        step="0.01"
        value={volumeValue}
        onChange={handleVolumeChange}
        disabled={!audioState.audioContext}
        className="accent-cyan-400 h-2 rounded-lg appearance-none bg-purple-950 cursor-pointer w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default VolumeControl;