import { get, ref, set, push, update, remove } from "firebase/database";
import { db } from '../firebaseConfig';
import { type Patient } from '../types';

export const getPatients = async (): Promise<Patient[]> => {
    try {
        const patientsRef = ref(db, "patients");
        const snapshot = await get(patientsRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            const patientsList: Patient[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key],
                // Đảm bảo các đối tượng lồng nhau được xử lý đúng cách
                emergencyContact: data[key].emergencyContact || { name: '', phone: '' },
                healthMetrics: data[key].healthMetrics || [],
            }));
            
            // Sắp xếp theo ngày nhập viện giảm dần
            patientsList.sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime());
            
            return patientsList;
        } else {
            return [];
        }

    } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh nhân từ Realtime Database:", error);
        alert("Không thể kết nối đến Realtime Database. Vui lòng kiểm tra lại cấu hình Firebase của bạn trong `firebaseConfig.ts` và đảm bảo bạn đã làm theo hướng dẫn trong `FirebaseSetup.md`.");
        return [];
    }
};

export const addPatient = async (patientData: Omit<Patient, 'id'>): Promise<string> => {
    const patientsListRef = ref(db, 'patients');
    const newPatientRef = push(patientsListRef);
    await set(newPatientRef, patientData);
    return newPatientRef.key!;
};

export const updatePatient = async (patientId: string, patientData: Partial<Omit<Patient, 'id'>>): Promise<void> => {
    const patientRef = ref(db, `patients/${patientId}`);
    await update(patientRef, patientData);
};

export const deletePatient = async (patientId: string): Promise<void> => {
    const patientRef = ref(db, `patients/${patientId}`);
    await remove(patientRef);
};