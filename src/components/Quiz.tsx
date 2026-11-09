import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react';
import type { Attempt, PlayerId, Question, Reviewer } from '../types';
function shuffle<T,>(items: T[]): T[] {
 const result = [...items];
 for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
 return result;
}
function prepare(questions: Question[]): Question[] {
 return shuffle(questions).map(q => {
  const options = shuffle(q.options.map((text, index) => ({ text, index })));
  return { ...q, options: options.map(o => o.text), answer: options.findIndex(o => o.index === q.answer) };
 });
}
export function Quiz({ reviewer, playerId, onExit, onComplete }: { reviewer: Reviewer; playerId: PlayerId; onExit: () => void; onComplete: (attempt: Attempt) => void }) {
 const [questions, setQuestions] = useState(() => prepare(reviewer.questions));
 const [index, setIndex] = useState(0);
 const [selected, setSelected] = useState<number | null>(null);
 const [checked, setChecked] = useState(false);
 const [score, setScore] = useState(0);
 const [done, setDone] = useState(false);
 const saved = useRef(false);
 const heading = useRef<HTMLHeadingElement>(null);
 const question = questions[index];
 function next() {
  if (index === questions.length - 1) {
   if (!saved.current) { saved.current = true; onComplete({ reviewerId: reviewer.id, playerId, score, total: questions.length, date: new Date().toISOString() }); }
   setDone(true);
  } else { setIndex(index + 1); setSelected(null); setChecked(false); }
  requestAnimationFrame(() => heading.current?.focus());
 }
 function restart() { setQuestions(prepare(reviewer.questions)); setIndex(0); setSelected(null); setChecked(false); setScore(0); setDone(false); saved.current = false; }
 return <main className="quiz-shell"><button onClick={onExit} className="text-button"><ArrowLeft size={18}/>Back to library</button><div className="quiz-panel"><div className="flex items-center justify-between gap-4"><span className="eyebrow">{reviewer.title}</span><span className="tag">{done ? 'Challenge complete' : `${index + 1} / ${questions.length}`}</span></div><div className="progress-track my-6"><div style={{ width: `${done ? 100 : index / questions.length * 100}%` }}/></div>{done ? <div className="result"><Trophy size={56} strokeWidth={1.5}/><p className="eyebrow mt-6">Every attempt is progress</p><h1 ref={heading} tabIndex={-1} className="mt-3 text-4xl font-bold tracking-tight">Challenge complete!</h1><p className="my-6 text-xl">{score} of {questions.length} correct · {Math.round(score / questions.length * 100)}%</p><p className="text-muted mb-8">{score / questions.length >= .8 ? 'Great work. Your practice is paying off.' : 'Keep exploring. A fresh attempt is another chance to learn.'}</p><div className="flex flex-wrap justify-center gap-4"><button className="primary-button" onClick={restart}><RotateCcw size={18}/>Play again</button><button className="secondary-button" onClick={onExit}>Back to library</button></div></div> : <><p className="text-sm font-medium text-muted mb-4">Choose one answer. Take your time.</p><h1 ref={heading} tabIndex={-1} className="question-title">{question.prompt}</h1>{question.context && <p className="context">{question.context}</p>}<fieldset className="options"><legend className="sr-only">Answer choices</legend>{question.options.map((option, i) => <label key={i} className={`option ${selected === i ? 'selected' : ''} ${checked && i === question.answer ? 'correct' : ''} ${checked && selected === i && i !== question.answer ? 'incorrect' : ''}`}><input type="radio" name="answer" checked={selected === i} onChange={() => setSelected(i)} disabled={checked}/><span className="option-letter">{String.fromCharCode(65 + i)}</span><span className="flex-1">{option}</span>{checked && i === question.answer && <Check size={20}/>} {checked && selected === i && i !== question.answer && <X size={20}/>}</label>)}</fieldset><div aria-live="polite">{checked && <p className="feedback">{selected === question.answer ? 'Correct! Nicely done.' : `Keep learning. Correct answer: ${question.options[question.answer]}`}</p>}</div><div className="flex flex-wrap items-center justify-between gap-4 mt-8"><span className="text-sm font-medium">{score} correct so far</span>{checked ? <button className="primary-button" onClick={next}>{index === questions.length - 1 ? 'See results' : 'Next question'}<ArrowRight size={18}/></button> : <button className="primary-button" disabled={selected === null} onClick={() => { setChecked(true); if (selected === question.answer) setScore(score + 1); }}>Check answer<Check size={18}/></button>}</div><p className="text-sm text-muted mt-6">Leaving early discards this attempt. Finished results save on this device.</p></>}</div></main>;
}
