import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Gamepad2, LayoutGrid, Menu, Search, ShieldCheck, Swords, Target, Trophy, X, Zap } from 'lucide-react';
import { players, reviewers } from './data';
import type { Category, PlayerId, Reviewer, Term, View } from './types';
import { ReviewerCard } from './components/ReviewerCard';
import { Quiz } from './components/Quiz';
import { useProgress } from './hooks/useProgress';
import { ProfileChooser } from './components/ProfileChooser';
import { TermChooser } from './components/TermChooser';
import { readRoute } from './routes';
const filters: { label: string; value: Category | 'all' }[] = [{label:'All subjects',value:'all'},{label:'Science',value:'science'},{label:'Math',value:'math'},{label:'Languages',value:'language'},{label:'Humanities',value:'humanities'},{label:'Arts & MAPEH',value:'arts'}];
export default function App() {
 const [route, setRoute] = useState(() => readRoute(window.location.hash));
 useEffect(() => {
  function updateProfile() { setRoute(readRoute(window.location.hash)); window.scrollTo(0, 0); }
  window.addEventListener('hashchange', updateProfile);
  return () => window.removeEventListener('hashchange', updateProfile);
 }, []);
 if (route.screen === 'profiles') return <ProfileChooser/>;
 if (route.screen === 'terms') return <TermChooser player={players.find(player => player.id === route.playerId) ?? players[0]}/>;
 return <StudentDashboard key={`${route.playerId}-${route.term}`} playerId={route.playerId} term={route.term}/>;
}

function StudentDashboard({ playerId, term }: { playerId: PlayerId; term: Term }) {
 const [view, setView] = useState<View>('library');
 const [mobileOpen, setMobileOpen] = useState(false);
 const [search, setSearch] = useState('');
 const [category, setCategory] = useState<Category | 'all'>('all');
 const [active, setActive] = useState<Reviewer | null>(null);
 const sidebar = useRef<HTMLElement>(null);
 const menuButton = useRef<HTMLButtonElement>(null);
 useEffect(() => {
  if (!mobileOpen) return;
  const before = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const buttons = sidebar.current?.querySelectorAll<HTMLElement>('a, button');
  buttons?.[0]?.focus();
  function handleKey(event: KeyboardEvent) {
   if (event.key === 'Escape') setMobileOpen(false);
   if (event.key !== 'Tab' || !buttons?.length) return;
   const first = buttons[0];
   const last = buttons[buttons.length - 1];
   if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
   else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', handleKey);
  return () => { document.body.style.overflow = before; document.removeEventListener('keydown', handleKey); menuButton.current?.focus(); };
 }, [mobileOpen]);
 const { attempts, save, storageError } = useProgress();
 const player = players.find(p => p.id === playerId) ?? players[0];
 const library = reviewers.filter(r => r.player === playerId && r.term === term);
 const ownedReviewerIds = new Set(library.map(r => r.id));
 const personalAttempts = attempts.filter(a => a.playerId === playerId && ownedReviewerIds.has(a.reviewerId));
 const xp = personalAttempts.reduce((n,a) => n + a.score * 10, 0);
 const completed = new Set(personalAttempts.map(a => a.reviewerId)).size;
 const filtered = library.filter(r => (category === 'all' || r.category === category) && `${r.title} ${r.description}`.toLowerCase().includes(search.toLowerCase().trim()));
 const nextReviewer = library.find(r => !personalAttempts.some(a => a.reviewerId === r.id)) ?? library[0];
 function navigate(next: View) { setView(next); setMobileOpen(false); }
 return <div className={`app-shell student-${playerId}`}>
  <a className="skip-link" href="#main">Skip to content</a>
  <aside ref={sidebar} className={`sidebar ${mobileOpen ? 'is-open' : ''}`} aria-label="Main navigation">
   <a className="brand" href="./" aria-label="Reviewer Arcade home"><span className="brand-icon"><Gamepad2 size={26}/></span><span>reviewer<span className="block brand-sub">ARCADE</span></span></a>
   <button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X/></button>
   <p className="sidebar-label">YOUR PLAYGROUND</p>
   <nav className="space-y-2"><button className={`nav-link ${view === 'library' ? 'active' : ''}`} onClick={() => navigate('library')} aria-current={view === 'library' ? 'page' : undefined}><LayoutGrid size={20}/>Study library<span className="nav-count">{library.length}</span></button><button className={`nav-link ${view === 'progress' ? 'active' : ''}`} onClick={() => navigate('progress')} aria-current={view === 'progress' ? 'page' : undefined}><Trophy size={20}/>My progress</button></nav>
   <div className="player-section"><p className="sidebar-label">YOUR PROFILE</p><div className="student-identity"><span className={`avatar ${playerId}`}>{player.initials}</span><div><strong>{player.name}</strong><p>Grade {player.grade}</p></div></div><a className="switch-profile" href={`#/${playerId}`}><BookOpen size={17}/>Change term</a><a className="switch-profile" href="#/"><ArrowLeft size={17}/>Switch profile</a></div>
   <div className="sidebar-note"><ShieldCheck size={22}/><p>Your pace.<br/><strong>Your next level.</strong></p><span>A little practice goes a long way.</span></div><div className="sidebar-bottom"><span className="status-dot"/>Your own learning journey</div>
  </aside>
  {mobileOpen && <button className="mobile-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay"/>}
  <div className="main-column"><header className="topbar"><div className="flex items-center gap-3"><button ref={menuButton} className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen}><Menu/></button><span className="breadcrumb">{player.name} <span>/</span> <strong>{view === 'library' ? 'Study library' : 'My progress'}</strong></span></div><div className="flex items-center gap-4"><span className="top-xp"><Zap size={16}/>{xp.toLocaleString()} XP</span><span className={`avatar small ${playerId}`} aria-label={`Current player: ${player.name}`}>{player.initials}</span></div></header>
  {storageError && <p role="alert" className="storage-alert">Your browser could not save progress. Results may be lost when you close it.</p>}
  {active ? <div id="main"><Quiz key={`${playerId}-${active.id}`} reviewer={active} playerId={playerId} onExit={() => setActive(null)} onComplete={save}/></div> : <main id="main" className="page-content">
   <div className="page-heading"><div><p className="eyebrow flex items-center gap-2"><span className="status-dot"/>PLAYER {String(players.findIndex(p => p.id === playerId) + 1).padStart(2,'0')} · READY TO LEARN</p><h1>Let’s level up, {player.name}<span className="heading-dot">.</span></h1><p className="text-muted mt-3">Grade {player.grade} subjects, selected for {player.name}.</p></div><a className="term-badge" href={`#/${playerId}`}><BookOpen size={16}/>{term}<span className="term-change-label">Change term</span><ArrowLeft size={16}/></a></div>
   {view === 'library' ? <>
    <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><span className="hero-kicker"><Swords size={15}/>THE NEXT LEVEL STARTS HERE</span><h2 id="hero-title">A little practice.<br/>A lot more possibility.</h2><p>Your next challenge is waiting. Build confidence,<br className="hidden lg:block"/> one question at a time.</p><button className="hero-button" disabled={!nextReviewer} onClick={() => setActive(nextReviewer ?? null)}>Let’s play & learn<ArrowRight size={19}/></button><span className="hero-footnote">No timer. No pressure. Just progress.</span></div><div className="arcade-art" aria-hidden="true"><div className="art-cross cross-one">+</div><div className="art-cross cross-two">+</div><div className="orbit-circle"/><div className="pixel-star star-one"/><div className="pixel-star star-two"/><div className="level-ticket"><Zap size={16}/>KNOWLEDGE +10</div><div className="game-console"><div className="console-top"><span/>RA—01</div><div className="console-screen"><Trophy size={61} strokeWidth={1.5}/><span>LEVEL UP!</span></div><div className="console-controls"><div className="dpad"/><div className="console-buttons"><i/><i/></div></div><div className="speaker"><i/><i/><i/><i/></div></div><div className="art-caption">GOOD THINGS TAKE PRACTICE.</div></div></section>
    <section className="stats-grid" aria-label="Your study statistics"><div className="stat"><span className="stat-icon"><BookOpen size={21}/></span><div><strong>{library.length}<span>reviewers</span></strong><p>New things to discover</p></div></div><div className="stat"><span className="stat-icon"><Target size={21}/></span><div><strong>{completed}<span>completed</span></strong><p>Every finish counts</p></div></div><div className="stat"><span className="stat-icon"><Zap size={21}/></span><div><strong>{xp.toLocaleString()}<span>total XP</span></strong><p>10 XP per correct answer</p></div></div></section>
    <section aria-labelledby="library-heading" className="library-section"><div className="section-heading"><div><h2 id="library-heading">Choose your next quest</h2><p className="text-muted text-sm mt-2">Your subjects. Your starting point.</p></div><label className="search"><Search size={19}/><span className="sr-only">Search reviewers</span><input placeholder="Find a reviewer…" value={search} onChange={e => setSearch(e.target.value)}/>{search && <button className="icon-button" onClick={() => setSearch('')} aria-label="Clear search"><X size={16}/></button>}</label></div><div className="filter-row" aria-label="Filter by subject">{filters.map(f => <button key={f.value} className={`filter-button ${category === f.value ? 'selected' : ''}`} onClick={() => setCategory(f.value)} aria-pressed={category === f.value}>{f.label}{f.value === 'all' && <span>{library.length}</span>}</button>)}</div>
     {filtered.length ? <div className="reviewer-grid">{filtered.map(r => <ReviewerCard key={r.id} reviewer={r} attempts={personalAttempts} onStart={() => setActive(r)}/>)}</div> : <div className="empty-state"><Search size={30}/><h3>{library.length ? "No quests found" : "This term is ready for new subjects"}</h3><p>{library.length ? "Try a different subject or search term." : `No ${term} reviewers have been added for ${player.name} yet.`}</p><button className="secondary-button" onClick={() => { setSearch(''); setCategory('all'); }}>Show all reviewers</button></div>}
    </section>
   </> : <section className="progress-section"><div className="section-heading"><div><h2>Your learning journey</h2><p className="text-muted mt-2">Real practice. Real progress. All yours.</p></div><span className="tag"><Trophy size={16}/>{xp} XP</span></div>{personalAttempts.length ? <div className="history-list">{[...personalAttempts].reverse().map((a,i) => <article key={`${a.date}-${i}`} className="history-item"><span className="stat-icon"><Trophy size={22}/></span><div className="flex-1"><h3 className="font-semibold">{reviewers.find(r => r.id === a.reviewerId)?.title ?? a.reviewerId}</h3><p className="text-sm text-muted mt-1">{new Date(a.date).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})} · {a.score} / {a.total} correct</p></div><strong>{Math.round(a.score / a.total * 100)}%</strong></article>)}</div> : <div className="empty-state"><Trophy size={42}/><h3>Your story starts here.</h3><p>Finish your first reviewer to earn XP and see your results.</p><button className="primary-button" onClick={() => setView('library')}>Find a quest<ArrowRight size={18}/></button></div>}<p className="text-sm text-muted mt-6">Progress is stored in this browser, separately for each player.</p></section>}
   <footer className="page-footer"><span><Gamepad2 size={17}/>Built for curious minds.</span><span>{player.name} / {term}</span></footer>
  </main>}</div>
 </div>;
}

