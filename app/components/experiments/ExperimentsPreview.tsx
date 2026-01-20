import React, { useState, useEffect } from 'react';
import NeuralScraper from './NeuralScraper';
import RuntimeMonitor from './RuntimeMonitor';

interface ExperimentsPreviewProps {
    activeTab: 'source' | 'code';
    onTabChange: (tab: 'source' | 'code') => void;
    onExit: () => void;
    standalone?: boolean;
}

export default function ExperimentsPreview({ activeTab, onTabChange, onExit, standalone = false }: ExperimentsPreviewProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onExit();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onExit]);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-mono">
            {/* Header */}
            {!standalone && (
                <div className="mb-10 text-center">
                    <h1 className="text-2xl md:text-4xl font-syne font-black text-[#00ff41] mb-2">
                        INTERACTIVE_PIECES_PREVIEW
                    </h1>
                    <p className="text-xs text-gray-500">
                        Standalone prototypes for SOURCE and CODE sections.
                    </p>
                </div>
            )}

            {/* Tabs */}
            {!standalone && (
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => onTabChange('source')}
                        className={`px-6 py-2 border transition-all ${activeTab === 'source'
                            ? 'bg-[#00ff41] text-black border-[#00ff41]'
                            : 'border-[#00ff41]/30 text-[#00ff41]/50 hover:border-[#00ff41] hover:text-[#00ff41]'
                            }`}
                    >
                        [ 01 ] SOURCE_ANALOG
                    </button>
                    <button
                        onClick={() => onTabChange('code')}
                        className={`px-6 py-2 border transition-all ${activeTab === 'code'
                            ? 'bg-[#00ff41] text-black border-[#00ff41]'
                            : 'border-[#00ff41]/30 text-[#00ff41]/50 hover:border-[#00ff41] hover:text-[#00ff41]'
                            }`}
                    >
                        [ 02 ] CODE_DIGITAL
                    </button>
                </div>
            )}

            {/* Preview Container */}
            <div className={`max-w-6xl mx-auto border border-[#00ff41]/20 bg-black ${standalone ? 'min-h-[600px]' : 'min-h-[800px]'} h-auto relative overflow-auto shadow-[0_0_50px_rgba(0,255,65,0.05)]`}>
                {activeTab === 'source' ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="p-4 border-b border-[#00ff41]/10 flex justify-between items-center text-[10px] text-gray-500">
                            <span>COMPONENT: NEURAL_SCRAPER.tsx</span>
                            <span>VALUE: RAW_NEURAL_INTENT</span>
                        </div>
                        <div className="flex-grow min-h-[500px]">
                            <NeuralScraper />
                        </div>
                        <div className="p-4 border-t border-[#00ff41]/10 text-[10px] text-[#00ff41]/50 italic">
                            Hover and move your mouse to "scrape" the analog noise and reveal intent fragments.
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col">
                        <div className="p-4 border-b border-[#00ff41]/10 flex justify-between items-center text-[10px] text-gray-500">
                            <span>COMPONENT: RUNTIME_MONITOR.tsx</span>
                            <span>VALUE: COMPILED_REALITY_LOGIC</span>
                        </div>
                        <div className="flex-grow min-h-[500px]">
                            <RuntimeMonitor />
                        </div>
                        <div className="p-4 border-t border-[#00ff41]/10 text-[10px] text-[#00ff41]/50 italic">
                            Visualizing technical value: Scrolling logs and logical inspection layer.
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Clue */}
            <div className="mt-10 flex flex-col items-center gap-4 relative z-50">
                <button
                    type="button"
                    onClick={() => {
                        console.log('RETURN_TO_SITE clicked');
                        onExit();
                    }}
                    className="group flex items-center gap-3 px-8 py-3 bg-[#00ff41]/5 border border-[#00ff41]/30 hover:bg-[#00ff41] hover:text-black transition-all duration-300 cursor-pointer z-50"
                >
                    <span className="font-mono text-xs font-bold tracking-widest">[ ESC ] RETURN_TO_SITE</span>
                    <div className="w-2 h-2 bg-[#00ff41] group-hover:bg-black rounded-full animate-pulse" />
                </button>
                <div className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter">
                    {">"} STATUS: SECURE_LINK_ACTIVE
                </div>
            </div>
        </div>
    );
}
