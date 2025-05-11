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
    <div className="flex flex-col gap-1">
      <label htmlFor="themeSelector" className="text-white font-medium">
        Theme:
      </label>
      <select
        id="themeSelector"
        value={visualizerState.currentTheme}
        onChange={handleThemeChange}
        className="bg-purple-950/80 text-white border border-cyan-400 rounded-lg py-2.5 px-4 w-full cursor-pointer focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 appearance-none shadow-[0_0_5px_#FF00FF,0_0_10px_#FF00FF]"
        style={{ textIndent: '0.5rem' }}
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme} className="bg-purple-950 text-white p-2">
            {AVAILABLE_THEMES[theme].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;