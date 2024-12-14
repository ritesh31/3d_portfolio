import { useEffect, useRef, MutableRefObject } from "react";
import { Mesh, BufferGeometry, Material } from "three";
import { useAnimations, useGLTF } from "@react-three/drei";

import planeScene from "../assets/3d/plane.glb";
import { PlanePropsTypes } from "../types";

function Plane({ isRotating, ...props }: PlanePropsTypes) {
  const planeRef: MutableRefObject<Mesh<BufferGeometry, Material[]>> = useRef(null!);
  // const planeRef = useRef();
  const { scene, animations } = useGLTF(planeScene);
  const { actions } = useAnimations(animations, planeRef);

  useEffect(() => {
    if (isRotating) {
      actions["Take 001"]?.play();
    } else {
      actions["Take 001"]?.stop();
    }
  }, [actions, isRotating]);

  return (
    <mesh {...props} ref={planeRef}>
      <primitive object={scene} />
    </mesh>
  );
}

export default Plane;
