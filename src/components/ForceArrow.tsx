import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ForceArrowProps } from '../types/simulation';

export function ForceArrow({ position, force }: ForceArrowProps) {
  const arrowRef = useRef<Group>(null);
  const shaftRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!arrowRef.current) return;
    arrowRef.current.position.set(...position);
  }, [position]);

  useFrame(() => {
    if (!shaftRef.current || !headRef.current) return;
    
    const baseScale = Math.min(Math.abs(force) / 200, 2);
    const minScale = 0.2;
    const scale = minScale + baseScale;
    
    shaftRef.current.scale.y = scale;
    headRef.current.position.y = scale * 0.25; // Changed to positive to move head down
  });

  return (
    <group ref={arrowRef}>
      <mesh ref={shaftRef} position={[0, 0.25, 0]} rotation={[Math.PI, 0, 0]}> {/* Rotated 180° around X axis */}
        <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      
      <mesh ref={headRef} rotation={[Math.PI, 0, 0]}> {/* Rotated 180° around X axis */}
        <coneGeometry args={[0.08, 0.2, 12]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}