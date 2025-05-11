import React from 'react';
import Controls from '../Controls';
import Visualizer from '../Visualizer';

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="w-full h-full">
        <Visualizer />
        <Controls />
      </div>
      {children}
    </div>
  );
};

export default Layout;