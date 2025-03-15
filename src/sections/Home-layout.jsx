import React from 'react';
import Navbar from '../components/Navbar';
import HomeCanvas from './Home-canvas';

const HomeLayout = ({ children }) => {
  return (
    <>
      <div className="w-full h-full absolute inset-0 z-10">
        <HomeCanvas />
      </div>
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="relative z-30 w-full" style={{pointerEvents: 'none'}}>
        {children}
      </div>
    </>
  );
};

export default HomeLayout;
