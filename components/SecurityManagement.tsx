import React, { useState, useMemo, useEffect, useRef } from 'react';
import { type Role, type AuditLog, type Permission, type UserRole } from '../types';

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

type Tab = 'roles' | 'audit';
type View = 'list' | 'form';

interface SecurityManagementProps {
    currentUserRole: UserRole;
}

const SecurityManagement: React.FC<SecurityManagementProps> = ({ currentUserRole }) => {
    const [activeTab, setActiveTab] = useState<Tab>('roles');
    const [view, setView] = useState<View>('list');
    const [roles, setRoles] = useState<Role[]>(mockRolesData);
    const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0] || null);
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const deleteModalRef = useRef<HTMLDialogElement>(null);
    
    const canManage = currentUserRole === 'Quản trị Hệ thống';

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
        
        const newRoles = roles.filter(r => r.id !== roleToDelete.id);
        setRoles(newRoles);

        if (selectedRole?.id === roleToDelete.id) {
            setSelectedRole(newRoles[0] || null);
        }
        
        setRoleToDelete(null);
        deleteModalRef.current?.close();
    };

    const handleSaveRole = (formData: { name: string; permissions: Record<string, Permission[]> }) => {
        if (roleToEdit) { // Update
            const updatedRole = { ...roleToEdit, ...formData };
            setRoles(prev => prev.map(r => r.id === roleToEdit.id ? updatedRole : r));
            setSelectedRole(updatedRole);
        } else { // Add new
            const newRole: Role = { id: `R${Date.now()}`, ...formData };
            setRoles(prev => [...prev, newRole]);
            setSelectedRole(newRole);
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Danh sách Vai trò</h3>
                            {canManage && (
                                <button
                                    onClick={handleAddNew}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Thêm vai trò mới
                                </button>
                            )}
                        </div>
                        <div className="flex gap-6">
                            <div className="w-1/3">
                                <ul className="space-y-1 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                    {roles.map(role => (
                                        <li key={role.id} onClick={() => setSelectedRole(role)} className={`group w-full text-left p-3 rounded-lg text-sm flex justify-between items-center cursor-pointer ${selectedRole?.id === role.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                            <span>{role.name}</span>
                                            {canManage && 
                                                <div className="hidden group-hover:flex items-center space-x-2">
                                                    <button onClick={(e) => {e.stopPropagation(); handleEdit(role)}}><PencilIcon className="w-4 h-4 text-yellow-500"/></button>
                                                    <button onClick={(e) => {e.stopPropagation(); handleDelete(role)}}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                                                </div>
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-2/3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                {selectedRole ? (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Quyền của vai trò: <span className="text-blue-600 dark:text-blue-400">{selectedRole.name}</span></h3>
                                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                            {Object.keys(selectedRole.permissions).map((category) => (
                                                (selectedRole.permissions[category]?.length > 0 && 
                                                <div key={category}>
                                                    <h4 className="font-bold text-md mb-2">{category}</h4>
                                                    <ul className="space-y-2 pl-4">
                                                        {selectedRole.permissions[category].map(p => (
                                                            <li key={p.id} className="flex items-center text-sm">
                                                                <CheckCircleIcon granted={p.granted} />
                                                                <span className={`${p.granted ? '' : 'text-gray-400'}`}>{p.description}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                ) : <p>Chọn một vai trò để xem quyền.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Thời gian</th>
                                    <th scope="col" className="px-6 py-3">Người dùng</th>
                                    <th scope="col" className="px-6 py-3">Vai trò</th>
                                    <th scope="col" className="px-6 py-3">Hành động</th>
                                    <th scope="col" className="px-6 py-3">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockAuditLog.map(log => (
                                    <tr key={log.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">{log.timestamp}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{log.user}</td>
                                        <td className="px-6 py-4">{log.userRole}</td>
                                        <td className="px-6 py-4 font-semibold">{log.action}</td>
                                        <td className="px-6 py-4">{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
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


// --- ICONS ---
const CheckCircleIcon: React.FC<{granted: boolean}> = ({ granted }) => granted
    ? <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    : <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlusIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const PencilIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;


export default SecurityManagement;