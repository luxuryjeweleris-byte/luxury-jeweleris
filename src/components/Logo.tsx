'use client';

import React, { useEffect, useState } from 'react';

interface LogoProps {
  theme?: 'light' | 'dark';
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ theme = 'light', height = 40 }) => {
  const [transparentSrc, setTransparentSrc] = useState<string>('');
  const textColor = theme === 'light' ? '#10151a' : '#ffffff';

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/emblem.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Loop through pixels and convert the black background to fully transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Calculate brightness value
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        
        if (brightness < 45) {
          data[i+3] = 0; // Transparent
        } else if (brightness < 85) {
          // Smooth anti-aliased edge blend
          const ratio = (brightness - 45) / (85 - 45);
          data[i+3] = Math.round(data[i+3] * ratio);
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      setTransparentSrc(canvas.toDataURL());
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: `${height}px`, gap: '10px' }}>
      {transparentSrc ? (
        <img 
          src={transparentSrc} 
          alt="Luxury Jewelers Emblem" 
          style={{ 
            height: '110%', 
            width: 'auto', 
            objectFit: 'contain',
            transform: 'translateY(-1px)'
          }} 
        />
      ) : (
        <div style={{ width: `${height}px`, height: '100%' }} /> // Placeholder layout block
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ 
          fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)", 
          fontSize: `${height * 0.42}px`, 
          fontWeight: 700, 
          letterSpacing: '0.5px',
          lineHeight: 1.1
        }}>
          <span style={{ color: textColor }}>LUXURY </span>
          <span style={{ 
            background: 'linear-gradient(135deg, #FCE0AD 0%, #DFAC6C 35%, #C68B45 70%, #8E5E24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            JEWELERIS
          </span>
        </div>
        <div style={{ 
          fontFamily: "var(--font-sans, 'Inter', sans-serif)", 
          fontSize: `${height * 0.18}px`, 
          fontWeight: 600, 
          letterSpacing: '1.6px', 
          color: '#8792A0',
          opacity: 0.95,
          marginTop: '1px',
          textTransform: 'uppercase'
        }}>
          ENHANCE YOUR BEAUTY
        </div>
      </div>
    </div>
  );
};

export default Logo;
