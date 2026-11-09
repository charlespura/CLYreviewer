import fs from 'node:fs';
import vm from 'node:vm';
const sources = [
 ['mathematics','CLYreviewer/1stTERM/Mathematics.html','Mathematics','Triangles, trigonometry & problem solving','clyde','math'],
 ['english','CLYreviewer/1stTERM/English.html','English','Language, literature & communication','clyde','language'],
 ['filipino','CLYreviewer/1stTERM/Filipino.html','Filipino','Wika, panitikan at pag-unawa','clyde','language'],
 ['values','CLYreviewer/1stTERM/Esp.html','Values Education','Character, choices & everyday values','clyde','humanities'],
 ['clark-science','CLARKreviewer/1stTERM/science1STTERMreviewer.html','Science','Animals, living things & discovery','clark','science'],
 ['clark-english','CLARKreviewer/1stTERM/english1STTERMreviewer.html','English','Build your language superpowers','clark','language'],
 ['clark-filipino','CLARKreviewer/1stTERM/filipino1STTERMreviewer.html','Filipino','Pagbasa, wika at mga kuwento','clark','language'],
 ['clark-ap','CLARKreviewer/1stTERM/ap1STTERMreviewer.html','Araling Panlipunan','People, places & our community','clark','humanities'],
 ['clark-mapeh','CLARKreviewer/1stTERM/mapeh1STterm.html','MAPEH','Music, arts, movement & health','clark','arts'],
 ['chemistry','ChemicalReactions.html','Chemical Reactions','Explore the science of transformation','unassigned','science'],
 ['orange-economy','OrangeEconomy.html','Orange Economy','Where creativity meets opportunity','unassigned','arts']
];
const catalog = [];
for (const [id,file,title,description,player,category] of sources) {
 const html = fs.readFileSync(file,'utf8');
 const match = /const\s+(?:MASTER_QUESTIONS|questionsData)\s*=\s*(\[[\s\S]*?\n\s*\]);/.exec(html);
 if (!match) throw new Error(`Question bank missing: ${file}`);
 const raw = vm.runInNewContext(`(${match[1]})`,Object.create(null),{timeout:1000});
 const questions = raw.map((q,i)=>({id:`${id}-${i+1}`,prompt:q.q,options:q.opts ?? [q.a,q.b,q.c,q.d],answer:q.ans ?? q.correct,...(q.scenario ? {context:q.scenario}: {})}));
 const folder = player === 'clyde' ? 'CLYreviewer' : player === 'clark' ? 'CLARKreviewer' : 'unassigned';
 const questionFile = `${folder}/1stTERM/${id}.json`;
 fs.mkdirSync(`src/data/${folder}/1stTERM`, {recursive:true});
 fs.writeFileSync(`src/data/${questionFile}`,JSON.stringify(questions,null,2));
 catalog.push({id,title,description,player,category,term:'1st term',questionFile,questions});
}
fs.writeFileSync('src/data/catalog.json',JSON.stringify(catalog.map(({questions,...rest})=>rest),null,2));
console.log(`Migrated ${catalog.length} banks / ${catalog.reduce((n,b)=>n+b.questions.length,0)} questions`);
