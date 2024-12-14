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

export type FoxPropsTypes = {
  currentAnimation: string;
}

export type IslandPropsTypes = {
  scale: [];
  position: [];
  rotation: []
  isRotating: boolean;
  setIsRotating: (flag: boolean) => void;
  setCurrentStage: (stage: number | null) => void;
}

export type PlanePropsTypes = {
  scale: [];
  position: [];
  rotation: []
  isRotating: boolean;
}