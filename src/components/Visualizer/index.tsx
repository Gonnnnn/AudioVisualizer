import React, { useRef, useEffect } from 'react';
import { useVisualizer } from '../../contexts/VisualizerContext';
import { useAudio } from '../../contexts/AudioContext';

const Visualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { initializeVisualizer, updateVisualizer } = useVisualizer();
  const { getFrequencyData } = useAudio();
  
  // Initialize the visualizer when the component mounts
  useEffect(() => {
    if (canvasRef.current) {
      initializeVisualizer(canvasRef.current);
    }
    
    return () => {
      // Clean up will be handled by the visualizer context
    };
  }, [initializeVisualizer]);
  
  // Animation frame for updating the visualizer
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      // Get the latest frequency data from the audio context
      const frequencyData = getFrequencyData();
      
      // Update the visualizer with the latest data
      updateVisualizer(frequencyData);
      
      // Continue the animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start the animation loop
    animate();
    
    // Clean up the animation frame when the component unmounts
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updateVisualizer, getFrequencyData]);

  return <canvas ref={canvasRef} id="visualizerCanvas" className="fixed top-0 left-0 w-full h-full z-[1]" />;
};

export default Visualizer;