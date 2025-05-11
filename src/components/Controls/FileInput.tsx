import React, { useState, useRef } from 'react';
import { useAudio } from '../../contexts/AudioContext';

const FileInput: React.FC = () => {
  const { loadAudioFile, audioState } = useAudio();
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    
    try {
      await loadAudioFile(file);
    } catch (error) {
      console.error('Error loading audio file:', error);
      setFileName(null);
    }
  };

  // Update file name from context
  React.useEffect(() => {
    if (audioState.fileName) {
      setFileName(audioState.fileName);
    }
  }, [audioState.fileName]);

  return (
    <div className="flex items-center gap-2">
      <input 
        ref={fileInputRef}
        type="file" 
        id="audioFile" 
        accept="audio/*"
        onChange={handleFileChange}
        className="absolute opacity-0 w-[0.1px] h-[0.1px] overflow-hidden"
      />
      <label 
        htmlFor="audioFile" 
        className="bg-cyan-400 text-purple-950 py-2.5 px-4 rounded-lg cursor-pointer font-bold transition-all duration-300 shadow-[0_0_5px_#00FFFF,0_0_10px_#00FFFF] hover:bg-cyan-500 hover:shadow-[0_0_8px_#00FFFF,0_0_15px_#00FFFF,0_0_20px_#00FFFF]"
      >
        Choose File
      </label>
      {fileName && (
        <span className="text-fuchsia-400 text-sm max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
          {fileName.length > 20 ? fileName.substring(0, 17) + '...' : fileName}
        </span>
      )}
    </div>
  );
};

export default FileInput;