import {checklistFor,visibleQuestions,noticesFor,hasAnswer,isComplete,setAnswer} from './rules.js';

export function freshRecord(p) {
  return {version:p.version,answers:{},checked:[],needsHelp:[],lastStep:0,item:'',tutorials:{}};
}

export function restoreRecord(p,saved) {
  const r=freshRecord(p);
  if(saved?.version!==p.version)return r;
  for(const q of p.questions)if(saved.answers&&Object.hasOwn(saved.answers,q.id)){
    try{r.answers=setAnswer(p,r.answers,q.id,saved.answers[q.id]);}catch{}
  }
  const ids=checklistFor(p,r.answers).map(i=>i.id);
  r.checked=Array.isArray(saved.checked)?[...new Set(saved.checked.filter(id=>ids.includes(id)))]:[];
  r.needsHelp=Array.isArray(saved.needsHelp)?[...new Set(saved.needsHelp.filter(id=>ids.includes(id)&&!r.checked.includes(id)))]:[];
  r.lastStep=Number.isInteger(saved.lastStep)&&saved.lastStep>=0&&saved.lastStep<=4?saved.lastStep:(isComplete(p,r.answers)?1:0);
  r.item=ids.includes(saved.item)?saved.item:'';
  for(const [key,value] of Object.entries(saved.tutorials||{}).slice(0,80)){
    if(!/^prep-[a-z0-9-]+$/.test(key)||!value||typeof value!=='object')continue;
    const steps={};
    for(const [path,step] of Object.entries(value.steps||{}).slice(0,20))if(/^\d{1,2}$/.test(path)&&Number.isInteger(step)&&step>=0&&step<100)steps[path]=step;
    r.tutorials[key]={path:Number.isInteger(value.path)&&value.path>=0&&value.path<20?value.path:0,steps};
  }
  return r;
}

export function resumePoint(p,r) {
  if(!isComplete(p,r.answers)){
    const questions=visibleQuestions(p,r.answers),block=noticesFor(p,r.answers).find(n=>n.blocking);
    const question=block?questions.findIndex(q=>q.id===block.when.question):questions.findIndex(q=>!hasAnswer(r.answers[q.id]));
    return {step:0,item:'',question:Math.max(0,question)};
  }
  const step=r.lastStep>=1&&r.lastStep<=4?r.lastStep:1;
  const item=step===1&&checklistFor(p,r.answers).some(i=>i.id===r.item)?r.item:'';
  return {step,item,question:0};
}

export function pruneProgress(p,r) {
  const ids=checklistFor(p,r.answers).map(i=>i.id);
  r.checked=r.checked.filter(id=>ids.includes(id));
  r.needsHelp=r.needsHelp.filter(id=>ids.includes(id)&&!r.checked.includes(id));
  if(!ids.includes(r.item))r.item='';
  for(const key of Object.keys(r.tutorials))if(!ids.some(id=>key===`prep-${id}`||key.startsWith(`prep-${id}-`)))delete r.tutorials[key];
}

export function setPreparationStatus(r,id,status) {
  r.checked=r.checked.filter(value=>value!==id);
  r.needsHelp=r.needsHelp.filter(value=>value!==id);
  if(status==='ready')r.checked.push(id);
  if(status==='help')r.needsHelp.push(id);
}
