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
import { Sparkles, Terminal, BookOpen, Layers, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header
        onDeviceStatus={onDeviceStatus}
        isOnline={!isSimulatedOffline && isOnline}
        routingMode={routingMode}
        setRoutingMode={(mode) => {
          setRoutingMode(mode);
          saveSettings({ mode, threshold, offlineSimulated: isSimulatedOffline });
        }}
        threshold={threshold}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-3">
            Prestige Scriptwriting Matchmaker
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Instantly evaluate screenwriting gigs, generate compatibility scores, and draft bespoke outreach pitches with 
            <strong className="text-cyan-400 font-medium"> on-device Gemini Nano</strong> privacy and 
            <strong className="text-purple-400 font-medium"> cloud Gemini 2.5 Flash</strong> depth.
          </p>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-rose-400 hover:text-white font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Primary Input Panel */}
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

        {/* Results Card */}
        {currentResult && <ResultCard result={currentResult} />}

        {/* History Section */}
        <HistoryView
          history={history}
          onSelect={(item) => setCurrentResult(item)}
          onClear={handleClearHistory}
        />

        {/* Architecture & Verification Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-xs text-slate-400">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
              <Sparkles size={16} />
              <span>1. Zero-Cost On-Device AI</span>
            </div>
            <p>
              Gigs under 1,200 chars route locally to Chrome Gemini Nano via Firebase AI Logic. Complete writer confidentiality, offline operation, and 0 ms network delay.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2">
              <Layers size={16} />
              <span>2. Cloud Fallback & Deep Context</span>
            </div>
            <p>
              Sprawling world bibles and multi-season pilots route automatically to Gemini 2.5 Flash in the cloud, protected by Firebase App Check.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
              <CheckCircle size={16} />
              <span>3. Submission & Compliance</span>
            </div>
            <p>
              Verified for #BuildHybridAI hackathon. Public Apache-2.0 repo, App Check debug token, live inference source badges, and zero secret leaks.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Built with <strong>Firebase AI Logic</strong> • Open Source (Apache-2.0)
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/siddharthsingh10394-hue/buildhybridai" 
              target="_blank" 
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <span>Target: #BuildHybridAI Hackathon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
