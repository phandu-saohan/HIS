import React, { useState, useEffect } from 'react';
import { type Patient } from '../types';
import { mockDepartments } from '../data/mockData';
import { User, Phone, MapPin, Heart, Clipboard, X, Save, AlertCircle, FileText, Bold, Italic, List, Plus } from 'lucide-react';

interface PatientFormModalProps {
    patient: Patient | null;
    initialData?: Partial<Patient>;
    onSave: (patientData: Omit<Patient, 'id' | 'assignedDoctorId' | 'doctor'>, id?: string) => void;
    onClose: () => void;
}

const PatientFormModal: React.FC<PatientFormModalProps> = ({ patient, initialData, onSave, onClose }) => {
    const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'medical' | 'notes'>('personal');
    const [formData, setFormData] = useState({
        name: patient?.name || initialData?.name || '',
        dateOfBirth: patient?.dateOfBirth || initialData?.dateOfBirth || '',
        gender: patient?.gender || initialData?.gender || 'Khác',
        nationalId: patient?.nationalId || initialData?.nationalId || '',
        healthInsuranceId: patient?.healthInsuranceId || initialData?.healthInsuranceId || '',
        address: patient?.address || initialData?.address || '',
        occupation: patient?.occupation || initialData?.occupation || '',
        phoneNumber: patient?.phoneNumber || initialData?.phoneNumber || '',
        emergencyContact: {
            name: patient?.emergencyContact?.name || initialData?.emergencyContact?.name || '',
            phone: patient?.emergencyContact?.phone || initialData?.emergencyContact?.phone || '',
        },
        patientType: patient?.patientType || initialData?.patientType || 'Viện phí',
        admissionDate: patient?.admissionDate || initialData?.admissionDate || new Date().toISOString().split('T')[0],
        admittingDepartment: patient?.admittingDepartment || initialData?.admittingDepartment || 'DEPT03',
        reasonForVisit: patient?.reasonForVisit || initialData?.reasonForVisit || '',
        notes: patient?.notes || initialData?.notes || '',
        avatar: patient?.avatar || initialData?.avatar || `https://picsum.photos/seed/${Date.now()}/150/150`,
    });

    const avatarPresets = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    ];

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

    const insertMarkdown = (prefix: string, suffix: string = '') => {
        const textarea = document.getElementById('patient-notes') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.notes;
        const selectedText = text.substring(start, end);
        const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
        
        setFormData(prev => ({ ...prev, notes: newText }));
        
        // Focus back and set selection (optional, but nice)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";
    const inputClass = "input-modern";

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-all ${
                activeTab === id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {patient ? 'Cập nhật thông tin Bệnh nhân' : 'Đăng ký Bệnh nhân mới'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Vui lòng điền đầy đủ các thông tin bắt buộc (*)</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <TabButton id="personal" label="Thông tin Cá nhân" icon={User} />
                    <TabButton id="contact" label="Liên hệ Khẩn cấp" icon={Phone} />
                    <TabButton id="medical" label="Thông tin Khám bệnh" icon={Clipboard} />
                    <TabButton id="notes" label="Ghi chú & Tiền sử" icon={FileText} />
                </div>

                {/* Form Body */}
                <form id="patient-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'personal' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                            {/* Avatar Selection */}
                            <div className="flex flex-col items-center space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <div className="relative group">
                                    <img 
                                        src={formData.avatar} 
                                        alt="Avatar Preview" 
                                        className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl" 
                                    />
                                    <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <User className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {avatarPresets.map((url, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, avatar: url }))}
                                            className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${formData.avatar === url ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent hover:border-slate-300'}`}
                                        >
                                            <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` }))}
                                        className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-300 transition-colors"
                                        title="Ngẫu nhiên"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Chọn ảnh đại diện cho bệnh nhân</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Họ và tên *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Nguyễn Văn A" required />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Ngày sinh *</label>
                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Giới tính *</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass} required>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Số CCCD/CMND *</label>
                                    <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} className={inputClass} placeholder="012345678901" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Số điện thoại *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="0901234567" required />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Địa chỉ thường trú *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Số nhà, tên đường, phường/xã..." required />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Nghề nghiệp</label>
                                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className={inputClass} placeholder="Kỹ sư, Giáo viên..." />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start mb-6">
                                <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    Thông tin này dùng để liên lạc với người thân trong trường hợp khẩn cấp.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Họ tên người thân *</label>
                                    <input type="text" name="emergencyContactName" value={formData.emergencyContact.name} onChange={handleChange} className={inputClass} placeholder="Họ và tên người liên hệ" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Số điện thoại người thân *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="tel" name="emergencyContactPhone" value={formData.emergencyContact.phone} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Số điện thoại liên hệ" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'medical' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Đối tượng khám *</label>
                                    <select name="patientType" value={formData.patientType} onChange={handleChange} className={inputClass}>
                                        <option value="BHYT">Bảo hiểm Y tế (BHYT)</option>
                                        <option value="Viện phí">Viện phí (Tự túc)</option>
                                        <option value="Yêu cầu">Khám theo yêu cầu</option>
                                        <option value="Miễn phí">Miễn phí / Chính sách</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Mã số BHYT (nếu có)</label>
                                    <input type="text" name="healthInsuranceId" value={formData.healthInsuranceId} onChange={handleChange} className={inputClass} placeholder="GD401..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Khoa đăng ký khám *</label>
                                    <select name="admittingDepartment" value={formData.admittingDepartment} onChange={handleChange} className={inputClass} required>
                                        {mockDepartments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Ngày đến khám *</label>
                                    <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className={inputClass} required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Lý do đến khám *</label>
                                    <textarea name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} rows={4} className={inputClass} placeholder="Mô tả triệu chứng hoặc lý do khám..." required />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300 h-full flex flex-col">
                            <div className="flex flex-col h-full">
                                <label className={labelClass}>Ghi chú chi tiết (Tiền sử bệnh, Dị ứng, Lưu ý đặc biệt...)</label>
                                <div className="flex-1 flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                                    <div className="flex items-center space-x-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                        <button type="button" onClick={() => insertMarkdown('**', '**')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="In đậm">
                                            <Bold className="w-4 h-4" />
                                        </button>
                                        <button type="button" onClick={() => insertMarkdown('_', '_')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="In nghiêng">
                                            <Italic className="w-4 h-4" />
                                        </button>
                                        <button type="button" onClick={() => insertMarkdown('\n- ', '')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="Danh sách">
                                            <List className="w-4 h-4" />
                                        </button>
                                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
                                        <span className="text-[10px] text-slate-400 uppercase font-bold px-2">Markdown hỗ trợ</span>
                                    </div>
                                    <textarea 
                                        id="patient-notes"
                                        name="notes" 
                                        value={formData.notes} 
                                        onChange={handleChange} 
                                        className="flex-1 p-4 bg-transparent border-none focus:ring-0 resize-none font-mono text-sm leading-relaxed" 
                                        placeholder="Nhập tiền sử bệnh lý, dị ứng thuốc, các lưu ý đặc biệt cho bác sĩ..."
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-400 italic">
                                    Gợi ý: Sử dụng danh sách để liệt kê các loại thuốc đang dùng hoặc các bệnh nền.
                                </p>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${activeTab === 'personal' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <div className={`w-2.5 h-2.5 rounded-full ${activeTab === 'contact' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <div className={`w-2.5 h-2.5 rounded-full ${activeTab === 'medical' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <div className={`w-2.5 h-2.5 rounded-full ${activeTab === 'notes' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    </div>
                    <div className="flex space-x-3">
                        <button type="button" onClick={onClose} className="btn-secondary px-6">
                            Hủy bỏ
                        </button>
                        {activeTab !== 'notes' ? (
                            <button 
                                type="button" 
                                onClick={() => {
                                    if (activeTab === 'personal') setActiveTab('contact');
                                    else if (activeTab === 'contact') setActiveTab('medical');
                                    else if (activeTab === 'medical') setActiveTab('notes');
                                }}
                                className="btn-primary px-6"
                            >
                                Tiếp theo
                            </button>
                        ) : (
                            <button type="submit" form="patient-form" className="btn-primary px-8 bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
                                <Save className="w-4 h-4 mr-2" />
                                Hoàn tất Đăng ký
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientFormModal;
