import React from 'react';
import Navbar from '../components/Navbar';
import SitesCanvas from './Sites-canvas';

const SitesLayout = ({ children }) => {
  return (
    <>
      <div className="w-full h-full absolute inset-0 z-10">
        <SitesCanvas />
      </div>
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="relative z-30 w-full" style={{pointerEvents: 'auto'}}>
        {children}
      </div>
    </>
  );
};

export default SitesLayout;
