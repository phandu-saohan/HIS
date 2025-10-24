export type UserRole =
  | 'Bác sĩ/Y sĩ'
  | 'Điều dưỡng'
  | 'Nhân viên Đăng ký/Tiếp tân'
  | 'Nhân viên Viện phí/Kế toán'
  | 'Dược sĩ/Thủ kho'
  | 'Kỹ thuật viên Xét nghiệm'
  | 'Kỹ thuật viên Chẩn đoán Hình ảnh'
  | 'Nhân viên Nhân sự (HR)'
  | 'Trưởng khoa/Người duyệt'
  | 'Quản lý'
  | 'Quản trị Hệ thống';

export interface Bed {
  id: string;
  ward: string;
  status: 'Có sẵn' | 'Đã có người' | 'Đang dọn dẹp';
  patientName?: string;
}

export interface HealthMetric {
    date: string;
    bp_systolic: number;
    bp_diastolic: number;
    heart_rate: number;
    temperature: number;
    spo2: number;
}


export interface Patient {
    id: string;
    avatar: string;
    name: string;
    dateOfBirth: string;
    gender: 'Nam' | 'Nữ' | 'Khác';
    phoneNumber: string;
    nationalId: string;
    healthInsuranceId?: string;
    address: string;
    occupation: string;
    emergencyContact: {
        name: string;
        phone: string;
    };
    patientType: 'BHYT' | 'Viện phí' | 'Yêu cầu' | 'Miễn phí';
    admissionDate: string;
    admittingDepartment: string; // departmentId
    doctor: string;
    assignedDoctorId: string;
    reasonForVisit: string;
    healthMetrics?: HealthMetric[];
}

export interface Department {
    id: string;
    name: string;
    head: string;
    rooms: ExaminationRoom[];
}

export interface ExaminationRoom {
    id: string;
    name: string;
    status: 'Sẵn sàng' | 'Đang sử dụng' | 'Bảo trì';
}

export interface QueueTicket {
    id: number;
    patientName: string;
    departmentId: string;
    status: 'Đang chờ' | 'Đang khám' | 'Đã khám';
}

export interface Appointment {
    id: string;
    patientName: string;
    doctorName: string;
    doctorId: string;
    date: string;
    time: string;
    reason: string;
}

export interface BillableItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Invoice {
    id: string;
    patientId: string;
    patientName: string;
    amount: number;
    date: string;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    items: BillableItem[];
}


export interface InsuranceClaim {
    id: string;
    patientName: string;
    provider: string;
    amount: number;
    submittedDate: string;
    status: 'Đã duyệt' | 'Đã nộp' | 'Chờ xử lý' | 'Bị từ chối';
}

export interface FinancialRecord {
    id: string;
    date: string;
    description: string;
    type: 'Thu' | 'Chi';
    amount: number;
}

export interface Medication {
    id: string;
    name: string;
    category: string;
    stock: number;
    unit: string;
    supplier: string;
    cost: number;
    expiryDate: string;
    location: string;
}

export interface MedicationCategory {
    id: string;
    name: string;
    description: string;
}

export interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
}

export interface MedicalSupply {
    id: string;
    name: string;
    stock: number;
    category: string;
    supplier: string;
}

export interface Asset {
    id: string;
    name: string;
    location: string;
    status: 'Hoạt động' | 'Bảo trì' | 'Ngừng hoạt động';
    lastMaintenance: string;
    nextMaintenance: string;
}

export interface Staff {
    id: string;
    employeeId: string;
    name: string;
    role: string;
    department: string;
    status: 'Online' | 'Offline';
    avatar: string;
    joinDate: string;
    contact: string;
    email: string;
    dateOfBirth: string;
    address: string;
    qualifications: string;
    contractType: 'Toàn thời gian' | 'Bán thời gian';
    salary: number;
}

export interface WorkShift {
    staffId: string;
    staffName: string;
    day: string;
    shift: string;
}

export type AttendanceStatus = 'Có mặt' | 'Muộn' | 'Vắng';
export interface AttendanceRecord {
    id: string;
    staffId: string;
    staffName: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: AttendanceStatus;
}

export type PayrollStatus = 'Đã thanh toán' | 'Chưa thanh toán';
export interface PayrollRecord {
    id: string;
    staffId: string;
    staffName: string;
    payPeriod: string;
    grossSalary: number;
    deductions: number;
    netSalary: number;
    status: PayrollStatus;
}

export interface TrainingRecord {
    id: string;
    staffId: string;
    staffName: string;
    courseName: string;
    completionDate: string;
    provider: string;
}

export interface EMRVisit {
    id: string;
    date: string;
    reason: string;
    doctor: string;
    notes: string;
    isSigned: boolean;
}

export interface EMRDiagnosis {
    id: string;
    date: string;
    code: string;
    description: string;
    status: string;
    isSigned: boolean;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    userRole: UserRole | 'Quản trị viên' | 'Kế toán';
    action: string;
    details: string;
    patientId?: string;
    recordId?: string;
}

export type LabTestStatus = 'Đã chỉ định' | 'Đã lấy mẫu' | 'Có kết quả' | 'Đã hủy';
export interface LabTest {
    id: string;
    orderId: string;
    patientId: string;
    patientName: string;
    testName: string;
    orderDate: string;
    status: LabTestStatus;
    results: string;
    imageUrl?: string;
    aiDiagnosis?: string;
}

export type RadiologyExamStatus = 'Đã chỉ định' | 'Đã thực hiện' | 'Có kết quả' | 'Đã hủy';
export interface RadiologyExam {
    id: string;
    orderId: string;
    patientId: string;
    patientName: string;
    modality: string;
    orderDate: string;
    status: RadiologyExamStatus;
    report: string;
    imageUrl?: string;
    aiDiagnosis?: string;
}

export interface PortalMessage {
    id: string;
    patientName: string;
    subject: string;
    date: string;
    isRead: boolean;
}

export type TelemedicineSessionStatus = 'Sắp diễn ra' | 'Đã hoàn thành' | 'Đã hủy';
export interface TelemedicineSession {
    id: string;
    patientName: string;
    doctorName: string;
    startTime: string;
    status: TelemedicineSessionStatus;
}

export interface NursingTask {
    id: string;
    description: string;
    time: string; // Simplified for display, could be a cron string or more complex object
    isCompleted: boolean;
    createdBy?: string;
    createdAt?: string;
    completedBy?: string;
    completedAt?: string;
}

export interface NursingCarePlan {
    patientId: string;
    patientName: string;
    patientAvatar: string;
    bedId: string;
    lastVitals: {
        temp: string;
        bp: string;
        hr: string;
    };
    tasks: NursingTask[];
}

export type OutpatientVisitStatus = 'Chờ khám' | 'Đang khám' | 'Chờ kết quả CLS' | 'Đã hoàn thành';

export interface VitalSigns {
    temp: string;
    bp: string;
    hr: string;
    spo2: string;
    weight: string;
    height: string;
}

export interface ClinicalNotes {
    history: string;
    examination: string;
}

export interface ServiceItem {
    id: string;
    name: string;
    category: string;
    price: number;
    departmentId: string;
}

export interface ServiceOrderItem {
    serviceId: string;
    serviceName: string;
    price: number;
    notes?: string;
}

export interface PrescribedMedication {
    medicationId: string;
    medicationName: string;
    dosage: string;
    quantity: number;
    notes?: string;
    cost: number;
}

export interface OutpatientVisit {
    id: string;
    patientId: string;
    patientName: string;
    patientAvatar: string;
    patientDateOfBirth: string;
    arrivalTime: string;
    status: OutpatientVisitStatus;
    reasonForVisit: string;
    preliminaryDiagnosis: string;
    finalDiagnosis: string;
    vitalSigns: VitalSigns;
    clinicalNotes: ClinicalNotes;
    labOrders?: ServiceOrderItem[];
    radiologyOrders?: ServiceOrderItem[];
    prescription?: PrescribedMedication[];
}

export type InpatientStatus = 'Nhập viện' | 'Đang điều trị' | 'Chờ xuất viện' | 'Đã xuất viện';

export interface VitalSignRecord {
    timestamp: string;
    vitals: VitalSigns;
    recordedBy: string;
}

export interface NursingNote {
    timestamp: string;
    note: string;
    author: string;
}

export interface InpatientRecord {
    id: string;
    patientId: string;
    patientName: string;
    patientAvatar: string;
    bedId: string;
    department: string;
    admissionDate: string;
    primaryDiagnosis: string;
    admittingDoctor: string;
    status: InpatientStatus;
    clinicalOrders: ServiceOrderItem[];
    nursingTasks: NursingTask[];
    vitalSignRecords: VitalSignRecord[];
    nursingNotes: NursingNote[];
    prescription?: PrescribedMedication[];
    dischargeSummary?: string;
    dischargeDate?: string;
    isDischargeSummarySigned?: boolean;
}


export interface Permission {
    id: string;
    description: string;
    granted: boolean;
}
export interface Role {
    id: string;
    name: string;
    permissions: Record<string, Permission[]>;
}

export type PrescriptionStatus = 'Mới' | 'Đã cấp phát' | 'Đã hủy';
export interface PrescriptionRecord {
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    status: PrescriptionStatus;
    medications: PrescribedMedication[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}