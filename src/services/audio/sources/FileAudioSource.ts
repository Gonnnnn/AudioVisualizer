import { type IAudioSource } from '../../../types';

export class FileAudioSource implements IAudioSource {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isAudioPlaying = false;
  private onEndedCallback: (() => void) | null = null;
  private currentVolume = 0.5;

  constructor() {
    // AudioContext will be created when needed to avoid autoplay restrictions
  }

  async load(fileData: File | ArrayBuffer): Promise<AudioBuffer> {
    // Close any existing audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close();
    }
    
    // Create new audio context
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    let arrayBuffer: ArrayBuffer;
    
    if (fileData instanceof File) {
      arrayBuffer = await this.readFileAsArrayBuffer(fileData);
    } else {
      arrayBuffer = fileData;
    }
    
    try {
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      return this.audioBuffer;
    } catch (error) {
      console.error('Error decoding audio data:', error);
      throw error;
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          resolve(event.target.result);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  play(): void {
    if (!this.audioContext || !this.audioBuffer) {
      console.warn("Please load an audio file first.");
      return;
    }
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    this.setupAudioNodes();
    this.sourceNode?.start(0);
    this.isAudioPlaying = true;
  }

  pause(): void {
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend();
      this.isAudioPlaying = false;
    }
  }

  stop(): void {
    if (this.sourceNode) {
      // Remove the onended callback to prevent it from firing
      this.sourceNode.onended = null;
      
      try {
        this.sourceNode.stop(0);
      } catch (e) {
        // Ignore if already stopped
      }
      
      this.disconnect();
    }
    
    this.isAudioPlaying = false;
  }

  isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  onEnded(callback: () => void): void {
    this.onEndedCallback = callback;
  }

  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  setVolume(volume: number): void {
    this.currentVolume = volume;
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  private setupAudioNodes(): void {
    if (!this.audioContext || !this.audioBuffer) return;
    
    // Disconnect existing nodes
    this.disconnect();
    
    // Create new nodes
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 512; // Should come from config
    this.analyserNode.smoothingTimeConstant = 0.8;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = this.currentVolume;
    
    // Connect the nodes
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    // Set up ended event
    this.sourceNode.onended = () => {
      if (this.isAudioPlaying) {
        this.stop();
        
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      }
    };
  }

  private disconnect(): void {
    if (this.sourceNode) this.sourceNode.disconnect();
    if (this.analyserNode) this.analyserNode.disconnect();
    if (this.gainNode) this.gainNode.disconnect();
  }
}