import { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AnalysisView from './components/AnalysisView';
import DocumentPreview from './components/DocumentPreview';
import { AppState, AnalysisResult } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, RotateCcw } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    result: null,
    confirmedData: {},
    generatedDoc: null,
  });

  const handleUpload = async (type: string, file: File) => {
    setState(prev => ({ ...prev, isAnalyzing: true, result: null, generatedDoc: null }));
    
    // In a real app, we would read the file content here.
    // For the prototype, we'll simulate an analysis based on the file type.
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
      
      // Inject some more specific mock data for the prototype if the API returns empty/generic
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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!state.result && !state.isAnalyzing && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
                  Engineering Reliability, <br />
                  <span className="text-blue-600">Automated.</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Upload your technical specifications, power consumption logs, and meeting notes. 
                  ASRA identifies conflicts, ensures MIL-STD compliance, and generates verified documentation.
                </p>
              </div>
              
              <UploadSection onUpload={handleUpload} />
            </motion.div>
          )}

          {state.isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 space-y-6"
            >
              <div className="relative">
                <Loader2 size={48} className="text-blue-600 animate-spin" />
                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-900">Processing Aerospace Data</h3>
                <p className="text-sm text-slate-500 font-mono">ALIGNING VECTORS & VERIFYING MIL-STD CONSTRAINTS...</p>
              </div>
            </motion.div>
          )}

          {state.result && !state.isAnalyzing && !state.generatedDoc && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <AnalysisView 
                result={state.result} 
                onConfirm={handleConfirm} 
                confirmedData={state.confirmedData} 
              />
              
              <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors"
                >
                  <RotateCcw size={18} /> Restart Analysis
                </button>
                
                <button
                  onClick={generateDoc}
                  disabled={Object.keys(state.confirmedData).length < state.result.questions.length}
                  className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
                >
                  Generate Documentation Draft 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {state.generatedDoc && !state.isAnalyzing && (
            <motion.div
              key="document"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Generated Technical Specification</h2>
                  <p className="text-slate-500 text-sm">Review the draft and finalize for export.</p>
                </div>
                <button 
                  onClick={() => setState(prev => ({ ...prev, generatedDoc: null }))}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Return to Verification Matrix
                </button>
              </div>
              
              <DocumentPreview content={state.generatedDoc} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-slate-400 font-mono">
          <p>© 2026 HANWHA AEROSPACE - ASRA DIGITAL ASSISTANT V1.0</p>
          <div className="flex gap-8">
            <span>DATA ENCRYPTION: AES-256</span>
            <span>PROMPT GROUNDING: ENABLED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

