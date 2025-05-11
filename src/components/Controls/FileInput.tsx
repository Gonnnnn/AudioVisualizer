import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const FileInput: React.FC = () => {
  const { loadAudioFile, audioState } = useAudio();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hiddenInputClasses = "absolute opacity-0 w-[0.1px] h-[0.1px] overflow-hidden";
  const buttonLabelClasses = "w-full bg-cyan-400 text-purple-950 py-2.5 px-4 rounded-lg cursor-pointer font-bold transition-all duration-300 shadow-[0_0_5px_#00FFFF,0_0_10px_#00FFFF] hover:bg-cyan-500 hover:shadow-[0_0_8px_#00FFFF,0_0_15px_#00FFFF,0_0_20px_#00FFFF] text-center block";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    
    try {
      await loadAudioFile(file);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio file:', error);
      setError(error instanceof Error ? error.message : 'Failed to load audio');
      setFileName(null);
      setIsLoading(false);
    }
  };

  // Update file name from context
  useEffect(() => {
    if (audioState.fileName) {
      setFileName(audioState.fileName);
    }
  }, [audioState.fileName]);

  return (
    <div className="flex-1 relative">
      <input 
        ref={fileInputRef}
        type="file" 
        id="audioFile" 
        accept="audio/*"
        onChange={handleFileChange}
        className={hiddenInputClasses}
        disabled={isLoading}
      />
      <label 
        htmlFor="audioFile" 
        className={`${buttonLabelClasses} ${isLoading ? 'opacity-75 cursor-wait' : ''} ${error ? 'bg-red-400 shadow-[0_0_5px_#FF0000,0_0_10px_#FF0000]' : ''}`}
      >
        {isLoading ? 'Loading...' : 'Choose File'}
      </label>
      
      {fileName && !isLoading && !error && (
        <div className="mt-2 text-cyan-400 text-sm text-center truncate px-2">
          {fileName}
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-red-500 text-xs text-center">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default FileInput;