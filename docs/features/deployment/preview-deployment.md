# Hợp Đồng Triển Khai Preview (Preview Deployment Contract - P24-T02)

## 1. Nguyên Tắc An Toàn Cho Môi Trường Preview
1. **Phân lập dữ liệu:** Preview Deployment tuyệt đối không được phép tự động chạy migrations hoặc can thiệp phá hủy dữ liệu của cơ sở dữ liệu Production.
2. **Không chạy Heartbeat kỹ thuật:** Các tác vụ chạy ngầm định kỳ (Heartbeat, Vệ sinh dữ liệu) chỉ được kích hoạt trên môi trường Production.
3. **URL tự động:** Mỗi bản build Preview được gán một URL duy nhất theo định dạng `https://genviet-git-<branch>-<username>.vercel.app`.
4. **Không index:** Tự động gửi header `X-Robots-Tag: noindex` để ngăn chặn công cụ tìm kiếm index các trang Preview thử nghiệm.
