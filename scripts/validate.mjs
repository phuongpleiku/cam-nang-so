import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {localImagePath,localPdfPath,officialSourceUrl} from '../dist/visuals.js';
import {connectionErrors} from '../dist/connections.js';
const root=new URL('../',import.meta.url);
const errors=[];
const required=(v,label)=>{if(typeof v!=='string'||!v.trim())errors.push(`${label}: cần có nội dung.`);};
const url=(v,label)=>{try{if(new URL(v).protocol!=='https:')throw Error();}catch{errors.push(`${label}: phải là URL HTTPS hợp lệ.`);}};
const unique=(values,label)=>{if(new Set(values).size!==values.length)errors.push(`${label}: mã bị trùng.`);};
async function json(name){const bytes=await readFile(new URL(name,root));const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);return JSON.parse(text);}
const entries=await json('dist/data/index.json');unique(entries.map(e=>e.id),'Danh mục thủ tục');
const connections=await json('dist/data/connections.json');
for(const id of Object.keys(connections.connections||{}))errors.push(...connectionErrors(connections,id).map(e=>`connections.${id}: ${e}`));
if(connections.version!==1||!Object.keys(connections.connections||{}).length)errors.push('Danh mục nơi nộp thiếu hoặc sai phiên bản.');
const tutorials=await json('dist/data/huong-dan-chung.json');
function tutorial(g,label,trail=[]){
 if(!g||typeof g!=='object'){errors.push(`${label}: thiếu hướng dẫn từng bước.`);return;}
 if(g.paths){
  if(!Array.isArray(g.paths)||!g.paths.length){errors.push(`${label}: cần danh sách cách thực hiện.`);return;}
  for(const path of g.paths){required(path.label,`${label}.path.label`);tutorial(path,`${label}.${path.label}`,trail);}
 }else{
  if(!Array.isArray(g.steps)||!g.steps.length)errors.push(`${label}: cần ít nhất một bước.`);
  for(const s of g.steps||[]){required(s.title,`${label}.step.title`);required(s.action,`${label}.step.action`);for(const l of s.links||[]){required(l.label,`${label}.link.label`);url(l.url,`${label}.link.url`);}}
  required(g.ready,`${label}.ready`);
 }
 for(const t of g.troubleshooting||[]){required(t.problem,`${label}.problem`);required(t.solution,`${label}.solution`);}
 if(g.sources?.length){required(g.reviewedAt,`${label}.reviewedAt`);for(const s of g.sources){required(s.label,`${label}.source.label`);url(s.url,`${label}.source.url`);}}
 if(g.relatedGuide){if(trail.includes(g.relatedGuide))errors.push(`${label}: tham chiếu hướng dẫn bị lặp.`);else tutorial(tutorials[g.relatedGuide],`${label}.relatedGuide`,[...trail,g.relatedGuide]);}
}
for(const [id,g] of Object.entries(tutorials))tutorial(g,`Hướng dẫn chung: ${id}`,[id]);
for(const entry of entries){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)){errors.push('Mã thủ tục không hợp lệ.');continue;}
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(entry.file)){errors.push('Tên tệp không hợp lệ');continue;}
  const p=await json(`dist/data/${entry.file}`),label=entry.file;
 if(p.id!==entry.id)errors.push(`${label}: id không khớp danh mục.`);
 if(!Number.isInteger(p.version)||p.version<1)errors.push(`${label}: version phải là số nguyên dương.`);
 for(const key of ['title','shortTitle','description','category','officialName','intro','reviewedAt','duration','fees','followUp'])required(p[key],`${label}.${key}`);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(p.reviewedAt)||Number.isNaN(Date.parse(p.reviewedAt)))errors.push(`${label}: ngày kiểm tra nguồn không hợp lệ.`);
 if(entry.published||p.connectionRef)errors.push(...connectionErrors(connections,p.connectionRef).map(e=>`${label}.connectionRef: ${e}`));
 for(const key of ['keywords','questions','notices','checklist','fields','sources','submission','results'])if(!Array.isArray(p[key]))errors.push(`${label}.${key}: cần là danh sách.`);
 if(!p.questions?.length||!p.checklist?.length||!p.fields?.length||!p.sources?.length)errors.push(`${label}: thiếu nội dung hướng dẫn.`);
 const questions=new Map((p.questions||[]).map(q=>[q.id,q]));
 for(const q of p.questions||[])if(q.help){required(q.help.title,`${label}.${q.id}.help.title`);required(q.help.text,`${label}.${q.id}.help.text`);if(q.help.visualId&&!(p.visuals||[]).some(v=>v.id===q.help.visualId))errors.push(`${label}.${q.id}: hình câu hỏi không tồn tại.`);}
 function condition(c,name,before){if(!c)return;const q=questions.get(c.question);if(!q||!Array.isArray(c.values)||!c.values.length||c.values.some(v=>!q.options.some(o=>o.value===v)))errors.push(`${name}: điều kiện tham chiếu không hợp lệ.`);if(before&&p.questions.findIndex(q=>q.id===c.question)>=p.questions.findIndex(q=>q.id===before))errors.push(`${name}: câu hỏi chỉ được phụ thuộc câu hỏi phía trước.`);}
 unique((p.questions||[]).map(q=>q.id),`${label}.questions`);
 for(const q of p.questions||[]){required(q.id,`${label}.question.id`);required(q.title,`${label}.${q.id}.title`);if(q.type&&!['single','multiple'].includes(q.type))errors.push(`${label}.${q.id}: type không hợp lệ.`);if(!q.options?.length)errors.push(`${label}.${q.id}: thiếu lựa chọn.`);unique((q.options||[]).map(o=>o.value),`${label}.${q.id}`);for(const o of q.options||[]){required(o.value,'option.value');required(o.label,'option.label');}condition(q.when,`${label}.${q.id}`,q.id);}
 unique((p.checklist||[]).map(i=>i.id),`${label}.checklist`);
 for(const item of p.checklist||[]){
  for(const key of ['id','title','kind','help','missing'])required(item[key],`${label}.checklist.${key}`);
  condition(item.when,`${label}.${item.id}`);
  if(item.guide&&item.guideRef)errors.push(`${label}.${item.id}: chỉ dùng guide hoặc guideRef.`);
  if(item.guide) tutorial(item.guide,`${label}.${item.id}`);
  else if(item.guideRef) tutorial(tutorials[item.guideRef],`${label}.${item.id}.guideRef`,[item.guideRef]);
  else if(entry.published)errors.push(`${label}.${item.id}: thủ tục hiện hành cần hướng dẫn từng bước.`);
  if(item.visualId&&!(p.visuals||[]).some(v=>v.id===item.visualId&&v.stage==='chuan-bi'))errors.push(`${label}.${item.id}: không tìm thấy hình minh họa chuẩn bị.`);
 }
 for(const item of p.fields||[]){required(item.title,'field.title');required(item.body,'field.body');condition(item.when,`${label}.field`);}
 if(p.resultItems){if(!Array.isArray(p.resultItems))errors.push(`${label}.resultItems: cần danh sách.`);else for(const item of p.resultItems){required(item.text,'result.text');condition(item.when,`${label}.resultItems`);}}
 for(const item of p.notices||[]){required(item.title,'notice.title');required(item.text,'notice.text');condition(item.when,`${label}.notice`);}
 for(const s of p.sources||[]){required(s.label,'source.label');url(s.url,'source.url');}
 if(p.visuals!==undefined&&!Array.isArray(p.visuals))errors.push(`${label}.visuals: cần là danh sách.`);
 unique((p.visuals||[]).map(v=>v.id),`${label}.visuals`);
 for(const v of p.visuals||[]){
  for(const key of ['id','title','alt','caption'])required(v[key],`${label}.visuals.${key}`);
  if(!['chuan-bi','cach-dien'].includes(v.stage))errors.push(`${label}.visuals.stage: chỉ hỗ trợ chuan-bi hoặc cach-dien.`);
  if(!localImagePath(v.src))errors.push(`${label}.visuals.src: đường dẫn hình không hợp lệ.`);
  else try{await readFile(new URL('dist/'+v.src,root));}catch{errors.push(`${label}: thiếu hình ${v.src}`);}
  if(v.kind==='official-template'){
   if(!officialSourceUrl(v.source?.url))errors.push(`${label}.${v.id}: nguồn mẫu phải là HTTPS của cơ quan nhà nước.`);
   required(v.source?.label,`${label}.${v.id}.source.label`);required(v.readingTip,`${label}.${v.id}.readingTip`);
   if(!/^\d{4}-\d{2}-\d{2}$/.test(v.reviewedAt||''))errors.push(`${label}.${v.id}: thiếu ngày đối chiếu mẫu.`);
   if(!localPdfPath(v.originalPdf))errors.push(`${label}.${v.id}: đường dẫn PDF không hợp lệ.`);
   else try{const pdf=await readFile(new URL('dist/'+v.originalPdf,root));if(pdf.subarray(0,4).toString()!=='%PDF')errors.push(`${label}.${v.id}: tệp gốc không phải PDF.`);}catch{errors.push(`${label}.${v.id}: thiếu PDF gốc.`);}
   if(!Array.isArray(v.pages)||!v.pages.length)errors.push(`${label}.${v.id}: thiếu trang mẫu.`);
   else{
    if(v.src!==v.pages[0].src)errors.push(`${label}.${v.id}: hình xem trước phải là trang đầu.`);
    for(const page of v.pages){
     for(const key of ['label','alt','note'])required(page[key],`${label}.${v.id}.page.${key}`);
     for(const key of ['sourcePage','width','height'])if(!Number.isInteger(page[key])||page[key]<1)errors.push(`${label}.${v.id}.page.${key}: phải là số nguyên dương.`);
     if(!localImagePath(page.src))errors.push(`${label}.${v.id}: đường dẫn trang không hợp lệ.`);
     else try{await readFile(new URL('dist/'+page.src,root));}catch{errors.push(`${label}.${v.id}: thiếu ảnh trang ${page.src}`);}
    }
   }
  }
 }
 for(const item of [...(p.submission||[]),...(p.results||[])])required(item,`${label}.step`);
 if(entry.published&&JSON.stringify(p).includes('CẦN BIÊN SOẠN'))errors.push(`${label}: không xuất bản bản nháp chưa biên soạn.`);
}
async function scan(dir){for(const item of await readdir(new URL(dir,root),{withFileTypes:true})){const name=`${dir}${item.name}`;if(item.isDirectory()){await scan(name+'/');continue;}if(!/\.(js|mjs|json|html|css|md)$/.test(name))continue;const bytes=await readFile(new URL(name,root));let text;try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{errors.push(`${name}: không phải UTF-8 hợp lệ.`);continue;}if(/[\uFFFD]|â€¢|ðŸ|CháÂ|háÂ/.test(text))errors.push(`${name}: có dấu hiệu lỗi mã hóa.`);if(/\.(m?js)$/.test(name)){const r=spawnSync(process.execPath,['--check',fileURLToPath(new URL(name,root))],{encoding:'utf8'});if(r.status!==0)errors.push(r.stderr);}}}
await scan('dist/');
const html=await readFile(new URL('dist/index.html',root),'utf8');
for(const m of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)){try{await readFile(new URL('dist/'+m[1],root));}catch{errors.push(`Thiếu tài nguyên: ${m[1]}`);}}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Đạt: ${entries.length} bộ thủ tục; điều kiện, liên kết, tài nguyên, cú pháp và UTF-8 hợp lệ.`);
