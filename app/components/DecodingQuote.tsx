import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

class TextScramble {
  el: HTMLElement;
  chars: string;
  resolve?: () => void;
  queue: Array<{from: string; to: string; start: number; end: number; char?: string}>;
  frameRequest?: number;
  frame: number;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
    this.queue = [];
    this.frame = 0;
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest!);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="text-[#00ff41] opacity-70">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve!();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

export default function DecodingQuote() {
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const finalQuote = "The Matrix is everywhere. It is all around us. Even now, in this very room.";
    
    if (quoteRef.current) {
      const quoteFx = new TextScramble(quoteRef.current);
      
      ScrollTrigger.create({
        trigger: "#scatter-section",
        start: "top 60%",
        onEnter: () => {
          quoteFx.setText(finalQuote);
          gsap.to('.fade-in-trigger', { opacity: 1, duration: 1, delay: 1 });
        }
      });
    }
  }, []);

  return (
    <section className="min-h-screen relative flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 bg-[#0a0a0a]" id="scatter-section">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" 
           style={{backgroundImage: 'radial-gradient(#00ff41 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
        <div className="mb-6 sm:mb-8 font-mono text-[10px] sm:text-xs text-[#00ff41] tracking-[0.3em] sm:tracking-[0.5em] uppercase opacity-70">
          /// Message Decryption in Progress ///
        </div>

        <div className="quote-container min-h-[150px] sm:min-h-[200px] flex items-center justify-center">
          <p 
            ref={quoteRef}
            className="decode-text font-inter font-light text-xl sm:text-2xl md:text-4xl lg:text-6xl leading-tight text-white px-4"
          >
            ________________________________________
          </p>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 fade-in-trigger opacity-0">
          <div className="h-px w-8 sm:w-12 bg-[#00ff41]"></div>
          <p className="font-mono text-xs sm:text-sm text-[#00ff41] cursor-help group" id="quote-author">
            Morpheus &gt; <span className="text-white">EOS_0x45</span>
          </p>
          <div className="h-px w-8 sm:w-12 bg-[#00ff41]"></div>
        </div>
      </div>
    </section>
  );
}