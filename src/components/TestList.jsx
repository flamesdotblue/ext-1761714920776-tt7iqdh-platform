import { Timer } from 'lucide-react';

export default function TestList({ exam, tests, onStart }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="text-indigo-600" size={18} />
          <h2 className="text-sm font-semibold">Available Tests • {exam}</h2>
        </div>
        <span className="text-xs text-slate-500">{tests.length} tests</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tests.map((t) => (
          <div key={t.id} className="flex flex-col justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <h3 className="font-medium">{t.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{t.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <span className="rounded bg-slate-100 px-2 py-0.5">{t.questions.length} Qs</span>
                <span className="rounded bg-slate-100 px-2 py-0.5">{t.duration} min</span>
                <span className="rounded bg-slate-100 px-2 py-0.5">+{t.marking.correct}/-{Math.abs(t.marking.wrong)}</span>
              </div>
              <button
                onClick={() => onStart(t.id)}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white shadow hover:bg-indigo-700"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
