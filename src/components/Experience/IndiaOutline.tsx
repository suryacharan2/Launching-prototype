import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
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

interface IndiaOutlineProps {
  phase: ScenePhase;
}

const IndiaOutline: React.FC<IndiaOutlineProps> = ({ phase }) => {
  const lineRef = useRef<THREE.Line>(null);
  const radius = 5.01; // Slightly above earth surface

  const indiaCoords = [
    { lat: 35.0, lon: 77.0 }, // Kashmir North
    { lat: 32.0, lon: 78.5 }, // Himachal
    { lat: 30.0, lon: 81.0 }, // Uttarakhand
    { lat: 27.5, lon: 88.0 }, // Sikkim
    { lat: 28.0, lon: 96.0 }, // Arunachal
    { lat: 24.0, lon: 94.0 }, // Manipur
    { lat: 22.0, lon: 89.0 }, // West Bengal
    { lat: 19.0, lon: 85.0 }, // Odisha
    { lat: 15.0, lon: 80.0 }, // Andhra Pradesh
    { lat: 13.0, lon: 80.2 }, // Chennai
    { lat: 8.0,  lon: 77.5 }, // Kanyakumari
    { lat: 10.0, lon: 76.0 }, // Kerala
    { lat: 15.0, lon: 74.0 }, // Goa
    { lat: 19.0, lon: 72.8 }, // Mumbai
    { lat: 22.0, lon: 69.0 }, // Gujarat West
    { lat: 24.0, lon: 68.5 }, // Kutch
    { lat: 28.0, lon: 70.0 }, // Rajasthan
    { lat: 31.0, lon: 74.0 }, // Punjab
    { lat: 35.0, lon: 77.0 }, // Back to Kashmir
  ];

  const { positions, colors } = useMemo(() => {
    const vecs = indiaCoords.map(c => latLongToVector3(c.lat, c.lon, radius));
    const curve = new THREE.CatmullRomCurve3(vecs, true, 'catmullrom', 0.5);
    const points = curve.getPoints(200); // Higher resolution for smooth color gradient

    const positionsArray = new Float32Array(points.length * 3);
    const colorsArray = new Float32Array(points.length * 3);

    const colorSaffron = new THREE.Color('#FF9933');
    const colorWhite = new THREE.Color('#FFFFFF');
    const colorGreen = new THREE.Color('#138808');

    points.forEach((p, i) => {
      positionsArray[i * 3] = p.x;
      positionsArray[i * 3 + 1] = p.y;
      positionsArray[i * 3 + 2] = p.z;

      // Y coordinate ranges from ~0.69 (South) to ~2.87 (North)
      let c = new THREE.Color();
      if (p.y > 2.2) {
        c.copy(colorSaffron);
      } else if (p.y > 1.6) {
        const alpha = (p.y - 1.6) / 0.6; // 0 to 1
        c.copy(colorWhite).lerp(colorSaffron, alpha);
      } else if (p.y > 1.0) {
        const alpha = (p.y - 1.0) / 0.6; // 0 to 1
        c.copy(colorGreen).lerp(colorWhite, alpha);
      } else {
        c.copy(colorGreen);
      }

      colorsArray[i * 3] = c.r;
      colorsArray[i * 3 + 1] = c.g;
      colorsArray[i * 3 + 2] = c.b;
    });

    return { positions: positionsArray, colors: colorsArray };
  }, []);

  // India outline should be fully visible at the start and fade/disappear later
  const isVisible = phase === 'PRE_LAUNCH' || phase === 'ZOOM_INDIA' || phase === 'FLIGHT';

  useFrame(() => {
    if (lineRef.current) {
      // Just toggle visibility for simplicity since it doesn't need to "draw" like the NZ map
      lineRef.current.visible = isVisible;
    }
  });

  return (
    <group>
      <line ref={lineRef as any}>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" args={[positions, 3]} />
          <float32BufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        {/* lineBasicMaterial supports vertexColors natively */}
        <lineBasicMaterial vertexColors={true} linewidth={4} transparent opacity={0.9} />
      </line>
    </group>
  );
};

export default IndiaOutline;
