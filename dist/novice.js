import {renderVisuals} from './visuals.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function questionHelp(p,q,open=false){
 if(!q?.help)return '';
 const visual=(p.visuals||[]).find(v=>v.id===q.help.visualId);
 return `<details class="question-help" ${open?'open':''}><summary>${esc(q.help.title||'Tôi chưa hiểu câu hỏi này')}</summary><p>${esc(q.help.text)}</p>${visual?renderVisuals({visuals:[visual]},visual.stage):''}</details>`;
}

export function tabHelp(){
 return `<details class="tab-help"><summary>Cách quay lại hướng dẫn khi mở cổng</summary><div class="tab-sketch" role="img" aria-label="Sơ đồ hai trang: Cẩm Nang Số để đọc hướng dẫn, Cổng dịch vụ công để làm hồ sơ"><span>Cẩm Nang Số<br><small>Đọc hướng dẫn</small></span><b aria-hidden="true">⇄</b><span>Cổng dịch vụ công<br><small>Làm hồ sơ</small></span></div><p><strong>“Tab” là một trang đang mở trong trình duyệt.</strong> Khi bấm mở cổng, hãy giữ trang Cẩm Nang Số này.</p><ol><li>Trên điện thoại: tìm nút danh sách trang (thường là hình ô vuông có số hoặc hai ô chồng nhau). Nếu không thấy, chạm màn hình hoặc cuộn nhẹ để hiện thanh công cụ.</li><li>Chạm nút đó, tìm trang có tên “Cẩm Nang Số”, rồi chạm vào để trở lại. Vị trí nút khác nhau giữa Chrome và Safari.</li><li>Trên máy tính: bấm tên “Cẩm Nang Số” trên hàng trang ở phía trên cửa sổ.</li></ol><p>Nếu đang ở VNeID hoặc Tin nhắn, mở lại ứng dụng trình duyệt bạn vừa dùng, rồi chọn trang Cẩm Nang Số. Nếu chưa mở được trang mới, hãy giữ hướng dẫn và dùng phần trợ giúp bên dưới.</p><small>Sơ đồ minh họa, không phải ảnh giao diện điện thoại.</small></details>`;
}
