import { useEffect, useRef, useState } from 'react';

interface FooterProps {
  onSwitchView: (view: 'home' | 'experiments') => void;
  isAuthenticated: boolean;
}

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

export default function Footer({ onSwitchView, isAuthenticated }: FooterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const footerGlitchRef = useRef<HTMLHeadingElement>(null);
  const [uptime, setUptime] = useState('00:00:00:00');
  const [consoleOutput, setConsoleOutput] = useState('> AWAITING_INPUT_');
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Matrix rain
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const footer = canvas.parentElement;
    if (!footer) return;

    let w = canvas.width = footer.offsetWidth;
    let h = canvas.height = footer.offsetHeight;
    let columns = Math.floor(w / 20);
    let drops: number[] = [];

    const initMatrix = () => {
      w = canvas.width = footer.offsetWidth;
      h = canvas.height = footer.offsetHeight;
      columns = Math.floor(w / 20);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
    };

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#00ff41';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    initMatrix();
    window.addEventListener('resize', initMatrix);
    const matrixInterval = setInterval(drawMatrix, 50);

    // Uptime counter
    const uptimeInterval = setInterval(() => {
      const diff = Date.now() - startTimeRef.current;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      const ms = Math.floor((diff % 1000) / 10).toString().padStart(2, '0');
      setUptime(`${hours}:${minutes}:${seconds}:${ms}`);
    }, 50);

    // Footer glitch effect
    if (footerGlitchRef.current) {
      const footerFx = new TextScramble(footerGlitchRef.current);
      const originalText = "LOST";
      const hoverText = "FOUND?";
      
      const container = footerGlitchRef.current.parentElement;
      if (container) {
        container.addEventListener('mouseenter', () => footerFx.setText(hoverText));
        container.addEventListener('mouseleave', () => footerFx.setText(originalText));
      }
    }

    return () => {
      window.removeEventListener('resize', initMatrix);
      clearInterval(matrixInterval);
      clearInterval(uptimeInterval);
    };
  }, []);

  const handleFileSystemClick = (action: string) => {
    switch (action) {
      case 'scroll-top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'navigate-experiments':
        if (isAuthenticated) {
          onSwitchView('experiments');
        } else {
          setConsoleOutput("> ERR: ENCRYPTION_ACTIVE");
          setTimeout(() => setConsoleOutput("> AWAITING_INPUT_"), 2000);
          document.getElementById('grid-section')?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'modal-login':
        setConsoleOutput("> ACCESS_DENIED: ERR_403");
        setTimeout(() => setConsoleOutput("> AWAITING_INPUT_"), 2000);
        break;
    }
  };

  return (
    <footer className="min-h-screen flex flex-col bg-black border-t-4 border-[#00ff41] relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"></canvas>

      <div className="relative z-10 flex flex-col flex-grow justify-between p-4 sm:p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8">
          {/* Technical Status Box */}
          <div className="font-mono text-[10px] sm:text-xs text-[#00ff41] border-l-2 border-[#00ff41] pl-3 sm:pl-4 opacity-80 w-full md:w-auto">
            <div>&gt; SYSTEM_CHECK: <span className="text-white">COMPLETE</span></div>
            <div>&gt; CORE_TEMP: <span className="text-white">CRITICAL</span></div>
            <div>&gt; UPTIME: <span>{uptime}</span></div>
            <div className="mt-2 text-gray-500">/// END_OF_LINE ///</div>
          </div>

          {/* Directory Navigation */}
          <div className="text-left md:text-right font-mono text-[10px] sm:text-xs w-full md:w-auto">
            <h4 className="text-[#00ff41] mb-3 sm:mb-4 tracking-widest border-b border-[#00ff41]/30 pb-2 inline-block">[ FILE_SYSTEM ]</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li 
                className="group cursor-pointer flex justify-start md:justify-end gap-2 sm:gap-4 items-center select-none"
                onClick={() => handleFileSystemClick('scroll-top')}
                onMouseEnter={() => setConsoleOutput("> TARGET: SYSTEM_ROOT_")}
                onMouseLeave={() => setConsoleOutput("> AWAITING_INPUT_")}
              >
                <span className="text-gray-700 group-hover:text-[#00ff41] transition-colors font-mono text-[9px] sm:text-[10px]">drwxr-x---</span>
                <span className="text-gray-600 text-[9px] sm:text-[10px]">4kb</span>
                <span className="text-white group-hover:text-[#00ff41] group-hover:translate-x-[-2px] md:group-hover:translate-x-[-4px] transition-all">./root_home</span>
              </li>
              <li 
                className="group cursor-pointer flex justify-start md:justify-end gap-2 sm:gap-4 items-center select-none"
                onClick={() => handleFileSystemClick('navigate-experiments')}
                onMouseEnter={() => setConsoleOutput(isAuthenticated ? "> TARGET: LAB [UNLOCKED]_" : "> ERR: ENCRYPTED_")}
                onMouseLeave={() => setConsoleOutput("> AWAITING_INPUT_")}
              >
                <span className="text-gray-700 group-hover:text-[#00ff41] transition-colors font-mono text-[9px] sm:text-[10px]">drwxr-xr-x</span>
                <span className="text-gray-600 text-[9px] sm:text-[10px]">128mb</span>
                <span className={`${isAuthenticated ? 'text-[#00ff41]' : 'text-gray-500'} group-hover:text-red-500 group-hover:translate-x-[-2px] md:group-hover:translate-x-[-4px] transition-all text-xs sm:text-sm break-all`}>
                  ./experiments {isAuthenticated ? '[OPEN]' : '[LOCKED]'}
                </span>
              </li>
              <li 
                className="group cursor-pointer flex justify-start md:justify-end gap-2 sm:gap-4 items-center select-none"
                onClick={() => handleFileSystemClick('modal-login')}
                onMouseEnter={() => setConsoleOutput("> WARN: RESTRICTED_AREA_")}
                onMouseLeave={() => setConsoleOutput("> AWAITING_INPUT_")}
              >
                <span className="text-gray-700 group-hover:text-red-500 transition-colors font-mono text-[9px] sm:text-[10px]">-rwx------</span>
                <span className="text-gray-600 text-[9px] sm:text-[10px] group-hover:text-[#00ff41] transition-colors">2kb</span>
                <span className="text-white group-hover:text-red-500 group-hover:translate-x-[-2px] md:group-hover:translate-x-[-4px] transition-all">./auth_login.sh</span>
              </li>
            </ul>
            <div className="mt-3 sm:mt-4 text-[#00ff41] opacity-70 h-6 min-w-full md:min-w-[200px] text-left md:text-right border-t border-[#00ff41]/20 pt-2 text-[10px] sm:text-xs truncate">
              {consoleOutput}<span className="animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Center Big Text */}
        <div className="my-12 sm:my-16 md:my-20 relative group cursor-default">
          <h1 className="font-syne font-black text-[15vw] sm:text-[14vw] md:text-[12vw] leading-[0.8] text-transparent stroke-text select-none transition-colors duration-500" style={{WebkitTextStroke: '2px rgba(255,255,255,0.2)'}}>
            SIGNAL
          </h1>
          <h1 ref={footerGlitchRef} className="footer-glitch-target font-syne font-black text-[15vw] sm:text-[14vw] md:text-[12vw] leading-[0.8] text-white select-none relative">
            LOST
            <span className="absolute -bottom-2 sm:-bottom-4 left-1 sm:left-2 text-[10px] sm:text-xs md:text-sm font-mono text-[#00ff41] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              /// ATTEMPTING_RECONNECT
            </span>
          </h1>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 border-t border-[#00ff41]/30 pt-6 sm:pt-8">
          <div className="font-mono text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">
            <span className="text-[#00ff41]">SEC_LEVEL:</span> 0 <br />
            <span className="text-[#00ff41]">ENCRYPTION:</span> NONE <br />
            © 2025 THE MATRIX PROJECT
          </div>
          <div className="font-mono text-lg sm:text-xl md:text-2xl text-white hover:text-[#00ff41] transition-colors cursor-pointer group flex flex-col items-start sm:items-end">
            <span className="text-[9px] sm:text-[10px] text-gray-600 mb-1 group-hover:text-[#00ff41]">EXECUTE_REBOOT.EXE</span>
            <div className="flex items-center gap-2">
               INITIALIZE <span className="group-hover:-translate-y-1 transition-transform">_</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#00ff41] text-black font-mono text-[10px] sm:text-xs py-1 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
           :: 0xF44 SYSTEM HALTED :: 0x000 NULL POINTER :: 0x50 MEMORY DUMP :: 0xDEADBEEF FATAL ERROR :: 0xF44 SYSTEM HALTED :: 0x000 NULL POINTER :: 0x50 MEMORY DUMP :: 0xDEADBEEF FATAL ERROR ::
        </div>
      </div>
    </footer>
  );
}