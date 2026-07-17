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
      className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]"
    >
      {/* Document Toolbar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <FileText className="text-blue-600" size={20} />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Aero-Spec Specification Draft</h3>
            <p className="text-[10px] font-mono text-slate-400">DOC_ID: ASRA-2026-0041 (PREVIEW)</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
            <Copy size={18} />
          </button>
          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
            <Download size={18} />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Eye size={16} /> Final Review
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 p-10 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
        <div className="max-w-3xl mx-auto prose prose-slate prose-sm prose-headings:font-sans prose-headings:tracking-tight prose-headings:font-bold">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      
      {/* Citation Footer */}
      <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          Confidential | Hanwha Aerospace LS Division | Digital Assistant Verified
        </p>
      </div>
    </motion.div>
  );
}
