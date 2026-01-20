import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ExperimentsView() {
  const expGridRef = useRef<HTMLDivElement>(null);
  const vortexRef = useRef<HTMLDivElement>(null);
  const magneticGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // EXP 01: Proximity Decrypt Grid
    if (expGridRef.current && expGridRef.current.children.length === 0) {
      const expChars = "01XYZ#@&";
      for (let i = 0; i < 64; i++) {
        const div = document.createElement('div');
        div.className = 'w-8 h-8 md:w-12 md:h-12 flex items-center justify-center font-mono text-sm border border-[#00ff41]/20 text-[#00ff41]/30 bg-black transition-all duration-300 select-none';
        div.innerText = expChars[Math.floor(Math.random() * expChars.length)];
        div.dataset.scramble = "true";
        
        const interval = setInterval(() => {
          if (div.dataset.scramble === "true") {
            div.innerText = expChars[Math.floor(Math.random() * expChars.length)];
          }
        }, 100 + Math.random() * 200);
        
        div.addEventListener('mouseenter', () => {
          div.dataset.scramble = "false";
          div.style.backgroundColor = "#00ff41";
          div.style.color = "#000";
          div.style.transform = "scale(1.1)";
          div.innerText = Math.random() > 0.5 ? "1" : "0";
        });
        
        div.addEventListener('mouseleave', () => {
          setTimeout(() => {
            div.dataset.scramble = "true";
            div.style.backgroundColor = "black";
            div.style.color = "rgba(0, 255, 65, 0.3)";
            div.style.transform = "scale(1)";
          }, 500);
        });
        
        expGridRef.current?.appendChild(div);
      }
    }

    // EXP 02: Infinite Tunnel
    if (vortexRef.current && vortexRef.current.children.length === 0) {
      gsap.set(vortexRef.current, { perspective: 1000 });
      const ringCount = 12;
      const travelDistance = 15000;
      
      for (let i = 0; i < ringCount; i++) {
        const ring = document.createElement('div');
        ring.className = 'vortex-ring absolute rounded-full flex items-center justify-center font-syne font-bold uppercase tracking-widest';
        ring.style.width = "40vw";
        ring.style.height = "40vw";
        ring.style.fontSize = "2.5vw";
        
        if (i % 2 === 0) {
          ring.style.border = "2px solid #00ff41";
          ring.style.color = "transparent";
          ring.style.webkitTextStroke = "1px #00ff41";
          ring.innerText = "MATRIX_SYSTEM_".repeat(3);
        } else {
          ring.style.border = "1px dashed rgba(0, 255, 65, 0.3)";
          ring.style.color = "#00ff41";
          ring.innerText = "DATA_STREAM_".repeat(4);
        }
        
        const startZ = -i * 1200 - 2000;
        gsap.set(ring, { z: startZ, opacity: 0 });
        vortexRef.current?.appendChild(ring);
      }
      
      const rings = document.querySelectorAll('.vortex-ring');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#vortex-section",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
      
      rings.forEach((ring, i) => {
        const startZ = -i * 1200 - 2000;
        const endZ = startZ + travelDistance;
        let visibleRatio = Math.abs(startZ) / travelDistance;
        let fadeOutStart = Math.max(0, visibleRatio - 0.1);
        let fadeOutEnd = Math.max(0, visibleRatio - 0.02);
        
        tl.to(ring, { 
          z: endZ, 
          rotation: i % 2 === 0 ? 360 : -360, 
          ease: "none", 
          duration: 10 
        }, 0);
        
        tl.to(ring, {
          keyframes: [
            { opacity: 0, duration: 0 },
            { opacity: 1, duration: 1 },
            { opacity: 1, duration: fadeOutStart * 10 - 1 },
            { opacity: 0, duration: fadeOutEnd * 10 }
          ],
          ease: "none",
          duration: 10
        }, 0);
      });
    }

    // EXP 03: Vector Field Simulation
    if (magneticGridRef.current && magneticGridRef.current.children.length === 0) {
      const particleCount = 120;
      const particles: HTMLElement[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'w-1 h-6 bg-[#00ff41]/30 transition-colors duration-200';
        magneticGridRef.current?.appendChild(p);
        particles.push(p);
      }
      
      const handleMouseMove = (e: MouseEvent) => {
        particles.forEach(p => {
          const rect = p.getBoundingClientRect();
          const pX = rect.left + rect.width / 2;
          const pY = rect.top + rect.height / 2;
          const distX = e.clientX - pX;
          const distY = e.clientY - pY;
          const angle = Math.atan2(distY, distX);
          const dist = Math.sqrt(distX * distX + distY * distY);
          const maxDist = 400;
          
          if (dist < maxDist) {
            const intensity = 1 - (dist / maxDist);
            gsap.to(p, {
              rotation: `${angle + (Math.PI / 2)}rad`,
              backgroundColor: `rgba(0, 255, 65, ${0.3 + intensity})`,
              boxShadow: `0 0 ${intensity * 10}px #00ff41`,
              scaleY: 1 + intensity,
              duration: 0.2
            });
          } else {
            gsap.to(p, {
              rotation: 0,
              backgroundColor: "rgba(0, 255, 65, 0.3)",
              boxShadow: "none",
              scaleY: 1,
              duration: 0.5
            });
          }
        });
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div id="view-experiments" className="view-section">
      <section className="min-h-screen bg-[#050505] border-b border-[#00ff41]/20 relative flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 z-0">
        <div className="absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 font-mono text-[10px] sm:text-xs text-[#00ff41]">[01] PROXIMITY_DECRYPT_V2</div>
        <div className="relative p-4 sm:p-6 md:p-8 border border-[#00ff41]/30 bg-[#00ff41]/5 backdrop-blur-sm max-w-6xl w-full mx-auto">
          <div ref={expGridRef} className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2 relative z-10"></div>
        </div>
      </section>

      <section className="h-[150vh] sm:h-[175vh] md:h-[200vh] bg-[#050505] border-b border-[#00ff41]/20 relative overflow-hidden z-0" id="vortex-section">
        <div className="absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 font-mono text-[10px] sm:text-xs text-[#00ff41] z-20">[02] INFINITE_TUNNEL</div>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" style={{perspective: '1000px'}}>
          <div ref={vortexRef} className="relative w-full h-full flex items-center justify-center transform-style-3d"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none"></div>
        </div>
      </section>

      <section className="min-h-screen bg-[#050505] relative flex flex-col items-center justify-center overflow-hidden z-0 py-12" id="magnetic-section">
        <div className="absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 font-mono text-[10px] sm:text-xs text-[#00ff41]">[03] VECTOR_FIELD_SIMULATION</div>
        <div ref={magneticGridRef} className="absolute inset-0 flex flex-wrap content-center justify-center gap-3 sm:gap-4 md:gap-6 p-6 sm:p-8 md:p-10"></div>
      </section>
    </div>
  );
}