import React, { useState } from 'react';
import NeuralScraper from './NeuralScraper';
import RuntimeMonitor from './RuntimeMonitor';

export default function ExperimentsPreview() {
    const [activeTab, setActiveTab] = useState<'source' | 'code'>('source');

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-mono">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-2xl md:text-4xl font-syne font-black text-[#00ff41] mb-2">
                    INTERACTIVE_PIECES_PREVIEW
                </h1>
                <p className="text-xs text-gray-500">
                    Standalone prototypes for SOURCE and CODE sections.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('source')}
                    className={`px-6 py-2 border transition-all ${activeTab === 'source'
                        ? 'bg-[#00ff41] text-black border-[#00ff41]'
                        : 'border-[#00ff41]/30 text-[#00ff41]/50 hover:border-[#00ff41] hover:text-[#00ff41]'
                        }`}
                >
                    [ 01 ] SOURCE_ANALOG
                </button>
                <button
                    onClick={() => setActiveTab('code')}
                    className={`px-6 py-2 border transition-all ${activeTab === 'code'
                        ? 'bg-[#00ff41] text-black border-[#00ff41]'
                        : 'border-[#00ff41]/30 text-[#00ff41]/50 hover:border-[#00ff41] hover:text-[#00ff41]'
                        }`}
                >
                    [ 02 ] CODE_DIGITAL
                </button>
            </div>

            {/* Preview Container */}
            <div className="max-w-6xl mx-auto border border-[#00ff41]/20 bg-black min-h-[700px] h-[800px] relative overflow-hidden shadow-[0_0_50px_rgba(0,255,65,0.05)]">
                {activeTab === 'source' ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="p-4 border-b border-[#00ff41]/10 flex justify-between items-center text-[10px] text-gray-500">
                            <span>COMPONENT: NEURAL_SCRAPER.tsx</span>
                            <span>VALUE: RAW_NEURAL_INTENT</span>
                        </div>
                        <div className="flex-grow">
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
                        <div className="flex-grow">
                            <RuntimeMonitor />
                        </div>
                        <div className="p-4 border-t border-[#00ff41]/10 text-[10px] text-[#00ff41]/50 italic">
                            Visualizing technical value: Scrolling logs and logical inspection layer.
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Clue */}
            <div className="mt-10 text-center text-[10px] text-gray-600">
                {">"} Press [ ESC ] to return to main view (Not implemented in stand-alone)<br />
                {">"} STATUS: AWAITING_FEEDBACK...
            </div>
        </div>
    );
}
