# Đưa Cẩm Nang Số lên GitHub Pages

Đã chuẩn bị cấu hình, chưa tạo repository, gửi mã nguồn hay xuất bản website. Các lệnh dưới đây chạy trong PowerShell. Dự án không cần cài thư viện hay chạy build; GitHub Pages xuất bản nội dung thư mục `dist`.

## 1. Tạo kho mã nguồn

1. Đăng nhập GitHub, mở https://github.com/new.
2. Đặt Repository name là `cam-nang-so`.
3. Để dùng GitHub Pages với tài khoản GitHub Free, chọn Public. Mã nguồn đẩy lên kho và website sẽ công khai. Nếu cần giữ mã nguồn riêng tư, kiểm tra gói GitHub hỗ trợ Pages cho kho Private trước khi chọn.
4. Không chọn tạo README, .gitignore hoặc license ở bước này vì dự án trên máy đã có các tệp cần thiết.
5. Bấm Create repository. Sao chép URL HTTPS của repository.

## 2. Gửi dự án lên GitHub lần đầu

Thay `TEN_TAI_KHOAN` bằng tên tài khoản thực tế. Chạy từng dòng:

```powershell
cd D:\CamNangSo\cam-nang-so
git init -b main
git add .
git status --short
git commit -m "Initial Cam Nang So website"
git remote add origin https://github.com/TEN_TAI_KHOAN/cam-nang-so.git
git push -u origin main
```

Trước khi commit, danh sách `git status` cần có `.github/workflows/pages.yml`, `dist`, `docs`, `scripts`, `tests`, `package.json`, README và .gitignore. Không có `.openai`, `tmp`, `.env`, nhật ký hay hồ sơ cá nhân. Không thêm tệp chứa tài khoản, mật khẩu hoặc hồ sơ thật vào dự án.

Nếu `git commit` báo chưa có tên/email, cấu hình cho riêng dự án rồi chạy lại lệnh commit:

```powershell
git config user.name "Tên của bạn"
git config user.email "EMAIL_COMMIT_CUA_BAN"
```

Có thể lấy email riêng tư dạng noreply của GitHub tại Settings → Emails trong tài khoản. Dùng đúng địa chỉ GitHub cung cấp.

Khi push, hoàn tất đăng nhập GitHub trong trình duyệt nếu Git Credential Manager mở cửa sổ xác thực. Không gửi mật khẩu, mã OTP hoặc token vào cuộc trò chuyện. Nếu máy chưa có cơ chế đăng nhập Git, dùng hướng dẫn HTTPS chính thức của GitHub ở cuối tài liệu để thiết lập.

## 3. Bật website

1. Mở repository `cam-nang-so` trên GitHub.
2. Chọn Settings → Pages.
3. Trong Build and deployment → Source, chọn GitHub Actions. Không chọn Deploy from a branch: website của dự án nằm trong `dist` và đã có workflow đóng gói riêng.
4. Mở Actions → Publish Cam Nang So → Run workflow → chọn main → Run workflow. Nếu lượt push đầu tiên báo lỗi vì Pages chưa bật, chạy lại sau bước 3.
5. Đợi hai công việc `check` và `deploy` có dấu tích xanh. Mở Settings → Pages để lấy địa chỉ website thực tế.

Với GitHub.com thông thường và tên kho ở trên, địa chỉ có dạng:

```text
https://TEN_TAI_KHOAN.github.io/cam-nang-so/
```

Tệp workflow chỉ đưa `dist` vào website. Mã nguồn, công cụ và tài liệu khác vẫn xem được trong repository nếu chọn Public. Trên website, kiểm tra cả khai sinh/khai tử, mở từng trang mẫu, tải PDF và mở cổng dịch vụ công. Tiến độ lưu trên localhost không tự chuyển sang tên miền GitHub Pages; người dân sẽ có tiến độ riêng trong trình duyệt trên địa chỉ mới.

## 4. Cập nhật về sau

Sửa nội dung trên máy rồi chạy:

```powershell
cd D:\CamNangSo\cam-nang-so
npm.cmd run check
git add .
git status --short
git commit -m "Update procedure guidance"
git push
```

Chỉ commit/push khi kiểm tra đạt và đã xem danh sách thay đổi. Mỗi push vào `main` tự chạy kiểm tra rồi xuất bản. Nếu kiểm tra thất bại, phiên bản mới không được triển khai; xem lỗi tại Actions. Website đã xuất bản hoạt động khi máy cá nhân tắt.

## Nguồn hướng dẫn

- [GitHub Pages là gì](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Chọn nguồn xuất bản](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Workflow GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Xác thực Git với GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)
