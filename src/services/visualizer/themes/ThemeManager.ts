import { Color } from 'three';
import { type IVisualizerTheme, type IVisualizerBar, ThemeType } from '../../../types';
import { AVAILABLE_THEMES } from '../../../config';

/**
 * Base theme implementation
 */
class BaseTheme implements IVisualizerTheme {
  name: string;
  protected colors: Color[];

  constructor(name: string, colors: Color[]) {
    this.name = name;
    this.colors = colors;
  }

  getColorForIndex(index: number, total: number): Color {
    return this.colors[index % this.colors.length];
  }

  applyToBar(bar: IVisualizerBar, index: number, total: number): void {
    const color = this.getColorForIndex(index, total);
    if (bar.mesh.material) {
      if (Array.isArray(bar.mesh.material)) {
        bar.mesh.material.forEach(mat => {
          if ((mat as any).color) (mat as any).color = color;
        });
      } else if ((bar.mesh.material as any).color) {
        (bar.mesh.material as any).color = color;
      }
    }
  }
}

/**
 * Neon theme implementation
 */
export class NeonTheme extends BaseTheme {
  constructor() {
    super('Neon', AVAILABLE_THEMES[ThemeType.NEON].colors);
  }
}

/**
 * Blue theme implementation
 */
export class BlueTheme extends BaseTheme {
  constructor() {
    super('Blue', AVAILABLE_THEMES[ThemeType.BLUE].colors);
  }
}

/**
 * Fire theme implementation
 */
export class FireTheme extends BaseTheme {
  constructor() {
    super('Fire', AVAILABLE_THEMES[ThemeType.FIRE].colors);
  }
}

/**
 * Monochrome theme implementation
 */
export class MonoTheme implements IVisualizerTheme {
  name: string;
  private color: Color;

  constructor(color: Color = new Color(0x00FFFF)) {
    this.name = 'Single Color';
    this.color = color;
  }

  getColorForIndex(index: number, total: number): Color {
    return this.color;
  }

  applyToBar(bar: IVisualizerBar, index: number, total: number): void {
    if (bar.mesh.material) {
      if (Array.isArray(bar.mesh.material)) {
        bar.mesh.material.forEach(mat => {
          if ((mat as any).color) (mat as any).color = this.color;
        });
      } else if ((bar.mesh.material as any).color) {
        (bar.mesh.material as any).color = this.color;
      }
    }
  }

  setColor(color: Color): void {
    this.color = color;
  }
}

/**
 * Custom theme implementation
 */
export class CustomTheme implements IVisualizerTheme {
  name: string;
  private colors: Color[];
  private colorMode: 'gradient' | 'random' = 'gradient';

  constructor(colors: Color[] = [new Color(0xFFFFFF)]) {
    this.name = 'Custom';
    this.colors = colors;
  }

  getColorForIndex(index: number, total: number): Color {
    if (this.colorMode === 'random') {
      return this.colors[index % this.colors.length];
    } else {
      // Create gradient effect between colors
      if (this.colors.length === 1) return this.colors[0];
      
      const segment = total / (this.colors.length - 1);
      const segmentIndex = Math.floor(index / segment);
      const remainder = (index % segment) / segment;
      
      const color1 = this.colors[Math.min(segmentIndex, this.colors.length - 1)];
      const color2 = this.colors[Math.min(segmentIndex + 1, this.colors.length - 1)];
      
      return new Color().lerpColors(color1, color2, remainder);
    }
  }

  applyToBar(bar: IVisualizerBar, index: number, total: number): void {
    const color = this.getColorForIndex(index, total);
    if (bar.mesh.material) {
      if (Array.isArray(bar.mesh.material)) {
        bar.mesh.material.forEach(mat => {
          if ((mat as any).color) (mat as any).color = color;
        });
      } else if ((bar.mesh.material as any).color) {
        (bar.mesh.material as any).color = color;
      }
    }
  }

  setColors(colors: Color[]): void {
    this.colors = colors;
  }

  setColorMode(mode: 'gradient' | 'random'): void {
    this.colorMode = mode;
  }
}

/**
 * Factory function to create themes
 */
export function createTheme(themeId: ThemeType): IVisualizerTheme {
  switch (themeId) {
    case ThemeType.NEON:
      return new NeonTheme();
    case ThemeType.BLUE:
      return new BlueTheme();
    case ThemeType.FIRE:
      return new FireTheme();
    case ThemeType.MONO:
      return new MonoTheme();
    case ThemeType.CUSTOM:
      return new CustomTheme();
    default:
      return new NeonTheme();
  }
}