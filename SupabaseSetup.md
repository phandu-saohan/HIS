# Hướng dẫn Cài đặt Supabase

Để ứng dụng kết nối được với Supabase, bạn cần làm theo các bước sau:

## Bước 1: Tạo dự án Supabase
1. Truy cập [Supabase](https://supabase.com/) và tạo một tài khoản hoặc đăng nhập.
2. Tạo một dự án (Project) mới.
3. Chờ vài phút để cơ sở dữ liệu được khởi tạo.

## Bước 2: Lấy thông tin kết nối
1. Trong Dashboard của dự án, vào phần **Settings** (biểu tượng bánh răng) -> **API**.
2. Copy giá trị của **Project URL** và **anon public key**.

## Bước 3: Cấu hình biến môi trường
1. Trong thư mục gốc của dự án, tạo một file có tên `.env.local` (nếu chưa có).
2. Thêm các biến môi trường sau vào file `.env.local`:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
```

## Bước 4: Tạo bảng dữ liệu (Table)
1. Trong Dashboard của dự án, vào phần **Table Editor** -> **Create a new table**.
2. Đặt tên bảng là `patients`.
3. Bỏ chọn "Enable Row Level Security (RLS)" nếu bạn muốn kiểm thử nhanh (hoặc cấu hình RLS policy cho phép public read/write).
4. Thêm các cột tương ứng với kiểu dữ liệu `Patient` trong ứng dụng (id, name, dateOfBirth, gender, phoneNumber, nationalId, address, occupation, patientType, admissionDate, admittingDepartment, doctor, assignedDoctorId, reasonForVisit, avatar, emergencyContact, healthMetrics). 
   *Lưu ý: Bạn có thể lưu `emergencyContact` và `healthMetrics` dưới dạng kiểu `jsonb`.*

## Xử lý lỗi kết nối
Nếu ứng dụng không thể kết nối đến Supabase (do sai URL, Key hoặc lỗi mạng), hệ thống sẽ tự động chuyển sang sử dụng dữ liệu mẫu (mock data) để đảm bảo trải nghiệm không bị gián đoạn.
