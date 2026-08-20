# 🌸 Little Days V2 — Hành Trình Tình Yêu & Thị Trấn Đôi

**Little Days V2** là một ứng dụng đồng hành đôi lứa kết hợp game phiêu lưu thế giới mở ấm áp lấy cảm hứng từ vũ trụ **Chiikawa** đáng yêu. Ứng dụng giúp các cặp đôi cùng nhau vun đắp tình yêu, lưu giữ kỷ niệm thiêng liêng, theo dõi sức khỏe và trải nghiệm chiến dịch giải đố 30 màn chơi từ Ngôi Nhà Nhỏ đến bãi biển hoàng hôn Nha Trang.

---

## 🌟 Điểm Nhấn Tính Năng (V2 Features)

### 🗺️ 1. Bản Đồ Thị Trấn Sống Động & 13 Công Trình Độc Đáo
- **13 Công trình nội thất chi tiết**: Ngôi Nhà Nhỏ (Cottage), Quảng Trường Nhiệm Vụ, Thư Viện Kỷ Niệm, Nhà Hàng Ánh Nến, Phòng Khám Sức Khỏe, Hòm Thư Tình, Bến Tàu Du Thuyền Nha Trang...
- **Hệ thống Ngày/Đêm & Thời tiết động**: Chuyển giao mượt mà giữa Bình minh, Ban ngày, Hoàng hôn và Ban đêm với ánh đèn vàng ấm áp.

### 🎭 2. Hệ Thống Nhân Vật Chiikawa & Giọng Nói Tương Tác
- Sử dụng mô hình anime chính thức: **Chiikawa**, **Usagi**, **Hachiware**, **Momonga**, **Kurimanju**, và **Rakko**.
- **14 Trạng Thái Cảm Xúc & 12 Kỹ Năng Đôi**: Linh vật phản ứng khi chạm, nhảy múa cổ vũ, hò reo *"Yaha!"* và hỗ trợ trong màn chơi giải đố.
- **Hộp Phụ Đề Nổi (Audio Subtitle Toast)**: Hiển thị lời thoại tiếng Việt kèm âm thanh Web Audio sống động.

### 🧩 3. Chiến Dịch Giải Đố 30 Màn Chơi & 3 Chương Truyện
- **Chương 1: Ngôi Nhà Nhỏ (Màn 1–10)**: Làm quen xếp hình Match-3, tên lửa cà rốt, cầu vồng và màn 10 Miracle Finale.
- **Chương 2: Xây Dựng Thị Trấn (Màn 11–20)**: Thu thập vật liệu nâng cấp các địa danh thị trấn.
- **Chương 3: Chuyến Đi Nha Trang (Màn 21–30)**: Chuyến bay Cam Ranh, lặn san hô Hòn Mun, tắm bùn khoáng, tiệc hải sản và Màn 30 Grand Sunset Finale.

### 🪙 4. Nền Kinh Tế 4 Tiền Tệ & Nâng Cấp Công Trình
- **4 Loại Tiền Tệ Ảo**: Tim (💖), Sao (⭐), Xu (🪙), và Vé Du Lịch (🎫) — **100% miễn phí, không nạp tiền, không quảng cáo**.
- **Nâng Cấp 3 Bậc (Tier 1 ➔ Tier 3)**: Mở rộng tính năng và diện mạo hoàng kim cho toàn bộ công trình trong thị trấn.

### 💌 5. Đời Sống Đôi & Chế Độ Vô Tận (Endless Life)
- **Câu Hỏi Đôi Hàng Ngày**: Hơn 30 câu hỏi tâm tình luân phiên mỗi ngày, lưu câu trả lời kỷ niệm (+15 Tim).
- **Hòm Thư Tình & Viên Nang Thời Gian**: Viết thư tay mở phong bì sáp và hẹn ước mở khóa viên nang vào ngày sinh nhật/kỷ niệm.
- **Vòng Quay Hẹn Hò & Ăn Gì**: Gợi ý địa điểm và ẩm thực Việt Nam theo tâm trạng và không gian.
- **Danh Sách Ước Nguyện Đôi (Bucket List)**: Đánh dấu ước mơ đôi kèm hiệu ứng pháo hoa chúc mừng.

### 🔒 6. Bảo Mật Riêng Tư Tuyệt Đối (Offline-First)
- **100% Client-Side**: Toàn bộ nhật ký, ảnh, hồ sơ và chu kỳ sức khỏe lưu trữ an toàn trong máy của cặp đôi, không gửi lên bất kỳ máy chủ nào.
- **Sao Lưu Mã Hóa AES-GCM 256-Bit**: Xuất/nhập file sao lưu có mật khẩu bảo vệ bằng Web Crypto API.
- **Két Sắt Mã PIN 4 Số**: Bảo vệ các thông tin sức khỏe và nhật ký riêng tư.
- **Di Trú Tự Động V1 ➔ V2**: Nhận diện và chuyển đổi an toàn toàn bộ dữ liệu phiên bản cũ không mất mát.

---

## 🚀 Chạy Ứng Dụng Cục Bộ (Local Development)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy dev server
npm run dev

# 3. Chạy toàn bộ 16 bộ kiểm thử tự động (100% pass)
npm run test

# 4. Build sản phẩm tối ưu hóa
npm run build
```

---

## 🌐 Triển Khai GitHub Pages (Production Hosting)

Dự án được cấu hình sẵn với đường dẫn tĩnh tương đối (`base: './'`) trong `vite.config.ts` và workflow tự động `.github/workflows/deploy-pages.yml`.

1. Đẩy code lên nhánh `main` của GitHub.
2. Trong phần **Settings** ➔ **Pages** của repository, chọn **Source** là **GitHub Actions**.
3. Ứng dụng sẽ tự động build và xuất bản lên GitHub Pages trong vòng 1-2 phút!

---

## 📜 Tuyên Bố Bản Quyền & Miễn Trừ Y Tế (Disclaimer)
- **Fan Project Disclaimer**: *Little Days V2 là một ứng dụng phi thương mại dành cho cặp đôi, lấy cảm hứng từ nhân vật hoạt hình Chiikawa. Mọi quyền tác quyền hình ảnh và nhãn hiệu nhân vật Chiikawa thuộc về tác giả Nagano và Chiikawa Committee.*
- **Medical Disclaimer**: *Mọi dự đoán chu kỳ sức khỏe và chỉ số sinh học trong ứng dụng là ước tính cá nhân phục vụ giao tiếp đôi lứa, không cấu thành lời khuyên hay chẩn đoán y khoa chuyên nghiệp.*
