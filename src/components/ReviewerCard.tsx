import { Atom, BookOpen, Calculator, Globe2, Palette, ArrowUpRight, Trophy } from 'lucide-react';
import type { Attempt, Category, Reviewer } from '../types';
export const categoryIcons = { science: Atom, math: Calculator, language: BookOpen, humanities: Globe2, arts: Palette };
export function ReviewerCard({ reviewer, attempts, onStart }: { reviewer: Reviewer; attempts: Attempt[]; onStart: () => void }) {
 const Icon = categoryIcons[reviewer.category];
 const scores = attempts.filter(a => a.reviewerId === reviewer.id);
 const best = scores.length ? Math.max(...scores.map(a => Math.round(a.score / a.total * 100))) : null;
 return <article className="reviewer-card"><div className="flex items-start justify-between gap-4"><span className={`subject-icon ${reviewer.category}`}><Icon size={25}/></span><span className="tag">{reviewer.term}</span></div><div className="mt-7"><p className="eyebrow">{categoryLabel(reviewer.category)}</p><h3 className="mt-2 text-xl font-semibold tracking-tight">{reviewer.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{reviewer.description}</p></div><div className="card-footer"><span className="text-sm font-medium">{best === null ? `${reviewer.questions.length} questions` : <span className="flex items-center gap-2"><Trophy size={15}/>Best: {best}%</span>}</span><button className="icon-button" onClick={onStart} aria-label={`Start ${reviewer.title}`}><ArrowUpRight size={22}/></button></div></article>;
}
export function categoryLabel(category: Category) { return { science:'Science lab', math:'Number quest', language:'Word world', humanities:'People & values', arts:'Creative zone' }[category]; }
