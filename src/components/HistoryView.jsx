import React from 'react';
import { History, Trash2, Zap, Cloud, ArrowRight, Clock, Sparkles } from 'lucide-react';

/**
 * Format ISO timestamp string into human-friendly relative or calendar time
 */
function formatTimestamp(isoStr) {
  if (!isoStr) return 'Recent';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return 'Recent';
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 45) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

/**
 * Returns dynamic liquid color & styling based on match score
 */
function getScoreBadge(score) {
  const num = typeof score === 'number' ? score : parseInt(score, 10) || 75;
  if (num >= 85) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.18)]',
      label: 'Strong'
    };
  }
  if (num >= 70) {
    return {
      bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.18)]',
      label: 'Good'
    };
  }
  return {
    bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.18)]',
    label: 'Moderate'
  };
}

export default function HistoryView({ history, onSelect, onClear }) {
  const items = Array.isArray(history) ? history : [];
  const hasHistory = items.length > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-5 sm:p-6 mb-8 shadow-2xl transition-all duration-300 hover:border-white/15">
      {/* Specular caustic highlights along the top edge */}
      <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            <History size={14} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Evaluation History
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-amber-300/90 border border-white/10">
                {items.length} {items.length === 1 ? 'record' : 'records'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Locally persisted telemetric script runs with instant recall
            </p>
          </div>
        </div>

        {/* Clear History Glass Button */}
        <button
          type="button"
          onClick={onClear}
          disabled={!hasHistory}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 ${
            !hasHistory
              ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-500 bg-white/[0.01]'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30'
          }`}
          title="Clear all saved analyses from storage"
        >
          <Trash2 size={13} />
          <span>Clear History</span>
        </button>
      </div>

      {/* Empty State with Glowing Liquid Accent */}
      {!hasHistory && (
        <div className="relative my-4 py-8 px-6 rounded-xl border border-white/[0.04] bg-slate-950/40 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Subtle glowing liquid accent orb */}
          <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-amber-500/15 via-cyan-500/10 to-purple-500/15 blur-2xl pointer-events-none animate-pulse-subtle" />
          
          <div className="relative mb-3 flex items-center justify-center">
            <div className="w-13 h-13 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.12)]">
              <History size={22} className="text-amber-400/80" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400/40 border border-cyan-400 animate-ping pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400/80 pointer-events-none" />
          </div>

          <h4 className="text-sm font-semibold text-slate-200 mb-1 tracking-wide font-cinzel">
            No Script Evaluations Yet
          </h4>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-3">
            Run an analysis above to populate your liquid telemetry drawer with instant recall, match scores, and outreach pitch drafts.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-slate-400 bg-white/[0.02] border border-white/5">
            <Sparkles size={12} className="text-amber-400/70" />
            <span>Analyses persist automatically in local browser storage</span>
          </div>
        </div>
      )}

      {/* History Items List */}
      {hasHistory && (
        <div className="space-y-2.5 relative z-10 max-h-[460px] overflow-y-auto pr-1">
          {items.slice(0, 8).map((item) => {
            const isOnDevice = item.source === 'on_device';
            const score = item.data?.matchScore ?? 80;
            const scoreConfig = getScoreBadge(score);
            const format = item.data?.projectSpecs?.format || 'Script Analysis';
            const genre = item.data?.projectSpecs?.genre || 'Screenplay';
            const summary = item.data?.executiveSummary || 'No summary available for this evaluation.';
            const timeFormatted = formatTimestamp(item.timestamp);

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="group relative overflow-hidden rounded-xl bg-slate-950/40 hover:bg-slate-900/70 border border-white/[0.06] hover:border-amber-400/30 p-3.5 transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),0_0_15px_rgba(245,158,11,0.06)] hover:-translate-y-0.5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Specular border reflection on hover */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 group-hover:via-amber-400/40 to-transparent transition-all duration-500 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Left section: Provider tag + Project details */}
                <div className="flex items-start sm:items-center gap-3 truncate flex-1 min-w-0">
                  {/* Liquid Provider Tag */}
                  <div className="shrink-0 pt-0.5 sm:pt-0">
                    {isOnDevice ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.18)]">
                        <Zap size={11} className="text-cyan-400 animate-pulse" />
                        <span>NANO</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-purple-950/60 border border-purple-400/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.18)]">
                        <Cloud size={11} className="text-purple-400" />
                        <span>CLOUD</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Summary */}
                  <div className="truncate flex-1 min-w-0">
                    <div className="flex items-center gap-2 truncate mb-0.5">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                        {format}: {genre}
                      </span>
                      {item.data?.verdict && (
                        <span className="text-[10px] text-slate-400 hidden md:inline truncate">
                          • {item.data.verdict}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate group-hover:text-slate-300 transition-colors">
                      {summary}
                    </div>
                  </div>
                </div>

                {/* Right section: Score pill, Timestamp & Re-view glass button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  {/* Timestamp & Latency */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-md text-[10px]">
                      <Clock size={10} className="text-slate-500" />
                      <span>{timeFormatted}</span>
                    </span>
                    {item.latencyMs != null && (
                      <span className="text-[10px] text-slate-500 hidden lg:inline">
                        {item.latencyMs}ms
                      </span>
                    )}
                  </div>

                  {/* Liquid Score Pill */}
                  <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${scoreConfig.bg}`}>
                    <span>{score}%</span>
                    <span className="text-[10px] font-sans font-medium opacity-80 hidden md:inline">
                      {scoreConfig.label}
                    </span>
                  </div>

                  {/* Glass Re-view Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/40 group-hover:text-amber-200 transition-all duration-200 shadow-sm active:scale-95"
                    title="Load this evaluation into the viewer"
                  >
                    <span>Re-view</span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
