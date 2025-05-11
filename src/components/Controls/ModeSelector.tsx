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
    <div className="flex items-center gap-2">
      <label htmlFor="modeSelector" className="text-white font-medium">
        Mode:
      </label>
      <select
        id="modeSelector"
        value={visualizerState.currentMode}
        onChange={handleModeChange}
        className="bg-purple-950/80 text-white border border-cyan-400 rounded-lg py-2 px-3 cursor-pointer focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 appearance-none"
      >
        {availableModes.map((mode) => (
          <option key={mode} value={mode} className="bg-purple-950 text-white">
            {formatModeName(mode)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModeSelector;