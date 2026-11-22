import {renderVisuals} from './visuals.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function questionHelp(p,q,open=false){
 if(!q?.help)return '';
 const visual=(p.visuals||[]).find(v=>v.id===q.help.visualId);
 return `<details class="question-help" ${open?'open':''}><summary>${esc(q.help.title||'Tôi chưa hiểu câu hỏi này')}</summary><p>${esc(q.help.text)}</p>${visual?renderVisuals({visuals:[visual]},visual.stage):''}</details>`;
}

export function tabHelp(){
 return `<section class="return-guide" aria-label="Quay lại hướng dẫn"><h3>Giữ trang này để quay lại đọc bước tiếp</h3><p>Cẩm Nang Số là nơi đọc hướng dẫn. Bạn nhập hồ sơ ở trang dịch vụ công mở bên cạnh.</p><details><summary>Tôi dùng một điện thoại</summary><ol><li>Sau khi bấm mở cổng, giữ nguyên Cẩm Nang Số; đừng đóng trang.</li><li>Muốn quay lại: tìm nút danh sách trang của trình duyệt, thường là ô có số hoặc hai ô chồng nhau.</li><li>Chạm nút đó và chọn trang có tên Cẩm Nang Số.</li><li>Nếu vừa mở Tin nhắn hoặc VNeID, mở lại trình duyệt vừa dùng trước, rồi chọn Cẩm Nang Số.</li></ol><p>Nút có thể nằm phía trên hoặc dưới màn hình tùy Chrome/Safari. Không tìm được thì chọn Nhờ người hướng dẫn.</p></details><details><summary>Tôi dùng máy tính và điện thoại</summary><ol><li>Giữ Cẩm Nang Số trên máy tính.</li><li>Mở cổng trong trang mới trên máy tính; dùng điện thoại để nhận mã hoặc xác nhận khi cần.</li><li>Muốn đọc bước tiếp, bấm tên Cẩm Nang Số ở hàng trang phía trên cửa sổ máy tính.</li></ol></details><a class="text-link" href="#ho-tro">Tôi chưa biết chuyển trang — nhờ người hướng dẫn</a><small>Đây là hướng dẫn bằng chữ, không phải ảnh giao diện điện thoại.</small></section>`;
}
