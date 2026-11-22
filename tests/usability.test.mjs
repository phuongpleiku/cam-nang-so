import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {freshRecord,restoreRecord,resumePoint,pruneProgress,setPreparationStatus} from '../dist/progress.js';
import {setAnswer,matches} from '../dist/rules.js';
import {tutorialPosition,renderTutorial} from '../dist/tutorials.js';
import {questionHelp,tabHelp} from '../dist/novice.js';
import {isComplete,checklistFor,searchProcedures} from '../dist/rules.js';
import {renderVisuals} from '../dist/visuals.js';
const read=async name=>JSON.parse(await readFile(new URL(`../dist/data/${name}.json`,import.meta.url),'utf8'));
const birth=await read('khai-sinh'),death=await read('khai-tu'),common=await read('huong-dan-chung');
const certification=await read('chung-thuc-ban-sao');
const marital=await read('tinh-trang-hon-nhan');
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
 const html=renderTutorial(marital.submissionGuide,'submission',common,{submission:{path:0,steps:{0:11}}},marital.visuals);
 assert.match(html,/data-step="11" >/);assert.match(html,/Lưu hồ sơ giữ bản nháp/);
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
 const saved={...freshRecord(certification),answers:{purpose:'copy',original:'yes',issuer:'foreign',format:'both'},lastStep:3,tutorials:{submission:{path:0,steps:{0:8}}}};
 const r=restoreRecord(certification,saved);
 assert.deepEqual(resumePoint(certification,r),{step:3,item:'',question:0});
 r.answers=setAnswer(certification,r.answers,'issuer','domestic');pruneProgress(certification,r);
 assert.equal(r.tutorials.submission.steps[0],8);assert.deepEqual(r.checked,[]);assert.equal(Object.hasOwn(r,'submitted'),false);
 assert.equal(restoreRecord(birth,{...freshRecord(birth),tutorials:saved.tutorials}).tutorials.submission,undefined);
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
 const saved={...freshRecord(birth),answers:birthAnswers,lastStep:1,item:'login',tutorials:{'prep-login':{path:1,steps:{0:2,1:3}}}};
 const r=restoreRecord(birth,JSON.parse(JSON.stringify(saved)));
 assert.deepEqual(resumePoint(birth,r),{step:1,item:'login',question:0});
 assert.deepEqual(tutorialPosition(common['dang-nhap'],r.tutorials['prep-login']),{path:1,steps:{0:2,1:3,2:0}});
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
 assert.deepEqual(tutorialPosition(common['dang-nhap'],r.tutorials['prep-login']),{path:0,steps:{0:0,1:0,2:0}});
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
