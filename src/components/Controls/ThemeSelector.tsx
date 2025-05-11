import React from 'react';
import { useVisualizer } from '../../contexts/VisualizerContext';
import { ThemeType } from '../../types';
import { AVAILABLE_THEMES } from '../../config';

const ThemeSelector: React.FC = () => {
  const { visualizerState, setTheme, getAvailableThemes } = useVisualizer();
  const availableThemes = getAvailableThemes();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value as ThemeType;
    setTheme(selectedTheme);
  };

  return (
    <div className="theme-selector">
      <label htmlFor="themeSelector" className="theme-label">
        Theme:
      </label>
      <select
        id="themeSelector"
        value={visualizerState.currentTheme}
        onChange={handleThemeChange}
        className="theme-select"
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme}>
            {AVAILABLE_THEMES[theme].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;