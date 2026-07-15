import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh } from 'three';

import skyScene from "../assets/3d/sky.glb";
import { SkyPropsTypes } from "../types";

function Sky({ isRotating, ...props }: SkyPropsTypes) {
  const skyRef = useRef<Mesh>(null);
  const sky = useGLTF(skyScene);

  useFrame((_, delta) => {
    if (isRotating) {
      if(skyRef.current) {
        skyRef.current.rotation.y += 0.15 * delta;
      }
      
    }
  });

  return (
    <mesh {...props} ref={skyRef}>
      <primitive object={sky.scene} />
    </mesh>
  );
}

export default Sky;
