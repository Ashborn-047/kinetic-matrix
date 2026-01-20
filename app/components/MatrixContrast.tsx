import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function MatrixContrast() {
  useEffect(() => {
    gsap.utils.toArray('.slide-up-trigger').forEach((el: any) => {
      gsap.to(el, {
        opacity: 1,
        y: -10,
        duration: 0.8,
        scrollTrigger: { trigger: el, start: "top 80%" }
      });
    });
  }, []);

  return (
    <section className="flex flex-col relative z-20">
      {/* SOURCE Section - Full height */}
      <div className="w-full min-h-screen bg-[#00ff41] text-black flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 group hover-container relative overflow-hidden border-b border-black/20" data-cursor="Binary">
        {/* BG */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px' }}>
        </div>
        {/* Decorations */}
        <div className="absolute w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw] md:w-[30vw] md:h-[30vw] border border-black/20 rounded-full" style={{ animation: 'spin 20s linear infinite' }}></div>
        <div className="absolute w-[45vw] h-[45vw] sm:w-[35vw] sm:h-[35vw] md:w-[25vw] md:h-[25vw] border border-dashed border-black/20 rounded-full" style={{ animation: 'spin 30s linear infinite reverse' }}></div>

        <div className="relative z-10 text-center">
          <div className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] sm:tracking-[0.5em] mb-3 sm:mb-4 opacity-0 slide-up-trigger">/// ORIGIN POINT</div>
          <h2 className="font-syne font-black text-5xl sm:text-6xl md:text-7xl lg:text-9xl contrast-text glitch-random relative inline-block">
            SOURCE
            <span className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-black"></span>
            <span className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-black"></span>
          </h2>
          <div className="mt-3 sm:mt-4 font-mono text-[10px] sm:text-xs font-bold flex flex-wrap justify-center gap-2 sm:gap-4 opacity-0 slide-up-trigger">
            <span>[RAW_DATA]</span>
            <span>[UNCOMPILED]</span>
          </div>
        </div>
      </div>

      {/* CODE Section - Full height */}
      <div className="w-full min-h-screen bg-[#050505] text-[#00ff41] flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 group hover-container border-t border-[#00ff41]/20 relative overflow-hidden" data-cursor="Code">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff41]/30 shadow-[0_0_15px_#00ff41] animate-scanline"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 font-mono text-[10px] sm:text-xs text-[#00ff41]/70 opacity-0 slide-up-trigger">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00ff41] rounded-full animate-ping"></span>
            EXECUTING SCRIPT...
          </div>

          <h2 className="font-mono font-thin text-5xl sm:text-6xl md:text-7xl lg:text-9xl tracking-tighter contrast-text relative">
            <span className="inline-block transform transition-transform duration-300 group-hover:-translate-x-3 md:group-hover:-translate-x-6 text-white font-bold">&#123;</span>
            <span className="glitch-random inline-block mx-1 sm:mx-2">CODE</span>
            <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-3 md:group-hover:translate-x-6 text-white font-bold">&#125;</span>
          </h2>

          <div className="mt-6 sm:mt-8 border border-[#00ff41]/30 p-3 sm:p-4 bg-[#00ff41]/5 backdrop-blur-sm max-w-xs w-full opacity-0 slide-up-trigger relative group">
            <div className="flex justify-between text-[9px] sm:text-[10px] font-mono mb-1">
              <span>MEMORY_ALLOC</span>
              <span>84%</span>
            </div>
            <div className="w-full h-1 bg-[#00ff41]/20">
              <div className="h-full bg-[#00ff41] w-[84%]"></div>
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] mt-2 leading-tight opacity-70">
              &gt; parsing_tokens...<br />
              &gt; parsing_segment_0x4B...<br />
              &gt; render_complete.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}