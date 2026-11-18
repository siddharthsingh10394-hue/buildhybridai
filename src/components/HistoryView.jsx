import React from 'react';
import { History, Trash2, Zap, Cloud, ArrowRight } from 'lucide-react';

export default function HistoryView({ history, onSelect, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="glass-panel p-5 mb-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <History size={15} className="text-amber-400" />
          <span>Recent Analysis History ({history.length})</span>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
        >
          <Trash2 size={13} />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-2">
        {history.slice(0, 5).map((item) => {
          const isOnDevice = item.source === 'on_device';
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/70 border border-white/5 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 truncate pr-4">
                {isOnDevice ? (
                  <span className="badge-on-device text-[10px] py-0.5 px-2 shrink-0">
                    <Zap size={11} />
                    <span>NANO</span>
                  </span>
                ) : (
                  <span className="badge-cloud text-[10px] py-0.5 px-2 shrink-0">
                    <Cloud size={11} />
                    <span>CLOUD</span>
                  </span>
                )}

                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 truncate">
                    {item.data?.projectSpecs?.format || 'Script Analysis'}: {item.data?.projectSpecs?.genre || 'Screenplay'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {item.data?.executiveSummary || 'No summary'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {item.data?.matchScore}%
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {item.latencyMs}ms
                </span>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
