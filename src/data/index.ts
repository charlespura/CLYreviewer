import type { Player, Reviewer } from '../types';
import catalog from './catalog.json';
const banks = import.meta.glob<{ default: Reviewer['questions'] }>(['./CLYreviewer/**/*.json', './CLARKreviewer/**/*.json', './unassigned/**/*.json'], { eager: true });
export const reviewers: Reviewer[] = catalog.map(entry => ({ ...entry, player: entry.player as Reviewer['player'], category: entry.category as Reviewer['category'], term: entry.term as Reviewer['term'], questions: banks[`./${entry.questionFile}`].default }));
export const players: Player[] = [
 { id: 'clyde', name: 'Clyde Justin', initials: 'CJ', grade: 9, role: 'The explorer' },
 { id: 'clark', name: 'Clark', initials: 'CK', grade: 5, role: 'The adventurer' },
];
