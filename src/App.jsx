import { createContext, useContext, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { SoftShadows } from '@react-three/drei'
import * as THREE from "three"
import { GlobalCanvas, SmoothScrollbar,useCanvasStore } from '@14islands/r3f-scroll-rig'
import ScrolRigLayout from './sections/ScrolRigLayout'
import './App.css';

function MyDirectionalLight(){
  const directionalLight=new THREE.DirectionalLight();
  directionalLight.intensity=1.0;
  directionalLight.castShadow=true;
  const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  useFrame(()=>{
    const width=window.innerWidth;
    const height=window.innerHeight;
    directionalLight.shadow.camera.near=0.1;
    directionalLight.shadow.camera.far=2000;
    directionalLight.position.set(0,100,500);
    directionalLight.shadow.mapSize.set(1024,1024);
    directionalLight.shadow.camera.left=width * -0.5 * 0.01;
    directionalLight.shadow.camera.right=width * +0.5 * 0.01;
    directionalLight.shadow.camera.top=height * +0.5 * 0.01 * 3;
    directionalLight.shadow.camera.bottom=height * -0.5 * 0.01 * 3;
    directionalLightShadowHelper.update();
    directionalLightShadowHelper.visible=false;
  })
  return (<>
    <primitive object={directionalLight} />
    <primitive object={directionalLightShadowHelper}/>
  </>);
}
const FovContext = createContext({
  value: 50,
  setState: () => {},
});
function FovUpdateByFovx({ fovx }){
  const fovContext=useContext(FovContext);
  const requestReflow=useCanvasStore((state)=>state.requestReflow);
  useFrame((state)=>{
    const fovy=Math.atan(Math.tan(fovx*THREE.MathUtils.DEG2RAD)/state.viewport.aspect)*THREE.MathUtils.RAD2DEG;
    const epsilon=0.001;
    if(epsilon<Math.abs(fovContext.value - fovy)){
      fovContext.setState(()=>fovy);
      console.log("update");
      requestReflow();
    }
  })
  return null;
}
function App() {
  const [fov, setFov] = useState(20);
  
  return (
    <>
      <FovContext.Provider value={{value:fov,setState:setFov}}>
        <GlobalCanvas shadows={true} camera={{fov:fov}} scaleMultiplier={0.01}>
          <FovUpdateByFovx fovx={20}/>
          <ambientLight intensity={0.6} />
          <MyDirectionalLight/>
          <SoftShadows focus={0.25} />
        </GlobalCanvas>
        <SmoothScrollbar config={{
            duration:0.25,
        }} />
        <ScrolRigLayout/>
      </FovContext.Provider>
    </>
  )
}

export default App