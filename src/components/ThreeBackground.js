"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-30 overflow-hidden">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }} 
        dpr={1} 
        gl={{ 
            antialias: false, 
            powerPreference: 'high-performance',
            stencil: false,
            depth: false,
            alpha: true
        }}
      >
        <fog attach="fog" args={['#02000f', 5, 20]} />
        {/* Only Starfield remains for ambient depth without the GPU cost of heavy models */}
        <Stars radius={50} depth={20} count={200} factor={4} saturation={0} fade speed={0.8} />
        <ambientLight intensity={0.2} />
      </Canvas>
    </div>
  );
}
