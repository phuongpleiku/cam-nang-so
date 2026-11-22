# Cấp Giấy xác nhận tình trạng hôn nhân — 22/11/2026

Thủ tục 1.004873, dữ liệu `dist/data/tinh-trang-hon-nhan.json`, cấu hình nơi nộp `tinh-trang-hon-nhan-pleiku`. Giao diện dùng lại hướng dẫn từng thao tác của chứng thực; không cần trang hoặc nhánh giao diện riêng.

## Đối chiếu nội dung

- Danh mục công khai của phường Pleiku ghi dịch vụ toàn trình. Đường trang chi tiết, tên nút và các mục biểu mẫu lấy từ tám ảnh người biên soạn cung cấp. Chưa đăng nhập hoặc nộp hồ sơ thật để kiểm tra trực tiếp.
- Nguồn Cổng Dịch vụ công Quốc gia mã nội bộ 108428 mô tả cung cấp thông tin ly hôn/khai tử để cơ quan khai thác dữ liệu. Không biến mọi dòng thành giấy tờ bắt buộc cho tất cả người dân. Dữ liệu không tra cứu được thì thực hiện yêu cầu bổ sung cụ thể.
- Quy trình chung được đối chiếu thêm với cổng dịch vụ công Lào Cai; chỉ dùng nội dung quy trình quốc gia, không dùng lệ phí của Lào Cai cho Gia Lai. Nguồn Gia Lai có thay đổi phí/miễn năm 2026, nên hướng dẫn xem thông báo tại dịch vụ đúng địa bàn và không hứa miễn phí hoặc một số tiền cố định cho mọi hồ sơ.
- Mục đích kết hôn và mục đích khác được tách rõ. Ảnh có lựa chọn mục đích khác nhưng nhập đăng ký kết hôn và số bản sao 5 không được dùng như ví dụ điền đúng. Không đồng nhất số bản sao với số bản chính cấp để kết hôn.
- Phân biệt người nộp với người được cấp giấy, lần đầu/cấp lại, giấy cũ còn/mất, ủy quyền và quan hệ thân nhân. Đang có vợ/chồng không bị chặn khi chỉ cần giấy cho mục đích khác.
- Nhánh nơi cư trú khác/chưa rõ/nước ngoài hướng sang hỗ trợ xác định thẩm quyền trước khi chọn Pleiku. Lịch sử thường trú nhiều nơi không tự biến thành yêu cầu người dân xin giấy tại mọi địa phương.
- Hướng dẫn đăng nhập quốc gia dùng mã `dang-nhap-quoc-gia`; giữ riêng hướng dẫn liên thông khai sinh/khai tử. Các bước xác thực phụ thuộc thông báo thật trên cổng.
- “Lưu hồ sơ” chỉ giữ nháp. Bộ ảnh không có màn hình xác nhận đã gửi, nên không dựng hoặc khẳng định có mã sau một lần bấm. Người dân kiểm tra phản hồi và danh sách hồ sơ; theo dõi yêu cầu xác nhận thông tin trước khi cấp.

Các URL nguồn và ngày đối chiếu được công bố ngay trong JSON thủ tục. Một số lần mở trực tiếp trang quốc gia/Gia Lai hết thời gian chờ; nội dung đối chiếu được tìm qua chỉ mục tìm kiếm chính thức và trang quy trình đọc được. Liên kết vào lấy từ ảnh trang chi tiết công khai; không suy đoán địa bàn giữ sau đăng nhập.

## Ảnh

Chỉ dùng hai ảnh có tiền tố `1795235393419` và `1795235393423`, thể hiện điều kiện giấy tờ và nút lưu/nộp. Sáu ảnh còn lại có tên tài khoản, dữ liệu cá nhân hoặc nội dung điền dễ gây hiểu nhầm nên không sao chép vào dự án. Ảnh dùng nguyên byte, không có EXIF khi kiểm tra; SHA-256 và kích thước trong `marital-status-image-sources.json`.

Thanh địa chỉ trên hai ảnh có URL màn hình nhập liệu. URL này không được dùng làm liên kết hoặc đưa vào cấu hình nộp. Không có tên tài khoản, căn cước, ngày sinh, địa chỉ cá nhân hay mã hồ sơ đã gửi trong phần ảnh được chọn. Không sửa ảnh bằng AI để thay dữ liệu rồi gọi đó là ảnh thật.

## Kiểm tra cần duy trì

`npm run check` kiểm tra các nhánh giấy tờ, phạm vi nơi nộp, đổi câu trả lời xóa tiến độ không còn áp dụng, đăng nhập đúng cổng, phân biệt nháp/gửi, nguồn ảnh và UTF-8. Khi cổng thay đổi thứ tự thao tác, tăng phiên bản dữ liệu nếu vị trí lưu cũ không còn tương ứng. Chưa thử với người dân hoặc trên điện thoại vật lý.
