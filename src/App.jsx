import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import JobInput from './components/JobInput';
import ResultCard from './components/ResultCard';
import HistoryView from './components/HistoryView';
import { 
  checkOnDeviceCapabilities, 
  analyzeScriptJob 
} from './ai/hybridCore';
import { 
  JOB_PRESETS, 
  WRITER_PROFILE_DEFAULT 
} from './ai/prompts';
import { 
  loadHistory, 
  saveAnalysisToHistory, 
  clearHistory, 
  loadSettings, 
  saveSettings 
} from './ai/storage';
import { Sparkles, Terminal, BookOpen, Layers, CheckCircle, AlertCircle, X, Shield, Cpu, Cloud } from 'lucide-react';

export default function App() {
  const [jobText, setJobText] = useState(JOB_PRESETS[0].text);
  const [writerProfile, setWriterProfile] = useState(WRITER_PROFILE_DEFAULT);
  const [routingMode, setRoutingMode] = useState('auto');
  const [threshold, setThreshold] = useState(1200);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [onDeviceStatus, setOnDeviceStatus] = useState({ available: false, status: 'checking' });
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial settings and history
    const saved = loadSettings();
    if (saved) {
      setRoutingMode(saved.mode || 'auto');
      setThreshold(saved.threshold || 1200);
    }
    setHistory(loadHistory());

    // Check Chrome Built-in AI capabilities
    checkOnDeviceCapabilities().then(setOnDeviceStatus);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await analyzeScriptJob(jobText, writerProfile, {
        mode: isSimulatedOffline ? 'force-on-device' : routingMode,
        threshold: threshold
      });

      setCurrentResult(result);
      const savedEntry = saveAnalysisToHistory(result);
      if (savedEntry) {
        setHistory(loadHistory());
      }
    } catch (err) {
      console.error('[ScriptMatch] Analysis failed:', err);
      setErrorMessage(err.message || 'Analysis could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      {/* Dynamic Animated Ambient Liquid Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Orb 1: Amber Gold Warm Sun Caustic */}
        <div 
          className="liquid-orb absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full opacity-40 blur-[100px] animate-pulse-subtle"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.08) 60%, transparent 80%)',
            animationDuration: '8s'
          }}
        />
        {/* Orb 2: Cyan Nano Iridescent Glow */}
        <div 
          className="liquid-orb absolute top-1/4 -right-28 w-[36rem] h-[36rem] rounded-full opacity-35 blur-[110px]"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(14, 165, 233, 0.06) 60%, transparent 80%)',
            animation: 'pulse-subtle 10s infinite ease-in-out',
            animationDelay: '1.5s'
          }}
        />
        {/* Orb 3: Purple Deep Cloud Ethereal Pool */}
        <div 
          className="liquid-orb absolute bottom-1/3 left-1/4 w-[34rem] h-[34rem] rounded-full opacity-30 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.20) 0%, rgba(124, 58, 237, 0.05) 60%, transparent 80%)',
            animation: 'pulse-subtle 12s infinite ease-in-out',
            animationDelay: '3s'
          }}
        />
        {/* Orb 4: Rose Specular Accent */}
        <div 
          className="liquid-orb absolute -bottom-32 right-1/4 w-[28rem] h-[28rem] rounded-full opacity-25 blur-[95px]"
          style={{
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.16) 0%, rgba(225, 29, 72, 0.04) 60%, transparent 80%)',
            animation: 'pulse-subtle 9s infinite ease-in-out',
            animationDelay: '4.5s'
          }}
        />
        {/* Micro Liquid Mesh Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* Top Header Dock */}
      <Header
        onDeviceStatus={onDeviceStatus}
        isOnline={!isSimulatedOffline && isOnline}
        routingMode={routingMode}
        setRoutingMode={(mode) => {
          setRoutingMode(mode);
          saveSettings({ mode, threshold, offlineSimulated: isSimulatedOffline });
        }}
        threshold={threshold}
        setThreshold={(t) => {
          setThreshold(t);
          saveSettings({ mode: routingMode, threshold: t, offlineSimulated: isSimulatedOffline });
        }}
        onClearHistory={handleClearHistory}
        historyCount={history.length}
        isSimulatedOffline={isSimulatedOffline}
        setIsSimulatedOffline={setIsSimulatedOffline}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8 transition-all duration-300">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          {/* Subtle Liquid Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-inner shadow-white/5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-medium tracking-wide uppercase text-amber-200/90 font-mono">
              Firebase AI Logic • Dual Hybrid Engine
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-cinzel tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-sm">
            Prestige Scriptwriting Matchmaker
          </h2>

          <p className="text-slate-300/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Instantly evaluate screenwriting gigs, generate compatibility telemetry, and synthesize tailored outreach pitches with{' '}
            <strong className="text-cyan-300 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              on-device Gemini Nano
            </strong>{' '}
            privacy and{' '}
            <strong className="text-purple-300 font-semibold drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
              cloud Gemini 2.5 Flash
            </strong>{' '}
            depth.
          </p>
        </div>

        {/* Frosted Glass Error Alert */}
        {errorMessage && (
          <div 
            role="alert"
            className="p-4 sm:p-5 rounded-2xl bg-rose-950/40 backdrop-blur-2xl border border-rose-500/40 text-rose-200 text-sm flex items-start sm:items-center justify-between gap-4 shadow-xl shadow-rose-950/30 animate-fade-in transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0">
                <AlertCircle size={18} />
              </div>
              <div className="leading-snug">
                <strong className="font-semibold text-rose-100 block sm:inline mr-2">Analysis Interrupted:</strong>
                <span className="text-rose-200/90">{errorMessage}</span>
              </div>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              aria-label="Dismiss error"
              className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Primary Input Panel */}
        <section className="transition-all duration-300 ease-out">
          <JobInput
            jobText={jobText}
            setJobText={setJobText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            threshold={threshold}
            routingMode={routingMode}
            isSimulatedOffline={isSimulatedOffline}
            setIsSimulatedOffline={setIsSimulatedOffline}
          />
        </section>

        {/* Results Card with Fluid Transition */}
        {currentResult && (
          <section className="transition-all duration-500 ease-out animate-fade-in">
            <ResultCard result={currentResult} />
          </section>
        )}

        {/* History Section */}
        <section className="transition-all duration-300 ease-out">
          <HistoryView
            history={history}
            onSelect={(item) => setCurrentResult(item)}
            onClear={handleClearHistory}
          />
        </section>

        {/* Architecture & Verification Panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-white/[0.08] text-xs text-slate-400">
          <div className="group p-5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/[0.06] hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-950/20">
            <div className="flex items-center gap-2.5 text-cyan-400 font-semibold mb-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Sparkles size={16} />
              </div>
              <span className="text-sm text-cyan-300">1. Zero-Cost On-Device AI</span>
            </div>
            <p className="leading-relaxed text-slate-400/90">
              Gigs under 1,200 chars route locally to Chrome Gemini Nano via Firebase AI Logic. Complete writer confidentiality, offline operation, and 0 ms network delay.
            </p>
          </div>

          <div className="group p-5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/[0.06] hover:border-purple-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-purple-950/20">
            <div className="flex items-center gap-2.5 text-purple-400 font-semibold mb-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Layers size={16} />
              </div>
              <span className="text-sm text-purple-300">2. Cloud Fallback & Deep Context</span>
            </div>
            <p className="leading-relaxed text-slate-400/90">
              Sprawling world bibles and multi-season pilots route automatically to Gemini 2.5 Flash in the cloud, protected by Firebase App Check.
            </p>
          </div>

          <div className="group p-5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/[0.06] hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-emerald-950/20">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold mb-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <CheckCircle size={16} />
              </div>
              <span className="text-sm text-emerald-300">3. Submission & Compliance</span>
            </div>
            <p className="leading-relaxed text-slate-400/90">
              Verified for #BuildHybridAI hackathon. Public Apache-2.0 repo, App Check debug token, live inference source badges, and zero secret leaks.
            </p>
          </div>
        </section>
      </main>

      {/* Frosted Glass Footer Dock */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-slate-950/80 backdrop-blur-xl py-6 px-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">Built with <strong>Firebase AI Logic</strong></span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400">
              Open Source (Apache-2.0)
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a 
              href="https://github.com/siddharthsingh10394-hue/buildhybridai" 
              target="_blank" 
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors font-medium hover:underline underline-offset-4"
            >
              GitHub Repository
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-mono text-[11px]">#BuildHybridAI Hackathon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
