# Phương án kết nối nơi nộp hồ sơ cho Cẩm Nang Số

Ngày khảo sát: 23/09/2026. Phạm vi: người dân phường Pleiku, Gia Lai; hai thủ tục liên thông hiện có và khả năng mở rộng. Đây là kết quả nghiên cứu và thiết kế đề xuất, chưa phải tích hợp API đã vận hành. Không đăng nhập, truyền thông tin cá nhân hoặc nộp hồ sơ thật trong quá trình khảo sát.

## Kết luận đề xuất

Triển khai trước việc mở đúng dịch vụ, chọn sẵn địa bàn bằng đường dẫn đã kiểm tra, và giữ hướng dẫn cho người dân xem lại. Với thủ tục chưa có đường dẫn trực tiếp được xác minh, dùng trang chính thức cùng chỉ dẫn chọn dịch vụ. Việc đăng nhập, kiểm tra dữ liệu có sẵn và gửi hồ sơ diễn ra trên cổng chính thức.

Khả năng API cần trao đổi với đơn vị quản lý và kỹ thuật. Chưa tìm thấy trong các nguồn đã khảo sát một cổng đăng ký API công khai cho website độc lập như Cẩm Nang Số tự lấy khóa rồi gửi hồ sơ. Điều này không có nghĩa API không tồn tại; nguồn của tỉnh xác nhận có kế hoạch triển khai các API nghiệp vụ giữa các hệ thống.

## Những điểm đã kiểm tra trực tiếp

| Hệ thống | Quan sát thực tế / nguồn chính thức | Cách dùng phù hợp |
|---|---|---|
| Cổng Dịch vụ công Quốc gia | Có liên kết dịch vụ liên thông, tìm kiếm thủ tục, chọn tỉnh và phường, danh sách dịch vụ, nút Nộp trực tuyến | Điểm truy cập cho thủ tục mở rộng; lưu URL đã kiểm chứng theo từng dịch vụ |
| Dịch vụ công liên thông | Hai nhóm khai sinh/khai tử; chọn nhóm khi chưa đăng nhập dẫn đến VNeID | Hai thủ tục hiện tại tiếp tục đi theo cổng này |
| Cổng dịch vụ công Gia Lai | Trang hiện thông báo chuyển sang Cổng Quốc gia và tự chuyển đến đó | Không lấy cổng tỉnh cũ làm điểm nộp mặc định mới |
| VNeID | Trang đăng nhập chính thức có số định danh, mật khẩu và QR | Để cổng chính thức chuyển người dùng đến xác thực; không sao chép URL đăng nhập có trạng thái phiên |
| Các hệ thống xử lý tỉnh, hộ tịch, cư trú, BHXH | Có cơ chế liên thông/chia sẻ dữ liệu theo các nguồn bên dưới | Chỉ tích hợp khi có phạm vi được đơn vị quản lý xác nhận; không yêu cầu người dân tự đi qua từng hệ thống xử lý |

Nguồn quan sát: [Cổng Quốc gia](https://dichvucong.gov.vn/), [Cổng liên thông](https://lienthong.dichvucong.gov.vn/), [Cổng Gia Lai](https://dichvucong.gialai.gov.vn/). Quan sát giao diện chưa đăng nhập, không xác minh toàn bộ quy trình phía sau xác thực.

### Thử nghiệm cụ thể: đăng ký kết hôn tại Pleiku

Đã thực hiện trên giao diện công khai: tìm “Đăng ký kết hôn” → chọn đúng thủ tục → chọn Tỉnh Gia Lai → Phường Pleiku → bấm Nộp hồ sơ để mở danh sách dịch vụ. Đây là bước chọn dịch vụ, chưa tạo/gửi hồ sơ cá nhân.

- [Trang chi tiết thủ tục](https://dichvucong.gov.vn/thu-tuc-hanh-chinh/019d2bfd-3fac-7489-b53b-a15eb239a6fe): mã thủ tục hiển thị là 1.000894.
- [Đường dẫn đã chọn Gia Lai và Pleiku](https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-3fac-7489-b53b-a15eb239a6fe&province=019bad30-cd8f-722b-a3c5-d131d484376c&ministry=&ward=019bad30-cd8f-722b-a3c6-b9084ef9c85b&searchType=PROVINCE&commune=WARD&provinceCode=52&wardCode=23575).
- Mở đường dẫn này trong một tab mới, cùng trình duyệt chưa đăng nhập: hiển thị đúng thủ tục và cơ quan UBND phường Pleiku, có nút Nộp trực tuyến. Đây chưa phải thử nghiệm trên thiết bị/trình duyệt sạch hoàn toàn.
- Bấm Nộp trực tuyến: được chuyển sang màn hình VNeID. Đã dừng ở đó, không nhập thông tin.
- Đây là bằng chứng có thể rút ngắn bước tìm kiếm và chọn địa bàn cho ít nhất thủ tục mẫu này. Chưa kết luận mọi thủ tục hỗ trợ cùng cách, chưa xác minh việc giữ lựa chọn sau đăng nhập.

Các mã và tham số trên được lấy từ URL cổng tạo ra qua thao tác thực tế. Không tự suy diễn mã dịch vụ khác. Đường dẫn công khai đang hoạt động không đồng nghĩa một hợp đồng tích hợp được bảo đảm lâu dài; cần có ngày kiểm tra và đường dẫn dự phòng.

### Hai thủ tục đang có

Trang chủ Cổng Quốc gia hiện công bố [liên kết khai sinh, khai tử](https://lienthong.dichvucong.gov.vn/#/?vneid=1). Đây là liên kết đến nhóm dịch vụ, chưa phải đường dẫn riêng cho từng nhánh hoặc chọn sẵn Pleiku. Có thể hướng dẫn người dân chọn đúng ô ngay sau khi mở; chưa hứa hẹn bỏ qua bước này.

Thông tin BHXH Việt Nam ngày 13/08/2026 mô tả việc nộp hai nhóm liên thông qua Cổng Quốc gia/VNeID và tận dụng dữ liệu có sẵn. Vì vậy, đề xuất tận dụng khả năng điền sẵn của hệ thống chính thức trước khi xây dựng một lớp thu thập thông tin trùng lặp. [Nguồn BHXH Việt Nam](https://baohiemxahoi.gov.vn/tintuc/pages/linh-vuc-bao-hiem-xa-hoi.aspx?CateID=52&ItemID=26949&OtItem=date).

## So sánh các mức kết nối

| Phương án | Trải nghiệm | Có thể làm ngay? | Điều kiện/giới hạn |
|---|---|---|---|
| Liên kết đến nhóm hoặc trang thủ tục | Người dân xem hướng dẫn rồi mở đúng nơi | Có | Cần kiểm tra đúng dịch vụ và nơi tiếp nhận |
| Đường dẫn chọn sẵn thủ tục + địa bàn | Bỏ qua tìm kiếm/chọn địa bàn đã được xác minh | Có với URL kiểm chứng | Không tự điền thông tin cá nhân, không tự gửi; phải có dự phòng khi URL thay đổi |
| Phiếu chuẩn bị để đối chiếu/sao chép | Hỗ trợ những trường chưa được cổng điền sẵn | Có thể phát triển riêng | Người dân kiểm tra rồi tự dán; không mặc định lưu căn cước/giấy tờ vào trình duyệt; tránh bắt nhập lại dữ liệu cổng đã có |
| Tiện ích trình duyệt hỗ trợ điền | Có thể đọc cấu trúc trang và điền các ô trong phạm vi được cấp quyền | Cần thử nghiệm riêng | Phụ thuộc giao diện từng cổng, phải cài tiện ích; chưa xác minh tương thích Android/iOS. Không chọn làm luồng chính cho mọi người dân |
| API chính thức | Có thể tạo nháp, chuyển dữ liệu, nhận mã/trạng thái theo phạm vi API | Chưa thể triển khai thật từ tài liệu hiện có | Cần đơn vị quản lý chấp thuận, tài liệu hiện hành, tài khoản/môi trường thử và phạm vi quyền |
| Đăng nhập VNeID ngay trong Cẩm Nang Số | Xác thực người dùng cho chính ứng dụng | Chưa có cấu hình/quyền tích hợp | Đăng nhập một lần không tự cấp quyền nộp hồ sơ hay đọc giấy tờ |

Nhúng cổng bằng iframe không tự tạo khả năng điều khiển tờ khai: trình duyệt hạn chế tương tác giữa hai website khác nguồn; cổng cũng có thể từ chối bị nhúng. Chưa kiểm tra chính sách nhúng của từng cổng, nên không khẳng định tất cả đều chặn. Tích hợp hợp lệ cần sự hỗ trợ tương ứng từ hệ thống đích. [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy), [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

Khả năng tiện ích truy cập nội dung trang cần quyền theo cơ chế trình duyệt; đây không phải tính năng một website thông thường có sẵn. [Tài liệu Chrome về content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts). Nhận định về độ khó bảo trì và ưu tiên mobile ở bảng là đánh giá thiết kế của dự án.

## API tại Gia Lai: có cơ sở để trao đổi, chưa coi là đã sẵn sàng cho dự án

Ngày 15/03/2026, Văn phòng UBND tỉnh công bố kế hoạch theo Quyết định 61/QĐ-VPUBND: Trung tâm Phục vụ hành chính công tỉnh phối hợp VNPT Gia Lai thực hiện kết nối. Nội dung kỹ thuật gồm đăng nhập, khởi tạo hồ sơ, cập nhật xử lý, nghĩa vụ tài chính, tiếp nhận và trả kết quả. Bài viết nêu kế hoạch, không xác nhận quyền truy cập của một website bên ngoài. [Nguồn Văn phòng UBND tỉnh](https://vpub.gialai.gov.vn/article/news/gia-lai-ban-hanh-danh-muc-nhiem-vu-ket-noi-he-thong-giai-quyet-thu-tuc-hanh-chinh-voi-cong-dich-vu-cong-quoc-gia.html).

Cập nhật ngày 10/09/2026 tiếp tục đôn đốc kết nối API khai thác thông tin/giấy tờ VNeID, yêu cầu báo cáo trước 17/09. Chưa tìm được báo cáo hoàn thành trong phạm vi khảo sát. Không suy ra rằng tất cả các API đã hoạt động chỉ vì đã qua mốc kế hoạch. [Cập nhật VNeID của tỉnh](https://vpub.gialai.gov.vn/thu-muc-lien-ket/chuyen-muc-chuyen-doi-so/khan-truong-ket-noi-vneid-voi-he-thong-thong-tin-giai-quyet-thu-tuc-hanh-chinh-tinh-gia-lai.html).

Thông tư 4/2025/TT-VPCP là một nguồn về phạm vi dữ liệu kết nối giữa Cổng Quốc gia và hệ thống nhà nước; không phải tài liệu cấp khóa API cho Cẩm Nang Số. [Văn bản chính thức](https://vanban.chinhphu.vn/?docid=216140&pageid=27160&typegroupid=6). Có thêm công bố tài liệu trao đổi dữ liệu bảo hiểm với hệ thống giải quyết TTHC cấp bộ/tỉnh, nhưng API khai thác dữ liệu bảo hiểm không đồng nhất với API gửi hồ sơ mai táng/tử tuất. [Công bố dữ liệu bảo hiểm](https://vpcp.dichvucong.gov.vn/p/home/dvc-chi-tiet-tin-tuc.html?new_id=962).

## Thiết kế để dễ mở rộng

Tách “nội dung hướng dẫn” khỏi “nơi thực hiện”. Mỗi thủ tục tham chiếu một cấu hình kết nối; giao diện đọc cấu hình thay vì viết riêng nút cho từng cơ quan. Cấu hình đề xuất gồm:

| Trường | Mục đích |
|---|---|
| systemId | Nhận diện Cổng Quốc gia, liên thông hoặc hệ thống được chấp thuận |
| procedureCode | Mã thủ tục chính thức đã kiểm tra |
| mode | portal-link, locality-link hoặc approved-api |
| entryUrl, fallbackUrl | Đường dẫn bắt đầu và đường dẫn dự phòng đã kiểm tra |
| destinationLabel | Tên cổng/cơ quan người dân sắp đến |
| locality | Địa bàn cấu hình; không quyết định thay thẩm quyền theo trường hợp |
| verifiedAt, evidenceUrl | Ngày và căn cứ kiểm tra |
| capabilities | Chỉ bật tính năng đã chứng minh: chọn sẵn địa bàn, tạo nháp, theo dõi… |
| nextAction | Một câu chỉ rõ thao tác ngay sau khi chuyển cổng |

Không lưu URL xác thực chứa state/code/token của phiên đăng nhập làm entryUrl. Không chứa thông tin căn cước, mật khẩu hoặc hồ sơ công dân trong URL, mã QR hoặc cấu hình công khai. Khi nâng cấp từ liên kết sang API, giữ nguyên nội dung hướng dẫn và thay bộ kết nối.

Luồng đề xuất hiện tại: chọn trường hợp → chuẩn bị → đọc “sang cổng bấm gì” → mở dịch vụ chính thức → người dân đăng nhập/kiểm tra/gửi → tra cứu tại cổng. Cẩm Nang Số chỉ hiển thị “đã mở cổng” khi đó là điều biết được; không chuyển thành “đã nộp” từ việc bấm liên kết.

Nếu sau này được cấp API: bổ sung máy chủ trung gian giữ thông tin xác thực hệ thống; nhận/gửi dữ liệu đúng phạm vi; hỗ trợ chống tạo trùng, đối soát mã hồ sơ, trạng thái và lỗi. Chỉ xác nhận gửi thành công khi có phản hồi chính thức tương ứng. Tính năng này cần một dự án thử nghiệm được thống nhất với bên tiếp nhận.

## Nội dung cần làm rõ với đầu mối tích hợp

Đầu mối đề xuất: Trung tâm Phục vụ hành chính công tỉnh qua phối hợp của phường; VNPT Gia Lai hỗ trợ kỹ thuật theo phân công hiện hành. Đây là đề xuất dựa trên nguồn của tỉnh; chưa liên hệ hay gửi thông tin ra ngoài.

1. Cẩm Nang Số có thể được công nhận là ứng dụng hỗ trợ/kết nối không, và cơ quan nào chủ trì?
2. Có đường dẫn chính thức chọn sẵn thủ tục, địa bàn, cơ quan và giữ lựa chọn qua đăng nhập không?
3. Có API được phép dùng cho danh mục, tạo nháp, đính kèm, nộp, lấy trạng thái và nhận kết quả không? API nào chỉ phục vụ hệ thống nội bộ?
4. Xin tài liệu hiện hành, môi trường thử, dữ liệu mẫu, cách cấp tài khoản và phạm vi quyền; không dùng khóa/cookie của cổng khác.
5. Ai xác thực công dân, ai xác nhận gửi cuối cùng; API có mã chống tạo trùng và cơ chế tra soát khi mất phản hồi không?
6. Có thông báo trạng thái qua callback/webhook hay cần truy vấn? Định nghĩa từng trạng thái và nguồn ngày hẹn là gì?
7. Phân định trách nhiệm xử lý/lưu giữ dữ liệu, cơ chế người dân đồng ý, vận hành và thông báo thay đổi phiên bản như thế nào?

Ưu tiên phát triển tiếp: danh mục liên kết có xác minh và dự phòng; hướng dẫn bước chuyển cổng; thử 3–5 thủ tục bổ sung từng cái một. Chưa bật API, tự động điền hoặc tính năng lưu hồ sơ cá nhân chỉ từ kết quả nghiên cứu này.
