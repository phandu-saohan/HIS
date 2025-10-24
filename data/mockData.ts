import { Patient, EMRVisit, EMRDiagnosis, AuditLog, Department, ServiceItem, OutpatientVisit, LabTest, RadiologyExam, InpatientRecord, FinancialRecord, Medication, MedicationCategory, Supplier, Appointment, TelemedicineSession } from '../types';

export const mockDepartments: Omit<Department, 'rooms'>[] = [
    { id: 'DEPT01', name: 'Khoa Tim mạch', head: 'Dr. Emily Carter' },
    { id: 'DEPT02', name: 'Khoa Thần kinh', head: 'Dr. John Smith' },
    { id: 'DEPT03', name: 'Khoa Khám bệnh', head: 'Dr. Michael Chen' },
    { id: 'DEPT04', name: 'Khoa Chỉnh hình', head: 'Dr. Sarah Lee' },
    { id: 'DEPT05', name: 'Khoa Hô hấp', head: 'Dr. David Brown' },
];

export const mockDoctors = [
  { id: 'S001', name: 'Dr. Emily Carter', departmentId: 'DEPT01' },
  { id: 'S002', name: 'Dr. John Smith', departmentId: 'DEPT02' },
  { id: 'S003', name: 'Dr. David Brown', departmentId: 'DEPT05' },
  { id: 'S004', name: 'Dr. Michael Chen', departmentId: 'DEPT03' },
  { id: 'S005', name: 'Dr. Sarah Lee', departmentId: 'DEPT04' },
];

export const mockAppointments: Appointment[] = [
  { id: 'A001', patientName: 'Nguyễn Văn An', doctorName: 'Dr. Emily Carter', doctorId: 'S001', date: '2024-07-29', time: '10:00 AM', reason: 'Tái khám tim' },
  { id: 'A002', patientName: 'Phạm Thị Dung', doctorName: 'Dr. Michael Chen', doctorId: 'S004', date: '2024-07-29', time: '02:00 PM', reason: 'Tư vấn đau nửa đầu' },
  { id: 'A003', patientName: 'Trần Thị Bình', doctorName: 'Dr. John Smith', doctorId: 'S002', date: '2024-07-30', time: '11:00 AM', reason: 'Kiểm tra phổi' },
  { id: 'A004', patientName: 'Lê Văn Cường', doctorName: 'Dr. Sarah Lee', doctorId: 'S005', date: '2024-08-01', time: '09:00 AM', reason: 'Tháo bột' },
];

export const mockTelemedicineSessions: TelemedicineSession[] = [
    { id: 'TELE01', patientName: 'Trần Thị Bình', doctorName: 'Dr. John Smith', startTime: '11:00 AM', status: 'Sắp diễn ra' },
    { id: 'TELE02', patientName: 'Hoàng Văn Em', doctorName: 'Dr. Emily Carter', startTime: '02:30 PM', status: 'Sắp diễn ra' },
    { id: 'TELE03', patientName: 'Nguyễn Văn An', doctorName: 'Dr. Emily Carter', startTime: '2024-07-28 10:00 AM', status: 'Đã hoàn thành' },
    { id: 'TELE04', patientName: 'Phạm Thị Dung', doctorName: 'Dr. Michael Chen', startTime: '2024-07-27 03:00 PM', status: 'Đã hoàn thành' },
    { id: 'TELE05', patientName: 'Lê Văn Cường', doctorName: 'Dr. Sarah Lee', startTime: '2024-07-27 09:00 AM', status: 'Đã hủy' },
];

export const mockPatients: Patient[] = [
    { 
        id: 'P001', name: 'Nguyễn Văn An', dateOfBirth: '1985-05-15', gender: 'Nam', phoneNumber: '0901234567', nationalId: '012345678901', healthInsuranceId: 'DN4012345678901', address: '123 Đường A, Quận 1, TP.HCM', occupation: 'Kỹ sư', emergencyContact: { name: 'Trần Thị B', phone: '0909876543' }, patientType: 'BHYT', admissionDate: '2024-07-29', admittingDepartment: 'DEPT01', doctor: 'Dr. Emily Carter', assignedDoctorId: 'S001', reasonForVisit: 'Đau ngực, khó thở', avatar: 'https://picsum.photos/id/1025/40/40',
        healthMetrics: [
            { date: '2024-07-29', bp_systolic: 140, bp_diastolic: 90, heart_rate: 95, temperature: 37.2, spo2: 96 },
            { date: '2024-07-30', bp_systolic: 130, bp_diastolic: 85, heart_rate: 80, temperature: 37.0, spo2: 98 },
            { date: '2024-07-31', bp_systolic: 125, bp_diastolic: 80, heart_rate: 75, temperature: 36.8, spo2: 99 },
            { date: '2024-08-01', bp_systolic: 122, bp_diastolic: 80, heart_rate: 72, temperature: 36.9, spo2: 99 },
        ]
    },
    { 
        id: 'P002', name: 'Trần Thị Bình', dateOfBirth: '1992-11-30', gender: 'Nữ', phoneNumber: '0912345678', nationalId: '098765432109', healthInsuranceId: 'HN4019876543210', address: '456 Đường B, Quận Hai Bà Trưng, Hà Nội', occupation: 'Giáo viên', emergencyContact: { name: 'Nguyễn Văn A', phone: '0918765432' }, patientType: 'Viện phí', admissionDate: '2024-07-29', admittingDepartment: 'DEPT05', doctor: 'Dr. David Brown', assignedDoctorId: 'S003', reasonForVisit: 'Ho kéo dài, sốt nhẹ', avatar: 'https://picsum.photos/id/1026/40/40',
        healthMetrics: [
            { date: '2024-07-29', bp_systolic: 110, bp_diastolic: 70, heart_rate: 88, temperature: 37.8, spo2: 98 },
            { date: '2024-07-30', bp_systolic: 115, bp_diastolic: 75, heart_rate: 82, temperature: 37.1, spo2: 98 },
        ]
    },
    { 
        id: 'P003', name: 'Lê Văn Cường', dateOfBirth: '1978-02-20', gender: 'Nam', phoneNumber: '0987654321', nationalId: '023456789012', healthInsuranceId: 'DN4023456789012', address: '789 Đường C, Quận Sơn Trà, Đà Nẵng', occupation: 'Lái xe', emergencyContact: { name: 'Lê Thị D', phone: '0986543210' }, patientType: 'BHYT', admissionDate: '2024-07-28', admittingDepartment: 'DEPT04', doctor: 'Dr. Sarah Lee', assignedDoctorId: 'S005', reasonForVisit: 'Đau đầu gối sau tai nạn', avatar: 'https://picsum.photos/id/1027/40/40',
        healthMetrics: []
    },
    { 
        id: 'P004', name: 'Phạm Thị Dung', dateOfBirth: '1995-08-10', gender: 'Nữ', phoneNumber: '0934567890', nationalId: '045678901234', address: '101 Đường D, Quận 3, TP.HCM', occupation: 'Nhân viên văn phòng', emergencyContact: { name: 'Phạm Văn E', phone: '0937654321' }, patientType: 'Yêu cầu', admissionDate: '2024-07-27', admittingDepartment: 'DEPT02', doctor: 'Dr. Michael Chen', assignedDoctorId: 'S004', reasonForVisit: 'Đau nửa đầu, chóng mặt', avatar: 'https://picsum.photos/id/1028/40/40',
        healthMetrics: [
            { date: '2024-07-27', bp_systolic: 115, bp_diastolic: 75, heart_rate: 80, temperature: 36.9, spo2: 99 },
        ]
    },
    { 
        id: 'P005', name: 'Vũ Thị G', dateOfBirth: '1965-01-25', gender: 'Nữ', phoneNumber: '0955555555', nationalId: '055555555555', address: '55 Đường E, TP. HCM', occupation: 'Nội trợ', emergencyContact: { name: 'Vũ Văn H', phone: '0954444444' }, patientType: 'BHYT', admissionDate: '2024-07-25', admittingDepartment: 'DEPT03', doctor: 'Dr. Michael Chen', assignedDoctorId: 'S004', reasonForVisit: 'Viêm phổi', avatar: 'https://picsum.photos/id/1029/40/40',
        healthMetrics: []
    },
];

export const mockVisits: Record<string, EMRVisit[]> = {
    'P001': [
        { id: 'V001', date: '2024-07-29', reason: 'Nhập viện cấp cứu do đau ngực', doctor: 'Dr. Emily Carter', notes: 'Bệnh nhân nhập viện với triệu chứng đau ngực trái lan ra tay, nghi ngờ nhồi máu cơ tim cấp. Đã cho làm xét nghiệm men tim và ECG.', isSigned: true },
        { id: 'V002', date: '2024-07-30', reason: 'Theo dõi sau can thiệp', doctor: 'Dr. Emily Carter', notes: 'Bệnh nhân ổn định sau can thiệp đặt stent. Dấu hiệu sống ổn, tiếp tục theo dõi.', isSigned: false },
    ],
    'P002': [
        { id: 'V003', date: '2024-07-29', reason: 'Khám ngoại trú do ho kéo dài', doctor: 'Dr. David Brown', notes: 'Bệnh nhân ho khan, có sốt nhẹ về chiều. Nghe phổi có ran rít. Chỉ định chụp X-quang phổi.', isSigned: false },
    ]
};

export const mockDiagnoses: Record<string, EMRDiagnosis[]> = {
    'P001': [
        { id: 'D001', date: '2024-07-29', code: 'I21.3', description: 'Nhồi máu cơ tim cấp thành trước', status: 'Chính', isSigned: true },
        { id: 'D002', date: '2024-07-29', code: 'E78.2', description: 'Rối loạn chuyển hóa lipoprotein hỗn hợp', status: 'Kèm theo', isSigned: false },
    ],
};

export const mockEmrAuditLog: AuditLog[] = [
    { id: 'LOG01', timestamp: '2024-07-29 10:15:20', user: 'Dr. Emily Carter', userRole: 'Bác sĩ/Y sĩ', action: 'Ký số Lần khám', details: 'Ký số hồ sơ khám V001', patientId: 'P001', recordId: 'V001' },
    { id: 'LOG02', timestamp: '2024-07-29 09:30:00', user: 'reception_01', userRole: 'Nhân viên Đăng ký/Tiếp tân', action: 'Tạo Bệnh nhân', details: 'Tạo hồ sơ mới cho bệnh nhân Nguyễn Văn An', patientId: 'P001', recordId: 'P001' },
];

export const mockServiceItems: ServiceItem[] = [
    { id: 'SRV001', name: 'Khám chuyên khoa', category: 'Dịch vụ lâm sàng', price: 150000, departmentId: 'DEPT03' },
    { id: 'SRV002', name: 'Tổng phân tích tế bào máu ngoại vi', category: 'Xét nghiệm Huyết học', price: 50000, departmentId: 'DEPT03' },
    { id: 'SRV003', name: 'Đo đường huyết mao mạch', category: 'Xét nghiệm Hóa sinh', price: 25000, departmentId: 'DEPT03' },
    { id: 'SRV004', name: 'Chụp X-quang ngực thẳng', category: 'Chẩn đoán hình ảnh', price: 120000, departmentId: 'DEPT03' },
    { id: 'SRV005', name: 'Siêu âm ổ bụng tổng quát', category: 'Chẩn đoán hình ảnh', price: 100000, departmentId: 'DEPT03' },
    { id: 'SRV006', name: 'Điện tâm đồ (ECG)', category: 'Thăm dò chức năng', price: 80000, departmentId: 'DEPT01' },
];

export const mockOutpatientVisits: OutpatientVisit[] = [
    { id: 'OPD001', patientId: 'P002', patientName: 'Trần Thị Bình', patientAvatar: 'https://picsum.photos/id/1026/40/40', patientDateOfBirth: '1992-11-30', arrivalTime: '08:15', status: 'Chờ khám', reasonForVisit: 'Ho kéo dài, sốt nhẹ', preliminaryDiagnosis: '', finalDiagnosis: '', vitalSigns: { temp: '37.8', bp: '110/70', hr: '88', spo2: '98', weight: '55', height: '160' }, clinicalNotes: { history: '', examination: '' } },
    { id: 'OPD002', patientId: 'P004', patientName: 'Phạm Thị Dung', patientAvatar: 'https://picsum.photos/id/1028/40/40', patientDateOfBirth: '1995-08-10', arrivalTime: '08:30', status: 'Chờ khám', reasonForVisit: 'Đau nửa đầu, chóng mặt', preliminaryDiagnosis: '', finalDiagnosis: '', vitalSigns: { temp: '36.9', bp: '115/75', hr: '80', spo2: '99', weight: '50', height: '155' }, clinicalNotes: { history: '', examination: '' } },
    { id: 'OPD003', patientId: 'P003', patientName: 'Lê Văn Cường', patientAvatar: 'https://picsum.photos/id/1027/40/40', patientDateOfBirth: '1978-02-20', arrivalTime: '09:00', status: 'Đang khám', reasonForVisit: 'Kiểm tra vết thương sau tai nạn', preliminaryDiagnosis: '', finalDiagnosis: '', vitalSigns: { temp: '37.0', bp: '130/80', hr: '78', spo2: '98', weight: '70', height: '175' }, clinicalNotes: { history: '', examination: '' } },
];

export const mockLabTests: LabTest[] = [
    { id: 'LAB001', orderId: 'ORD-L1', patientId: 'P001', patientName: 'Nguyễn Văn An', testName: 'Troponin T', orderDate: '2024-07-29', status: 'Có kết quả', results: 'Dương tính' },
    { id: 'LAB002', orderId: 'ORD-L2', patientId: 'P002', patientName: 'Trần Thị Bình', testName: 'Công thức máu', orderDate: '2024-07-29', status: 'Đã lấy mẫu', results: '' },
];

export const mockRadiologyExams: RadiologyExam[] = [
    { id: 'RAD001', orderId: 'ORD-R1', patientId: 'P002', patientName: 'Trần Thị Bình', modality: 'X-quang ngực thẳng', orderDate: '2024-07-29', status: 'Đã thực hiện', report: '' },
    { id: 'RAD002', orderId: 'ORD-R2', patientId: 'P004', patientName: 'Phạm Thị Dung', modality: 'MRI sọ não', orderDate: '2024-07-27', status: 'Có kết quả', report: 'Không phát hiện bất thường nội sọ.' },
];

export const mockInpatientRecords: InpatientRecord[] = [
    {
        id: 'IP001',
        patientId: 'P001',
        patientName: 'Nguyễn Văn An',
        patientAvatar: 'https://picsum.photos/id/1025/40/40',
        bedId: 'W1-B1',
        department: 'Khoa Tim mạch',
        admissionDate: '2024-07-29',
        primaryDiagnosis: 'Nhồi máu cơ tim cấp',
        admittingDoctor: 'Dr. Emily Carter',
        status: 'Đang điều trị',
        clinicalOrders: [
            { serviceId: 'SRV006', serviceName: 'Điện tâm đồ (ECG)', price: 80000, notes: 'Theo dõi mỗi 12 giờ' },
            { serviceId: 'SRV002', serviceName: 'Tổng phân tích tế bào máu ngoại vi', price: 50000 },
        ],
        nursingTasks: [
            { id: 'NT001', description: 'Theo dõi SpO2 mỗi 4 giờ', time: 'Hàng ngày', isCompleted: false, createdBy: 'Dr. Emily Carter', createdAt: '2024-07-29' },
            { id: 'NT002', description: 'Uống thuốc Aspirin 81mg', time: '08:00', isCompleted: true, createdBy: 'Dr. Emily Carter', createdAt: '2024-07-29', completedBy: 'Nurse Jane Doe', completedAt: '2024-07-30 08:05' },
        ],
        vitalSignRecords: [
            { timestamp: '2024-07-30 08:00', vitals: { temp: '37.1', bp: '125/80', hr: '78', spo2: '98', weight: '75', height: '170' }, recordedBy: 'Nurse Jane Doe' },
            { timestamp: '2024-07-29 20:00', vitals: { temp: '37.5', bp: '130/85', hr: '85', spo2: '97', weight: '75', height: '170' }, recordedBy: 'Nurse Jane Doe' },
        ],
        nursingNotes: [],
        prescription: [],
        isDischargeSummarySigned: false,
    },
    {
        id: 'IP002',
        patientId: 'P003',
        patientName: 'Lê Văn Cường',
        patientAvatar: 'https://picsum.photos/id/1027/40/40',
        bedId: 'W3-B1',
        department: 'Khoa Chỉnh hình',
        admissionDate: '2024-07-28',
        primaryDiagnosis: 'Gãy xương đùi',
        admittingDoctor: 'Dr. Sarah Lee',
        status: 'Đã xuất viện',
        clinicalOrders: [{ serviceId: 'SRV004', serviceName: 'Chụp X-quang ngực thẳng', price: 120000, notes: 'Kiểm tra sau phẫu thuật' }],
        nursingTasks: [
            { id: 'NT003', description: 'Thay băng vết mổ', time: '09:00', isCompleted: true, createdBy: 'Dr. Sarah Lee', createdAt: '2024-07-28', completedBy: 'Nurse Alex', completedAt: '2024-07-30 09:10' },
        ],
        vitalSignRecords: [
            { timestamp: '2024-07-30 07:00', vitals: { temp: '36.8', bp: '120/80', hr: '72', spo2: '99', weight: '80', height: '180' }, recordedBy: 'Nurse Alex' },
        ],
        nursingNotes: [],
        prescription: [],
        dischargeSummary: 'Bệnh nhân ổn định sau phẫu thuật. Vết mổ khô, không sưng tấy. Hướng dẫn tập vật lý trị liệu tại nhà và tái khám sau 2 tuần.',
        dischargeDate: '2024-07-30',
        isDischargeSummarySigned: true,
    },
     {
        id: 'IP003',
        patientId: 'P004',
        patientName: 'Phạm Thị Dung',
        patientAvatar: 'https://picsum.photos/id/1028/40/40',
        bedId: 'W2-B2',
        department: 'Khoa Thần kinh',
        admissionDate: '2024-07-30',
        primaryDiagnosis: 'Theo dõi chấn thương sọ não',
        admittingDoctor: 'Dr. John Smith',
        status: 'Nhập viện',
        clinicalOrders: [],
        nursingTasks: [],
        vitalSignRecords: [],
        nursingNotes: [],
        prescription: [],
        isDischargeSummarySigned: false,
    },
    {
        id: 'IP004',
        patientId: 'P005',
        patientName: 'Vũ Thị G',
        patientAvatar: 'https://picsum.photos/id/1029/40/40',
        bedId: 'W3-B2',
        department: 'Khoa Hô hấp',
        admissionDate: '2024-07-25',
        primaryDiagnosis: 'Viêm phổi cộng đồng',
        admittingDoctor: 'Dr. David Brown',
        status: 'Chờ xuất viện',
        clinicalOrders: [
            { serviceId: 'SRV004', serviceName: 'Chụp X-quang ngực thẳng', price: 120000 },
            { serviceId: 'SRV002', serviceName: 'Tổng phân tích tế bào máu ngoại vi', price: 50000 },
        ],
        nursingTasks: [],
        vitalSignRecords: [],
        nursingNotes: [],
        prescription: [],
        dischargeSummary: 'Bệnh nhân đáp ứng tốt với kháng sinh, hết sốt, ho giảm. Tình trạng lâm sàng ổn định.',
        isDischargeSummarySigned: false,
    },
];


export const mockFinancialRecords: FinancialRecord[] = [
    { id: 'FIN001', date: '2024-07-29', description: 'Tạm ứng viện phí - Nguyễn Văn An', type: 'Thu', amount: 5000000 },
    { id: 'FIN002', date: '2024-07-29', description: 'Chi mua vật tư y tế', type: 'Chi', amount: 2500000 },
    { id: 'FIN003', date: '2024-07-29', description: 'Thanh toán phí khám - Trần Thị Bình', type: 'Thu', amount: 150000 },
];

export const mockMedicationCategories: MedicationCategory[] = [
    { id: 'CAT01', name: 'Kháng sinh', description: 'Thuốc điều trị nhiễm khuẩn' },
    { id: 'CAT02', name: 'Giảm đau', description: 'Thuốc giảm đau, hạ sốt, chống viêm' },
    { id: 'CAT03', name: 'Tim mạch', description: 'Thuốc điều trị các bệnh lý tim mạch' },
];

export const mockSuppliers: Supplier[] = [
    { id: 'SUP01', name: 'Dược Hậu Giang', contactPerson: 'Nguyễn Văn A', phone: '02923891433', email: 'dhg@dhgpharma.com.vn', address: '288 Bis Nguyễn Văn Cừ, An Hòa, Ninh Kiều, Cần Thơ' },
    { id: 'SUP02', name: 'Traphaco', contactPerson: 'Trần Thị B', phone: '18006612', email: 'info@traphaco.com.vn', address: '75 Yên Ninh, Ba Đình, Hà Nội' },
];

export const mockMedications: Medication[] = [
    { id: 'MED001', name: 'Amoxicillin 500mg', category: 'Kháng sinh', stock: 1500, unit: 'Viên', supplier: 'Dược Hậu Giang', cost: 1200, expiryDate: '2025-12-31', location: 'Tủ A1' },
    { id: 'MED002', name: 'Paracetamol 500mg', category: 'Giảm đau', stock: 450, unit: 'Viên', supplier: 'Traphaco', cost: 500, expiryDate: '2026-06-30', location: 'Tủ B2' },
    { id: 'MED003', name: 'Aspirin 81mg', category: 'Tim mạch', stock: 800, unit: 'Viên', supplier: 'Dược Hậu Giang', cost: 700, expiryDate: '2024-08-30', location: 'Tủ C1' },
];