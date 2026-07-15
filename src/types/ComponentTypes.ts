export type AlertPropsType = {
  type: string;
  text: string;
}

export type InfoboxType = {
  text: string;
  link: string;
  btnText: string;
}

export type InfoPropsTypes = {
  currentStage: number;
}

export type Vector3Tuple = [x: number, y: number, z: number];

export type FoxPropsTypes = {
  currentAnimation: string;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: Vector3Tuple;
}

export type IslandPropsTypes = {
  scale: Vector3Tuple;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  isRotating: boolean;
  setIsRotating: (flag: boolean) => void;
  setCurrentStage: (stage: number | null) => void;
}

export type PlanePropsTypes = {
  scale: Vector3Tuple;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  isRotating: boolean;
}

export type SkyPropsTypes = {
  isRotating: boolean;
}

export type Sample = {
  x: number, 
  y: number, 
  z: number,
}