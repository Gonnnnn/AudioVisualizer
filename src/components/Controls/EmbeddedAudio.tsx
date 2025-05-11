import React from 'react';
import { useAudio } from '../../contexts/AudioContext';

const embeddedTracks = [
  {
    name: 'Everyday Problems (Example 1)',
    path: '/audio/everyday-problems.mp3'
  }
  // Add more tracks here as needed
];

const EmbeddedAudio: React.FC = () => {
  const { loadAudioFile } = useAudio();

  const handleTrackSelect = async (path: string) => {
    try {
      console.log('Loading embedded track:', path);
      
      // Fetch the audio file from the public directory
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('File fetched successfully');
      
      const blob = await response.blob();
      console.log('Blob created:', blob.type, blob.size);
      
      const file = new File([blob], path.split('/').pop() || 'audio.mp3', { 
        type: blob.type || 'audio/mpeg' 
      });
      console.log('File created:', file.name, file.type, file.size);
      
      await loadAudioFile(file);
      console.log('Audio file loaded successfully');
    } catch (error) {
      console.error('Error loading embedded audio:', error);
    }
  };

  return (
    <div className="flex items-center">
      <select 
        className="bg-purple-950/80 text-white border border-cyan-400 rounded-lg py-2 px-3 cursor-pointer focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 appearance-none w-60"
        onChange={(e) => handleTrackSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled className="bg-purple-950 text-white">Select Embedded Track</option>
        {embeddedTracks.map((track) => (
          <option key={track.path} value={track.path} className="bg-purple-950 text-white">
            {track.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmbeddedAudio; 