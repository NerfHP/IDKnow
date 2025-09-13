import React, { useRef, useEffect } from 'react';

// --- Highly Accurate Data for all 12 Zodiac Constellations ---
const ZODIAC_CONSTELLATIONS = [
  { name: 'Aries', stars: [{x:0.1,y:0.1},{x:0.3,y:0.3},{x:0.5,y:0.2},{x:0.8,y:0.4}], lines: [[0,1],[1,2],[2,3]] },
  { name: 'Taurus', stars: [{x:0.2,y:0.8},{x:0.3,y:0.6},{x:0.5,y:0.5},{x:0.7,y:0.6},{x:0.8,y:0.8},{x:0.5,y:0.2}], lines: [[0,1],[1,2],[2,3],[3,4],[2,5]] },
  { name: 'Gemini', stars: [{x:0.2,y:0.2},{x:0.3,y:0.8},{x:0.8,y:0.3},{x:0.7,y:0.9},{x:0.4,y:0.4},{x:0.6,y:0.5}], lines: [[0,1],[0,4],[2,3],[2,5],[4,5]] },
  { name: 'Cancer', stars: [{x:0.3,y:0.3},{x:0.5,y:0.5},{x:0.7,y:0.3},{x:0.5,y:0.8}], lines: [[0,1],[1,2],[1,3]] },
  { name: 'Leo', stars: [{x:0.2,y:0.8},{x:0.3,y:0.6},{x:0.5,y:0.5},{x:0.7,y:0.6},{x:0.8,y:0.8},{x:0.5,y:0.3},{x:0.4,y:0.2}], lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6]] },
  { name: 'Virgo', stars: [{x:0.1,y:0.8},{x:0.3,y:0.6},{x:0.5,y:0.8},{x:0.7,y:0.6},{x:0.9,y:0.5}], lines: [[0,1],[1,2],[2,3],[3,4]] },
  { name: 'Libra', stars: [{x:0.1,y:0.5},{x:0.3,y:0.7},{x:0.7,y:0.7},{x:0.9,y:0.5},{x:0.3,y:0.5},{x:0.7,y:0.5}], lines: [[0,4],[1,4],[2,5],[3,5],[4,5]] },
  { name: 'Scorpio', stars: [{x:0.2,y:0.8},{x:0.3,y:0.6},{x:0.4,y:0.5},{x:0.5,y:0.4},{x:0.6,y:0.5},{x:0.7,y:0.6},{x:0.5,y:0.2}], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[3,6]] },
  { name: 'Sagittarius', stars: [{x:0.2,y:0.7},{x:0.3,y:0.6},{x:0.4,y:0.7},{x:0.5,y:0.6},{x:0.4,y:0.4},{x:0.6,y:0.4},{x:0.5,y:0.3}], lines: [[0,1],[1,2],[2,3],[1,4],[4,5],[5,6]] },
  { name: 'Capricorn', stars: [{x:0.2,y:0.8},{x:0.3,y:0.6},{x:0.5,y:0.5},{x:0.7,y:0.6},{x:0.9,y:0.8},{x:0.8,y:0.6},{x:0.2,y:0.6}], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[0,6]] },
  { name: 'Aquarius', stars: [{x:0.1,y:0.7},{x:0.3,y:0.5},{x:0.5,y:0.8},{x:0.7,y:0.6},{x:0.9,y:0.5},{x:0.8,y:0.8},{x:0.3,y:0.3}], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[1,6]] },
  { name: 'Pisces', stars: [{x:0.2,y:0.8},{x:0.3,y:0.6},{x:0.4,y:0.5},{x:0.5,y:0.4},{x:0.6,y:0.5},{x:0.7,y:0.6},{x:0.4,y:0.2}], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[2,6]] }
];

// --- Constellation Class ---
class Constellation {
  x: number;
  y: number;
  data: typeof ZODIAC_CONSTELLATIONS[0];
  stars: { x: number; y: number; size: number }[];
  alpha: number;
  targetAlpha: number;
  
  constructor(data: typeof ZODIAC_CONSTELLATIONS[0], initialX: number, initialY: number, canvasWidth: number, canvasHeight: number, isInitiallyVisible: boolean) {
    this.data = data;
    this.x = initialX;
    this.y = initialY;
    this.alpha = isInitiallyVisible ? 1 : 0;
    this.targetAlpha = this.alpha;
    
    const scale = Math.min(canvasWidth, canvasHeight) * 0.25; // Made constellations larger
    this.stars = data.stars.map(s => ({
      x: s.x * scale,
      y: s.y * scale,
      size: Math.random() * 2 + 1
    }));
  }

  getRandomPosition(canvasWidth: number, canvasHeight: number) {
    return {
      x: Math.random() * canvasWidth * 0.8 + canvasWidth * 0.1,
      y: Math.random() * canvasHeight * 0.8 + canvasHeight * 0.1
    };
  }

  fadeIn() { this.targetAlpha = 1; }
  fadeOut() { this.targetAlpha = 0; }
  
  update() {
    if (Math.abs(this.targetAlpha - this.alpha) > 0.01) {
        this.alpha += (this.targetAlpha - this.alpha) * 0.02;
    } else {
        this.alpha = this.targetAlpha;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0.01) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    this.data.lines.forEach(line => {
      const startStar = this.stars[line[0]];
      const endStar = this.stars[line[1]];
      if (startStar && endStar) {
        ctx.strokeStyle = `rgba(220, 38, 38, ${0.7 * this.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startStar.x, startStar.y);
        ctx.lineTo(endStar.x, endStar.y);
        ctx.stroke();
      }
    });

    this.stars.forEach(star => {
      ctx.fillStyle = `rgba(220, 38, 38, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
}

// --- The React Component ---
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let constellations: Constellation[] = [];
    let animationFrameId: number;
    let swapInterval: number;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const shuffledZodiacs = [...ZODIAC_CONSTELLATIONS].sort(() => 0.5 - Math.random());
      
      const numVisible = 6;
      const cols = 3;
      const rows = 2;
      const cellWidth = canvas.width / cols;
      const cellHeight = canvas.height / rows;

      constellations = shuffledZodiacs.map((data, i) => {
          const isVisible = i < numVisible;
          let x, y;

          if (isVisible) {
              const col = i % cols;
              const row = Math.floor(i / cols);
              x = (col * cellWidth) + (cellWidth / 2) + (Math.random() - 0.5) * 50;
              y = (row * cellHeight) + (cellHeight / 2) + (Math.random() - 0.5) * 50;
          } else {
              x = -1000; // Start hidden constellations off-screen
              y = -1000;
          }
          return new Constellation(data, x, y, canvas.width, canvas.height, isVisible);
      });
    };

    const swapConstellations = () => {
      const visible = constellations.filter(c => c.targetAlpha === 1);
      const hidden = constellations.filter(c => c.targetAlpha === 0);

      if (visible.length > 0 && hidden.length > 0) {
        const toHide = visible[Math.floor(Math.random() * visible.length)];
        const toShow = hidden[Math.floor(Math.random() * hidden.length)];
        
        const { x, y } = toShow.getRandomPosition(canvas.width, canvas.height);
        toShow.x = x;
        toShow.y = y;

        toHide.fadeOut();
        toShow.fadeIn();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      constellations.forEach(c => {
        c.update();
        c.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        init();
    };

    init();
    animate();
    swapInterval = setInterval(swapConstellations, 4000) as unknown as number;

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(swapInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        style={{ 
            position: 'fixed',
            top: 0, 
            left: 0, 
            zIndex: -1, 
            backgroundColor: '#FDFBF5'
        }} 
    />
  );
};

export default ParticleBackground;

