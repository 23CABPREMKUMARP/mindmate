"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add small delay to ensure router is ready
    const timer = setTimeout(() => {
      const user = localStorage.getItem('mindmate_user');
      const isLoginPage = ['/login', '/register', '/face-login', '/register-face'].includes(pathname);

      if (!user && !isLoginPage) {
        router.push('/login');
      } else if (user && isLoginPage) {
        router.push('/');
      } else {
        setIsLoaded(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  if (!isLoaded && !['/login', '/register', '/face-login', '/register-face'].includes(pathname)) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-[#02000f] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#150030,transparent)]"></div>
            <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="w-16 h-16 border-2 border-[#00f3ff] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,243,255,0.4)]"></div>
                <div className="space-y-2 text-center">
                    <p className="text-xs font-black text-[#00f3ff] uppercase tracking-[0.3em] animate-pulse">Neural Synchronization</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Securing Biometric Session...</p>
                </div>
            </div>
        </div>
      );
  }

  return children;
}
