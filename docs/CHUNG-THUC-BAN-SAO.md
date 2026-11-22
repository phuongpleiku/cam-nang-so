# Chứng thực bản sao từ bản chính — 22/11/2026

Thủ tục 2.000815 được hướng dẫn cho người chọn phường Pleiku, tỉnh Gia Lai. Nội dung ở `dist/data/chung-thuc-ban-sao.json`; nơi nộp dùng cấu hình `chung-thuc-ban-sao-pleiku` trong `connections.json`.

## Phạm vi và nguồn

- [Danh mục TTHC phường Pleiku](https://pleiku.gialai.gov.vn/danh-muc-phai-tren/danh-muc-tthc): có thủ tục 2.000815, dịch vụ công trực tuyến một phần.
- [Thông tin thủ tục trên Cổng Dịch vụ công Quốc gia](https://dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=2630&open_popup=1): thành phần hồ sơ, yêu cầu bản chính, thời hạn và phí tham khảo. Kết quả tìm kiếm đọc được nội dung; lần mở trực tiếp trang bị hết thời gian chờ.
- [Thông tư 226/2016/TT-BTC](https://vanban.chinhphu.vn/?docid=188026&pageid=27160): căn cứ biểu phí tham khảo; không suy ra mức thanh toán cụ thể của một hồ sơ từ ảnh chụp.
- 12 ảnh do người biên soạn cung cấp cho thấy trình tự trên Cổng Dịch vụ công Quốc gia và Hệ thống thông tin giải quyết TTHC ngành Tư pháp. Không đăng nhập hoặc gửi hồ sơ thật trong đợt biên soạn này.

Liên kết vào là trang chi tiết công khai nhìn thấy trong ảnh. Người dân vẫn cần chọn Gia Lai, phường Pleiku và kiểm tra đơn vị tiếp nhận sau khi chuyển cổng. Không dùng URL của hồ sơ đang làm, không khẳng định địa bàn được tự chọn hoặc giữ sau đăng nhập.

## Cách hướng dẫn

Hỏi mục đích để phân biệt bản sao với chứng thực chữ ký, hợp đồng và bản dịch; hỏi bản chính, nơi cấp và loại kết quả mong muốn. Danh sách chuẩn bị có hướng dẫn từng mục. Bước nộp gồm 12 thao tác, mỗi lần chỉ hiện một thao tác, có thể xem tất cả và tiếp tục đúng điểm dừng.

Ảnh chưa thể hiện chi tiết màn hình “Kê khai thông tin”, vì vậy hướng dẫn kiểm tra các ô thực tế, không tự đặt tên trường. Không lấy thông tin người trong ảnh làm dữ liệu mẫu cho người dân nhập.

“0 VNĐ” kèm “chưa xác định” được giải thích là chưa biết số tiền cuối cùng. “Gửi hồ sơ thành công” chỉ xác nhận đã gửi; người dân lưu mã của mình, theo dõi yêu cầu bổ sung, xuất trình bản chính và nhận kết quả theo hướng dẫn của cơ quan tiếp nhận. Lựa chọn bản điện tử không có nghĩa được bỏ đối chiếu bản chính.

## Ảnh được sử dụng

Bảy ảnh không chứa thông tin cá nhân được sao chép nguyên byte vào `dist/assets/guides/ct-*.jpg`. Danh mục, kích thước và SHA-256 nằm trong `certification-image-sources.json`. Các ảnh không có EXIF khi kiểm tra. Năm ảnh còn lại có tên tài khoản, dữ liệu căn cước/liên hệ hoặc mã hồ sơ nên không đưa vào mã nguồn hoặc website.

Ảnh có nút phóng to, cuộn trong hộp xem trên màn hình nhỏ, chú thích nơi cần nhìn và liên kết nguồn. Không dùng AI dựng lại giao diện hoặc sửa các nút trong ảnh. Khi cổng thay đổi, kiểm tra lại nội dung và thay ảnh đã rà soát thông tin cá nhân; cập nhật ngày đối chiếu và mã SHA-256.

## Kiểm tra

`npm run check` bao gồm cấu trúc dữ liệu, UTF-8, liên kết ảnh, các nhánh câu hỏi, kết quả theo lựa chọn, nhớ thao tác nộp, khả năng kết xuất và SHA-256 của bảy ảnh. Xem `VERIFICATION.md` cho kết quả kiểm tra giao diện. Chưa thử với người dân hoặc trên điện thoại vật lý.
