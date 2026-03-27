"use client";
import React, { useState, useCallback } from 'react';
import FaceAuthCamera from '@/components/FaceAuthCamera';
import Link from 'next/link';

export default function FaceLoginPage() {
  const [descriptor, setDescriptor] = useState(null);
  const [userName, setUserName] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [status, setStatus] = useState('');

  const handleDetected = useCallback((data) => {
    if (data?.descriptor) {
      setDescriptor(data.descriptor);
    }
  }, []);

  const handleRegister = async () => {
    if (!userName || !descriptor) return;
    setStatus('Registering...');
    try {
      const res = await fetch('/api/register-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, descriptor: Array.isArray(descriptor) ? descriptor : Array.from(descriptor) })
      });
      const json = await res.json();
      if (json.success) setStatus('Face Registered successfully!');
      else setStatus('Failed to register.');
    } catch (err) {
      setStatus('Registration Error');
    }
  };

  const handleLogin = async () => {
    if (!descriptor) return;
    setStatus('Authenticating...');
    try {
      const res = await fetch('/api/recognize-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor: Array.isArray(descriptor) ? descriptor : Array.from(descriptor) })
      });
      const json = await res.json();
      if (json.match) {
        setStatus(`Welcome back, ${json.match.name}! (Distance: ${json.match.distance.toFixed(2)})`);
      } else {
        setStatus(json.message || 'Face not recognized.');
      }
    } catch (err) {
      setStatus('Login Error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-center">
        Biometric Face Login
      </h1>
      
      <p className="text-gray-500 max-w-lg text-center">
        Ensure your face is lit and centered. We use Euclidean distance to securely verify your facial landmarks.
      </p>

      <div className="w-full max-w-[320px] aspect-square rounded-[32px] overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-inner bg-black">
        <FaceAuthCamera onDetected={handleDetected} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-700 space-y-6">
        {mode === 'login' ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleLogin}
              disabled={!descriptor}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition disabled:opacity-50"
            >
              Scan & Login
            </button>
            <p className="text-sm text-center text-gray-400">
              New here? <button onClick={() => setMode('register')} className="text-purple-500 font-bold underline">Register Face</button>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleRegister}
              disabled={!descriptor || !userName}
              className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition disabled:opacity-50"
            >
              Analyze & Save Face Data
            </button>
            <p className="text-sm text-center text-gray-400">
              Already saved? <button onClick={() => setMode('login')} className="text-pink-500 font-bold underline">Login Instead</button>
            </p>
          </div>
        )}

        {status && (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center font-medium animate-pulse">
            {status}
          </div>
        )}
      </div>

      <Link href="/emotion" className="text-gray-400 hover:text-white underline mt-8 mb-[100px]">
        Go to Emotion Tracker Instead
      </Link>
    </div>
  );
}
