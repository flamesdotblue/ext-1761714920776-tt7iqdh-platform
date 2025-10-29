import { Rocket, GraduationCap } from 'lucide-react';

export default function Header({ brand = 'RankUp', subtitle }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow">
            <Rocket size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight">{brand}</span>
              <GraduationCap size={16} className="text-indigo-600" />
            </div>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#" className="text-slate-600 hover:text-slate-900">Home</a>
          <a href="#" className="text-slate-600 hover:text-slate-900">About</a>
          <a href="#" className="text-slate-600 hover:text-slate-900">Support</a>
        </nav>
      </div>
    </header>
  );
}
