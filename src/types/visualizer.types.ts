import { Color, Mesh } from 'three';

/**
 * Interface for a single visualizer bar in the 3D scene
 */
export interface IVisualizerBar {
  mesh: Mesh;
  update(value: number): void;
}

/**
 * Interface for color themes
 */
export interface IVisualizerTheme {
  name: string;
  getColorForIndex(index: number, total: number): Color;
  applyToBar(bar: IVisualizerBar, index: number, total: number): void;
}

/**
 * Interface for visualizer modes
 */
export interface IVisualizer {
  init(): void;
  update(frequencyData: Uint8Array | null): void;
  resize(width: number, height: number): void;
  setTheme(theme: IVisualizerTheme): void;
  destroy(): void;
}

/**
 * Visualizer configuration
 */
export interface IVisualizerConfig {
  gridSize: number;
  barSpacing: number;
  maxBarHeight: number;
  fftSize: number;
}

/**
 * Available visualizer modes
 */
export enum VisualizerMode {
  GRID = 'grid',
  CIRCULAR = 'circular',
}

/**
 * Available theme types
 */
export enum ThemeType {
  NEON = 'neon',
  BLUE = 'blue',
  FIRE = 'fire',
  MONO = 'mono',
  CUSTOM = 'custom',
}

/**
 * Visualizer state for context
 */
export interface VisualizerState {
  currentMode: VisualizerMode;
  currentTheme: ThemeType;
  isInitialized: boolean;
  canvas: HTMLCanvasElement | null;
}

/**
 * Visualizer context type for provider
 */
export interface VisualizerContextType {
  visualizerState: VisualizerState;
  setMode: (mode: VisualizerMode) => void;
  setTheme: (theme: ThemeType) => void;
  getAvailableModes: () => VisualizerMode[];
  getAvailableThemes: () => ThemeType[];
  updateVisualizer: (frequencyData: Uint8Array | null) => void;
  initializeVisualizer: (canvas: HTMLCanvasElement) => void;
}

/**
 * Application settings
 */
export interface AppSettings {
  theme: ThemeType;
  visualizerMode: VisualizerMode;
  volume: number;
  audioSource: string;
}