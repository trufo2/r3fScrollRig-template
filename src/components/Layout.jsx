import React from 'react';
import Navbar from './Navbar';
import HomeCanvas from '../sections/Home-canvas';

const Layout = ({ children }) => {
  return (
    <>
      {/* Canvas is placed first with a lower z-index */}
      <div className="w-full h-full absolute inset-0 z-10">
        <HomeCanvas />
      </div>
      
      {/* Navbar and content are placed above the canvas */}
      <div className="relative z-50">
        <Navbar />
      </div>
      
      {/* Content sections are above the canvas */}
      <div className="relative z-30 w-full" style={{pointerEvents: 'none'}}>
        {children}
      </div>
    </>
  );
};

export default Layout;
