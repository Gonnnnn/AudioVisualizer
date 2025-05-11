import React from 'react';
import { useAudio } from '../../contexts/AudioContext';
import './styles.css';

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
    <div className="embedded-audio-container">
      <select 
        className="embedded-audio-select"
        onChange={(e) => handleTrackSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select Embedded Track</option>
        {embeddedTracks.map((track) => (
          <option key={track.path} value={track.path}>
            {track.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmbeddedAudio; 