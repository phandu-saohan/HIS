import { supabase } from './supabaseClient';
import { 
    type Patient, type Staff, type Appointment, type FinancialRecord, 
    type OutpatientVisit, type InpatientRecord, type Medication, 
    type MedicationCategory, type Supplier, type LabTest, 
    type RadiologyExam, type TelemedicineSession, type Invoice,
    type QueueTicket, type Department, type ServiceItem, type AuditLog,
    type DocumentVersion, type SignatureLog, type WorkShift,
    type AttendanceRecord, type PayrollRecord, type TrainingRecord,
    type MedicalSupply, type Asset, type Role
} from '../types';
import { 
    mockPatients, mockStaff, mockAppointments, mockFinancialRecords,
    mockOutpatientVisits, mockInpatientRecords, mockMedications,
    mockMedicationCategories, mockSuppliers, mockLabTests,
    mockRadiologyExams, mockTelemedicineSessions, mockInvoices
} from '../data/mockData';

// Fallback state for when Supabase is not configured or throws an error
const localState: any = {
    patients: [...mockPatients],
    staff: [...mockStaff],
    appointments: [...mockAppointments],
    financialRecords: [...mockFinancialRecords],
    opdVisits: [...mockOutpatientVisits],
    inpatientRecords: [...mockInpatientRecords],
    medications: [...mockMedications],
    medicationCategories: [...mockMedicationCategories],
    suppliers: [...mockSuppliers],
    labTests: [...mockLabTests],
    radiologyExams: [...mockRadiologyExams],
    telemedicineSessions: [...mockTelemedicineSessions],
    invoices: [...mockInvoices],
    queueTickets: []
};

let useLocalState = !supabase;

const handleSupabaseError = (error: any, table: string) => {
    console.warn(`Lỗi khi thao tác với bảng ${table} trên Supabase:`, error);
    console.info("Chuyển sang sử dụng dữ liệu mẫu (mock data) do lỗi kết nối Supabase.");
    useLocalState = true;
};

// Generic CRUD functions
const getAll = async <T>(table: string, orderBy: string = 'id'): Promise<T[]> => {
    if (useLocalState || !supabase) return localState[table] || [];
    try {
        const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: false });
        if (error) throw error;
        return (data || []) as T[];
    } catch (error) {
        handleSupabaseError(error, table);
        return localState[table] || [];
    }
};

const create = async <T extends { id: any }>(table: string, itemData: Omit<T, 'id'>): Promise<any> => {
    if (useLocalState || !supabase) {
        const newId = typeof localState[table]?.[0]?.id === 'number' ? Date.now() : `${table.charAt(0).toUpperCase()}${Date.now()}`;
        const newItem = { ...itemData, id: newId } as T;
        localState[table] = [newItem, ...(localState[table] || [])];
        return newId;
    }
    try {
        const { data, error } = await supabase.from(table).insert([itemData]).select();
        if (error) throw error;
        return data[0].id;
    } catch (error) {
        console.error(`Lỗi khi thêm vào ${table}:`, error);
        throw error;
    }
};

const update = async <T>(table: string, id: any, itemData: Partial<T>): Promise<void> => {
    if (useLocalState || !supabase) {
        localState[table] = (localState[table] || []).map((item: any) => item.id === id ? { ...item, ...itemData } : item);
        return;
    }
    try {
        const { error } = await supabase.from(table).update(itemData).eq('id', id);
        if (error) throw error;
    } catch (error) {
        console.error(`Lỗi khi cập nhật ${table}:`, error);
        throw error;
    }
};

const remove = async (table: string, id: any): Promise<void> => {
    if (useLocalState || !supabase) {
        localState[table] = (localState[table] || []).filter((item: any) => item.id !== id);
        return;
    }
    try {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
    } catch (error) {
        console.error(`Lỗi khi xóa từ ${table}:`, error);
        throw error;
    }
};

// Exported functions for each entity
export const getPatients = () => getAll<Patient>('patients', 'admissionDate');
export const addPatient = (data: Omit<Patient, 'id'>) => create<Patient>('patients', data);
export const updatePatient = (id: string, data: Partial<Patient>) => update<Patient>('patients', id, data);
export const deletePatient = (id: string) => remove('patients', id);

export const getStaff = () => getAll<Staff>('staff', 'name');
export const addStaff = (data: Omit<Staff, 'id'>) => create<Staff>('staff', data);
export const updateStaff = (id: string, data: Partial<Staff>) => update<Staff>('staff', id, data);
export const deleteStaff = (id: string) => remove('staff', id);

export const getAppointments = () => getAll<Appointment>('appointments', 'date');
export const addAppointment = (data: Omit<Appointment, 'id'>) => create<Appointment>('appointments', data);
export const updateAppointment = (id: string, data: Partial<Appointment>) => update<Appointment>('appointments', id, data);
export const deleteAppointment = (id: string) => remove('appointments', id);

export const getFinancialRecords = () => getAll<FinancialRecord>('financial_records', 'date');
export const addFinancialRecord = (data: Omit<FinancialRecord, 'id'>) => create<FinancialRecord>('financial_records', data);

export const getOpdVisits = () => getAll<OutpatientVisit>('opd_visits', 'arrivalTime');
export const updateOpdVisit = (id: string, data: Partial<OutpatientVisit>) => update<OutpatientVisit>('opd_visits', id, data);

export const getInpatientRecords = () => getAll<InpatientRecord>('inpatient_records', 'admissionDate');
export const updateInpatientRecord = (id: string, data: Partial<InpatientRecord>) => update<InpatientRecord>('inpatient_records', id, data);

export const getMedications = () => getAll<Medication>('medications', 'name');
export const addMedication = (data: Omit<Medication, 'id'>) => create<Medication>('medications', data);
export const updateMedication = (id: string, data: Partial<Medication>) => update<Medication>('medications', id, data);
export const deleteMedication = (id: string) => remove('medications', id);

export const getMedicationCategories = () => getAll<MedicationCategory>('medication_categories', 'name');
export const addMedicationCategory = (data: Omit<MedicationCategory, 'id'>) => create<MedicationCategory>('medication_categories', data);
export const updateMedicationCategory = (id: string, data: Partial<MedicationCategory>) => update<MedicationCategory>('medication_categories', id, data);
export const deleteMedicationCategory = (id: string) => remove('medication_categories', id);

export const getSuppliers = () => getAll<Supplier>('suppliers', 'name');
export const addSupplier = (data: Omit<Supplier, 'id'>) => create<Supplier>('suppliers', data);
export const updateSupplier = (id: string, data: Partial<Supplier>) => update<Supplier>('suppliers', id, data);
export const deleteSupplier = (id: string) => remove('suppliers', id);

export const getLabTests = () => getAll<LabTest>('lab_tests', 'orderDate');
export const addLabTest = (data: Omit<LabTest, 'id'>) => create<LabTest>('lab_tests', data);
export const updateLabTest = (id: string, data: Partial<LabTest>) => update<LabTest>('lab_tests', id, data);
export const deleteLabTest = (id: string) => remove('lab_tests', id);

export const getRadiologyExams = () => getAll<RadiologyExam>('radiology_exams', 'orderDate');
export const addRadiologyExam = (data: Omit<RadiologyExam, 'id'>) => create<RadiologyExam>('radiology_exams', data);
export const updateRadiologyExam = (id: string, data: Partial<RadiologyExam>) => update<RadiologyExam>('radiology_exams', id, data);
export const deleteRadiologyExam = (id: string) => remove('radiology_exams', id);

export const getTelemedicineSessions = () => getAll<TelemedicineSession>('telemedicine_sessions', 'startTime');
export const updateTelemedicineSession = (id: string, data: Partial<TelemedicineSession>) => update<TelemedicineSession>('telemedicine_sessions', id, data);

export const getInvoices = () => getAll<Invoice>('invoices', 'date');
export const addInvoice = (data: Omit<Invoice, 'id'>) => create<Invoice>('invoices', data);
export const updateInvoice = (id: string, data: Partial<Invoice>) => update<Invoice>('invoices', id, data);
export const deleteInvoice = (id: string) => remove('invoices', id);

export const getQueueTickets = () => getAll<QueueTicket>('queue_tickets', 'id');
export const addQueueTicket = (data: Omit<QueueTicket, 'id'>) => create<QueueTicket>('queue_tickets', data);
export const updateQueueTicket = (id: number, data: Partial<QueueTicket>) => update<QueueTicket>('queue_tickets', id, data);

export const getDepartments = () => getAll<Department>('departments', 'name');
export const getServiceItems = () => getAll<ServiceItem>('service_items', 'name');
export const getAuditLogs = () => getAll<AuditLog>('audit_logs', 'timestamp');
export const addAuditLog = (data: Omit<AuditLog, 'id'>) => create<AuditLog>('audit_logs', data);

export const getDocumentVersions = () => getAll<DocumentVersion>('document_versions', 'createdAt');
export const getSignatureLogs = () => getAll<SignatureLog>('signature_logs', 'signingTime');

export const getWorkShifts = () => getAll<WorkShift>('work_shifts', 'day');
export const getAttendanceRecords = () => getAll<AttendanceRecord>('attendance_records', 'date');
export const getPayrollRecords = () => getAll<PayrollRecord>('payroll_records', 'payPeriod');
export const getTrainingRecords = () => getAll<TrainingRecord>('training_records', 'completionDate');

export const getMedicalSupplies = () => getAll<MedicalSupply>('medical_supplies', 'name');
export const addMedicalSupply = (data: Omit<MedicalSupply, 'id'>) => create<MedicalSupply>('medical_supplies', data);
export const updateMedicalSupply = (id: string, data: Partial<MedicalSupply>) => update<MedicalSupply>('medical_supplies', id, data);
export const deleteMedicalSupply = (id: string) => remove('medical_supplies', id);

export const getAssets = () => getAll<Asset>('assets', 'name');
export const addAsset = (data: Omit<Asset, 'id'>) => create<Asset>('assets', data);
export const updateAsset = (id: string, data: Partial<Asset>) => update<Asset>('assets', id, data);
export const deleteAsset = (id: string) => remove('assets', id);

export const getRoles = () => getAll<Role>('roles', 'name');
export const addRole = (data: Omit<Role, 'id'>) => create<Role>('roles', data);
export const updateRole = (id: string, data: Partial<Role>) => update<Role>('roles', id, data);
export const deleteRole = (id: string) => remove('roles', id);

export const addDepartment = (data: Omit<Department, 'id'>) => create<Department>('departments', data);
export const updateDepartment = (id: string, data: Partial<Department>) => update<Department>('departments', id, data);
export const deleteDepartment = (id: string) => remove('departments', id);
