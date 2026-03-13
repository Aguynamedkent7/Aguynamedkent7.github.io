'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import CarreraGT from './CarreraGT';

function CameraRig({ activeSection }: { activeSection: string }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const views: Record<string, { position: THREE.Vector3; lookAt: THREE.Vector3 }> = {
    home: { position: new THREE.Vector3(2.5, 0.8, 3.5), lookAt: new THREE.Vector3(0.5, 0.4, 0.5) },
    about: { position: new THREE.Vector3(-3.2, 0.9, 1.0), lookAt: new THREE.Vector3(-0.5, 0.5, 1.5) },
    projects: { position: new THREE.Vector3(-2.2, 0.3, -2.5), lookAt: new THREE.Vector3(-1.0, 0.4, 2.0) },
    contact: { position: new THREE.Vector3(1.5, 2.5, -2.0), lookAt: new THREE.Vector3(0, 0.5, 0) },
  };

  useFrame((state, delta) => {
    const target = views[activeSection] || views.home;
    const t = state.clock.getElapsedTime();

    // Subtle drift for "Most Wanted" atmosphere
    const driftX = Math.sin(t * 0.4) * 0.1;
    const driftY = Math.cos(t * 0.3) * 0.05;
    
    const driftingPosition = new THREE.Vector3().copy(target.position).add(new THREE.Vector3(driftX, driftY, 0));
    state.camera.position.lerp(driftingPosition, 3 * delta);
    
    currentLookAt.current.lerp(target.lookAt, 3 * delta);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

export default function Showroom({ activeSection }: { activeSection: string }) {
  return (
    <div className="absolute inset-0 z-0 bg-zinc-950">
      <Canvas 
        camera={{ position: [2.5, 0.8, 3.5], fov: 42 }}
        dpr={[1, 2]} // Performance: adjusts for high-res screens
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <CameraRig activeSection={activeSection} />
        <CarreraGT position={[0, -0.5, 0]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="white" />
        <Environment preset="city" environmentIntensity={0.6} />
        <ContactShadows resolution={512} scale={10} blur={3} opacity={0.6} far={10} color="#000000" />
      </Canvas>
    </div>
  );
}