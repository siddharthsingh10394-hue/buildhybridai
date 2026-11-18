import React from 'react';
import { Sparkles, FileText, Zap, Cloud, AlertCircle, RefreshCw } from 'lucide-react';
import { JOB_PRESETS } from '../ai/prompts';

export default function JobInput({
  jobText,
  setJobText,
  onAnalyze,
  isLoading,
  threshold,
  routingMode,
  isSimulatedOffline,
  setIsSimulatedOffline
}) {
  const charCount = jobText.length;
  const isOverThreshold = charCount > threshold;

  // Real-time preview of projected route
  let projectedRoute = 'On-Device Gemini Nano';
  let routeBadgeClass = 'badge-on-device';
  let routeIcon = <Zap size={14} className="text-cyan-400" />;

  if (isSimulatedOffline || routingMode === 'force-on-device') {
    projectedRoute = 'On-Device Gemini Nano (Offline / Local)';
    routeBadgeClass = 'badge-on-device';
  } else if (routingMode === 'force-cloud' || isOverThreshold) {
    projectedRoute = 'Cloud Gemini 2.5 Flash';
    routeBadgeClass = 'badge-cloud';
    routeIcon = <Cloud size={14} className="text-purple-400" />;
  }

  return (
    <div className="glass-panel p-5 mb-6">
      {/* Presets Row */}
      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Select Screenplay Job Listing Preset:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {JOB_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setJobText(preset.text)}
              className="text-left p-2.5 rounded-lg border border-white/5 bg-slate-900/60 hover:bg-slate-800/80 transition-all group"
            >
              <div className="font-semibold text-xs text-amber-300 group-hover:text-amber-200 truncate">
                {preset.title}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {preset.category}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-1">
                {preset.targetSource}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Input */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileText size={14} className="text-amber-400" />
            <span>Job Description or Screenplay Brief</span>
          </label>
          <div className="flex items-center gap-3 text-xs">
            <span className={`font-mono text-xs ${isOverThreshold ? 'text-purple-400 font-semibold' : 'text-cyan-400'}`}>
              {charCount} / {threshold} chars
            </span>
            <div className={routeBadgeClass}>
              {routeIcon}
              <span>Routes to: {projectedRoute}</span>
            </div>
          </div>
        </div>
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          rows={6}
          placeholder="Paste screenwriting gig, pilot brief, or feature film spec requirements here..."
          className="w-full bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-sans resize-y"
        />
      </div>

      {/* Controls & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSimulatedOffline}
              onChange={(e) => setIsSimulatedOffline(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className={isSimulatedOffline ? "text-rose-400 font-semibold" : ""}>
              Simulate Offline / Flight Mode
            </span>
          </label>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !jobText.trim()}
          className="btn-primary"
        >
          {isLoading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Inference in Progress...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Score & Draft Outreach</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
