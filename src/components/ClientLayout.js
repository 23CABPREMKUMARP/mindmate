"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AnimatedBackground from "@/components/AnimatedBackground";
import ThreeBackground from "@/components/ThreeBackground";
import '@/lib/i18n';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef(null);
  
  const isAuthPage = ['/login', '/register', '/face-login', '/register-face'].includes(pathname);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
        const hue = (e.clientX / window.innerWidth) * 360;
        cursorRef.current.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 50%, 0.8) 0%, transparent 70%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {mounted && pathname !== '/emotion' && pathname !== '/mood-booster' && (
        <>
          <ThreeBackground />
          <AnimatedBackground />
        </>
      )}
      <div ref={cursorRef} className="cursor-follower" />
      
      {!isAuthPage && <Sidebar />}

      <div className={`flex-1 w-full relative z-10 transition-all duration-300 ${!isAuthPage ? 'md:ml-60' : ''}`}>
        {children}
      </div>
    </>
  );
}
