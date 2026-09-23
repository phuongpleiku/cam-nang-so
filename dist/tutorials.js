const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = item => {
  try {
    const url = new URL(item.url);
    if (url.protocol !== 'https:') return '';
    return '<a class="tutorial-link" href="'+esc(url.href)+'" target="_blank" rel="noopener noreferrer">'+esc(item.label)+' ↗<span class="sr-only"> (mở trang mới)</span></a>';
  } catch { return ''; }
};

export function tutorialPosition(guide,saved={}) {
  const paths=guide.paths||[guide];
  const path=Number.isInteger(saved.path)&&saved.path>=0&&saved.path<paths.length?saved.path:0;
  const steps={};
  paths.forEach((p,i)=>{const value=saved.steps?.[i];steps[i]=Number.isInteger(value)&&value>=0&&value<p.steps.length?value:0;});
  return {path,steps};
}

function stepsMarkup(guide,position) {
  return (guide.intro?'<p class="tutorial-intro">'+esc(guide.intro)+'</p>':'')+
    '<div class="tutorial-step-count" role="status">Thao tác <span data-step-count>'+(position+1)+'</span> / '+guide.steps.length+'</div>'+
    '<ol class="tutorial-steps">'+guide.steps.map((step,index)=>'<li class="tutorial-step" data-step="'+index+'" '+(index!==position?'hidden':'')+'>'+
      '<span class="tutorial-number" aria-hidden="true">'+(index+1)+'</span><div><h4 tabindex="-1">'+esc(step.title)+'</h4><p>'+esc(step.action)+'</p>'+
      (step.links?'<div class="tutorial-links">'+step.links.map(external).join('')+'</div>':'')+
      (step.expected?'<p class="tutorial-expected"><strong>Bạn sẽ thấy:</strong> '+esc(step.expected)+'</p>':'')+'</div></li>').join('')+'</ol>'+
    '<div class="tutorial-navigation"><button class="secondary-button" type="button" data-step-move="-1" '+(position===0?'disabled':'')+'>Thao tác trước</button><button class="primary-button" type="button" data-step-move="1" '+(position===guide.steps.length-1?'hidden':'')+'>Thao tác tiếp theo →</button><span data-step-end '+(position!==guide.steps.length-1?'hidden':'')+'>Đã đến cuối hướng dẫn.</span></div>'+
    '<div class="tutorial-ready" data-ready '+(position!==guide.steps.length-1?'hidden':'')+'><strong>Kiểm tra trước khi đánh dấu đã chuẩn bị</strong><p>'+esc(guide.ready)+'</p></div>'+
    '<button class="text-button" data-show-all type="button" aria-expanded="false">Xem tất cả thao tác</button>';
}

export function renderTutorial(guide,key,common={},saved={}) {
  if(!guide)return '';
  const position=tutorialPosition(guide,saved[key]);
  return '<div class="tutorial" data-tutorial="'+esc(key)+'">'+
    (guide.paths?'<p class="tutorial-path-label">Chọn cách phù hợp với bạn:</p><div class="tutorial-paths" role="group" aria-label="Cách thực hiện">'+guide.paths.map((path,i)=>'<button type="button" data-path="'+i+'" aria-pressed="'+(i===position.path)+'" aria-controls="'+esc(key)+'-path-'+i+'">'+esc(path.label)+'</button>').join('')+'</div>':'')+
    (guide.paths||[guide]).map((path,i)=>'<section class="tutorial-path" data-path-index="'+i+'" data-current-step="'+position.steps[i]+'" id="'+esc(key)+'-path-'+i+'" aria-label="'+esc(path.label||'Hướng dẫn từng thao tác')+'" '+(i!==position.path?'hidden':'')+'>'+stepsMarkup(path,position.steps[i])+'</section>').join('')+
    (guide.relatedGuide&&common[guide.relatedGuide]?'<details class="tutorial-related" '+(saved[key+'-photo']?'open':'')+'><summary>Chụp và đính kèm giấy tờ như thế nào?</summary>'+renderTutorial(common[guide.relatedGuide],key+'-photo',common,saved)+'</details>':'')+
    (guide.troubleshooting?.length?'<details class="tutorial-troubles"><summary>Tôi đang vướng — xem cách xử lý</summary>'+guide.troubleshooting.map(t=>'<details><summary>'+esc(t.problem)+'</summary><p>'+esc(t.solution)+'</p></details>').join('')+'</details>':'')+
    (guide.sources?.length?'<details class="tutorial-sources"><summary>Nguồn đối chiếu hướng dẫn</summary><p>Đối chiếu ngày '+esc(guide.reviewedAt.split('-').reverse().join('/'))+'. Tên nút có thể thay đổi khi cổng cập nhật.</p>'+guide.sources.map(external).join('')+'</details>':'')+'</div>';
}

export function bindTutorials(root,onChange=()=>{}) {
  const remember=tutorial=>{
    const paths=[...tutorial.querySelectorAll(':scope > .tutorial-path')];
    onChange(tutorial.dataset.tutorial,{path:Math.max(0,paths.findIndex(p=>!p.hidden)),steps:Object.fromEntries(paths.map((p,i)=>[i,Number(p.dataset.currentStep)]))});
  };
  const display=(panel,index,focus=false)=>{
    const steps=[...panel.querySelectorAll(':scope > .tutorial-steps > li')];
    panel.dataset.currentStep=String(index);
    const all=panel.dataset.showAll==='true';
    steps.forEach((step,i)=>step.hidden=!all&&i!==index);
    panel.querySelector('[data-step-count]').textContent=String(index+1);
    panel.querySelector('[data-step-move="-1"]').disabled=index===0;
    panel.querySelector('[data-step-move="1"]').hidden=index===steps.length-1;
    panel.querySelector('[data-step-end]').hidden=index!==steps.length-1;
    panel.querySelector('[data-ready]').hidden=!all&&index!==steps.length-1;
    if(focus){const heading=steps[index].querySelector('h4');heading.focus({preventScroll:true});heading.scrollIntoView({block:'nearest'});}
  };
  root.querySelectorAll('[data-path]').forEach(button=>button.addEventListener('click',()=>{
    const tutorial=button.closest('[data-tutorial]');
    tutorial.querySelectorAll(':scope > .tutorial-paths > button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    tutorial.querySelectorAll(':scope > .tutorial-path').forEach((p,i)=>p.hidden=i!==Number(button.dataset.path));
    remember(tutorial);
  }));
  root.querySelectorAll('[data-step-move]').forEach(button=>button.addEventListener('click',()=>{
    const panel=button.closest('.tutorial-path'),steps=panel.querySelectorAll(':scope > .tutorial-steps > li');
    display(panel,Math.max(0,Math.min(steps.length-1,Number(panel.dataset.currentStep)+Number(button.dataset.stepMove))),true);
    remember(button.closest('[data-tutorial]'));
  }));
  root.querySelectorAll('[data-show-all]').forEach(button=>button.addEventListener('click',()=>{
    const panel=button.closest('.tutorial-path'),all=panel.dataset.showAll!=='true';
    panel.dataset.showAll=String(all);button.setAttribute('aria-expanded',String(all));button.textContent=all?'Chỉ xem từng thao tác':'Xem tất cả thao tác';
    display(panel,Number(panel.dataset.currentStep));
  }));
}
