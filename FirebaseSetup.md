# Hướng dẫn Kết nối Firebase Realtime Database cho Ứng dụng Quản lý Bệnh viện

Để ứng dụng này hoạt động với cơ sở dữ liệu thời gian thực, bạn cần kết nối nó với một dự án Firebase của riêng bạn. Hãy làm theo các bước dưới đây.

## Bước 1: Tạo một Dự án Firebase

1.  Truy cập [Bảng điều khiển Firebase](https://console.firebase.google.com/).
2.  Nhấp vào **"Thêm dự án"** (Add project).
3.  Đặt tên cho dự án của bạn (ví dụ: `smart-hospital-app`) và làm theo các bước trên màn hình. Bạn có thể bỏ qua việc bật Google Analytics cho dự án này.
4.  Sau khi dự án được tạo, bạn sẽ được chuyển đến trang tổng quan của dự án.

## Bước 2: Tạo một Ứng dụng Web

1.  Trên trang tổng quan dự án, nhấp vào biểu tượng Web (`</>`).
2.  Đặt tên cho ứng dụng của bạn (ví dụ: `hospital-web-ui`).
3.  Nhấp vào **"Đăng ký ứng dụng"** (Register app).
4.  Firebase sẽ cung cấp cho bạn một đối tượng cấu hình `firebaseConfig`. **Sao chép đối tượng JavaScript này.** Nó sẽ trông giống như sau:

    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef123456"
    };
    ```

## Bước 3: Cập nhật Cấu hình trong Ứng dụng

1.  Mở tệp `firebaseConfig.ts` trong dự án của bạn.
2.  Dán đối tượng `firebaseConfig` bạn vừa sao chép từ Firebase để thay thế cho cấu hình giữ chỗ hiện có.
3.  **Quan trọng**: Firebase có thể không cung cấp `databaseURL` trong cấu hình mặc định. Bạn cần thêm nó vào. Quay lại Bảng điều khiển Firebase, vào phần **Build > Realtime Database**. URL sẽ hiển thị ở đầu trang (ví dụ: `https://your-project-id-default-rtdb.firebaseio.com`). Sao chép và thêm nó vào đối tượng `firebaseConfig` của bạn.

    ```javascript
    const firebaseConfig = {
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      // ... các khóa khác
      databaseURL: "https://your-project-id-default-rtdb.firebaseio.com" // <== THÊM DÒNG NÀY
    };
    ```
## Bước 4: Thiết lập Realtime Database

1.  Trong menu bên trái của Bảng điều khiển Firebase, nhấp vào **"Build"** > **"Realtime Database"**.
2.  Nhấp vào **"Tạo cơ sở dữ liệu"** (Create database).
3.  Chọn một vị trí cho cơ sở dữ liệu của bạn (chọn vị trí gần bạn nhất).
4.  Chọn bắt đầu ở **chế độ kiểm thử** (Start in test mode). Điều này cho phép ứng dụng đọc và ghi dữ liệu mà không cần xác thực (chỉ dành cho mục đích phát triển).
5.  Nhấp vào **"Bật"** (Enable).

## Bước 5: Nhập Dữ liệu Mẫu (Quan trọng)

Để ứng dụng có dữ liệu ban đầu, bạn sẽ nhập một tệp JSON.

1.  Trong trang Realtime Database, nhấp vào biểu tượng ba chấm (`⋮`) ở góc trên bên phải của trình xem dữ liệu.
2.  Chọn **"Nhập JSON"** (Import JSON).
3.  Nhấp vào **"Duyệt qua"** (Browse) và chọn tệp JSON chứa dữ liệu mẫu của bạn.
    *(Lưu ý: Bạn có thể sử dụng tệp JSON đã được cung cấp trước đó, chứa toàn bộ dữ liệu mẫu từ `patients` đến `telemedicineSessions`).*
4.  Nhấp vào nút **"Nhập"** (Import).

Sau khi nhập thành công, bạn sẽ thấy cấu trúc dữ liệu xuất hiện trong cơ sở dữ liệu của mình.

Bây giờ, ứng dụng của bạn đã được kết nối với Firebase Realtime Database. Chạy lại ứng dụng và bạn sẽ thấy danh sách bệnh nhân được tải từ cơ sở dữ liệu mới của mình.