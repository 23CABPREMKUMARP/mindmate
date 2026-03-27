'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

export default function EmotionDetector({ onEmotionDetect }) {
  const videoRef = useRef(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/vladmandic/face-api/master/model/tiny_face_detector_model-weights_manifest.json'),
          faceapi.nets.faceExpressionNet.loadFromUri('https://raw.githubusercontent.com/vladmandic/face-api/master/model/face_expression_model-weights_manifest.json')
        ]);
        setIsModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
        setError("Could not load emotion models. Please check your network.");
      }
    };
    // Models are loaded dynamically from CDN for hackathon ease
    // Ideally hosted locally in /public/models
    loadModels();
  }, []);

  const startVideo = () => {
    if (!isModelsLoaded) return;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      })
      .catch((err) => {
        console.error("Camera access denied:", err);
        setError("Camera access is required for facial emotion detection.");
      });
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handlePlay = () => {
    setInterval(async () => {
      if (videoRef.current && isCameraActive) {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        if (detections.length > 0 && typeof onEmotionDetect === 'function') {
          const expressions = detections[0].expressions;
          const dominantEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
          onEmotionDetect(dominantEmotion);
        }
      }
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10 aspect-video flex items-center justify-center">
      {error ? (
        <div className="text-red-400 flex flex-col items-center gap-2 p-6 text-center">
          <AlertCircle className="w-8 h-8" />
          <p className="text-sm">{error}</p>
        </div>
      ) : isCameraActive ? (
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          onPlay={handlePlay}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-zinc-500 flex flex-col items-center gap-3">
          <CameraOff className="w-10 h-10" />
          <p className="text-sm">Camera inactive</p>
        </div>
      )}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button
          onClick={isCameraActive ? stopVideo : startVideo}
          disabled={!isModelsLoaded && !isCameraActive}
          className={`px-4 py-2 rounded-full font-medium transition-all ${isCameraActive ? 'bg-red-500/80 text-white hover:bg-red-600' : 'bg-white/20 text-white hover:bg-white/30'} backdrop-blur-md disabled:opacity-50`}
        >
          {isCameraActive ? 'Stop Tracking' : (isModelsLoaded ? 'Start Emotion Tracking' : 'Loading Models...')}
        </button>
      </div>
    </div>
  );
}
