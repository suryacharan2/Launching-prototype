import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import type { ScenePhase } from './Experience';
import IndianFlag from './IndianFlag';

// Utility to convert Lat/Lon to 3D Cartesian coordinates on a sphere
const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
};

interface AirplaneProps {
  phase: ScenePhase;
}

const Airplane: React.FC<AirplaneProps> = ({ phase }) => {
  const airplaneRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.Line>(null);

  // Constants
  const radius = 5.2; // Slightly above earth surface
  const origin = { lat: 15.9129, lon: 79.7400 }; // Andhra Pradesh
  const destination = { lat: -36.8485, lon: 174.7633 }; // Auckland

  // Create the curved flight path using a Quadratic Bezier Curve
  const { path, points } = useMemo(() => {
    const start = latLongToVector3(origin.lat, origin.lon, radius);
    const end = latLongToVector3(destination.lat, destination.lon, radius);
    
    // Control point for the curve (raised high above the earth for a parabolic flight path)
    const midPoint = start.clone().lerp(end, 0.5);
    const distance = start.distanceTo(end);
    midPoint.normalize().multiplyScalar(radius + distance * 0.3); // Raise altitude

    const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    const curvePoints = curve.getPoints(100);
    return { path: curve, points: curvePoints };
  }, [origin.lat, origin.lon, destination.lat, destination.lon]);

  // Animation Progress State
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    if (phase === 'FLIGHT') {
      // Animate progress from 0 to 1 over 7 seconds
      gsap.to(progressRef.current, {
        value: 1,
        duration: 7,
        ease: 'power1.inOut'
      });
    }
  }, [phase]);

  useFrame(() => {
    if ((phase === 'FLIGHT' || phase === 'ARRIVE_NZ') && airplaneRef.current) {
      // Get position on curve
      const progress = progressRef.current.value;
      const point = path.getPoint(progress);
      airplaneRef.current.position.copy(point);

      // Look at next point to orient correctly
      if (progress < 0.99) {
        const nextPoint = path.getPoint(progress + 0.01);
        airplaneRef.current.lookAt(nextPoint);
      }
      
      // Update line geometry to only draw up to the current progress
      if (lineRef.current) {
        const drawCount = Math.floor(progress * 100);
        lineRef.current.geometry.setDrawRange(0, drawCount);
      }
    }
  });

  return (
    <group>
      {/* Flight Path Trail */}
      <line ref={lineRef as any}>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#d4af37" transparent opacity={0.6} linewidth={2} />
      </line>

      {/* Airplane Mesh (Realistic Low-Poly Commercial Airliner) */}
      <group ref={airplaneRef} name="airplane-group">
        <group scale={0.015}>
          {/* Fuselage */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1, 1, 10, 32]} />
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
          </mesh>
          {/* Nose */}
          <mesh position={[0, 0, 5]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
          </mesh>
          {/* Tail Cone */}
          <mesh position={[0, 0, -5]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1, 3, 32]} />
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
          </mesh>
          
          {/* Main Wings (Swept back slightly) */}
          <mesh position={[0, 0, 0.5]} rotation={[0, 0, 0]}>
            <boxGeometry args={[14, 0.2, 3]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>
          
          {/* Vertical Stabilizer (Tail fin) */}
          <mesh position={[0, 1.5, -4.5]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.3, 3, 2.5]} />
            <meshStandardMaterial color="#d4af37" /> {/* Gold accent tail */}
          </mesh>

          {/* Indian Flag flying from the tail (Larger and trailing behind) */}
          <IndianFlag withPole={false} position={[0, 3.5, -4.5]} scale={3.0} rotation={[0, Math.PI / 2, 0]} />

          {/* Horizontal Stabilizer (Back wings) */}
          <mesh position={[0, 0.2, -5.5]} rotation={[0, 0, 0]}>
            <boxGeometry args={[5, 0.2, 1.5]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>

          {/* Jet Engines */}
          <mesh position={[-3, -0.7, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 2.5, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[3, -0.7, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 2.5, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      </group>

      {/* Location Markers */}
      <Marker position={latLongToVector3(origin.lat, origin.lon, 5.0)} />
      <Marker position={latLongToVector3(destination.lat, destination.lon, 5.0)} />
    </group>
  );
};

const Marker: React.FC<{ position: THREE.Vector3 }> = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#d4af37" />
      {/* Pulsing ring can be added here with GSAP */}
    </mesh>
  );
};

export default Airplane;
