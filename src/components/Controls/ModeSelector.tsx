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
    <div className="mode-selector">
      <label htmlFor="modeSelector" className="mode-label">
        Mode:
      </label>
      <select
        id="modeSelector"
        value={visualizerState.currentMode}
        onChange={handleModeChange}
        className="mode-select"
      >
        {availableModes.map((mode) => (
          <option key={mode} value={mode}>
            {formatModeName(mode)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModeSelector;