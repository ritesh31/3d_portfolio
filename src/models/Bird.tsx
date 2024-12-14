import { useEffect, useRef, MutableRefObject } from "react";
import { Mesh, BufferGeometry, Material } from "three";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import birdScene from "../assets/3d/bird.glb";

function Bird() {
  const birdRef: MutableRefObject<Mesh<BufferGeometry, Material[]>> = useRef(null!);
  const { scene, animations } = useGLTF(birdScene);
  const { actions } = useAnimations(animations, birdRef);

  useEffect(() => {
    console.log(actions);
    actions["Take 001"]?.play();
  }, [actions]);

  useFrame(({ clock, camera }) => {
    // Update Y position simulate bird like motion using a sine wave
    birdRef.current.position.y = Math.sin(clock.elapsedTime) * 0.1 + 2;

    // Check if the bird reached a certain endpoint relative to the camera
    if (birdRef.current.position.x > camera.position.x + 10) {
      // Change direction to backward and rotate the bird 180 degree on the y-axis
      birdRef.current.rotation.y = Math.PI;
    } else if (birdRef.current.position.x < camera.position.x - 10) {
      birdRef.current.rotation.y = 0;
    }

    // Update X & Z positions based on direction
    if (birdRef.current.rotation.y === 0) {
      // Moving forward
      birdRef.current.position.x += 0.01;
      birdRef.current.position.z -= 0.01;
    } else {
      // Moving backward
      birdRef.current.position.x -= 0.01;
      birdRef.current.position.z += 0.01;
    }
  });

  return (
    <mesh position={[-3.5, 0, 1]} scale={[0.003, 0.003, 0.003]} ref={birdRef}>
      <primitive object={scene} />
    </mesh>
  );
}

export default Bird;
