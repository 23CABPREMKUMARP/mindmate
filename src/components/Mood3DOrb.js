"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

const Orb = ({ mood }) => {
  const meshRef = useRef();
  
  const moodProps = useMemo(() => {
    switch(mood?.toLowerCase()) {
      case 'happy':
        return { color: '#fbbf24', speed: 4, distort: 0.6, radius: 1.2 };
      case 'sad':
        return { color: '#3b82f6', speed: 1, distort: 0.3, radius: 1.0 };
      case 'angry':
        return { color: '#ef4444', speed: 8, distort: 0.8, radius: 1.3 };
      case 'fear':
        return { color: '#a855f7', speed: 6, distort: 0.5, radius: 0.9 };
      case 'surprised':
        return { color: '#2dd4bf', speed: 5, distort: 0.7, radius: 1.4 };
      default:
        return { color: '#00f3ff', speed: 2, distort: 0.4, radius: 1.1 };
    }
  }, [mood]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * (moodProps.speed * 0.2);
      meshRef.current.rotation.y = state.clock.getElapsedTime() * (moodProps.speed * 0.1);
    }
  });

  return (
    <Float speed={moodProps.speed} rotationIntensity={moodProps.distort} floatIntensity={moodProps.distort}>
      <Sphere ref={meshRef} args={[moodProps.radius, 32, 32]}>
        <MeshDistortMaterial
          color={moodProps.color}
          speed={moodProps.speed}
          distort={moodProps.distort}
          radius={moodProps.radius}
          emissive={moodProps.color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

export default function Mood3DOrb({ mood }) {
  return (
    <div className="w-full h-full min-h-[250px] relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1]}> {/* Capped DPR for low-end */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f3ff" />
        <Orb mood={mood} />
      </Canvas>
      <div className="absolute inset-x-0 bottom-0 text-center pb-4 opacity-50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#00f3ff] animate-pulse">
            Neural Energy Visualization
        </p>
      </div>
    </div>
  );
}
