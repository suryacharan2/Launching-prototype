import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import Earth from './Earth';
import Airplane from './Airplane';
import NZOutline from './NZOutline';
import IndiaOutline from './IndiaOutline';
import type { ScenePhase } from './Experience';
import gsap from 'gsap';
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

const FlagMarker: React.FC<{ position: THREE.Vector3 }> = ({ position }) => {
  const ref = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.lookAt(0, 0, 0); // Point Z towards origin
      ref.current.rotateX(-Math.PI / 2); // Make the flag's Y axis point outwards
    }
  }, [position]);
  
  return (
    <group ref={ref} position={position}>
      {/* Lift up slightly so the base of the pole touches the surface */}
      <IndianFlag scale={0.08} position={[0, 0.12, 0]} rotation={[0, 0, 0]} withPole={true} />
    </group>
  );
};

const SunLight: React.FC<{ phase: ScenePhase }> = ({ phase }) => {
  const sunGroupRef = useRef<THREE.Group>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  
  useEffect(() => {
    if (!sunGroupRef.current || !ambientLightRef.current || !dirLightRef.current) return;
    
    if (phase === 'PRE_LAUNCH') {
        sunGroupRef.current.rotation.y = 0;
        ambientLightRef.current.intensity = 0.1;
        dirLightRef.current.intensity = 1.0;
        dirLightRef.current.color.set('#3a5a80'); // Moon/Night light
    } else if (phase === 'FLIGHT') {
       // Animate sun rotation to simulate time passing
       gsap.to(sunGroupRef.current.rotation, {
          y: Math.PI * 0.9,
          duration: 7, 
          ease: 'power1.inOut'
       });
       // Animate ambient brightness (morning glow)
       gsap.to(ambientLightRef.current, {
          intensity: 0.7,
          duration: 7,
          ease: 'power1.inOut'
       });
       // Animate directional light intensity
       gsap.to(dirLightRef.current, {
          intensity: 5.0,
          duration: 7,
          ease: 'power1.inOut'
       });
       // Animate color transition from night blue to warm sunrise gold
       const colorProxy = { r: 58/255, g: 90/255, b: 128/255 }; // #3a5a80
       gsap.to(colorProxy, {
          r: 255/255, g: 215/255, b: 160/255, // #ffd7a0
          duration: 7,
          ease: 'power1.inOut',
          onUpdate: () => {
             dirLightRef.current?.color.setRGB(colorProxy.r, colorProxy.g, colorProxy.b);
          }
       });
    }
  }, [phase]);
  
  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.1} />
      <group ref={sunGroupRef}>
        <directionalLight ref={dirLightRef} position={[-10, 1, 3]} intensity={1.0} color="#3a5a80" />
      </group>
    </>
  );
};

interface SceneProps {
  phase: ScenePhase;
}

const CameraManager: React.FC<{ phase: ScenePhase }> = ({ phase }) => {
  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    if (!cameraControlsRef.current) return;
    const controls = cameraControlsRef.current;
    const camera = controls.camera as THREE.PerspectiveCamera;

    switch (phase) {
      case 'PRE_LAUNCH':
        controls.setLookAt(0, 0, 18, 0, 0, 0, true);
        break;
      case 'ZOOM_INDIA':
        gsap.to(camera.position, {
          x: 1.5, y: 1.5, z: 6,
          duration: 3,
          ease: 'power3.inOut'
        });
        break;
      case 'FLIGHT':
        // Handled dynamically in useFrame below
        break;
      case 'ARRIVE_NZ':
      case 'DRAW_MAP':
        gsap.to(camera.position, {
          x: -2.5, y: -3.5, z: -3.5,
          duration: 2,
          ease: 'power2.inOut'
        });
        break;
      case 'ZOOM_NZ_DEEP':
        // Calculate destination coordinates in world space
        const dest = latLongToVector3(-36.8485, 174.7633, 5.0);
        // The Earth group is rotated by -Math.PI / 2 on Y axis
        const rotatedDest = dest.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
        
        // Offset the target position tangentially so we fly *past* the side of the flag, 
        // rather than straight down its pole.
        const targetPos = rotatedDest.clone().normalize().multiplyScalar(4.5);
        targetPos.z += 1.2; // Offset to swoop in from the side
        targetPos.x += 0.8; 
        
        // Extreme dive into the country
        gsap.to(camera.position, {
          x: targetPos.x, y: targetPos.y, z: targetPos.z,
          duration: 3,
          ease: 'power3.in'
        });
        // FOV warp effect for immersive transition
        gsap.to(camera, {
          fov: 15,
          duration: 3,
          ease: 'power3.in',
          onUpdate: () => camera.updateProjectionMatrix()
        });
        break;
    }
  }, [phase]);

  // Dynamic Camera Tracking during FLIGHT
  useFrame((state) => {
    if (phase === 'FLIGHT' && cameraControlsRef.current) {
      const plane = state.scene.getObjectByName('airplane-group');
      if (plane) {
        const pos = new THREE.Vector3();
        plane.getWorldPosition(pos);
        
        const targetX = pos.x;
        const targetY = pos.y;
        const targetZ = pos.z;

        const camPos = pos.clone().normalize().multiplyScalar(8); 
        camPos.y += 1;
        camPos.x += 1;

        cameraControlsRef.current.setLookAt(
          camPos.x, camPos.y, camPos.z,
          targetX, targetY, targetZ,
          true 
        );
      }
    }
  });

  return <CameraControls ref={cameraControlsRef} makeDefault minDistance={2} maxDistance={30} mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 8 }} />;
};

const Scene: React.FC<SceneProps> = ({ phase }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 45 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <color attach="background" args={['#030a16']} />
      
      {/* SunLight component now handles ambient and directional lighting transitions */}
      <SunLight phase={phase} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <CameraManager phase={phase} />

      <group rotation={[0, -Math.PI / 2, 0]}>
        <React.Suspense fallback={null}>
          <Earth phase={phase} />
          
          {/* India Outline at start */}
          <IndiaOutline phase={phase} />
          
          {/* Indian flag placed at NZ destination (appears only after plane disappears/lands) */}
          {(phase === 'DRAW_MAP' || phase === 'ZOOM_NZ_DEEP' || phase === 'COMPLETE') && (
            <FlagMarker position={latLongToVector3(-36.8485, 174.7633, 5.0)} />
          )}
          
          {/* Airplane disappears when drawing starts */}
          {(phase === 'FLIGHT' || phase === 'ARRIVE_NZ') && <Airplane phase={phase} />}
          {(phase === 'DRAW_MAP' || phase === 'ZOOM_NZ_DEEP' || phase === 'COMPLETE') && <NZOutline phase={phase} />}
        </React.Suspense>
      </group>
      
    </Canvas>
  );
};

export default Scene;
