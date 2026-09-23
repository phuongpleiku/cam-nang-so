# Kiểm tra bản đầu — 23/09/2026

## Đã đạt

- `npm run check`: 9 kiểm thử đạt; kiểm tra cú pháp, dữ liệu, tham chiếu điều kiện, tài nguyên và UTF-8 đạt.
- Công cụ tạo thủ tục: tạo bản nháp có tiếng Việt nguyên vẹn, tự thêm vào danh mục, không ghi đè mã hoặc tệp đã tồn tại.
- Trình duyệt: luồng khai sinh thông thường đi tới danh sách, hướng dẫn điền và bước nộp; liên kết nộp trỏ đúng `https://lienthong.dichvucong.gov.vn/`.
- Trình duyệt: trường hợp đã có khai sinh được chuyển sang hướng dẫn liên hệ, không tiếp tục nộp khai sinh mới.
- Trình duyệt: nhánh khai tử phát sinh câu hỏi về chế độ, cho chọn nhiều chế độ và tạo danh sách phù hợp; thiếu giấy báo tử có hướng dẫn liên hệ.
- Trình duyệt: tìm kiếm `mai tang` không dấu trả đúng hướng dẫn khai tử.
- Trình duyệt: đánh dấu danh sách và tải lại trang vẫn giữ tiến độ (đã xác nhận 2/5 mục).
- Bố cục: đã xem giao diện desktop; ở chiều rộng nội dung 400 CSS pixel, kiểm tra kích thước tài liệu không phát sinh cuộn ngang toàn trang ở danh sách, hướng dẫn và bước nộp. Thanh các bước được phép cuộn ngang trong vùng riêng.
- Không ghi nhận lỗi JavaScript trong lượt kiểm tra trình duyệt cuối.
- WebMCP: liệt kê và mở đúng bộ hướng dẫn; mã thủ tục không tồn tại bị từ chối có chủ đích. Các công cụ này không nộp hồ sơ hành chính.

## Giới hạn cần biết

Cập nhật hình minh họa: 4 tệp SVG được kiểm tra cú pháp XML và UTF-8; bộ kiểm tra dữ liệu xác nhận đường dẫn và mô tả hình. Đã kiểm tra mở hình, phóng to, thu về vừa màn hình và đóng bằng Escape. Ở chiều rộng 400 CSS pixel, hộp hình nằm trong khung nhìn; ảnh 1000 pixel cuộn trong vùng riêng, không làm trang tràn ngang. Các sơ đồ tự biên soạn đều ghi rõ minh họa, không phải ảnh giao diện hay mẫu hồ sơ chính thức.

- Ảnh chụp tự động ở viewport hẹp không thực hiện được do công cụ trình duyệt; kiểm tra mobile sử dụng DOM, kích thước bố cục và thao tác thực tế. Chưa thử trên thiết bị iPhone/Android vật lý.
- Không đăng nhập hoặc nộp hồ sơ thật trên cổng nhà nước trong quá trình kiểm tra. Hướng dẫn điền dựa trên mẫu và nguồn chính thức, không cam kết vị trí nút của giao diện sau đăng nhập.
- Chưa xác minh đầy đủ biểu phí Gia Lai, giờ làm việc và địa điểm quầy tiếp nhận. Trang dùng thông báo phù hợp, không công bố một mức phí hoặc địa điểm quầy chưa xác minh.
- Chức năng in/lưu PDF sử dụng hộp thoại in của trình duyệt, tự mở nội dung danh sách để in và khôi phục sau in. Chưa kiểm tra bản in trên máy in vật lý.

## Cập nhật hướng dẫn chuẩn bị từng bước — 23/09/2026

- Toàn bộ 13 mục chuẩn bị của hai bộ thủ tục có hướng dẫn chi tiết hoặc tham chiếu hướng dẫn đăng nhập chung; các mục có điều kiện vẫn chỉ hiện đúng nhánh.
- Đã đối chiếu trực tiếp phần công khai của cổng liên thông: chọn khai sinh chuyển đến màn hình VNeID, có số định danh, mật khẩu, QR và mục hỗ trợ. Không đăng nhập hay gửi dữ liệu thật.
- Kiểm tra UI: chuyển giữa điện thoại/máy tính/chưa kích hoạt; mở trợ giúp quên mật khẩu; mở hình giấy chứng sinh và hướng dẫn chụp/đính kèm. Chỉ một nhánh đăng nhập được hiển thị tại một thời điểm.
- Kiểm tra UI khai tử: chưa có giấy báo tử + mai táng/tử tuất + chưa rõ chế độ hiển thị đúng năm mục; mở được hướng dẫn giấy thay thế và thân nhân.
- Sau khi sửa cách ngắt dòng tên miền, tài liệu và khung nhìn cùng rộng 305 CSS pixel, không tràn ngang toàn trang ở danh sách khai tử. Đã xem bố cục desktop và bản hẹp; chưa kiểm tra thiết bị vật lý. Đã khôi phục kích thước trình duyệt mặc định.
- Liên kết về hướng dẫn đăng nhập xuất hiện tại bước Nộp hồ sơ. Tab người dùng được tải lại đúng trang đang xem.
- `npm run check` đạt 9/9 sau thay đổi cuối: có kiểm tra hướng dẫn chi tiết, tham chiếu dùng chung/vòng lặp, hình theo mục, UTF-8 và cú pháp. Không có lỗi JavaScript trong lượt kiểm tra khai tử.
- Chưa xác minh giao diện sau đăng nhập; các bước xác thực diễn đạt theo thông báo thực tế trên cổng, các hướng dẫn đính kèm chỉ áp dụng khi cổng yêu cầu. Bản in chỉ in nhánh đăng nhập đang chọn.

## Cập nhật cấu hình nơi nộp — 23/09/2026

- Ba cấu hình: liên thông khai sinh, liên thông khai tử và lối vào đăng ký kết hôn tại Pleiku. Hai bộ hướng dẫn dùng `connectionRef`; đường liên thông lấy từ mục công khai của Cổng Dịch vụ công Quốc gia, có `#/?vneid=1`.
- `npm run check`: 14/14 kiểm thử đạt, gồm trường hợp thiếu/sai nơi nộp, kiểm tra URL, tách hướng dẫn đầy đủ với lối mở dịch vụ, tìm kiếm không dấu và tạo bản nháp.
- UI đã kiểm tra: tìm `ket hon` hiển thị lối mở nhanh và thông báo chưa có hướng dẫn chi tiết; mở đúng trang chỉ dẫn Pleiku; mở đường dẫn dự phòng bằng phím Enter; hiển thị đúng URL và hướng dẫn tra cứu.
- UI khai tử: bước Nộp hồ sơ hiển thị đúng nhóm, tài khoản người làm thủ tục, cơ quan cần kiểm tra, liên kết đăng nhập và số mục chuẩn bị còn thiếu. Bấm mở cổng chỉ hiển thị nhắc chuyển tab; trở lại danh sách vẫn 0/5, không đánh dấu đã chuẩn bị/đã nộp. Tab liên thông xuất hiện trong trạng thái trình duyệt sau thao tác.
- Đã xem bố cục desktop và kiểm tra trang nơi nộp kết hôn/khai tử ở kích thước tài liệu 360 CSS pixel: chiều rộng tài liệu bằng khung nhìn, không tràn ngang toàn trang. Đã khôi phục kích thước trình duyệt mặc định.
- Lần mở tiếp trang khai sinh tại `127.0.0.1:4173` bị xét duyệt tự động chặn do workspace hết lượt xét duyệt. Vì vậy chưa hoàn tất kiểm tra UI khai sinh với phần nơi nộp mới; tham chiếu dữ liệu và kết xuất được kiểm tra tự động. Không lách hạn chế để tiếp tục thao tác đó.
- Chưa đăng nhập, gửi hồ sơ thật hoặc xác minh giữ địa bàn sau đăng nhập. Kết nối hiện tại là liên kết có hướng dẫn, chưa có API nộp hay đồng bộ trạng thái.

## Cải tiến cho người ít kinh nghiệm — 23/09/2026

- Tách trang tóm tắt checklist và hướng dẫn từng mục; mặc định một thao tác, có cách xem toàn bộ. Chưa đăng nhập vẫn xem được giấy tờ cần chuẩn bị.
- Bổ sung trạng thái tự ghi nhớ Cần hỏi thêm; các trạng thái loại trừ nhau, không tự đánh dấu chuẩn bị/nộp khi đọc hướng dẫn.
- Khôi phục bước, mục, nhánh và thao tác đang xem; dữ liệu cũ giữ câu trả lời và checklist. Câu hỏi còn thiếu mở ở vị trí phù hợp; nhánh bị chặn không tiếp tục tới nộp.
- Thay dấu tích suy ra từ vị trí bước bằng số bước và Đang xem. Kết quả căn cước/chế độ chỉ hiện theo lựa chọn. Lối mở kết hôn ghi rõ chưa có hướng dẫn từng bước.
- Có hình phân biệt giấy ngay tại câu hỏi, giải thích chế độ, sơ đồ hai trang và cách quay lại; trợ giúp giữ ngữ cảnh và gợi ý cách hỏi. Sơ đồ chuyển trang không phải ảnh giao diện thật.
- Thêm chỉ dẫn nguồn thông tin/cách kiểm tra ở các mục kê khai quan trọng; giải thích lỗi ảnh/tệp. Chưa xác minh thao tác nén/chuyển định dạng cho từng thiết bị, nên những trường hợp đó vẫn hướng tới hỗ trợ, không đưa nút hay giới hạn dung lượng suy đoán.
- `npm run check` đạt 23/23 sau thay đổi chính, gồm kiểm thử di chuyển dữ liệu cũ, tiếp tục đúng điểm dừng, câu hỏi còn thiếu, thay nhánh, trạng thái chuẩn bị, vị trí hướng dẫn, nội dung HTML và kết quả theo lựa chọn. Bộ kiểm tra bao gồm cú pháp, tham chiếu hình/cấu hình và UTF-8.
- Đợt này chưa kiểm tra tương tác/bố cục trực tiếp trong trình duyệt hoặc bản in thực tế. Lượt trình duyệt trước bị xét duyệt tự động chặn vì workspace hết lượt xét duyệt; không dùng công cụ khác để lách bước mở trang bị chặn. Không coi kiểm thử kết xuất và logic là kiểm thử người dùng.
- Cần kiểm tra tiếp trên điện thoại thật: nút trước/tiếp theo, giữ vị trí khi chuyển ứng dụng, trợ giúp và bản in; sau đó thử với người ít kinh nghiệm theo USABILITY-REVIEW.md. Chưa có người dân tham gia thử, chưa đăng nhập hoặc gửi hồ sơ thật, chưa xác minh đầu mối vận hành tại quầy.

## Mẫu giấy chính thức — 23/09/2026

- Thay bốn sơ đồ giấy/tờ khai đang hiển thị bằng mẫu trống từ ba PDF chính thức: Thông tư 22/2025/TT-BYT, Phụ lục II Thông tư 25/2025/TT-BYT và Văn bản hợp nhất 03/VBHN-BTP năm 2026. Có 11 ảnh trang, gồm 10 trang nguồn khác nhau; xem nguồn chi tiết tại FORM-SOURCES.md.
- PDF lưu nguyên byte; SHA-256 và thông tin trang lưu tại form-sources.json. Đã kiểm tra trực quan đủ các trang được dùng, bao gồm trang nối hai mẫu và trang có dấu xác thực văn bản.
- Hiển thị nguồn/ngày đối chiếu, chỉ dẫn đọc, chọn từng trang, phóng to, mở PDF ở trang tương ứng và tải bản gốc đầy đủ. Ảnh lỗi có thông báo dẫn tới PDF. Hình giữ đúng tỷ lệ; bổ sung MIME PNG/PDF cho máy chủ Node.
- `npm run check` đạt 25/25: xác minh PDF nguyên gốc, đủ trang ảnh, kích thước PNG, đường dẫn/nguồn hợp lệ, kết xuất an toàn, cú pháp và UTF-8, cùng các kiểm thử luồng có trước.
- Chưa kiểm tra trực tiếp tương tác hộp xem mẫu và bố cục mới trong trình duyệt. Hạn chế xét duyệt trình duyệt ghi ở trên chưa được giải quyết; không đổi công cụ để vượt bước đã bị chặn. Cần thử trên desktop/mobile thực tế trước khi coi là đã nghiệm thu giao diện.

## Trạng thái xuất bản (giữ nguyên)

Người dùng đã chọn chỉ chạy trên máy, chưa xuất bản. Không gửi mã nguồn hoặc triển khai phiên bản lên Sites. Trước lựa chọn này đã đăng ký định danh Site riêng tư, nhưng chưa có phiên bản hay nội dung dự án được tải lên. Bản trên máy vẫn hoạt động.
