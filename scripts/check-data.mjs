import fs from 'node:fs';
const catalog = JSON.parse(fs.readFileSync('src/data/catalog.json', 'utf8'));
const ids = new Set();
let total = 0;
for (const entry of catalog) {
 if (ids.has(entry.id)) throw new Error(`Duplicate reviewer ${entry.id}`);
 ids.add(entry.id);
 if (!['clyde','clark','unassigned'].includes(entry.player)) throw new Error(`Invalid player ${entry.id}`);
 if (!['science','math','language','humanities','arts'].includes(entry.category)) throw new Error(`Invalid category ${entry.id}`);
 if (!['1st term','2nd term'].includes(entry.term)) throw new Error(`Invalid term ${entry.id}`);
 const owner = entry.player === 'clyde' ? 'CLYreviewer' : entry.player === 'clark' ? 'CLARKreviewer' : 'unassigned';
 const termFolder = entry.term === '1st term' ? '1stTERM' : '2ndTERM';
 if (entry.questionFile !== `${owner}/${termFolder}/${entry.id}.json`) throw new Error(`Invalid folder for ${entry.id}`);
 const questions = JSON.parse(fs.readFileSync(`src/data/${entry.questionFile}`, 'utf8'));
 if (!questions.length) throw new Error(`Empty bank ${entry.id}`);
 const questionIds = new Set();
 for (const q of questions) {
  if (questionIds.has(q.id) || typeof q.id !== 'string') throw new Error(`Invalid question ID in ${entry.id}`);
  questionIds.add(q.id);
  if (typeof q.prompt !== 'string' || !q.prompt.trim() || !Array.isArray(q.options) || q.options.length < 2 || !q.options.every(o => typeof o === 'string' && o.trim()) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) throw new Error(`Invalid question ${q.id}`);
 }
 total += questions.length;
 console.log(`OK ${entry.id}: ${questions.length} questions`);
}
console.log(`Validated ${catalog.length} reviewers and ${total} questions.`);
