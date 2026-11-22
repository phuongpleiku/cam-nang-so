# Hướng dẫn biên soạn thủ tục

Mỗi thủ tục là một tệp JSON, không chứa HTML hay mã JavaScript. Văn bản được hiển thị như chữ thuần để tránh nội dung thực thi ngoài ý muốn.

| Trường | Ý nghĩa |
|---|---|
| `id` | Mã duy nhất, không dấu, ví dụ `khai-sinh` |
| `version` | Số phiên bản; tăng khi đổi câu hỏi hoặc điều kiện để bỏ tiến độ cũ |
| `title`, `shortTitle` | Tên dễ hiểu đầy đủ và tên ngắn |
| `description`, `category`, `keywords` | Mô tả thẻ, nhóm tự động và từ khóa tìm kiếm |
| `icon` | `baby` hoặc `document`; mã khác dùng biểu tượng giấy tờ |
| `officialName` | Tên thủ tục chính thức để đối chiếu |
| `reviewedAt`, `sources` | Ngày kiểm tra `YYYY-MM-DD` và các nguồn HTTPS chính thức |
| `questions` | Câu hỏi xác định trường hợp; mặc định một đáp án |
| `notices` | Giải thích bổ sung theo câu trả lời; `blocking: true` chuyển sang hướng dẫn hỗ trợ |
| `checklist` | Các mục cần chuẩn bị; phân biệt giấy tờ và thông tin chỉ để kê khai |
| `fields` | Hướng dẫn từng mục tờ khai, có thể thêm `example` |
| `submission`, `connectionRef` | Các bước nộp và mã cấu hình nơi nộp trong `connections.json` |
| `submissionGuide` | Tùy chọn: hướng dẫn nộp từng thao tác có ảnh, lưu điểm dừng; xem ví dụ chứng thực bản sao |
| `duration`, `fees` | Thời gian và phí đã đối chiếu nguồn |
| `results`, `followUp` | Những kết quả tương ứng và cách theo dõi |
| `visuals` | Hình minh họa tùy chọn, có mô tả và bước hiển thị |

## Thêm hoặc thay đổi nơi nộp

`dist/data/connections.json` là danh mục dùng chung. Hai thủ tục hiện tại tham chiếu `lien-thong-khai-sinh` và `lien-thong-khai-tu`. Giao diện tự lấy nơi nộp, hướng dẫn khi sang cổng, đường dẫn dự phòng và tra cứu từ danh mục này.

1. Trong `systems`, khai báo tên hệ thống và `origins` HTTPS chính thức, ví dụ `https://dichvucong.gov.vn` (không có dấu `/` cuối).
2. Sao chép một mục trong `connections`, đặt mã riêng. Điền `title`, `systemId`, `entryUrl`, `buttonLabel`, `destinationLabel`, `localityNote` và `nextSteps` (mỗi bước gồm `title`, `text`).
3. Điền `fallback` và `tracking`, mỗi mục gồm `systemId`, `url`, `label`, `instruction`. Đường dẫn dự phòng có thể vẫn dùng cùng hệ thống phía sau; không hứa khắc phục mọi sự cố.
4. Ghi `verifiedAt` và `evidenceUrl` sau khi kiểm tra trang đích thực tế. Không sao chép URL có token, mã OTP, mã đăng nhập hoặc trạng thái phiên.
5. Gắn `"connectionRef": "ma-noi-nop"` trong JSON thủ tục. Chạy `npm run check` trước khi bật `published: true`.

Có hai chế độ được hỗ trợ:

- `portal-link`: mở cổng; người dân còn chọn thủ tục/cơ quan. Không khai báo `selectedLocality`.
- `locality-link`: đường dẫn đã kiểm chứng có chọn địa bàn. Khai báo thêm `selectedLocality: {"province":"Gia Lai","ward":"Phường Pleiku"}`; ghi rõ giới hạn sau đăng nhập trong `localityNote`.

Muốn thêm lối mở nhanh khi chưa có hướng dẫn hồ sơ đầy đủ, đặt `shortcut: true` và `description`. Trang chủ tự hiển thị, hỗ trợ tìm kiếm không dấu. Ví dụ `ket-hon-pleiku` là lối mở dịch vụ, chưa phải bộ hướng dẫn chi tiết thứ ba. Khi đã có bộ hướng dẫn đầy đủ, bỏ `shortcut` để tránh thẻ trùng lặp.

Bản nháp do `npm run procedure:add -- ma-thu-tuc "Tên thủ tục"` tạo có `connectionRef` trống. Bộ kiểm tra không cho bật thủ tục khi nơi nộp chưa hợp lệ. Lỗi tải danh mục chỉ ẩn các liên kết bị ảnh hưởng; nội dung chuẩn bị vẫn dùng được. Đây là kết nối bằng đường dẫn, chưa có API nộp hồ sơ, SSO hoặc đồng bộ trạng thái. Không đánh dấu đã nộp khi người dân chỉ bấm mở cổng.

## Thêm hình minh họa

Đặt hình trong `dist/assets/guides/` (tên tệp không dấu, dùng dấu gạch nối), rồi thêm mục vào `visuals` của thủ tục. Không cần sửa giao diện:

```json
{
  "id": "giay-to-minh-hoa",
  "stage": "chuan-bi",
  "src": "assets/guides/giay-to-minh-hoa.svg",
  "title": "Các thông tin cần kiểm tra",
  "alt": "Mô tả bằng chữ nội dung hình cho người dùng trình đọc màn hình.",
  "caption": "Sơ đồ minh họa; vị trí trên giấy thực tế có thể khác."
}
```

`stage` nhận `chuan-bi`, `cach-dien` hoặc `nop-ho-so`. Hỗ trợ SVG, PNG, WebP, JPG, JPEG. Mỗi hình có nút phóng to, thu về vừa màn hình, cuộn ngang trên điện thoại và đóng bằng Escape. `npm run check` kiểm tra hình tồn tại và các trường mô tả.

### Ảnh thao tác và hướng dẫn nộp từng bước

Dùng `dist/data/chung-thuc-ban-sao.json` làm ví dụ. Khai báo `submissionGuide` gồm `intro`, `steps`, `ready`, và tùy chọn `readyLabel`, `troubleshooting`. Mỗi thao tác có `title`, `action`, `expected`; thêm `visualId` trỏ tới một hình trong `visuals` có `stage: "nop-ho-so"`. Giao diện tự hiển thị từng thao tác, cho xem tất cả và nhớ điểm dừng. Việc đọc tới cuối không đánh dấu hồ sơ đã gửi.

Ảnh chụp cổng thật dùng `kind: "portal-screenshot"`, kèm `src`, `width`, `height`, `title`, `alt`, `caption`, `readingTip`, `reviewedAt` và `source: {"label": "Tên cổng", "url": "https://…gov.vn/"}`. Không yêu cầu `originalPdf` và không hiển thị nút tải PDF. Chọn ảnh không có thông tin cá nhân; kiểm tra cả thanh tài khoản, số hồ sơ, tên tệp và siêu dữ liệu. Không đưa ảnh gốc có thông tin cá nhân vào Git. Ghi nguồn và mã SHA-256 của các ảnh đã chọn trong tài liệu biên soạn như `docs/certification-image-sources.json`.

Ghi rõ ảnh do người biên soạn cung cấp hay đã kiểm tra trực tiếp. Không suy đoán giao diện ở bước thiếu ảnh, không dùng đường dẫn hồ sơ đang làm làm liên kết chung, và không coi số tiền tạm hiển thị 0 đồng là miễn phí.

Hình tự dựng cần ghi rõ minh họa, không giả làm mẫu chính thức. Khi dùng ảnh chụp thao tác thật, cần che toàn bộ thông tin cá nhân, ghi rõ nguồn/ngày kiểm tra và mô tả đúng giao diện. Chỉ dùng SVG tin cậy do đơn vị biên soạn; hình không được chứa mã thực thi hoặc dữ liệu riêng tư.

### Mẫu trống chính thức lấy từ Internet

Hai thủ tục hiện tại dùng mẫu thật trong văn bản nhà nước, xem nguồn và trang tại [FORM-SOURCES.md](FORM-SOURCES.md). Để thêm mẫu mới, khai báo `kind: "official-template"` cùng các trường thông thường ở trên, rồi thêm:

- `originalPdf`: tệp PDF gốc trong `assets/forms/`, tên không dấu, dùng dấu gạch nối. Giữ nguyên tệp tải về; không viết đè số, ngày, chữ ký hay dấu trong mẫu.
- `source: {"label": "Tên cơ quan · Tên văn bản", "url": "URL HTTPS gốc"}` và `reviewedAt` theo dạng `YYYY-MM-DD`. Trình hiển thị chấp nhận tên miền con `.gov.vn` và máy chủ đã xác minh `datafiles.chinhphu.vn`; bổ sung nguồn khác chỉ sau khi xác minh chủ thể xuất bản.
- `readingTip`: chỉ dẫn ngắn để người dân biết xem chỗ nào. `caption` nêu phạm vi sử dụng, phân biệt giấy được cấp và tờ khai cần kê khai.
- `pages`: danh sách trang, mỗi trang có `src`, `width`, `height`, `sourcePage` (số trang PDF tính từ 1), `label`, `alt`, `note`. `src` của mẫu phải trùng trang đầu. Ảnh hiện tại được kết xuất từ toàn trang PDF ở 150 dpi; không cắt mất phần nối trang hoặc sửa chữ trên mẫu.

Giao diện tự có nút phóng to, chọn trang, trước/sau, mở PDF đúng trang và tải văn bản đầy đủ. Chỉ trang đang xem được tải trong hộp xem mẫu. Trên điện thoại, ảnh giữ đúng tỷ lệ; ảnh lớn cuộn trong khung riêng. Mẫu giấy do cơ quan cấp phải ghi rõ dùng để nhận biết, không hướng dẫn người dân tự điền thay bản đã cấp. Mẫu tờ khai điện tử không phải ảnh giao diện cổng và không đồng nghĩa phải in/đính kèm hay kê khai mọi mục.

Ghi nguồn, SHA-256 của PDF nguyên gốc và các trang ảnh vào `docs/form-sources.json`; kiểm tra trực quan trước khi đưa vào sử dụng. `npm run check` kiểm tra đường dẫn, kích thước ảnh, nguồn, số trang và SHA-256 cho bộ mẫu hiện tại. Không tăng `version` của thủ tục chỉ vì đổi hình, để giữ tiến độ người dân đã lưu.

## Điều kiện hiển thị

`when` dùng được trên câu hỏi, thông báo, mục chuẩn bị và hướng dẫn điền. Không có `when` nghĩa là luôn hiển thị.

```json
{
  "when": { "question": "birthPaper", "values": ["no", "unsure"] }
}
```

Mục này chỉ hiện khi câu `birthPaper` có đáp án `no` hoặc `unsure`. Với câu hỏi nhiều lựa chọn, chỉ cần có một giá trị khớp. Câu hỏi chỉ được phụ thuộc vào câu xuất hiện trước nó. Khi câu hỏi bị ẩn, đáp án cũ bị xóa; danh sách chuẩn bị cũng loại bỏ tiến độ của mục không còn phù hợp.

## Câu hỏi nhiều lựa chọn

Đặt `type: "multiple"`. Một lựa chọn như “Tôi chưa rõ” có thể có `exclusive: true` để không chọn cùng đáp án cụ thể.

## Soạn một mục chuẩn bị

```json
{
  "id": "giay-to-1",
  "kind": "Giấy tờ",
  "title": "Tên giấy tờ dễ nhận biết",
  "help": "Giấy này lấy ở đâu, đối chiếu thông tin gì, chuẩn bị thế nào.",
  "missing": "Chưa có hoặc bị sai thông tin thì liên hệ ai, làm gì tiếp."
}
```

Không biến giấy tờ tham khảo thành thành phần hồ sơ bắt buộc. Không yêu cầu tải lại dữ liệu mà cổng đã khai thác được. Mức phí, thời hạn và điều kiện hưởng cần nguồn có hiệu lực đúng địa bàn; không tự suy đoán từ tỉnh khác. Tình huống chưa được biên soạn cần hướng sang cán bộ hỗ trợ.

### Hướng dẫn từng bước, dùng lại cho thủ tục mới

Mỗi mục chuẩn bị đang hiển thị phải có `guide` hoặc `guideRef`. Nội dung cũ `help`/`missing` vẫn giữ làm tóm tắt và dự phòng. Bộ kiểm tra ngăn bật một thủ tục thiếu phần hướng dẫn chi tiết.

Để dùng hướng dẫn đăng nhập chung, thêm `"guideRef": "dang-nhap"` vào mục tài khoản. Hướng dẫn chung nằm ở `dist/data/huong-dan-chung.json`: sửa một lần áp dụng cho mọi thủ tục tham chiếu. Cần kiểm tra hướng dẫn đó phù hợp cổng của thủ tục mới; bản hiện tại hướng dẫn cổng liên thông khai sinh/khai tử.

Các giấy tờ riêng dùng cấu trúc sau ngay trong mục checklist, không sửa giao diện:

```json
{
  "guide": {
    "steps": [
      {
        "title": "Tên việc cần làm",
        "action": "Bấm đâu, lấy giấy ở đâu, đọc thông tin nào và thực hiện thế nào.",
        "expected": "Dấu hiệu để biết đã làm đúng bước này.",
        "links": [{"label": "Mở trang chính thức", "url": "https://dichvucong.gov.vn/"}]
      }
    ],
    "ready": "Điều kiện cụ thể để người dân đánh dấu đã chuẩn bị.",
    "troubleshooting": [{"problem": "Tình huống bị vướng", "solution": "Liên hệ ai, nói gì và chuẩn bị gì để hỏi."}],
    "relatedGuide": "chup-tai-giay-to"
  }
}
```

`expected`, `links`, `relatedGuide` là tùy chọn. `relatedGuide` mở thêm hướng dẫn dùng chung, hiện có `chup-tai-giay-to`; không tạo vòng tham chiếu. `visualId` trên mục checklist đưa hình đã khai báo trong `visuals` vào đúng mục giấy tờ. Hình chưa gắn với mục nào vẫn hiển thị ở cuối danh sách.

Để có nhiều cách thực hiện, dùng `guide.paths` thay `guide.steps`; mỗi nhánh có `label`, `intro` tùy chọn, `steps`, `ready`. Giao diện chỉ hiện nhánh đang chọn để dễ đọc trên điện thoại. `troubleshooting`, `sources` và `reviewedAt` có thể đặt ở cấp guide dùng chung cho các nhánh. Bản in in nhánh đang chọn và mở các mục trợ giúp; không đánh dấu hoàn thành tự động khi mở hướng dẫn.

Ưu tiên động từ cụ thể và nhãn đã đối chiếu từ cổng thật. Ghi rõ bước chỉ chuẩn bị, bước nào thực hiện trên cổng; không biến hướng dẫn thành cam kết đủ điều kiện hoặc tiếp nhận hồ sơ. Không thêm ô nhập mật khẩu, OTP, căn cước hoặc tải giấy tờ thật vào Cẩm Nang Số.

## Hướng dẫn cho người ít kinh nghiệm

- Checklist hiện tóm tắt trước. `summary` là mô tả ngắn cho từng giấy tờ/thông tin; nếu thiếu dùng `help`. Nút hướng dẫn mở riêng mục đó tại `#thu-tuc/<id>/chuan-bi/<item-id>`.
- Hướng dẫn mặc định hiện một thao tác. Có Thao tác trước/tiếp theo và Xem tất cả; xem hết không tự đánh dấu đã chuẩn bị. Người dùng chọn Đã chuẩn bị/Cần hỏi thêm/Chưa chuẩn bị riêng.
- Mỗi thủ tục lưu bước đang xem, mục chuẩn bị và vị trí từng nhánh hướng dẫn trên trình duyệt. Dữ liệu cũ cùng phiên bản giữ câu trả lời/checklist; không phải trả lời lại từ đầu. Đổi điều kiện sẽ bỏ tiến độ của mục không còn áp dụng.
- Không đổi thứ tự các nhánh/thao tác một cách tùy tiện sau khi triển khai: vị trí hiện lưu theo chỉ số. Khi thay đổi ý nghĩa hoặc thứ tự lớn, tăng `version` của thủ tục tham chiếu để tránh khôi phục sai vị trí. Chỉnh câu chữ không làm đổi ý nghĩa không cần tăng phiên bản.
- Câu hỏi có thể thêm `help: {"title":"Tôi chưa hiểu…","text":"Giải thích ngắn…","visualId":"ma-hinh"}`. `visualId` tùy chọn, phải tham chiếu hình trong `visuals`. Phần trợ giúp vẫn xuất hiện ở nhánh cần cán bộ kiểm tra.
- Mục hướng dẫn điền có thể thêm `source` (lấy thông tin ở đâu) và `check` (so lại điều gì). Chỉ ghi nhãn/vị trí nút chính xác khi đã đối chiếu cổng thật; ví dụ luôn dùng dữ liệu giả.
- `resultItems` tùy chọn là danh sách `{text, when}`. `when` cùng cấu trúc điều kiện đang dùng; giúp phần kết quả chỉ hiện đúng phạm vi lựa chọn. Giữ `results` làm nội dung dự phòng cho dữ liệu cũ.
- In từ danh sách cho bản tóm tắt và cách xử lý giấy còn thiếu. In từ trang hướng dẫn một mục cho toàn bộ thao tác của nhánh đang chọn; nhánh khác vẫn ẩn.
- Trang hỗ trợ có thể dùng `#ho-tro/<id>/<step>/<item-id>` để giữ tên thủ tục, chỗ vướng và đường trở lại. Chỉ mang theo mã nội dung có sẵn, không đưa thông tin cá nhân vào URL.

## Bật và gỡ khỏi danh sách

`published: false` trong `index.json` giữ thủ tục ở dạng bản nháp. Chuyển thành `true` sau khi kiểm tra dữ liệu và nội dung. Để tạm ngừng hướng dẫn đã lỗi thời, chuyển về `false`, xuất bản lại. Không đặt dữ liệu riêng tư trong JSON kể cả bản nháp vì tệp trong `dist/` vẫn là tài nguyên website.
