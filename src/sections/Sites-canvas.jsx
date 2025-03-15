import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import { useMediaQuery } from 'react-responsive';
import * as THREE from 'three';
import gsap from 'gsap';

// Texture paths
const TEXTURE_PATHS = [
  'assets/textures/fontbetou_com.jpg',
  'assets/textures/mussoft_ch.jpg',
  'assets/textures/swissart-consulting_ch.jpg',
  'assets/textures/longines_st.jpg',
  'assets/textures/threejsDynamicLights.png',
];

// URLs for the websites when planes are clicked
const WEBSITE_URLS = [
  'https://fontbetou.com/',
  'https://mussoft.ch/',
  'https://swissart-consulting.ch',
  'https://mussoft.ch/test/st/',
  'https://reportages.ch/three/bsLights14/',
];

// Plane component that represents a single website
const Plane = ({ index, position, rotation, texture, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (meshRef.current) {
      // Initial rotation animation
      const direction = index % 2 === 0 ? 1 : -1;
      gsap.to(meshRef.current.rotation, {
        duration: 6,
        x: direction * Math.PI / 30,
        y: direction * Math.PI / 40,
        z: direction * Math.PI / 50,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });
    }
  }, [index]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Subtle continuous rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
    >
      <boxGeometry args={[1, 0.75, 0.01]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

// Particles component for background effect
const Particles = () => {
  const particlesCount = 1000;
  const particlesRef = useRef();
  const { viewport } = useThree();
  
  useEffect(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      const sizes = new Float32Array(particlesCount);
      
      for (let i = 0; i < particlesCount; i++) {
        positions.setXYZ(
          i,
          (Math.random() - 0.5) * 10 * viewport.width,
          (Math.random() - 0.5) * 10 * viewport.height,
          (Math.random() - 0.5) * 10
        );
        sizes[i] = Math.random() * 0.5 + 0.1;
      }
      
      particlesRef.current.geometry.setAttribute(
        'size', 
        new THREE.BufferAttribute(sizes, 1)
      );
    }
  }, [viewport]);
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={new Float32Array(particlesCount * 3)}
          itemSize={3}
        />
      </bufferGeometry>
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

// Main scene component
const SitesScene = () => {
  const planesGroupRef = useRef();
  const cameraGroupRef = useRef();
  const [scrollY, setScrollY] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const { viewport } = useThree();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // Load textures
  const textures = useTexture(TEXTURE_PATHS);
  
  // Calculate scroll factor based on document height
  const planesScrollFactor = 0.0001;
  const objectsDistance = 2;
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (event) => {
      setCursor({
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Update planes position based on scroll
  useEffect(() => {
    if (planesGroupRef.current) {
      planesGroupRef.current.position.y = scrollY * planesScrollFactor;
    }
  }, [scrollY, planesScrollFactor]);
  
  // Handle plane click
  const handlePlaneClick = (index) => {
    window.open(WEBSITE_URLS[index], '_blank');
  };
  
  // Camera parallax effect
  useFrame((state, delta) => {
    if (cameraGroupRef.current) {
      cameraGroupRef.current.position.x += (cursor.x * 0.5 - cameraGroupRef.current.position.x) * 5 * delta;
      cameraGroupRef.current.position.y += (cursor.y * 0.5 - cameraGroupRef.current.position.y) * 5 * delta;
    }
  });
  
  return (
    <>
      <group ref={cameraGroupRef}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      </group>
      
      <ambientLight intensity={0.5} />
      <spotLight position={[0, 5, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      
      <Particles />
      
      <group ref={planesGroupRef}>
        {textures.map((texture, index) => {
          const xPos = index % 2 === 0 ? -1.5 : 1.5;
          const yPos = -objectsDistance * index;
          
          return (
            <Plane
              key={index}
              index={index}
              position={[xPos, yPos, 0]}
              rotation={[0, 0, 0]}
              texture={texture}
              onClick={() => handlePlaneClick(index)}
            />
          );
        })}
      </group>
    </>
  );
};

// Main component
const SitesCanvas = () => {
  return (
    <div className="w-full h-full absolute inset-0 z-0" style={{ pointerEvents: 'auto' }}>
      <Canvas className="w-screen h-screen" style={{ touchAction: 'none', pointerEvents: 'auto' }} shadows>
        <SitesScene />
      </Canvas>
      
      {/* This creates extra scroll space for the scroll effect */}
      <div style={{ height: '300vh' }} />
    </div>
  );
};

export default SitesCanvas;
