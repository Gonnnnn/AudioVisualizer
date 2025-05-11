import React, { useState } from 'react';
import FileInput from './FileInput';
import EmbeddedAudio from './EmbeddedAudio';

enum AudioSourceMode {
  EMBEDDED = 'embedded',
  FILE = 'file'
}

const AudioSourceSelector: React.FC = () => {
  const [sourceMode, setSourceMode] = useState<AudioSourceMode>(AudioSourceMode.EMBEDDED);

  const buttonBaseClasses = "flex-1 py-2 px-4 text-sm md:text-base font-medium transition-all duration-300";
  const activeButtonClasses = "bg-fuchsia-500 text-white shadow-[0_0_5px_#FF00FF,0_0_10px_#FF00FF]";
  const inactiveButtonClasses = "bg-purple-950/60 text-gray-300 hover:bg-purple-950/80 hover:text-white";

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex rounded-lg overflow-hidden shadow-[0_0_3px_#00FFFF]">
        <button 
          className={`${buttonBaseClasses} ${sourceMode === AudioSourceMode.EMBEDDED ? activeButtonClasses : inactiveButtonClasses} rounded-l-lg`}
          onClick={() => setSourceMode(AudioSourceMode.EMBEDDED)}
        >
          Embedded Tracks
        </button>
        <button 
          className={`${buttonBaseClasses} ${sourceMode === AudioSourceMode.FILE ? activeButtonClasses : inactiveButtonClasses} rounded-r-lg`}
          onClick={() => setSourceMode(AudioSourceMode.FILE)}
        >
          Upload File
        </button>
      </div>
      
      <div className="mt-2">
        {sourceMode === AudioSourceMode.EMBEDDED ? <EmbeddedAudio /> : <FileInput />}
      </div>
    </div>
  );
};

export default AudioSourceSelector; 