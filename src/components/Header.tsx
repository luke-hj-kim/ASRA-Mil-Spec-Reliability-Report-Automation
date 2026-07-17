import { Shield, Rocket } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-coral rounded-lg flex items-center justify-center text-white">
            <Rocket size={20} />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-ink leading-none tracking-tight">ASRA</h1>
            <p className="text-[10px] font-sans font-medium text-muted uppercase tracking-[0.15em] opacity-60">Aero-Spec Reliability Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-surface-card rounded-full border border-hairline">
            <Shield size={14} className="text-coral" />
            <span className="text-[11px] font-semibold text-ink/70 uppercase tracking-wider">Defense Standard Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-ink/50 uppercase tracking-widest">SYSTEM: ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
