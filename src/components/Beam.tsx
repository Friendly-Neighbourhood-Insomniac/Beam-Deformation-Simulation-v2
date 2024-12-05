import { forwardRef, ForwardedRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, BufferGeometry, BufferAttribute, Float32BufferAttribute } from 'three';
import { BeamProps } from '../types/simulation';

export const Beam = forwardRef(({ force, elasticModulus }: BeamProps, ref: ForwardedRef<Mesh>) => {
  const length = 4;
  const height = 0.2;
  const width = 0.4;
  
  // Create initial geometry
  const geometry = useMemo(() => {
    const segments = 32;
    const vertices = [];
    const indices = [];
    const uvs = [];
    
    // Create vertices
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * length - length / 2;
      const u = i / segments;
      
      // Top vertices
      vertices.push(x, height/2, width/2);
      vertices.push(x, height/2, -width/2);
      uvs.push(u, 1, u, 0);
      
      // Bottom vertices
      vertices.push(x, -height/2, width/2);
      vertices.push(x, -height/2, -width/2);
      uvs.push(u, 1, u, 0);
    }
    
    // Create faces
    for (let i = 0; i < segments; i++) {
      const base = i * 4;
      // Top face
      indices.push(base, base + 1, base + 4);
      indices.push(base + 1, base + 5, base + 4);
      // Bottom face
      indices.push(base + 2, base + 6, base + 3);
      indices.push(base + 3, base + 6, base + 7);
      // Front face
      indices.push(base, base + 4, base + 2);
      indices.push(base + 2, base + 4, base + 6);
      // Back face
      indices.push(base + 1, base + 3, base + 5);
      indices.push(base + 3, base + 7, base + 5);
      // Side faces
      indices.push(base, base + 2, base + 1);
      indices.push(base + 1, base + 2, base + 3);
      indices.push(base + 4, base + 5, base + 6);
      indices.push(base + 5, base + 7, base + 6);
    }
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Store original positions for reset
  const originalPositions = useMemo(() => {
    return new Float32Array(geometry.attributes.position.array);
  }, [geometry]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame(() => {
    if (!ref || typeof ref === 'function' || !ref.current) return;
    
    const positions = geometry.attributes.position.array as Float32Array;
    const segments = (positions.length / 12) - 1;
    
    // Calculate deformation using beam theory
    const I = (width * Math.pow(height, 3)) / 12;
    const E = elasticModulus * 1e9;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * length - length/2;
      if (x > -length/2) {
        const xFromFixed = x + length/2;
        const deflection = -(force * Math.pow(xFromFixed, 2) * (3 * length - xFromFixed)) / (6 * E * I);
        const scaledDeflection = deflection * 1e3;
        
        const baseIndex = i * 12;
        for (let j = 0; j < 4; j++) {
          const yIndex = baseIndex + j * 3 + 1;
          const originalY = originalPositions[yIndex];
          positions[yIndex] = originalY + scaledDeflection;
        }
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial 
        color="#2563eb"
        metalness={0.6}
        roughness={0.4}
        opacity={1}
        transparent={false}
      />
    </mesh>
  );
});