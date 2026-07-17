import { Shield, Rocket } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <Rocket size={20} />
          </div>
          <div>
            <h1 className="font-sans font-bold text-slate-900 tracking-tight">ASRA</h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Aero-Spec Reliability Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
            <Shield size={14} className="text-blue-600" />
            <span className="text-xs font-medium text-slate-700 uppercase tracking-tighter">Defense Standard Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-500">SYSTEM: ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
