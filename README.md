# Cẩm Nang Số — Phường Pleiku

Website hướng dẫn người dân chuẩn bị và thực hiện thủ tục hành chính. Giao diện thích ứng điện thoại và máy tính; không tiếp nhận hồ sơ hay thu thập giấy tờ cá nhân. Nộp hồ sơ qua cổng chính thức trong tab mới.

## Chạy tại máy

Cần Node.js 20 trở lên. Không cần cài thêm thư viện.

Cách nhanh: mở tệp `D:\CamNangSo\Mo-Cam-Nang-So.cmd`, giữ cửa sổ đó mở, rồi truy cập `http://127.0.0.1:4173` trong trình duyệt. Nếu bản xem trước hiện tại vẫn đang chạy, chỉ cần mở lại địa chỉ này, không mở thêm máy chủ thứ hai.

```powershell
cd D:\CamNangSo\cam-nang-so
npm run dev
```

Mở địa chỉ được in ra, mặc định `http://127.0.0.1:4173`. Nếu cổng đang được dùng, đặt biến `PORT` khác trước khi chạy.

## Thêm thủ tục mà không sửa giao diện

```powershell
npm run procedure:add -- dang-ky-ket-hon "Đăng ký kết hôn"
```

1. Lệnh tạo một tệp JSON UTF-8 trong `dist/data/`, đồng thời thêm bản nháp vào danh mục. Tệp hiện hữu không bị ghi đè.
2. Mở tệp vừa tạo, thay các dòng `CẦN BIÊN SOẠN` bằng nội dung đã đối chiếu nguồn chính thức. Dùng các thủ tục sẵn có làm ví dụ. Khai báo nơi nộp trong `dist/data/connections.json` rồi điền `connectionRef` vào thủ tục. Xem `docs/CONTENT.md` để hiểu từng trường dữ liệu.
3. Chạy `npm run check`. Khi nội dung đã được duyệt, đổi `published` của thủ tục thành `true` trong `dist/data/index.json`, chạy kiểm tra lần nữa và tải lại trang trên máy.

Danh sách trang chủ, nhóm thủ tục, tìm kiếm và toàn bộ 5 bước tự sinh từ dữ liệu. Không cần tạo trang hay viết nhánh `if` riêng trong giao diện. Sửa thủ tục cũng chỉ sửa JSON; tăng `version` nếu thay đổi luồng để không dùng lại câu trả lời cũ.

## Cấu trúc

- `dist/data/index.json`: đăng ký và bật/tắt thủ tục; bản nháp không được nạp vào giao diện.
- `dist/data/khai-sinh.json`, `dist/data/khai-tu.json`, `dist/data/chung-thuc-ban-sao.json`, `dist/data/tinh-trang-hon-nhan.json`: nội dung bốn bộ thủ tục; mỗi thủ tục mới có tệp riêng.
- `dist/data/connections.json`: hệ thống, nơi nộp, hướng dẫn chuyển sang cổng, tra cứu và đường dự phòng; tham chiếu bằng `connectionRef`.
- `dist/data/huong-dan-chung.json`: hướng dẫn đăng nhập và chụp/đính kèm giấy tờ dùng lại.
- `dist/connections.js`, `dist/connections.css`: kiểm tra và hiển thị nơi nộp dùng chung.
- `dist/app.js`: giao diện và điều hướng dùng chung.
- `dist/rules.js`: điều kiện xuất hiện câu hỏi, hồ sơ và thông báo.
- `dist/progress.js`: khôi phục điểm dừng và trạng thái chuẩn bị theo từng thủ tục.
- `dist/tutorials.js`: hướng dẫn từng thao tác, ghi nhớ nhánh và cách xem toàn bộ.
- `dist/novice.js`, `dist/novice.css`: trợ giúp câu hỏi, sơ đồ chuyển trang và bố cục cho người ít kinh nghiệm.
- `dist/styles.css`, `dist/components.css`: giao diện, responsive và bản in.
- `scripts/`: tạo bản nháp, kiểm tra và mở máy chủ xem trước.
- `tests/`: kiểm tra các nhánh quan trọng để tránh hướng dẫn sai.

## Kiểm tra

`npm run check` kiểm tra cấu trúc dữ liệu, mã trùng, điều kiện tham chiếu, URL HTTPS, cú pháp JavaScript, tài nguyên và UTF-8; sau đó chạy kiểm thử các nhánh khai sinh, khai tử và chứng thực bản sao.

## Phạm vi hiện tại

- Bốn bộ hướng dẫn: khai sinh và khai tử liên thông (đối chiếu 23/09/2026); chứng thực bản sao từ bản chính, mã 2.000815 và cấp Giấy xác nhận tình trạng hôn nhân, mã 1.004873 (đối chiếu 22/11/2026).
- Chứng thực bản sao có 12 thao tác nộp hồ sơ và 7 ảnh chụp cổng thật đã chọn để không đưa thông tin cá nhân lên website. Xem `docs/CHUNG-THUC-BAN-SAO.md` về nguồn, giới hạn và cách bảo trì.
- Xác nhận tình trạng hôn nhân có 13 thao tác, hai ảnh thật, checklist theo trường hợp và giải thích mục đích, số bản, lưu nháp/gửi hồ sơ. Xem `docs/TINH-TRANG-HON-NHAN.md`.
- Tìm kiếm có dấu/không dấu, lọc nhóm, hỏi từng câu, danh sách đánh dấu, in/lưu PDF, hướng dẫn điền, liên kết nộp và tra cứu.
- Nơi nộp của từng thủ tục có các bước bắt đầu, liên kết dự phòng và nguồn/ngày kiểm chứng. Lối mở nhanh Đăng ký kết hôn đã chọn Gia Lai/phường Pleiku; chưa có bộ hướng dẫn hồ sơ đầy đủ cho thủ tục này.
- Bốn mẫu giấy/tờ khai từ văn bản chính thức, tại bước chuẩn bị và hướng dẫn điền. Có phóng to/thu nhỏ, chọn trang, nguồn đối chiếu và tải PDF gốc. Thêm mẫu qua `visuals` trong tệp thủ tục; xem `docs/CONTENT.md` và `docs/FORM-SOURCES.md`.
- Tiến độ chỉ lưu trong localStorage của trình duyệt; không chứa họ tên, số định danh, hồ sơ, tài khoản hoặc OTP. Có nút xóa và bắt đầu lại cho từng thủ tục.
- Tiếp tục về đúng bước/mục đang xem; nhớ nhánh và thao tác trong hướng dẫn. Danh sách chuẩn bị hiển thị ngắn trước, có trạng thái Cần hỏi thêm và trợ giúp đúng chỗ vướng. Dấu trên thanh bước chỉ thể hiện Đang xem, không suy đoán hồ sơ đã nộp.
- Chưa kết nối dữ liệu trạng thái hồ sơ nhà nước; không tự điền hoặc nộp hồ sơ thay người dân.
- Chưa có tài khoản quản trị hay CMS trực tuyến. Biên tập qua các tệp nội dung và công cụ tạo bản nháp. Có thể nối CMS sau này mà giữ nguyên giao diện và định dạng dữ liệu.
- Địa chỉ 81 Hùng Vương và điện thoại 0269 3828 313 là thông tin công khai của UBND phường, không khẳng định địa chỉ quầy tiếp nhận. Cần xác nhận địa điểm, giờ làm việc, phí và các trường hợp đặc thù trước khi hướng dẫn người dân tới trực tiếp.
- Các ví dụ điền là minh họa, không giả lập ảnh chụp Cổng Dịch vụ công hoặc cam kết quyền lợi trợ cấp.

## Xuất bản

Website sử dụng GitHub Pages. Để cấu hình hoặc cập nhật, làm theo [hướng dẫn từng bước](docs/GITHUB-PAGES.md). Workflow `.github/workflows/pages.yml` kiểm tra dự án rồi xuất bản `dist` khi push vào `main` hoặc chạy thủ công; cần bật Source → GitHub Actions trong Settings → Pages.

Tài nguyên website nằm trọn trong `dist/`. Không cần bước build. `.gitignore` loại trừ cấu hình Sites cũ, tệp tạm và tệp môi trường khỏi Git. Nguồn và công cụ biên tập nằm ngoài `dist/` không được đưa vào website, nhưng vẫn công khai trong kho mã nếu chọn repository Public. Mọi tệp phải được giữ nguyên UTF-8.
