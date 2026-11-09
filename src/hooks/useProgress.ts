import { useState } from 'react';
import type { Attempt } from '../types';
function load(): Attempt[] {
 try {
  const value: unknown = JSON.parse(localStorage.getItem('arcade-attempts-v1') ?? '[]');
  if (!Array.isArray(value)) return [];
  return value.filter((item: unknown): item is Attempt => {
   if (typeof item !== 'object' || item === null) return false;
   const a = item as Record<string, unknown>;
   return typeof a.reviewerId === 'string' && ['clyde','clark'].includes(String(a.playerId)) && typeof a.score === 'number' && typeof a.total === 'number' && a.total > 0 && a.score >= 0 && a.score <= a.total && typeof a.date === 'string';
  });
 } catch { return []; }
}
export function useProgress() {
 const [attempts, setAttempts] = useState<Attempt[]>(load);
 const [storageError, setStorageError] = useState(false);
 function save(attempt: Attempt) {
  const next = [...attempts, attempt];
  setAttempts(next);
  try { localStorage.setItem('arcade-attempts-v1', JSON.stringify(next)); } catch { setStorageError(true); }
 }
 return { attempts, save, storageError };
}
