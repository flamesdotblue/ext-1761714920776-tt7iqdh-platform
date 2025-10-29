import { useMemo } from 'react';
import { GraduationCap } from 'lucide-react';

export default function ExamSelector({ exam, onChange }) {
  const options = useMemo(() => [
    { id: 'JEE', title: 'JEE', description: 'Mains style, +4/−1 marking' },
    { id: 'NEET', title: 'NEET', description: 'NEET pattern, +4/−1 marking' },
  ], []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <GraduationCap className="text-indigo-600" size={18} />
        <h2 className="text-sm font-semibold">Select Exam</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const active = exam === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`group rounded-lg border p-4 text-left transition-all ${
                active
                  ? 'border-indigo-500 bg-indigo-50/60 shadow'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">{opt.title}</span>
                <span className={`h-2 w-2 rounded-full ${active ? 'bg-indigo-600' : 'bg-slate-300'}`} />
              </div>
              <p className="text-xs text-slate-500">{opt.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
