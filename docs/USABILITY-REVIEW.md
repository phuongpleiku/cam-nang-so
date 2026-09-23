# Rà soát khả năng sử dụng của Cẩm Nang Số

Ngày đánh giá: 23/09/2026. Địa bàn thiết kế: phường Pleiku, tỉnh Gia Lai.

## Kết luận

Bản hiện tại có nền tảng phù hợp cho người biết dùng điện thoại ở mức cơ bản, cần giải thích thủ tục. Chưa có đủ căn cứ để coi đây là công cụ giúp người hoàn toàn thiếu kinh nghiệm tự hoàn thành hồ sơ từ đầu đến cuối.

Điểm nghẽn lớn nhất là chuyển giữa Cẩm Nang Số, cổng dịch vụ công và VNeID; tiếp theo là lượng chữ, các bước còn khái quát sau đăng nhập và khả năng quay lại đúng việc đang làm. Làm giao diện gọn không tự giải quyết được các điểm nghẽn này.

Đây là rà soát chuyên môn dựa trên mã nguồn, toàn bộ nội dung hai thủ tục, hướng dẫn chung, cấu hình nơi nộp và kết quả kiểm tra giao diện đã ghi ở VERIFICATION.md. Những tác động dự đoán với người dân là giả thuyết cần kiểm chứng, không phải kết quả phỏng vấn người dùng.

Chưa có thử nghiệm với người dân thật, trình đọc màn hình, thiết bị iPhone/Android vật lý hoặc quy trình sau đăng nhập bằng hồ sơ thật. Lượt kiểm tra trình duyệt trước bị xét duyệt tự động chặn khi mở tiếp trang khai sinh vì workspace hết lượt xét duyệt; đợt rà soát này không thực hiện lại thao tác bị chặn. 14 kiểm thử kỹ thuật đã đạt không chứng minh người mới có thể tự sử dụng thành công. Đây cũng không phải chứng nhận WCAG hoặc rà soát đầy đủ tính pháp lý của từng thủ tục.

## Đánh giá theo nhóm người dùng

| Nhóm | Đánh giá sơ bộ | Điều kiện còn thiếu |
|---|---|---|
| Đã biết dùng trình duyệt, có VNeID, chưa biết thủ tục | Có thể hỗ trợ tốt việc chuẩn bị | Cần hướng dẫn chi tiết theo màn hình thực tế khi kê khai/gửi |
| Dùng điện thoại nhưng chưa biết tab, tệp, QR, OTP | Chưa đủ dễ để tự làm xuyên suốt | Hình thao tác, chỉ một việc mỗi lượt, cách trở lại hướng dẫn |
| Đọc chậm, mắt yếu, ít tự tin hoặc đang căng thẳng | Có các yếu tố hỗ trợ, chưa được kiểm chứng | Chữ dễ đọc, ít lựa chọn, trợ giúp luôn tìm được, thử trên thiết bị thật |
| Chưa có thiết bị/mạng hoặc VNeID dùng được | Không thể giải quyết chỉ bằng website | Lối nhận hỗ trợ trực tiếp/qua điện thoại và bản danh sách giấy tờ dễ mang theo |
| Người thân đang giúp thao tác | Đã phân biệt người yêu cầu với người được làm thủ tục | Cần giải thích rõ giúp bấm máy khác với đứng tên/đại diện theo thủ tục |

Không suy ra khả năng dùng công nghệ từ tuổi. Tuyển người thử theo kỹ năng thực tế và nhu cầu trợ giúp.

## Những phần nên giữ

- Tên theo nhu cầu đời sống: “Làm giấy tờ cho con mới sinh”, “Thủ tục khi người thân qua đời”. Không bắt đầu bằng tên thủ tục dài.
- Hỏi từng câu; không yêu cầu người dân điền ngay biểu mẫu dài hoặc cung cấp căn cước trên website hướng dẫn.
- Có lựa chọn chưa rõ trong nhiều tình huống; nhánh đã đăng ký tránh hướng dẫn nộp mới trùng.
- Danh sách chuẩn bị thay đổi theo câu trả lời, có giải thích giấy tờ, ví dụ và hình minh họa. Đăng nhập có nhánh điện thoại, máy tính, chưa kích hoạt.
- Hướng dẫn có dấu hiệu “Bạn sẽ thấy”, điều kiện đánh dấu đã chuẩn bị và cách xử lý khi thiếu giấy.
- Có nhãn điều khiển, vùng thông báo lỗi, trạng thái bàn phím, nút chính tối thiểu 48 px theo CSS, vùng đáp án lớn; ngôn ngữ trang là tiếng Việt.
- Có lưu lựa chọn/danh sách trên trình duyệt và đường gọi hỗ trợ. Mở cổng không tự coi là đã nộp; không thu mật khẩu, OTP hoặc giấy tờ thật.

## Các điểm cần sửa, theo ưu tiên

P1: nên xử lý trước khi thử nghiệm khả năng tự làm với người ít kinh nghiệm. P2: hoàn thiện theo kết quả thử nghiệm. Không phải tất cả đều là lỗi phần mềm; có những điểm là khoảng trống nội dung hoặc vận hành.

| Mức | Phát hiện và căn cứ | Vì sao có thể gây khó | Hướng sửa / cách nghiệm thu |
|---|---|---|---|
| P1 | “Tiếp tục hướng dẫn” trên trang chủ vẫn gọi `route(p)` về bước trường hợp; `record()` không lưu bước/mục đang làm. `app.js:29,57,149`. | Người dùng tưởng mất tiến độ hoặc phải trả lời lại dù câu trả lời vẫn còn. | Lưu điểm đang xem và mục đang làm theo thủ tục; quay lại đúng điểm còn phù hợp. Nếu chưa trả lời đủ, mở câu chưa trả lời đầu tiên. Giữ nút sửa trường hợp riêng. |
| P1 | Dấu tích của mọi bước phía trước chỉ dựa vào `i < step`, không dựa vào hoàn thành. `app.js:72`. | Đi thẳng tới Theo dõi kết quả có thể làm Nộp hồ sơ hiện dấu tích dù chưa nộp. Lời giải thích bên dưới chưa loại bỏ hoàn toàn hiểu nhầm trực quan. | Dùng số bước và trạng thái “Đang xem”; nếu có “Đã chuẩn bị” phải dựa trên checklist. Không đánh dấu đã gửi/tiếp nhận khi chưa có dữ liệu chính thức. |
| P1 | Hướng dẫn đăng nhập điện thoại có 6 bước; bước xác thực bao gồm đọc thông báo, chuyển Tin nhắn/VNeID rồi trở lại. Cổng mở tab mới; chưa có hình thao tác chuyển tab. `huong-dan-chung.json`. | Người mới phải nhớ hướng dẫn khi rời trang, dễ không tìm được đường quay lại. | Mỗi màn hình chỉ dẫn một thao tác chính, có hình đúng thiết bị và “Bạn có thấy màn hình này không?”. Trước khi mở cổng, chỉ rõ cách quay lại. Kiểm tra thực tế riêng Android và iPhone; không hứa tự theo dõi thao tác ở cổng. |
| P1 | Mục tài khoản mặc định mở cả hướng dẫn dài ngay đầu checklist; các mục khác chỉ lộ tiêu đề và nút mở. `preparationItem()` và `tutorials.js`. | Người dân chưa kịp nắm tổng danh sách đã bị kéo vào đăng nhập; có thể nghĩ phải đăng nhập mới được đọc giấy tờ. | Hiện danh sách tóm tắt trước: tên giấy, lấy ở đâu, cần kiểm tra gì. Cho bắt đầu hướng dẫn ngay ở mục cần trợ giúp; vẫn xem được danh sách khi chưa có VNeID. |
| P1 | Phần cách điền chủ yếu giải thích nhóm thông tin; phần nộp vẫn có câu “điền tờ khai”, “đính kèm đúng tài liệu”, “gửi theo hướng dẫn”. Chưa kiểm chứng màn hình sau đăng nhập. | Chưa trả lời đủ “bấm nút nào, lấy số nào ở đâu, làm gì khi ô này báo lỗi”. | Mỗi trường quan trọng có tên ô thật, nguồn thông tin trên giấy, ví dụ giả, lỗi thường gặp và bước tiếp. Ghi ngày/phiên bản màn hình. Phần chưa được kiểm chứng phải ghi rõ; không dựng giao diện rồi gọi là ảnh cổng thật. |
| P1 | Hướng dẫn tệp quá lớn/sai định dạng mới nói dùng cách lưu/quét sang định dạng cổng chấp nhận. `chup-tai-giay-to`. | Người không biết tệp/PDF/dung lượng sẽ dừng ở chính chỗ này. | Thêm nhánh theo thông báo cụ thể: chưa chọn ảnh, không tìm thấy ảnh, sai loại tệp, vượt dung lượng. Hướng dẫn thao tác đã thử trên thiết bị; lấy giới hạn từ cổng thật, không bịa một giới hạn chung. |
| P1 | Khai tử hỏi người dân chọn mai táng/tử tuất và loại chế độ ngay trước khi họ được giải thích kỹ; lựa chọn chế độ chủ yếu dẫn tới hướng dẫn chung, riêng trợ giúp xã hội có lưu ý thêm. | Người không biết tên chính sách vẫn phải tự phân loại. Chọn được câu trả lời chưa bảo đảm biết nhánh cần nộp. | Giải thích ngắn ngay cạnh lựa chọn; giữ “Tôi chưa biết”. Dùng thông tin người dân nhận biết được như tên giấy/quyết định đang có để định hướng, sau khi biên tập với chuyên môn. Chưa đủ dữ kiện thì tạo việc cần hỏi rõ, không tự kết luận quyền lợi. |
| P1 | Khi chọn “Tôi chưa rõ” về đăng ký khai sinh/khai tử, trang chuyển sang hỗ trợ bằng chữ; hình phân biệt giấy tờ nằm ở bước chuẩn bị nên không xuất hiện tại điểm vướng. | Đúng là tránh nộp trùng, nhưng chưa giúp người dùng tự nhận biết giấy trước khi phải gọi. | Tại câu hỏi, cho xem hình có tên giấy được đánh dấu và cách phân biệt. Giữ đường nhờ kiểm tra nếu vẫn chưa rõ; không tự quyết giấy hợp lệ qua hình minh họa. |
| P1 | Hỗ trợ chủ yếu là đầu mối phường chung; chưa xác minh quầy, lịch và người hỗ trợ thực tế. Khi sang `#ho-tro`, ngữ cảnh đang vướng không được mang theo. | “Hỏi cơ quan có thẩm quyền” vẫn để người dân tự tìm đúng nơi và tự diễn đạt vấn đề. | Xác minh đầu mối vận hành; hiển thị “Bạn đang vướng ở…” kèm câu gợi ý để gọi và việc cần mang theo. Tạo đường trở lại đúng bước. Chưa xác minh thì nói đúng là đầu mối chỉ dẫn, không quảng bá thành đường dây chuyên xử lý hồ sơ. |
| P2 | Điện thoại mặc định được chọn trong hướng dẫn ngay cả khi xem bằng máy tính; nhánh máy tính dẫn người không dùng QR sang nhánh mang nhãn điện thoại. `tutorials.js`, hướng dẫn đăng nhập. | Nhãn theo thiết bị và cách đăng nhập bị trộn; tăng việc đọc để tìm đường phù hợp. | Chọn cách rõ ràng “Nhập tài khoản” / “Quét QR từ điện thoại”; giải thích QR cần màn hình khác. Giữ lựa chọn của người dùng khi quay lại. Không ép cách QR trên máy tính. |
| P2 | Bước Nộp hồ sơ liên kết về trang Chuẩn bị khi cần đăng nhập, không có đích tới đúng thao tác; nhánh hướng dẫn không được lưu. `app.js:133`, `tutorials.js`. | Người dùng phải tìm lại và đọc lại; quay về có thể thấy nhánh mặc định khác nhánh vừa chọn. | Liên kết sâu tới mục đăng nhập, giữ nhánh và bước hướng dẫn đang xem, đưa tiêu điểm đúng vùng. |
| P2 | Bước kết quả dùng cùng danh sách kết quả chung của thủ tục; khai sinh mô tả ở trang chủ gộp cả căn cước; người chọn phạm vi hẹp vẫn thấy nội dung rộng. | Các câu “có thể” giảm rủi ro nhưng người đọc lướt có thể hiểu tất cả đều cần làm/sẽ được nhận. | Hiển thị rõ phần cốt lõi và phần chỉ theo nhu cầu; kết quả nào phụ thuộc lựa chọn thì dùng điều kiện dữ liệu. Chưa biết chế độ thì ghi “cần xác định thêm”. |
| P2 | Lối mở kết hôn nằm ở trang chủ cùng các hướng dẫn nhưng chỉ đưa tới cổng. | Người dân có thể kỳ vọng đủ hướng dẫn giấy tờ như hai thủ tục đầu. | Gắn nhãn rõ ngay tại thẻ “Mở cổng — chưa có hướng dẫn từng bước”; không lấy số lối mở làm số bộ thủ tục đã biên soạn hoàn chỉnh. |
| P2 | Có thuật ngữ tab, OTP, QR, tệp, cơ quan hộ tịch, thẩm quyền, tử tuất. Giải thích đã có ở một số nơi nhưng chưa đồng đều. | Người mới phải hiểu thuật ngữ trước khi hiểu việc cần làm. | Dùng từ thường trước, thuật ngữ chính thức sau; giải thích ngay chỗ xuất hiện. Một câu một thao tác. Không chỉ gom tất cả vào trang từ điển riêng. |

## Khả năng đọc và tiếp cận

Mã nguồn có nhiều điểm tốt: phông dự phòng khi font mạng không tải, không khóa phóng to trong viewport, hình có mô tả, nhãn đáp án đầy đủ, nút chính đủ lớn theo CSS. Cần giữ các đặc tính này khi đơn giản hóa.

Đối chiếu tĩnh các màu khai báo cho thấy chữ `#62736c` trên trắng khoảng 5,01:1, trên nền `#f4f9f6` khoảng 4,71:1; chữ xanh `#126449` trên trắng khoảng 7,13:1. Tuy nhiên placeholder tìm kiếm `#78877f` trên trắng khoảng 3,77:1, thấp hơn mục tiêu 4,5:1 cho chữ thường. Cần làm đậm màu và kiểm tra trạng thái hiển thị thực tế; không coi vài cặp màu này là kiểm chứng toàn trang. [W3C: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Trên mobile, liên kết trợ giúp ở sidebar bị ẩn; trợ giúp ở header vẫn có nhưng header không cố định, nên sau khi cuộn dài có thể khó tìm. Nên có trợ giúp tại thao tác đang vướng, tránh thanh cố định che nội dung hoặc bàn phím. Cỡ chữ nội dung chính 16 px là nền tảng, cần thử phóng to 200%, vùng nhìn 320 CSS px, chữ dài, bàn phím và trình đọc màn hình. Mục tiêu vùng chạm 44–48 px là lựa chọn thiết kế ưu tiên cho dự án; không nhầm với mức tối thiểu WCAG 2.2 là 24 CSS px có ngoại lệ. [W3C: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Hành trình đề xuất cho người lần đầu

1. Chọn việc cần làm bằng tên quen thuộc.
2. Trả lời câu hỏi thật sự làm thay đổi hướng dẫn; có hình/giải thích và lối chưa biết.
3. Xem tổng danh sách của riêng mình. Mỗi mục có trạng thái “Chưa chuẩn bị / Đã chuẩn bị / Cần hỏi thêm”; trạng thái là tự ghi nhớ, không phải xác nhận của cơ quan.
4. Bấm một mục để được hướng dẫn một thao tác mỗi lượt. Luôn có quay lại danh sách để người đã biết không phải đi qua tất cả màn hình nhỏ.
5. Trước khi sang cổng, xem tóm tắt việc còn thiếu, nơi sẽ mở và cách quay về. Có thể tiếp tục chuẩn bị giấy dù chưa đăng nhập được.
6. Xem chỉ dẫn kê khai theo màn hình đã kiểm chứng. Người dân tự thao tác và xác thực trên cổng chính thức.
7. Sau khi người dân cho biết đã gửi, hướng dẫn kiểm tra thông báo/mã hồ sơ; không tự chuyển trạng thái thành đã nộp hoặc đã tiếp nhận chỉ vì bấm mở cổng.

Ví dụ một thẻ thao tác: “Tìm Giấy chứng sinh” → một hình đánh dấu đúng tên giấy → “Lấy tập giấy bệnh viện giao khi ra viện, tìm tờ có dòng Giấy chứng sinh” → hai lựa chọn “Tôi tìm thấy rồi” / “Tôi chưa tìm thấy”. Lựa chọn thứ hai đi thẳng tới cách hỏi nơi cấp; không chỉ lặp lại yêu cầu phải có giấy. Đây là đề xuất, chưa triển khai trong đợt rà soát này.

Không nên thêm chatbot, video tự chạy hoặc nhiều chế độ ngay để giải quyết lượng chữ. Nếu bổ sung đọc hướng dẫn thành tiếng, để người dùng chủ động bật/tắt, luôn có nội dung chữ và kiểm tra giọng tiếng Việt thực tế. Hỗ trợ trực tiếp vẫn cần cho người không có khả năng tự dùng dịch vụ số. [GOV.UK: Assisted digital support](https://www.gov.uk/service-manual/helping-people-to-use-your-service/assisted-digital-support-introduction).

## Kế hoạch kiểm chứng với người dân

Đề xuất hai vòng, mỗi vòng khoảng 5–6 người, nhằm phát hiện và sửa vướng mắc; không dùng mẫu nhỏ này để suy ra tỷ lệ thành công của toàn phường. Có người ít kinh nghiệm, người đọc chậm/mắt yếu, người giúp người thân, người dùng một điện thoại và người đã quen điện thoại để so sánh. Dùng cả Android và iPhone; người dùng chọn thiết bị quen thuộc.

Không bắt người thử dùng giấy tờ hay tài khoản thật. Chuẩn bị dữ liệu giả và mô phỏng những màn hình sau đăng nhập đã được đối chiếu, ghi rõ là mô phỏng. Việc không thử giao dịch thật vẫn là giới hạn riêng của nghiên cứu.

| Nhiệm vụ | Điều cần quan sát |
|---|---|
| Gia đình có con mới sinh, chưa biết bắt đầu | Có tự chọn đúng bộ hướng dẫn và biết bước kế tiếp không? |
| Đang cầm giấy chứng sinh nhưng chưa có giấy khai sinh | Có phân biệt được hai giấy và tránh chọn nhầm đã đăng ký không? |
| Chưa có VNeID hoặc chỉ có một điện thoại | Có tìm được đường hỗ trợ và tránh cố quét QR trên chính màn hình đó không? |
| Ảnh giấy bị nhòe / tệp không được nhận | Có biết sửa thao tác nào mà không cần người quan sát chỉ tay không? |
| Người thân qua đời, chưa biết chế độ đang hưởng | Có chọn được chưa rõ và biết cần hỏi/chuẩn bị thông tin nào không? |
| Mở cổng rồi quay về hướng dẫn | Có tìm lại đúng bước, giữ nhánh đang dùng và hiểu chưa gửi hồ sơ không? |
| Dừng giữa chừng, trở về trang chủ rồi tiếp tục | Có trở lại đúng việc và hiểu tiến độ còn lưu không? |
| Xem ví dụ đã gửi thành công, bản nháp và yêu cầu bổ sung | Có phân biệt được các trạng thái và biết hành động tiếp theo không? |

Ghi thời gian tới thao tác đúng đầu tiên, vị trí dừng/đọc lại, số lần cần người quan sát nhắc, lỗi chọn nhầm và khả năng tự sửa. Sau mỗi nhiệm vụ hỏi “Bây giờ cô/chú/anh/chị nghĩ mình đã làm xong việc gì?” để kiểm tra hiểu đúng, không chỉ hỏi giao diện có đẹp/dễ không.

Tiêu chí đề xuất cho vòng thử tiếp theo: không có nhầm lẫn nghiêm trọng giữa mở cổng và đã gửi; người tham gia biết tìm hỗ trợ khi không tự làm được; các vướng mắc lặp lại ở bước thiết yếu phải được sửa và thử lại. Báo kết quả theo từng nhóm/nhiệm vụ, không đưa điểm phần trăm đẹp mắt khi chưa có dữ liệu.

## Thứ tự thực hiện đề nghị

1. Sửa tiếp tục đúng điểm dừng và bỏ dấu tích hoàn thành suy từ vị trí bước; làm rõ phạm vi kết quả/lối mở nhanh.
2. Làm bản tóm tắt checklist, hướng dẫn mỗi lượt một việc và trợ giúp giữ ngữ cảnh; bổ sung hình phân biệt giấy ngay tại câu hỏi.
3. Đối chiếu thao tác thật trên từng loại thiết bị, bổ sung minh họa chuyển tab/đăng nhập/đính kèm, biên tập cách điền với cán bộ chuyên môn.
4. Xác minh đầu mối hỗ trợ và thử với người dân; sửa theo quan sát trước khi mở rộng nhiều thủ tục.

Nội dung hướng dẫn mới vẫn nên nằm trong dữ liệu dùng chung, không tạo một giao diện riêng cho mỗi thủ tục. Cần có người chịu trách nhiệm nội dung và mốc kiểm tra lại khi cổng đổi; đường dẫn hợp lệ chưa chứng minh ảnh hay chỉ dẫn còn đúng.

## Cơ sở đối chiếu thiết kế

- Hướng dẫn đặt cạnh thao tác, chia bước và dùng ví dụ/hình: [W3C Cognitive Accessibility](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/).
- Bắt đầu bằng một việc trên mỗi trang, sau đó điều chỉnh theo nghiên cứu: [GOV.UK Structuring forms](https://www.gov.uk/service-manual/design/form-structure).
- Danh sách công việc cần thể hiện đúng việc còn làm và trạng thái: [GOV.UK Complete multiple tasks](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/).

Các tài liệu trên dùng làm cơ sở thiết kế, không phải quy định pháp lý bắt buộc áp dụng cho thủ tục Việt Nam.
