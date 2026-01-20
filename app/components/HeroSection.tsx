import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Matrix Rain Character Column Component
function MatrixColumn({ delay, speed, left }: { delay: number; speed: number; left: string }) {
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789";
  const [column, setColumn] = useState<string[]>([]);

  useEffect(() => {
    const generateColumn = () => {
      const newColumn = [];
      const length = Math.floor(Math.random() * 12) + 8;
      for (let i = 0; i < length; i++) {
        newColumn.push(chars[Math.floor(Math.random() * chars.length)]);
      }
      setColumn(newColumn);
    };

    generateColumn();
    const interval = setInterval(generateColumn, speed * 1000);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div
      className="absolute top-0 text-[#00ff41] font-mono text-xs opacity-20 pointer-events-none select-none"
      style={{
        left,
        animation: `matrixFall ${speed}s linear ${delay}s infinite`,
        textShadow: '0 0 8px #00ff41'
      }}
    >
      {column.map((char, i) => (
        <div
          key={i}
          className="leading-tight"
          style={{ opacity: i === 0 ? 1 : 1 - (i * 0.08) }}
        >
          {char}
        </div>
      ))}
    </div>
  );
}

class TextScramble {
  el: HTMLElement;
  chars: string;
  resolve?: () => void;
  queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>;
  frameRequest?: number;
  frame: number;
  currentText: string;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
    this.queue = [];
    this.frame = 0;
    this.currentText = el.textContent || '';
  }

  setText(newText: string) {
    const oldText = this.currentText;
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
      // Store the final text (without HTML)
      this.currentText = this.el.textContent || '';
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

export default function HeroSection() {
  const digitalRef = useRef<HTMLSpanElement>(null);
  const realityRef = useRef<HTMLSpanElement>(null);
  const digitalFxRef = useRef<TextScramble | null>(null);
  const realityFxRef = useRef<TextScramble | null>(null);

  // Matrix rain columns - subtle background effect
  const matrixColumns = Array.from({ length: 15 }, (_, i) => ({
    delay: Math.random() * 5,
    speed: 6 + Math.random() * 8,
    left: `${(i / 15) * 100}%`
  }));

  useEffect(() => {
    if (digitalRef.current) {
      digitalFxRef.current = new TextScramble(digitalRef.current);
      setTimeout(() => digitalFxRef.current?.setText('DIGITAL'), 500);
    }
    if (realityRef.current) {
      realityFxRef.current = new TextScramble(realityRef.current);
      setTimeout(() => realityFxRef.current?.setText('REALITY'), 500);
    }

    // Hero cursor clue animation
    const heroCursor = document.getElementById('hero-cursor');
    const interval = setInterval(() => {
      if (heroCursor && Math.random() > 0.8) {
        heroCursor.innerHTML = "0x57";
        heroCursor.classList.add("text-white");
        setTimeout(() => {
          heroCursor.innerHTML = ">";
          heroCursor.classList.remove("text-white");
        }, 300);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Hover handlers to re-trigger scramble animation
  const handleDigitalHover = () => {
    digitalFxRef.current?.setText('DIGITAL');
  };

  const handleRealityHover = () => {
    realityFxRef.current?.setText('REALITY');
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-4 overflow-hidden bg-[#050505]" id="hero">
      {/* Matrix Rain Background - Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <style>{`
          @keyframes matrixFall {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
        `}</style>
        {matrixColumns.map((col, i) => (
          <MatrixColumn key={i} {...col} />
        ))}
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Large background text */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10 md:opacity-20 pointer-events-none">
        <h1 className="font-syne text-[40vw] sm:text-[35vw] md:text-[30vw] font-bold leading-none text-transparent stroke-text blur-sm">CODE</h1>
      </div>

      {/* Main hero content */}
      <div className="z-10 text-center mix-blend-lighten px-4">
        <div className="overflow-hidden mb-2">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-9xl italic font-black leading-[0.9] tracking-tighter text-white">
            <span
              ref={digitalRef}
              className="inline-block cursor-pointer"
              onMouseEnter={handleDigitalHover}
            >
              0101011
            </span>
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="font-syne text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold uppercase leading-[0.9] tracking-tight text-[#00ff41] text-glow morph-weight">
            <span
              ref={realityRef}
              className="inline-block cursor-pointer"
              onMouseEnter={handleRealityHover}
            >
              0101010
            </span>
          </h1>
        </div>
        <div className="mt-8 md:mt-12 overflow-hidden relative group">
          <div className="absolute left-0 top-0 w-1 h-full bg-[#00ff41] animate-pulse"></div>
          <p className="hero-subtitle font-mono text-xs sm:text-sm md:text-base text-gray-400 max-w-md mx-auto pl-4 sm:pl-6 text-left">
            <span className="text-[#00ff41] inline-block w-3 sm:w-4 transition-all" id="hero-cursor">&gt;</span> Enter the void where design meets code. <br />
            <span className="text-[#00ff41]">&gt;</span> System status: <span className="text-white">ONLINE</span>
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#00ff41]/40 font-mono text-[10px]">
        <span>SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#00ff41]/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}