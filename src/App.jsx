import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import ExamSelector from './components/ExamSelector.jsx';
import TestList from './components/TestList.jsx';
import MockTestPlayer from './components/MockTestPlayer.jsx';

const MOCK_DATA = {
  JEE: [
    {
      id: 'jee1',
      title: 'JEE Physics Basics',
      duration: 12, // minutes
      description: 'Kinematics, Newton’s Laws, Work-Energy basics',
      marking: { correct: 4, wrong: -1, unattempted: 0 },
      questions: [
        {
          id: 'J1Q1',
          subject: 'Physics',
          text: 'A body starts from rest and moves with a constant acceleration of 2 m/s^2. What is its velocity after 5 seconds?',
          options: ['2 m/s', '5 m/s', '10 m/s', '20 m/s'],
          answerIndex: 2,
        },
        {
          id: 'J1Q2',
          subject: 'Physics',
          text: 'A projectile is thrown with an initial speed u at 45°. The time of flight is T. What is the maximum height reached?',
          options: ['u^2/(2g)', 'u^2/(4g)', 'u^2/(g)', 'uT/2'],
          answerIndex: 1,
        },
        {
          id: 'J1Q3',
          subject: 'Chemistry',
          text: 'Which of the following has the highest ionization energy?',
          options: ['Na', 'K', 'Rb', 'Mg'],
          answerIndex: 3,
        },
        {
          id: 'J1Q4',
          subject: 'Maths',
          text: 'If f(x) = x^2 - 4x + 4, the minimum value of f(x) is?',
          options: ['0', '2', '4', '-4'],
          answerIndex: 0,
        },
      ],
    },
    {
      id: 'jee2',
      title: 'JEE Mixed Practice Set',
      duration: 15,
      description: 'Mixed set from Physics, Chemistry, and Maths',
      marking: { correct: 4, wrong: -1, unattempted: 0 },
      questions: [
        {
          id: 'J2Q1',
          subject: 'Maths',
          text: 'The derivative of sin(x) + x^2 is:',
          options: ['cos(x) + 2x', 'sin(x) + 2x', 'cos(x) + x', '2x'],
          answerIndex: 0,
        },
        {
          id: 'J2Q2',
          subject: 'Chemistry',
          text: 'Which is a strong electrolyte?',
          options: ['Acetic acid', 'Ammonia', 'NaCl', 'Water'],
          answerIndex: 2,
        },
        {
          id: 'J2Q3',
          subject: 'Physics',
          text: 'Unit of power is:',
          options: ['Joule', 'Watt', 'Newton', 'Pascal'],
          answerIndex: 1,
        },
      ],
    },
  ],
  NEET: [
    {
      id: 'neet1',
      title: 'NEET Biology Quick Check',
      duration: 12,
      description: 'Cell biology, Human physiology, Genetics',
      marking: { correct: 4, wrong: -1, unattempted: 0 },
      questions: [
        {
          id: 'N1Q1',
          subject: 'Biology',
          text: 'Ribosomes are the site of:',
          options: ['DNA replication', 'Protein synthesis', 'Lipid synthesis', 'ATP synthesis'],
          answerIndex: 1,
        },
        {
          id: 'N1Q2',
          subject: 'Biology',
          text: 'Which vitamin is essential for blood clotting?',
          options: ['Vitamin A', 'Vitamin K', 'Vitamin C', 'Vitamin D'],
          answerIndex: 1,
        },
        {
          id: 'N1Q3',
          subject: 'Chemistry',
          text: 'Which of the following is not a greenhouse gas?',
          options: ['CO2', 'CH4', 'N2O', 'N2'],
          answerIndex: 3,
        },
        {
          id: 'N1Q4',
          subject: 'Physics',
          text: 'The speed of light is approximately:',
          options: ['3×10^8 m/s', '3×10^6 m/s', '3×10^5 km/s', '3×10^7 m/s'],
          answerIndex: 0,
        },
      ],
    },
    {
      id: 'neet2',
      title: 'NEET Physics & Chemistry Mini',
      duration: 10,
      description: 'Fundamentals focused practice set',
      marking: { correct: 4, wrong: -1, unattempted: 0 },
      questions: [
        {
          id: 'N2Q1',
          subject: 'Physics',
          text: 'Ohm’s law relates:',
          options: ['V, I, R', 'F, m, a', 'P, V, T', 'Q, m, L'],
          answerIndex: 0,
        },
        {
          id: 'N2Q2',
          subject: 'Chemistry',
          text: 'pH of neutral water at 25°C is:',
          options: ['0', '7', '14', '1'],
          answerIndex: 1,
        },
        {
          id: 'N2Q3',
          subject: 'Biology',
          text: 'Insulin is secreted by:',
          options: ['Alpha cells', 'Beta cells', 'Delta cells', 'Acinar cells'],
          answerIndex: 1,
        },
      ],
    },
  ],
};

export default function App() {
  const [exam, setExam] = useState('JEE');
  const [activeTest, setActiveTest] = useState(null);
  const [result, setResult] = useState(null);

  const tests = useMemo(() => MOCK_DATA[exam] || [], [exam]);

  const handleStart = (testId) => {
    const t = tests.find((x) => x.id === testId);
    if (t) {
      setActiveTest(t);
      setResult(null);
    }
  };

  const handleExit = () => {
    setActiveTest(null);
    setResult(null);
  };

  const handleSubmit = ({ selectedAnswers, timeTaken }) => {
    if (!activeTest) return;
    const { questions, marking } = activeTest;
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    questions.forEach((q, i) => {
      const ans = selectedAnswers[i];
      if (ans == null) unattempted += 1;
      else if (ans === q.answerIndex) correct += 1;
      else wrong += 1;
    });

    const score = correct * marking.correct + wrong * marking.wrong + unattempted * (marking.unattempted || 0);
    const total = questions.length * marking.correct;
    const accuracy = questions.length - unattempted > 0 ? Math.round((correct / (questions.length - unattempted)) * 100) : 0;

    setResult({
      score,
      total,
      correct,
      wrong,
      unattempted,
      accuracy,
      timeTaken,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Header brand="RankUp" subtitle="JEE • NEET Mock Tests" />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {!activeTest && (
          <>
            <section className="mt-6">
              <ExamSelector exam={exam} onChange={setExam} />
            </section>
            <section className="mt-6">
              <TestList exam={exam} tests={tests} onStart={handleStart} />
            </section>
          </>
        )}

        {activeTest && (
          <section className="mt-6">
            <MockTestPlayer
              key={activeTest.id}
              exam={exam}
              test={activeTest}
              onExit={handleExit}
              onSubmit={handleSubmit}
              result={result}
            />
          </section>
        )}
      </main>
    </div>
  );
}
