import { FileUp, FileText, Table, Mic } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadSectionProps {
  onUpload: (type: string, file: File) => void;
}

export default function UploadSection({ onUpload }: UploadSectionProps) {
  const uploadTypes = [
    { id: 'spec', label: 'Technical Spec / MIL-STD', icon: FileText, color: 'blue', desc: 'PDF/Docx' },
    { id: 'data', label: 'Power Consumption / Test Logs', icon: Table, color: 'emerald', desc: 'Excel/CSV' },
    { id: 'notes', label: 'Meeting Notes / Voice', icon: Mic, color: 'amber', desc: 'Text/Audio' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {uploadTypes.map((type, idx) => (
        <motion.div
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="group relative p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
        >
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={(e) => {
              if (e.target.files?.[0]) onUpload(type.id, e.target.files[0]);
            }}
          />
          <div className={`w-12 h-12 rounded-xl bg-${type.color}-50 flex items-center justify-center text-${type.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
            <type.icon size={24} />
          </div>
          <h3 className="font-sans font-semibold text-slate-900 mb-1">{type.label}</h3>
          <p className="text-sm text-slate-500">{type.desc}</p>
          
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
            <FileUp size={14} />
            <span>Click or drag to upload</span>
          </div>
          
          <div className={`absolute bottom-0 left-0 h-1 bg-${type.color}-500 w-0 group-hover:w-full transition-all duration-500`} />
        </motion.div>
      ))}
    </div>
  );
}
