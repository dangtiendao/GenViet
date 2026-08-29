# Luồng Trải nghiệm: Xác thực & Đăng nhập (Authentication Flow)

- **Mã Flow:** `FLOW-AUTH-01`
- **Mã Màn hình liên quan:** `SCR-001` (Login), `SCR-002` (Sign-up), `SCR-003` (Forgot Password), `SCR-004` (Reset Password)
- **Actor:** Người dùng vãng lai / Người quản trị dòng họ
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Đăng nhập & Xác thực (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Mở Ứng dụng]) --> CheckAuth{Đã đăng nhập?}
    CheckAuth -->|Đã có phiên hợp lệ| Dashboard[Chuyển tới Trang chủ / Cây]
    CheckAuth -->|Chưa đăng nhập| LoginForm[Hiển thị Màn hình Đăng nhập\nSCR-001]

    LoginForm --> UserAction{Người dùng chọn}
    UserAction -->|Nhập Email & Mật khẩu| SubmitLogin[Bấm nút 'Đăng nhập']
    UserAction -->|Chưa có tài khoản| GoSignUp[Bấm 'Đăng ký tài khoản'\nSCR-002]
    UserAction -->|Quên mật khẩu| GoForgot[Bấm 'Quên mật khẩu?'\nSCR-003]

    SubmitLogin --> Validating[Kiểm tra tính hợp lệ Form]
    Validating -->|Sai định dạng Email / Trống| ShowInlineErr[Báo lỗi đỏ ngay dưới ô nhập]
    ShowInlineErr --> LoginForm

    Validating -->|Hợp lệ| SendingAuth[Gửi yêu cầu xác thực tới Supabase]
    SendingAuth --> AuthResult{Kết quả xác thực}
    AuthResult -->|Thành công| SetSession[Lưu phiên đăng nhập an toàn]
    SetSession --> RedirectPrev[Chuyển hướng về trang trước đó hoặc Dashboard]

    AuthResult -->|Sai Email hoặc Mật khẩu| ShowAuthErr[Báo lỗi: 'Email hoặc mật khẩu không chính xác']
    ShowAuthErr --> LoginForm

    AuthResult -->|Lỗi mạng / Server| ShowNetErr[Báo lỗi: 'Không thể kết nối máy chủ. Vui lòng thử lại']
    ShowNetErr --> LoginForm

    GoForgot --> InputForgotEmail[Nhập Email nhận link khôi phục]
    InputForgotEmail --> SubmitForgot[Gửi link đặt lại mật khẩu]
    SubmitForgot --> ShowSuccessForgot[Thông báo: 'Đã gửi hướng dẫn tới email của bạn']
```

---

## 2. Đặc tả Chi tiết Các Bước Tương tác

### 2.1. Đường dẫn Chính (Happy Path)
1. Người dùng mở đường dẫn `genviet.app` $\rightarrow$ Hệ thống kiểm tra phiên $\rightarrow$ Nếu chưa đăng nhập, chuyển tới `SCR-001` (`/login`).
2. Người dùng nhập `Email` (có gợi ý bàn phím email trên mobile) và `Mật khẩu`.
3. Bấm **"Đăng nhập"** $\rightarrow$ Nút chuyển sang trạng thái Loading (Spinner nhỏ, vô hiệu hóa click lặp).
4. Hệ thống xác thực thành công $\rightarrow$ Chuyển tiếp ngay tới Dashboard `SCR-005` hoặc Cây gia phả đang mở gần nhất.

### 2.2. Xử lý Lỗi & Khôi phục (Error & Recovery Path)
- **Sai thông tin đăng nhập:** Hiển thị thông báo thân thiện: *"Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại hoặc bấm Quên mật khẩu."* (Không để lộ email có tồn tại hay không).
- **Mất kết nối mạng:** Hiển thị Toast cảnh báo màu vàng kèm nút *"Thử lại"*.
- **Phiên hết hạn (Session Expired):** Tự động mở modal đăng nhập lại nhẹ nhàng, giữ nguyên dữ liệu form chưa kịp lưu nếu có thể.

### 2.3. Trải nghiệm trên Mobile vs Desktop
- **Mobile ($375\text{px}$):** Form full-width, nút Đăng nhập to $\ge 48\text{px}$, bật `autocomplete="email"`, tự động cuộn màn hình khi bàn phím ảo xuất hiện.
- **Desktop ($1440\text{px}$):** Form căn giữa màn hình với hình ảnh minh họa cây gia phả mang phong cách văn hóa truyền thống ở nửa bên trái.
