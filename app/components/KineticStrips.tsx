import { useEffect } from 'react';
import gsap from 'gsap';

export default function KineticStrips() {
  useEffect(() => {
    const stripInner = document.querySelector('.kinetic-strip .strip-inner');
    if (stripInner) {
      const parent = stripInner.parentElement;
      if (parent) {
        stripInner.innerHTML += stripInner.innerHTML;
        gsap.to(stripInner, { xPercent: -50, duration: 15, ease: "linear", repeat: -1 });
      }
    }

    const stripReverseInner = document.querySelector('.kinetic-strip-reverse .strip-inner-reverse');
    if (stripReverseInner) {
      stripReverseInner.innerHTML += stripReverseInner.innerHTML;
      gsap.set(stripReverseInner, { xPercent: -50 });
      gsap.to(stripReverseInner, { xPercent: 0, duration: 15, ease: "linear", repeat: -1 });
    }
  }, []);

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-[#050505] overflow-hidden relative border-y border-[#00ff41]/20">
      <div className="kinetic-strip w-[120%] -ml-[10%] bg-white text-black font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl py-3 sm:py-4 mb-3 sm:mb-4 transform -rotate-2 origin-center border-y-2 sm:border-y-4 border-[#00ff41]">
        <div className="strip-inner flex whitespace-nowrap">
          <span className="px-4 sm:px-6 md:px-8 font-bold">SYSTEM OVERRIDE</span>
          <span className="px-4 sm:px-6 md:px-8 font-mono text-[#00ff41] bg-black">ERROR 404</span>
          <span className="px-4 sm:px-6 md:px-8 font-bold">SYSTEM OVERRIDE</span>
          <span className="px-4 sm:px-6 md:px-8 font-mono text-[#00ff41] bg-black">ERROR 404</span>
          <span className="px-4 sm:px-6 md:px-8 font-bold">SYSTEM OVERRIDE</span>
          <span className="px-4 sm:px-6 md:px-8 font-mono text-[#00ff41] bg-black">ERROR 404</span>
          <span className="px-4 sm:px-6 md:px-8 font-bold">SYSTEM OVERRIDE</span>
          <span className="px-4 sm:px-6 md:px-8 font-mono text-[#00ff41] bg-black">ERROR 404</span>
        </div>
      </div>
      <div className="kinetic-strip-reverse w-[120%] -ml-[10%] bg-[#00ff41] text-black font-mono text-2xl sm:text-3xl md:text-4xl py-1.5 sm:py-2 transform rotate-1 origin-center mix-blend-hard-light">
        <div className="strip-inner-reverse flex whitespace-nowrap">
          <span className="px-4 sm:px-6 md:px-8">/// DATA STREAMING ///</span>
          <span className="px-4 sm:px-6 md:px-8 font-bold">ACCESS::0x41::GRANTED</span>
          <span className="px-4 sm:px-6 md:px-8">/// DATA STREAMING ///</span>
          <span className="px-4 sm:px-6 md:px-8 font-bold">ACCESS::0x41::GRANTED</span>
          <span className="px-4 sm:px-6 md:px-8">/// DATA STREAMING ///</span>
          <span className="px-4 sm:px-6 md:px-8 font-bold">ACCESS::0x41::GRANTED</span>
          <span className="px-4 sm:px-6 md:px-8">/// DATA STREAMING ///</span>
          <span className="px-4 sm:px-6 md:px-8 font-bold">ACCESS::0x41::GRANTED</span>
        </div>
      </div>
    </section>
  );
}