import { useEffect, useMemo, useRef, useState } from 'react';
import { Timer, Trophy, CheckCircle, XCircle } from 'lucide-react';

export default function MockTestPlayer({ exam, test, onExit, onSubmit, result }) {
  const { title, duration, questions, marking } = test;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);

  const palette = useMemo(() => {
    return answers.map((a, i) => ({
      i,
      status: a == null ? 'unattempted' : 'answered',
      correct: submitted && a === questions[i].answerIndex,
      wrong: submitted && a != null && a !== questions[i].answerIndex,
    }));
  }, [answers, submitted, questions]);

  useEffect(() => {
    const tick = () => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (!submittedRef.current) handleSubmitInternal();
          return 0;
        }
        return s - 1;
      });
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (optIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optIndex;
      return next;
    });
  };

  const handleSubmitInternal = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    const timeTaken = duration * 60 - secondsLeft;
    onSubmit?.({ selectedAnswers: answers, timeTaken });
  };

  const handleExit = () => {
    const confirmLeave = window.confirm('Exit the test? Your progress will be lost.');
    if (confirmLeave) onExit?.();
  };

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = Math.floor(secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
        <div>
          <h2 className="text-sm font-semibold">{title} • {exam}</h2>
          <p className="text-xs text-slate-500">Duration: {duration} min • Marking: +{marking.correct} / {marking.wrong}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
            <Timer size={16} className="text-indigo-600" />
            <span className="tabular-nums">{mins}:{secs}</span>
          </div>
          {!submitted && (
            <button onClick={handleSubmitInternal} className="rounded-md bg-emerald-600 px-3 py-1.5 text-white shadow hover:bg-emerald-700">Submit</button>
          )}
          <button onClick={handleExit} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50">Exit</button>
        </div>
      </div>

      {!submitted && (
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <QuestionCard
              q={questions[index]}
              qIndex={index}
              total={questions.length}
              selected={answers[index]}
              onSelect={handleSelect}
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={index === questions.length - 1}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-2 text-sm font-semibold">Question Palette</h3>
            <div className="grid grid-cols-6 gap-2">
              {palette.map((p) => (
                <button
                  key={p.i}
                  onClick={() => setIndex(p.i)}
                  className={`h-8 w-8 rounded text-xs font-medium tabular-nums ${
                    p.i === index
                      ? 'ring-2 ring-indigo-500'
                      : ''
                  } ${
                    p.status === 'answered'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {p.i + 1}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-indigo-700">Answered</span>
              <span className="rounded bg-slate-50 px-2 py-0.5 text-slate-600">Unattempted</span>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div className="space-y-4 p-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Trophy size={18} />
              <h3 className="font-semibold">Results</h3>
            </div>
            {result ? (
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                <Stat label="Score" value={`${result.score} / ${result.total}`} highlight />
                <Stat label="Correct" value={result.correct} positive />
                <Stat label="Wrong" value={result.wrong} negative />
                <Stat label="Unattempted" value={result.unattempted} />
                <Stat label="Accuracy" value={`${result.accuracy}%`} />
                <Stat label="Time Taken" value={`${Math.floor(result.timeTaken/60)}m ${result.timeTaken%60}s`} />
              </div>
            ) : (
              <p className="mt-2 text-sm text-emerald-700">Scoring...</p>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {questions.map((q, i) => {
              const sel = answers[i];
              const isCorrect = sel === q.answerIndex;
              return (
                <div key={q.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Q{i + 1} • {q.subject}</span>
                    {sel == null ? (
                      <span className="rounded bg-slate-100 px-2 py-0.5">Unattempted</span>
                    ) : isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={14}/> Correct</span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600"><XCircle size={14}/> Wrong</span>
                    )}
                  </div>
                  <p className="font-medium">{q.text}</p>
                  <div className="mt-2 grid gap-2">
                    {q.options.map((opt, oi) => {
                      const chosen = sel === oi;
                      const correct = q.answerIndex === oi;
                      return (
                        <div
                          key={oi}
                          className={`rounded border p-2 text-sm ${
                            correct ? 'border-emerald-300 bg-emerald-50' : chosen ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
                          }`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button onClick={onExit} className="rounded-md bg-indigo-600 px-3 py-1.5 text-white shadow hover:bg-indigo-700">Back to Tests</button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ q, qIndex, total, selected, onSelect }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>Q{qIndex + 1} / {total} • {q.subject}</span>
      </div>
      <p className="font-medium">{q.text}</p>
      <div className="mt-3 grid gap-2">
        {q.options.map((opt, i) => (
          <label key={i} className={`flex cursor-pointer items-center gap-3 rounded border p-2 text-sm transition ${selected === i ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
            <input
              type="radio"
              name={`q-${q.id}`}
              className="h-4 w-4 accent-indigo-600"
              checked={selected === i}
              onChange={() => onSelect(i)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, positive, negative, highlight }) {
  return (
    <div className={`rounded-lg border p-3 ${
      highlight ? 'border-amber-300 bg-amber-50' : positive ? 'border-emerald-200 bg-emerald-50' : negative ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'
    }`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
