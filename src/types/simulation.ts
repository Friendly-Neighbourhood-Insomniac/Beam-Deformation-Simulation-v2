export interface BeamProps {
  force: number;
  elasticModulus: number;
}

export interface ForceArrowProps {
  position: [number, number, number];
  force: number;
}

export interface SimulationControlsProps {
  force: number;
  setForce: (force: number) => void;
  elasticModulus: number;
  setElasticModulus: (modulus: number) => void;
}