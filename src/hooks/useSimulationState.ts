import { useState } from 'react';

export function useSimulationState() {
  const [force, setForce] = useState(100); // Start with some initial force
  const [elasticModulus, setElasticModulus] = useState(200); // GPa (Steel)

  return {
    force,
    setForce,
    elasticModulus,
    setElasticModulus,
  };
}