import React, { useState, useMemo, useEffect } from 'react';
import { type Patient, type UserRole } from '../types';
import { mockDepartments } from '../data/mockData';
import PatientFormModal from './PatientFormModal';

interface PatientManagementProps {
    onAddPatient: (patientData: Omit<Patient, 'id' | 'avatar'>) => void;
    onUpdatePatient: (patient: Patient) => void;
    onDeletePatient: (patientId: string) => void;
    onViewDetail: (patientId: string) => void;
    currentUserRole: UserRole;
    patients: Patient[];
}

const PatientRegistration: React.FC<PatientManagementProps> = ({ onAddPatient, onUpdatePatient, onDeletePatient, onViewDetail, currentUserRole, patients }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

    const canManage = ['Nhân viên Đăng ký/Tiếp tân', 'Quản lý', 'Quản trị Hệ thống'].includes(currentUserRole);

    const handleAddNew = () => {
        if (!canManage) return;
        setPatientToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (patient: Patient) => {
        if (!canManage) return;
        setPatientToEdit(patient);
        setIsModalOpen(true);
    };
    
    const handleDelete = (patientId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này không? Hành động này không thể hoàn tác.')) {
            onDeletePatient(patientId);
        }
    }

    const handleSavePatient = (patientFormData: Omit<Patient, 'id' | 'assignedDoctorId' | 'doctor'>, id?: string) => {
        const dummyDoctorInfo = { doctor: 'Dr. Michael Chen', assignedDoctorId: 'S004' };

        if (id && patientToEdit) {
            onUpdatePatient({ ...patientToEdit, ...patientFormData, ...dummyDoctorInfo });
        } else {
            onAddPatient({ ...patientFormData, ...dummyDoctorInfo });
        }
        setIsModalOpen(false);
    };

    const filteredPatients = useMemo(() => {
        return patients.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.phoneNumber.includes(searchTerm)
        );
    }, [patients, searchTerm]);

    const getDepartmentName = (deptId: string) => mockDepartments.find(d => d.id === deptId)?.name || deptId;
    
    return (
        <>
            <div className="modern-card p-6">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Quản lý Bệnh nhân</h2>
                    {canManage && (
                        <div className="flex items-center space-x-4">
                             <div className="relative">
                                <input type="text" placeholder="Tìm theo tên, ID, SĐT..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-64 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"/>
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            </div>
                            <button onClick={handleAddNew} className="btn-primary flex items-center">
                                <PlusIcon />
                                <span className="ml-2">Thêm Bệnh nhân</span>
                            </button>
                        </div>
                    )}
                </div>

                {!canManage && <p className="text-red-500">Bạn không có quyền truy cập chức năng này.</p>}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Bệnh nhân</th>
                                <th className="px-6 py-3">Ngày sinh</th>
                                <th className="px-6 py-3">Giới tính</th>
                                <th className="px-6 py-3">Số điện thoại</th>
                                <th className="px-6 py-3">Khoa khám</th>
                                {canManage && <th className="px-6 py-3">Hành động</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(patient => (
                                <tr 
                                    key={patient.id} 
                                    onClick={() => onViewDetail(patient.id)}
                                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center">
                                        <img src={patient.avatar} alt={patient.name} className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <p>{patient.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{patient.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{patient.dateOfBirth}</td>
                                    <td className="px-6 py-4">{patient.gender}</td>
                                    <td className="px-6 py-4">{patient.phoneNumber}</td>
                                    <td className="px-6 py-4">{getDepartmentName(patient.admittingDepartment)}</td>
                                    {canManage && (
                                        <td className="px-6 py-4 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => onViewDetail(patient.id)} className="p-1 text-blue-500 hover:text-blue-700" title="Xem"><EyeIcon /></button>
                                            <button onClick={() => handleEdit(patient)} className="p-1 text-yellow-500 hover:text-yellow-700" title="Sửa"><PencilIcon /></button>
                                            <button onClick={() => handleDelete(patient.id)} className="p-1 text-red-500 hover:text-red-700" title="Xóa"><TrashIcon /></button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <PatientFormModal
                    patient={patientToEdit}
                    onSave={handleSavePatient}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

// Icons
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>;
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

export default PatientRegistration;