import React from 'react';
import { Cpu, Cloud, Wifi, WifiOff, Sparkles, ShieldCheck } from 'lucide-react';

export default function Header({ 
  onDeviceStatus, 
  isOnline, 
  routingMode, 
  setRoutingMode, 
  threshold 
}) {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Concept */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-cinzel tracking-wider text-amber-400">
                ScriptMatch Hybrid
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                #BuildHybridAI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Firebase AI Logic Hybrid Inference • Screenwriter Job Scoring & Pitch Outreach
            </p>
          </div>
        </div>

        {/* Runtime Diagnostics & Mode Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* App Check Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300" title="Firebase App Check enabled with debug token">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>App Check: <strong className="text-emerald-400 font-mono">Active</strong></span>
          </div>

          {/* On-Device Nano Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300" title={`Local Gemini Nano: ${onDeviceStatus.status}`}>
            <Cpu size={14} className={onDeviceStatus.available ? "text-cyan-400" : "text-slate-400"} />
            <span>Gemini Nano: <strong className={onDeviceStatus.available ? "text-cyan-400 font-mono" : "text-slate-400 font-mono"}>
              {onDeviceStatus.available ? "Ready (Local)" : "Fallback Cloud"}
            </strong></span>
          </div>

          {/* Network Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300">
            {isOnline ? (
              <>
                <Wifi size={14} className="text-emerald-400" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-rose-400" />
                <span className="text-rose-400 font-semibold">Airplane Mode</span>
              </>
            )}
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setRoutingMode('auto')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                routingMode === 'auto' 
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Auto-Hybrid
            </button>
            <button
              onClick={() => setRoutingMode('force-on-device')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                routingMode === 'force-on-device' 
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Force Local
            </button>
            <button
              onClick={() => setRoutingMode('force-cloud')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                routingMode === 'force-cloud' 
                  ? 'bg-purple-600 text-white font-semibold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Force Cloud
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
