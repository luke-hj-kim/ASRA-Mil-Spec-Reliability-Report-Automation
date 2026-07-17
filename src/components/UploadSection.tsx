import { FileUp, FileText, Table, Mic } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadSectionProps {
  onUpload: (type: string, file: File) => void;
}

export default function UploadSection({ onUpload }: UploadSectionProps) {
  const uploadTypes = [
    { id: 'spec', label: 'Technical Spec / MIL-STD', icon: FileText, desc: 'PDF/Docx' },
    { id: 'data', label: 'Power Consumption / Test Logs', icon: Table, desc: 'Excel/CSV' },
    { id: 'notes', label: 'Meeting Notes / Voice', icon: Mic, desc: 'Text/Audio' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {uploadTypes.map((type, idx) => (
        <motion.div
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="group relative p-8 bg-surface-card border border-hairline rounded-xl hover:border-coral/30 hover:shadow-2xl hover:shadow-coral/5 transition-all cursor-pointer overflow-hidden"
        >
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={(e) => {
              if (e.target.files?.[0]) onUpload(type.id, e.target.files[0]);
            }}
          />
          <div className="w-12 h-12 rounded-lg bg-canvas flex items-center justify-center text-coral mb-6 group-hover:scale-110 transition-transform border border-hairline">
            <type.icon size={24} />
          </div>
          <h3 className="font-serif text-xl text-ink mb-2">{type.label}</h3>
          <p className="text-sm text-ink/60 leading-relaxed mb-6">{type.desc}</p>
          
          <div className="flex items-center gap-2 text-[10px] font-semibold text-coral uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
            <FileUp size={12} />
            <span>Click or drag to upload</span>
          </div>
          
          <div className="absolute bottom-0 left-0 h-1 bg-coral w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
        </motion.div>
      ))}
    </div>
  );
}
