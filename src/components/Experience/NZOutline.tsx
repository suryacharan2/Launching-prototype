import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import type { ScenePhase } from './Experience';

// Utility to convert Lat/Lon to 3D Cartesian coordinates on a sphere
const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
};

interface NZOutlineProps {
  phase: ScenePhase;
}

const NZOutline: React.FC<NZOutlineProps> = ({ phase }) => {
  const lineRef1 = useRef<THREE.Line>(null);
  const lineRef2 = useRef<THREE.Line>(null);
  
  const radius = 5.01; // Just slightly above the earth surface to avoid z-fighting

  // Detailed coordinates for North Island
  const northIslandCoords = [
    { lat: -34.4, lon: 173.0 }, // Cape Reinga
    { lat: -35.7, lon: 174.3 }, // Whangarei
    { lat: -36.8, lon: 174.7 }, // Auckland
    { lat: -36.5, lon: 175.5 }, // Coromandel
    { lat: -37.7, lon: 176.2 }, // Tauranga
    { lat: -37.6, lon: 178.5 }, // East Cape
    { lat: -38.6, lon: 178.0 }, // Gisborne
    { lat: -39.5, lon: 176.9 }, // Napier
    { lat: -41.3, lon: 174.8 }, // Wellington
    { lat: -39.0, lon: 174.0 }, // Taranaki
    { lat: -34.4, lon: 173.0 }, // Back to start
  ];

  // Detailed coordinates for South Island
  const southIslandCoords = [
    { lat: -41.3, lon: 174.1 }, // Picton
    { lat: -42.4, lon: 173.7 }, // Kaikoura
    { lat: -43.5, lon: 172.6 }, // Christchurch
    { lat: -45.9, lon: 170.5 }, // Dunedin
    { lat: -46.6, lon: 168.3 }, // Bluff
    { lat: -46.0, lon: 166.5 }, // Fiordland
    { lat: -44.6, lon: 167.9 }, // Milford Sound
    { lat: -42.4, lon: 171.2 }, // Greymouth
    { lat: -40.5, lon: 172.7 }, // Farewell Spit
    { lat: -41.3, lon: 174.1 }, // Back to start
  ];

  const { points1, points2 } = useMemo(() => {
    // Generate CatmullRom curves for smoother outlines
    const getPoints = (coords: {lat: number, lon: number}[]) => {
      const vecs = coords.map(c => latLongToVector3(c.lat, c.lon, radius));
      const curve = new THREE.CatmullRomCurve3(vecs, true);
      return curve.getPoints(100);
    };
    return {
      points1: getPoints(northIslandCoords),
      points2: getPoints(southIslandCoords)
    };
  }, []);

  // Animation Progress State
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    if (phase === 'DRAW_MAP') {
      // Animate progress from 0 to 1 over exactly 8 seconds (to match timeline map perfectly)
      gsap.to(progressRef.current, {
        value: 1,
        duration: 8,
        ease: 'power2.inOut'
      });
    } else if (phase === 'ZOOM_NZ_DEEP' || phase === 'COMPLETE') {
        progressRef.current.value = 1;
    } else {
        progressRef.current.value = 0;
    }
  }, [phase]);

  useFrame(() => {
    if (phase === 'DRAW_MAP' || phase === 'ZOOM_NZ_DEEP' || phase === 'COMPLETE') {
      const progress = progressRef.current.value;
      const drawCount = Math.floor(progress * 100);
      
      if (lineRef1.current) {
        lineRef1.current.geometry.setDrawRange(0, drawCount);
      }
      if (lineRef2.current) {
        // Delay the south island drawing slightly, or draw concurrently
        lineRef2.current.geometry.setDrawRange(0, drawCount);
      }
    }
  });

  return (
    <group>
      <line ref={lineRef1 as any}>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(points1.flatMap(p => [p.x, p.y, p.z])), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#d4af37" linewidth={3} transparent opacity={0.8} />
      </line>
      <line ref={lineRef2 as any}>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array(points2.flatMap(p => [p.x, p.y, p.z])), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#d4af37" linewidth={3} transparent opacity={0.8} />
      </line>
    </group>
  );
};

export default NZOutline;
