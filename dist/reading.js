export function initReadingControls(){
 const button=document.querySelector('#large-text');if(!button)return;
 let large=false;try{large=localStorage.getItem('cns:large-text')==='true';}catch{}
 const show=()=>{document.documentElement.classList.toggle('large-text',large);button.setAttribute('aria-pressed',String(large));button.textContent=large?'A− Giảm cỡ chữ':'A+ Tăng cỡ chữ';};
 show();button.addEventListener('click',()=>{large=!large;show();try{localStorage.setItem('cns:large-text',String(large));}catch{}});
 const synth=window.speechSynthesis;if(!synth||!window.SpeechSynthesisUtterance)return;
 let active=null,currentUtterance=null;
 const stop=()=>{currentUtterance=null;if(active){active.textContent='Nghe bước này';active=null;}synth.cancel();};
 const voice=()=>synth.getVoices().find(v=>/^vi(?:-|_|$)/i.test(v.lang));
 const refresh=()=>document.querySelectorAll('[data-read-step]').forEach(b=>b.hidden=!voice());
 synth.addEventListener('voiceschanged',refresh);
 document.addEventListener('cns:render',()=>{stop();refresh();});
 window.addEventListener('pagehide',stop);
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-read-step]');
  if(!button){if(event.target.closest('[data-step-move],[data-step-jump],[data-path],[data-device-choice],[data-show-all],a'))stop();return;}
  if(active===button){stop();return;}
  stop();const selected=voice();if(!selected)return;
  const step=button.closest('.tutorial-step');
  const message=[step.querySelector('h4')?.textContent,step.querySelector('.step-action')?.textContent,step.querySelector('.tutorial-expected')?.textContent].filter(Boolean).join('. ');
  const utterance=new SpeechSynthesisUtterance(message);utterance.voice=selected;utterance.lang='vi-VN';utterance.rate=.85;
  active=button;currentUtterance=utterance;button.textContent='Dừng đọc';
  utterance.onend=utterance.onerror=()=>{if(currentUtterance===utterance){button.textContent='Nghe bước này';active=null;currentUtterance=null;}};
  synth.speak(utterance);
 });
 refresh();
}
