import React, { createContext, useContext, useState, useEffect, type ReactNode, useRef, useCallback } from 'react';
import { 
    ThemeType,
    VisualizerMode,
  type VisualizerContextType, 
  type VisualizerState, 
  type IVisualizer
} from '../types';
import { DEFAULT_MODE, DEFAULT_THEME } from '../config';
import { GridVisualizer } from '../services/visualizer/modes/GridVisualizer';
import { CircularVisualizer } from '../services/visualizer/modes/CircularVisualizer';
import { createTheme } from '../services/visualizer/themes/ThemeManager';

// Initial state
const initialVisualizerState: VisualizerState = {
  currentMode: DEFAULT_MODE,
  currentTheme: DEFAULT_THEME,
  isInitialized: false,
  canvas: null
};

// Create context
const VisualizerContext = createContext<VisualizerContextType | undefined>(undefined);

// Provider props interface
interface VisualizerProviderProps {
  children: ReactNode;
}

/**
 * VisualizerProvider component
 */
export const VisualizerProvider: React.FC<VisualizerProviderProps> = ({ children }) => {
  const [visualizerState, setVisualizerState] = useState<VisualizerState>(initialVisualizerState);
  const activeVisualizerRef = useRef<IVisualizer | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (activeVisualizerRef.current) {
        activeVisualizerRef.current.destroy();
        activeVisualizerRef.current = null;
      }
    };
  }, []);

  // Initialize visualizer. Pass a canvas element to draw the visualizer on.
  const initializeVisualizer = useCallback((canvas: HTMLCanvasElement) => {
    if (activeVisualizerRef.current) {
      activeVisualizerRef.current.destroy();
    }
    
    switch (visualizerState.currentMode) {
      case VisualizerMode.GRID:
        activeVisualizerRef.current = new GridVisualizer(canvas);
        break;
      case VisualizerMode.CIRCULAR:
        activeVisualizerRef.current = new CircularVisualizer(canvas);
        break;
    }
    
    if (activeVisualizerRef.current) {
      activeVisualizerRef.current.init();
      
      // Apply theme
      const theme = createTheme(visualizerState.currentTheme);
      activeVisualizerRef.current.setTheme(theme);
    }
    
    setVisualizerState(prev => ({
      ...prev,
      isInitialized: true,
      canvas
    }));
    
    // Set up resize handler
    const handleResize = () => {
      if (activeVisualizerRef.current && canvas) {
        activeVisualizerRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [visualizerState.currentMode, visualizerState.canvas]);

  /**
   * Set visualizer mode
   */
  const setMode = (mode: VisualizerMode): void => {
    if (mode === visualizerState.currentMode) return;
    
    // Update state first
    setVisualizerState(prev => ({
      ...prev,
      currentMode: mode
    }));
    
    // If visualizer is initialized, recreate it with new mode
    if (visualizerState.canvas) {
      if (activeVisualizerRef.current) {
        activeVisualizerRef.current.destroy();
      }
      
      if (mode === VisualizerMode.GRID) {
        activeVisualizerRef.current = new GridVisualizer(visualizerState.canvas);
      } else if (mode === VisualizerMode.CIRCULAR) {
        activeVisualizerRef.current = new CircularVisualizer(visualizerState.canvas);
      }
      
      if (activeVisualizerRef.current) {
        activeVisualizerRef.current.init();
        
        // Apply current theme
        const theme = createTheme(visualizerState.currentTheme);
        activeVisualizerRef.current.setTheme(theme);
      }
    }
    
    // Save to localStorage
    saveSettings();
  };

  /**
   * Set visualizer theme
   */
  const setTheme = (theme: ThemeType): void => {
    if (theme === visualizerState.currentTheme) return;
    
    setVisualizerState(prev => ({
      ...prev,
      currentTheme: theme
    }));
    
    // Apply theme to active visualizer
    if (activeVisualizerRef.current) {
      const newTheme = createTheme(theme);
      activeVisualizerRef.current.setTheme(newTheme);
    }
    
    // Save to localStorage
    saveSettings();
  };

  /**
   * Get available visualizer modes
   */
  const getAvailableModes = (): VisualizerMode[] => {
    return [VisualizerMode.GRID, VisualizerMode.CIRCULAR];
  };

  /**
   * Get available themes
   */
  const getAvailableThemes = (): ThemeType[] => {
    return [
      ThemeType.NEON,
      ThemeType.BLUE,
      ThemeType.FIRE,
      ThemeType.MONO,
      ThemeType.CUSTOM
    ];
  };

  /**
   * Update visualizer with frequency data
   */
  const updateVisualizer = (frequencyData: Uint8Array | null): void => {
    if (activeVisualizerRef.current) {
      activeVisualizerRef.current.update(frequencyData);
    }
  };

  /**
   * Save settings to localStorage
   */
  const saveSettings = (): void => {
    const settings = {
      theme: visualizerState.currentTheme,
      visualizerMode: visualizerState.currentMode,
      volume: 0.5, // This would typically come from audio context
      audioSource: 'file'
    };
    
    localStorage.setItem('visualizerSettings', JSON.stringify(settings));
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('visualizerSettings');
    
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        
        setVisualizerState(prev => ({
          ...prev,
          currentTheme: parsedSettings.theme || DEFAULT_THEME,
          currentMode: parsedSettings.visualizerMode || DEFAULT_MODE
        }));
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    }
  }, []);

  // Context value
  const value: VisualizerContextType = {
    visualizerState,
    setMode,
    setTheme,
    getAvailableModes,
    getAvailableThemes,
    updateVisualizer,
    initializeVisualizer
  };

  return (
    <VisualizerContext.Provider value={value}>
      {children}
    </VisualizerContext.Provider>
  );
};

/**
 * Custom hook to use the visualizer context
 */
export const useVisualizer = (): VisualizerContextType => {
  const context = useContext(VisualizerContext);
  
  if (context === undefined) {
    throw new Error('useVisualizer must be used within a VisualizerProvider');
  }
  
  return context;
};