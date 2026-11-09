export type PlayerId = 'clyde' | 'clark';
export type Term = '1st term' | '2nd term';
export type Category = 'science' | 'math' | 'language' | 'humanities' | 'arts';
export interface Player { id: PlayerId; name: string; initials: string; grade: number; role: string }
export interface Question { id: string; prompt: string; options: string[]; answer: number; context?: string }
export interface Reviewer { id: string; title: string; description: string; player: PlayerId | 'unassigned'; category: Category; term: Term; questions: Question[] }
export interface Attempt { reviewerId: string; playerId: PlayerId; score: number; total: number; date: string }
export type View = 'library' | 'progress';
