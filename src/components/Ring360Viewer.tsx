'use client';

import React, { useRef, useEffect, useState } from 'react';
import './components.css';

interface Ring360ViewerProps {
  autoplay?: boolean;
  interactive?: boolean;
  metalColor?: 'gold' | 'platinum' | 'rose';
  caratSize?: number; // scale multiplier for the stone
  width?: number;
  height?: number;
}

export const Ring360Viewer: React.FC<Ring360ViewerProps> = ({
  autoplay = true,
  interactive = false,
  metalColor = 'gold',
  caratSize = 1.0,
  width = 400,
  height = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0); // rotation angle in degrees (0 to 360)
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);

  // Set metal colors
  const getMetalGradients = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    let colors: string[] = [];
    if (metalColor === 'gold') {
      colors = ['#F9D976', '#E9B646', '#C1932E', '#E9B646', '#FFF3D1', '#C1932E'];
    } else if (metalColor === 'rose') {
      colors = ['#F5C2B3', '#E0A391', '#C57E6B', '#E0A391', '#F9DCD3', '#C57E6B'];
    } else {
      // Platinum / White Gold
      colors = ['#E5E9EC', '#BCC3C8', '#949CA2', '#BCC3C8', '#F5F7F8', '#949CA2'];
    }

    const grad = ctx.createRadialGradient(cx, cy, r - 15, cx, cy, r + 15);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.2, colors[1]);
    grad.addColorStop(0.4, colors[2]);
    grad.addColorStop(0.6, colors[3]);
    grad.addColorStop(0.8, colors[4]);
    grad.addColorStop(1, colors[5]);
    return grad;
  };

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2 + 10;
    const ringRadius = Math.min(width, height) * 0.28;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Shadows
    const shadowGrad = ctx.createRadialGradient(cx, cy + ringRadius + 10, 5, cx, cy + ringRadius + 10, ringRadius * 1.2);
    shadowGrad.addColorStop(0, 'rgba(16, 21, 26, 0.12)');
    shadowGrad.addColorStop(1, 'rgba(16, 21, 26, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + ringRadius + 10, ringRadius, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3D perspective angle
    const rad = (angle * Math.PI) / 180;
    const stoneX = cx + ringRadius * Math.sin(rad);
    const stoneY = cy - ringRadius * Math.cos(rad) * 0.18; // Flat ellipse projection
    const isStoneBehind = Math.cos(rad) > 0; // if stone is on the far side of rotation

    // DRAW RING BAND
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    
    // Draw back half of the ring band first if stone is in front, or front half if stone is behind
    const drawBand = (startAngle: number, endAngle: number) => {
      ctx.beginPath();
      // Draw ring base
      ctx.ellipse(cx, cy, ringRadius, ringRadius * 0.18, 0, startAngle, endAngle);
      ctx.strokeStyle = getMetalGradients(ctx, cx, cy, ringRadius);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    };

    if (isStoneBehind) {
      // Draw stone first (behind)
      drawStone(ctx, stoneX, stoneY, rad, caratSize, true);
      drawBand(0, Math.PI * 2);
    } else {
      // Draw band first (behind stone)
      drawBand(0, Math.PI * 2);
      // Draw stone in front
      drawStone(ctx, stoneX, stoneY, rad, caratSize, false);
    }
  }, [angle, metalColor, caratSize, width, height]);

  // Draw the diamond
  const drawStone = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rad: number,
    scale: number,
    behind: boolean
  ) => {
    const size = 26 * scale;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rad * 0.5); // spin the stone slightly for 3D look

    // Draw Prongs (gold/platinum tips holding the diamond)
    ctx.fillStyle = metalColor === 'gold' ? '#C1932E' : '#949CA2';
    const prongOffsets = [[-size * 0.6, -size * 0.2], [size * 0.6, -size * 0.2], [0, size * 0.6]];
    prongOffsets.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Diamond facets (polygons with gradients)
    // Table (center facet)
    ctx.fillStyle = 'rgba(235, 248, 255, 0.95)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, -size * 0.4);
    ctx.lineTo(size * 0.3, -size * 0.4);
    ctx.lineTo(size * 0.45, -size * 0.1);
    ctx.lineTo(0, size * 0.5);
    ctx.lineTo(-size * 0.45, -size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Side Facets
    const drawFacet = (pts: number[][], color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // Facet Colors (dynamic depending on angle to simulate sparkle)
    const intensity = Math.abs(Math.sin(rad * 3));
    const facetColor1 = `rgba(255, 255, 255, ${0.7 + intensity * 0.3})`;
    const facetColor2 = `rgba(220, 240, 255, ${0.4 + (1 - intensity) * 0.4})`;
    const facetColor3 = `rgba(180, 225, 255, ${0.5 + intensity * 0.4})`;

    // Left Facet
    drawFacet([
      [-size * 0.3, -size * 0.4],
      [0, -size * 0.48],
      [size * 0.3, -size * 0.4],
      [0, size * 0.5]
    ], facetColor1);

    // Star facet reflections
    drawFacet([
      [-size * 0.45, -size * 0.1],
      [-size * 0.3, -size * 0.4],
      [0, size * 0.5]
    ], facetColor2);

    drawFacet([
      [size * 0.45, -size * 0.1],
      [size * 0.3, -size * 0.4],
      [0, size * 0.5]
    ], facetColor3);

    // Sparkle Flares (when angle aligns with "light source" around 45, 135, 225, 315 deg)
    const angleMod = Math.abs((rad * 180 / Math.PI) % 90 - 45);
    if (angleMod < 8 && !behind) {
      const flareScale = (8 - angleMod) / 8;
      drawSparkle(ctx, 0, -size * 0.2, flareScale * 1.5);
    }

    ctx.restore();
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(14, 140, 138, 0.6)';
    ctx.shadowBlur = 10;
    
    // Draw 4-point star flare
    for (let i = 0; i < 2; i++) {
      ctx.rotate(Math.PI / 4 * i);
      ctx.beginPath();
      ctx.moveTo(0, -18 * scale);
      ctx.quadraticCurveTo(0, 0, 18 * scale, 0);
      ctx.quadraticCurveTo(0, 0, 0, 18 * scale);
      ctx.quadraticCurveTo(0, 0, -18 * scale, 0);
      ctx.quadraticCurveTo(0, 0, 0, -18 * scale);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };

  // Autoplay Rotation Loop
  useEffect(() => {
    if (!autoplay || isDragging.current) return;
    let animId: number;

    const tick = () => {
      setAngle((prev) => (prev + 0.5) % 360);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [autoplay]);

  // Mouse / Drag Handlers for manual rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDragging.current = true;
    startX.current = e.clientX;
    startAngle.current = angle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !interactive) return;
    const deltaX = e.clientX - startX.current;
    // 1px drag = 0.8 degrees of rotation
    const newAngle = (startAngle.current + deltaX * 0.8) % 360;
    setAngle(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive) return;
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    startAngle.current = angle;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !interactive) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const newAngle = (startAngle.current + deltaX * 0.8) % 360;
    setAngle(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  return (
    <div 
      className="ring-360-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUpOrLeave}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        height: 'auto',
        aspectRatio: '1 / 1',
        position: 'relative',
        cursor: interactive ? (isDragging.current ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {interactive && (
        <div className="ring-360-hint">
          <span>← Drag to Rotate 360° →</span>
        </div>
      )}
      <style>{`
        .ring-360-container {
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(247,248,249,1) 100%);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .ring-360-hint {
          position: absolute;
          bottom: var(--space-4);
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(16, 21, 26, 0.7);
          color: white;
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          font-size: 11px;
          font-weight: 600;
          pointer-events: none;
          letter-spacing: 0.5px;
          opacity: 0.8;
          transition: opacity 150ms ease;
        }
        .ring-360-container:hover .ring-360-hint {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};
export default Ring360Viewer;
