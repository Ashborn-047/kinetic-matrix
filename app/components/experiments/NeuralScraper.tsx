import React, { useRef, useEffect, useState } from 'react';

export default function NeuralScraper() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const container = containerRef.current;
        if (!canvas || !maskCanvas || !container) return;

        const ctx = canvas.getContext('2d');
        const mctx = maskCanvas.getContext('2d');
        if (!ctx || !mctx) return;

        let width = 0;
        let height = 0;

        const updateDimensions = () => {
            width = canvas.width = maskCanvas.width = container.offsetWidth;
            height = canvas.height = maskCanvas.height = container.offsetHeight;

            // Re-initialize mask with solid black on resize/init
            if (width > 0 && height > 0) {
                mctx.fillStyle = '#000';
                mctx.fillRect(0, 0, width, height);
            }
        };

        updateDimensions();

        // Initialize mask with solid black (fully obscured)
        mctx.fillStyle = '#000';
        mctx.fillRect(0, 0, width, height);

        const drawNoise = () => {
            if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
                return;
            }
            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;
            const time = Date.now() * 0.001;

            for (let i = 0; i < data.length; i += 4) {
                const y = (i / 4) / width;
                const scanline = Math.sin(y * 10 + time * 30) * 40;
                let val = (Math.random() * 255 + scanline);

                data[i] = 0;
                data[i + 1] = Math.max(0, Math.min(255, val));
                data[i + 2] = 0;
                data[i + 3] = 60 + Math.random() * 30;
            }
            ctx.putImageData(imageData, 0, 0);
        };

        let animationFrameId: number;
        const render = () => {
            if (width === 0 || height === 0) {
                updateDimensions();
            }
            drawNoise();
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            updateDimensions();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = maskCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // "Scour" away the mask (paint white/transparent in mix-blend mode context)
        // Here we use white because we use mix-blend-multiply on the layer.
        // Actually, white in mix-blend-multiply makes things transparent relative to the background overlay?
        // No, mix-blend-multiply: Black * Background = Black, White * Background = Background.
        // So black hides, white reveals. Perfect.

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, 45, 0, Math.PI * 2);
        ctx.fill();

        containerRef.current?.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current?.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[600px] bg-[#020a02] overflow-hidden group cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
        >
            {/* Underlying "Neural Intent" Layer - This is the target we are revealing */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[10px] font-mono text-[#00ff41]/40 mb-8 uppercase tracking-[1em] animate-pulse">
                    [ SIGNAL_RECONSTRUCTION_MODE ]
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/20">FRAGMENT_0x01</span>
                        <span className="text-sm font-bold text-[#00ff41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]">NEURAL_LINK</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/20">CLUE_PTR</span>
                        <span className="text-2xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">0x41 (A)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/20">SIGNAL_TYPE</span>
                        <span className="text-sm font-bold text-[#00ff41] italic">RAW_INTENT</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/20">ADDR:0x412</span>
                        <span className="text-xs font-mono text-white/50">packet_stable</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-[#00ff41]/20">ENCODING</span>
                        <span className="text-xs font-mono text-[#00ff41]/80">REALITY_PATCH_v4</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/20">STATUS</span>
                        <span className="text-xs font-mono text-white/90">RECONSTRUCTED</span>
                    </div>
                </div>

                <div className="mt-16 text-[9px] font-mono text-white/10 uppercase tracking-widest">
                    Searching_For_Source_Archetype_...
                </div>
            </div>

            {/* Signal Noise Overlay (CRT Static) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70"
            />

            {/* Persistent Masking Layer */}
            {/* We use mix-blend-multiply: 
                - Black (#000) pixels will multiply the background to black, hiding the data.
                - White (#fff) pixels will multiply the background by 1, revealing the data underneath.
            */}
            <canvas
                ref={maskCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply"
                style={{ filter: 'blur(25px) contrast(15)' }}
            />

            {/* Micro-grit/scanline texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="absolute bottom-6 left-6 font-mono text-[9px] text-[#00ff41]/80 p-3 border border-[#00ff41]/25 bg-black/90 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-red-600 animate-ping rounded-full"></span>
                    <span className="font-bold tracking-tighter text-white">SIGNAL_DEGRADED</span>
                </div>
                <div className="text-[8px] text-[#00ff41]/50 leading-tight">
                    {">"} Scour noisy sectors to reconstruct data fragments<br />
                    {">"} Persistent reconstruction enabled
                </div>
            </div>
        </div>
    );
}
