import { AlertTriangle, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResult } from '../types';

interface AnalysisViewProps {
  result: AnalysisResult;
  onConfirm: (id: string, value: string) => void;
  confirmedData: Record<string, string>;
}

export default function AnalysisView({ result, onConfirm, confirmedData }: AnalysisViewProps) {
  return (
    <div className="space-y-12">
      {/* Verification Matrix Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-ink mb-2">Verification Matrix</h2>
          <p className="text-sm text-ink/50 uppercase tracking-widest font-semibold">ASRA-INTEL: ANALYSIS_STREAM_V2</p>
        </div>
        <div className="flex gap-3">
          <div className="text-[10px] font-mono bg-surface-card border border-hairline px-3 py-1 rounded text-ink/70">
            CONFLICTS: {result.conflicts.length}
          </div>
          <div className="text-[10px] font-mono bg-surface-card border border-hairline px-3 py-1 rounded text-ink/70">
            QUERIES: {result.questions.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Conflicts Panel - Use Dark Surface for "Technical Alert" feel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-ink/40 uppercase tracking-[0.2em]">Discrepancy Log</h3>
            <div className="h-[1px] flex-1 bg-hairline mx-4" />
          </div>
          <div className="space-y-4">
            {result.conflicts.map((conflict) => (
              <motion.div
                key={conflict.id}
                layout
                className="p-6 bg-surface-dark border border-surface-dark-elevated rounded-xl flex gap-5 shadow-xl shadow-black/20"
              >
                <div className={`mt-1 ${conflict.severity === 'high' ? 'text-coral' : 'text-amber-500'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-on-dark font-medium leading-relaxed mb-2">{conflict.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-on-dark/10 text-on-dark/60 rounded uppercase tracking-tighter">AI_RECOMMENDATION</span>
                    <p className="text-xs text-on-dark/50 italic">{conflict.recommendation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Queries Panel - Warm Cream for human interaction */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-ink/40 uppercase tracking-[0.2em]">Human-in-the-Loop</h3>
            <div className="h-[1px] flex-1 bg-hairline mx-4" />
          </div>
          <div className="space-y-5">
            {result.questions.map((q) => (
              <motion.div
                key={q.id}
                className="p-6 bg-surface-card border border-hairline rounded-xl shadow-sm hover:border-coral/20 transition-colors"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-9 h-9 bg-canvas border border-hairline rounded-lg flex items-center justify-center text-coral shrink-0">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-ink leading-relaxed">{q.text}</p>
                    <p className="text-[10px] font-mono text-ink/30 mt-2 uppercase tracking-widest">CONTEXT_PATH: {q.context}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Provide clarification..."
                    className="flex-1 bg-canvas border border-hairline rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-coral focus:ring-4 focus:ring-coral/5 transition-all"
                    value={confirmedData[q.id] || ''}
                    onChange={(e) => onConfirm(q.id, e.target.value)}
                  />
                  <button className="bg-coral text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-coral-active transition-colors shadow-lg shadow-coral/20">
                    Confirm
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Grounding Info */}
      <div className="p-6 bg-surface-dark border border-surface-dark-elevated rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
          <p className="text-xs font-medium text-on-dark/60 leading-relaxed">
            Analysis anchored to <span className="text-on-dark font-bold underline cursor-pointer hover:text-coral transition-colors">MIL-STD-461G</span> and <span className="text-on-dark font-bold underline cursor-pointer hover:text-coral transition-colors">PROJ_RFP_V2.4</span>. Zero halluncination mode active.
          </p>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-coral hover:text-white transition-colors group">
          Traceability Matrix <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
