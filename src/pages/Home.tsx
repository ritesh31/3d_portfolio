import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Loader, Info, HeroSkeleton } from "../components";
import { Island, Sky, Bird, Plane,  } from "../models";
import { Vector3Tuple } from "../types";
import { useProfile } from "../hooks/useProfile";

function Home() {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState<number | null>(1);
  const { profile, loading: profileLoading } = useProfile();

  // Adjusting island depends on screens
  const adjustIslandForScreenSize = () => {
    let screenScale = null;
    const screenPosition = [0, -6.5, -43];
    const rotation: [x: number, y: number, z: number] = [0.1, 4.7, 0];
    if (window.innerWidth > 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [1, 1, 1];
    }
    return [screenScale, screenPosition, rotation];
  };

  // Adjusting plane depends on screens
  const adjustPlaneForScreenSize = () => {
    let screenScale, screenPosition;
    const rotation = [0, 20, 0];
    if (window.innerWidth > 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [-0.5, -1.5, 0.5];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }
    return [screenScale, screenPosition, rotation];
  };

  const [islandScale, islandPosition, islandRotation] =
    adjustIslandForScreenSize();
  const [planeScale, planePosition, planeRotation] = adjustPlaneForScreenSize();

  return (
    <section className="w-full h-screen relative">
      <div className="absolute z-10 top-28 flex items-center left-0 right-0 justify-center">
        {currentStage &&
          (profileLoading || !profile ? (
            <HeroSkeleton />
          ) : (
            <Info
              currentStage={currentStage}
              name={profile.name}
              tagline={profile.tagline}
              infoStage2={profile.info_stage_2}
              infoStage3={profile.info_stage_3}
              infoStage4={profile.info_stage_4}
            />
          ))}
      </div>
      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={1} />
          <ambientLight intensity={0.5} />
          {/* <pointLight /> */}
          {/* <spotLight /> */}
          <hemisphereLight
            color="#b1e1ff"
            groundColor="#000000"
            intensity={1}
          />

          <Bird />
          <Sky isRotating={isRotating} />
          <Island
            scale={islandScale as Vector3Tuple}
            position={islandPosition as Vector3Tuple}
            rotation={islandRotation as Vector3Tuple}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
          />
          <Plane
            scale={planeScale as Vector3Tuple}
            position={planePosition as Vector3Tuple}
            rotation={planeRotation as Vector3Tuple}
            isRotating={isRotating}
          />
        </Suspense>
      </Canvas>
    </section>
  );
}

export default Home;
