import { useRef, useEffect, useMemo, useState } from "react";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { ScrollScene, UseCanvas } from "@14islands/r3f-scroll-rig";
import { useControls, Leva } from "leva";

const levaTheme = {
  sizes: {
    rootWidth: '310px',
    controlWidth: '150px',
    folderHeight: '20px',
    inputHeight: '20px'
  },
  space: {
    sm: '2px',
    md: '4px'
  }
};

function TexturedPanel({ texturePath, position }) {
  const texture = useLoader(THREE.TextureLoader, texturePath);
  return (
    <mesh position={position}>
      <boxGeometry args={[12.8, 7.2, 0.1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

const ControlButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="LevaButton"
  >
    C
  </button>
);

const Particles = () => {
  const particleControls = useControls('Particles', {
    quantity: { value: 200, min: 10, max: 5000, step: 1 },
    minimum_size: { value: 0.2, min: 0.1, max: 10, step: 0.1 },
    maximum_size: { value: 2.5, min: 0.1, max: 10, step: 0.1 },
    min_size_bias: { value: 5, min: 0.1, max: 10, step: 0.1 },
    close_limit: { value: 0.1, min: 0.1, max: 10, step: 0.1 },
    far_limit: { value: 30, min: 10, max: 100, step: 1 },
    closeness_bias: { value: 2, min: 0.1, max: 15, step: 0.1 },
    core_opacity: { value: 0.8, min: .001, max: 1, step: 0.01 },
    mid_opacity: { value: 0.5, min: .001, max: 1, step: 0.01 },
    fringe_opacity: { value: 0.75, min: .001, max: 1, step: 0.01 },
    color: { value: '#ffffff' }
  });

  const {
    quantity,
    minimum_size, 
    maximum_size, 
    close_limit, 
    far_limit,
    closeness_bias,
    min_size_bias,
    core_opacity,
    mid_opacity,
    fringe_opacity,
    color
  } = particleControls;
  const particlesRef = useRef();
  const { camera } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    const rgbaColor = (opacity) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity || 1})`;
    };
    gradient.addColorStop(0, rgbaColor(1));
    gradient.addColorStop(.5, rgbaColor(core_opacity || 1));
    gradient.addColorStop(.65, rgbaColor(mid_opacity || .8));
    gradient.addColorStop(.8, rgbaColor(fringe_opacity || .9));
    gradient.addColorStop(1, rgbaColor(.001));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [core_opacity, mid_opacity, fringe_opacity, color]);

  // Handle particle positioning
  useEffect(() => {
    if (!particlesRef.current) return;
    
    for (let i = 0; i < quantity; i++) {
      const randomValue = Math.pow(Math.random(), closeness_bias);
      const z = close_limit + randomValue * (far_limit - close_limit);
      const sizeRandom = Math.pow(Math.random(), min_size_bias);
      const size = THREE.MathUtils.lerp(minimum_size, maximum_size, sizeRandom);
      
      dummy.position.set(
        (Math.random() - 0.5) * far_limit,
        (Math.random() - 0.5) * far_limit,
        -z
      );
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    particlesRef.current.instanceMatrix.needsUpdate = true;
  }, [quantity, close_limit, far_limit, closeness_bias, min_size_bias, minimum_size, maximum_size]);

  useEffect(() => {
    if (particlesRef.current?.material) {
      particlesRef.current.material.opacity = core_opacity;
    }
  }, [core_opacity]);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <instancedMesh ref={particlesRef} args={[null, null, quantity]}>
      <planeGeometry args={[.1, .1]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        opacity={core_opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

export default function ScrolRigThreeComponent({ texturePath, isFirst }) {
  const scene = useRef(null);
  const [showControls, setShowControls] = useState(false);
  
  const layoutControls = useControls('Layout', {
    texts_top_margin: { value: 45, min: 30, max: 60, step: .1 },
    panels_top_margin: { value: -20, min: -35, max: -5, step: .1 },
    texts_spacing: { value: 70, min: 55, max: 85, step: .1 },
    panels_spacing: { value: -20, min: -35, max: -5, step: .1 },
    texts_right_margin: { value: 30, min: 0, max: 60, step: 1 },
    panels_size: { value: 30, min: 20, max: 40, step: 1 }
  });
  
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--texts-top', `${layoutControls.texts_top_margin}vh`);
    root.style.setProperty('--panels-top', `${layoutControls.panels_top_margin}vh`);
    root.style.setProperty('--text-gap', `${layoutControls.texts_spacing}vh`);
    root.style.setProperty('--panel-gap', `${layoutControls.panels_spacing}vh`);
    root.style.setProperty('--text-right', `${layoutControls.texts_right_margin}vw`);
    root.style.setProperty('--panel-height', `${layoutControls.panels_size}vh`);
  }, [layoutControls.texts_top_margin, layoutControls.panels_top_margin, layoutControls.texts_spacing, layoutControls.panels_spacing, layoutControls.texts_right_margin, layoutControls.panels_size]);

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <article ref={scene}>
      <UseCanvas>
        <ScrollScene track={scene}>
          {({...props}) => (
            <group scale={props.scale.xy.min() * 0.25}>
              <Particles />
              <Float position={[-0.75, 0, 0]}>
                <TexturedPanel 
                  texturePath={texturePath}
                  position={[-0.75, 0, 0]}
                />
              </Float>
            </group>
          )}
        </ScrollScene>
      </UseCanvas>
      <div className={`three-element ${isFirst ? 'three-element-first' : ''}`}></div>
      <ControlButton onClick={toggleControls} />
      <Leva hidden={!showControls} theme={levaTheme} />
    </article>
  );
}
