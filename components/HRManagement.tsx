import React, { useState, useMemo } from 'react';
import { type Staff, type UserRole, type WorkShift, type AttendanceRecord, type PayrollRecord, type TrainingRecord } from '../types';

const mockStaff: Staff[] = [
  { id: 'S001', name: 'Dr. Emily Carter', role: 'Bác sĩ', department: 'Tim mạch', status: 'Online', avatar: 'https://picsum.photos/id/1005/40/40', employeeId: 'EMP1001', joinDate: '2020-05-15', contact: '090-123-4567', email: 'ecarter@hospital.vn', dateOfBirth: '1985-02-20', address: '123 Đường A, TP. HCM', qualifications: 'MD, PhD Cardiology', contractType: 'Toàn thời gian', salary: 120000000 },
  { id: 'S002', name: 'Dr. John Smith', role: 'Bác sĩ', department: 'Thần kinh', status: 'Online', avatar: 'https://picsum.photos/id/1006/40/40', employeeId: 'EMP1002', joinDate: '2019-11-20', contact: '090-234-5678', email: 'jsmith@hospital.vn', dateOfBirth: '1982-08-15', address: '456 Đường B, Hà Nội', qualifications: 'MD, Neurology', contractType: 'Toàn thời gian', salary: 115000000 },
  { id: 'S003', name: 'Nurse Jane Doe', role: 'Y tá', department: 'Chỉnh hình', status: 'Offline', avatar: 'https://picsum.photos/id/1008/40/40', employeeId: 'EMP2001', joinDate: '2021-02-10', contact: '090-345-6789', email: 'jdoe@hospital.vn', dateOfBirth: '1992-11-30', address: '789 Đường C, Đà Nẵng', qualifications: 'BSN, RN', contractType: 'Toàn thời gian', salary: 35000000 },
];

const mockShifts: WorkShift[] = [
    { staffId: 'S001', staffName: 'Dr. Carter', day: 'Thứ 2', shift: 'Sáng (7-15h)' },
    { staffId: 'S002', staffName: 'Dr. Smith', day: 'Thứ 2', shift: 'Chiều (15-23h)' },
    { staffId: 'S003', staffName: 'Nurse Doe', day: 'Thứ 2', shift: 'Sáng (7-15h)' },
    { staffId: 'S001', staffName: 'Dr. Carter', day: 'Thứ 3', shift: 'Sáng (7-15h)' },
    { staffId: 'S002', staffName: 'Dr. Smith', day: 'Thứ 3', shift: 'Sáng (7-15h)' },
    { staffId: 'S003', staffName: 'Nurse Doe', day: 'Thứ 3', shift: 'Chiều (15-23h)' },
];

const mockAttendance: AttendanceRecord[] = [
    { id: 'ATT01', staffId: 'S001', staffName: 'Dr. Emily Carter', date: '2024-07-29', checkIn: '06:58', checkOut: '15:05', status: 'Có mặt' },
    { id: 'ATT02', staffId: 'S002', staffName: 'Dr. John Smith', date: '2024-07-29', checkIn: '15:10', checkOut: '23:01', status: 'Muộn' },
    { id: 'ATT03', staffId: 'S003', staffName: 'Nurse Jane Doe', date: '2024-07-29', checkIn: '07:00', checkOut: '15:00', status: 'Có mặt' },
];

const mockPayroll: PayrollRecord[] = [
    { id: 'PAY01', staffId: 'S001', staffName: 'Dr. Emily Carter', payPeriod: '07/2024', grossSalary: 120000000, deductions: 15500000, netSalary: 104500000, status: 'Đã thanh toán' },
    { id: 'PAY02', staffId: 'S002', staffName: 'Dr. John Smith', payPeriod: '07/2024', grossSalary: 115000000, deductions: 14875000, netSalary: 100125000, status: 'Đã thanh toán' },
    { id: 'PAY03', staffId: 'S003', staffName: 'Nurse Jane Doe', payPeriod: '07/2024', grossSalary: 35000000, deductions: 4525000, netSalary: 30475000, status: 'Chưa thanh toán' },
];

const mockTraining: TrainingRecord[] = [
    { id: 'TRN01', staffId: 'S001', staffName: 'Dr. Emily Carter', courseName: 'Can thiệp tim mạch nâng cao', completionDate: '2023-11-15', provider: 'Viện Tim Mạch Quốc Gia' },
    { id: 'TRN02', staffId: 'S003', staffName: 'Nurse Jane Doe', courseName: 'Chăm sóc vết thương phức tạp', completionDate: '2024-02-20', provider: 'Hội Điều Dưỡng Việt Nam' },
];


type Tab = 'profiles' | 'schedule' | 'payroll' | 'training';

interface HRManagementProps {
  currentUserRole: UserRole;
}

const HRManagement: React.FC<HRManagementProps> = ({ currentUserRole }) => {
    const [activeTab, setActiveTab] = useState<Tab>('profiles');
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
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
                {activeTab === 'profiles' && <EmployeeProfileTab currentUserRole={currentUserRole} />}
                {activeTab === 'schedule' && <ScheduleAttendanceTab />}
                {activeTab === 'payroll' && <PayrollTab />}
                {activeTab === 'training' && <TrainingTab />}
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
const EmployeeProfileTab: React.FC<{ currentUserRole: UserRole }> = ({ currentUserRole }) => {
    const [staffList, setStaffList] = useState<Staff[]>(mockStaff);
    const [searchTerm, setSearchTerm] = useState('');

    const canManage = ['Nhân viên Nhân sự (HR)', 'Quản trị Hệ thống'].includes(currentUserRole);

    const filteredStaff = useMemo(() => staffList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())), [staffList, searchTerm]);

    return (
        <div>
             <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <input type="text" placeholder="Tìm nhân viên..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"/>
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                </div>
                {canManage && <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">Thêm Nhân viên</button>}
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                            <tr key={member.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center">
                                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                                    {member.name}
                                </td>
                                <td className="px-6 py-4 font-mono">{member.employeeId}</td>
                                <td className="px-6 py-4">{member.role}</td>
                                <td className="px-6 py-4">{member.department}</td>
                                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xem</button>
                                    {canManage && <button className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline">Sửa</button>}
                                    {canManage && <button className="font-medium text-red-600 dark:text-red-500 hover:underline">Xóa</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Schedule & Attendance Tab
const ScheduleAttendanceTab: React.FC = () => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const staff = [...new Map(mockShifts.map(item => [item['staffId'], item])).values()].sort((a,b) => a.staffName.localeCompare(b.staffName));

    const getShiftForStaffAndDay = (staffId: string, day: string) => mockShifts.find(s => s.staffId === staffId && s.day === day)?.shift || 'N/A';
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
                            {mockAttendance.map(att => (
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
const PayrollTab: React.FC = () => {
     return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Bảng lương tháng 07/2024</h3>
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
                        {mockPayroll.map(p => (
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
const TrainingTab: React.FC = () => {
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
                        {mockTraining.map(t => (
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

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;

export default HRManagement;
