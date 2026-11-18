import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Cloud, 
  RefreshCw, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Film,
  CheckCircle2,
  X
} from 'lucide-react';
import { JOB_PRESETS, WRITER_PROFILE_DEFAULT } from '../ai/prompts';

export default function JobInput({
  jobText = '',
  setJobText,
  onAnalyze,
  isLoading = false,
  threshold = 1200,
  routingMode = 'auto',
  isSimulatedOffline = false,
  setIsSimulatedOffline,
  writerProfile = WRITER_PROFILE_DEFAULT,
  setWriterProfile
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const charCount = jobText.length;
  const isOverThreshold = charCount > threshold;
  const activeProfile = writerProfile || WRITER_PROFILE_DEFAULT;

  // Real-time preview of projected route
  let projectedRoute = 'On-Device Gemini Nano';
  let routeBadgeClass = 'badge-on-device';
  let routeIcon = <Zap size={14} className="text-cyan-400" />;
  let routeSummary = 'Free, private, zero-latency local execution';

  if (isSimulatedOffline || routingMode === 'force-on-device') {
    projectedRoute = 'On-Device Gemini Nano (Offline)';
    routeBadgeClass = 'badge-on-device';
    routeIcon = <Zap size={14} className="text-cyan-400" />;
    routeSummary = 'Forced local inference on Chrome Built-in AI';
  } else if (routingMode === 'force-cloud' || isOverThreshold) {
    projectedRoute = 'Cloud Gemini 2.5 Flash';
    routeBadgeClass = 'badge-cloud';
    routeIcon = <Cloud size={14} className="text-purple-400" />;
    routeSummary = isOverThreshold 
      ? `Prompt exceeds ${threshold.toLocaleString()} char threshold` 
      : 'Forced high-capacity cloud pipeline';
  }

  // Calculate percentage toward threshold
  const thresholdPct = Math.min(100, Math.round((charCount / threshold) * 100));

  return (
    <div className="glass-panel liquid-glass-card relative overflow-hidden p-6 mb-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all">
      {/* Liquid Caustic Specular Highlights */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 via-amber-400/60 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Presets Section */}
      <div className="mb-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-sans">
              Screenplay Job Presets
            </label>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-white/5 font-mono">
              Ready-to-test benchmarks
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click preset to populate brief & test routing
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {JOB_PRESETS.map((preset) => {
            const isSelected = jobText.trim() === preset.text.trim();
            const isLocalTarget = preset.targetSource.includes('On-Device');

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setJobText(preset.text)}
                className={`relative text-left p-3.5 rounded-xl border transition-all duration-300 group overflow-hidden ${
                  isSelected
                    ? 'border-amber-400/70 bg-gradient-to-b from-amber-500/15 via-slate-900/85 to-slate-900/90 shadow-[0_0_22px_rgba(245,158,11,0.22)] ring-1 ring-amber-400/40'
                    : 'border-white/10 bg-slate-950/45 hover:bg-slate-900/70 hover:border-white/20 hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]'
                }`}
              >
                {/* Micro specular edge */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                <div className="flex items-start justify-between gap-1.5 mb-1">
                  <div className={`font-semibold text-xs leading-snug line-clamp-2 transition-colors ${
                    isSelected ? 'text-amber-200' : 'text-slate-200 group-hover:text-amber-300'
                  }`}>
                    {preset.title}
                  </div>
                  {isSelected && (
                    <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="text-[11px] text-slate-400 truncate mb-2">
                  {preset.category}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-white/5">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${
                    isLocalTarget 
                      ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/20' 
                      : 'text-purple-300 bg-purple-950/40 border border-purple-500/20'
                  }`}>
                    {isLocalTarget ? <Zap size={10} /> : <Cloud size={10} />}
                    <span>{isLocalTarget ? 'Local' : 'Cloud'}</span>
                  </span>
                  <span className="text-slate-500">
                    {preset.text.length} chars
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea Input Workspace */}
      <div className="mb-5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileText size={14} />
            </div>
            <span>Screenplay Listing or Creative Brief</span>
          </label>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Character Counter Pill */}
            <div className={`px-2.5 py-1 rounded-full text-xs font-mono border backdrop-blur-md transition-all ${
              isOverThreshold
                ? 'bg-purple-950/70 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
            }`}>
              <span className="font-bold">{charCount.toLocaleString()}</span>
              <span className="opacity-75"> / {threshold.toLocaleString()} chars</span>
            </div>

            {/* Projected Route Pill Badge */}
            <div className={`${routeBadgeClass} backdrop-blur-md transition-all`} title={routeSummary}>
              {routeIcon}
              <span className="text-[11px] font-medium tracking-normal">{projectedRoute}</span>
            </div>
          </div>
        </div>

        {/* Textarea with liquid glass focus highlight */}
        <div className="relative">
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={7}
            placeholder="Paste screenwriting gig brief, pilot premise, or feature film spec requirements here..."
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/25 focus:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all font-sans leading-relaxed resize-y backdrop-blur-xl"
          />

          {jobText && (
            <button
              type="button"
              onClick={() => setJobText('')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/10 transition-colors"
              title="Clear text"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Dynamic Threshold Liquid Gauge Bar */}
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 bg-slate-950/70 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                isOverThreshold
                  ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                  : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
              }`}
              style={{ width: `${thresholdPct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
            {thresholdPct}% of local window
          </span>
        </div>
      </div>

      {/* Writer Profile Accordion */}
      <div className="mb-5 relative z-10">
        <button
          type="button"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-slate-950/40 hover:bg-slate-900/60 hover:border-white/20 transition-all text-left group backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 group-hover:scale-105 transition-transform">
              <User size={15} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                <span>Active Writer Profile & Background</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 font-mono">
                  {activeProfile.name}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Injected into AI system instructions for tailored compatibility scoring
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-slate-200">
            <span className="text-[11px] font-medium hidden sm:inline">
              {isProfileOpen ? 'Collapse Profile' : 'Inspect Profile'}
            </span>
            <div className="p-1 rounded-md bg-white/5 border border-white/5">
              {isProfileOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </div>
        </button>

        {isProfileOpen && (
          <div className="mt-2.5 p-4 rounded-xl border border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-inner space-y-3.5">
            {/* Writer Specialties */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Film size={12} className="text-cyan-400" />
                <span>Core Genres & Narrative Specialties</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeProfile.specialties?.map((spec) => (
                  <span
                    key={spec}
                    className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Loglines */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <FileText size={12} className="text-amber-400" />
                <span>Portfolio IP & Sample Loglines</span>
              </div>
              <div className="space-y-1.5">
                {activeProfile.sampleLoglines?.map((logline, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900/60 border border-white/5 font-sans leading-relaxed"
                  >
                    {logline}
                  </div>
                ))}
              </div>
            </div>

            {/* Honors & Credentials */}
            {activeProfile.awards && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200">
                <Award size={15} className="text-amber-400 flex-shrink-0" />
                <span>{activeProfile.awards}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls & Actions Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/15 bg-slate-950/40 hover:bg-slate-900/60 transition-all group">
            <input
              type="checkbox"
              checked={isSimulatedOffline}
              onChange={(e) => setIsSimulatedOffline && setIsSimulatedOffline(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-500"
            />
            <div className="flex items-center gap-1.5">
              <span className={`text-xs transition-colors ${
                isSimulatedOffline ? 'text-rose-400 font-semibold' : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                Simulate Offline / Flight Mode
              </span>
              {isSimulatedOffline && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
          </label>
        </div>

        {/* Striking Iridescent Liquid CTA Button */}
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !jobText.trim()}
          className="btn-primary relative group overflow-hidden px-7 py-3 rounded-xl font-bold text-sm tracking-wide text-slate-950 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_25px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_35px_rgba(245,158,11,0.55)] active:scale-[0.98] border border-amber-200/50"
          style={{
            background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 45%, #d97706 100%)'
          }}
        >
          {/* Specular shimmering sweep effect on hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <RefreshCw size={17} className="animate-spin text-slate-950" />
                <span className="font-extrabold text-slate-950">Inference in Progress...</span>
              </>
            ) : (
              <>
                <Sparkles size={17} className="text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-extrabold text-slate-950">Score & Draft Outreach</span>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}