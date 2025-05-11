import React, { useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const YouTubeInput: React.FC = () => {
  const { loadYouTubeAudio } = useAudio();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) return;
    
    try {
      setIsLoading(true);
      await loadYouTubeAudio(youtubeUrl);
      // Clear the input after successful loading
      setYoutubeUrl('');
    } catch (error) {
      console.error('Error loading YouTube audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="youtube-input-container">
      <form onSubmit={handleSubmit} className="youtube-form">
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="YouTube URL (Coming Soon)"
          disabled={true} // Disabled until implementation is complete
          className="youtube-input"
        />
        <button 
          type="submit" 
          disabled={!youtubeUrl.trim() || isLoading || true} // Disabled until implementation is complete
          className="youtube-submit-btn"
        >
          {isLoading ? 'Loading...' : 'Load'}
        </button>
      </form>
    </div>
  );
};

export default YouTubeInput;