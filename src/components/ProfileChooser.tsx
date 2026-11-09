import { ArrowRight, Gamepad2, GraduationCap, ShieldCheck } from 'lucide-react';
import { players } from '../data';

export function ProfileChooser() {
 return <main className="profile-chooser" id="main">
  <div className="profile-chooser-inner">
   <div className="chooser-brand"><span className="brand-icon"><Gamepad2 size={28}/></span><span>reviewer <strong>ARCADE</strong></span></div>
   <header className="chooser-heading"><p className="eyebrow">TWO PLAYERS. TWO LEARNING JOURNEYS.</p><h1>Who’s ready to learn?</h1><p>Choose your profile to open your own subjects and study space.</p></header>
   <div className="profile-grid">{players.map(player => <a className={`profile-card profile-${player.id}`} key={player.id} href={`#/${player.id}`} aria-label={`Open ${player.name}'s Grade ${player.grade} study space`}>
    <div className="flex items-center justify-between gap-4"><span className={`avatar ${player.id}`}>{player.initials}</span><span className="profile-grade"><GraduationCap size={18}/>Grade {player.grade}</span></div>
    <div><p className="eyebrow">YOUR PERSONAL STUDY SPACE</p><h2>{player.name}</h2><p>Your subjects, term reviewers, and progress.<br/>All in your own space.</p></div>
    <span className="profile-enter">Enter study space<ArrowRight size={21}/></span>
   </a>)}</div>
   <p className="chooser-note"><ShieldCheck size={18}/>Separate subjects. Separate progress. A pace of your own.</p>
  </div>
 </main>;
}
