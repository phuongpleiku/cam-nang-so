import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {freshRecord,restoreRecord,resumePoint,pruneProgress,setPreparationStatus} from '../dist/progress.js';
import {setAnswer,matches} from '../dist/rules.js';
import {tutorialPosition,renderTutorial,bindTutorials} from '../dist/tutorials.js';
import {questionHelp,tabHelp} from '../dist/novice.js';
import {isComplete,checklistFor,searchProcedures} from '../dist/rules.js';
import {renderVisuals} from '../dist/visuals.js';
import {homeCopy,searchHomeProcedures,renderHomeCard,searchHint} from '../dist/home.js';
import {initReadingControls} from '../dist/reading.js';
const read=async name=>JSON.parse(await readFile(new URL(`../dist/data/${name}.json`,import.meta.url),'utf8'));
const birth=await read('khai-sinh'),death=await read('khai-tu'),common=await read('huong-dan-chung');
const certification=await read('chung-thuc-ban-sao');
const marital=await read('tinh-trang-hon-nhan');
const civil=await read('ban-sao-ho-tich');
const civilAnswers={need:'birth',registered:'yes',role:'self',details:'paper'};

test('Cỡ chữ nhớ lựa chọn; đọc bước chỉ bật khi có tiếng Việt và dừng khi chuyển bước',t=>{
 const names=['document','window','localStorage','SpeechSynthesisUtterance'];
 const originals=new Map(names.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 t.after(()=>{for(const [k,d] of originals){if(d)Object.defineProperty(globalThis,k,d);else delete globalThis[k];}});
 const events={},voiceEvents={},stored=new Map([['cns:large-text','true']]),voices=[],spoken=[];
 let fontLarge=false,cancelled=0;
 const size={setAttribute(k,v){this[k]=v;},addEventListener(type,fn){this.click=fn;}};
 const step={querySelector:s=>({textContent:({'h4':'Chọn tệp','.step-action':'Chọn ảnh của bạn.','.tutorial-expected':'Tên tệp xuất hiện.'})[s]})};
 const read={hidden:true,textContent:'Nghe bước này',closest:()=>step};
 const speech={getVoices:()=>voices,addEventListener:(type,fn)=>{voiceEvents[type]=fn;},cancel:()=>{cancelled++;},speak:u=>spoken.push(u)};
 function Utterance(text){this.text=text;}
 const values={
  document:{querySelector:()=>size,querySelectorAll:()=>[read],documentElement:{classList:{toggle:(name,on)=>{fontLarge=on;}}},addEventListener:(type,fn)=>{events[type]=fn;}},
  window:{speechSynthesis:speech,SpeechSynthesisUtterance:Utterance,addEventListener:()=>{}},
  localStorage:{getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)},SpeechSynthesisUtterance:Utterance
 };
 for(const [k,v] of Object.entries(values))Object.defineProperty(globalThis,k,{value:v,writable:true,configurable:true});
 initReadingControls();assert.equal(fontLarge,true);assert.equal(size['aria-pressed'],'true');assert.equal(read.hidden,true);
 size.click();assert.equal(fontLarge,false);assert.equal(stored.get('cns:large-text'),'false');
 voices.push({lang:'en-US'});voiceEvents.voiceschanged();assert.equal(read.hidden,true);
 voices.push({lang:'vi-VN'});voiceEvents.voiceschanged();assert.equal(read.hidden,false);
 const clickRead=()=>events.click({target:{closest:s=>s==='[data-read-step]'?read:null}});
 clickRead();assert.equal(spoken[0].lang,'vi-VN');assert.match(spoken[0].text,/Chọn ảnh của bạn/);assert.equal(read.textContent,'Dừng đọc');
 events.click({target:{closest:s=>s==='[data-read-step]'?null:{}}});assert.equal(read.textContent,'Nghe bước này');assert.ok(cancelled>0);
 clickRead();spoken[0].onend();assert.equal(read.textContent,'Dừng đọc','Phản hồi cũ không tắt lượt đọc mới');
 events['cns:render']();assert.equal(read.textContent,'Nghe bước này');
 values.localStorage.setItem=()=>{throw Error('Không cho lưu');};assert.doesNotThrow(()=>size.click());assert.equal(fontLarge,true);
});

test('Tên dân thường không khớp nhầm một phần từ của thủ tục khác',()=>{
 const procedures=[birth,death,certification,marital,civil];
 for(const [term,id] of [['chứng tử',death.id],['sao y',certification.id],['KHAI SINH CHO CHAU',birth.id],['công chứng căn cước',certification.id],['xin lại giấy khai sinh',civil.id]]){
  assert.deepEqual(searchHomeProcedures(procedures,term).map(p=>p.id),[id],term);
 }
 assert.equal(searchHomeProcedures(procedures,'công chứng hợp đồng').length,0);
 assert.match(searchHint('công chứng hợp đồng'),/hợp đồng/);
 assert.match(searchHint('khai sinh'),/Đã đăng ký/);
 assert.equal(searchHint('giấy độc thân'),'');
});

test('Đổi phiên bản thao tác giữ câu trả lời nhưng không tiếp tục nhầm vị trí cũ',()=>{
 const saved={...freshRecord(civil),answers:civilAnswers,checked:['login','old-record'],lastStep:3,tutorials:{submission:{path:0,steps:{0:10}}}};
 const restored=restoreRecord(civil,saved);
 assert.deepEqual(restored.answers,civilAnswers);assert.deepEqual(restored.checked,saved.checked);
 assert.equal(resumePoint(civil,restored).step,3);
 assert.equal(tutorialPosition(civil.submissionGuide,restored.tutorials.submission).steps[0],0);
 const current={...saved.tutorials.submission,revision:civil.submissionGuide.revision};
 assert.equal(tutorialPosition(civil.submissionGuide,current).steps[0],10);
 assert.equal(tutorialPosition({...civil.submissionGuide,revision:current.revision+1},current).steps[0],0);
});

test('Một điện thoại không được dẫn vào nhánh quét QR trên chính màn hình',()=>{
 const guide=common['dang-nhap-quoc-gia'];
 const saved={revision:guide.revision,device:'phone',path:1,steps:{1:2}};
 assert.equal(tutorialPosition(guide,saved).path,0);
 const phone=renderTutorial(guide,'login',common,{login:saved});
 assert.match(phone,/data-path="1" data-for-device="computer" hidden/);
 const computer=renderTutorial(guide,'login',common,{login:{...saved,device:'computer'}});
 assert.match(computer,/data-path="1" data-for-device="computer" aria-pressed="true"/);
 assert.doesNotMatch(computer,/data-path="1" data-for-device="computer" hidden/);
 assert.match(phone,/Cổng đã đăng nhập → kiểm tra tài khoản/);
});

test('Mỗi thủ tục có trợ giúp tại thao tác và không tự bỏ qua giấy phải nộp',()=>{
 for(const p of [birth,death,certification,marital,civil]){
  const guide=p.submissionGuide;
  assert.ok(guide.steps.length>0);
  const helpUrl=`#ho-tro/${p.id}/nop-ho-so`;
  const html=renderTutorial(guide,'submission',common,{},p.visuals||[],helpUrl);
  assert.match(html,new RegExp(`href="${helpUrl}"`));
  assert.match(html,/data-read-step hidden/);
  assert.match(html,/data-step="0" >/);
  assert.match(html,/data-step="1" hidden/);
  const skip=guide.steps.find(s=>s.skipLabel?.startsWith('Không có giấy'));
  if(p===certification)assert.equal(skip,undefined,'Chứng thực phải có giấy cần chứng thực');
  else if(skip){assert.ok(skip.skipTo>guide.steps.indexOf(skip));assert.ok(skip.skipTo<guide.steps.length);}
 }
 const unsafe=renderTutorial({steps:[{title:'A',action:'B',help:'<script>x</script>',skipTo:999,skipLabel:'Sai'}],ready:'X'},'x');
 assert.doesNotMatch(unsafe,/<script>|data-step-jump/);assert.match(unsafe,/&lt;script&gt;/);
});

test('Bỏ qua phần không áp dụng chuyển đúng bước, có thể quay lại và lưu vị trí',()=>{
 const slots=new Map(),saved=[];
 let focused=-1;
 const steps=Array.from({length:5},(_,i)=>({hidden:i!==0,querySelector:()=>({focus:()=>{focused=i;},scrollIntoView:()=>{}})}));
 const panel={dataset:{currentStep:'0'},hidden:false,querySelector:s=>{if(!slots.has(s))slots.set(s,{});return slots.get(s);},querySelectorAll:()=>steps};
 const tutorial={dataset:{tutorial:'submission',revision:'2'},querySelectorAll:()=>[panel]};
 const button=dataset=>({dataset,addEventListener(type,fn){this.click=fn;},closest:s=>s==='.tutorial-path'?panel:tutorial});
 const skip=button({stepJump:'4'}),previous=button({stepMove:'-1'});
 const root={querySelectorAll:s=>s==='[data-step-jump]'?[skip]:s==='[data-step-move]'?[previous]:[]};
 bindTutorials(root,(key,position)=>saved.push({key,position}));
 skip.click();
 assert.equal(focused,4);assert.equal(panel.dataset.currentStep,'4');assert.equal(steps[4].hidden,false);assert.equal(steps[0].hidden,true);
 assert.equal(slots.get('[data-step-move="1"]').hidden,true);
 assert.deepEqual(saved.at(-1),{key:'submission',position:{path:0,steps:{0:4},revision:2}});
 previous.click();assert.equal(panel.dataset.currentStep,'3');assert.equal(slots.get('[data-step-move="1"]').hidden,false);
 skip.dataset.stepJump='99';skip.click();assert.equal(panel.dataset.currentStep,'3');
});

test('Trang chủ tìm được bằng tên đời thường, mã và giữ đúng bộ lọc',()=>{
 const procedures=[birth,death,certification,marital,civil];
 assert.ok(searchHomeProcedures(procedures,'sao y').some(p=>p.id===certification.id));
 assert.ok(searchHomeProcedures(procedures,'giay doc than').some(p=>p.id===marital.id));
 assert.deepEqual(searchHomeProcedures(procedures,'2.000635').map(p=>p.id),[civil.id]);
 assert.equal(searchHomeProcedures(procedures,'2.000635','nhóm không tồn tại').length,0);
 assert.equal(searchHomeProcedures(procedures,'thủ tục chưa có xyz').length,0);
 const future={...civil,id:'thu-tuc-moi',home:undefined,shortTitle:'Thủ tục mới',description:'Mô tả mới',keywords:[]};
 assert.equal(homeCopy(future).title,'Thủ tục mới');
 assert.equal(searchHomeProcedures([future],'thu tuc moi')[0],future,'Thủ tục mới dùng dữ liệu sẵn có, không cần sửa giao diện');
});

test('Thẻ trang chủ mở đúng điểm dừng, có tên rõ và thoát nội dung HTML',()=>{
 const html=renderHomeCard(civil,{href:'#thu-tuc/ban-sao-ho-tich/chuan-bi/old-record',progressLabel:'Chuẩn bị giấy tờ'});
 assert.match(html,/href="#thu-tuc\/ban-sao-ho-tich\/chuan-bi\/old-record"/);
 assert.match(html,/Tiếp tục hướng dẫn/);assert.match(html,/Đang xem: Chuẩn bị giấy tờ/);
 assert.equal((html.match(/<a /g)||[]).length,1,'Mỗi ô là một liên kết, không có liên kết lồng nhau');
 assert.match(html,/aria-labelledby="home-title-ban-sao-ho-tich home-action-ban-sao-ho-tich"/);
 const unsafe=renderHomeCard({...civil,home:{title:'<img src=x onerror=alert(1)>',description:'<script>x</script>'}},{href:'javascript:alert(1)'});
 assert.doesNotMatch(unsafe,/<script>|<img |href="javascript:/);assert.match(unsafe,/&lt;script&gt;/);
 assert.match(unsafe,/Xem từng bước/);assert.doesNotMatch(unsafe,/Tiếp tục hướng dẫn/);
});

test('Xin bản sao hộ tịch phân biệt đăng ký mới, chứng thực và giấy tờ khi làm thay',()=>{
 assert.equal(isComplete(civil,civilAnswers),true);
 for(const need of ['new','certify','unsure'])assert.equal(isComplete(civil,{...civilAnswers,need}),false);
 for(const registered of ['no','unsure'])assert.equal(isComplete(civil,{...civilAnswers,registered}),false);
 assert.equal(isComplete(civil,{...civilAnswers,role:'organization'}),false);
 assert.equal(isComplete(civil,{...civilAnswers,details:'missing'}),true,'Mất giấy hoặc thiếu số đăng ký không tự đồng nghĩa chưa đăng ký');
 const ids=role=>checklistFor(civil,{...civilAnswers,role}).map(i=>i.id);
 assert.ok(!ids('self').includes('authorization'));assert.ok(!ids('self').includes('representation'));
 for(const role of ['family','other']){assert.ok(ids(role).includes('authorization'));assert.ok(!ids(role).includes('representation'));}
 assert.ok(ids('representative').includes('representation'));assert.ok(!ids('representative').includes('authorization'));
 for(const term of ['ban sao khai sinh','trich luc'])assert.ok(searchProcedures([birth,death,certification,marital,civil],term).some(p=>p.id===civil.id));
 assert.deepEqual(searchProcedures([birth,death,certification,marital,civil],'2.000635').map(p=>p.id),[civil.id]);
 const results=need=>civil.resultItems.filter(i=>i.when&&matches(i.when,{...civilAnswers,need})).map(i=>i.text);
 assert.equal(results('birth').length,1);assert.match(results('birth')[0],/Giấy khai sinh/);
 assert.equal(results('extract').length,1);assert.match(results('extract')[0],/Trích lục hộ tịch/);
});

test('Đổi cách làm bản sao bỏ giấy ủy quyền và giữ đúng thao tác đang xem',()=>{
 const r={...freshRecord(civil),answers:{...civilAnswers,role:'other'},checked:['authorization','old-record'],tutorials:{submission:{revision:civil.submissionGuide.revision,path:0,steps:{0:10}}},lastStep:3};
 r.answers=setAnswer(civil,r.answers,'role','self');pruneProgress(civil,r);
 assert.deepEqual(r.checked,['old-record']);assert.equal(r.tutorials.submission.steps[0],10);
 const restored=restoreRecord(civil,r);assert.equal(resumePoint(civil,restored).step,3);assert.equal(Object.hasOwn(restored,'submitted'),false);
 const html=renderTutorial(civil.submissionGuide,'submission',common,restored.tutorials,civil.visuals);
 assert.match(html,/data-step="10" >/);assert.match(html,/ht-uy-quyen-va-nop.jpg/);
 assert.match(html,/không xác nhận hồ sơ đã nộp/);
 const login=common[civil.checklist.find(i=>i.id==='login').guideRef];
 assert.ok(JSON.stringify(login).includes('https://dichvucong.gov.vn/'));
 assert.ok(!JSON.stringify(login).includes('lienthong.dichvucong.gov.vn'));
});
const maritalAnswers={purpose:'other',role:'self',status:'never',previous:'first',residence:'pleiku',history:'single'};

test('Tình trạng hôn nhân chỉ yêu cầu giấy đúng trường hợp và kiểm tra nơi nộp',()=>{
 assert.equal(isComplete(marital,maritalAnswers),true);
 const ids=answers=>checklistFor(marital,answers).map(i=>i.id);
 assert.deepEqual(ids(maritalAnswers),['login','identity','purpose','residence','files']);
 for(const role of ['family','other'])assert.ok(ids({...maritalAnswers,role}).includes('authorization'));
 for(const status of ['divorced','widowed','foreign'])assert.ok(ids({...maritalAnswers,status}).includes('marital-evidence'));
 assert.ok(ids({...maritalAnswers,previous:'reissue'}).includes('old-certificate'));
 assert.ok(ids({...maritalAnswers,previous:'lost'}).includes('missing-old'));
 assert.ok(!ids({...maritalAnswers,previous:'lost'}).includes('old-certificate'));
 assert.ok(ids({...maritalAnswers,purpose:'marriage'}).includes('partner'));
 for(const residence of ['other','abroad','unsure'])assert.equal(isComplete(marital,{...maritalAnswers,residence}),false);
 assert.equal(isComplete(marital,{...maritalAnswers,status:'married'}),true,'Đang có vợ/chồng vẫn có thể xin giấy cho mục đích khác');
 for(const term of ['giay doc than','1.004873'])assert.equal(searchProcedures([birth,death,certification,marital],term)[0].id,marital.id);
});

test('Đổi từ làm thay/cấp lại sang tự làm/lần đầu bỏ tiến độ giấy không áp dụng',()=>{
 const r={...freshRecord(marital),answers:{...maritalAnswers,role:'other',previous:'reissue',status:'divorced'},checked:['authorization','old-certificate','marital-evidence'],tutorials:{submission:{path:0,steps:{0:11}}}};
 for(const [q,v] of [['role','self'],['previous','first'],['status','never']])r.answers=setAnswer(marital,r.answers,q,v);
 pruneProgress(marital,r);
 assert.deepEqual(r.checked,[]);assert.equal(r.tutorials.submission.steps[0],11);
 const restored=restoreRecord(marital,{...r,lastStep:3});assert.equal(resumePoint(marital,restored).step,3);
 assert.equal(Object.hasOwn(restored,'submitted'),false);
});

test('Hướng dẫn kết hôn phân biệt mục đích, lưu nháp và đăng nhập đúng cổng',()=>{
 const fields=marital.fields.filter(f=>matches(f.when,{...maritalAnswers,purpose:'marriage'}));
 assert.ok(fields.some(f=>f.title==='Mục đích: đăng ký kết hôn'));
 assert.ok(!fields.some(f=>f.title==='Mục đích khác hoặc chưa rõ'));
 assert.match(fields.map(f=>f.body+' '+f.check).join(' '),/01 bản/);
 const login=common[marital.checklist.find(i=>i.id==='login').guideRef];
 assert.ok(JSON.stringify(login).includes('https://dichvucong.gov.vn/'));
 assert.ok(!JSON.stringify(login).includes('lienthong.dichvucong.gov.vn'));
 assert.equal(certification.checklist.find(i=>i.id==='login').guideRef,'dang-nhap-quoc-gia');
 const html=renderTutorial(marital.submissionGuide,'submission',common,{submission:{revision:marital.submissionGuide.revision,path:0,steps:{0:11}}},marital.visuals);
 assert.match(html,/data-step="11" >/);assert.match(html,/Lưu nháp nếu muốn làm sau/);
 assert.match(html,/hn-luu-va-nop.jpg/);assert.match(html,/không xác nhận hồ sơ đã nộp/);
});
const birthAnswers={registered:'no',role:'parent',birthPaper:'yes',residence:'mother',nationality:'no',identity:'no'};

test('Chứng thực bản sao tìm được bằng mã/từ thông dụng và không dẫn sai thủ tục',()=>{
 const answers={purpose:'copy',original:'yes',issuer:'domestic',format:'paper'};
 assert.equal(isComplete(certification,answers),true);
 for(const purpose of ['signature','translation','unsure'])assert.equal(isComplete(certification,{...answers,purpose}),false);
 assert.equal(checklistFor(certification,answers).some(i=>i.id==='foreign-paper'),false);
 assert.equal(checklistFor(certification,{...answers,issuer:'foreign'}).some(i=>i.id==='foreign-paper'),true);
 for(const term of ['sao y','chung thuc','2.000815'])assert.equal(searchProcedures([birth,death,certification],term)[0].id,certification.id);
 const visible=certification.resultItems.filter(i=>matches(i.when,answers));
 assert.equal(visible.length,1);assert.match(visible[0].text,/Bản giấy/);
});
test('Hướng dẫn nộp nhớ thao tác, giữ khi đổi nhánh và không tự đánh dấu đã nộp',()=>{
 const saved={...freshRecord(certification),answers:{purpose:'copy',original:'yes',issuer:'foreign',format:'both'},lastStep:3,tutorials:{submission:{revision:certification.submissionGuide.revision,path:0,steps:{0:8}}}};
 const r=restoreRecord(certification,saved);
 assert.deepEqual(resumePoint(certification,r),{step:3,item:'',question:0});
 r.answers=setAnswer(certification,r.answers,'issuer','domestic');pruneProgress(certification,r);
 assert.equal(r.tutorials.submission.steps[0],8);assert.deepEqual(r.checked,[]);assert.equal(Object.hasOwn(r,'submitted'),false);
 assert.equal(restoreRecord({...birth,submissionGuide:undefined},{...freshRecord(birth),tutorials:saved.tutorials}).tutorials.submission,undefined);
 const html=renderTutorial(certification.submissionGuide,'submission',common,r.tutorials,certification.visuals);
 assert.match(html,/data-step="8" >/);assert.match(html,/data-step="7" hidden/);assert.match(html,/ct-kiem-tra-tep.jpg/);
 assert.match(html,/Sau thao tác cuối, kiểm tra trên cổng/);assert.doesNotMatch(html,/Kiểm tra trước khi đánh dấu đã chuẩn bị|data-prep-status/);
});
test('Ảnh thao tác được ghi đúng nguồn, không gọi là mẫu trống hoặc sơ đồ',()=>{
 const html=renderVisuals(certification,'nop-ho-so');
 assert.match(html,/Ảnh thao tác trên cổng/);assert.doesNotMatch(html,/Mẫu trống từ văn bản chính thức|Sơ đồ minh họa/);
 assert.doesNotMatch(html,/download|\.pdf#page=/);
});

test('Nâng dữ liệu cũ giữ câu trả lời và checklist; tiếp tục tới chuẩn bị',()=>{
 const r=restoreRecord(birth,{version:1,answers:birthAnswers,checked:['login','birth-paper','fake']});
 assert.deepEqual(r.answers,birthAnswers);assert.deepEqual(r.checked,['login','birth-paper']);
 assert.deepEqual(resumePoint(birth,r),{step:1,item:'',question:0});
});
test('Tiếp tục đúng mục và nhánh/thao tác sau khi đóng rồi mở lại',()=>{
 const saved={...freshRecord(birth),answers:birthAnswers,lastStep:1,item:'login',tutorials:{'prep-login':{revision:2,device:'computer',path:1,steps:{0:2,1:3}}}};
 const r=restoreRecord(birth,JSON.parse(JSON.stringify(saved)));
 assert.deepEqual(resumePoint(birth,r),{step:1,item:'login',question:0});
 assert.deepEqual(tutorialPosition(common['dang-nhap'],r.tutorials['prep-login']),{path:1,steps:{0:2,1:3,2:0,3:0},revision:2,device:'computer'});
 r.lastStep=4;assert.equal(resumePoint(birth,r).step,4);assert.equal(resumePoint(birth,r).item,'');
 assert.equal(Object.hasOwn(r,'submitted'),false);
});
test('Trả lời dở tiếp tục câu thiếu; trường hợp bị chặn không mở trang nộp',()=>{
 const r=restoreRecord(birth,{version:1,answers:{registered:'no',role:'parent'},lastStep:4});
 assert.deepEqual(resumePoint(birth,r),{step:0,item:'',question:2});
 r.answers.registered='yes';assert.deepEqual(resumePoint(birth,r),{step:0,item:'',question:0});
});
test('Đổi nhánh bỏ tiến độ giấy tờ không còn áp dụng',()=>{
 const r=restoreRecord(death,{version:1,answers:{registered:'no',deathPaper:'yes',need:'survivor',benefit:['insurance']},lastStep:1,item:'survivor-info',checked:['benefit-info'],needsHelp:['survivor-info'],tutorials:{'prep-survivor-info':{path:0,steps:{0:2}},'prep-login':{path:0,steps:{0:1}}}});
 r.answers=setAnswer(death,r.answers,'need','basic');pruneProgress(death,r);
 assert.deepEqual(r.checked,[]);assert.deepEqual(r.needsHelp,[]);assert.equal(r.item,'');assert.equal(r.tutorials['prep-survivor-info'],undefined);assert.ok(r.tutorials['prep-login']);
});
test('Đã chuẩn bị và Cần hỏi thêm không đồng thời; đặt lại xóa điểm dừng',()=>{
 const r=freshRecord(birth);setPreparationStatus(r,'login','help');assert.deepEqual(r.needsHelp,['login']);
 setPreparationStatus(r,'login','ready');assert.deepEqual(r.checked,['login']);assert.deepEqual(r.needsHelp,[]);
 setPreparationStatus(r,'login','todo');assert.deepEqual(r.checked,[]);
 assert.deepEqual(freshRecord(birth).tutorials,{});
});
test('Dữ liệu vị trí không hợp lệ được bỏ, không giữ dữ liệu tự do',()=>{
 const r=restoreRecord(birth,{version:1,answers:birthAnswers,lastStep:99,item:'missing',tutorials:{'prep-login':{path:99,steps:{0:999}},secret:'private'}});
 assert.equal(r.item,'');assert.equal(r.lastStep,1);assert.equal(r.tutorials.secret,undefined);
 assert.deepEqual(tutorialPosition(common['dang-nhap'],r.tutorials['prep-login']),{path:0,steps:{0:0,1:0,2:0,3:0},revision:2,device:'phone'});
 assert.deepEqual(restoreRecord(birth,{version:0,answers:birthAnswers}),freshRecord(birth));
});
test('Hướng dẫn ngắn chỉ mở một thao tác; thao tác cuối chưa đánh dấu đã chuẩn bị',()=>{
 const g=birth.checklist.find(i=>i.id==='birth-paper').guide;
 const html=renderTutorial(g,'prep-birth-paper',common,{'prep-birth-paper':{path:0,steps:{0:1}}});
 assert.match(html,/data-step="0" hidden/);assert.match(html,/data-step="1" >/);assert.match(html,/data-step="2" hidden/);
 assert.match(html,/Xem tất cả thao tác/);assert.doesNotMatch(html,/data-prep-status|data-check/);
 assert.match(renderTutorial(g,'x',common,{x:{path:0,steps:{0:2}}}),/data-ready >/);
});
test('Nhận diện giấy có hình ngay câu hỏi; dữ liệu chữ không thực thi HTML',()=>{
 assert.match(questionHelp(birth,birth.questions[0]),/mau-giay-chung-sinh-2025.png/);
 assert.match(questionHelp(death,death.questions[0],true),/details class="question-help" open/);
 const q={help:{title:'<script>alert(1)</script>',text:'Nội dung'}};
 assert.doesNotMatch(questionHelp(birth,q),/<script>/);assert.match(tabHelp(),/không phải ảnh giao diện/);
});
test('Kết quả theo lựa chọn, không đưa căn cước/trợ cấp vào nhánh không yêu cầu',()=>{
 const list=(p,a)=>p.resultItems.filter(i=>matches(i.when,a)).map(i=>i.text).join(' ');
 assert.doesNotMatch(list(birth,birthAnswers),/căn cước/i);
 assert.match(list(birth,{...birthAnswers,identity:'yes'}),/căn cước/i);
 assert.doesNotMatch(list(death,{need:'basic'}),/chế độ/i);
 assert.match(list(death,{need:'survivor'}),/chế độ/i);
});
