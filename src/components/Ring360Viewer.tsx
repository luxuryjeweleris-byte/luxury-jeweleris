'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Sparkles, Layers, Sliders, Code } from 'lucide-react';
import './components.css';

export interface RareCarat360Config {
  retailerId?: number;
  itemId?: string;
  rotationDirection?: 'clockwise' | 'counterclockwise';
  shapes?: {
    [shapeKey: string]: {
      version?: string;
      frameCount?: number;
      sizes?: number[];
      baseUrl: string;
    };
  };
  formats?: {
    [formatKey: string]: {
      pattern: string;
    };
  };
  generatedAt?: string;
}

interface Ring360ViewerProps {
  config360?: RareCarat360Config | string | null;
  images360?: string[];
  url360?: string;
  autoplay?: boolean;
  interactive?: boolean;
  metalColor?: 'gold' | 'platinum' | 'rose' | 'silver';
  caratSize?: number;
  width?: number;
  height?: number;
  showControls?: boolean;
  showJsonTester?: boolean;
  cardSizePreset?: 'sm' | 'md' | 'lg' | 'xl';
  onCardSizeChange?: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
}

export const Ring360Viewer: React.FC<Ring360ViewerProps> = ({
  config360,
  images360 = [],
  url360 = '',
  autoplay = true,
  interactive = true,
  metalColor = 'gold',
  caratSize = 1.0,
  width = 450,
  height = 450,
  showControls = true,
  showJsonTester = true,
  cardSizePreset = 'md',
  onCardSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Raw JSON state when tested live
  const [activeConfig, setActiveConfig] = useState<RareCarat360Config | null>(() => {
    if (!config360) return null;
    if (typeof config360 === 'string') {
      try {
        return JSON.parse(config360);
      } catch (e) {
        console.error('Failed to parse config360 JSON string', e);
        return null;
      }
    }
    return config360;
  });

  useEffect(() => {
    if (config360) {
      if (typeof config360 === 'string') {
        try {
          setActiveConfig(JSON.parse(config360));
        } catch (e) {
          console.error('Failed to parse config360', e);
        }
      } else {
        setActiveConfig(config360);
      }
    }
  }, [config360]);

  // Selected Resolution
  const [selectedSize, setSelectedSize] = useState<number>(1000);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [inputJsonText, setInputJsonText] = useState<string>('');

  useEffect(() => {
    if (autoplay) {
      setIsPlaying(true);
    }
  }, [autoplay]);

  // Drag interaction refs
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startFrame = useRef<number>(0);
  const velocity = useRef<number>(0);
  const lastX = useRef<number>(0);
  const lastTime = useRef<number>(0);

  // Extract frame URLs from active JSON config
  const { generatedFrames, totalFrames } = useMemo(() => {
    if (activeConfig && activeConfig.shapes?.default) {
      const shape = activeConfig.shapes.default;
      const baseUrl = shape.baseUrl;
      const count = shape.frameCount || 256;
      const formatPattern =
        activeConfig.formats?.jpeg?.pattern ||
        activeConfig.formats?.webp?.pattern ||
        'jpeg/{size}/frame_{frame}.jpg';

      const frames: string[] = [];
      for (let i = 1; i <= count; i++) {
        const frameStr = String(i).padStart(3, '0');
        const path = formatPattern
          .replace('{size}', String(selectedSize))
          .replace('{frame}', frameStr);
        frames.push(`${baseUrl}${path}`);
      }

      return { generatedFrames: frames, totalFrames: count };
    }

    if (images360 && images360.length > 0) {
      return { generatedFrames: images360, totalFrames: images360.length };
    }

    return { generatedFrames: [], totalFrames: 0 };
  }, [activeConfig, selectedSize, images360]);

  // Cache loaded Image objects in RAM
  const imageCache = useRef<{ [index: number]: HTMLImageElement }>({});

  // Preload frame images smoothly in batches
  useEffect(() => {
    if (generatedFrames.length === 0) return;

    setIsPreloading(true);
    setLoadedCount(0);
    imageCache.current = {};

    let cancelled = false;

    // Load key frames first (every 16th frame for rapid preview)
    const keyIndices: number[] = [];
    const step = Math.max(1, Math.floor(generatedFrames.length / 16));
    for (let i = 0; i < generatedFrames.length; i += step) {
      keyIndices.push(i);
    }

    let loaded = 0;
    const total = generatedFrames.length;

    const loadSingle = (index: number) => {
      if (cancelled) return;
      const img = new Image();
      img.src = generatedFrames[index];
      img.onload = () => {
        if (cancelled) return;
        imageCache.current[index] = img;
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= total) {
          setIsPreloading(false);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loaded++;
        setLoadedCount(loaded);
      };
    };

    // Load keyframes first
    keyIndices.forEach((idx) => loadSingle(idx));

    // Load remaining frames
    for (let i = 0; i < total; i++) {
      if (!keyIndices.includes(i)) {
        loadSingle(i);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [generatedFrames]);

  // Inertia and Autoplay animation loop
  useEffect(() => {
    let animId: number;

    const animate = () => {
      if (isDragging.current) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const frameCount = totalFrames > 0 ? totalFrames : 100;

      // Handle glide inertia after release
      if (Math.abs(velocity.current) > 0.05) {
        setCurrentFrame((prev) => {
          let next = prev + velocity.current;
          if (next < 0) next += frameCount;
          if (next >= frameCount) next -= frameCount;
          return next;
        });
        velocity.current *= 0.92; // Friction dampening
      } else if (isPlaying) {
        // Autoplay rotation
        setCurrentFrame((prev) => (prev + 0.38) % frameCount);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, totalFrames]);

  // Mouse & Touch Drag Handlers
  const handleDragStart = useCallback(
    (clientX: number) => {
      if (!interactive) return;
      isDragging.current = true;
      startX.current = clientX;
      startFrame.current = currentFrame;
      lastX.current = clientX;
      lastTime.current = performance.now();
      velocity.current = 0;
      setIsPlaying(false);
    },
    [interactive, currentFrame]
  );

  const handleDragMove = useCallback(
    (clientX: number) => {
      const frameCount = totalFrames > 0 ? totalFrames : 100;
      if (!isDragging.current) return;

      const deltaX = clientX - startX.current;
      // Sensitivity: 2.5px drag = 1 frame rotation
      const frameDelta = deltaX / 2.5;
      let nextFrame = (startFrame.current - frameDelta) % frameCount;
      if (nextFrame < 0) nextFrame += frameCount;

      setCurrentFrame(nextFrame);

      // Compute drag velocity for momentum
      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        const vx = (clientX - lastX.current) / dt;
        velocity.current = -vx * 0.8;
      }
      lastX.current = clientX;
      lastTime.current = now;
    },
    [totalFrames]
  );

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    if (autoplay) {
      setTimeout(() => {
        setIsPlaying(true);
      }, 400);
    }
  }, [autoplay]);

  // Event bindings
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();

  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Canvas Fallback Renderer (if no JSON/images provided)
  useEffect(() => {
    if (totalFrames > 0) return; // Use real 360 photo frames
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2 + 10;
    const ringRadius = Math.min(width, height) * 0.28;

    ctx.clearRect(0, 0, width, height);

    // Render Canvas 3D Ring
    const angle = (currentFrame * 3.6) % 360;
    const rad = (angle * Math.PI) / 180;
    const stoneX = cx + ringRadius * Math.sin(rad);
    const stoneY = cy - ringRadius * Math.cos(rad) * 0.18;

    // Draw Ring Shadow
    const shadowGrad = ctx.createRadialGradient(cx, cy + ringRadius + 10, 5, cx, cy + ringRadius + 10, ringRadius * 1.2);
    shadowGrad.addColorStop(0, 'rgba(16, 21, 26, 0.12)');
    shadowGrad.addColorStop(1, 'rgba(16, 21, 26, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + ringRadius + 10, ringRadius, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw Metal Band
    ctx.lineWidth = 14;
    ctx.strokeStyle = metalColor === 'gold' ? '#E9B646' : metalColor === 'rose' ? '#E0A391' : '#BCC3C8';
    ctx.beginPath();
    ctx.ellipse(cx, cy, ringRadius, ringRadius * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Diamond
    ctx.save();
    ctx.translate(stoneX, stoneY);
    ctx.fillStyle = 'rgba(235, 248, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(0, 0, 14 * caratSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, [currentFrame, totalFrames, metalColor, caratSize, width, height]);

  // Handle JSON Paste Submit
  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(inputJsonText);
      setActiveConfig(parsed);
      setShowJsonModal(false);
      setInputJsonText('');
    } catch (err) {
      alert('Invalid JSON input! Please check the JSON format.');
    }
  };

  const currentDisplayIndex = Math.min(totalFrames - 1, Math.max(0, Math.floor(currentFrame)));
  const currentFrameUrl = generatedFrames[currentDisplayIndex];

  const availableSizes = activeConfig?.shapes?.default?.sizes || [500, 750, 1000, 1500];

  return (
    <div
      ref={containerRef}
      className={`ring-360-wrapper ${isFullscreen ? 'fullscreen' : ''}`}
      style={{
        width: isFullscreen ? '100vw' : '100%',
        maxWidth: isFullscreen ? '100vw' : `${width}px`,
        height: isFullscreen ? '100vh' : 'auto',
        aspectRatio: isFullscreen ? 'auto' : '1 / 1',
      }}
    >
      {/* 360 Display Area */}
      <div
        className="ring-360-canvas-area"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          cursor: interactive ? (isDragging.current ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {url360 ? (
          <iframe
            src={url360}
            title="360° Interactive 3D Model"
            className="ring-360-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : totalFrames > 0 ? (
          <div className="ring-360-image-holder">
            {currentFrameUrl ? (
              <img
                src={currentFrameUrl}
                alt={`360° Ring View Frame ${currentDisplayIndex + 1}`}
                className="ring-360-frame-img"
                draggable={false}
              />
            ) : null}

            {/* Preloading Progress Overlay Bar */}
            {isPreloading && loadedCount < totalFrames && (
              <div className="ring-360-preloader">
                <div className="preloader-bar-bg">
                  <div
                    className="preloader-bar-fill"
                    style={{ width: `${Math.round((loadedCount / totalFrames) * 100)}%` }}
                  />
                </div>
                <span className="preloader-text">
                  Loading 360° HD Views ({loadedCount}/{totalFrames})
                </span>
              </div>
            )}
          </div>
        ) : (
          <canvas ref={canvasRef} className="ring-360-canvas" />
        )}

        {/* Floating Hint Tag */}
        {interactive && !url360 && (
          <div className="ring-360-hint-badge">
            <RotateCcw size={12} className={isPlaying ? 'spin-icon' : ''} />
            <span>
              {totalFrames > 0
                ? `Touch or Drag 360° (${currentDisplayIndex + 1}/${totalFrames})`
                : 'Drag to Rotate 360°'}
            </span>
          </div>
        )}
      </div>

      {/* Control Bar Overlay */}
      {showControls && (
        <div className="ring-360-controls-bar">
          <div className="controls-left">
            <button
              className={`ctrl-btn ${isPlaying ? 'active' : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause Rotation' : 'Auto Play 360°'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>

            <button
              className="ctrl-btn"
              onClick={() => {
                setCurrentFrame(0);
                velocity.current = 0;
              }}
              title="Reset to Front Frame"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          <div className="controls-center">
            {availableSizes.length > 1 && (
              <div className="quality-picker">
                <Sliders size={12} />
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    className={`quality-badge ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}P
                  </button>
                ))}
              </div>
            )}

            {onCardSizeChange && (
              <div className="card-size-picker" title="Adjust Card View Size">
                <span className="card-size-label">Card:</span>
                {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    className={`card-size-badge ${cardSizePreset === sz ? 'active' : ''}`}
                    onClick={() => onCardSizeChange(sz)}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="controls-right">
            {showJsonTester && (
              <button
                className="ctrl-btn"
                onClick={() => setShowJsonModal(true)}
                title="Paste Custom 360 JSON"
              >
                <Code size={15} />
              </button>
            )}

            <button className="ctrl-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* JSON Tester Modal */}
      {showJsonModal && (
        <div className="json-modal-overlay" onClick={() => setShowJsonModal(false)}>
          <div className="json-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="json-modal-header">
              <Sparkles size={18} style={{ color: 'var(--color-teal)' }} />
              <h3>Paste Custom 360° JSON Payload</h3>
            </div>
            <p className="json-modal-desc">
              Paste the 360 JSON metadata payload below to render any diamond/ring in 360° without saving images on disk or Cloudinary!
            </p>
            <textarea
              className="json-modal-textarea"
              placeholder={`{\n  "retailerId": 58,\n  "itemId": "JNB0891-14KY-LAB",\n  "shapes": {\n    "default": {\n      "frameCount": 256,\n      "baseUrl": "https://..."\n    }\n  }\n}`}
              value={inputJsonText}
              onChange={(e) => setInputJsonText(e.target.value)}
              rows={8}
            />
            <div className="json-modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowJsonModal(false)}>
                Cancel
              </button>
              <button className="btn-modal-submit" onClick={handleApplyJson}>
                Render 360° Interactive Model
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ring-360-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, #ffffff 0%, #f4f6f8 100%);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          user-select: none;
          transition: all 0.3s ease;
        }

        .ring-360-wrapper.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 99999;
          border-radius: 0;
          background: #0d1117;
        }

        .ring-360-canvas-area {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ring-360-image-holder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .ring-360-frame-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          pointer-events: none;
          display: block;
        }

        .ring-360-canvas, .ring-360-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .ring-360-preloader {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          padding: 8px 14px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 5;
        }

        .preloader-bar-bg {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .preloader-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          transition: width 0.15s ease;
        }

        .preloader-text {
          font-size: 11px;
          color: #f8fafc;
          font-weight: 500;
          white-space: nowrap;
        }

        .ring-360-hint-badge {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(6px);
          color: #ffffff;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.85;
          transition: opacity 0.2s ease;
        }

        .spin-icon {
          animation: spin360 4s linear infinite;
        }

        @keyframes spin360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ring-360-controls-bar {
          position: absolute;
          bottom: 8px;
          left: 8px;
          right: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          padding: 4px 10px;
          border-radius: 24px;
          z-index: 10;
        }

        .fullscreen .ring-360-controls-bar {
          background: rgba(15, 23, 42, 0.85);
          border-color: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .controls-left, .controls-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ctrl-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .fullscreen .ctrl-btn {
          color: #cbd5e1;
        }

        .ctrl-btn:hover {
          background: rgba(0, 0, 0, 0.06);
          color: #0f172a;
        }

        .fullscreen .ctrl-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .ctrl-btn.active {
          background: #0f172a;
          color: white;
        }

        .quality-picker {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: #64748b;
        }

        .quality-badge {
          border: none;
          background: transparent;
          font-size: 10px;
          font-weight: 600;
          color: #64748b;
          padding: 2px 6px;
          border-radius: 10px;
          cursor: pointer;
        }

        .quality-badge.active {
          background: #0f172a;
          color: white;
        }

        .fullscreen .quality-badge.active {
          background: #38bdf8;
          color: #0f172a;
        }

        /* JSON Modal */
        .json-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .json-modal-card {
          background: white;
          width: 100%;
          max-width: 520px;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .json-modal-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .json-modal-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .json-modal-desc {
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .json-modal-textarea {
          width: 100%;
          font-family: monospace;
          font-size: 11px;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #f8fafc;
          outline: none;
          resize: vertical;
        }

        .json-modal-textarea:focus {
          border-color: #0f172a;
          background: white;
        }

        .json-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-modal-cancel {
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-modal-submit {
          background: #0f172a;
          color: white;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-modal-submit:hover {
          background: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default Ring360Viewer;

