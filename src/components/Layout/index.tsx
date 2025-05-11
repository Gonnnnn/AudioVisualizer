import React from 'react';
import Controls from '../Controls';
import Visualizer from '../Visualizer';
import './styles.css';

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

  return (
    <div className="layout">
      <div className="content">
        <Visualizer />
        <Controls />
      </div>
      {children}
    </div>
  );
};

export default Layout;