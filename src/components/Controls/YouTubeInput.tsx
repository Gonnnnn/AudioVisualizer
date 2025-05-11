import React, { useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const YouTubeInput: React.FC = () => {
  const { loadYouTubeAudio } = useAudio();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await loadYouTubeAudio(youtubeUrl);
      // Clear the input after successful loading
      setYoutubeUrl('');
    } catch (error) {
      console.error('Error loading YouTube audio:', error);
      setError(error instanceof Error ? error.message : 'Failed to load YouTube audio');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    // Simple validation for YouTube URL formats
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(url);
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => {
            setYoutubeUrl(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste YouTube URL"
          disabled={isLoading}
          className={`p-2.5 rounded-lg border ${error ? 'border-red-500' : 'border-cyan-400'} bg-purple-950/80 text-white flex-1 placeholder:text-gray-400 disabled:bg-gray-700/50 disabled:cursor-not-allowed ${error ? 'shadow-[0_0_5px_#FF0000]' : ''}`}
        />
        <button 
          type="submit" 
          disabled={!isValidYouTubeUrl(youtubeUrl) || isLoading}
          className="bg-cyan-400 text-purple-950 border-none py-2.5 px-5 rounded-lg cursor-pointer font-bold transition-all duration-300 shadow-[0_0_5px_#00FFFF,0_0_10px_#00FFFF] hover:bg-cyan-500 hover:shadow-[0_0_8px_#00FFFF,0_0_15px_#00FFFF,0_0_20px_#00FFFF] disabled:bg-gray-700/50 disabled:shadow-none disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Load'}
        </button>
      </form>
      
      {error && (
        <div className="text-red-500 text-xs">
          {error}
        </div>
      )}
      
      <div className="text-gray-400 text-xs">
        Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
      </div>
    </div>
  );
};

export default YouTubeInput;