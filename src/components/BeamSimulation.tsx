import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Mesh } from 'three';
import { Beam } from './Beam';
import { ForceArrow } from './ForceArrow';
import { SimulationControls } from './SimulationControls';
import { QuizPanel } from './QuizPanel';
import { useSimulationState } from '../hooks/useSimulationState';

export function BeamSimulation() {
  const { force, setForce, elasticModulus, setElasticModulus } = useSimulationState();
  const beamRef = useRef<Mesh>(null);

  return (
    <div className="w-full h-screen relative">
      <QuizPanel 
        force={force}
        elasticModulus={elasticModulus}
        onForceChange={setForce}
        onElasticModulusChange={setElasticModulus}
      />
      
      <Canvas 
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true }}
        className="h-[calc(100vh-80px)]"
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#f8fafc']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.2} />
          
          <Beam ref={beamRef} force={force} elasticModulus={elasticModulus} />
          <ForceArrow position={[1.8, 0, 0]} force={force} />
          
          <mesh position={[-2, 0, 0]}>
            <boxGeometry args={[0.1, 1.2, 1.2]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          
          <Text
            position={[-2, 0.8, 0]}
            fontSize={0.15}
            color="#1e293b"
            anchorX="center"
            anchorY="bottom"
          >
            Fixed Support
          </Text>
          
          <Text
            position={[2, -0.5, 0]}
            fontSize={0.15}
            color="#1e293b"
            anchorX="center"
            anchorY="top"
          >
            {`${force.toFixed(0)} N`}
          </Text>
          
          <gridHelper args={[10, 10, '#e2e8f0', '#e2e8f0']} position={[0, -1, 0]} />
          <axesHelper args={[5]} position={[0, -1, 0]} />
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            maxDistance={10}
            minDistance={2}
          />
        </Suspense>
      </Canvas>

      <SimulationControls
        force={force}
        setForce={setForce}
        elasticModulus={elasticModulus}
        setElasticModulus={setElasticModulus}
      />
    </div>
  );
}