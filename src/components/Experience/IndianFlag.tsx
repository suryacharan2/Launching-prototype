import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const IndianFlag: React.FC<any> = ({ withPole = true, ...props }) => {
  const flagRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (flagRef.current) {
      // Simulate wind flutter by rotating the hinged group
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 6) * 0.15;
      flagRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.05;
    }
  });

  return (
    <group {...props}>
      {/* Flag Pole */}
      {withPole && (
        <mesh position={[-0.8, -1.5, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 4, 16]} />
          <meshStandardMaterial color="#A9A9A9" metalness={0.8} roughness={0.2} />
        </mesh>
      )}

      {/* Flag Cloth (Animated) */}
      <group ref={flagRef} position={[-0.75, 0, 0]}> 
        <group position={[0.75, 0, 0]}> {/* Offset back so it hinges on the pole */}
          {/* Saffron band */}
          <mesh position={[0, 0.33, 0]}>
            <boxGeometry args={[1.5, 0.33, 0.02]} />
            <meshStandardMaterial color="#FF9933" />
          </mesh>
          
          {/* White band */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.33, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          
          {/* Green band */}
          <mesh position={[0, -0.33, 0]}>
            <boxGeometry args={[1.5, 0.33, 0.02]} />
            <meshStandardMaterial color="#138808" />
          </mesh>

          {/* Ashoka Chakra (Blue circle) */}
          <mesh position={[0, 0, 0.011]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
            <meshStandardMaterial color="#000080" />
          </mesh>
          <mesh position={[0, 0, -0.011]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
            <meshStandardMaterial color="#000080" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default IndianFlag;
