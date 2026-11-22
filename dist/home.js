import {searchProcedures} from './rules.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function homeCopy(p){
 return {title:p.home?.title||p.shortTitle||p.title,description:p.home?.description||p.description};
}

export function searchHomeProcedures(procedures,term,category=''){
 const searchable=procedures.map(p=>({...p,keywords:[...(p.keywords||[]),...Object.values(homeCopy(p))]}));
 const ids=new Set(searchProcedures(searchable,term,category).map(p=>p.id));
 return procedures.filter(p=>ids.has(p.id));
}

export function renderHomeCard(p,{href,icon='',progressLabel=''}={}){
 const copy=homeCopy(p),target=href?.startsWith('#thu-tuc/')?href:`#thu-tuc/${encodeURIComponent(p.id)}/truong-hop`;
 return `<article class="home-card"><a class="home-card-link" href="${esc(target)}" aria-labelledby="home-title-${esc(p.id)} home-action-${esc(p.id)}"><span class="home-card-icon">${icon}</span><div class="home-card-copy"><h3 id="home-title-${esc(p.id)}">${esc(copy.title)}</h3><p>${esc(copy.description)}</p></div><div class="home-card-bottom">${progressLabel?`<span class="home-progress">Đang xem: ${esc(progressLabel)}</span>`:''}<span class="home-card-action" id="home-action-${esc(p.id)}">${progressLabel?'Tiếp tục hướng dẫn':'Xem từng bước'} <span aria-hidden="true">→</span></span></div></a></article>`;
}
