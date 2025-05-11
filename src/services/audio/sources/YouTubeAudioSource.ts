import { type IAudioSource } from '../../../types';

/**
 * YouTube audio source - placeholder for future implementation
 * This will allow playing audio from YouTube videos in the visualizer
 */
export class YouTubeAudioSource implements IAudioSource {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isAudioPlaying = false;
  private onEndedCallback: (() => void) | null = null;
  private currentVolume = 0.5;
  private videoId: string | null = null;

  constructor() {
    // AudioContext will be created when needed to avoid autoplay restrictions
  }

  /**
   * Load audio from a YouTube URL
   * @param url YouTube URL
   */
  async load(url: string): Promise<AudioBuffer> {
    console.log("YouTube integration coming soon!");
    
    // Extract video ID from URL
    this.videoId = this.extractVideoId(url);
    
    if (!this.videoId) {
      throw new Error("Invalid YouTube URL format.");
    }
    
    // This is a placeholder method that will be implemented in the future
    // For now, return a dummy AudioBuffer to satisfy the interface
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.audioBuffer = this.audioContext.createBuffer(2, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
    
    // Set up audio nodes
    this.analyserNode = this.audioContext.createAnalyser();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = this.currentVolume;
    
    // Connect nodes
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
    
    return this.audioBuffer;
  }

  play(): void {
    if (!this.audioContext || !this.audioBuffer) {
      console.warn("YouTube integration is not yet available.");
      return;
    }

    // Create and set up source node
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    
    // Connect source to gain node
    if (this.gainNode) {
      this.sourceNode.connect(this.gainNode);
    }
    
    // Set up ended callback
    if (this.onEndedCallback) {
      this.sourceNode.onended = () => {
        this.isAudioPlaying = false;
        this.onEndedCallback?.();
      };
    }
    
    this.sourceNode.start();
    this.isAudioPlaying = true;
  }

  pause(): void {
    if (this.sourceNode && this.isAudioPlaying) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
      this.isAudioPlaying = false;
    }
  }

  stop(): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
      this.isAudioPlaying = false;
      
      // Call the ended callback when explicitly stopped
      this.onEndedCallback?.();
    }
  }

  isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  onEnded(callback: () => void): void {
    this.onEndedCallback = callback;
    // If there's an active source node, attach the callback
    if (this.sourceNode) {
      this.sourceNode.onended = () => {
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