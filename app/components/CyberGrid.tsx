import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CyberGridProps {
  onAuthenticate: () => void;
}

export default function CyberGrid({ onAuthenticate }: CyberGridProps) {
  const [isGridActive, setIsGridActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('SECURE CONNECTION ESTABLISHED');
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [gridInterval, setGridInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Initialize grid
    if (gridContainerRef.current && gridContainerRef.current.children.length === 0) {
      const chars = "0101XYZA";
      const gridCount = 24; // 4 cols * 6 rows

      for (let i = 0; i < gridCount; i++) {
        const charDiv = document.createElement('div');
        charDiv.className = 'h-14 md:h-20 flex items-center justify-center font-mono text-xl md:text-3xl border border-[#00ff41]/20 text-[#00ff41]/50 bg-black transition-colors duration-100 cursor-crosshair select-none';
        charDiv.innerText = Math.round(Math.random()).toString();
        gridContainerRef.current.appendChild(charDiv);
      }
    }

    // Start grid noise
    startGridNoise(false);

    // CPU stat clue animation
    const cpuInterval = setInterval(() => {
      const cpu = document.getElementById('cpu-stat');
      if (cpu && Math.random() > 0.85) {
        cpu.innerHTML = `CORE: 0x55`;
        cpu.classList.add('text-white');
        setTimeout(() => {
          cpu.innerHTML = "CPU: 98%";
          cpu.classList.remove('text-white');
        }, 500);
      }
    }, 3000);

    return () => {
      if (gridInterval) clearInterval(gridInterval);
      clearInterval(cpuInterval);
    };
  }, []);

  const startGridNoise = (preserveInput: boolean) => {
    if (gridInterval) clearInterval(gridInterval);

    const interval = setInterval(() => {
      const cells = gridContainerRef.current?.children;
      if (!cells) return;

      const chars = "0101XYZA";

      // Randomly update a few cells
      for (let k = 0; k < 5; k++) {
        const idx = Math.floor(Math.random() * cells.length);

        // If in input mode, DO NOT touch the first 6 indices
        if (preserveInput && idx < 6) continue;

        const cell = cells[idx] as HTMLElement;
        if (Math.random() > 0.5) {
          cell.innerText = chars[Math.floor(Math.random() * chars.length)];
          cell.style.opacity = '1';
          setTimeout(() => cell.style.opacity = '0.5', 200);
        }
      }
    }, 100);

    setGridInterval(interval);
  };

  const renderGridInput = (text: string) => {
    const cells = gridContainerRef.current?.children;
    if (!cells) return;

    // Only update the first row (indices 0-5)
    for (let i = 0; i < 6; i++) {
      const cell = cells[i] as HTMLElement;
      if (i < text.length) {
        cell.innerText = text[i];
        cell.style.color = "#00ff41";
        cell.style.borderColor = "#00ff41";
        cell.style.boxShadow = "0 0 10px rgba(0,255,65,0.3)";
      } else if (i === text.length) {
        cell.innerText = "_"; // Cursor
        cell.style.color = "#00ff41";
        cell.style.borderColor = "#333";
        cell.style.boxShadow = "none";
      } else {
        cell.innerText = "";
        cell.style.color = "#333";
        cell.style.borderColor = "#222";
        cell.style.boxShadow = "none";
      }
      cell.style.backgroundColor = "transparent";
    }
  };

  const handleGridActivatorClick = () => {
    setIsGridActive(!isGridActive);

    if (!isGridActive) {
      gridWrapperRef.current?.classList.add('grid-active');
      hiddenInputRef.current?.focus();
      setStatusMessage("> INPUT_MODE: TYPE HEX(57) OR PASS");
      if (gridInterval) clearInterval(gridInterval);
      renderGridInput("");
      startGridNoise(true);
    } else {
      gridWrapperRef.current?.classList.remove('grid-active');
      hiddenInputRef.current?.blur();
      setStatusMessage("SECURE CONNECTION ESTABLISHED");
      startGridNoise(false);
    }
  };

  const handleWrapperClick = () => {
    if (isGridActive) {
      hiddenInputRef.current?.focus();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isGridActive) return;

    const val = e.currentTarget.value.trim().toUpperCase();
    renderGridInput(val);

    if (e.key === 'Enter') {
      if (val === "WAKEUP") {
        // SUCCESS
        setStatusMessage("> ACCESS GRANTED. UNLOCKING...");
        const cells = gridContainerRef.current?.children;
        if (cells) {
          Array.from(cells).forEach((cell, i) => {
            gsap.to(cell, {
              backgroundColor: '#00ff41',
              color: '#000',
              scale: 0,
              duration: 0.5,
              delay: i * 0.01,
              onComplete: () => {
                if (i === cells.length - 1) {
                  onAuthenticate();
                }
              }
            });
          });
        }
      } else {
        // Try Hex Decode
        const hexVal = val.replace("0X", "");
        const charCode = parseInt(hexVal, 16);

        if (!isNaN(charCode) && charCode >= 32 && charCode <= 126) {
          const char = String.fromCharCode(charCode);
          setStatusMessage(`> DECODED: '${char}'`);

          // Animate grid to show the character
          const cells = gridContainerRef.current?.children;
          if (cells) {
            // Flash first row
            for (let i = 0; i < 6; i++) {
              const cell = cells[i] as HTMLElement;
              gsap.to(cell, {
                scale: 1.2,
                backgroundColor: '#00ff41',
                color: '#000',
                duration: 0.2,
                onComplete: () => {
                  cell.innerText = char;
                  gsap.to(cell, { scale: 1, backgroundColor: '#111', color: '#333', duration: 0.5, delay: 0.5 });
                }
              });
            }
          }
          setInputValue(""); // Reset for next input
          if (hiddenInputRef.current) hiddenInputRef.current.value = "";
        } else {
          // Error Shake
          setStatusMessage("> ERR: UNKNOWN COMMAND");
          if (gridWrapperRef.current) {
            gsap.to(gridWrapperRef.current, { x: 5, duration: 0.1, yoyo: true, repeat: 5 });
          }
        }
      }
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 relative" id="grid-section">
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        maxLength={6}
        autoComplete="off"
        onKeyUp={handleKeyUp}
      />

      <div
        ref={gridWrapperRef}
        className="relative p-4 sm:p-6 md:p-8 border border-[#00ff41]/30 bg-[#00ff41]/5 backdrop-blur-sm w-full max-w-7xl mx-auto transition-all duration-300"
        onClick={handleWrapperClick}
      >
        <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-[#00ff41]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-[#00ff41]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-[#00ff41]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-[#00ff41]"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 pb-2 border-b border-[#00ff41]/20">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleGridActivatorClick}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00ff41] animate-pulse"></div>
            <h3 className="font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-[#00ff41] group-hover:text-white transition-colors">
              System_Encryption_Layer <span className="text-[9px] sm:text-[10px] opacity-70 group-hover:opacity-100 block sm:inline">[ CLICK_TO_INPUT ]</span>
            </h3>
          </div>
          <div className="font-mono text-[10px] sm:text-xs text-[#00ff41]" id="cpu-stat">CPU: 98%</div>
        </div>

        <div
          ref={gridContainerRef}
          className="grid grid-cols-4 gap-1.5 sm:gap-2 relative z-10 filter max-w-sm sm:max-w-md mx-auto"
        ></div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-2 border-t border-[#00ff41]/20">
          <div className={`font-mono text-[10px] sm:text-xs ${statusMessage.includes('DECODED') || statusMessage.includes('GRANTED') ? 'text-[#00ff41]' : 'text-gray-500'} break-words max-w-full sm:max-w-[60%]`}>
            {statusMessage}
          </div>
          <div className="w-24 sm:w-32 h-1 bg-[#111] overflow-hidden">
            <div className="h-full bg-[#00ff41] animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </section>
  );
}