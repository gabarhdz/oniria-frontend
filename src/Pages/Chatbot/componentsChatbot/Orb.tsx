import React from 'react';
import type { OrbProps } from './types';

const Orb: React.FC<OrbProps> = ({ isActive, size = 'medium' }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number | null>(null);
  const timeRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.35;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.2);
      
      if (isActive) {
        gradient.addColorStop(0, 'rgba(155, 66, 254, 1)');
        gradient.addColorStop(0.3, 'rgba(234, 88, 164, 0.9)');
        gradient.addColorStop(0.6, 'rgba(254, 163, 204, 0.7)');
        gradient.addColorStop(1, 'rgba(155, 66, 254, 0.2)');
      } else {
        gradient.addColorStop(0, 'rgba(155, 66, 254, 0.6)');
        gradient.addColorStop(0.4, 'rgba(234, 88, 164, 0.5)');
        gradient.addColorStop(0.7, 'rgba(254, 163, 204, 0.4)');
        gradient.addColorStop(1, 'rgba(155, 66, 254, 0.1)');
      }

      const pulse = isActive ? Math.sin(time * 3) * 0.15 + 1 : Math.sin(time) * 0.05 + 1;
      const radius = baseRadius * pulse;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      const glowGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.5);
      glowGradient.addColorStop(0, 'rgba(254, 163, 204, 0)');
      glowGradient.addColorStop(0.5, 'rgba(234, 88, 164, 0.3)');
      glowGradient.addColorStop(1, 'rgba(155, 66, 254, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      const particleCount = isActive ? 12 : 8;
      for (let i = 0; i < particleCount; i++) {
        const angle = (time * (isActive ? 2 : 0.5) + i * (Math.PI * 2) / particleCount) % (Math.PI * 2);
        const distance = radius * (isActive ? 0.9 : 0.7);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const particleRadius = isActive ? 4 + Math.sin(time * 3 + i) * 2 : 2 + Math.sin(time + i) * 1;

        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, particleRadius * 2);
        particleGradient.addColorStop(0, 'rgba(254, 163, 204, 1)');
        particleGradient.addColorStop(0.5, 'rgba(234, 88, 164, 0.8)');
        particleGradient.addColorStop(1, 'rgba(155, 66, 254, 0)');

        ctx.beginPath();
        ctx.arc(x, y, particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = particleGradient;
        ctx.fill();
      }

      if (isActive) {
        for (let i = 0; i < 3; i++) {
          const waveRadius = (radius * 0.5) + (time * 50 + i * 50) % (radius * 0.8);
          const waveAlpha = 1 - ((time * 50 + i * 50) % (radius * 0.8)) / (radius * 0.8);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(254, 163, 204, ${waveAlpha * 0.5})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
 export default Orb;