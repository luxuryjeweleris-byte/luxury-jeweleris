'use client';

import React, { useEffect, useRef, useState } from 'react';

interface HeroJewelryViewerProps {
  videos: string[];
}

export const HeroJewelryViewer: React.FC<HeroJewelryViewerProps> = ({ videos }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);

  // Play active video when index changes
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    if (activeVideoIndex === 0) {
      if (v2) {
        v2.pause();
        v2.currentTime = 0;
      }
      if (v1) {
        v1.currentTime = 0;
        v1.play().catch(() => {});
      }
    } else {
      if (v1) {
        v1.pause();
        v1.currentTime = 0;
      }
      if (v2) {
        v2.currentTime = 0;
        v2.play().catch(() => {});
      }
    }
  }, [activeVideoIndex]);

  // Real-time Canvas Alpha Rendering
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const render = () => {
      const activeVideo = activeVideoIndex === 0 ? video1Ref.current : video2Ref.current;

      if (activeVideo && activeVideo.readyState >= 2 && !activeVideo.paused && !activeVideo.ended) {
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(activeVideo, 0, 0, w, h);

        try {
          const frame = ctx.getImageData(0, 0, w, h);
          const data = frame.data;
          const len = data.length;

          // Luma-key: Detect white / light background and make it 100% transparent
          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Background threshold for white / very light tones
            const minChannel = Math.min(r, g, b);
            const avg = (r + g + b) / 3;

            if (minChannel > 220 || avg > 225) {
              const base = Math.max(minChannel, avg);
              // Fade smoothly from 220 to 250
              const alphaFactor = Math.max(0, Math.min(1, (250 - base) / 30));
              data[i + 3] = Math.round(data[i + 3] * alphaFactor);
            }
          }

          ctx.putImageData(frame, 0, 0);
        } catch {
          // If security or drawing error occurs, fallback gracefully
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeVideoIndex]);

  const handleVideo1Ended = () => {
    setActiveVideoIndex(1);
  };

  const handleVideo2Ended = () => {
    setActiveVideoIndex(0);
  };

  return (
    <div
      className="hero-video-stack"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '340px',
        aspectRatio: '1 / 1',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Hidden Source Videos (Kept in DOM with opacity: 0.001 so iOS Safari decodes without pause) */}
      <video
        ref={video1Ref}
        src={videos[0]}
        playsInline
        autoPlay
        muted
        crossOrigin="anonymous"
        onEnded={handleVideo1Ended}
        suppressHydrationWarning
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <video
        ref={video2Ref}
        src={videos[1]}
        playsInline
        muted
        crossOrigin="anonymous"
        onEnded={handleVideo2Ended}
        suppressHydrationWarning
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* 100% Transparent Canvas Output (Supported natively on all iOS Safari, Android, and Desktop browsers) */}
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 14px 28px rgba(6, 29, 56, 0.08))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default HeroJewelryViewer;
