import React from 'react';
import { useVisualizer } from '../../contexts/VisualizerContext';
import { VisualizerMode } from '../../types';

const ModeSelector: React.FC = () => {
  const { visualizerState, setMode, getAvailableModes } = useVisualizer();
  const availableModes = getAvailableModes();

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMode = e.target.value as VisualizerMode;
    setMode(selectedMode);
  };

  // Helper function to format mode name for display
  const formatModeName = (mode: string): string => {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="modeSelector" className="text-white font-medium">
        Mode:
      </label>
      <select
        id="modeSelector"
        value={visualizerState.currentMode}
        onChange={handleModeChange}
        className="bg-purple-950/80 text-white border border-cyan-400 rounded-lg py-2.5 px-4 w-full cursor-pointer focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 appearance-none shadow-[0_0_5px_#FF00FF,0_0_10px_#FF00FF]"
        style={{ textIndent: '0.5rem' }}
      >
        {availableModes.map((mode) => (
          <option key={mode} value={mode} className="bg-purple-950 text-white p-2">
            {formatModeName(mode)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModeSelector;