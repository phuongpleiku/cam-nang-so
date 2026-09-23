import {readFile,writeFile,rename,access} from 'node:fs/promises';
import readline from 'node:readline/promises';
const args=process.argv.slice(2),rl=readline.createInterface({input:process.stdin,output:process.stdout});
try{
 const id=args[0]||await rl.question('Mã thủ tục (không dấu, ví dụ dang-ky-ket-hon): ');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw Error('Mã chỉ gồm chữ thường không dấu, số và dấu gạch nối.');
 const title=args.slice(1).join(' ')||await rl.question('Tên hướng dẫn dễ hiểu: ');
 if(!title.trim())throw Error('Tên hướng dẫn không được để trống.');
 const base=new URL('../dist/data/',import.meta.url),registryUrl=new URL('index.json',base),entries=JSON.parse(await readFile(registryUrl,'utf8'));
 const target=new URL(`${id}.json`,base);
 if(entries.some(e=>e.id===id))throw Error('Mã thủ tục đã có trong danh mục.');
 try{await access(target);throw Error('Tệp đã tồn tại; không ghi đè.');}catch(e){if(e.code!=='ENOENT')throw e;}
 const draft={id,version:1,title,shortTitle:title,description:'CẦN BIÊN SOẠN: mô tả ngắn việc người dân cần làm.',category:'Thủ tục khác',icon:'document',keywords:[title],officialName:'CẦN BIÊN SOẠN: tên thủ tục chính thức.',intro:'Trả lời câu hỏi để xem hướng dẫn phù hợp.',reviewedAt:new Date().toISOString().slice(0,10),portalUrl:'https://dichvucong.gov.vn/',sources:[{label:'CẦN BIÊN SOẠN: nguồn chính thức cho thủ tục này',url:'https://dichvucong.gov.vn/'}],questions:[{id:'case',title:'CẦN BIÊN SOẠN: câu hỏi xác định trường hợp',hint:'Chọn trường hợp phù hợp.',options:[{value:'standard',label:'Trường hợp thông thường'},{value:'other',label:'Trường hợp khác / chưa rõ'}]}],notices:[{when:{question:'case',values:['other']},blocking:true,title:'Bạn cần được hướng dẫn thêm',text:'Liên hệ đầu mối phường để xác định thủ tục phù hợp trước khi nộp.'}],checklist:[{id:'document-1',kind:'Giấy tờ',title:'CẦN BIÊN SOẠN: tên giấy tờ',help:'CẦN BIÊN SOẠN: nơi lấy và cách chuẩn bị.',missing:'CẦN BIÊN SOẠN: cách xử lý khi chưa có.'}],fields:[{title:'CẦN BIÊN SOẠN: tên mục trên tờ khai',body:'CẦN BIÊN SOẠN: hướng dẫn điền và ví dụ.'}],submission:['CẦN BIÊN SOẠN: từng bước trên cổng chính thức.'],duration:'CẦN BIÊN SOẠN: thời hạn theo nguồn đã kiểm tra.',fees:'CẦN BIÊN SOẠN: phí, lệ phí theo địa phương và nguồn đã kiểm tra.',results:['CẦN BIÊN SOẠN: kết quả người dân nhận.'],followUp:'Theo dõi thông báo tiếp nhận, yêu cầu bổ sung và ngày hẹn trên cổng chính thức.'};
 delete draft.portalUrl;
 draft.connectionRef='';
 draft.checklist[0].guide={steps:[{title:'CẦN BIÊN SOẠN: bắt đầu ở đâu',action:'CẦN BIÊN SOẠN: thao tác cụ thể và thông tin cần đối chiếu.',expected:'CẦN BIÊN SOẠN: dấu hiệu đã làm đúng.'}],ready:'CẦN BIÊN SOẠN: khi nào đã chuẩn bị xong.',troubleshooting:[{problem:'CẦN BIÊN SOẠN: khó khăn thường gặp',solution:'CẦN BIÊN SOẠN: cách xử lý hoặc liên hệ ai, nói gì.'}]};
 await writeFile(target,JSON.stringify(draft,null,2)+'\n',{encoding:'utf8',flag:'wx'});
 entries.push({id,file:`${id}.json`,published:false});
 const temp=new URL('index.json.tmp',base);await writeFile(temp,JSON.stringify(entries,null,2)+'\n','utf8');await rename(temp,registryUrl);
 console.log(`Đã tạo bản nháp dist/data/${id}.json. Điền nội dung, chạy npm run check, sau đó đổi published thành true trong dist/data/index.json. Bản nháp chưa hiện trên trang.`);
}catch(e){console.error(e.message);process.exitCode=1;}finally{rl.close();}
