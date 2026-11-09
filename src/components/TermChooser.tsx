import { ArrowLeft, ArrowRight, BookOpen, CalendarDays } from 'lucide-react';
import { reviewers } from '../data';
import { terms } from '../routes';
import type { Player } from '../types';

export function TermChooser({ player }: { player: Player }) {
 return <main className={`profile-chooser student-${player.id}`} id="main">
  <div className="profile-chooser-inner">
   <a className="text-button" href="#/"><ArrowLeft size={18}/>Switch profile</a>
   <header className="chooser-heading"><span className={`avatar term-avatar ${player.id}`}>{player.initials}</span><p className="eyebrow mt-5">{player.name} · Grade {player.grade}</p><h1>Choose your term</h1><p>Pick a school term to see its subjects and reviewers.</p></header>
   <div className="profile-grid">{terms.map((term, index) => {
    const count = reviewers.filter(reviewer => reviewer.player === player.id && reviewer.term === term.label).length;
    return <a className={`profile-card profile-${player.id}`} href={`#/${player.id}/${term.folder}`} key={term.folder}>
     <div className="flex items-center justify-between gap-4"><span className="term-card-icon"><CalendarDays size={28}/></span><span className="profile-grade">{count} {count === 1 ? 'subject' : 'subjects'}</span></div>
     <div><p className="eyebrow">SCHOOL TERM {index + 1}</p><h2>{term.label}</h2><p>{count ? 'Open the subjects and practice for this term.' : 'No subjects added yet. You can still open this term.'}</p></div>
     <span className="profile-enter"><span className="flex items-center gap-2"><BookOpen size={18}/>Open {term.label}</span><ArrowRight size={21}/></span>
    </a>;
   })}</div>
  </div>
 </main>;
}
