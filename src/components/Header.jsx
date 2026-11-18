import React, { useState } from 'react';
import { 
  Cpu, 
  Cloud, 
  Wifi, 
  WifiOff, 
  Sparkles, 
  ShieldCheck, 
  Settings, 
  X, 
  Sliders, 
  Trash2, 
  Zap, 
  Layers
} from 'lucide-react';

export default function Header({ 
  onDeviceStatus = { available: false, status: 'checking' }, 
  isOnline = true, 
  routingMode = 'auto', 
  setRoutingMode = () => {}, 
  threshold = 1200,
  setThreshold,
  onClearHistory,
  historyCount = 0,
  isSimulatedOffline = false,
  setIsSimulatedOffline
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const isLocalReady = onDeviceStatus?.available;
  const effectivelyOffline = !isOnline || isSimulatedOffline;

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 pb-2 sm:px-6">
      {/* Floating Liquid Glass Navbar Container */}
      <div className="max-w-7xl mx-auto rounded-2xl bg-slate-950/65 backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.45)] relative overflow-hidden transition-all duration-300">
        
        {/* Subtle Iridescent Top Glow Border / Caustic Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 via-amber-400/50 via-purple-400/40 to-transparent pointer-events-none" />
        <div className="absolute -top-12 left-1/4 w-56 h-16 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -top-12 right-1/4 w-56 h-16 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="px-4 py-3 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Brand & Concept Identity */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-cyan-500 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-300"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 font-bold">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 drop-shadow-sm">
                    ScriptMatch Hybrid
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 backdrop-blur-sm shadow-[0_0_10px_rgba(245,158,11,0.15)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    #BuildHybridAI
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-light hidden sm:block">
                  Firebase AI Logic Hybrid Inference • Screenwriter Job Scoring & Pitch Outreach
                </p>
              </div>
            </div>

            {/* Quick Settings Icon button on mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
                title="Open Settings & Diagnostics"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Runtime Diagnostics & Controls Group */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 text-xs w-full lg:w-auto">
            
            {/* App Check Badge */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-emerald-500/30 text-slate-200 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.12)] hover:border-emerald-400/50 transition-all cursor-default"
              title="Firebase App Check debug attestation active"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="font-medium text-[11px]">
                App Check: <strong className="text-emerald-400 font-mono font-semibold">Active</strong>
              </span>
            </div>

            {/* On-Device Nano Status Badge */}
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all cursor-default ${
                isLocalReady
                  ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/70 border border-slate-700/60 text-slate-400'
              }`}
              title={`Local Chrome Gemini Nano: ${onDeviceStatus.status}`}
            >
              <span className="relative flex h-2 w-2">
                {isLocalReady ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </>
                ) : (
                  <span className="inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                )}
              </span>
              <Cpu size={13} className={isLocalReady ? "text-cyan-400" : "text-slate-400"} />
              <span className="font-medium text-[11px]">
                Nano: <strong className={isLocalReady ? "text-cyan-300 font-mono font-semibold" : "text-slate-400 font-mono"}>
                  {isLocalReady ? "Ready (Local)" : "Fallback Cloud"}
                </strong>
              </span>
            </div>

            {/* Network / Offline Status Badge */}
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                effectivelyOffline 
                  ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.25)]' 
                  : 'bg-slate-900/70 border border-emerald-500/30 text-emerald-300'
              }`}
              onClick={() => {
                if (setIsSimulatedOffline) {
                  setIsSimulatedOffline(!isSimulatedOffline);
                }
              }}
              title={setIsSimulatedOffline ? "Click to toggle simulated offline mode" : undefined}
            >
              <span className="relative flex h-2 w-2">
                {effectivelyOffline ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </>
                ) : (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                )}
              </span>
              {effectivelyOffline ? (
                <>
                  <WifiOff size={13} className="text-rose-400" />
                  <span className="font-semibold text-[11px] text-rose-300">
                    {isSimulatedOffline ? "Simulated Offline" : "Offline Mode"}
                  </span>
                </>
              ) : (
                <>
                  <Wifi size={13} className="text-emerald-400" />
                  <span className="font-medium text-[11px] text-emerald-300">Online</span>
                </>
              )}
            </div>

            {/* Liquid Glass Pill Toggle for Routing Modes */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
              <button
                onClick={() => setRoutingMode('auto')}
                className={`relative px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  routingMode === 'auto' 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_0_14px_rgba(245,158,11,0.5)]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Auto-route based on character count threshold"
              >
                <Zap size={11} className={routingMode === 'auto' ? "text-slate-950" : "text-amber-400/80"} />
                Auto
              </button>

              <button
                onClick={() => setRoutingMode('force-on-device')}
                className={`relative px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  routingMode === 'force-on-device' 
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-[0_0_14px_rgba(6,182,212,0.5)]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Force On-Device Chrome Nano inference"
              >
                <Cpu size={11} className={routingMode === 'force-on-device' ? "text-slate-950" : "text-cyan-400/80"} />
                On-Device
              </button>

              <button
                onClick={() => setRoutingMode('force-cloud')}
                className={`relative px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  routingMode === 'force-cloud' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-[0_0_14px_rgba(139,92,246,0.5)]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Force Cloud Gemini 2.5 Flash inference"
              >
                <Cloud size={11} className={routingMode === 'force-cloud' ? "text-white" : "text-purple-400/80"} />
                Cloud
              </button>
            </div>

            {/* Desktop Settings / Diagnostics Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white transition-all backdrop-blur-md shadow-sm"
              title="Settings & Hybrid Engine Diagnostics"
            >
              <Settings size={13} className="text-amber-400" />
              <span className="text-[11px] font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Translucent Frosted Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          {/* Modal Container */}
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900/90 border border-white/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-slate-100 overflow-hidden">
            
            {/* Iridescent Accent Lights */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold font-cinzel text-amber-300">
                    Hybrid Engine Diagnostics & Settings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure routing parameters, privacy thresholds & test offline mode
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Sections */}
            <div className="space-y-5 text-xs">
              
              {/* Routing Threshold Slider */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-400" />
                    Auto-Hybrid Prompt Threshold
                  </span>
                  <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {threshold} chars
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Jobs with text length under this threshold execute on-device in Chrome Nano for privacy and 0 ms network delay. Larger jobs stream to Cloud Gemini 2.5 Flash.
                </p>
                {setThreshold && (
                  <div className="pt-2">
                    <input
                      type="range"
                      min="400"
                      max="3000"
                      step="100"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>400 chars (Aggressive Cloud)</span>
                      <span>1,200 (Default)</span>
                      <span>3,000 chars (Max On-Device)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulated Airplane Mode Switch */}
              {setIsSimulatedOffline && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <WifiOff size={14} className="text-rose-400" />
                      Simulate Airplane / Offline Mode
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Disconnect cloud pipeline to verify offline zero-latency execution on Gemini Nano.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isSimulatedOffline ? 'bg-rose-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isSimulatedOffline ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* System Telemetry Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400">App Check Attestation</span>
                  <div className="text-emerald-400 font-medium font-mono flex items-center gap-1">
                    <ShieldCheck size={12} />
                    Verified (Debug Token)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Local AI Engine</span>
                  <div className="text-cyan-400 font-medium font-mono flex items-center gap-1">
                    <Cpu size={12} />
                    {isLocalReady ? 'Chrome Nano Ready' : 'Simulated / Cloud'}
                  </div>
                </div>
              </div>

              {/* Clear History Action */}
              {(onClearHistory || historyCount > 0) && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-slate-400 text-[11px]">
                    Saved Local Analyses: <strong className="text-slate-200 font-mono">{historyCount}</strong>
                  </div>
                  {onClearHistory && (
                    <div>
                      {showClearConfirm ? (
                        <div className="flex items-center gap-2">
                          <span className="text-rose-400 text-[11px]">Are you sure?</span>
                          <button
                            onClick={() => {
                              onClearHistory();
                              setShowClearConfirm(false);
                            }}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px]"
                          >
                            Yes, Clear
                          </button>
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowClearConfirm(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 hover:text-white transition-colors"
                        >
                          <Trash2 size={12} />
                          <span>Clear Local History</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="btn-primary text-xs px-4 py-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
