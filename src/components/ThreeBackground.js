"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const NeuralCore = () => {
  return (
    <group scale={[0.85, 1, 1.25]}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
        {/* Extreme Segment Reduction for Low-End Gains */}
        <mesh position={[-0.55, 0, 0]} rotation={[0, 0.1, 0]}>
          <torusKnotGeometry args={[0.7, 0.28, 32, 6]} />
          <meshStandardMaterial 
            color="#bc13fe" 
            emissive="#ff0055" 
            emissiveIntensity={0.1}
            roughness={0.4} 
            metalness={0.6} 
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh position={[0.55, 0, 0]} rotation={[0, -0.1, 0]}>
          <torusKnotGeometry args={[0.7, 0.28, 32, 6]} />
          <meshStandardMaterial 
            color="#bc13fe" 
            emissive="#ff0055" 
            emissiveIntensity={0.1}
            roughness={0.4} 
            metalness={0.6} 
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
    </group>
  );
};

const FloatingObjects = () => {
  const brainRef = useRef();
  const timer = useMemo(() => new THREE.Timer(), []);
  
  useFrame((state) => {
    timer.update();
    const time = timer.getElapsed();
    if (brainRef.current) {
      brainRef.current.position.y = Math.sin(time * 0.3) * 0.1;
      brainRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#00f3ff" />
      <group ref={brainRef} position={[2, -1, -5]}>
        <NeuralCore />
      </group>
      {/* Optimized starfield */}
      <Stars radius={50} depth={20} count={100} factor={4} saturation={0} fade speed={0.5} />
    </>
  );
};

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }} 
        dpr={1} 
        gl={{ 
            antialias: false, 
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            alpha: true
        }}
      >
        <fog attach="fog" args={['#02000f', 5, 20]} />
        <FloatingObjects />
      </Canvas>
    </div>
  );
}
