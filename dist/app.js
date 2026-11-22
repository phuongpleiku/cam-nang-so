import { initReadingControls } from './reading.js';
import { matches, visibleQuestions, noticesFor, hasAnswer, isComplete, setAnswer, checklistFor } from './rules.js';
import { renderVisuals, bindVisuals } from './visuals.js';
import { renderTutorial, bindTutorials, tutorialPosition } from './tutorials.js';
import { freshRecord, restoreRecord, resumePoint, pruneProgress, setPreparationStatus } from './progress.js';
import { questionHelp, tabHelp } from './novice.js';
import { searchHomeProcedures, renderHomeCard, searchHint } from './home.js';
import { getConnection, renderConnection, renderTracking, shortcutEntries, renderShortcuts, bindConnections } from './connections.js';
const $ = (s, root = document) => root.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = v => { try { const u = new URL(v); return u.protocol === 'https:' ? esc(u.href) : '#'; } catch { return '#'; } };
const svg = paths => `<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const icons = {
 book:svg('<path d="M3 4h6a5 5 0 0 1 3 1 5 5 0 0 1 3-1h6v16h-6a5 5 0 0 0-3 1 5 5 0 0 0-3-1H3zM12 5v16M6 8h3M15 8h3"/>'),
 baby:svg('<circle cx="12" cy="13" r="8"/><path d="M12 5c-3-5 5-5 3 0M8 11h.01M16 11h.01M9 16c2 2 4 2 6 0"/>'),
 document:svg('<path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h6"/>'),
 copy:svg('<rect x="8" y="7" width="12" height="14" rx="2"/><path d="M16 7V3H4v14h4M11 12h6M11 16h6"/>'),
 heart:svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>'),
 folder:svg('<path d="M3 7V4h6l3 3h9v13H3zM7 12h10M7 16h7"/>'),
 search:svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'),
 arrow:svg('<path d="M4 12h16m-6-6 6 6-6 6"/>'),
 check:svg('<path d="m5 12 4 4L19 6"/>'),
 phone:svg('<path d="m6 3 4 4-2 3a15 15 0 0 0 6 6l3-2 4 4-2 3C10 21 3 14 3 5z"/>'),
 external:svg('<path d="M14 3h7v7m0-7L10 14M10 4H4v16h16v-6"/>'),
 shield:svg('<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6"/>'),
 back:svg('<path d="M20 12H4m6-6-6 6 6 6"/>'),
 print:svg('<path d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6z"/>'),
 help:svg('<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/>'),
 pin:svg('<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>')
};
const STEPS=[{id:'truong-hop',label:'Trường hợp của bạn'},{id:'chuan-bi',label:'Chuẩn bị giấy tờ'},{id:'cach-dien',label:'Hướng dẫn điền'},{id:'nop-ho-so',label:'Nộp hồ sơ'},{id:'ket-qua',label:'Theo dõi kết quả'}];
const main=$('#main');
initReadingControls();
const state={procedures:[],tutorials:{},connections:null,records:{},search:'',category:'',questionIndex:0};
let storageAvailable=true;
function announce(text){$('#announcement').textContent=text;}
function record(p){
 if(state.records[p.id])return state.records[p.id];
 let saved;try{saved=JSON.parse(localStorage.getItem(`cns:${p.id}`));}catch{storageAvailable=false;}
 const r=restoreRecord(p,saved);
 return state.records[p.id]=r;
}
function save(p){try{localStorage.setItem(`cns:${p.id}`,JSON.stringify(record(p)));}catch{storageAvailable=false;}}
function answer(p,id,value){const r=record(p);r.answers=setAnswer(p,r.answers,id,value);pruneProgress(p,r);save(p);}
function route(p,step=0,item=''){return `#thu-tuc/${p.id}/${STEPS[step].id}${item?'/'+encodeURIComponent(item):''}`;}
function resumeRoute(p){const point=resumePoint(p,record(p));return route(p,point.step,point.item);}
function current(){const parts=location.hash.slice(1).split('/');return{page:parts[0],p:state.procedures.find(p=>p.id===parts[1]),step:Math.max(0,STEPS.findIndex(s=>s.id===parts[2])),item:parts[3]||''};}
function helpRoute(p,step,item=''){return `#ho-tro/${p.id}/${STEPS[step].id}${item?'/'+encodeURIComponent(item):''}`;}
function contextualHelp(p,step,item){return `<aside class="context-help"><strong>Bạn cần người hướng dẫn?</strong><a class="text-link" href="${helpRoute(p,step,item?.id)}">${item?'Tôi vướng ở mục này':'Tôi cần hỗ trợ bước này'} ${icons.arrow}</a></aside>`;}
function link(url,label,cls=''){return `<a class="${cls}" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ${icons.external}<span class="sr-only"> (mở tab mới)</span></a>`;}
function support(compact=false){return `<section class="support-panel ${compact?'compact':''}"><div class="support-icon">${icons.phone}</div><div><h${compact?3:2}>Cần người hướng dẫn?</h${compact?3:2}><p>Liên hệ đầu mối phường Pleiku để được chỉ dẫn đúng bộ phận.</p><a class="phone-link" href="tel:02693828313">0269 3828 313</a>${compact?'':`<p class="support-address">Thông tin UBND phường: 81 Hùng Vương, phường Pleiku, Gia Lai. Hãy xác nhận địa điểm tiếp nhận và giờ làm việc trước khi đến.</p>${link('https://pleiku.gialai.gov.vn/','Thông tin chính thức của phường','text-link')}`}</div>${compact?'<a class="secondary-button" href="#ho-tro">Xem hỗ trợ '+icons.arrow+'</a>':''}</section>`;}
function home(){
 document.title='Cẩm Nang Số · Phường Pleiku';main.className='home-page';
 main.innerHTML=`<section class="home-hero" aria-labelledby="home-heading"><div class="eyebrow">CẨM NANG CHO NGƯỜI DÂN · PHƯỜNG PLEIKU</div><h1 id="home-heading">Bạn cần làm giấy tờ gì?</h1><p>Chọn việc cần làm. Mình hướng dẫn bạn chuẩn bị giấy tờ, điền thông tin và mở đúng nơi nộp.</p><form class="search-box-form" role="search"><label class="home-search-label" for="procedure-search">Tìm việc bạn cần làm</label><div class="search-box">${icons.search}<input id="procedure-search" type="search" autocomplete="off" enterkeyhint="search" aria-describedby="home-search-note" placeholder="Ví dụ: khai sinh, sao y…" value="${esc(state.search)}"><button class="primary-button" type="submit">Tìm</button></div><p class="home-search-note" id="home-search-note">Có thể gõ không dấu hoặc nhập mã thủ tục.</p></form><div class="home-search-tools"><button type="button" id="reset-home-search" ${state.search||state.category?'':'hidden'}>Xóa tìm kiếm và bộ lọc</button><a href="#ho-tro">${icons.help} Chưa biết chọn thủ tục nào?</a></div></section><section aria-labelledby="catalog-title"><div class="home-catalog-heading"><h2 id="catalog-title" tabindex="-1">Chọn việc bạn cần làm</h2><span id="result-count" class="result-count" role="status" aria-live="polite" aria-atomic="true"></span></div><p class="home-catalog-note">Bấm vào một ô bên dưới để xem hướng dẫn. Chưa cần đăng nhập.</p><div class="catalog-toolbar"><div class="filter-list" aria-label="Lọc nhóm thủ tục">${['',...new Set(state.procedures.map(p=>p.category))].map(c=>`<button type="button" class="filter ${state.category===c?'active':''}" data-category="${esc(c)}" aria-pressed="${state.category===c}">${esc(c||'Tất cả')}</button>`).join('')}</div></div><div id="search-guidance" class="search-guidance" hidden></div><div class="home-cards" id="procedure-results"></div></section><div id="shortcut-results"></div><section class="home-how" aria-labelledby="home-how-title"><h2 id="home-how-title">Lần đầu sử dụng? Chỉ cần làm theo từng bước</h2><ol><li><div><h3>Chọn đúng trường hợp</h3><p>Trả lời vài câu ngắn để biết hướng dẫn nào phù hợp.</p></div></li><li><div><h3>Chuẩn bị và xem cách điền</h3><p>Mỗi giấy tờ đều có giải thích. Chưa biết làm thì mở hướng dẫn chi tiết.</p></div></li><li><div><h3>Nộp trên cổng chính thức</h3><p>Có đường dẫn và hướng dẫn đăng nhập, gửi hồ sơ, theo dõi kết quả.</p></div></li></ol></section><div class="trust-note">${icons.shield}<p><strong>Đọc hướng dẫn không cần tài khoản.</strong> Cẩm Nang Số không yêu cầu nhập căn cước hay tải giấy tờ cá nhân. Bạn nộp hồ sơ trên cổng chính thức khi đã sẵn sàng.</p></div>`;
 $('.search-box-form').addEventListener('submit',e=>{e.preventDefault();renderCards();$('#catalog-title').focus();$('#catalog-title').scrollIntoView({block:'start'});});
 $('#procedure-search').addEventListener('input',e=>{state.search=e.target.value;renderCards();});
 $('#reset-home-search').addEventListener('click',clearHomeSearch);
 $('.filter-list').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;state.category=b.dataset.category;renderCards();});renderCards();
}
function clearHomeSearch(){state.search='';state.category='';$('#procedure-search').value='';renderCards();$('#procedure-search').focus();}
function renderCards(){
 const list=searchHomeProcedures(state.procedures,state.search,state.category),shortcuts=state.category?[]:shortcutEntries(state.connections,state.search),searching=Boolean(state.search.trim()||state.category);
 $('#shortcut-results').innerHTML=shortcuts.length?`<details class="home-other-services" ${state.search.trim()?'open':''}><summary>Thủ tục khác trên cổng chính thức (${shortcuts.length})</summary>${renderShortcuts(state.connections,state.search)}</details>`:'';
 $('#result-count').textContent=`${list.length} hướng dẫn${shortcuts.length?` · ${shortcuts.length} dịch vụ chưa có hướng dẫn`:''}`;
 $('#reset-home-search').hidden=!searching;
 const hint=searchHint(state.search);$('#search-guidance').hidden=!hint;$('#search-guidance').innerHTML=hint?`<p>${esc(hint)}</p><a class="text-link" href="#ho-tro">Nhờ người hướng dẫn</a>`:'';
 main.querySelectorAll('[data-category]').forEach(el=>{const active=el.dataset.category===state.category;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
 $('#procedure-results').innerHTML=list.length?list.map(p=>renderHomeCard(p,{href:resumeRoute(p),icon:icons[p.home?.icon]||icons[p.icon]||icons.document,progressLabel:Object.keys(record(p).answers).length?STEPS[resumePoint(p,record(p)).step].label:''})).join(''):`<div class="empty-state">${icons.search}<h3>Chưa tìm thấy hướng dẫn phù hợp</h3><p>${shortcuts.length?'Có đường vào dịch vụ chính thức bên dưới, nhưng Cẩm Nang Số chưa có hướng dẫn từng bước cho việc này.':'Thử từ ngắn hơn như “khai sinh”, “sao y”, hoặc bỏ bộ lọc. Bạn cũng có thể nhờ đầu mối phường chỉ dẫn.'}</p><div class="home-empty-actions"><button type="button" class="secondary-button" id="clear-search">Xem tất cả hướng dẫn</button><a class="primary-button" href="#ho-tro">Nhờ người hướng dẫn</a></div></div>`;
 if(list.length&&!searching)$('#procedure-results').insertAdjacentHTML('beforeend',`<aside class="home-card home-help-card" aria-labelledby="home-help-title"><span class="home-card-icon">${icons.phone}</span><h3 id="home-help-title">Bạn cần người hướng dẫn?</h3><p>Chưa biết chọn giấy nào, hoặc muốn hỏi cách thực hiện?</p><a class="phone-link" href="tel:02693828313">${icons.phone} 0269 3828 313</a><small>Đầu mối UBND phường Pleiku</small><a href="#ho-tro">Xem cách liên hệ và nhờ hỗ trợ ${icons.arrow}</a></aside>`);
 $('#clear-search')?.addEventListener('click',clearHomeSearch);
}
function render(){
 const c=current();
 $('.header-help').href=c.p?helpRoute(c.p,c.step,c.item):'#ho-tro';
 if(c.page==='thu-tuc'&&c.p)guide(c.p,c.step,c.item);
 else if(c.page==='noi-nop')connectionPage(location.hash.slice(1).split('/')[1]);
 else if(c.page==='ho-tro')helpPage(c);
 else if(c.page){main.className='';main.innerHTML='<div class="empty-state"><h1>Không tìm thấy hướng dẫn</h1><p>Đường dẫn có thể đã thay đổi.</p><a class="primary-button" href="#">Về danh sách thủ tục</a></div>';}
 else home();
 document.dispatchEvent(new Event('cns:render'));
}
function guide(p,step,itemId=''){
 const r=record(p);if(step>0&&!isComplete(p,r.answers)){history.replaceState(null,'',route(p));step=0;}
 if(step===0)state.questionIndex=resumePoint(p,r).question;
 const item=step===1?checklistFor(p,r.answers).find(i=>i.id===itemId):null;
 if(itemId&&!item&&step===1)history.replaceState(null,'',route(p,1));
 r.lastStep=step;r.item=item?.id||'';save(p);
 document.title=`${STEPS[step].label} · ${p.shortTitle} · Cẩm Nang Số`;main.className='guide-page';
 main.innerHTML=`<a class="back-link" href="#">${icons.back} Tất cả thủ tục</a><div class="guide-heading"><div><span class="eyebrow">${esc(p.category)}</span><h1>${esc(p.title)}</h1></div><span class="local-tag">${icons.pin} Phường Pleiku</span></div><div class="guide-layout"><aside class="guide-sidebar"><details class="step-navigation"><summary>Bước ${step+1} / 5 · Xem các bước</summary><nav aria-label="Các bước hướng dẫn" class="steps">${STEPS.map((s,i)=>`<a href="${route(p,i)}" class="step ${step===i?'current':''}" ${step===i?'aria-current="step"':''}><span class="step-number">${i+1}</span><span>${s.label}${step===i?'<small class="step-viewing">Đang xem</small>':''}</span></a>`).join('')}</nav></details><div class="save-note">${icons.shield}<span>${storageAvailable?'Lựa chọn và tiến độ chỉ lưu trên trình duyệt này.':'Trình duyệt không cho lưu tiến độ. Hãy giữ trang mở.'}</span></div><button class="reset-link" id="reset-progress">Bắt đầu lại hướng dẫn</button><a href="${helpRoute(p,step,item?.id)}" class="side-help">${icons.help} Tôi cần hỗ trợ</a></aside><div class="guide-content"><section class="step-panel" id="step-content" aria-label="${STEPS[step].label}"></section><details class="source-details"><summary>Nguồn hướng dẫn & thông tin thủ tục</summary><p>${esc(p.officialName)}</p><p class="small">Đối chiếu nguồn ngày ${p.reviewedAt.split('-').reverse().join('/')}. Thành phần hồ sơ thực tế theo trường hợp và thông báo của cơ quan tiếp nhận.</p>${p.sources.map(s=>link(s.url,s.label,'source-link')).join('')}</details></div></div>`;
 $('#reset-progress').addEventListener('click',()=>showReset(p));
  if(item)preparationDetail(p,item);else [intake,checklist,fields,submission,results][step](p);
  if(step!==0){$('#step-content').insertAdjacentHTML('beforeend',contextualHelp(p,step,item));bindVisuals(p,$('#step-content'));}
  bindTutorials($('#step-content'),(key,position)=>{r.tutorials[key]=position;save(p);});
  bindConnections($('#step-content'));
  const steps=$('.steps'), active=$('.step.current');
  if(steps.scrollWidth>steps.clientWidth) steps.scrollLeft=Math.max(0,active.offsetLeft-steps.offsetLeft-20);
}
function noticeMarkup(n){return `<div class="notice ${n.blocking?'notice-blocking':''}">${icons.help}<div><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></div></div>`;}
function connectionPage(id){
 const c=getConnection(state.connections,id);main.className='connection-page';
 if(!c?.shortcut){document.title='Nơi nộp hồ sơ · Cẩm Nang Số';main.innerHTML='<div class="empty-state"><h1>Chưa tìm thấy nơi nộp này</h1><p>Hãy trở về danh sách hoặc tải lại trang để xem các dịch vụ hiện có.</p><a class="primary-button" href="#">Về danh sách</a></div>';return;}
 document.title=`${c.title} · Nơi nộp hồ sơ · Cẩm Nang Số`;
 main.innerHTML=`<a class="back-link" href="#">${icons.back} Về danh sách thủ tục</a><div class="eyebrow">LỐI VÀO DỊCH VỤ CHÍNH THỨC</div><h1>${esc(c.title)}</h1><p class="connection-page-note">Trang này giúp bạn mở đúng nơi thực hiện. Xem thành phần hồ sơ và điều kiện của thủ tục trên cổng chính thức trước khi nộp.</p>${renderConnection(state.connections,id)}<h2>Sau khi đã gửi hồ sơ</h2><p>Lưu mã hồ sơ và thông báo của cổng để theo dõi. Cẩm Nang Số không biết hồ sơ của bạn đã được gửi hay tiếp nhận.</p>${renderTracking(state.connections,id)}<a class="text-link" href="#ho-tro">Tôi cần người hướng dẫn ${icons.arrow}</a>`;
 bindConnections(main);
}
function bindIntakeExtras(p){
 $('#step-content').insertAdjacentHTML('beforeend',contextualHelp(p,0));
 bindVisuals(p,$('#step-content'));
}
function helpPage(c){
 const p=c.p,r=p?record(p):null,item=p?checklistFor(p,r.answers).find(i=>i.id===c.item):null;
 const back=p?route(p,c.step,item?.id):'#';
 let topic=item?.title||(p?STEPS[c.step].label:'');
 const activeGuide=item?(item.guide||state.tutorials[item.guideRef]):c.step===3?p?.submissionGuide:null;
 if(activeGuide){const pos=tutorialPosition(activeGuide,r.tutorials[item?`prep-${item.id}`:'submission']);const path=(activeGuide.paths||[activeGuide])[pos.path];topic+=' · '+path.steps[pos.steps[pos.path]].title;}
 main.className='help-page';document.title='Hỗ trợ · Cẩm Nang Số';
 main.innerHTML=`<a class="back-link" href="${back}">${icons.back} ${p?'Trở lại việc đang làm':'Tất cả thủ tục'}</a><div class="eyebrow">PHƯỜNG PLEIKU · GIA LAI</div><h1>Cần người hướng dẫn?</h1>${p?`<section class="help-context"><h2>Bạn đang cần hỗ trợ</h2><p><strong>${esc(p.title)}</strong><br>${esc(topic)}</p><p>Khi gọi, bạn có thể nói:</p><blockquote>“Tôi cần được hướng dẫn ${esc(p.shortTitle.toLowerCase())}. Tôi đang vướng ở mục ${esc(topic.toLowerCase())}. Nhờ chỉ giúp tôi cần làm gì tiếp và liên hệ bộ phận nào.”</blockquote>${item?`<p>${esc(item.missing)}</p>`:''}</section>`:''}${support()}<section class="help-details"><h2>Trước khi gọi hoặc đến trực tiếp</h2><ul><li>Chuẩn bị tên thủ tục, tên giấy đang thiếu hoặc nội dung thông báo lỗi.</li><li>Nếu đã gửi, giữ mã hồ sơ và thông báo tiếp nhận để đối chiếu.</li><li>Hỏi rõ đúng bộ phận, địa điểm và giờ tiếp nhận trước khi đi.</li></ul><p>Bạn có thể nhờ người thân đọc hướng dẫn hoặc hỗ trợ bấm máy. Người đứng tên yêu cầu vẫn phải phù hợp với thủ tục; không tự dùng tài khoản người giúp thay tài khoản người yêu cầu.</p><p>Không đọc mật khẩu hay mã xác thực cho người hỗ trợ. Đây là số đầu mối chỉ dẫn của phường.</p></section>`;
}
function intake(p){
 const r=record(p),questions=visibleQuestions(p,r.answers),block=noticesFor(p,r.answers).find(n=>n.blocking);state.questionIndex=Math.min(state.questionIndex,questions.length-1);
 if(block){
  $('#step-content').innerHTML=`<div class="step-kicker">BƯỚC 1 · TRƯỜNG HỢP CỦA BẠN</div><h2>Hướng dẫn phù hợp cho bạn</h2>${noticeMarkup(block)}${questionHelp(p,questions.find(q=>q.id===block.when.question),true)}<div class="action-row"><button class="secondary-button" id="change-answer">${icons.back} Sửa câu trả lời</button><a class="primary-button" href="${helpRoute(p,0)}">Xem đầu mối hỗ trợ ${icons.arrow}</a></div>`;
  bindIntakeExtras(p);
  $('#change-answer').addEventListener('click',()=>{state.questionIndex=Math.max(0,questions.findIndex(q=>q.id===block.when.question));delete r.answers[block.when.question];save(p);intake(p);});return;
 }
 const q=questions[state.questionIndex];
 $('#step-content').innerHTML=`<div class="step-kicker">BƯỚC 1 · TRƯỜNG HỢP CỦA BẠN</div><div class="question-meta"><span>Câu ${state.questionIndex+1} / ${questions.length}</span><span>Không cần thông tin cá nhân</span></div><div class="question-progress" aria-hidden="true"><span style="width:${(state.questionIndex+1)/questions.length*100}%"></span></div><fieldset class="question-set"><legend>${esc(q.title)}</legend><p class="question-hint" id="question-hint">${esc(q.hint||p.intro)}</p>${questionHelp(p,q)}<div class="answer-options">${q.options.map(o=>{const selected=Array.isArray(r.answers[q.id])?r.answers[q.id].includes(o.value):r.answers[q.id]===o.value;return `<label class="answer-option ${selected?'selected':''}"><input type="${q.type==='multiple'?'checkbox':'radio'}" name="answer" value="${esc(o.value)}" ${selected?'checked':''} aria-describedby="question-hint"><span>${esc(o.label)}</span></label>`;}).join('')}</div></fieldset><p id="question-error" class="form-error" role="alert"></p><div class="action-row"><button class="secondary-button" id="previous-question">${icons.back} ${state.questionIndex?'Câu trước':'Về danh sách'}</button><button class="primary-button" id="next-question">${state.questionIndex===questions.length-1?'Xem danh sách chuẩn bị':'Tiếp tục'} ${icons.arrow}</button></div>`;
 bindIntakeExtras(p);
 $('.answer-options').addEventListener('change',e=>{
  if(!e.target.matches('input'))return;let value=e.target.value;
  if(q.type==='multiple'){let values=Array.from(document.querySelectorAll('.answer-options input:checked')).map(i=>i.value);if(q.options.find(o=>o.value===value)?.exclusive&&e.target.checked)values=[value];else if(e.target.checked)values=values.filter(v=>!q.options.find(o=>o.value===v)?.exclusive);value=values;}
  answer(p,q.id,value);document.querySelectorAll('.answer-option').forEach(el=>{const input=$('input',el);input.checked=Array.isArray(value)?value.includes(input.value):input.value===value;el.classList.toggle('selected',input.checked);});$('#question-error').textContent='';
  const count=visibleQuestions(p,r.answers).length;
  $('.question-meta span').textContent=`Câu ${state.questionIndex+1} / ${count}`;
  $('.question-progress span').style.width=`${(state.questionIndex+1)/count*100}%`;
  $('#next-question').innerHTML=`${state.questionIndex===count-1?'Xem danh sách chuẩn bị':'Tiếp tục'} ${icons.arrow}`;
 });
 $('#previous-question').addEventListener('click',()=>{if(!state.questionIndex){location.hash='';return;}state.questionIndex--;intake(p);focusPanel();});
 $('#next-question').addEventListener('click',()=>{
  if(!hasAnswer(r.answers[q.id])){$('#question-error').textContent='Bạn hãy chọn một câu trả lời để tiếp tục.';return;}
  if(noticesFor(p,r.answers).some(n=>n.blocking)){intake(p);focusPanel();return;}
  const list=visibleQuestions(p,r.answers);
  if(state.questionIndex<list.length-1){state.questionIndex++;intake(p);focusPanel();}
  else{const missing=list.findIndex(q=>!hasAnswer(r.answers[q.id]));if(missing>=0){state.questionIndex=missing;intake(p);}else location.hash=route(p,1);}
 });
}
function focusPanel(){const el=$('#step-content');el.tabIndex=-1;el.focus({preventScroll:true});el.scrollIntoView({behavior:'instant',block:'start'});}
function preparationItem(item, r, p){
 const tutorial=item.guide || state.tutorials[item.guideRef];
 const status=r.checked.includes(item.id)?'Đã chuẩn bị':r.needsHelp.includes(item.id)?'Cần hỏi thêm':'Chưa đánh dấu chuẩn bị';
 return `<article class="check-item preparation-summary"><label class="check-label"><input type="checkbox" data-check="${esc(item.id)}" ${r.checked.includes(item.id)?'checked':''}><span><small>${esc(item.kind)}</small><strong>${esc(item.title)}</strong></span></label><p class="preparation-short">${esc(item.summary||item.help)}</p><span class="preparation-status" data-status="${esc(item.id)}">${status}</span><a class="text-link preparation-start" href="${route(p,1,item.id)}">Hướng dẫn từng thao tác ${icons.arrow}</a><div class="print-only"><p><strong>Nếu còn thiếu:</strong> ${esc(item.missing)}</p></div></article>`;
}
function preparationDetail(p,item){
 const r=record(p),tutorial=item.guide||state.tutorials[item.guideRef];
 $('#step-content').innerHTML=`<a class="back-link" href="${route(p,1)}">${icons.back} Danh sách chuẩn bị</a><div class="step-kicker">HƯỚNG DẪN CHUẨN BỊ · TỪNG THAO TÁC</div><h2>${esc(item.title)}</h2><p>${esc(item.summary||item.help)}</p>${item.id==='login'?tabHelp():''}${renderVisuals({visuals:(p.visuals||[]).filter(v=>v.id===item.visualId)},'chuan-bi')}${tutorial?renderTutorial(tutorial,`prep-${item.id}`,state.tutorials,r.tutorials,[],helpRoute(p,1,item.id)):`<p>${esc(item.help)}</p><p>${esc(item.missing)}</p>`}<section class="preparation-decision" aria-label="Tự ghi nhớ việc chuẩn bị"><h3>Mục này của bạn thế nào?</h3><p>Chỉ chọn “Đã chuẩn bị” khi đã có đủ thông tin hoặc giấy tờ theo hướng dẫn. Đọc hết chưa có nghĩa đã chuẩn bị xong.</p><div class="decision-options">${[['ready','Đã chuẩn bị'],['help','Cần hỏi thêm'],['todo','Chưa chuẩn bị']].map(([value,label])=>`<button type="button" class="secondary-button" data-prep-status="${value}" aria-pressed="${value==='ready'?r.checked.includes(item.id):value==='help'?r.needsHelp.includes(item.id):!r.checked.includes(item.id)&&!r.needsHelp.includes(item.id)}">${label}</button>`).join('')}</div><p class="preparation-feedback" role="status"></p></section><a class="primary-button" href="${route(p,1)}">Về danh sách giấy tờ ${icons.arrow}</a>`;
 $('#step-content').querySelectorAll('[data-prep-status]').forEach(button=>button.addEventListener('click',()=>{
  setPreparationStatus(r,item.id,button.dataset.prepStatus);save(p);
  if(button.dataset.prepStatus==='help'){location.hash=helpRoute(p,1,item.id);return;}
  $('#step-content').querySelectorAll('[data-prep-status]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $('.preparation-feedback').textContent=button.dataset.prepStatus==='help'?'Đã ghi nhớ cần hỏi thêm. Bấm “Tôi vướng ở mục này” bên dưới để xem cách liên hệ.':button.dataset.prepStatus==='ready'?'Đã ghi nhớ mục này đã chuẩn bị. Hồ sơ chưa được gửi qua thao tác này.':'Đã giữ mục này trong danh sách cần chuẩn bị.';
 }));
}
function checklist(p){
 const r=record(p),items=checklistFor(p,r.answers);
 $('#step-content').innerHTML=`<div class="step-kicker">BƯỚC 2 · CHUẨN BỊ GIẤY TỜ</div><div class="panel-title-row"><h2>Danh sách của bạn</h2><button class="icon-button" id="print-list" aria-label="In hoặc lưu PDF danh sách">${icons.print}<span>In / lưu PDF</span></button></div><p>Bạn có ${items.length} mục cần xem. Chọn mục chưa biết để được hướng dẫn từng thao tác; đánh dấu khi đã chuẩn bị xong.</p><div class="preparation-tip"><p><strong>Bạn chưa cần đăng nhập để đọc danh sách này.</strong> Có thể chuẩn bị giấy tờ trước, rồi xem cách đăng nhập khi sẵn sàng.</p></div><div class="check-progress"><strong id="check-count" role="status"></strong><span>đã chuẩn bị</span><div class="check-track" aria-hidden="true"><span id="check-bar"></span></div></div>${noticesFor(p,r.answers).map(noticeMarkup).join('')}<div class="checklist">${items.map(item=>preparationItem(item,r,p)).join('')}</div>${renderVisuals({visuals:(p.visuals||[]).filter(v=>!items.some(item=>item.visualId===v.id))},'chuan-bi')}<p class="small checklist-note">Đây là danh sách giúp chuẩn bị. Đánh dấu không thay thế việc kiểm tra và tiếp nhận hồ sơ của cơ quan nhà nước.</p><div class="action-row"><a class="secondary-button" href="${route(p,0)}">${icons.back} Sửa trường hợp</a><a class="primary-button" href="${route(p,2)}">Xem cách điền ${icons.arrow}</a></div>`;
 document.querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',()=>{setPreparationStatus(r,el.dataset.check,el.checked?'ready':'todo');save(p);checkProgress(p);document.querySelector(`[data-status="${el.dataset.check}"]`).textContent=el.checked?'Đã chuẩn bị':'Chưa đánh dấu chuẩn bị';}));
 $('#print-list').addEventListener('click',()=>window.print());checkProgress(p);
}
function checkProgress(p){const r=record(p),items=checklistFor(p,r.answers),count=items.filter(i=>r.checked.includes(i.id)).length;$('#check-count').textContent=`${count}/${items.length}`;$('#check-bar').style.width=`${items.length?count/items.length*100:0}%`;}
function fields(p){const list=p.fields.filter(f=>matches(f.when,record(p).answers));
 $('#step-content').innerHTML=`<div class="step-kicker">BƯỚC 3 · HƯỚNG DẪN ĐIỀN</div><h2>Hiểu từng mục trước khi điền</h2><p>Mở mục bạn cần xem. Bạn sẽ nhập thông tin thật trên cổng chính thức ở bước tiếp theo.</p>${renderVisuals(p,'cach-dien')}<div class="field-list">${list.map((f,i)=>`<details class="field-item" ${i===0?'open':''}><summary><span class="field-number">${String(i+1).padStart(2,'0')}</span>${esc(f.title)}</summary><div class="field-body"><p>${esc(f.body)}</p>${f.source?`<p class="field-source"><strong>Lấy thông tin ở đâu?</strong>${esc(f.source)}</p>`:``}${f.check?`<p><strong>Kiểm tra lại:</strong> ${esc(f.check)}</p>`:``}${f.example?`<div class="example"><span>VÍ DỤ MINH HỌA</span><p>${esc(f.example)}</p></div>`:''}</div></details>`).join('')}</div><div class="notice">${icons.shield}<div><h3>Kiểm tra cả thông tin đã được điền sẵn</h3><p>Họ tên, dấu tiếng Việt, ngày tháng và địa chỉ cần khớp giấy tờ. Khi thông tin khác nhau, hỏi cơ quan tiếp nhận trước khi gửi.</p></div></div><div class="action-row"><a class="secondary-button" href="${route(p,1)}">${icons.back} Danh sách chuẩn bị</a><a class="primary-button" href="${route(p,3)}">Đến bước nộp hồ sơ ${icons.arrow}</a></div>`;
}
function submission(p){const r=record(p),remaining=checklistFor(p,r.answers).filter(i=>!r.checked.includes(i.id)).length;
 $('#step-content').innerHTML=`<div class="step-kicker">BƯỚC 4 · NỘP HỒ SƠ</div><h2>Mở đúng nơi, làm đúng bước</h2><p>Xem ba việc đầu tiên cần làm trên cổng bên dưới. Hướng dẫn của bạn vẫn được giữ ở tab này.</p>${remaining?`<div class="readiness-note">Bạn còn ${remaining} mục chưa đánh dấu chuẩn bị. <a href="${route(p,1)}">Xem lại danh sách</a></div>`:''}<div class="connection-login-help"><a class="text-link" href="${route(p,1,'login')}">Xem hướng dẫn đăng nhập từng bước ${icons.arrow}</a></div>${tabHelp()}${renderConnection(state.connections,p.connectionRef)}${p.submissionGuide?`<section class="submission-walkthrough" aria-label="Hướng dẫn nộp từng thao tác"><h3>Làm theo từng thao tác</h3>${renderTutorial(p.submissionGuide,'submission',state.tutorials,r.tutorials,p.visuals||[],helpRoute(p,3))}</section>`:''}<details class="field-item"><summary>Xem lại các việc cần làm đến khi gửi hồ sơ</summary><div class="field-body"><ol class="submission-steps">${p.submission.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div></details><div class="info-pair"><div><h3>Thời gian giải quyết</h3><p>${esc(p.duration)}</p></div><div><h3>Phí, lệ phí</h3><p>${esc(p.fees)}</p></div></div><div class="action-row"><a class="secondary-button" href="${route(p,2)}">${icons.back} Xem cách điền</a><a class="primary-button" href="${route(p,4)}">Cách theo dõi kết quả ${icons.arrow}</a></div>`;
}
function results(p){
 $('#step-content').innerHTML=`<div class="step-kicker">BƯỚC 5 · THEO DÕI KẾT QUẢ</div><h2>Sau khi gửi hồ sơ</h2><p>Hướng dẫn này không phản ánh trạng thái hồ sơ thực tế của bạn.</p><div class="notice">${icons.document}<div><h3>Lưu mã hồ sơ và thông báo tiếp nhận</h3><p>Chụp lại hoặc lưu thông báo từ cổng chính thức. Mã hồ sơ giúp bạn tra cứu và liên hệ khi cần hỗ trợ.</p></div></div><h3>Theo dõi thông báo và bổ sung</h3><p>${esc(p.followUp)}</p><h3>Kết quả có thể nhận</h3><ul class="outcome-list">${(p.resultItems||p.results.map(text=>({text}))).filter(item=>matches(item.when,record(p).answers)).map(item=>`<li><span aria-hidden="true">•</span><span>${esc(item.text)}</span></li>`).join('')}</ul><p>Kiểm tra hình thức, địa điểm và ngày nhận ghi trong thông báo của từng cơ quan. Kết quả các phần có thể được trả ở những thời điểm khác nhau.</p>${renderTracking(state.connections,p.connectionRef)}<div class="result-support"><p>Nếu cần bổ sung hoặc quá ngày hẹn, liên hệ cơ quan ghi trên thông báo tiếp nhận; bạn cũng có thể hỏi đầu mối phường.</p><a class="text-link" href="${helpRoute(p,4)}">Tôi cần hỗ trợ ${icons.arrow}</a></div><div class="action-row"><a class="secondary-button" href="${route(p,3)}">${icons.back} Bước nộp hồ sơ</a><a class="text-link" href="#">Về tất cả thủ tục ${icons.arrow}</a></div>`;
}
function showReset(p){
 const d=document.createElement('dialog');d.className='reset-dialog';d.setAttribute('aria-labelledby','reset-title');d.innerHTML='<h2 id="reset-title">Bắt đầu lại hướng dẫn?</h2><p>Câu trả lời và các mục đã đánh dấu của thủ tục này sẽ được xóa trên trình duyệt này. Hồ sơ trên cổng chính thức không bị ảnh hưởng.</p><div class="action-row"><button class="secondary-button" id="cancel-reset" autofocus>Giữ tiến độ</button><button class="primary-button" id="confirm-reset">Bắt đầu lại</button></div>';
 document.body.append(d);d.showModal();d.addEventListener('close',()=>d.remove(),{once:true});$('#cancel-reset',d).onclick=()=>d.close();$('#confirm-reset',d).onclick=()=>{state.records[p.id]=freshRecord(p);save(p);state.questionIndex=0;d.close();if(location.hash===route(p))guide(p,0);else location.hash=route(p);announce('Đã bắt đầu lại hướng dẫn.');};
}
async function load(){
 const fetchJSON=async url=>{const res=await fetch(url);if(!res.ok)throw new Error(`Không tải được ${url}`);return res.json();};
 const entries=(await fetchJSON('./data/index.json')).filter(e=>e.published);
 [state.tutorials,state.connections]=await Promise.all([fetchJSON('./data/huong-dan-chung.json'),fetchJSON('./data/connections.json').catch(()=>null)]);
 state.procedures=await Promise.all(entries.map(async e=>{if(!/^[a-z0-9-]+\.json$/.test(e.file))throw new Error('Tên tệp không hợp lệ');const p=await fetchJSON(`./data/${e.file}`);if(p.id!==e.id)throw new Error('Mã thủ tục không khớp');return p;}));
 $('.brand-mark').innerHTML=icons.book;
 $('.skip-link').addEventListener('click',event=>{event.preventDefault();main.focus();main.scrollIntoView();});
 render();window.addEventListener('hashchange',()=>{state.questionIndex=0;render();main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});registerTools();
}
let printDetails=[];
window.addEventListener('beforeprint',()=>{printDetails=Array.from(document.querySelectorAll('.check-item details,.tutorial details,.source-details')).filter(d=>!d.open);printDetails.forEach(d=>d.open=true);});
window.addEventListener('afterprint',()=>{printDetails.forEach(d=>d.open=false);printDetails=[];});
function registerTools(){
 const ctx=document.modelContext;if(!ctx?.registerTool)return;const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});const register=tool=>{try{Promise.resolve(ctx.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
 register({name:'list_procedure_guides',description:'List available Cẩm Nang Số guides. Does not submit an administrative application.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>state.procedures.map(p=>({id:p.id,title:p.title}))});
 register({name:'start_procedure_guide',description:'Open a preparation guide. Only navigates the website; never submits a government application.',inputSchema:{type:'object',properties:{procedureId:{type:'string'}},required:['procedureId'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async input=>{const p=state.procedures.find(p=>p.id===input?.procedureId);if(!p)throw new Error('Không tìm thấy thủ tục');history.pushState(null,'',route(p));state.questionIndex=0;render();return{procedureId:p.id,step:STEPS[0].id};}});
}
load().catch(()=>{main.innerHTML='<div class="empty-state"><h1>Chưa tải được hướng dẫn</h1><p>Kiểm tra kết nối rồi tải lại trang. Các lựa chọn đã lưu trên thiết bị vẫn được giữ.</p><button class="primary-button" id="retry">Tải lại trang</button></div>';$('#retry').onclick=()=>location.reload();});
