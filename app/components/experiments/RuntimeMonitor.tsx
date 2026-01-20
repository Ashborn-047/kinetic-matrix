import React, { useState, useEffect, useRef } from 'react';

type MonitorPhase = 'uplink_auth' | 'core_sync' | 'boot_sequence' | 'hex_waterfall' | 'collapse';

export default function RuntimeMonitor() {
    const [phase, setPhase] = useState<MonitorPhase>('uplink_auth');
    const [authHashes, setAuthHashes] = useState<string[]>([]);
    const [syncProgress, setSyncProgress] = useState(0);
    const [bootLogs, setBootLogs] = useState<string[]>([]);
    const [hexRows, setHexRows] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Phase Transitions Logic
    useEffect(() => {
        if (phase === 'uplink_auth') {
            let count = 0;
            const interval = setInterval(() => {
                const hash = Array.from({ length: 40 }).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
                setAuthHashes(prev => [hash, ...prev].slice(0, 10));
                count++;
                if (count > 20) {
                    clearInterval(interval);
                    setTimeout(() => setPhase('core_sync'), 800);
                }
            }, 60);
            return () => clearInterval(interval);
        }

        if (phase === 'core_sync') {
            const interval = setInterval(() => {
                setSyncProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setPhase('boot_sequence'), 600);
                        return 100;
                    }
                    return prev + 5;
                });
            }, 100);
            return () => clearInterval(interval);
        }

        if (phase === 'boot_sequence') {
            const logs = [
                "ALLOCATING_NEURAL_SLOTS... [DONE]",
                "VERIFYING_COGNITIVE_INTEGRITY... [OK]",
                "CONNECTING_TO_CORE_DUMP_0x4B... [ESTABLISHED]",
                "MAPPING_REALITY_VECTORS... [98%]",
                "KERNEL_INITIALIZED_AT_0x00F3A2",
                "READY_FOR_DATA_FLUX"
            ];
            let i = 0;
            const interval = setInterval(() => {
                if (i < logs.length) {
                    setBootLogs(prev => [...prev, logs[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => setPhase('hex_waterfall'), 1000);
                }
            }, 300);
            return () => clearInterval(interval);
        }
    }, [phase]);

    // Hex Waterfall Logic
    useEffect(() => {
        if (phase === 'hex_waterfall') {
            const interval = setInterval(() => {
                const newRow = {
                    addr: '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0'),
                    blockA: Array.from({ length: 4 }).map(() => Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')).join(' '),
                    blockB: Array.from({ length: 4 }).map(() => Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')).join(' '),
                    ascii: Math.random() > 0.8 ? 'DECRYPTING...' : Array.from({ length: 8 }).map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join('')
                };
                setHexRows(prev => [newRow, ...prev].slice(0, 25));
            }, 80);
            return () => clearInterval(interval);
        }
    }, [phase]);

    return (
        <div className="relative w-full h-full bg-black text-[#00ff41] font-mono p-8 overflow-hidden flex flex-col border border-white/5 select-none">

            {/* Phase 0: Uplink Auth */}
            {phase === 'uplink_auth' && (
                <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="text-white text-xs mb-8 tracking-[0.4em] font-black animate-pulse">UPLINK_AUTHORIZATION_REQUIRED</div>
                    <div className="w-full max-w-lg bg-white/5 border border-white/10 p-4">
                        <div className="text-[10px] text-[#00ff41]/50 mb-2">VERIFYING_CREDENTIAL_HASHES:</div>
                        {authHashes.map((h, i) => (
                            <div key={i} className="text-[9px] truncate opacity-80 mb-1 font-bold">
                                {">"} {h}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Phase 1: Core Sync */}
            {phase === 'core_sync' && (
                <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="text-white text-xs mb-4 tracking-[0.2em]">SYNCHRONIZING_REALITY_NODES</div>
                    <div className="w-64 h-2 bg-white/5 border border-[#00ff41]/20 overflow-hidden relative">
                        <div
                            className="h-full bg-[#00ff41] transition-all duration-300"
                            style={{ width: `${syncProgress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black mix-blend-difference">
                            {syncProgress}%
                        </div>
                    </div>
                    <div className="mt-4 text-[9px] text-white/40 animate-pulse">Establishing_secure_connection_to_Matrix_Core...</div>
                </div>
            )}

            {/* Phase 2: Boot Sequence */}
            {phase === 'boot_sequence' && (
                <div className="flex-grow flex flex-col pt-12">
                    <div className="text-2xl font-black text-white mb-8 border-b border-[#00ff41]/30 pb-4 tracking-tighter shadow-[0_4px_10px_-5px_rgba(0,255,65,0.3)]">
                        SYSTEM_BOOT_<span className="text-[#00ff41] animate-pulse">v4.2</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {bootLogs.map((log, i) => (
                            <div key={i} className="text-xs flex gap-4 animate-in slide-in-from-left-2 duration-300">
                                <span className="text-[#00ff41]/40 whitespace-nowrap font-bold">{(i * 102).toString(16).toUpperCase().padStart(4, '0')}</span>
                                <span className="text-white/90 font-medium tracking-wide">{log}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Phase 3: Hex Waterfall */}
            {phase === 'hex_waterfall' && (
                <div className="flex-grow flex flex-col relative">
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                        <div className="flex gap-4 items-center">
                            <span className="w-2 h-2 bg-red-600 animate-pulse rounded-full"></span>
                            <span className="text-xs font-black text-white italic tracking-widest">LIVE_KERNEL_FLUX</span>
                        </div>
                        <div className="text-[10px] text-white/50 uppercase">Addr_Space: 0x00F3A2...0x00F4FF</div>
                    </div>

                    <div className="flex-1 overflow-hidden relative min-h-[150px] mb-4">
                        <div className="flex flex-col gap-1">
                            {hexRows.map((row, i) => (
                                <div
                                    key={i}
                                    className="flex gap-8 text-[11px] font-bold group/row hover:bg-white/5 cursor-pointer transition-colors py-0.5"
                                    onClick={() => Math.random() > 0.8 && setPhase('collapse')}
                                >
                                    <span className="text-white/30 font-mono w-16">{row.addr}</span>
                                    <span className="text-[#00ff41] w-24 tracking-widest">{row.blockA}</span>
                                    <span className="text-[#00ff41] w-24 tracking-widest">{row.blockB}</span>
                                    <span className={`flex-grow truncate ${row.ascii === 'DECRYPTING...' ? 'text-white italic animate-pulse' : 'text-white/40'}`}>
                                        {row.ascii}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Lens Vignette */}
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-between items-end pb-8">
                        <div className="flex flex-col gap-2 p-5 bg-[#00ff41]/5 border border-[#00ff41]/40 hover:border-[#00ff41] hover:bg-[#00ff41]/10 group/clue cursor-crosshair transition-all shadow-[0_0_20px_rgba(0,255,65,0.05)] ml-1"
                            onClick={() => setPhase('collapse')}
                        >
                            <div className="text-[10px] text-white/80 font-bold tracking-wider">ACTIVE_PTR_TARGET:</div>
                            <div className="text-2xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] group-hover/clue:text-[#00ff41] transition-colors">0x4B (K)</div>
                            <div className="text-[9px] font-bold text-[#00ff41]/60 animate-pulse tracking-tight uppercase">
                                [ CLICK_TO_INJECT_PAYLOAD ]
                            </div>
                        </div>
                        <div className="text-[9px] text-white/30 text-right uppercase tracking-[0.2em] leading-relaxed pr-2">
                            Packet_Sniffing_Mode: <span className="text-[#00ff41]">ACTIVE</span><br />
                            Runtime_Ver: <span className="text-white">CL_A4_99</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Phase: Collapse */}
            {phase === 'collapse' && (
                <div className="absolute inset-0 z-50 flex flex-col justify-center items-center overflow-hidden bg-red-950/20 backdrop-blur-sm">
                    {/* Chaos Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="absolute bg-white text-black p-4 border-l-8 border-red-600 shadow-2xl animate-[glitch-flicker_0.1s_infinite]"
                                style={{
                                    left: `${Math.random() * 60 + 20}%`,
                                    top: `${Math.random() * 60 + 20}%`,
                                    transform: `rotate(${(Math.random() - 0.5) * 15}deg)`,
                                    animationDelay: `${Math.random()}s`
                                }}
                            >
                                <div className="text-[10px] font-black mb-1">FATAL_ERROR</div>
                                <div className="text-xs font-mono">SEG_FAULT_AT_0x4B</div>
                            </div>
                        ))}
                    </div>

                    <div className="z-10 text-center">
                        <div className="text-7xl font-black text-white tracking-tighter mb-2 italic drop-shadow-[0_0_30px_red]">COLLAPSE</div>
                        <div className="text-xs text-red-500 font-bold mb-12 uppercase tracking-[0.5em]">System_Logic_Decompiled</div>
                        <button
                            onClick={() => setPhase('uplink_auth')}
                            className="bg-white text-black px-12 py-5 font-black text-sm border-0 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                        >
                            [ REBOOT_KERNEL_0x4B ]
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes glitch-flicker {
                    0% { opacity: 0.8; transform: translate(0, 0); }
                    50% { opacity: 1; transform: translate(-2px, 1px); }
                    100% { opacity: 0.9; transform: translate(1px, -1px); }
                }
            `}</style>

        </div>
    );
}
