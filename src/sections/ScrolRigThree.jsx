import { useRef, useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { ScrollScene, UseCanvas } from "@14islands/r3f-scroll-rig";

function TexturedPanel({ texturePath, position }) {
  const texture = useLoader(THREE.TextureLoader, texturePath);
  return (
    <mesh position={position}>
      <boxGeometry args={[12.8, 7.2, 0.1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

const Particles = () => {
  const particlesCount = 2000;
  const particlesRef = useRef();
  const { viewport } = useThree();
  
  useEffect(() => {
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount; i++) {
      const z = (Math.random() - 0.5) * 50;
      positions[i * 3] = (Math.random() - 0.5) * 2 * viewport.width;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * viewport.height;
      positions[i * 3 + 2] = z;
      sizes[i] = Math.max(1.0, 2000.0 - Math.abs(z) * 40.0);
    }
    
    particlesRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesRef.current.geometry.setAttribute(
      'size',
      new THREE.BufferAttribute(sizes, 1)
    );
  }, [viewport]);
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default function ScrolRigThreeComponent({ texturePath }) {
  const scene = useRef(null);

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
      <div className="three-element"></div>
    </article>
  );
}
