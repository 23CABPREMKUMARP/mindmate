"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

/**
 * FaceAuthCamera — dedicated webcam component for login/register.
 * 
 * Unlike WebcamEmotion (which only does expression detection), this loads 
 * all 4 nets needed for face recognition and emits a stable 128-dim descriptor
 * via onDetected({ descriptor, faceLocked }).
 * 
 * Dynamic import is used to avoid TensorFlow.js SSR crash (TextEncoder issue).
 */
export default function FaceAuthCamera({ onDetected }) {
  const webcamRef       = useRef(null);
  const offscreenCanvas = useRef(null);
  const intervalRef     = useRef(null);
  const faceapiRef      = useRef(null);
  const descriptorBuf   = useRef([]); // rolling buffer to average descriptors
  const SAMPLES_NEEDED  = 4;          // average over 4 frames for stability

  const [status,        setStatus]        = useState('loading'); // loading | scanning | locked | error
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // ── Load all 4 nets needed for full face recognition ─────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const faceapi  = await import('@vladmandic/face-api');
        faceapiRef.current = faceapi;

        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        if (!cancelled) {
          setIsModelLoaded(true);
          setStatus('scanning');
        }
      } catch (err) {
        console.error('FaceAuthCamera model load error:', err);
        if (!cancelled) setStatus('error');
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Detection loop — snapshot → canvas → face-api ────────────────────────
  const runDetection = useCallback(async () => {
    const faceapi = faceapiRef.current;
    const video   = webcamRef.current?.video;

    if (!faceapi || !video) return;
    if (
      video.readyState !== 4 ||
      !Number.isFinite(video.videoWidth)  || video.videoWidth  <= 0 ||
      !Number.isFinite(video.videoHeight) || video.videoHeight <= 0
    ) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // Snapshot to stable offscreen canvas — prevents null dim crashes in face-api
    let canvas = offscreenCanvas.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      offscreenCanvas.current = canvas;
    }
    if (canvas.width !== vw || canvas.height !== vh) {
      canvas.width  = vw;
      canvas.height = vh;
    }
    canvas.getContext('2d', { willReadFrequently: true }).drawImage(video, 0, 0, vw, vh);

    let detection = null;
    try {
      const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
      detection  = await faceapi
        .detectSingleFace(canvas, opts)
        .withFaceLandmarks()
        .withFaceDescriptor();
    } catch (_) {
      return;
    }

    if (!detection?.descriptor) return;

    // Accumulate descriptor samples
    descriptorBuf.current.push(Array.from(detection.descriptor));
    if (descriptorBuf.current.length > SAMPLES_NEEDED) descriptorBuf.current.shift();

    // Only emit once we have enough stable samples
    if (descriptorBuf.current.length >= SAMPLES_NEEDED) {
      const len = descriptorBuf.current[0].length;
      const avg = new Array(len).fill(0).map((_, i) =>
        descriptorBuf.current.reduce((s, d) => s + d[i], 0) / descriptorBuf.current.length
      );

      setStatus('locked');
      if (onDetected) {
        onDetected({ descriptor: avg, faceLocked: true });
      }
    }
  }, [onDetected]);

  // Start / stop interval
  useEffect(() => {
    if (isModelLoaded) {
      intervalRef.current = setInterval(runDetection, 500); // 2fps is enough for auth
    }
    return () => clearInterval(intervalRef.current);
  }, [isModelLoaded, runDetection]);

  const statusLabel = {
    loading:  '⟳ Loading AI Models...',
    scanning: '⬤ Scanning face...',
    locked:   '✓ Face Locked & Verified',
    error:    '✗ Model load failed',
  }[status];

  const statusColor = {
    loading:  'bg-black/60 text-gray-300',
    scanning: 'bg-blue-500 text-white',
    locked:   'bg-green-500 text-white shadow-lg',
    error:    'bg-red-500 text-white',
  }[status];

  return (
    <div className="relative w-full h-full">
      <Webcam
        ref={webcamRef}
        muted
        videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
        className="w-full h-full object-cover"
      />

      {/* Scan line animation */}
      {status === 'scanning' && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_15px_blue] animate-[scan_3s_ease-in-out_infinite] opacity-60 pointer-events-none" />
      )}

      {/* Status badge */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${statusColor}`}>
        {statusLabel}
      </div>

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading face recognition...</p>
        </div>
      )}
    </div>
  );
}
