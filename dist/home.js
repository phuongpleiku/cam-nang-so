import {normalize} from './rules.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function homeCopy(p){
 return {title:p.home?.title||p.shortTitle||p.title,description:p.home?.description||p.description};
}

export function searchHomeProcedures(procedures,term,category=''){
 const clean=v=>normalize(v).replace(/[^a-z0-9.]+/g,' ').trim().replace(/\s+/g,' ');
 const query=clean(term),words=query.split(' ').filter(Boolean);
 const ranked=procedures.filter(p=>!category||p.category===category).map(p=>{
  const aliases=(p.home?.searchAliases||[]).map(clean);
  const tokens=new Set(clean([p.title,p.description,p.procedureCode||'',...(p.keywords||[]),...Object.values(homeCopy(p))].join(' ')).split(' '));
  const score=aliases.includes(query)&&query?2:words.every(w=>tokens.has(w))?1:0;
  return {p,score};
 }).filter(x=>x.score);
 // Cụm từ đã biên soạn chỉ rõ một nhu cầu; tránh ghép từ rời sang thủ tục khác.
 const exactAlias=ranked.some(x=>x.score===2);
 return ranked.filter(x=>!exactAlias||x.score===2).map(x=>x.p);
}

export function searchHint(term){
 const text=normalize(term);
 if(/cong chung/.test(text))return 'Bạn cần sao y bản giấy đang có hay công chứng hợp đồng? Hướng dẫn chứng thực bản sao dưới đây chỉ dành cho sao y. Với hợp đồng hoặc chưa rõ, chọn Nhờ người hướng dẫn.';
 if(/khai sinh/.test(text))return 'Làm giấy lần đầu: chọn Làm giấy tờ cho con mới sinh. Đã đăng ký, cần thêm bản hoặc mất giấy: chọn Xin bản sao khai sinh.';
 return '';
}

export function renderHomeCard(p,{href,icon='',progressLabel=''}={}){
 const copy=homeCopy(p),target=href?.startsWith('#thu-tuc/')?href:`#thu-tuc/${encodeURIComponent(p.id)}/truong-hop`;
 return `<article class="home-card"><a class="home-card-link" href="${esc(target)}" aria-labelledby="home-title-${esc(p.id)} home-action-${esc(p.id)}"><span class="home-card-icon">${icon}</span><div class="home-card-copy"><h3 id="home-title-${esc(p.id)}">${esc(copy.title)}</h3><p>${esc(copy.description)}</p></div><div class="home-card-bottom">${progressLabel?`<span class="home-progress">Đang xem: ${esc(progressLabel)}</span>`:''}<span class="home-card-action" id="home-action-${esc(p.id)}">${progressLabel?'Tiếp tục hướng dẫn':'Xem từng bước'} <span aria-hidden="true">→</span></span></div></a></article>`;
}
