import React, { useState, useMemo } from 'react';
import { type Staff, type UserRole, type WorkShift, type AttendanceRecord, type PayrollRecord, type TrainingRecord } from '../types';
import { Search, Plus, Edit2, Trash2, Eye, X, ArrowLeft } from 'lucide-react';
import StaffProfile from './StaffProfile';

type Tab = 'profiles' | 'schedule' | 'payroll' | 'training';

interface HRManagementProps {
  currentUserRole: UserRole;
  staffList: Staff[];
  workShifts: WorkShift[];
  attendanceRecords: AttendanceRecord[];
  payrollRecords: PayrollRecord[];
  trainingRecords: TrainingRecord[];
  onAddStaff: (staff: Omit<Staff, 'id'>) => void;
  onUpdateStaff: (staff: Staff) => void;
  onDeleteStaff: (id: string) => void;
}

const HRManagement: React.FC<HRManagementProps> = ({ 
    currentUserRole, 
    staffList, 
    workShifts,
    attendanceRecords,
    payrollRecords,
    trainingRecords,
    onAddStaff, 
    onUpdateStaff, 
    onDeleteStaff 
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('profiles');
    const [viewingStaff, setViewingStaff] = useState<Staff | null>(null);

    if (viewingStaff) {
        return (
            <StaffProfile 
                staff={viewingStaff} 
                onBack={() => setViewingStaff(null)} 
            />
        );
    }
    
    return (
        <div className="modern-card p-6">
            <h2 className="text-2xl font-bold mb-4">Quản lý Nhân sự (HRM)</h2>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6">
                    <TabButton text="Hồ sơ Nhân viên" tab="profiles" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton text="Lịch làm việc & Chấm công" tab="schedule" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton text="Lương & Phúc lợi" tab="payroll" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton text="Đào tạo & Phát triển" tab="training" activeTab={activeTab} onClick={setActiveTab} />
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === 'profiles' && (
                    <EmployeeProfileTab 
                        currentUserRole={currentUserRole} 
                        staffList={staffList}
                        onAddStaff={onAddStaff}
                        onUpdateStaff={onUpdateStaff}
                        onDeleteStaff={onDeleteStaff}
                        onViewStaff={setViewingStaff}
                    />
                )}
                {activeTab === 'schedule' && <ScheduleAttendanceTab workShifts={workShifts} attendanceRecords={attendanceRecords} />}
                {activeTab === 'payroll' && <PayrollTab payrollRecords={payrollRecords} />}
                {activeTab === 'training' && <TrainingTab trainingRecords={trainingRecords} />}
            </div>
        </div>
    );
};

const TabButton: React.FC<{ text: string, tab: Tab, activeTab: Tab, onClick: (tab: Tab) => void }> = ({ text, tab, activeTab, onClick }) => (
    <button onClick={() => onClick(tab)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {text}
    </button>
);

// Employee Profiles Tab
interface EmployeeProfileTabProps {
    currentUserRole: UserRole;
    staffList: Staff[];
    onAddStaff: (staff: Omit<Staff, 'id'>) => void;
    onUpdateStaff: (staff: Staff) => void;
    onDeleteStaff: (id: string) => void;
    onViewStaff: (staff: Staff) => void;
}

const EmployeeProfileTab: React.FC<EmployeeProfileTabProps> = ({ currentUserRole, staffList, onAddStaff, onUpdateStaff, onDeleteStaff, onViewStaff }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const canManage = ['Nhân viên Nhân sự (HR)', 'Quản trị Hệ thống', 'Quản lý'].includes(currentUserRole);

    const filteredStaff = useMemo(() => staffList.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    ), [staffList, searchTerm]);

    const handleAdd = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    const handleEdit = (staff: Staff) => {
        setEditingStaff(staff);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            onDeleteStaff(id);
        }
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Tìm nhân viên..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                </div>
                {canManage && (
                    <button 
                        onClick={handleAdd}
                        className="btn-primary flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm Nhân viên
                    </button>
                )}
             </div>
             <div className="overflow-x-auto">
                <table className="table-modern">
                    <thead>
                        <tr>
                            <th className="px-6 py-3">Nhân viên</th>
                            <th className="px-6 py-3">Mã NV</th>
                            <th className="px-6 py-3">Chức vụ</th>
                            <th className="px-6 py-3">Khoa</th>
                            <th className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                     <tbody>
                        {filteredStaff.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center">
                                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                                    {member.name}
                                </td>
                                <td className="px-6 py-4 font-mono">{member.employeeId}</td>
                                <td className="px-6 py-4">{member.role}</td>
                                <td className="px-6 py-4">{member.department}</td>
                                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                    <button 
                                        onClick={() => onViewStaff(member)}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    {canManage && (
                                        <>
                                            <button 
                                                onClick={() => handleEdit(member)}
                                                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(member.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <StaffModal 
                    staff={editingStaff} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={(data) => {
                        if (editingStaff) {
                            onUpdateStaff({ ...data, id: editingStaff.id } as Staff);
                        } else {
                            onAddStaff(data as Omit<Staff, 'id'>);
                        }
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

const StaffModal: React.FC<{ staff: Staff | null, onClose: () => void, onSave: (data: any) => void }> = ({ staff, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Staff>>(staff || {
        name: '',
        employeeId: '',
        role: 'Bác sĩ',
        department: '',
        status: 'Online',
        joinDate: new Date().toISOString().split('T')[0],
        contact: '',
        email: '',
        dateOfBirth: '',
        address: '',
        qualifications: '',
        contractType: 'Toàn thời gian',
        salary: 0,
        avatar: `https://picsum.photos/seed/${Date.now()}/40/40`
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const avatarPresets = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
                    <h3 className="text-xl font-bold">{staff ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Avatar Selection */}
                    <div className="flex flex-col items-center space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 mb-4">
                        <img 
                            src={formData.avatar} 
                            alt="Avatar Preview" 
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md" 
                        />
                        <div className="flex flex-wrap justify-center gap-2">
                            {avatarPresets.map((url, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, avatar: url }))}
                                    className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${formData.avatar === url ? 'border-blue-600 scale-110' : 'border-transparent'}`}
                                >
                                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` }))}
                                className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Họ và tên</label>
                            <input 
                                required
                                type="text" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="input-modern"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Mã nhân viên</label>
                            <input 
                                required
                                type="text" 
                                value={formData.employeeId} 
                                onChange={e => setFormData({...formData, employeeId: e.target.value})}
                                className="input-modern"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Chức vụ</label>
                            <select 
                                value={formData.role} 
                                onChange={e => setFormData({...formData, role: e.target.value})}
                                className="input-modern"
                            >
                                <option>Bác sĩ</option>
                                <option>Y tá</option>
                                <option>Điều dưỡng</option>
                                <option>Kỹ thuật viên</option>
                                <option>Dược sĩ</option>
                                <option>Nhân viên hành chính</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Khoa/Phòng</label>
                            <input 
                                type="text" 
                                value={formData.department} 
                                onChange={e => setFormData({...formData, department: e.target.value})}
                                className="input-modern"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input 
                                type="email" 
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="input-modern"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                            <input 
                                type="text" 
                                value={formData.contact} 
                                onChange={e => setFormData({...formData, contact: e.target.value})}
                                className="input-modern"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                            <input 
                                type="date" 
                                value={formData.dateOfBirth} 
                                onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                                className="input-modern"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ngày vào làm</label>
                            <input 
                                type="date" 
                                value={formData.joinDate} 
                                onChange={e => setFormData({...formData, joinDate: e.target.value})}
                                className="input-modern"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                            <input 
                                type="text" 
                                value={formData.address} 
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                className="input-modern"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Bằng cấp/Chuyên môn</label>
                            <textarea 
                                value={formData.qualifications} 
                                onChange={e => setFormData({...formData, qualifications: e.target.value})}
                                className="input-modern h-20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Loại hợp đồng</label>
                            <select 
                                value={formData.contractType} 
                                onChange={e => setFormData({...formData, contractType: e.target.value as any})}
                                className="input-modern"
                            >
                                <option value="Toàn thời gian">Toàn thời gian</option>
                                <option value="Bán thời gian">Bán thời gian</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Lương (VNĐ)</label>
                            <input 
                                type="number" 
                                value={formData.salary} 
                                onChange={e => setFormData({...formData, salary: parseInt(e.target.value)})}
                                className="input-modern"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="btn-secondary">Hủy</button>
                        <button type="submit" className="btn-primary">Lưu thông tin</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Schedule & Attendance Tab
const ScheduleAttendanceTab: React.FC<{ workShifts: WorkShift[], attendanceRecords: AttendanceRecord[] }> = ({ workShifts, attendanceRecords }) => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const staff = [...new Map(workShifts.map(item => [item['staffId'], item])).values()].sort((a,b) => a.staffName.localeCompare(b.staffName));

    const getShiftForStaffAndDay = (staffId: string, day: string) => workShifts.find(s => s.staffId === staffId && s.day === day)?.shift || 'N/A';
    const getShiftColor = (shift: string) => {
        if (shift.startsWith('Sáng')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        if (shift.startsWith('Chiều')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        if (shift === 'Nghỉ') return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        return '';
    };

    const getAttendanceStatusColor = (status: AttendanceRecord['status']) => {
        if (status === 'Có mặt') return 'bg-green-100 text-green-800';
        if (status === 'Muộn') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Vắng') return 'bg-red-100 text-red-800';
        return '';
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Lịch làm việc tuần</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                <th className="p-2 font-semibold text-left text-xs uppercase w-32">Nhân viên</th>
                                {days.map(day => <th key={day} className="p-2 font-semibold text-center text-xs uppercase">{day}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {staff.map(s => (
                                <tr key={s.staffId}>
                                    <td className="p-2 font-medium whitespace-nowrap">{s.staffName}</td>
                                    {days.map(day => {
                                        const shift = getShiftForStaffAndDay(s.staffId, day);
                                        return <td key={day} className="p-1 text-center"><span className={`px-2 py-1 rounded-md text-xs font-semibold block ${getShiftColor(shift)}`}>{shift}</span></td>;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                 <h3 className="text-lg font-semibold mb-4">Bảng chấm công (Hôm nay)</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Nhân viên</th>
                                <th className="px-4 py-2 text-center">Giờ vào</th>
                                <th className="px-4 py-2 text-center">Giờ ra</th>
                                <th className="px-4 py-2 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map(att => (
                                <tr key={att.id} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-2 font-medium">{att.staffName}</td>
                                    <td className="px-4 py-2 text-center">{att.checkIn}</td>
                                    <td className="px-4 py-2 text-center">{att.checkOut}</td>
                                    <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAttendanceStatusColor(att.status)}`}>{att.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Payroll Tab
const PayrollTab: React.FC<{ payrollRecords: PayrollRecord[] }> = ({ payrollRecords }) => {
     return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Bảng lương</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2">Nhân viên</th>
                            <th className="px-4 py-2 text-right">Lương gộp</th>
                            <th className="px-4 py-2 text-right">Khấu trừ</th>
                            <th className="px-4 py-2 text-right">Thực nhận</th>
                            <th className="px-4 py-2 text-center">Trạng thái</th>
                            <th className="px-4 py-2 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrollRecords.map(p => (
                            <tr key={p.id} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2 font-medium">{p.staffName}</td>
                                <td className="px-4 py-2 text-right font-mono">{p.grossSalary.toLocaleString('vi-VN')}</td>
                                <td className="px-4 py-2 text-right font-mono text-red-500">({p.deductions.toLocaleString('vi-VN')})</td>
                                <td className="px-4 py-2 text-right font-mono font-bold">{p.netSalary.toLocaleString('vi-VN')}</td>
                                <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
                                <td className="px-4 py-2 text-center"><button className="font-medium text-blue-600 hover:underline">Xem phiếu lương</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Training Tab
const TrainingTab: React.FC<{ trainingRecords: TrainingRecord[] }> = ({ trainingRecords }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Lịch sử Đào tạo & Phát triển</h3>
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2">Nhân viên</th>
                            <th className="px-4 py-2">Khóa học</th>
                            <th className="px-4 py-2">Đơn vị</th>
                            <th className="px-4 py-2">Ngày hoàn thành</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingRecords.map(t => (
                            <tr key={t.id} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2 font-medium">{t.staffName}</td>
                                <td className="px-4 py-2">{t.courseName}</td>
                                <td className="px-4 py-2">{t.provider}</td>
                                <td className="px-4 py-2">{t.completionDate}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
}

export default HRManagement;
