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
    <div className="flex items-center">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="YouTube URL (Coming Soon)"
          disabled={true} // Disabled until implementation is complete
          className="p-2.5 rounded-lg border border-cyan-400 bg-purple-950/80 text-white w-[200px] placeholder:text-gray-400 disabled:bg-gray-700/50 disabled:cursor-not-allowed"
        />
        <button 
          type="submit" 
          disabled={!youtubeUrl.trim() || isLoading || true} // Disabled until implementation is complete
          className="bg-cyan-400 text-purple-950 border-none py-2.5 px-5 rounded-lg cursor-pointer font-bold transition-all duration-300 shadow-[0_0_5px_#00FFFF,0_0_10px_#00FFFF] hover:bg-cyan-500 hover:shadow-[0_0_8px_#00FFFF,0_0_15px_#00FFFF,0_0_20px_#00FFFF] disabled:bg-gray-700/50 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Load'}
        </button>
      </form>
    </div>
  );
};

export default YouTubeInput;