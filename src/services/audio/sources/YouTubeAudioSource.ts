import { type IAudioSource } from '../../../types';

/**
 * Class for loading and playing audio from YouTube videos
 */
export class YouTubeAudioSource implements IAudioSource {
  private audioContext: AudioContext | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isAudioPlaying = false;
  private onEndedCallback: (() => void) | null = null;
  private currentVolume = 0.5;
  private videoId: string | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private proxyUrl = 'https://yt-audio-proxy.herokuapp.com/audio/'; // Example proxy, you would need to implement or find one

  constructor() {
    // AudioContext will be created when needed to avoid autoplay restrictions
  }

  /**
   * Load audio from a YouTube URL
   * @param url YouTube URL
   */
  async load(url: string): Promise<AudioBuffer> {
    try {
      // Extract video ID from URL
      this.videoId = this.extractVideoId(url);
      
      if (!this.videoId) {
        throw new Error("Invalid YouTube URL format");
      }

      // Create audio context if not exists
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Set up audio processing nodes
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.currentVolume;
      
      // Connect nodes
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);

      // For demo/test purposes, we'll use a proxy to get the audio
      // In production, you'd need a proper server-side proxy to extract audio
      // This will load an MP3 directly from YouTube via a proxy
      const mp3Url = `${this.proxyUrl}${this.videoId}`;
      
      // Create audio element for streaming
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.src = mp3Url;
      
      // Set up ended event
      this.audioElement.onended = () => {
        this.isAudioPlaying = false;
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      };

      // Wait for audio to be loaded and return a dummy AudioBuffer to satisfy the interface
      return new Promise<AudioBuffer>((resolve, reject) => {
        if (!this.audioElement) {
          reject(new Error("Audio element not initialized"));
          return;
        }
        
        this.audioElement.oncanplaythrough = () => {
          if (!this.audioContext || !this.audioElement) {
            reject(new Error("Audio context or element not initialized"));
            return;
          }
          
          // Create media source from audio element
          this.mediaSource = this.audioContext.createMediaElementSource(this.audioElement);
          this.mediaSource.connect(this.gainNode as GainNode);
          
          // Create a dummy buffer to satisfy the interface
          const dummyBuffer = this.audioContext.createBuffer(
            2, // stereo
            this.audioContext.sampleRate * 2, // 2 seconds of audio
            this.audioContext.sampleRate
          );
          
          resolve(dummyBuffer);
        };
        
        this.audioElement.onerror = () => {
          reject(new Error("Error loading YouTube audio"));
        };
        
        // Start loading
        this.audioElement.load();
      });
    } catch (error) {
      console.error("Error loading YouTube audio:", error);
      // Create a dummy buffer to satisfy the interface in case of error
      if (this.audioContext) {
        const dummyBuffer = this.audioContext.createBuffer(
          2, // stereo
          this.audioContext.sampleRate * 2, // 2 seconds of audio
          this.audioContext.sampleRate
        );
        return dummyBuffer;
      }
      throw error;
    }
  }

  play(): void {
    if (!this.audioElement) {
      console.warn("No audio loaded");
      return;
    }

    // Resume audio context if suspended (autoplay policy)
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
    
    this.audioElement.play();
    this.isAudioPlaying = true;
  }

  pause(): void {
    if (this.audioElement && this.isAudioPlaying) {
      this.audioElement.pause();
      this.isAudioPlaying = false;
    }
  }

  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isAudioPlaying = false;
      
      // Call the ended callback when explicitly stopped
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    }
  }

  isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  onEnded(callback: () => void): void {
    this.onEndedCallback = callback;
    if (this.audioElement) {
      this.audioElement.onended = () => {
        this.isAudioPlaying = false;
        callback();
      };
    }
  }

  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.currentVolume;
    }
    if (this.audioElement) {
      this.audioElement.volume = this.currentVolume;
    }
  }

  /**
   * Extract YouTube video ID from various URL formats
   */
  private extractVideoId(url: string): string | null {
    if (!url) return null;
    
    // Regular expression to extract video ID from various YouTube URL formats
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[7].length === 11) ? match[7] : null;
  }
}