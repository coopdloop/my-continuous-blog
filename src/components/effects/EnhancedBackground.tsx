import React, { useEffect, useRef } from 'react';

const EnhancedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw honeycomb pattern
    const drawHexagon = (x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const xPos = x + size * Math.cos(angle);
        const yPos = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const size = 30;
      const spacing = size * 1.8;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      for (let y = -size; y < canvas.height + size; y += spacing * 1.5) {
        for (let x = -size; x < canvas.width + size; x += spacing * 2) {
          drawHexagon(x, y, size);
          drawHexagon(x + spacing, y + (spacing * 1.5) / 2, size);
        }
      }
    };

    animate();
    window.addEventListener('resize', animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', animate);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950" />

      {/* Hexagon pattern */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />

      {/* Ambient light effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.015]" />
    </div>
  );
};

export default EnhancedBackground;
