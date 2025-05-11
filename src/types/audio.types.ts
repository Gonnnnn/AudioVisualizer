/**
 * Audio source types enum
 */
export enum AudioSourceType {
    FILE = 'file',
    YOUTUBE = 'youtube',
  }
  
  /**
   * Interface for audio sources
   */
  export interface IAudioSource {
    load(data: any): Promise<AudioBuffer>;
    play(): void;
    pause(): void;
    stop(): void;
    isPlaying(): boolean;
    onEnded(callback: () => void): void;
    getAnalyserNode(): AnalyserNode | null;
    setVolume(volume: number): void;
  }
  
  /**
   * Interface for audio manager
   */
  export interface IAudioManager {
    setupSource(source: IAudioSource): void;
    getCurrentSource(): IAudioSource | null;
    getFrequencyData(): Uint8Array | null;
  }
  
  /**
   * Message options for UI notifications
   */
  export interface IMessageOptions {
    duration?: number;
    type?: 'info' | 'success' | 'error' | 'warning';
  }
  
  /**
   * Audio state interface for context
   */
  export interface AudioState {
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    audioContext: AudioContext | null;
    sourceType: AudioSourceType | null;
    fileName: string | null;
    frequencyData: Uint8Array | null;
  }
  
  /**
   * Audio context interface for provider
   */
  export interface AudioContextType {
    audioState: AudioState;
    loadAudioFile: (file: File) => Promise<void>;
    loadYouTubeAudio: (url: string) => Promise<void>;
    playAudio: () => void;
    pauseAudio: () => void;
    stopAudio: () => void;
    setVolume: (volume: number) => void;
    getFrequencyData: () => Uint8Array | null;
  }