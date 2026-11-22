# Trang chủ dễ tìm thủ tục — 22/11/2026

## Cơ sở thiết kế

Rà soát mã nguồn và nội dung trang chủ hiện hữu; chưa có khảo sát hay thử nghiệm trực tiếp với người dân. Đây là đánh giá thiết kế, không phải kết quả đo lường mức độ sử dụng.

- [W3C: nhu cầu của người dùng lớn tuổi](https://www.w3.org/WAI/older-users/): chú trọng chữ, độ tương phản, nội dung dễ hiểu và vùng bấm rõ. Áp dụng bằng nhãn luôn hiển thị, vùng bấm cả thẻ, nút đủ lớn và trạng thái tập trung bàn phím.
- [GOV.UK: viết nội dung giao diện](https://www.gov.uk/service-manual/design/writing-for-user-interfaces): tên dịch vụ theo ngôn ngữ người dùng và nội dung dễ quét mắt. Áp dụng bằng tên việc ngắn, mô tả giúp chọn đúng và giảm các dòng lặp trên mỗi thẻ.

## Vấn đề và thay đổi

| Nhận định khi rà soát bản cũ | Thiết kế đã áp dụng |
|---|---|
| Thẻ cao, nhiều tên dài, lặp danh sách tính năng | Thẻ ngắn, một tên việc + một mô tả giúp phân biệt + một hành động |
| “Chứng thực bản sao” và “bản sao hộ tịch” dễ nhầm | Nói rõ sao y từ giấy đang có và xin bản sao từ thông tin đã đăng ký |
| Ô tìm kiếm có chữ trang trí giống nút | Nút Tìm hoạt động; Enter đưa tới tiêu đề kết quả; vẫn lọc khi gõ |
| Không biết gõ gì hoặc không tìm được | Ví dụ, gõ không dấu/mã; xóa cả tìm kiếm lẫn bộ lọc; đường nhờ hỗ trợ |
| Chỉ thấy nút tiếp tục nhưng chưa biết đang ở đâu | Dòng Đang xem và đường trở lại đúng bước/mục từ tiến độ hiện có |
| Lối vào dịch vụ chưa biên soạn nằm lẫn trong hành trình | Phần mở rộng ghi rõ chưa có hướng dẫn, mở khi tìm thấy dịch vụ liên quan |
| Thêm thủ tục làm tên trang chủ ngày càng dài | Trường `home` tùy chọn trong JSON; giữ tên chính thức ở trang hướng dẫn và nguồn |

## Bố cục và giới hạn

Giữ màu xanh của Cẩm Nang Số. Đầu trang là câu hỏi theo nhu cầu và tìm kiếm; tiếp theo là nhóm lọc, danh sách hướng dẫn, ô liên hệ; cuối trang giải thích ba việc cần làm và nơi nộp hồ sơ. Biểu tượng là SVG dùng cùng hệ thống, luôn đi kèm chữ, không có ảnh trang trí lớn cản đường tới thủ tục.

Desktop có ba cột (năm thủ tục và một ô hỗ trợ), chiều rộng trung bình hai cột, mobile một cột. Không dùng chiều cao cố định hay cắt ngắn nội dung thẻ. CSS mới giới hạn trong trang chủ, không thay đổi bố cục từng bước. Tên/mô tả không làm thay đổi điều kiện pháp lý hoặc tiến độ đã lưu.

38 kiểm thử tự động đạt. Công cụ trình duyệt không khả dụng nên chưa kiểm thử trực quan ở các kích thước màn hình, zoom 200%, bàn phím và trình đọc màn hình. Cần thực hiện các kiểm tra này khi trình duyệt dùng được; không coi đọc CSS hoặc kiểm thử hàm render là bằng chứng UI đã đạt.

## Thử với người dân khi có điều kiện

Cho người chưa dùng trang tìm: làm khai sinh cho con mới sinh; xin bản sao khi mất giấy; sao y giấy đang giữ; tiếp tục hướng dẫn trước đó; tìm hỗ trợ khi chưa thấy việc cần làm. Quan sát họ chọn đúng ô ngay lần đầu không, có hiểu đang đọc hướng dẫn hay đã nộp hồ sơ không, có tìm được số liên hệ không. Ghi nhận chỗ họ dừng hoặc chọn nhầm để sửa lời dẫn; chưa có số liệu để khẳng định bản mới tốt hơn theo tỷ lệ hay thời gian hoàn thành.
