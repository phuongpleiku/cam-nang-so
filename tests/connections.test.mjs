import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {destinationUrl,connectionErrors,getConnection,renderConnection,renderTracking,shortcutEntries} from '../dist/connections.js';
const registry=JSON.parse(await readFile(new URL('../dist/data/connections.json',import.meta.url),'utf8'));

test('Các nơi nộp hợp lệ; hai thủ tục liên thông vẫn dẫn đúng nhóm',async()=>{
 for(const id of Object.keys(registry.connections))assert.deepEqual(connectionErrors(registry,id),[],id);
 for(const id of ['khai-sinh','khai-tu']){
  const p=JSON.parse(await readFile(new URL(`../dist/data/${id}.json`,import.meta.url),'utf8'));
  assert.equal(p.connectionRef,`lien-thong-${id}`);
  const c=getConnection(registry,p.connectionRef);
  assert.equal(c.systemId,'lien-thong');assert.equal(c.mode,'portal-link');assert.equal(c.selectedLocality,undefined);
  assert.match(renderTracking(registry,p.connectionRef),/https:\/\/lienthong.dichvucong.gov.vn/);
 }
});

test('Chỉ mở HTTPS trên hệ thống khai báo, không lưu URL phiên đăng nhập',()=>{
 const system=registry.systems['quoc-gia'];
 for(const url of ['http://dichvucong.gov.vn/','javascript:alert(1)','https://dichvucong.gov.vn.evil.test/','https://user:secret@dichvucong.gov.vn/','https://other.gov.vn/','https://dichvucong.gov.vn/?code=private','https://dichvucong.gov.vn/#/?access_token=private'])assert.equal(destinationUrl(url,system),null,url);
 assert.ok(destinationUrl('https://dichvucong.gov.vn/?provinceCode=52&wardCode=23575',system));
});

test('Đường dẫn kết hôn có đúng địa bàn đã kiểm chứng và tìm được không dấu',()=>{
 const c=getConnection(registry,'ket-hon-pleiku'),u=new URL(c.entryUrl);
 assert.equal(c.mode,'locality-link');assert.equal(c.selectedLocality.ward,'Phường Pleiku');
 assert.equal(u.searchParams.get('provinceCode'),'52');assert.equal(u.searchParams.get('wardCode'),'23575');
 assert.deepEqual(shortcutEntries(registry,'ket hon').map(([id])=>id),['ket-hon-pleiku']);
 assert.equal(shortcutEntries(registry,'khai sinh').length,0);
});

test('Thiếu cấu hình hoặc cấu hình sai không tạo liên kết nộp giả',()=>{
 assert.equal(getConnection(null,'missing'),null);
 assert.match(renderConnection(null,'missing'),/Chưa tải được nơi nộp/);
 const broken=structuredClone(registry);
 broken.connections['ket-hon-pleiku'].entryUrl='https://example.com/';
 assert.equal(getConnection(broken,'ket-hon-pleiku'),null);
 assert.doesNotMatch(renderConnection(broken,'ket-hon-pleiku'),/example.com/);
 broken.connections['lien-thong-khai-sinh'].selectedLocality={province:'Gia Lai',ward:'Phường Pleiku'};
 assert.ok(connectionErrors(broken,'lien-thong-khai-sinh').length);
 broken.connections['lien-thong-khai-tu'].mode='api';
 assert.equal(getConnection(broken,'lien-thong-khai-tu'),null);
 broken.connections['ket-hon-pleiku'].nextSteps=[null];
 assert.doesNotThrow(()=>renderConnection(broken,'ket-hon-pleiku'));
});

test('Nội dung cấu hình chỉ hiển thị dạng chữ, liên kết mở tab mới an toàn',()=>{
 const copy=structuredClone(registry);
 copy.connections['ket-hon-pleiku'].destinationLabel='<img src=x onerror=alert(1)>';
 const markup=renderConnection(copy,'ket-hon-pleiku');
 assert.doesNotMatch(markup,/<img/);assert.match(markup,/&lt;img/);
 assert.match(markup,/target="_blank" rel="noopener noreferrer"/);
 assert.match(markup,/data-destination-status><\/p>/);
});
