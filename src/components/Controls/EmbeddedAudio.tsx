import React, { useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const embeddedTracks = [
  {
    name: 'Everyday Problems (Example 1)',
    path: './audio/everyday-problems.mp3'
  }
  // Add more tracks here as needed
];

const EmbeddedAudio: React.FC = () => {
  const { loadAudioFile } = useAudio();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackSelect = async (path: string) => {
    if (!path) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading embedded track:', path);
      
      // Fetch the audio file from the public directory
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], path.split('/').pop() || 'audio.mp3', { 
        type: blob.type || 'audio/mpeg' 
      });
      
      await loadAudioFile(file);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading embedded audio:', error);
      setError(error instanceof Error ? error.message : 'Failed to load audio');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 relative">
      <select 
        className={`w-full bg-purple-950/80 text-white border ${error ? 'border-red-500' : 'border-cyan-400'} rounded-lg py-2.5 px-4 cursor-pointer focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 appearance-none ${error ? 'shadow-[0_0_5px_#FF0000,0_0_10px_#FF0000]' : 'shadow-[0_0_5px_#00FFFF,0_0_10px_#00FFFF]'}`}
        onChange={(e) => handleTrackSelect(e.target.value)}
        defaultValue=""
        style={{ textIndent: '0.5rem' }}
        disabled={isLoading}
      >
        <option value="" disabled className="bg-purple-950 text-white">Select Embedded Track</option>
        {embeddedTracks.map((track) => (
          <option key={track.path} value={track.path} className="bg-purple-950 text-white p-2">
            {track.name}
          </option>
        ))}
      </select>
      
      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 text-xs animate-pulse">
          Loading...
        </div>
      )}
      
      {error && (
        <div className="mt-1 text-red-500 text-xs">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default EmbeddedAudio; 