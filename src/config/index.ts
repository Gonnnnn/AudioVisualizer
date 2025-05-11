import { Color } from 'three';
import { ThemeType, VisualizerMode, type IVisualizerConfig } from '../types';

/**
 * Default theme
 */
export const DEFAULT_THEME = ThemeType.NEON;

/**
 * Default visualizer mode
 */
export const DEFAULT_MODE = VisualizerMode.GRID;

/**
 * Visualizer configuration
 */
export const VISUALIZER_CONFIG: IVisualizerConfig = {
  gridSize: 16,
  barSpacing: 1.5,
  maxBarHeight: 15,
  fftSize: 512
};

/**
 * Available color themes
 */
export const AVAILABLE_THEMES = {
  [ThemeType.NEON]: {
    name: 'Neon',
    colors: [
      new Color(0x00FFFF), // Cyan
      new Color(0xFF00FF), // Magenta
      new Color(0xFFFF00), // Yellow
      new Color(0x00FF00), // Green
      new Color(0xFF69B4), // Hot Pink
      new Color(0x00BFFF), // Deep Sky Blue
    ]
  },
  [ThemeType.BLUE]: {
    name: 'Blue',
    colors: [
      new Color(0x0000FF), // Blue
      new Color(0x00BFFF), // Deep Sky Blue
      new Color(0x87CEEB), // Sky Blue
      new Color(0x1E90FF), // Dodger Blue
      new Color(0x4169E1), // Royal Blue
      new Color(0x000080), // Navy
    ]
  },
  [ThemeType.FIRE]: {
    name: 'Fire',
    colors: [
      new Color(0xFF0000), // Red
      new Color(0xFF4500), // Orange Red
      new Color(0xFF8C00), // Dark Orange
      new Color(0xFFD700), // Gold
      new Color(0xFFFF00), // Yellow
      new Color(0xFFA500), // Orange
    ]
  },
  [ThemeType.MONO]: {
    name: 'Single Color',
    colors: [new Color(0x00FFFF)]
  },
  [ThemeType.CUSTOM]: {
    name: 'Custom',
    colors: [new Color(0xFFFFFF)]
  }
};

/**
 * Default background color
 */
export const DEFAULT_BACKGROUND_COLOR = 0x110011; // Dark purple