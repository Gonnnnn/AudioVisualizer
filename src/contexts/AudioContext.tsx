import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AudioSourceType, type AudioContextType, type AudioState } from '../types';
import { FileAudioSource } from '../services/audio/sources/FileAudioSource';
import { YouTubeAudioSource } from '../services/audio/sources/YouTubeAudioSource';

// Create the initial state
const initialAudioState: AudioState = {
  isPlaying: false,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
  audioContext: null,
  sourceType: null,
  fileName: null,
  frequencyData: null,
};

// Create the context
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Provider props interface
interface AudioProviderProps {
  children: ReactNode;
}

/**
 * AudioProvider component
 */
export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioState>(initialAudioState);
  const [fileSource, setFileSource] = useState<FileAudioSource | null>(null);
  const [youtubeSource, setYoutubeSource] = useState<YouTubeAudioSource | null>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      if (fileSource && fileSource.isPlaying()) {
        fileSource.stop();
      }
      
      if (youtubeSource && youtubeSource.isPlaying()) {
        youtubeSource.stop();
      }
      
      if (audioState.audioContext) {
        audioState.audioContext.close();
      }
    };
  }, []);

  // Update frequency data for visualization
  useEffect(() => {
    if (audioState.isPlaying) {
      const updateFrequencyData = () => {
        const currentSource = audioState.sourceType === AudioSourceType.FILE ? fileSource : youtubeSource;
        const analyserNode = currentSource?.getAnalyserNode();
        
        if (analyserNode) {
          const bufferLength = analyserNode.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserNode.getByteFrequencyData(dataArray);
          
          setAudioState(prev => ({
            ...prev,
            frequencyData: dataArray
          }));
        }
        
        setAnimationFrame(requestAnimationFrame(updateFrequencyData));
      };
      
      updateFrequencyData();
    } else if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      setAnimationFrame(null);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [audioState.isPlaying]);

  /**
   * Load audio from a file
   */
  const loadAudioFile = async (file: File): Promise<void> => {
    try {
      const newFileSource = new FileAudioSource();
      await newFileSource.load(file);
      
      setFileSource(newFileSource);
      setAudioState(prev => ({
        ...prev,
        sourceType: AudioSourceType.FILE,
        fileName: file.name,
        audioContext: newFileSource.getAudioContext(),
      }));
      
      // Set up ended callback
      newFileSource.onEnded(() => {
        setAudioState(prev => ({
          ...prev,
          isPlaying: false
        }));
      });
    } catch (error) {
      console.error('Error loading audio file:', error);
      throw error;
    }
  };

  /**
   * Load audio from YouTube
   */
  const loadYouTubeAudio = async (url: string): Promise<void> => {
    try {
      const newYouTubeSource = new YouTubeAudioSource();
      await newYouTubeSource.load(url);
      
      setYoutubeSource(newYouTubeSource);
      setAudioState(prev => ({
        ...prev,
        sourceType: AudioSourceType.YOUTUBE,
        fileName: 'YouTube Audio',
        audioContext: newYouTubeSource.getAudioContext(),
      }));
      
      // Set up ended callback
      newYouTubeSource.onEnded(() => {
        setAudioState(prev => ({
          ...prev,
          isPlaying: false
        }));
      });
    } catch (error) {
      console.error('Error loading YouTube audio:', error);
      throw error;
    }
  };

  /**
   * Play audio
   */
  const playAudio = (): void => {
    const currentSource = audioState.sourceType === AudioSourceType.FILE ? fileSource : youtubeSource;
    
    if (currentSource) {
      currentSource.play();
      setAudioState(prev => ({
        ...prev,
        isPlaying: true
      }));
    }
  };

  /**
   * Pause audio
   */
  const pauseAudio = (): void => {
    const currentSource = audioState.sourceType === AudioSourceType.FILE ? fileSource : youtubeSource;
    
    if (currentSource) {
      currentSource.pause();
      setAudioState(prev => ({
        ...prev,
        isPlaying: false
      }));
    }
  };

  /**
   * Stop audio
   */
  const stopAudio = (): void => {
    const currentSource = audioState.sourceType === AudioSourceType.FILE ? fileSource : youtubeSource;
    
    if (currentSource) {
      currentSource.stop();
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0
      }));
    }
  };

  /**
   * Set volume
   */
  const setVolume = (volume: number): void => {
    const currentSource = audioState.sourceType === AudioSourceType.FILE ? fileSource : youtubeSource;
    
    if (currentSource) {
      currentSource.setVolume(volume);
    }
    
    setAudioState(prev => ({
      ...prev,
      volume
    }));
  };

  /**
   * Get frequency data for visualization
   */
  const getFrequencyData = (): Uint8Array | null => {
    return audioState.frequencyData;
  };

  // Context value
  const value: AudioContextType = {
    audioState,
    loadAudioFile,
    loadYouTubeAudio,
    playAudio,
    pauseAudio,
    stopAudio,
    setVolume,
    getFrequencyData
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

/**
 * Custom hook to use the audio context
 */
export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  
  return context;
};