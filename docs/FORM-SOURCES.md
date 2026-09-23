# Nguồn mẫu giấy và tờ khai

Đối chiếu và tải ngày 23/09/2026. Các PDF trong `dist/assets/forms/` là bản tải nguyên gốc từ nguồn công khai; ảnh PNG là toàn trang được kết xuất ở 150 dpi (1241 × 1755 px). Không chèn nội dung, điền dữ liệu cá nhân hoặc chỉnh sửa số/ngày/con dấu trên mẫu. Dấu và chữ ký có sẵn thuộc văn bản nguồn, không xác nhận một hồ sơ của người dân.

| Mẫu hiển thị | Nguồn công bố | Trang trong PDF | Bản lưu cục bộ |
|---|---|---|---|
| Giấy chứng sinh · Mẫu số 01 | [Sở Y tế Quảng Ngãi · Thông tư 22/2025/TT-BYT](https://syt.quangngai.gov.vn/upload/2006968/20250806/TT_22_2025_eb40e.pdf) | 5/17 | `dist/assets/forms/tt-22-2025-byt.pdf` |
| Giấy báo tử · Mẫu số 05, Phụ lục II | [Sở Y tế Gia Lai · Trang công bố Thông tư 25/2025/TT-BYT](https://syt.gialai.gov.vn/index.php/vi/van-ban-chi-dao-dieu-hanh/detail/V-v-trien-khai-Thong-tu-so-25-2025-TT-BYT-ngay-30-6-2025-cua-Bo-Y-te-ve-viec-quy-dinh-chi-tiet-thi-hanh-Luat-Bao-hiem-xa-hoi-Luat-An-toan-ve-sinh-lao-dong-ve-linh-vuc-y-te-va-mot-so-dieu-cua-Luat-Kham-benh-chua-benh-3160/) · tập tin 3, `tt-25_pl2.pdf` | 11/29 | `dist/assets/forms/tt-25-2025-byt-phu-luc.pdf` |
| Tờ khai liên thông khai sinh · Mẫu số 01 | [Cổng Thông tin điện tử Chính phủ · 03/VBHN-BTP năm 2026](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/8/03-vbhn-btp.signed.pdf) | 31–33/38 | `dist/assets/forms/03-vbhn-btp-2026.pdf` |
| Tờ khai liên thông khai tử · Mẫu số 02 | Cùng Văn bản hợp nhất 03/VBHN-BTP ở trên | 33–38/38 | Cùng PDF gốc ở trên |

URL tải trực tiếp, SHA-256, số trang nguồn, đường dẫn và kích thước từng ảnh được lưu trong [form-sources.json](form-sources.json). Không dùng ảnh giấy tờ có dữ liệu của một công dân cụ thể.

## Cách giải thích cho người dân

- Giấy chứng sinh là mẫu thông thường, không phải mẫu dành riêng cho mang thai hộ. Bố cục giấy đã cấp ở thời điểm khác có thể khác. Đây là giấy do cơ quan có thẩm quyền cấp, không phải mẫu để người dân tự in rồi điền thay bản được cấp.
- Giấy báo tử được chọn là mẫu của cơ sở khám, chữa bệnh. Không suy rộng thành giấy bắt buộc giống nhau cho mọi trường hợp qua đời ngoài cơ sở y tế; hướng dẫn thay thế vẫn phụ thuộc trường hợp và cơ quan tiếp nhận.
- Tờ khai điện tử để người dân nhận biết các thông tin cần chuẩn bị. Việc nhập thực hiện trên cổng, theo các phần được yêu cầu; không hướng dẫn in, ký hay đính kèm PDF trống khi cổng không yêu cầu.
- Các mục chế độ, thân nhân, nhận trợ cấp chỉ áp dụng theo lựa chọn/phạm vi hồ sơ. Có trong mẫu không đồng nghĩa tự động đủ điều kiện hưởng.
- Trang 33 của văn bản hợp nhất vừa có ghi chú cuối mẫu khai sinh vừa có đầu mẫu khai tử. Giữ nguyên toàn trang và giải thích riêng trong từng bộ mẫu. Trang 38 có chữ ký, con dấu xác thực văn bản hợp nhất; đây không phải dấu xác nhận hồ sơ của gia đình.
- Phụ lục hai Thông tư y tế có ô số/ngày Thông tư để trống trong chính bản công bố. Giữ nguyên; ghi tên văn bản đã đối chiếu ở bên ngoài ảnh.

## Kiểm tra

Đã xem trực quan cả 10 trang nguồn khác nhau (11 ảnh vì trang 33 được dùng trong cả hai bộ tờ khai). Chữ, bảng và dấu có trong nguồn hiển thị rõ; không có dữ liệu điền của công dân. Cập nhật nguồn và ảnh cùng nhau khi văn bản hoặc mẫu thay đổi; không thay nội dung chỉ dựa vào hình tìm kiếm trên Internet.
