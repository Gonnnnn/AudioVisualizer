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
    <div className="flex items-center gap-2">
      <label htmlFor="themeSelector" className="text-white font-medium">
        Theme:
      </label>
      <select
        id="themeSelector"
        value={visualizerState.currentTheme}
        onChange={handleThemeChange}
        className="bg-purple-950/80 text-white border border-cyan-400 rounded-lg py-2 px-3 cursor-pointer focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 appearance-none"
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme} className="bg-purple-950 text-white">
            {AVAILABLE_THEMES[theme].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;