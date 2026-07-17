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
    <div className="space-y-8">
      {/* Verification Matrix Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="text-blue-600" />
          Intelligent Verification Matrix
        </h2>
        <div className="flex gap-4">
          <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
            CONFLICTS: {result.conflicts.length}
          </div>
          <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
            QUERIES: {result.questions.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conflicts Panel */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest px-1">Detected Discrepancies</h3>
          <div className="space-y-3">
            {result.conflicts.map((conflict) => (
              <motion.div
                key={conflict.id}
                layout
                className={`p-4 rounded-xl border flex gap-4 ${
                  conflict.severity === 'high' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'
                }`}
              >
                <div className={`mt-1 ${conflict.severity === 'high' ? 'text-red-500' : 'text-orange-500'}`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{conflict.description}</p>
                  <p className="text-xs text-slate-600 leading-relaxed italic">Recommendation: {conflict.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Queries Panel */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest px-1">Researcher Clarification Required</h3>
          <div className="space-y-4">
            {result.questions.map((q) => (
              <motion.div
                key={q.id}
                className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 leading-snug">{q.text}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">CONTEXT: {q.context}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter value or instruction..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={confirmedData[q.id] || ''}
                    onChange={(e) => onConfirm(q.id, e.target.value)}
                  />
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors">
                    Confirm
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Grounding Info */}
      <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <p className="text-xs font-medium text-slate-300">
            AI analysis grounded in <span className="text-white font-bold underline cursor-pointer">MIL-STD-461G</span> and <span className="text-white font-bold underline cursor-pointer">Project RFP v2.4</span>
          </p>
        </div>
        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
          Audit Traceability Matrix <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
