import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,basename} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {localPdfPath,officialSourceUrl,visualPages,renderVisuals} from '../dist/visuals.js';

test('Ảnh chứng thực chỉ dùng danh sách đã rà soát và giữ nguyên tệp gốc',async()=>{
 const p=JSON.parse(await readFile(new URL('../dist/data/chung-thuc-ban-sao.json',import.meta.url),'utf8'));
 const manifest=JSON.parse(await readFile(new URL('../docs/certification-image-sources.json',import.meta.url),'utf8'));
 assert.equal(manifest.length,7);assert.deepEqual(p.visuals.map(v=>v.src),manifest.map(m=>m.asset));
 for(const m of manifest){const bytes=await readFile(new URL('../dist/'+m.asset,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),m.sha256);assert.equal(bytes.readUInt16BE(0),0xffd8);}
 const registry=JSON.parse(await readFile(new URL('../dist/data/connections.json',import.meta.url),'utf8'));
 const c=registry.connections[p.connectionRef];assert.equal(c.mode,'portal-link');assert.equal(c.selectedLocality,undefined);
 assert.equal(new URL(c.tracking.url).hostname,'dichvucongnganhtuphap.moj.gov.vn');
 assert.doesNotMatch(c.entryUrl,/\/nop-ho-so\/|MaCoQuanThucHien|token|state=/);
});

test('Mẫu chính thức giữ nguyên PDF, đủ trang và đúng kích thước ảnh',async()=>{
 const sources=JSON.parse(await readFile(new URL('../docs/form-sources.json',import.meta.url),'utf8'));
 for(const source of sources){
  const bytes=await readFile(new URL('../dist/'+source.pdf,import.meta.url));
  assert.equal(bytes.subarray(0,4).toString(),'%PDF');
  assert.equal(createHash('sha256').update(bytes).digest('hex'),source.sha256);
 }
 for(const name of ['khai-sinh','khai-tu']){
  const p=JSON.parse(await readFile(new URL(`../dist/data/${name}.json`,import.meta.url),'utf8'));
  for(const v of p.visuals){
   assert.equal(v.kind,'official-template');assert.ok(officialSourceUrl(v.source.url));
   const source=sources.find(s=>s.pdf===v.originalPdf);assert.ok(source);assert.equal(v.source.url,source.url);
   const expected=Object.values(source.groups).find(pages=>pages[0].src===v.src);assert.ok(expected);
   assert.deepEqual(v.pages.map(p=>({src:p.src,sourcePage:p.sourcePage,width:p.width,height:p.height})),expected);
   for(const page of visualPages(v)){
    assert.ok(page.sourcePage<=source.pageCount);
    const img=await readFile(new URL('../dist/'+page.src,import.meta.url));
    assert.equal(img.subarray(1,4).toString(),'PNG');
    assert.equal(img.readUInt32BE(16),page.width);assert.equal(img.readUInt32BE(20),page.height);
   }
   const html=renderVisuals({visuals:[v]},v.stage);
   assert.match(html,/Mẫu trống từ văn bản chính thức/);assert.doesNotMatch(html,/Sơ đồ minh họa/);
   assert.ok(html.includes(`#page=${v.pages[0].sourcePage}`));assert.match(html,/download/);
  }
 }
});
test('Liên kết mẫu chặn đường dẫn ra ngoài và nguồn giả mạo',()=>{
 for(const path of ['../secret.pdf','assets/forms/../secret.pdf','https://example.com/x.pdf','assets/forms/x.pdf#page=1'])assert.equal(localPdfPath(path),null);
 for(const url of ['javascript:alert(1)','http://syt.gialai.gov.vn/x.pdf','https://gialai.gov.vn.evil.test/x','https://evilgov.vn/x','https://datafiles.chinhphu.vn.evil.test/x','https://user:pass@syt.gialai.gov.vn/x'])assert.equal(officialSourceUrl(url),null);
 assert.equal(localPdfPath('assets/forms/mau-01.pdf'),'assets/forms/mau-01.pdf');
 const v={stage:'chuan-bi',src:'assets/guides/test.png',title:'<script>x</script>',alt:'" onerror="x',caption:'Ví dụ'};
 const html=renderVisuals({visuals:[v]},'chuan-bi');assert.doesNotMatch(html,/<script>|alt="" onerror=/);
 assert.match(html,/Sơ đồ minh họa/);
});
test('Tạo thủ tục mới giữ UTF-8, mặc định bản nháp và không ghi đè mã cũ',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'cns-content-test-'));
 try{
  await mkdir(join(dir,'scripts'));await mkdir(join(dir,'dist','data'),{recursive:true});
  await copyFile(new URL('../scripts/add-procedure.mjs',import.meta.url),join(dir,'scripts','add-procedure.mjs'));
  await writeFile(join(dir,'dist','data','index.json'),'[]\n','utf8');
  const run=()=>spawnSync(process.execPath,[join(dir,'scripts','add-procedure.mjs'),'ket-hon','Đăng ký kết hôn'],{encoding:'utf8'});
  const first=run();assert.equal(first.status,0,first.stderr);
  const file=join(dir,'dist','data','ket-hon.json'),original=await readFile(file,'utf8');
  assert.equal(JSON.parse(original).title,'Đăng ký kết hôn');
  assert.equal(JSON.parse(original).connectionRef,'');
  assert.equal(Object.hasOwn(JSON.parse(original),'portalUrl'),false);
  assert.deepEqual(JSON.parse(await readFile(join(dir,'dist','data','index.json'),'utf8')),[{id:'ket-hon',file:'ket-hon.json',published:false}]);
  const second=run();assert.equal(second.status,1);assert.equal(await readFile(file,'utf8'),original);
 }finally{const target=resolve(dir);if(dirname(target)!==resolve(tmpdir())||!basename(target).startsWith('cns-content-test-'))throw new Error('Unsafe temporary cleanup path');await rm(target,{recursive:true,force:true});}
});
