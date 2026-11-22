// Hình và mẫu chính thức dùng chung; mỗi thủ tục chỉ khai báo dữ liệu.
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function localImagePath(src){return typeof src==='string'&&/^assets\/guides\/[a-z0-9-]+\.(svg|png|webp|jpg|jpeg)$/.test(src)?src:null;}
export function localPdfPath(src){return typeof src==='string'&&/^assets\/forms\/[a-z0-9-]+\.pdf$/.test(src)?src:null;}
export function officialSourceUrl(value){try{const u=new URL(value);const host=u.hostname.endsWith('.gov.vn')||u.hostname==='datafiles.chinhphu.vn';return u.protocol==='https:'&&host&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function visualPages(v){return (Array.isArray(v.pages)&&v.pages.length?v.pages:[v]).filter(p=>localImagePath(p.src));}
const official=v=>v.kind==='official-template';
const badge=v=>official(v)?'Mẫu trống từ văn bản chính thức':v.kind==='portal-screenshot'?'Ảnh thao tác trên cổng · Có thể phóng to':'Sơ đồ minh họa';
const dimension=(n,fallback)=>Number.isInteger(n)&&n>0?n:fallback;
const sourcePage=p=>Number.isInteger(p.sourcePage)&&p.sourcePage>0?p.sourcePage:1;
const pdfHref=(v,p)=>localPdfPath(v.originalPdf)?`./${v.originalPdf}#page=${sourcePage(p)}`:null;
function sourceLinks(v,p){
 if(v.kind==='portal-screenshot'){const source=officialSourceUrl(v.source?.url);return `<div class="visual-sources"><small>Ảnh do người biên soạn cung cấp; đối chiếu ngày ${esc(v.reviewedAt)}. Tên nút và bố cục có thể thay đổi.</small>${source?`<a href="${esc(source)}" target="_blank" rel="noopener noreferrer">Mở trang chính thức để đối chiếu ↗</a>`:''}</div>`;}
 if(!official(v))return '';
 const pdf=pdfHref(v,p),source=officialSourceUrl(v.source?.url);
 return `<div class="visual-sources">${pdf?`<a class="visual-pdf-link" href="${esc(pdf)}" target="_blank" rel="noopener noreferrer">Mở PDF gốc <span class="visual-pdf-page">(trang ${sourcePage(p)})</span> ↗</a><a href="./${esc(v.originalPdf)}" download>Tải văn bản PDF đầy đủ</a>`:''}${source?`<a href="${esc(source)}" target="_blank" rel="noopener noreferrer">Nguồn: ${esc(v.source.label)} ↗</a>`:''}<small>Mở PDF hoặc nguồn trong trang mới. Mẫu được đối chiếu ngày ${esc(v.reviewedAt)}.</small></div>`;
}
function imageMarkup(v,p,lazy=false){return `<img src="./${esc(p.src)}" alt="${esc(p.alt||v.alt)}" width="${dimension(p.width,1000)}" height="${dimension(p.height,660)}"${lazy?' loading="lazy"':''}>`;}
export function renderVisuals(procedure,stage){
 const visuals=(procedure.visuals||[]).filter(v=>v.stage===stage&&visualPages(v).length);
 if(!visuals.length)return '';
 return `<section class="visual-guides" aria-label="Hướng dẫn bằng hình"><div class="visual-section-label">XEM HÌNH ĐỂ DỄ LÀM</div>${visuals.map(v=>{const pages=visualPages(v),p=pages[0];return `<figure class="visual-card${official(v)?' official-template':''}"><button class="visual-thumbnail" data-visual="${esc(v.id)}" aria-label="Phóng to: ${esc(v.title)}">${imageMarkup(v,p,true)}<span class="visual-zoom-hint" aria-hidden="true">⤢ ${pages.length>1?`Xem ${pages.length} trang`:'Phóng to hình'}</span></button><figcaption><span class="illustration-label">${badge(v)}</span><h3>${esc(v.title)}</h3><p>${esc(v.caption)}</p>${v.readingTip?`<p class="visual-reading-tip"><strong>Xem chỗ nào?</strong> ${esc(v.readingTip)}</p>`:''}<button class="visual-open" data-visual="${esc(v.id)}">${pages.length>1?'Xem từng trang':'Xem hình lớn'} <span aria-hidden="true">↗</span></button>${sourceLinks(v,p)}</figcaption></figure>`;}).join('')}</section>`;
}
export function bindVisuals(procedure,root){
 root.querySelectorAll('[data-visual]').forEach(button=>button.addEventListener('click',()=>{
  const v=(procedure.visuals||[]).find(v=>v.id===button.dataset.visual);if(!v)return;
  const pages=visualPages(v);if(!pages.length)return;let index=0;
  const dialog=document.createElement('dialog');dialog.className='visual-dialog';dialog.setAttribute('aria-labelledby','visual-dialog-title');
  dialog.innerHTML=`<div class="visual-dialog-header"><div><span class="illustration-label">${badge(v)}</span><h2 id="visual-dialog-title">${esc(v.title)}</h2></div><button class="secondary-button visual-close" aria-label="Đóng mẫu đang xem" autofocus>Đóng <span aria-hidden="true">×</span></button></div><p class="visual-dialog-caption">${esc(v.caption)}</p>${pages.length>1?`<div class="visual-page-nav"><button class="secondary-button visual-prev" aria-label="Xem trang trước">← Trang trước</button><label>Chọn trang<select class="visual-page-select" aria-label="Chọn trang của mẫu">${pages.map((p,i)=>`<option value="${i}">${i+1}/${pages.length} · ${esc(p.label||`Trang ${i+1}`)}</option>`).join('')}</select></label><button class="secondary-button visual-next" aria-label="Xem trang tiếp theo">Trang sau →</button></div>`:''}<p class="visual-page-description" aria-live="polite" aria-atomic="true"></p><div class="visual-dialog-controls"><button class="secondary-button visual-zoom" aria-pressed="false">Phóng to để đọc</button><span>Khi phóng to, vuốt ngang để xem toàn bộ trang.</span></div><div class="visual-image-scroll" tabindex="0" role="region" aria-label="Trang mẫu, có thể cuộn khi phóng to"></div><p class="visual-image-error" role="status" hidden>${localPdfPath(v.originalPdf)?'Chưa tải được ảnh. Bạn có thể bấm “Mở PDF gốc” bên dưới để xem mẫu.':'Chưa tải được ảnh. Bạn có thể đóng hình, đọc hướng dẫn bằng chữ và tải lại trang để thử lại.'}</p>${sourceLinks(v,pages[0])}`;
  const scroller=dialog.querySelector('.visual-image-scroll'),select=dialog.querySelector('.visual-page-select'),description=dialog.querySelector('.visual-page-description');
  function showPage(next){
   index=Math.max(0,Math.min(pages.length-1,next));const p=pages[index];
   scroller.innerHTML=imageMarkup(v,p);scroller.scrollTop=0;scroller.scrollLeft=0;
   const error=dialog.querySelector('.visual-image-error');error.hidden=true;
   scroller.querySelector('img').addEventListener('error',()=>{error.hidden=false;},{once:true});
   description.textContent=`${pages.length>1?`Trang ${index+1}/${pages.length}. `:''}${p.note||v.readingTip||''}`;
   if(select){select.value=String(index);dialog.querySelector('.visual-prev').disabled=index===0;dialog.querySelector('.visual-next').disabled=index===pages.length-1;}
   const pdf=dialog.querySelector('.visual-pdf-link');if(pdf){pdf.setAttribute('href',pdfHref(v,p));pdf.querySelector('.visual-pdf-page').textContent=`(trang ${sourcePage(p)})`;}
  }
  showPage(0);
  document.body.append(dialog);const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
  dialog.querySelector('.visual-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.visual-zoom').addEventListener('click',event=>{const zoomed=dialog.classList.toggle('is-zoomed');event.currentTarget.setAttribute('aria-pressed',String(zoomed));event.currentTarget.textContent=zoomed?'Vừa màn hình':'Phóng to để đọc';});
  select?.addEventListener('change',()=>showPage(Number(select.value)));
  dialog.querySelector('.visual-prev')?.addEventListener('click',()=>showPage(index-1));
  dialog.querySelector('.visual-next')?.addEventListener('click',()=>showPage(index+1));
  dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;dialog.remove();if(button.isConnected)button.focus();},{once:true});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
 }));
}
