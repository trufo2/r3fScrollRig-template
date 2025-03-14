import { Canvas, useFrame } from '@react-three/fiber';
import { useRef} from 'react';
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  useHelper,
  useGLTF,
} from '@react-three/drei';
import { useControls } from 'leva';
import { SpotLightHelper } from 'three';

function AnimatedBox() {
  const boxRef = useRef();
  const { color, speed } = useControls({
    color:'#0088ff',speed:{value:.005,min:0,max:.03,step:.001,},
  });
  useFrame(() => {
    boxRef.current.rotation.x += speed;
    boxRef.current.rotation.y += speed;
    boxRef.current.rotation.z += speed;
  });
  return (
    <mesh ref={boxRef} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
function LightWithHelper() {
  const light = useRef();
  useHelper(light, SpotLightHelper, 'orange');
  const { lightColor, intensity, distance, angle, penumbra, decay } = useControls({
    lightColor: '#ccff00',
    intensity: { value: 8.0, min: 0.0, max: 8.0, step: 0.1 },
    distance: { value: 20.0, min: 0.0, max: 30.0, step: 0.1 },
    angle: { value: .17, min: 0, max: .4, step: 0.01 },
    penumbra: { value: 0.8, min: 0.0, max: 1.0, step: 0.1 },
    decay: { value: 0.5, min: 0.0, max: 10.0, step: 0.1 },
  });
  return (
    <spotLight
      ref={light}
      color={lightColor}
      intensity={intensity}
      distance={distance}
      angle={angle}
      penumbra={penumbra}
      decay={decay}
      position={[4, 8, 3]}
      castShadow
    />
  );
}
function Model() {
  const result = useGLTF('/assets/dragon_26k.glb');
  result.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return <primitive object={result.scene} position={[-2, -1.2, -4]} />;
}
function App() {
  return (
    <div id='canvas-container'>
      <Canvas shadows>
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>
        <OrbitControls />
        <gridHelper args={[20, 20, 0xdddddd, 0xaaaaaa]} />
        <LightWithHelper />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial />
        </mesh>
        <AnimatedBox />
        <Model />
      </Canvas>
    </div>
  );
}
export default App;