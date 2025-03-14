import React from 'react';
import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { useMediaQuery } from 'react-responsive';
import { calculateSizes } from '../constants/index';
import CanvasLoader from '../components/CanvasLoader';
import { 
  SpotLightWithHelper, 
  PointLightWithHelper, 
  LevaControlsToggle, 
  BlackFog, 
  HelpersVisibilityProvider 
} from '../components/LightsNhelpers';

const Model = () => {
  const { scene } = useGLTF('models/deskNpc.glb');
  
  useEffect(() => {
    // Elements that should cast shadows
    const castShadowElements = ['chair', 'desk', 'keyb', 'lamp', 'mouse', 'pc', 'screen'];
    // Elements that should receive shadows
    const receiveShadowElements = ['floor', 'desk', 'chair'];
    
    scene.traverse((child) => {
      if (child.isMesh) {
        // Check if this mesh should cast shadows
        if (castShadowElements.some(name => child.name.toLowerCase().includes(name))) {
          child.castShadow = true;
        }
        
        // Check if this mesh should receive shadows
        if (receiveShadowElements.some(name => child.name.toLowerCase().includes(name))) {
          child.receiveShadow = true;
        }
      }
    });
  }, [scene]);
  
  const isSmall = useMediaQuery({maxWidth: 440});
  const isMobile = useMediaQuery({maxWidth: 768});
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const sizes = calculateSizes(isSmall, isMobile, isTablet);
  
  return (
    <group
      position={sizes.deskPosition}
      rotation={[0, 0, 0]}
      scale={sizes.deskScale}
    >
      <primitive object={scene} />
    </group>
  );
};

const HomeCanvas = () => {
  const isSmall = useMediaQuery({maxWidth: 440});
  const isMobile = useMediaQuery({maxWidth: 768});
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const sizes = calculateSizes(isSmall, isMobile, isTablet);

  return (
    <div className="w-full h-full absolute inset-0 z-0" style={{ pointerEvents: 'auto' }}>
      <HelpersVisibilityProvider>
        <LevaControlsToggle />
        <Canvas className="w-screen h-screen shadows" style={{ touchAction: 'none' }} shadows>
          <Suspense fallback={<CanvasLoader />}>
            <PerspectiveCamera makeDefault position={[-5, 10, 15]} />
            <OrbitControls />
            <ambientLight intensity={0.2} color="#b9d5ff" />
            <SpotLightWithHelper />
            <PointLightWithHelper />
            <BlackFog />
            {sizes ? <Model /> : null}
          </Suspense>
        </Canvas>
      </HelpersVisibilityProvider>
    </div>
  );
};

export default HomeCanvas;
