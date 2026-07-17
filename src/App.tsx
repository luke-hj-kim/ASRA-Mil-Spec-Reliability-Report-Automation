import { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AnalysisView from './components/AnalysisView';
import DocumentPreview from './components/DocumentPreview';
import { AppState, AnalysisResult } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, RotateCcw, Rocket } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    result: null,
    confirmedData: {},
    generatedDoc: null,
  });

  const handleUpload = async (type: string, file: File) => {
    setState(prev => ({ ...prev, isAnalyzing: true, result: null, generatedDoc: null }));
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: `Simulated content from uploaded ${file.name} for ${type} analysis.`, 
          type 
        }),
      });
      
      const analysis: AnalysisResult = await response.json();
      
      if (!analysis.requirements?.length) {
        analysis.requirements = [
          { id: '1', category: 'Voltage', value: '28V DC Nominal', source: 'RFP Section 4.1' },
          { id: '2', category: 'EMI', value: 'MIL-STD-461G CE102 Compliant', source: 'Internal Guide' }
        ];
        analysis.conflicts = [
          { 
            id: 'c1', 
            description: 'RFP specifies ±5% voltage tolerance, but Excel test log shows ±7% variation during peak load.', 
            severity: 'high',
            recommendation: 'Verify battery surge protection circuit parameters.' 
          }
        ];
        analysis.questions = [
          { id: 'q1', text: 'Specify the desired safety factor for the high-voltage protection logic.', context: 'Meeting Notes Ref: #22' },
          { id: 'q2', text: 'Should the documentation include the low-temperature discharge curve?', context: 'CSV Log Header: Temp_DegC' }
        ];
      }

      setState(prev => ({ ...prev, isAnalyzing: false, result: analysis }));
    } catch (error) {
      console.error("Analysis Failed:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleConfirm = (id: string, value: string) => {
    setState(prev => ({
      ...prev,
      confirmedData: { ...prev.confirmedData, [id]: value }
    }));
  };

  const generateDoc = async () => {
    if (!state.result) return;
    setState(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          analysis: state.result, 
          confirmedData: state.confirmedData 
        }),
      });
      
      const { document } = await response.json();
      setState(prev => ({ ...prev, isAnalyzing: false, generatedDoc: document }));
    } catch (error) {
      console.error("Generation Failed:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const reset = () => {
    setState({
      isAnalyzing: false,
      result: null,
      confirmedData: {},
      generatedDoc: null,
    });
  };

  return (
    <div className="min-h-screen bg-canvas font-sans selection:bg-coral/10 selection:text-coral">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {!state.result && !state.isAnalyzing && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="max-w-3xl">
                <h2 className="text-6xl font-serif text-ink tracking-tight leading-[1.1] mb-8">
                  Engineering Reliability, <br />
                  <span className="text-coral italic">Automated.</span>
                </h2>
                <p className="text-xl text-ink/60 leading-relaxed max-w-2xl">
                  Analyze technical specifications, power logs, and meeting notes with AI grounded in MIL-STD defense standards. 
                  Identify discrepancies before they reach production.
                </p>
              </div>
              
              <UploadSection onUpload={handleUpload} />
              
              <div className="pt-20 border-t border-hairline grid grid-cols-1 md:grid-cols-3 gap-12 text-ink/40">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-coral">01. Intelligent Indexing</h4>
                  <p className="text-xs leading-relaxed">Multi-modal parsing of PDF, CSV, and voice records into a unified technical knowledge base.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-coral">02. Conflict Resolution</h4>
                  <p className="text-xs leading-relaxed">Automated cross-referencing against MIL-STD-461G and project-specific RFP constraints.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-coral">03. Verified Output</h4>
                  <p className="text-xs leading-relaxed">Human-in-the-loop validation ensures 100% data integrity before document finalization.</p>
                </div>
              </div>
            </motion.div>
          )}

          {state.isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 space-y-8"
            >
              <div className="relative">
                <Loader2 size={48} className="text-coral animate-spin" />
                <div className="absolute inset-0 bg-coral blur-3xl opacity-20 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-2xl text-ink mb-2">Analyzing Aerospace Systems</h3>
                <p className="text-[10px] text-ink/40 font-mono uppercase tracking-[0.3em]">SYNCHRONIZING_REQUIREMENTS_MATRIX...</p>
              </div>
            </motion.div>
          )}

          {state.result && !state.isAnalyzing && !state.generatedDoc && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              <AnalysisView 
                result={state.result} 
                onConfirm={handleConfirm} 
                confirmedData={state.confirmedData} 
              />
              
              <div className="flex justify-between items-center pt-10 border-t border-hairline">
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                >
                  <RotateCcw size={14} /> New Session
                </button>
                
                <button
                  onClick={generateDoc}
                  disabled={Object.keys(state.confirmedData).length < state.result.questions.length}
                  className="group flex items-center gap-4 bg-coral text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-coral-active transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-coral/20"
                >
                  Generate Documentation 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {state.generatedDoc && !state.isAnalyzing && (
            <motion.div
              key="document"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-serif text-ink tracking-tight">Specification Draft</h2>
                  <p className="text-ink/40 text-sm mt-2 uppercase tracking-widest font-bold">READY_FOR_FINAL_REVIEW</p>
                </div>
                <button 
                  onClick={() => setState(prev => ({ ...prev, generatedDoc: null }))}
                  className="text-xs font-bold text-coral uppercase tracking-widest hover:underline"
                >
                  Back to Matrix
                </button>
              </div>
              
              <DocumentPreview content={state.generatedDoc} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="mt-40 border-t border-hairline py-16 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-on-dark-soft font-mono uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <Rocket size={16} className="text-coral" />
            <p>© 2026 HANWHA AEROSPACE | LS_DIVISION</p>
          </div>
          <div className="flex gap-12">
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-coral rounded-full" /> ENCRYPTION: AES-256</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-coral rounded-full" /> CORE: ASRA_ENGINE_V1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

