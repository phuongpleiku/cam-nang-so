import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {freshRecord,restoreRecord,resumePoint,pruneProgress,setPreparationStatus} from '../dist/progress.js';
import {setAnswer,matches} from '../dist/rules.js';
import {tutorialPosition,renderTutorial} from '../dist/tutorials.js';
import {questionHelp,tabHelp} from '../dist/novice.js';
const read=async name=>JSON.parse(await readFile(new URL(`../dist/data/${name}.json`,import.meta.url),'utf8'));
const birth=await read('khai-sinh'),death=await read('khai-tu'),common=await read('huong-dan-chung');
const birthAnswers={registered:'no',role:'parent',birthPaper:'yes',residence:'mother',nationality:'no',identity:'no'};

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
