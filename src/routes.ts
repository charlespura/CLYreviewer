import type { PlayerId, Term } from './types';

export type Route = { screen: 'profiles' } | { screen: 'terms'; playerId: PlayerId } | { screen: 'subjects'; playerId: PlayerId; term: Term };
export const terms: { label: Term; folder: string }[] = [
 { label: '1st term', folder: '1stTERM' },
 { label: '2nd term', folder: '2ndTERM' },
];
export function readRoute(hash: string): Route {
 const [playerId, folder, ...extra] = hash.replace(/^#\//, '').split('/');
 if (playerId !== 'clyde' && playerId !== 'clark') return { screen: 'profiles' };
 const term = terms.find(item => item.folder === folder)?.label;
 return term && extra.length === 0 ? { screen: 'subjects', playerId, term } : { screen: 'terms', playerId };
}
