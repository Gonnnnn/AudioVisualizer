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
    <div className="file-input-container">
      <input 
        ref={fileInputRef}
        type="file" 
        id="audioFile" 
        accept="audio/*"
        onChange={handleFileChange}
        className="file-input"
      />
      <label htmlFor="audioFile" className="file-input-label">
        Choose File
      </label>
      {fileName && (
        <span className="file-name">
          {fileName.length > 20 ? fileName.substring(0, 17) + '...' : fileName}
        </span>
      )}
    </div>
  );
};

export default FileInput;