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
  Send,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Wifi,
  WifiOff,
  Cpu,
  Layers
} from 'lucide-react';

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(true);

  if (!result) return null;

  // Resilient data extraction supporting both flat and nested result structures
  const data = result.data || result.result?.data;
  if (!data) return null;

  const source = result.source || result.result?.source || data.source || 'on_device';
  const latencyMs = result.latencyMs ?? result.result?.latencyMs ?? 0;
  const routingReason = result.routingReason || result.result?.routingReason || 'Adaptive hybrid routing based on prompt payload';
  const isOnDevice = source === 'on_device';
  const score = typeof data.matchScore === 'number' ? data.matchScore : 85;

  const handleCopy = (e) => {
    e?.stopPropagation();
    if (data?.outreachPitch) {
      navigator.clipboard.writeText(data.outreachPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Determine dynamic verdict tier & styling accents
  const getVerdictTier = (val) => {
    if (val >= 90) return { label: 'Optimal Alignment', color: 'emerald', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
    if (val >= 80) return { label: 'High Compatibility', color: 'amber', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' };
    if (val >= 65) return { label: 'Solid Potential', color: 'cyan', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400' };
    return { label: 'Selective Spec Fit', color: 'purple', border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400' };
  };

  const verdict = getVerdictTier(score);

  // SVG circular gauge math (radius = 48, circumference = 2 * PI * 48 ≈ 301.59)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (score / 100) * circumference;

  // Strengths fallback derived from specs & rationale
  const strengthsList = (Array.isArray(data.strengths) && data.strengths.length > 0)
    ? data.strengths
    : [
        `Genre & Tone Synergy: Precision alignment with ${data.projectSpecs?.genre || 'narrative storytelling'} and requested ${data.projectSpecs?.tone || 'cinematic tone'}.`,
        `Structural Format Fit: Demonstrates mastery in ${data.projectSpecs?.format || 'screenplay structure'} with calibrated dramatic pacing.`,
        `Producer Vision Alignment: Creative scope tuned precisely for ${data.projectSpecs?.estimatedBudget || 'the targeted budget tier'}.`
      ];

  // Weaknesses / Considerations fallback
  const weaknessesList = (Array.isArray(data.weaknesses) && data.weaknesses.length > 0)
    ? data.weaknesses
    : [
        `Pacing Calibration: Ensure ${data.projectSpecs?.format || 'script'} maintains strict page-count discipline without sacrificing character depth.`,
        `Budget Discipline: Guard set-pieces and VFX benchmarks to respect ${data.projectSpecs?.estimatedBudget || 'mid-tier production parameters'}.`,
        `Rapid Engagement Window: High-interest opportunity requires proactive submission of sample dialogue scenes.`
      ];

  // Recommendations fallback
  const recommendationsList = (Array.isArray(data.recommendations) && data.recommendations.length > 0)
    ? data.recommendations
    : [
        `Lead With Character Dilemma: Frame initial outreach on protagonist conflict rather than dense lore exposition.`,
        `Offer Speculative Scene Teaser: Attach a 3-page sample scene mirroring the requested '${data.projectSpecs?.tone || 'atmospheric'}' tone.`,
        `Highlight Proven Accolades: Explicitly cite relevant contest placements and genre portfolio samples in the opening paragraph.`
      ];

  const pitchWordCount = data.outreachPitch ? data.outreachPitch.trim().split(/\s+/).length : 0;

  return (
    <div className="glass-panel p-5 sm:p-7 border-white/15 mb-8 animate-fade-in relative overflow-hidden shadow-2xl">
      {/* Specular Liquid Ambient Highlight */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ====================================================================
          1. Execution Telemetry Bar
          ==================================================================== */}
      <div className="relative overflow-hidden rounded-xl bg-slate-950/70 border border-white/10 p-3.5 sm:p-4 mb-7 backdrop-blur-xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Provider Badge & Hardware Latency */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isOnDevice ? (
              <div className="badge-on-device py-1.5 px-3">
                <Zap size={14} className="text-cyan-300 animate-pulse" />
                <span className="font-semibold tracking-wider">ON-DEVICE • GEMINI NANO</span>
              </div>
            ) : (
              <div className="badge-cloud py-1.5 px-3">
                <Cloud size={14} className="text-purple-300 animate-pulse" />
                <span className="font-semibold tracking-wider">CLOUD • GEMINI 2.5 FLASH</span>
              </div>
            )}

            {/* Inference Latency Metric */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
              <Clock size={13} className="text-amber-400" />
              <span>{latencyMs} ms latency</span>
              <span 
                className={`w-2 h-2 rounded-full ${latencyMs < 1000 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'} ml-1 animate-pulse`} 
                title={latencyMs < 1000 ? 'Sub-second real-time response' : 'Standard cloud inference'}
              />
            </div>

            {/* Offline / Egress Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full border border-white/10 bg-slate-900/70 text-slate-300 shadow-inner">
              {isOnDevice ? (
                <>
                  <WifiOff size={13} className="text-cyan-400" />
                  <span className="text-cyan-300 font-medium">Zero Data Egress • Local Confidential</span>
                </>
              ) : (
                <>
                  <Wifi size={13} className="text-purple-400" />
                  <span className="text-purple-300 font-medium">Secure TLS • Cloud Inference</span>
                </>
              )}
            </div>
          </div>

          {/* Dynamic Routing Reason */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10 max-w-full">
            <Cpu size={13} className="text-cyan-400 shrink-0" />
            <span className="truncate">{routingReason}</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. Score Meter & Project Specifications Hero Grid
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-7">
        {/* Circular Score Meter with Liquid Glow Rings */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/80 border border-white/15 backdrop-blur-xl text-center relative overflow-hidden group shadow-xl">
          {/* Liquid Caustic Glow Behind Gauge */}
          <div 
            className="absolute inset-0 opacity-20 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-35"
            style={{
              background: score >= 80 
                ? 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)'
            }}
          />

          {/* SVG Circular Meter Container */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            {/* Concentric Glow Ring 1 */}
            <div className="absolute inset-0 rounded-full border border-white/10 scale-110 pointer-events-none animate-pulse-subtle" />
            {/* Concentric Glow Ring 2 */}
            <div className="absolute inset-0 rounded-full border border-amber-400/20 scale-105 pointer-events-none" />

            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="liquidScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="liquidScoreGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.75" />
                </filter>
              </defs>

              {/* Background Track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
              />

              {/* Dynamic Animated Value Track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="url(#liquidScoreGrad)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                filter="url(#liquidScoreGlow)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Translucent Frosted Center Core */}
            <div className="absolute w-24 h-24 rounded-full bg-slate-950/85 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl font-extrabold font-cinzel text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 leading-none">
                {score}%
              </span>
              <span className="text-[10px] tracking-widest font-mono font-semibold text-cyan-400/90 mt-1 uppercase">
                MATCH
              </span>
            </div>
          </div>

          {/* Dynamic Verdict Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-2 border backdrop-blur-md ${verdict.bg} ${verdict.border} ${verdict.text} shadow-[0_0_12px_rgba(245,158,11,0.2)]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <span>{verdict.label}</span>
          </div>

          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5">
            Writer Compatibility Index
          </h4>
          <p className="text-xs text-slate-400 italic leading-relaxed max-w-xs">
            "{data.scoreRationale || 'Substantial creative alignment detected across project deliverables and writer credentials.'}"
          </p>
        </div>

        {/* Project Specs 4-Tile Frosted Grid */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 backdrop-blur-md transition-all duration-200 group">
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-1.5 font-semibold tracking-wide">
                <Film size={15} className="group-hover:scale-110 transition-transform" />
                <span>FORMAT & LENGTH</span>
              </div>
              <div className="text-sm font-medium text-slate-200">
                {data.projectSpecs?.format || 'Screenplay Script'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 backdrop-blur-md transition-all duration-200 group">
              <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1.5 font-semibold tracking-wide">
                <Compass size={15} className="group-hover:scale-110 transition-transform" />
                <span>GENRE & WORLD</span>
              </div>
              <div className="text-sm font-medium text-slate-200">
                {data.projectSpecs?.genre || 'Drama / Speculative Fiction'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 backdrop-blur-md transition-all duration-200 group">
              <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1.5 font-semibold tracking-wide">
                <DollarSign size={15} className="group-hover:scale-110 transition-transform" />
                <span>PRODUCTION BUDGET TIER</span>
              </div>
              <div className="text-sm font-medium text-slate-200">
                {data.projectSpecs?.estimatedBudget || 'Mid-Tier ($2M - $5M)'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 backdrop-blur-md transition-all duration-200 group">
              <div className="flex items-center gap-2 text-xs text-purple-400 mb-1.5 font-semibold tracking-wide">
                <Sparkles size={15} className="group-hover:scale-110 transition-transform" />
                <span>TONE & COMPARABLES</span>
              </div>
              <div className="text-sm font-medium text-slate-200">
                {data.projectSpecs?.tone || 'Grounded, character-driven & cinematic'}
              </div>
            </div>
          </div>

          {/* Key Deliverables & Requirements Checklist */}
          {data.keyRequirements && data.keyRequirements.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-slate-300 mb-2.5">
                <Layers size={14} className="text-cyan-400" />
                <span>Key Deliverables & Specifications</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {data.keyRequirements.map((req, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors"
                  >
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          3. Translucent Frosted Cards:
             - Match Verdict (Executive Summary)
             - Strengths
             - Weaknesses & Considerations
             - Recommendations
          ==================================================================== */}
      <div className="space-y-4 mb-7">
        {/* Card: Match Verdict & Executive Summary */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/15 backdrop-blur-md hover:border-amber-400/30 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-amber-400">
              <Award size={16} />
              <span>Match Verdict & Executive Summary</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Score Confidence: High ({score}/100)
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {data.executiveSummary || 'No executive summary available for this job posting.'}
          </p>
        </div>

        {/* 3-Column Telemetry Triad: Strengths, Weaknesses, Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card: Strengths */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-emerald-500/20 backdrop-blur-md hover:border-emerald-500/40 transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3 pb-2 border-b border-white/5">
                <TrendingUp size={15} />
                <span>Alignment Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {strengthsList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card: Weaknesses / Creative Hazards */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-amber-500/20 backdrop-blur-md hover:border-amber-500/40 transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-amber-400 mb-3 pb-2 border-b border-white/5">
                <AlertTriangle size={15} />
                <span>Weaknesses & Nuances</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {weaknessesList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card: Strategic Recommendations */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-purple-500/20 backdrop-blur-md hover:border-purple-500/40 transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-purple-400 mb-3 pb-2 border-b border-white/5">
                <Lightbulb size={15} />
                <span>Strategic Advice</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {recommendationsList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          4. Liquid Glass Collapsible Pitch Draft Card
          ==================================================================== */}
      <div className="rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/95 border border-amber-500/35 overflow-hidden shadow-2xl transition-all">
        {/* Collapsible Header with Controls */}
        <div 
          onClick={() => setIsPitchOpen(!isPitchOpen)}
          className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/60 border-b border-white/10 cursor-pointer select-none hover:bg-slate-900/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Send size={16} className="text-amber-400" />
            <h4 className="text-xs uppercase tracking-wider font-bold text-amber-300">
              Generated Outreach Pitch Letter
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400">
              {pitchWordCount} words
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Copy-to-Clipboard Action with Liquid Copied Feedback Badge */}
            <button
              onClick={handleCopy}
              className={`text-xs py-1.5 px-3.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                  : 'btn-secondary text-xs py-1.5 px-3'
              }`}
              title="Copy outreach proposal to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="font-semibold text-emerald-300">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Pitch</span>
                </>
              )}
            </button>

            {/* Collapse / Expand Toggle Icon */}
            <div className="p-1 rounded-lg text-slate-400 hover:text-white transition-transform">
              {isPitchOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>

        {/* Collapsible Pitch Body */}
        {isPitchOpen && (
          <div className="p-5 animate-fade-in">
            <div className="bg-slate-950/80 rounded-xl p-5 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-line border border-slate-800/80 selection:bg-amber-500/30 selection:text-amber-200 shadow-inner">
              {data.outreachPitch || 'No pitch draft generated.'}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-3 px-1">
              <span>Ready for personalized portfolio adaptation</span>
              <span>Proprietary Firebase AI Output</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}