import { useRef, useEffect, createContext, useContext, useState } from 'react';
import { useHelper } from '@react-three/drei';
import { useControls } from 'leva';
import { SpotLightHelper, PointLightHelper, Fog } from 'three';
import { useThree } from '@react-three/fiber';

// Create a context to share the visibility state
const HelpersVisibilityContext = createContext({
  helpersVisible: false,
  toggleHelpers: () => {}
});

// Custom hook to use the helpers visibility context
export const useHelpersVisibility = () => useContext(HelpersVisibilityContext);

// Provider component to wrap the scene with the visibility state
function HelpersVisibilityProvider({ children }) {
  const [helpersVisible, setHelpersVisible] = useState(false);
  
  const toggleHelpers = () => {
    setHelpersVisible(prev => !prev);
  };
  
  return (
    <HelpersVisibilityContext.Provider value={{ helpersVisible, toggleHelpers }}>
      {children}
    </HelpersVisibilityContext.Provider>
  );
}

function LevaControlsToggle() {
  const { helpersVisible, toggleHelpers } = useHelpersVisibility();
  
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.id = 'leva-toggle-style';
    document.head.appendChild(styleElement);
    
    // Set initial state of controls to match helpers visibility
    updateControlsVisibility(helpersVisible);
    
    function updateControlsVisibility(isVisible) {
      styleElement.innerHTML = isVisible 
        ? '' 
        : `
          div[class*="leva"],
          div[style*="position: fixed"][style*="z-index: 1000"]
          { 
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
        `;
      console.log('Controls and helpers visibility:', isVisible ? 'visible' : 'hidden');
    }
    
    const toggleControls = () => {
      // Toggle the helpers visibility first
      toggleHelpers();
      // Then the controls will update in the next render cycle via the effect below
    };
    
    // This effect runs every time helpersVisible changes
    // ensuring controls and helpers always stay in sync
    updateControlsVisibility(helpersVisible);
    
    const indicator = document.createElement('button');
    indicator.textContent = 'c';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.left = '10px';
    indicator.style.backgroundColor = 'rgba(64, 64, 64, .3)';
    indicator.style.color = 'white';
    indicator.style.padding = '5px 10px';
    indicator.style.borderRadius = '4px';
    indicator.style.fontSize = '12px';
    indicator.style.zIndex = '1000001';
    indicator.style.cursor = 'pointer';
    indicator.style.border = 'none';
    document.body.appendChild(indicator);
    
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'c') {
        toggleControls();
      }
    };
    
    indicator.addEventListener('click', toggleControls);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      indicator.removeEventListener('click', toggleControls);
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [helpersVisible, toggleHelpers]);
  
  return null;
}

function SpotLightWithHelper() {
  const light = useRef();
  const targetRef = useRef();
  const { helpersVisible } = useHelpersVisibility();
  
  // Only show the helper when helpersVisible is true
  useHelper(helpersVisible ? light : null, SpotLightHelper, 'orange');
  
  const { lightColor, intensity, distance, angle, penumbra, decay } = useControls('Spot Light', {
    lightColor: '#ffffff',
    intensity: { value: 12, min: 0.0, max: 20, step: 0.1 },
    distance: { value: 20.0, min: 0.0, max: 30.0, step: 0.1 },
    angle: { value: .5, min: .1, max: 1, step: 0.01 },
    penumbra: { value: 0.5, min: 0.0, max: 1.0, step: 0.1 },
    decay: { value: 1, min: 0.0, max: 10.0, step: 0.1 },
  });
  
  const { spotShadowBias, spotShadowRadius, spotShadowMapSize } = useControls('Spot Light Shadows', {
    spotShadowBias: { value: 0, min: -0.01, max: 0.01, step: 0.0001 },
    spotShadowRadius: { value: 15, min: 0, max: 25, step: 0.1 },
    spotShadowMapSize: { value: 1792, min: 256, max: 4096, step: 256 },
  }, {
    collapsed: true
  });
  
  const safeIntensity = isNaN(intensity) ? 1 : intensity;
  const safeDistance = isNaN(distance) ? 10 : distance;
  const safeAngle = isNaN(angle) ? 0.1 : angle;
  const safePenumbra = isNaN(penumbra) ? 0 : penumbra;
  const safeDecay = isNaN(decay) ? 0.1 : decay;
  const lightPosition = [-3.2, 2, .2];
  const targetPosition = [0, 0, 1.5];
  const safeLightPosition = lightPosition.map(coord => isNaN(coord) ? 0 : coord);

  useEffect(() => {
    if (light.current && targetRef.current) {
      light.current.target = targetRef.current;
      
      // Configure shadow properties
      light.current.shadow.bias = spotShadowBias;
      light.current.shadow.radius = spotShadowRadius;
      light.current.shadow.mapSize.width = spotShadowMapSize;
      light.current.shadow.mapSize.height = spotShadowMapSize;
      light.current.shadow.camera.near = 0.5;
      light.current.shadow.camera.far = 30;
      light.current.shadow.camera.fov = 30;
    }
  }, [spotShadowBias, spotShadowRadius, spotShadowMapSize]);

  return (
    <>
      <spotLight
        ref={light}
        color={lightColor}
        intensity={safeIntensity}
        distance={safeDistance}
        angle={safeAngle}
        penumbra={safePenumbra}
        decay={safeDecay}
        position={safeLightPosition}
        castShadow
        shadow-normalBias={0.05}
      />
      <object3D 
        ref={targetRef} 
        position={targetPosition}
      />
    </>
  );
}

function PointLightWithHelper() {
  const light = useRef();
  const { helpersVisible } = useHelpersVisibility();
  const helperRef = useRef(null);
  
  useEffect(() => {
    // Clean up any existing helper first
    if (helperRef.current && light.current) {
      light.current.remove(helperRef.current);
      helperRef.current = null;
    }
    
    // Create a new helper if visibility is enabled
    if (light.current && helpersVisible) {
      helperRef.current = new PointLightHelper(light.current);
      light.current.add(helperRef.current);
    }
    
    return () => {
      if (helperRef.current && light.current) {
        light.current.remove(helperRef.current);
        helperRef.current = null;
      }
    };
  }, [helpersVisible]);
  
  const { lightColor, intensity, distance, decay } = useControls('Point Light', {
    lightColor: '#ffffff',
    intensity: { value: 2.5, min: 0.0, max: 8.0, step: 0.1 },
    distance: { value: 20.0, min: 0.0, max: 40.0, step: 0.1 },
    decay: { value: 0.5, min: 0.0, max: 10.0, step: 0.1 },
  });
  
  const safeIntensity = isNaN(intensity) ? 1 : intensity;
  const safeDistance = isNaN(distance) ? 10 : distance;
  const safeDecay = isNaN(decay) ? 0.1 : decay;
  const lightPosition = [0, 6, 1];
  const safeLightPosition = lightPosition.map(coord => isNaN(coord) ? 0 : coord);

  const { shadowBias, shadowRadius, shadowMapSize } = useControls('Point Light Shadows', {
    shadowBias: { value: 0, min: -0.01, max: 0.01, step: 0.0001 },
    shadowRadius: { value: 3, min: 0, max: 25, step: 0.1 },
    shadowMapSize: { value: 1024, min: 256, max: 4096, step: 256 },
  }, {
    collapsed: true
  });

  useEffect(() => {
    if (light.current) {
      light.current.shadow.bias = shadowBias;
      light.current.shadow.radius = shadowRadius;
      light.current.shadow.mapSize.width = shadowMapSize;
      light.current.shadow.mapSize.height = shadowMapSize;
      light.current.shadow.camera.near = 0.1;
      light.current.shadow.camera.far = 50;
    }
  }, [shadowBias, shadowRadius, shadowMapSize]);
  
  return (
    <pointLight
      ref={light}
      color={lightColor}
      intensity={safeIntensity}
      distance={safeDistance}
      decay={safeDecay}
      position={safeLightPosition}
      castShadow
      shadow-normalBias={0.05}
    />
  );
}

function BlackFog() {
  const { scene } = useThree();
  
  const { fogNear, fogFar } = useControls('Black Fog', {
    fogNear: { value: 25, min: 0, max: 50, step: 0.1 },
    fogFar: { value: 60, min: 0, max: 120, step: 0.1 },
  }, {
    collapsed: true
  });
  
  useEffect(() => {
    if (scene) {
      scene.fog = new Fog('#000000', fogNear, fogFar);
      return () => {
        scene.fog = null;
      };
    }
  }, [scene, fogNear, fogFar]);
  
  return null;
}

export { 
  LevaControlsToggle, 
  SpotLightWithHelper, 
  PointLightWithHelper, 
  BlackFog, 
  HelpersVisibilityProvider 
};
