import React, { useState } from 'react';
import FileInput from './FileInput';
import EmbeddedAudio from './EmbeddedAudio';
import { useAudio } from '../../contexts/AudioContext';

enum AudioSourceMode {
  EMBEDDED = 'embedded',
  FILE = 'file'
}

const AudioSourceSelector: React.FC = () => {
  const [sourceMode, setSourceMode] = useState<AudioSourceMode>(AudioSourceMode.EMBEDDED);
  const [pendingMode, setPendingMode] = useState<AudioSourceMode | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { stopAudio, audioState } = useAudio();

  const buttonBaseClasses = "flex-1 py-2 px-4 text-sm md:text-base font-medium transition-all duration-300";
  const activeButtonClasses = "bg-fuchsia-500 text-white shadow-[0_0_5px_#FF00FF,0_0_10px_#FF00FF]";
  const inactiveButtonClasses = "bg-purple-950/60 text-gray-300 hover:bg-purple-950/80 hover:text-white";

  // Handle mode change request
  const handleModeChangeRequest = (mode: AudioSourceMode) => {
    if (mode === sourceMode) return;
    
    // If there's an audio file and it's different from current mode, show confirmation
    if (audioState.fileName) {
      setPendingMode(mode);
      setShowConfirm(true);
    } else {
      // If no audio is loaded, switch immediately
      setSourceMode(mode);
    }
  };

  // Confirm mode change
  const confirmModeChange = () => {
    if (pendingMode !== null) {
      // Stop audio only when confirmed
      stopAudio();
      setSourceMode(pendingMode);
      setPendingMode(null);
      setShowConfirm(false);
    }
  };

  // Cancel mode change
  const cancelModeChange = () => {
    setPendingMode(null);
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex rounded-lg overflow-hidden shadow-[0_0_3px_#00FFFF]">
        <button 
          className={`${buttonBaseClasses} ${sourceMode === AudioSourceMode.EMBEDDED ? activeButtonClasses : inactiveButtonClasses} rounded-l-lg`}
          onClick={() => handleModeChangeRequest(AudioSourceMode.EMBEDDED)}
        >
          Embedded Tracks
        </button>
        <button 
          className={`${buttonBaseClasses} ${sourceMode === AudioSourceMode.FILE ? activeButtonClasses : inactiveButtonClasses} rounded-r-lg`}
          onClick={() => handleModeChangeRequest(AudioSourceMode.FILE)}
        >
          Upload File
        </button>
      </div>
      
      {showConfirm && (
        <div className="mt-2 bg-black/60 p-3 rounded-lg border border-fuchsia-500 shadow-[0_0_5px_#FF00FF]">
          <p className="text-white text-sm mb-2">
            Changing audio source will stop current playback. Continue?
          </p>
          <div className="flex gap-2 justify-end">
            <button 
              className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={cancelModeChange}
            >
              Cancel
            </button>
            <button 
              className="px-3 py-1 text-xs bg-fuchsia-600 text-white rounded hover:bg-fuchsia-500"
              onClick={confirmModeChange}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-2">
        {sourceMode === AudioSourceMode.EMBEDDED ? <EmbeddedAudio /> : <FileInput />}
      </div>
    </div>
  );
};

export default AudioSourceSelector; 