import React, { useState, useMemo, useEffect, useRef } from 'react';
import { type Role, type AuditLog, type Permission, type UserRole } from '../types';

// --- ICONS ---
const ActivityIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const MicroscopeIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ReceiptIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const PackageIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const SettingsIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UsersIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;
const CheckCircleIconSolid: React.FC<{className?: string}> = ({className}) => <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const LockClosedIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const PlusIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const PencilIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;

const allModules: Record<string, string> = {
    'Bảng điều khiển': 'dashboard', 'Quản lý Bệnh nhân': 'patient', 'Khám ngoại trú': 'opd',
    'Quản lý Nội trú': 'ipd', 'Bệnh án điện tử': 'emr', 'Điều dưỡng (NIS)': 'nis',
    'Lịch hẹn': 'appointment', 'Lịch Phòng mổ': 'ot', 'Trò chuyện AI Y tế': 'ai-chat',
    'Xét nghiệm (LIS)': 'lis', 'Chẩn đoán Hình ảnh (RIS)': 'ris', 'Quản lý Viện phí': 'billing',
    'Quản lý BHYT': 'insurance', 'Kế toán & Thu chi': 'ledger', 'Quản lý Dịch vụ': 'service',
    'Quản lý Dược': 'pharmacy', 'Quản lý Vật tư': 'inventory', 'Quản lý Thiết bị': 'asset',
    'Quản lý Nhân sự (HRM)': 'hr', 'Quản lý Khoa/Phòng': 'facility', 'Quản lý Chất lượng': 'quality',
    'Bảo mật & Phân quyền': 'security', 'Quy trình Nghiệp vụ': 'workflow', 'Cổng thông tin Bệnh nhân': 'portal',
    'Y tế từ xa': 'telemedicine',
};

const moduleCategories: Record<string, string[]> = {
    'Lâm sàng & Tổng quan': ['Bảng điều khiển', 'Quản lý Bệnh nhân', 'Khám ngoại trú', 'Quản lý Nội trú', 'Bệnh án điện tử', 'Điều dưỡng (NIS)', 'Lịch hẹn', 'Lịch Phòng mổ', 'Trò chuyện AI Y tế'],
    'Cận Lâm sàng': ['Xét nghiệm (LIS)', 'Chẩn đoán Hình ảnh (RIS)'],
    'Hành chính & Tài chính': ['Quản lý Viện phí', 'Quản lý BHYT', 'Kế toán & Thu chi', 'Quản lý Dịch vụ'],
    'Hậu cần & Kho': ['Quản lý Dược', 'Quản lý Vật tư', 'Quản lý Thiết bị'],
    'Quản lý & Vận hành': ['Quản lý Nhân sự (HRM)', 'Quản lý Khoa/Phòng', 'Quản lý Chất lượng', 'Bảo mật & Phân quyền', 'Quy trình Nghiệp vụ'],
    'Tương tác Bệnh nhân': ['Cổng thông tin Bệnh nhân', 'Y tế từ xa']
};

const permissionActions: ('xem' | 'thêm' | 'sửa' | 'xóa')[] = ['xem', 'thêm', 'sửa', 'xóa'];
const actionText: Record<string, string> = { xem: 'Xem', thêm: 'Thêm mới', sửa: 'Sửa', xóa: 'Xóa' };

const createPermissions = (moduleName: string, moduleId: string, grants: ('xem' | 'thêm' | 'sửa' | 'xóa')[] = []): Permission[] => {
    if (moduleId === 'ai-chat') {
        return [{ id: 'ai-chat-use', description: 'Sử dụng Trợ lý AI Y tế', granted: grants.includes('xem') }];
    }
    return permissionActions.map(action => ({
        id: `${moduleId}-${action}`,
        description: `${actionText[action]} dữ liệu ${moduleName}`,
        granted: grants.includes(action)
    }));
};

const mockRolesData: Role[] = [
    {
        id: 'R01', name: 'Bác sĩ điều trị',
        permissions: Object.fromEntries(Object.entries(allModules).map(([name, id]) => [name, createPermissions(name, id, 
            ({
                'dashboard': ['xem'], 'patient': ['xem'], 'opd': ['xem', 'sửa'], 'ipd': ['xem', 'sửa'],
                'emr': ['xem', 'thêm', 'sửa'], 'nis': ['xem'], 'appointment': ['xem'], 'ot': ['xem', 'thêm', 'sửa'],
                'ai-chat': ['xem'], 'lis': ['xem', 'thêm'], 'ris': ['xem', 'thêm'], 'billing': ['xem'],
                'insurance': ['xem'], 'service': ['xem'], 'pharmacy': ['xem'], 'inventory': ['xem'],
                'asset': ['xem'], 'quality': ['xem'], 'workflow': ['xem'], 'portal': ['xem'], 'telemedicine': ['xem', 'sửa']
            } as Record<string, ('xem' | 'thêm' | 'sửa' | 'xóa')[]>)[id] || [])
        ]))
    },
    {
        id: 'R02', name: 'Kế toán Viện phí',
        permissions: Object.fromEntries(Object.entries(allModules).map(([name, id]) => [name, createPermissions(name, id,
            ({
                'dashboard': ['xem'], 'patient': ['xem'], 'appointment': ['xem'], 'billing': ['xem', 'thêm', 'sửa'],
                'insurance': ['xem', 'thêm', 'sửa'], 'ledger': ['xem', 'thêm'],
                'service': ['xem', 'thêm', 'sửa', 'xóa'], 'workflow': ['xem']
            } as Record<string, ('xem' | 'thêm' | 'sửa' | 'xóa')[]>)[id] || [])
        ]))
    },
];

const mockAuditLog: AuditLog[] = [
    { id: 'L01', timestamp: '2024-07-30 10:32:15', user: 'Dr. Emily Carter', userRole: 'Bác sĩ/Y sĩ', action: 'Hoàn thành Khám', details: 'Bệnh nhân: Trần Thị Bình (P002)' },
    { id: 'L02', timestamp: '2024-07-30 10:25:40', user: 'Dr. Emily Carter', userRole: 'Bác sĩ/Y sĩ', action: 'Kê đơn thuốc', details: 'Bệnh nhân: P002, Thuốc: Amoxicillin' },
    { id: 'L03', timestamp: '2024-07-30 09:15:02', user: 'acc_vienphi', userRole: 'Nhân viên Viện phí/Kế toán', action: 'Tạo Hóa đơn', details: 'Bệnh nhân: Nguyễn Văn An (P001), Số tiền: 1.500.000 VND' },
    { id: 'L04', timestamp: '2024-07-30 08:05:11', user: 'admin', userRole: 'Quản trị Hệ thống', action: 'Đăng nhập Hệ thống', details: 'IP: 192.168.1.10' },
];

const CheckCircleIcon: React.FC<{granted: boolean}> = ({ granted }) => granted
    ? <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    : <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

type Tab = 'roles' | 'audit';
type View = 'list' | 'form';

interface SecurityManagementProps {
    currentUserRole: UserRole;
    roles: Role[];
    onAddRole: (data: Omit<Role, 'id'>) => void;
    onUpdateRole: (data: Role) => void;
    onDeleteRole: (id: string) => void;
    auditLogs: AuditLog[];
}

const moduleIcons: Record<string, React.ReactNode> = {
    'Lâm sàng & Tổng quan': <ActivityIcon className="w-5 h-5 text-blue-500" />,
    'Cận Lâm sàng': <MicroscopeIcon className="w-5 h-5 text-indigo-500" />,
    'Hành chính & Tài chính': <ReceiptIcon className="w-5 h-5 text-amber-500" />,
    'Hậu cần & Kho': <PackageIcon className="w-5 h-5 text-emerald-500" />,
    'Quản lý & Vận hành': <SettingsIcon className="w-5 h-5 text-slate-500" />,
    'Tương tác Bệnh nhân': <UsersIcon className="w-5 h-5 text-purple-500" />
};

const SecurityManagement: React.FC<SecurityManagementProps> = ({ 
    currentUserRole, 
    roles, 
    onAddRole, 
    onUpdateRole, 
    onDeleteRole, 
    auditLogs 
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('roles');
    const [view, setView] = useState<View>('list');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    useEffect(() => {
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0]);
        }
    }, [roles, selectedRole]);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        'Lâm sàng & Tổng quan': true,
        'Cận Lâm sàng': true
    });
    const deleteModalRef = useRef<HTMLDialogElement>(null);
    
    const canManage = currentUserRole === 'Quản trị Hệ thống';

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const handleAddNew = () => {
        setRoleToEdit(null);
        setView('form');
    };

    const handleEdit = (role: Role) => {
        setRoleToEdit(role);
        setView('form');
    };

    const handleDelete = (role: Role) => {
        setRoleToDelete(role);
        deleteModalRef.current?.showModal();
    };

    const handleConfirmDelete = () => {
        if (!roleToDelete) return;
        
        onDeleteRole(roleToDelete.id);

        if (selectedRole?.id === roleToDelete.id) {
            setSelectedRole(roles.find(r => r.id !== roleToDelete.id) || null);
        }
        
        setRoleToDelete(null);
        deleteModalRef.current?.close();
    };

    const handleSaveRole = (formData: { name: string; permissions: Record<string, Permission[]> }) => {
        if (roleToEdit) { // Update
            onUpdateRole({ ...roleToEdit, ...formData });
        } else { // Add new
            onAddRole(formData);
        }
        setView('list');
    };
    
    const handleCancel = () => {
        setView('list');
    };
    
    if (view === 'form') {
        return <RoleFormView role={roleToEdit} onSave={handleSaveRole} onCancel={handleCancel} />;
    }

    return (
        <>
            <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-4">Quản lý Phân quyền & Bảo mật</h2>
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setActiveTab('roles')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'roles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Quản lý Vai trò (RBAC)
                        </button>
                        <button onClick={() => setActiveTab('audit')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'audit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Nhật ký Hoạt động (Audit Trail)
                        </button>
                    </nav>
                </div>

                {activeTab === 'roles' && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Vai trò & Phân quyền</h3>
                                <p className="text-sm text-slate-500">Quản lý các nhóm người dùng và quyền truy cập module</p>
                            </div>
                            {canManage && (
                                <button
                                    onClick={handleAddNew}
                                    className="btn-primary flex items-center px-4 py-2.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Thêm vai trò mới
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Role List Sidebar */}
                            <div className="w-full lg:w-1/4">
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Danh sách Vai trò</p>
                                    <ul className="space-y-1 mt-1">
                                        {roles.map(role => (
                                            <li 
                                                key={role.id} 
                                                onClick={() => setSelectedRole(role)} 
                                                className={`group w-full text-left p-3 rounded-xl text-sm flex justify-between items-center cursor-pointer transition-all ${
                                                    selectedRole?.id === role.id 
                                                        ? 'bg-blue-600 text-white shadow-md' 
                                                        : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full mr-3 ${selectedRole?.id === role.id ? 'bg-white' : 'bg-blue-400 opacity-50'}`}></div>
                                                    <span className="font-bold">{role.name}</span>
                                                </div>
                                                {canManage && 
                                                    <div className={`flex items-center space-x-1 transition-opacity ${selectedRole?.id === role.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <button 
                                                            onClick={(e) => {e.stopPropagation(); handleEdit(role)}}
                                                            className={`p-1.5 rounded-lg transition-colors ${selectedRole?.id === role.id ? 'hover:bg-white/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                                        >
                                                            <PencilIcon className={`w-3.5 h-3.5 ${selectedRole?.id === role.id ? 'text-white' : 'text-slate-400'}`}/>
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {e.stopPropagation(); handleDelete(role)}}
                                                            className={`p-1.5 rounded-lg transition-colors ${selectedRole?.id === role.id ? 'hover:bg-white/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                                        >
                                                            <TrashIcon className={`w-3.5 h-3.5 ${selectedRole?.id === role.id ? 'text-white' : 'text-red-400'}`}/>
                                                        </button>
                                                    </div>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Permissions Detail View */}
                            <div className="w-full lg:w-3/4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                                {selectedRole ? (
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                                    Quyền hạn: <span className="text-blue-600 dark:text-blue-400">{selectedRole.name}</span>
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1">Chi tiết các quyền được cấp cho vai trò này</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái:</span>
                                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg tracking-wider">Đang hoạt động</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {Object.entries(moduleCategories).map(([category, modules]) => {
                                                const isExpanded = expandedCategories[category];
                                                const grantedCount = modules.reduce((acc, modName) => {
                                                    return acc + (selectedRole.permissions[modName]?.filter(p => p.granted).length || 0);
                                                }, 0);
                                                const totalCount = modules.reduce((acc, modName) => {
                                                    return acc + (selectedRole.permissions[modName]?.length || 0);
                                                }, 0);

                                                return (
                                                    <div key={category} className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
                                                        <button 
                                                            onClick={() => toggleCategory(category)}
                                                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800"
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl mr-3">
                                                                    {moduleIcons[category] || <SettingsIcon className="w-5 h-5" />}
                                                                </div>
                                                                <div className="text-left">
                                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{category}</h4>
                                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                                                        {grantedCount}/{totalCount} quyền được cấp
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        
                                                        {isExpanded && (
                                                            <div className="p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                                                {modules.map(moduleName => {
                                                                    const perms = selectedRole.permissions[moduleName] || [];
                                                                    if (perms.length === 0) return null;

                                                                    return (
                                                                        <div key={moduleName} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                                            <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                                                                                {moduleName}
                                                                            </h5>
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                {perms.map(p => (
                                                                                    <div key={p.id} className={`flex items-center p-2 rounded-lg border transition-all ${
                                                                                        p.granted 
                                                                                            ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' 
                                                                                            : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60'
                                                                                    }`}>
                                                                                        <div className={`mr-2 flex-shrink-0 ${p.granted ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                                                            {p.granted ? <CheckCircleIconSolid className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                                                                                        </div>
                                                                                        <span className={`text-[11px] font-bold leading-tight ${p.granted ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                                                                                            {p.description.split(' dữ liệu ')[0]}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-full mb-4">
                                            <LockClosedIcon className="w-12 h-12 opacity-20" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Chưa chọn vai trò</h3>
                                        <p className="text-sm max-w-xs text-center">Vui lòng chọn một vai trò từ danh sách bên trái để xem và quản lý các quyền hạn chi tiết.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nhật ký Hoạt động</h3>
                                <p className="text-sm text-slate-500">Theo dõi các thay đổi và truy cập hệ thống quan trọng</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
                                    Xuất báo cáo
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
                                    Lọc dữ liệu
                                </button>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-black">Thời gian</th>
                                        <th scope="col" className="px-6 py-4 font-black">Người dùng</th>
                                        <th scope="col" className="px-6 py-4 font-black">Vai trò</th>
                                        <th scope="col" className="px-6 py-4 font-black">Hành động</th>
                                        <th scope="col" className="px-6 py-4 font-black">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {auditLogs.map(log => (
                                        <tr key={log.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 dark:text-slate-200 font-bold">{log.timestamp.split(' ')[1]}</span>
                                                    <span className="text-[10px] text-slate-400">{log.timestamp.split(' ')[0]}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 font-black text-xs">
                                                        {log.user.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-900 dark:text-white">{log.user}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg uppercase">
                                                    {log.userRole}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${
                                                    log.action.includes('Đăng nhập') ? 'text-blue-600' : 
                                                    log.action.includes('Xóa') ? 'text-red-600' : 
                                                    log.action.includes('Tạo') ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'
                                                }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-slate-500 dark:text-slate-400 max-w-xs truncate" title={log.details}>
                                                    {log.details}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <dialog ref={deleteModalRef} className="rounded-lg shadow-xl p-0 w-full max-w-md bg-white dark:bg-gray-800 backdrop:bg-black backdrop:bg-opacity-50">
                {roleToDelete && (
                    <>
                        <div className="p-6 text-center">
                            <h3 className="text-lg font-bold">Xác nhận Xóa</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Bạn có chắc chắn muốn xóa vai trò <span className="font-bold">{roleToDelete.name}</span>?
                            </p>
                        </div>
                        <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2">
                            <button onClick={() => deleteModalRef.current?.close()} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700">Xác nhận Xóa</button>
                        </div>
                    </>
                )}
            </dialog>
        </>
    );
};

// --- RoleFormView Component (replaces modal) ---
interface RoleFormViewProps {
    role: Role | null;
    onSave: (data: { name: string; permissions: Record<string, Permission[]> }) => void;
    onCancel: () => void;
}

const allRegularModuleIds = Object.values(allModules).filter(id => id !== 'ai-chat');

const ColumnHeaderCheckbox: React.FC<{
    action: 'xem' | 'thêm' | 'sửa' | 'xóa';
    permissionsMap: Record<string, Record<string, boolean>>;
    onToggle: (checked: boolean) => void;
}> = ({ action, permissionsMap, onToggle }) => {
    const ref = useRef<HTMLInputElement>(null);
    const checkedCount = allRegularModuleIds.filter(id => permissionsMap[id]?.[action]).length;
    const isChecked = checkedCount === allRegularModuleIds.length;
    const isIndeterminate = checkedCount > 0 && !isChecked;

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = isIndeterminate;
        }
    }, [isIndeterminate]);
    
    return (
        <input 
            type="checkbox"
            ref={ref}
            checked={isChecked}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
    );
};

const RoleFormView: React.FC<RoleFormViewProps> = ({ role, onSave, onCancel }) => {
    const [name, setName] = useState(role?.name || '');
    const [permissionsMap, setPermissionsMap] = useState<Record<string, Record<string, boolean>>>(() => {
        const initialMap: Record<string, Record<string, boolean>> = {};
        for (const moduleId of Object.values(allModules)) {
            initialMap[moduleId] = { xem: false, thêm: false, sửa: false, xóa: false };
        }

        if (!role) return initialMap;

        for (const moduleName in role.permissions) {
            const moduleId = allModules[moduleName];
            if (moduleId) {
                for (const p of role.permissions[moduleName]) {
                    const action = p.id.split('-').pop()!;
                    initialMap[moduleId][action === 'use' ? 'xem' : action] = p.granted;
                }
            }
        }
        return initialMap;
    });

    const handlePermissionChange = (moduleId: string, action: string, checked: boolean) => {
        setPermissionsMap(prev => ({
            ...prev,
            [moduleId]: {
                ...prev[moduleId],
                [action]: checked
            }
        }));
    };
    
    const handleToggleAllColumn = (action: string, checked: boolean) => {
        setPermissionsMap(prev => {
            const newMap = { ...prev };
            allRegularModuleIds.forEach(id => {
                newMap[id] = { ...newMap[id], [action]: checked };
            });
            return newMap;
        });
    };

    const handleToggleAllRow = (moduleId: string, checked: boolean) => {
        setPermissionsMap(prev => ({
            ...prev,
            [moduleId]: { xem: checked, thêm: checked, sửa: checked, xóa: checked }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const permissions: Record<string, Permission[]> = {};
        for (const moduleName in allModules) {
            const moduleId = allModules[moduleName];
            const grants = Object.entries(permissionsMap[moduleId] || {}).filter(([, granted]) => granted).map(([action]) => action as 'xem' | 'thêm' | 'sửa' | 'xóa');
            permissions[moduleName] = createPermissions(moduleName, moduleId, grants);
        }
        onSave({ name, permissions });
    };

    return (
        <div className="modern-card p-6 h-full flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-6">
                    <button type="button" onClick={onCancel} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold">{role ? `Chỉnh sửa vai trò: ${role.name}` : 'Thêm vai trò mới'}</h2>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-6 pr-4 -mr-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên Vai trò</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full max-w-md p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Phân quyền chi tiết</h4>
                        <div className="border dark:border-gray-600 rounded-lg overflow-x-auto">
                            <table className="w-full text-sm table-fixed min-w-[800px]">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-left w-2/5 font-semibold">Module chức năng</th>
                                        <th className="px-4 py-3 w-[10%] text-center font-semibold">Tất cả</th>
                                        {permissionActions.map(action => (
                                            <th key={action} className="px-4 py-3 w-[12%] text-center font-semibold">
                                                <div className="flex flex-col items-center">
                                                    <span>{actionText[action]}</span>
                                                    <ColumnHeaderCheckbox action={action} permissionsMap={permissionsMap} onToggle={(checked) => handleToggleAllColumn(action, checked)} />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                {Object.entries(moduleCategories).map(([category, modules]) => (
                                    <tbody key={category} className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr><td colSpan={6} className="px-4 py-2 bg-gray-100 dark:bg-gray-900/50 font-bold text-base text-gray-800 dark:text-gray-200">{category}</td></tr>
                                        {modules.map(moduleName => {
                                            const moduleId = allModules[moduleName];
                                            const isSpecialModule = moduleId === 'ai-chat';
                                            
                                            const rowCheckedCount = permissionActions.filter(action => permissionsMap[moduleId]?.[action]).length;
                                            const isRowChecked = rowCheckedCount === 4;
                                            const isRowIndeterminate = rowCheckedCount > 0 && !isRowChecked;

                                            return (
                                                <tr key={moduleId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                    <td className="px-4 py-3 font-medium">{moduleName}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {/* FIX: The ref callback should not return a value. Changed the arrow function to use a block body to prevent an implicit return. */}
                                                        {!isSpecialModule && <input type="checkbox" checked={isRowChecked} ref={el => { if (el) el.indeterminate = isRowIndeterminate; }} onChange={e => handleToggleAllRow(moduleId, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>}
                                                    </td>
                                                    {isSpecialModule ? (
                                                        <td className="px-4 py-3 text-center" colSpan={4}>
                                                            <label className="flex items-center justify-center space-x-2">
                                                                <input type="checkbox" checked={permissionsMap[moduleId]?.xem || false} onChange={(e) => handlePermissionChange(moduleId, 'xem', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                                <span>Sử dụng</span>
                                                            </label>
                                                        </td>
                                                    ) : (
                                                        permissionActions.map(action => (
                                                            <td key={action} className="px-4 py-3 text-center">
                                                                <input type="checkbox" checked={permissionsMap[moduleId]?.[action] || false} onChange={(e) => handlePermissionChange(moduleId, action, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                                            </td>
                                                        ))
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-900/50 space-x-2 mt-auto border-t dark:border-gray-700 flex-shrink-0">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default SecurityManagement;
