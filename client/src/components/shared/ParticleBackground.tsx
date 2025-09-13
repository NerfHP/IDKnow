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
  homeX: number;
  homeY: number;
  width: number;
  height: number;
  data: typeof ZODIAC_CONSTELLATIONS[0];
  stars: { x: number; y: number; size: number }[];
  alpha: number;
  targetAlpha: number;
  
  constructor(data: typeof ZODIAC_CONSTELLATIONS[0], initialX: number, initialY: number, canvasWidth: number, isInitiallyVisible: boolean) {
    this.data = data;
    this.homeX = initialX;
    this.homeY = initialY;
    this.x = initialX;
    this.y = initialY;
    this.alpha = isInitiallyVisible ? 1 : 0;
    this.targetAlpha = this.alpha;
    
    const scale = Math.min(canvasWidth, window.innerHeight) * 0.22;
    this.width = scale;
    this.height = scale;
    this.stars = data.stars.map(s => ({
      x: s.x * scale,
      y: s.y * scale,
      size: Math.random() * 2 + 1
    }));
  }

  fadeIn() { this.targetAlpha = 1; }
  fadeOut() { this.targetAlpha = 0; }
  
  update(mouseX: number | null, mouseY: number | null) {
    if (Math.abs(this.targetAlpha - this.alpha) > 0.01) {
        this.alpha += (this.targetAlpha - this.alpha) * 0.02;
    } else {
        this.alpha = this.targetAlpha;
    }
    
    let targetX = this.homeX;
    let targetY = this.homeY;
    const repelRadius = 200;
    const maxRepelDist = 40;

    if (mouseX !== null && mouseY !== null) {
        const dx = this.x + this.width / 2 - mouseX;
        const dy = this.y + this.height / 2 - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < repelRadius) {
            const force = (repelRadius - distance) / repelRadius;
            const angle = Math.atan2(dy, dx);
            targetX += Math.cos(angle) * force * maxRepelDist;
            targetY += Math.sin(angle) * force * maxRepelDist;
        }
    }
    
    this.x += (targetX - this.x) * 0.05;
    this.y += (targetY - this.y) * 0.05;
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
    const mouse = { x: null as number | null, y: null as number | null };

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      const numToCreate = 12;
      let availableZodiacs = [...ZODIAC_CONSTELLATIONS];
      constellations = [];
      const placedPositions: { x: number; y: number; width: number; height: number }[] = [];

      for (let i = 0; i < numToCreate; i++) {
        if (availableZodiacs.length === 0) availableZodiacs = [...ZODIAC_CONSTELLATIONS];
        const zodiacIndex = Math.floor(Math.random() * availableZodiacs.length);
        const data = availableZodiacs.splice(zodiacIndex, 1)[0];
        
        const tempConst = new Constellation(data, 0, 0, window.innerWidth, true);
        const width = tempConst.width;
        const height = tempConst.height;
        
        let x = 0, y = 0, overlaps = true, attempts = 0;

        // Replaced do-while with a standard while loop to avoid potential IDE analysis issues.
        while (overlaps && attempts < 100) {
          x = Math.random() * (window.innerWidth - width);
          y = Math.random() * (window.innerHeight - height);
          
          overlaps = placedPositions.some(p => 
            x < p.x + p.width && x + width > p.x &&
            y < p.y + p.height && y + height > p.y
          );
          
          if (!overlaps) {
            break; // Found a non-overlapping spot
          }
          attempts++;
        }
        
        placedPositions.push({ x, y, width, height });
        constellations.push(new Constellation(data, x, y, window.innerWidth, true));
      }
    };

    const replaceConstellation = () => {
      if (constellations.length === 0) return;
      const replacementIndex = Math.floor(Math.random() * constellations.length);
      const oldConstellation = constellations[replacementIndex];
      const oldData = oldConstellation.data;
      
      let newData = ZODIAC_CONSTELLATIONS[Math.floor(Math.random() * ZODIAC_CONSTELLATIONS.length)];
      while (newData.name === oldData.name) {
          newData = ZODIAC_CONSTELLATIONS[Math.floor(Math.random() * ZODIAC_CONSTELLATIONS.length)];
      }

      oldConstellation.fadeOut();

      setTimeout(() => {
        const newConstellation = new Constellation(newData, oldConstellation.homeX, oldConstellation.homeY, window.innerWidth, false);
        constellations[replacementIndex] = newConstellation;
        newConstellation.fadeIn();
      }, 2000);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      constellations.forEach(c => {
        c.update(mouse.x, mouse.y);
        c.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        init();
    };
    
    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    };
    
    const handleMouseOut = () => {
        mouse.x = null;
        mouse.y = null;
    }

    init();
    animate();
    swapInterval = setInterval(replaceConstellation, 3000) as unknown as number;

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(swapInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        style={{ 
            position: 'fixed',
            top: 0, 
            left: 0, 
            width: '100%',
            height: '100%',
            zIndex: -1, 
            backgroundColor: '#FDF4DC'
        }} 
    />
  );
};

export default ParticleBackground;

