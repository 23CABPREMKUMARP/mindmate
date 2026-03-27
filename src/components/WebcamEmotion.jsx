"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

// ⚠️  Do NOT statically import @vladmandic/face-api at the top level.
// TensorFlow.js (bundled inside face-api) calls `new TextEncoder()` during
// module evaluation, which crashes in the Next.js SSR / Node.js context even
// when the component is marked "use client". Dynamic import ensures the
// library is only evaluated inside the browser.

export default function WebcamEmotion({ onEmotionDetected }) {
  const webcamRef       = useRef(null);
  const offscreenCanvas = useRef(null);
  const intervalRef     = useRef(null);
  const emotionHistory  = useRef([]);
  const faceapiRef      = useRef(null); // holds the dynamically-loaded module
  const HISTORY_LENGTH  = 5;

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [emotion,       setEmotion]       = useState(null);
  const [isDetecting,   setIsDetecting]   = useState(true);
  const [faceBox,       setFaceBox]       = useState(null);
  const [faceLocked,    setFaceLocked]    = useState(false);

  // ── Dynamically load face-api + models (browser only) ───────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Dynamic import keeps TF.js out of the SSR bundle entirely
        const faceapi = await import('@vladmandic/face-api');
        faceapiRef.current = faceapi;

        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        if (!cancelled) setIsModelLoaded(true);
      } catch (err) {
        console.error('face-api load error:', err);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Detection — runs on a stable interval (not rAF) ─────────────────────
  const runDetection = useCallback(async () => {
    const faceapi = faceapiRef.current;
    const video   = webcamRef.current?.video;

    if (!faceapi || !video) return;

    // Strict dimension guard — rejects null, NaN, 0, Infinity
    if (
      video.readyState !== 4 ||
      !Number.isFinite(video.videoWidth)  || video.videoWidth  <= 0 ||
      !Number.isFinite(video.videoHeight) || video.videoHeight <= 0
    ) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // ── Snapshot to an offscreen canvas ────────────────────────────────────
    // Canvas dimensions are frozen integers; face-api can NEVER see null/NaN
    // width/height mid-inference (the root cause of Box / Dimensions crashes).
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

    // ── Single-pass inference on the frozen canvas ─────────────────────────
    let detection = null;
    try {
      const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
      detection  = await faceapi.detectSingleFace(canvas, opts).withFaceExpressions();
    } catch (_) {
      return; // swallow any remaining internal library errors
    }

    if (!detection) {
      if (emotionHistory.current.length > 0) emotionHistory.current.shift();
      if (emotionHistory.current.length === 0) {
        setEmotion(null);
        setFaceBox(null);
        setFaceLocked(false);
      }
      return;
    }

    // ── Bounding box ────────────────────────────────────────────────────────
    const b = detection.detection?.box;
    if (
      b &&
      Number.isFinite(b.x)      &&
      Number.isFinite(b.y)      &&
      Number.isFinite(b.width)  && b.width  > 0 &&
      Number.isFinite(b.height) && b.height > 0
    ) {
      setFaceBox({
        left:   `${(b.x      / vw) * 100}%`,
        top:    `${(b.y      / vh) * 100}%`,
        width:  `${(b.width  / vw) * 100}%`,
        height: `${(b.height / vh) * 100}%`,
      });
      setFaceLocked(true);
    }

    // ── Smoothed emotion ────────────────────────────────────────────────────
    if (detection.expressions) {
      emotionHistory.current.push(detection.expressions);
      if (emotionHistory.current.length > HISTORY_LENGTH) emotionHistory.current.shift();

      const keys = Object.keys(detection.expressions);
      const avg  = {};
      keys.forEach(k => {
        avg[k] = emotionHistory.current.reduce((s, e) => s + (e[k] || 0), 0)
                 / emotionHistory.current.length;
      });

      const dominant = keys.reduce((a, b) => avg[a] > avg[b] ? a : b);
      const score    = Math.round(avg[dominant] * 100);

      if (score > 30) {
        setEmotion({ type: dominant, score });
        if (onEmotionDetected) onEmotionDetected({ type: dominant, score });
      }
    }
  }, [onEmotionDetected]);

  // Start / stop the 300 ms detection interval
  useEffect(() => {
    if (isDetecting && isModelLoaded) {
      intervalRef.current = setInterval(runDetection, 300);
    }
    return () => clearInterval(intervalRef.current);
  }, [isDetecting, isModelLoaded, runDetection]);

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border-4 border-gray-800">
        <Webcam
          ref={webcamRef}
          muted={true}
          videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
          className="w-full aspect-video object-cover"
        />

        {faceBox && (
          <div
            className="absolute border-2 border-blue-400 rounded-sm pointer-events-none shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-all duration-100"
            style={{ position: 'absolute', ...faceBox }}
          />
        )}

        {!isModelLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white flex-col backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-[#00f3ff] border-t-transparent rounded-full animate-spin mb-6" />
            <p className="font-black uppercase tracking-[0.2em] text-[#00f3ff]">Initializing Neural Link...</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center">
        {emotion ? (
          <div className="glass-panel p-6 rounded-3xl shadow-xl text-center border border-white/10 w-full max-w-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#00f3ff] mb-4">Telemetry Stable</h3>
            <div className="text-4xl capitalize font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {emotion.type}
            </div>
            <div className="w-full bg-black/50 h-3 rounded-full mt-6 overflow-hidden border border-white/5 shadow-inner">
              <div
                className="bg-[#00f3ff] h-full transition-all duration-300 shadow-[0_0_10px_#00f3ff]"
                style={{ width: `${emotion.score}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-gray-500">{emotion.score}% Confidence</p>
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-3xl shadow-xl text-center border border-white/10 w-full max-w-sm">
            <h3 className="text-2xl font-black mb-2 text-white italic uppercase tracking-tighter">Analysing<span className="text-[#00f3ff]">...</span></h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00f3ff] animate-pulse">Scanning Bio-Signatures</p>
          </div>
        )}

        <button
          onClick={() => {
            emotionHistory.current = [];
            setEmotion(null);
            setIsDetecting(prev => !prev);
          }}
          className={`mt-4 px-6 py-3 rounded-xl font-bold text-white transition-all ${
            isDetecting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isDetecting ? 'Pause Camera' : 'Resume Tracking'}
        </button>
      </div>
    </div>
  );
}
