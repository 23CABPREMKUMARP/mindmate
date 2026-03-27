"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Torus, Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Suppress THREE.Clock deprecation warnings from internal fiber/drei dependencies
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) return;
    originalWarn(...args);
  };
}

const NeuralCore = () => {
  return (
    <group scale={[0.85, 1, 1.25]}>
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.6}>
        {/* Left Hemisphere - Optimized cortex folds with reduced segments */}
        <mesh position={[-0.55, 0, 0]} rotation={[0, 0.1, 0]}>
          <torusKnotGeometry args={[0.7, 0.28, 64, 12]} />
          <MeshDistortMaterial 
            color="#bc13fe" 
            emissive="#ff0055" 
            emissiveIntensity={0.2}
            distort={0.2} 
            speed={3} 
            roughness={0.2} 
            metalness={0.8} 
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Right Hemisphere */}
        <mesh position={[0.55, 0, 0]} rotation={[0, -0.1, 0]}>
          <torusKnotGeometry args={[0.7, 0.28, 64, 12]} />
          <MeshDistortMaterial 
            color="#bc13fe" 
            emissive="#ff0055" 
            emissiveIntensity={0.2}
            distort={0.2} 
            speed={3} 
            roughness={0.2} 
            metalness={0.8} 
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
};

const FloatingObjects = () => {
  const torusRef = useRef();
  const brainRef = useRef();
  const timer = useMemo(() => new THREE.Timer(), []);
  
  useFrame((state) => {
    timer.update();
    const time = timer.getElapsed();
    
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.05;
      torusRef.current.rotation.y = time * 0.1;
    }
    if (brainRef.current) {
      brainRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 5]} intensity={1.5} color="#00f3ff" />
      <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={2.5} color="#bc13fe" />

      <group ref={brainRef} position={[3, 0, -5]}>
        <NeuralCore />
        <Torus ref={torusRef} args={[2.8, 0.015, 6, 32]}>
          <meshBasicMaterial color="#00f3ff" wireframe opacity={0.3} transparent />
        </Torus>
      </group>

      <Stars radius={100} depth={50} count={200} factor={2} saturation={0} fade speed={1.2} />
    </>
  );
};

const Rig = () => {
    const { camera, mouse } = useThree();
    useFrame(() => {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2.5, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 2.5, 0.05);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 60 }} 
        dpr={1} // Hard cap DPR at 1.0 for massive mobile/low-end gains
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#02000f', 5, 25]} />
        <FloatingObjects />
        <Rig />
      </Canvas>
    </div>
  );
}
