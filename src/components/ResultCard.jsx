import React, { useState } from 'react';
import { 
  Zap, 
  Cloud, 
  Clock, 
  Copy, 
  Check, 
  Award, 
  Film, 
  DollarSign, 
  Compass, 
  CheckCircle2, 
  Send 
} from 'lucide-react';

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result || !result.data) return null;

  const { data, source, latencyMs, routingReason } = result;
  const isOnDevice = source === 'on_device';

  const handleCopy = () => {
    if (data?.outreachPitch) {
      navigator.clipboard.writeText(data.outreachPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const score = data.matchScore || 85;

  return (
    <div className="glass-panel p-6 border-amber-500/20 mb-8 animate-fade-in">
      {/* Header with Source Badge & Latency */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          {isOnDevice ? (
            <div className="badge-on-device text-sm py-1.5 px-3">
              <Zap size={16} className="text-cyan-400" />
              <span>⚡ ON-DEVICE (GEMINI NANO)</span>
            </div>
          ) : (
            <div className="badge-cloud text-sm py-1.5 px-3">
              <Cloud size={16} className="text-purple-400" />
              <span>☁️ CLOUD (GEMINI 2.5 FLASH)</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            <Clock size={13} className="text-amber-400" />
            <span>{latencyMs} ms latency</span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono italic">
          {routingReason}
        </div>
      </div>

      {/* Main Grid: Score & Specs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Score Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
          <div 
            className="score-circle mb-3" 
            style={{ '--score': score }}
          >
            <div className="score-circle-content">
              <span className="text-2xl font-bold font-cinzel text-amber-400">{score}%</span>
              <span className="text-[10px] text-slate-400 block -mt-1">MATCH</span>
            </div>
          </div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
            Writer Compatibility
          </h4>
          <p className="text-xs text-slate-400 italic">
            {data.scoreRationale}
          </p>
        </div>

        {/* Project Specs */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-amber-400 mb-1 font-semibold">
              <Film size={14} />
              <span>FORMAT & LENGTH</span>
            </div>
            <div className="text-sm font-medium text-slate-200">
              {data.projectSpecs?.format || 'Screenplay Script'}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1 font-semibold">
              <Compass size={14} />
              <span>GENRE</span>
            </div>
            <div className="text-sm font-medium text-slate-200">
              {data.projectSpecs?.genre || 'Drama / Fiction'}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1 font-semibold">
              <DollarSign size={14} />
              <span>PRODUCTION BUDGET TIER</span>
            </div>
            <div className="text-sm font-medium text-slate-200">
              {data.projectSpecs?.estimatedBudget || 'Mid-Tier'}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-purple-400 mb-1 font-semibold">
              <Award size={14} />
              <span>TONE & COMPARABLES</span>
            </div>
            <div className="text-sm font-medium text-slate-200">
              {data.projectSpecs?.tone || 'Grounded & Cinematic'}
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
          Project Executive Summary
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          {data.executiveSummary}
        </p>
      </div>

      {/* Key Requirements Checklist */}
      {data.keyRequirements && data.keyRequirements.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
            Key Creative Deliverables & Requirements
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {data.keyRequirements.map((req, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900/50 border border-white/5"
              >
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pitch Letter Proposal */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-amber-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Send size={15} className="text-amber-400" />
            <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400">
              Generated Outreach Pitch Letter
            </h4>
          </div>

          <button
            onClick={handleCopy}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Pitch</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-950/80 rounded-lg p-4 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-line border border-slate-800 selection:bg-amber-500/40">
          {data.outreachPitch}
        </div>
      </div>
    </div>
  );
}
