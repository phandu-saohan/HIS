import { supabase } from '../supabaseClient';
import { type Patient } from '../types';
import { mockPatients } from '../data/mockData';

// Fallback state for when Supabase is not configured or throws an error
let localPatientsState: Patient[] = [...mockPatients];
let useLocalState = !supabase;

export const getPatients = async (): Promise<Patient[]> => {
    if (useLocalState || !supabase) {
        return localPatientsState;
    }

    try {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('admissionDate', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        if (data && data.length > 0) {
            return data as Patient[];
        } else {
            return [];
        }

    } catch (error: any) {
        console.warn("Lỗi khi lấy danh sách bệnh nhân từ Supabase:", error);
        console.info("Chuyển sang sử dụng dữ liệu mẫu (mock data) do lỗi kết nối Supabase.");
        useLocalState = true;
        return localPatientsState;
    }
};

export const addPatient = async (patientData: Omit<Patient, 'id'>): Promise<string> => {
    if (useLocalState || !supabase) {
        const newId = `P${Date.now()}`;
        const newPatient = { ...patientData, id: newId } as Patient;
        localPatientsState = [newPatient, ...localPatientsState];
        return newId;
    }

    try {
        const { data, error } = await supabase
            .from('patients')
            .insert([patientData])
            .select();
            
        if (error) throw error;
        return data[0].id;
    } catch (error) {
        console.error("Lỗi khi thêm bệnh nhân:", error);
        throw error;
    }
};

export const updatePatient = async (patientId: string, patientData: Partial<Omit<Patient, 'id'>>): Promise<void> => {
    if (useLocalState || !supabase) {
        localPatientsState = localPatientsState.map(p => 
            p.id === patientId ? { ...p, ...patientData } : p
        );
        return;
    }

    try {
        const { error } = await supabase
            .from('patients')
            .update(patientData)
            .eq('id', patientId);
            
        if (error) throw error;
    } catch (error) {
        console.error("Lỗi khi cập nhật bệnh nhân:", error);
        throw error;
    }
};

export const deletePatient = async (patientId: string): Promise<void> => {
    if (useLocalState || !supabase) {
        localPatientsState = localPatientsState.filter(p => p.id !== patientId);
        return;
    }

    try {
        const { error } = await supabase
            .from('patients')
            .delete()
            .eq('id', patientId);
            
        if (error) throw error;
    } catch (error) {
        console.error("Lỗi khi xóa bệnh nhân:", error);
        throw error;
    }
};
