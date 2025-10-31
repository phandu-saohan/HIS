import React from 'react';
import { type UserRole } from '../types';

interface SidebarProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
  currentUserRole: UserRole;
}

// FIX: Hoisted icon component definitions to the top of the file to resolve "used before declaration" errors.
// Icons
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ChartBarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const UserGroupIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ClipboardListIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const BedIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 9.5V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2.5M18 14v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5m6-4v10m-4-7h8" /></svg>;
const DocumentTextIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const HeartIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SparklesIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4 4-4 5.293-5.293a1 1 0 011.414 0L21 12m-5-9l2.293 2.293a1 1 0 010 1.414l-2.293 2.293" /></svg>;
const BeakerIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477zM12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const PhotographIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const CurrencyDollarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0 12v-1m0-1c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" /></svg>;
const ShieldCheckIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944L12 22l9-1.056v-9.438c0-1.007.348-1.957.944-2.734z" /></svg>;
const BookOpenIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const CollectionIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const PillIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.25 10.25l-.875-.875a.5.5 0 00-.707 0L9.5 12.5l-.875-.875a.5.5 0 00-.707 0L5.293 14.25a.5.5 0 000 .707l.875.875a.5.5 0 00.707 0L10.5 12.5l.875.875a.5.5 0 00.707 0l2.625-2.625a.5.5 0 000-.707z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const CubeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const WrenchScrewdriverIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5l4.72-4.72a.75.75 0 011.06 0l.94.94a.75.75 0 010 1.06l-4.72 4.72m-4.58 4.58L5.16 19.84a.75.75 0 01-1.06 0l-.94-.94a.75.75 0 010-1.06l3.29-3.29m7.53-7.53l-3.29 3.29M3 21l3.63-3.63" /></svg>;
const BriefcaseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const OfficeBuildingIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const StarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const LockClosedIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const ArrowTrendingUpIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ChatAlt2Icon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h4M5 8h2m-2 4h2" /></svg>;
const VideoCameraIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ChatBubbleLeftRightIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a5.25 5.25 0 0 1-1.04-.612l-1.908-1.362a5.25 5.25 0 0 0-5.223-1.362l-1.908 1.362a5.25 5.25 0 0 1-1.04.612l-3.722-.537A2.25 2.25 0 0 1 2.25 15V9.75c0-1.136.847-2.1 1.98-2.193l3.723-.537a5.25 5.25 0 0 1 1.04.612l1.907 1.362a5.25 5.25 0 0 0 5.223 1.362l1.908-1.362a5.25 5.25 0 0 1 1.04-.612l3.722.537Z" /></svg>


const allMenuItems = {
    'Tổng quan': [
        { id: 'Dashboard', label: 'Bảng điều khiển', icon: <HomeIcon/> },
    ],
    'Lâm sàng': [
        { id: 'PatientRegistration', label: 'Quản lý Bệnh nhân', icon: <UserGroupIcon/> },
        { id: 'OPDManagement', label: 'Khám ngoại trú', icon: <ClipboardListIcon/> },
        { id: 'IPDManagement', label: 'Quản lý Nội trú', icon: <BedIcon/> },
        { id: 'EMR', label: 'Bệnh án điện tử', icon: <DocumentTextIcon/> },
        { id: 'NursingInformationSystem', label: 'Điều dưỡng (NIS)', icon: <HeartIcon/> },
        { id: 'AppointmentSchedule', label: 'Lịch hẹn', icon: <CalendarIcon/> },
        { id: 'OTSchedule', label: 'Lịch Phòng mổ', icon: <ClockIcon /> },
        { id: 'AIChat', label: 'Trò chuyện AI Y tế', icon: <ChatBubbleLeftRightIcon /> },
    ],
    'Cận Lâm sàng': [
        { id: 'LIS', label: 'Xét nghiệm (LIS)', icon: <BeakerIcon/> },
        { id: 'RISPACS', label: 'Chẩn đoán Hình ảnh (RIS)', icon: <PhotographIcon/> },
    ],
    'Hành chính & Tài chính': [
        { id: 'ServiceBilling', label: 'Quản lý Viện phí', icon: <CurrencyDollarIcon/> },
        { id: 'InsuranceClaims', label: 'Quản lý BHYT', icon: <ShieldCheckIcon/> },
        { id: 'FinancialLedger', label: 'Kế toán & Thu chi', icon: <BookOpenIcon/> },
        { id: 'ServiceMasterManagement', label: 'Quản lý Dịch vụ', icon: <CollectionIcon /> },
    ],
    'Hậu cần & Kho': [
        { id: 'PharmacyManagement', label: 'Quản lý Dược', icon: <PillIcon/> },
        { id: 'InventoryManagement', label: 'Quản lý Vật tư', icon: <CubeIcon/> },
        { id: 'AssetManagement', label: 'Quản lý Thiết bị', icon: <WrenchScrewdriverIcon/> },
    ],
    'Quản lý & Vận hành': [
        { id: 'HRManagement', label: 'Quản lý Nhân sự (HRM)', icon: <BriefcaseIcon/> },
        { id: 'FacilityManagement', label: 'Quản lý Khoa/Phòng', icon: <OfficeBuildingIcon/> },
        { id: 'QualityManagement', label: 'Quản lý Chất lượng', icon: <StarIcon/> },
        { id: 'SecurityManagement', label: 'Bảo mật & Phân quyền', icon: <LockClosedIcon/> },
        { id: 'BusinessProcessFlow', label: 'Quy trình Nghiệp vụ', icon: <ArrowTrendingUpIcon /> },
    ],
    'Tương tác Bệnh nhân': [
        { id: 'PatientPortal', label: 'Cổng thông tin Bệnh nhân', icon: <ChatAlt2Icon/> },
        { id: 'Telemedicine', label: 'Y tế từ xa', icon: <VideoCameraIcon/> },
    ]
};

const Sidebar: React.FC<SidebarProps> = ({ activeComponent, setActiveComponent, currentUserRole }) => {
    // A simple role-based access control map. This would be more complex in a real app.
    const rolePermissions: Record<UserRole, string[]> = {
        'Bác sĩ/Y sĩ': ['Dashboard', 'PatientRegistration', 'OPDManagement', 'IPDManagement', 'EMR', 'AppointmentSchedule', 'OTSchedule', 'LIS', 'RISPACS', 'NursingInformationSystem', 'PatientDetail', 'AIChat'],
        'Điều dưỡng': ['Dashboard', 'BedManagement', 'NursingInformationSystem', 'IPDManagement', 'QueueManagement', 'PatientRegistration', 'PatientDetail', 'AIChat'],
        'Nhân viên Đăng ký/Tiếp tân': ['PatientRegistration', 'AppointmentSchedule', 'QueueManagement', 'ServiceBilling', 'PatientDetail'],
        'Nhân viên Viện phí/Kế toán': ['ServiceBilling', 'InsuranceClaims', 'FinancialLedger', 'ServiceMasterManagement', 'PatientRegistration', 'PatientDetail'],
        'Dược sĩ/Thủ kho': ['PharmacyManagement', 'InventoryManagement'],
        'Kỹ thuật viên Xét nghiệm': ['LIS'],
        'Kỹ thuật viên Chẩn đoán Hình ảnh': ['RISPACS'],
        'Nhân viên Nhân sự (HR)': ['HRManagement'],
        'Trưởng khoa/Người duyệt': Object.values(allMenuItems).flat().map(i => i.id).concat(['PatientDetail']), // Can see most things
        'Quản lý': Object.values(allMenuItems).flat().map(i => i.id).concat(['PatientDetail']), // Can see almost everything
        'Quản trị Hệ thống': Object.values(allMenuItems).flat().map(i => i.id).concat(['PatientDetail']), // Can see everything
    };

    const allowedMenuItems = rolePermissions[currentUserRole] || [];

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 flex flex-col border-r border-gray-200 dark:border-gray-700">
            <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SmartHospital</h1>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(allMenuItems).map(([category, items]) => {
                    const visibleItems = items.filter(item => allowedMenuItems.includes(item.id));
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={category}>
                            <h2 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</h2>
                            <ul className="mt-2 space-y-1">
                                {visibleItems.map(item => (
                                    <li key={item.id}>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); setActiveComponent(item.id); }}
                                            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                activeComponent === item.id 
                                                ? 'bg-blue-500 text-white' 
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
