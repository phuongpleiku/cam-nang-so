# Cấp bản sao Trích lục hộ tịch, bản sao Giấy khai sinh

Đối chiếu ngày 22/11/2026. Mã thủ tục: 2.000635. Nội dung ở `dist/data/ban-sao-ho-tich.json`, kết nối `ban-sao-ho-tich-pleiku`. Dùng giao diện và hướng dẫn đăng nhập quốc gia chung, không tạo biểu mẫu thu thập dữ liệu cá nhân trên Cẩm Nang Số.

## Nguồn và phạm vi

- [Danh mục chính thức phường Pleiku](https://pleiku.gialai.gov.vn/danh-muc-phai-tren/danh-muc-tthc): tên, mã và dịch vụ trực tuyến.
- [Trang chi tiết trong ảnh người biên soạn](https://dichvucong.gov.vn/thu-tuc-hanh-chinh/019d2bfd-867c-72db-b6a7-dcbd8c763807): đường vào công khai. Lần mở trực tiếp để kiểm tra bị hết thời gian; không coi URL này là đã kiểm chứng sau đăng nhập. Có đường dự phòng tìm mã trên trang chủ.
- [Quy trình công bố trên Cổng Dịch vụ công Quốc gia](https://vpcp.dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-dung-chung.html?ma_thu_tuc=2.000635): đối chiếu thành phần hồ sơ, thời hạn, mức phí công bố và cách xử lý.
- [Quy trình chung đăng trên cổng Lào Cai](https://dichvucong.laocai.gov.vn/trang-chu/tra-cuu/chi-tiet-thu-tuc?ma-thu-tuc=20373): bổ sung đối chiếu dữ liệu tự điền, biểu mẫu điện tử và bản chụp. Không lấy cơ quan hoặc cước địa phương này làm thông tin riêng cho Pleiku.
- Bảy ảnh do người dùng cung cấp làm căn cứ hướng dẫn các trường và nút trên cổng. Không có ảnh phản hồi sau khi gửi của thủ tục này: bước theo dõi mô tả thao tác kiểm tra, không dựng hình thông báo thành công.

## Quyết định biên soạn

- Bốn câu hỏi phân loại nhu cầu, sự kiện đã đăng ký, vai trò và thông tin cũ. Xin bản sao không bị lẫn với đăng ký lần đầu hoặc chứng thực photocopy. Trường hợp chưa rõ đã đăng ký cần hỏi cơ quan trước.
- Mất giấy không tự có nghĩa phải đăng ký lại. Không bắt nộp giấy cũ cho mọi người. Không nhớ số/ngày đăng ký thì hướng dẫn tra cứu, không tự điền số định danh hoặc ngày sinh thay thế.
- Người đại diện theo pháp luật có mục chuẩn bị riêng; không tự yêu cầu trẻ nhỏ lập ủy quyền. Trường hợp được ủy quyền cần văn bản; miễn chứng thực cho quan hệ thuộc diện quy định không có nghĩa miễn văn bản.
- Hướng dẫn 13 thao tác tách hai phần người nộp/người cần giấy, loại bản sao, cơ quan đăng ký cũ, số/quyển/ngày đăng ký, số bản, ngày kê khai, cách nhận và nút lưu/gửi.
- Không khẳng định Pleiku luôn có thẩm quyền cho mọi người. Không ghi đè tên cơ quan đăng ký cũ thành tên nơi đang tiếp nhận. Không đưa thông tin cá nhân trong ảnh vào ví dụ điền.
- Mức phí được ghi là mức công bố, còn phải đối chiếu miễn/giảm và thông báo hồ sơ. Không gán thời hạn sử dụng giấy xác nhận hôn nhân sang bản sao hộ tịch.

## Ảnh minh họa

Chỉ sử dụng một ảnh gốc không chỉnh sửa: `assets/guides/ht-uy-quyen-va-nop.jpg`. Đã xem ảnh: không có tên tài khoản, số định danh, ngày sinh, địa chỉ cá nhân hoặc số đăng ký hộ tịch. Ngày lập tờ khai trong ảnh được ghi rõ là ví dụ. Không dùng URL biểu mẫu trong thanh địa chỉ của ảnh làm liên kết nộp chung.

Sáu ảnh còn lại có tài khoản, thông tin người nộp hoặc thông tin đăng ký cụ thể nên không đưa vào kho mã hay website. Danh sách nguồn, kích thước và SHA-256 ở `civil-record-image-sources.json`; ảnh giữ nguyên byte, không có EXIF.

## Bảo trì

Kiểm tra lại nhãn trường/nút và cơ quan tại cổng khi có thay đổi; không tạo hoặc gửi hồ sơ thật chỉ để thử. Cập nhật ngày đối chiếu và nguồn, chạy `npm run check`. Chỉ tăng phiên bản thủ tục nếu thay đổi ý nghĩa câu trả lời hoặc luồng làm việc khiến tiến độ cũ không còn đúng. Xem `VERIFICATION.md` về phạm vi kiểm thử.
