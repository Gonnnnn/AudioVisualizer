import React, { useEffect, useState } from 'react';
import { AudioProvider } from './contexts/AudioContext';
import { VisualizerProvider } from './contexts/VisualizerContext';
import Layout from './components/Layout';
import MessageBox from './components/MessageBox';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate initialization process
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AudioProvider>
      <VisualizerProvider>
        <Layout>
          {isInitializing && <MessageBox message="Loading 3D Neon Audio Visualizer..." />}
        </Layout>
      </VisualizerProvider>
    </AudioProvider>
  );
};

export default App;