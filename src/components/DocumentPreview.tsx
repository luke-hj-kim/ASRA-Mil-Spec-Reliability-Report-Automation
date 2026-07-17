import { FileText, Download, Copy, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface DocumentPreviewProps {
  content: string;
}

export default function DocumentPreview({ content }: DocumentPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-canvas border border-hairline rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[700px]"
    >
      {/* Document Toolbar */}
      <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-surface-card/50">
        <div className="flex items-center gap-3">
          <FileText className="text-coral" size={20} />
          <div>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Aero-Spec Specification Draft</h3>
            <p className="text-[10px] font-mono text-ink/30">DOC_ID: ASRA-2026-0041 (PREVIEW)</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 hover:bg-canvas rounded-lg text-ink/40 hover:text-ink transition-all border border-transparent hover:border-hairline">
            <Copy size={18} />
          </button>
          <button className="p-2 hover:bg-canvas rounded-lg text-ink/40 hover:text-ink transition-all border border-transparent hover:border-hairline">
            <Download size={18} />
          </button>
          <button className="flex items-center gap-2 bg-coral text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-coral-active transition-colors shadow-lg shadow-coral/20">
            <Eye size={16} /> Final Review
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 p-12 overflow-y-auto bg-canvas relative">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
        
        <div className="max-w-3xl mx-auto prose prose-slate prose-sm 
          prose-headings:font-serif prose-headings:text-ink prose-headings:tracking-tight prose-headings:font-normal
          prose-p:font-sans prose-p:text-ink/80 prose-p:leading-relaxed
          prose-strong:text-ink prose-strong:font-bold
          prose-a:text-coral prose-a:no-underline hover:prose-a:underline
        ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      
      {/* Citation Footer */}
      <div className="px-8 py-4 bg-surface-card border-t border-hairline flex items-center justify-between">
        <p className="text-[10px] text-ink/40 uppercase tracking-[0.2em] font-bold">
          Confidential | Hanwha Aerospace LS Division
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-mono text-ink/40">DIGITAL_ASSISTANT_VERIFIED</span>
        </div>
      </div>
    </motion.div>
  );
}
