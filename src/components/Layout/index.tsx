import React, { useState } from 'react';
import Controls from '../Controls';
import Visualizer from '../Visualizer';
import MessageBox from '../MessageBox';
import './styles.css';

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageOptions, setMessageOptions] = useState({
    type: 'info',
    duration: 3000
  });

  const showMessage = (msg: string, options = {}) => {
    setMessage(msg);
    setMessageOptions(prev => ({ ...prev, ...options }));
  };

  return (
    <div className="app-layout">
      <Controls />
      <Visualizer />
      {message && (
        <MessageBox 
          message={message} 
          options={messageOptions as any} 
          autoClose={true} 
        />
      )}
      {children}
    </div>
  );
};

export default Layout;