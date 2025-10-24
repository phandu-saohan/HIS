import React, { useState, useMemo, useEffect } from 'react';
import { type Patient, type UserRole } from '../types';
import { mockDepartments } from '../data/mockData';

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

    const handleSavePatient = (patientFormData: Omit<Patient, 'id' | 'avatar' | 'assignedDoctorId' | 'doctor'>, id?: string) => {
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Quản lý Bệnh nhân</h2>
                    {canManage && (
                        <div className="flex items-center space-x-4">
                             <div className="relative">
                                <input type="text" placeholder="Tìm theo tên, ID, SĐT..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-64 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"/>
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            </div>
                            <button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
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
                                <tr key={patient.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                                        <td className="px-6 py-4 flex items-center space-x-2">
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

// Form Modal Sub-component
interface PatientFormModalProps {
    patient: Patient | null;
    onSave: (patientData: Omit<Patient, 'id' | 'avatar' | 'assignedDoctorId' | 'doctor'>, id?: string) => void;
    onClose: () => void;
}

const PatientFormModal: React.FC<PatientFormModalProps> = ({ patient, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: patient?.name || '',
        dateOfBirth: patient?.dateOfBirth || '',
        gender: patient?.gender || 'Khác',
        nationalId: patient?.nationalId || '',
        healthInsuranceId: patient?.healthInsuranceId || '',
        address: patient?.address || '',
        occupation: patient?.occupation || '',
        phoneNumber: patient?.phoneNumber || '',
        emergencyContact: {
            name: patient?.emergencyContact.name || '',
            phone: patient?.emergencyContact.phone || '',
        },
        patientType: patient?.patientType || 'Viện phí',
        admissionDate: patient?.admissionDate || new Date().toISOString().split('T')[0],
        admittingDepartment: patient?.admittingDepartment || 'DEPT03',
        reasonForVisit: patient?.reasonForVisit || '',
    });

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'emergencyContactName') {
            setFormData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, name: value } }));
        } else if (name === 'emergencyContactPhone') {
            setFormData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, phone: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, patient?.id);
    };

    const inputFieldClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold">{patient ? 'Chỉnh sửa thông tin Bệnh nhân' : 'Đăng ký Bệnh nhân mới'}</h3>
                </div>
                <form id="patient-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Thông tin Cá nhân</legend>
                        <div className="md:col-span-2"><label className="block text-sm font-medium">Họ và tên</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputFieldClass} required /></div>
                        <div><label className="block text-sm font-medium">Ngày sinh</label><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputFieldClass} required /></div>
                        <div><label className="block text-sm font-medium">Giới tính</label><select name="gender" value={formData.gender} onChange={handleChange} className={inputFieldClass} required><option>Nam</option><option>Nữ</option><option>Khác</option></select></div>
                        <div><label className="block text-sm font-medium">Số CCCD/CMND</label><input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} className={inputFieldClass} required /></div>
                        <div><label className="block text-sm font-medium">Số điện thoại</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputFieldClass} required /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium">Địa chỉ</label><input type="text" name="address" value={formData.address} onChange={handleChange} className={inputFieldClass} required /></div>
                        <div><label className="block text-sm font-medium">Nghề nghiệp</label><input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className={inputFieldClass} /></div>
                    </fieldset>
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Liên hệ Khẩn cấp</legend>
                        <div><label className="block text-sm font-medium">Họ tên người thân</label><input type="text" name="emergencyContactName" value={formData.emergencyContact.name} onChange={handleChange} className={inputFieldClass} required /></div>
                        <div><label className="block text-sm font-medium">Số điện thoại</label><input type="tel" name="emergencyContactPhone" value={formData.emergencyContact.phone} onChange={handleChange} className={inputFieldClass} required /></div>
                    </fieldset>
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Thông tin Khám bệnh</legend>
                        <div><label className="block text-sm font-medium">Đối tượng</label><select name="patientType" value={formData.patientType} onChange={handleChange} className={inputFieldClass}><option>BHYT</option><option>Viện phí</option><option>Yêu cầu</option><option>Miễn phí</option></select></div>
                        <div><label className="block text-sm font-medium">Mã BHYT (nếu có)</label><input type="text" name="healthInsuranceId" value={formData.healthInsuranceId} onChange={handleChange} className={inputFieldClass} /></div>
                        <div><label className="block text-sm font-medium">Khoa đăng ký khám</label><select name="admittingDepartment" value={formData.admittingDepartment} onChange={handleChange} className={inputFieldClass} required>{mockDepartments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium">Ngày nhập viện</label><input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className={inputFieldClass} required /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium">Lý do đến khám</label><textarea name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} rows={3} className={inputFieldClass} required /></div>
                    </fieldset>
                </form>
                <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2 mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                    <button type="submit" form="patient-form" className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">Lưu</button>
                </div>
            </div>
        </div>
    );
};

// Icons
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>;
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

export default PatientRegistration;