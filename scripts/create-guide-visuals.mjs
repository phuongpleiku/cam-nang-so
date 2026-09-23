// Sơ đồ thông tin do Cẩm Nang Số biên soạn, không mô phỏng biểu mẫu chính thức.
import {mkdir,writeFile} from 'node:fs/promises';
const out=new URL('../dist/assets/guides/',import.meta.url);
await mkdir(out,{recursive:true});
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const text=(x,y,content,size=20,color='#28483b',weight=400)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${esc(content)}</text>`;
const lines=(x,y,items,size=20,color='#52665d',weight=400)=>items.map((s,i)=>text(x,y+i*30,s,size,color,weight)).join('');
function frame(title,body){return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="660" viewBox="0 0 1000 660" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">Sơ đồ minh họa để nhận biết thông tin. Không phải giấy tờ thật, biểu mẫu nộp hồ sơ hoặc ảnh giao diện cổng nhà nước.</desc><rect width="1000" height="660" rx="24" fill="#edf4ef"/><g font-family="Arial, sans-serif">${text(40,43,'CẨM NANG SỐ  /  NHÌN MẪU ĐỂ DỄ HIỂU',15,'#126449',700)}${text(40,86,title,29,'#153f31',700)}${body}<line x1="40" y1="608" x2="960" y2="608" stroke="#ccddd2"/>${text(40,638,'SƠ ĐỒ MINH HỌA · Vị trí trên giấy thực tế có thể khác. Không dùng để nộp hồ sơ.',17,'#52665d')}</g></svg>\n`;}
function paper(title,heading,rows,notes){
 let body=`<rect x="40" y="118" width="475" height="466" rx="14" fill="white" stroke="#cdded2"/><rect x="60" y="140" width="130" height="28" rx="6" fill="#e9f3ed"/>${text(74,160,'MẪU MINH HỌA',13,'#126449',700)}${text(76,206,heading,26,'#153f31',700)}${text(76,235,'Đối chiếu trên giấy tờ của gia đình',17,'#66796f')}`;
 rows.forEach((r,i)=>{const y=263+i*94;body+=`<rect x="66" y="${y}" width="423" height="77" rx="9" fill="#f3f8f4" stroke="#7fae92"/>${text(84,y+28,r[0],19,'#28483b',700)}${text(84,y+56,r[1],17,'#66796f')}<circle cx="493" cy="${y+38}" r="17" fill="#126449"/>${text(487,y+45,String(i+1),18,'white',700)}<path d="M512 ${y+38}H545" stroke="#8bae99" stroke-width="2" stroke-dasharray="5 5"/>${text(565,y+25,notes[i][0],21,'#153f31',700)}${lines(565,y+55,notes[i].slice(1),18)}`;});
 return frame(title,body);
}
await writeFile(new URL('giay-chung-sinh.svg',out),paper('Giấy chứng sinh: xem những thông tin nào?','GIẤY CHỨNG SINH',[
 ['Họ và tên mẹ','Thông tin người mẹ trên giấy'],['Thông tin sinh của bé','Ngày sinh · nơi sinh · giới tính'],['Thông tin cấp giấy','Số giấy · ngày cấp · cơ sở cấp']
],[['1. Kiểm tra thông tin mẹ','Đối chiếu họ tên, dấu tiếng Việt.'],['2. Đối chiếu thông tin sinh','Dùng khi kê khai thông tin của bé.'],['3. Tìm thông tin giấy chứng sinh','Chuẩn bị để tra cứu hoặc kê khai.']]),'utf8');
await writeFile(new URL('giay-bao-tu.svg',out),paper('Giấy báo tử: kiểm tra trước khi kê khai','GIẤY BÁO TỬ',[
 ['Thông tin người đã mất','Họ tên và thông tin định danh'],['Thông tin qua đời','Thời điểm · nơi qua đời'],['Thông tin cấp giấy','Đơn vị cấp và thông tin trên giấy']
],[['1. Đúng người được khai tử','Không điền thông tin người làm thay.'],['2. Đối chiếu thời điểm, địa điểm','Chưa rõ thì hỏi lại cơ quan tiếp nhận.'],['3. Kiểm tra giấy tờ đang có','Giấy thay thế cần được xác định','theo trường hợp của gia đình.']]),'utf8');
function roles(title,subtitle,roles){
 let body=lines(40,125,[subtitle],19);
 const width=roles.length===2?438:286,gap=22,start=40;
 roles.forEach((r,i)=>{const x=start+i*(width+gap);body+=`<rect x="${x}" y="165" width="${width}" height="335" rx="16" fill="white" stroke="#ccddd2"/><rect x="${x}" y="165" width="${width}" height="9" rx="4" fill="${i===0?'#126449':'#496b80'}"/><circle cx="${x+37}" cy="213" r="18" fill="#e6f1e9"/>${text(x+31,220,String(i+1),20,'#126449',700)}${lines(x+24,270,r.heading,24,'#153f31',700)}<line x1="${x+24}" y1="325" x2="${x+width-24}" y2="325" stroke="#dce7df"/>${lines(x+24,363,r.description,19)}<rect x="${x+24}" y="440" width="${width-48}" height="36" rx="7" fill="#f0f5f2"/>${text(x+36,464,r.tag,16,'#126449',700)}`;});
 body+=text(40,551,'Mỗi phần lấy thông tin của đúng người được nhắc đến.',23,'#153f31',700);
 body+=text(40,583,'Đây là sơ đồ giải thích vai trò, không phải ảnh chụp tờ khai trên cổng.',18,'#52665d');
 return frame(title,body);
}
await writeFile(new URL('dien-khai-sinh.svg',out),roles('Khai sinh: phân biệt người làm và người được khai sinh','Ví dụ: mẹ đứng tên làm thủ tục cho con.',[
 {heading:['NGƯỜI YÊU CẦU'],description:['Điền thông tin của mẹ','khi mẹ đứng tên yêu cầu.'],tag:'Người đi làm thủ tục'},
 {heading:['NGƯỜI ĐƯỢC KHAI SINH'],description:['Điền thông tin của bé,','đối chiếu giấy chứng sinh.'],tag:'Bé được đăng ký khai sinh'}
]),'utf8');
await writeFile(new URL('dien-khai-tu.svg',out),roles('Khai tử: phân biệt ba vai trò trong hồ sơ','Đọc tên từng phần trước khi nhập thông tin.',[
 {heading:['NGƯỜI ĐÃ MẤT'],description:['Thông tin của người','được đăng ký khai tử.'],tag:'Phần khai tử'},
 {heading:['NGƯỜI YÊU CẦU'],description:['Thông tin của người','đứng tên làm thủ tục.'],tag:'Phần người yêu cầu'},
 {heading:['NGƯỜI NHẬN','TRỢ CẤP'],description:['Điền khi thủ tục yêu cầu;','có thể là người khác.'],tag:'Nếu có đề nghị chế độ'}
]),'utf8');
console.log('Đã tạo 4 sơ đồ SVG UTF-8, không dùng thông tin cá nhân.');
