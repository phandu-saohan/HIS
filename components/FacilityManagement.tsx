import React, { useState, useRef } from 'react';
import { type Department, type ExaminationRoom, type UserRole } from '../types';

const mockDepartments: Department[] = [
    { 
        id: 'DEPT01', name: 'Khoa Tim mạch', head: 'Dr. Emily Carter', 
        rooms: [
            { id: 'R01', name: 'Phòng khám Tim mạch 1', status: 'Sẵn sàng' },
            { id: 'R02', name: 'Phòng khám Tim mạch 2', status: 'Đang sử dụng' },
        ] 
    },
    { 
        id: 'DEPT02', name: 'Khoa Thần kinh', head: 'Dr. John Smith',
        rooms: [
            { id: 'R03', name: 'Phòng khám Thần kinh', status: 'Sẵn sàng' },
        ]
    },
    { 
        id: 'DEPT03', name: 'Khoa Khám bệnh', head: 'Dr. Michael Chen',
        rooms: [
            { id: 'R04', name: 'Phòng khám Tổng quát 1', status: 'Sẵn sàng' },
            { id: 'R05', name: 'Phòng khám Tổng quát 2', status: 'Bảo trì' },
            { id: 'R06', name: 'Phòng khám Tổng quát 3', status: 'Sẵn sàng' },
        ]
    },
];

interface FacilityManagementProps {
    currentUserRole: UserRole;
}

const FacilityManagement: React.FC<FacilityManagementProps> = ({ currentUserRole }) => {
    const [departments, setDepartments] = useState<Department[]>(mockDepartments);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    
    const canManage = ['Quản lý', 'Quản trị Hệ thống'].includes(currentUserRole);
    
    const roomModalRef = useRef<HTMLDialogElement>(null);
    const deptModalRef = useRef<HTMLDialogElement>(null);
    const deleteModalRef = useRef<HTMLDialogElement>(null);

    const handleOpenManageRooms = (dept: Department) => {
        setSelectedDepartment(dept);
        roomModalRef.current?.showModal();
    }

    const handleOpenAddDept = () => {
        setDepartmentToEdit(null);
        setIsDeptModalOpen(true);
        deptModalRef.current?.showModal();
    }

    const handleOpenEditDept = (dept: Department) => {
        setDepartmentToEdit(dept);
        setIsDeptModalOpen(true);
        deptModalRef.current?.showModal();
    }
    
    const handleOpenDeleteDept = (dept: Department) => {
        setDepartmentToDelete(dept);
        deleteModalRef.current?.showModal();
    }

    const handleSaveDepartment = (formData: Omit<Department, 'id' | 'rooms'>) => {
        if (departmentToEdit) { // Edit mode
            setDepartments(deps => deps.map(d => d.id === departmentToEdit.id ? { ...departmentToEdit, ...formData } : d));
        } else { // Add mode
            const newDept: Department = { id: `DEPT${Date.now()}`, ...formData, rooms: [] };
            setDepartments(deps => [newDept, ...deps]);
        }
        deptModalRef.current?.close();
    }

    const handleConfirmDelete = () => {
        if (departmentToDelete) {
            setDepartments(deps => deps.filter(d => d.id !== departmentToDelete.id));
            deleteModalRef.current?.close();
        }
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Quản lý Khoa & Cơ sở vật chất</h2>
                    {canManage && (
                        <button onClick={handleOpenAddDept} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                            Thêm Khoa/Phòng
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Mã Khoa</th>
                                <th scope="col" className="px-6 py-3">Tên Khoa</th>
                                <th scope="col" className="px-6 py-3">Trưởng khoa</th>
                                <th scope="col" className="px-6 py-3">Số phòng khám</th>
                                <th scope="col" className="px-6 py-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dept) => (
                                <tr key={dept.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-mono">{dept.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{dept.name}</td>
                                    <td className="px-6 py-4">{dept.head}</td>
                                    <td className="px-6 py-4">{dept.rooms.length}</td>
                                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                        <button onClick={() => handleOpenManageRooms(dept)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Quản lý Phòng khám</button>
                                        {canManage && <button onClick={() => handleOpenEditDept(dept)} className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline">Sửa</button>}
                                        {canManage && <button onClick={() => handleOpenDeleteDept(dept)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Xóa</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Manage Rooms Modal */}
            <dialog ref={roomModalRef} className="rounded-lg shadow-xl p-0 w-full max-w-2xl bg-white dark:bg-gray-800 backdrop:bg-black backdrop:bg-opacity-50">
                {selectedDepartment && <RoomManager department={selectedDepartment} setDepartments={setDepartments} canManage={canManage} onClose={() => roomModalRef.current?.close()} />}
            </dialog>
            {/* Add/Edit Department Modal */}
            <dialog ref={deptModalRef} className="rounded-lg shadow-xl p-0 w-full max-w-md bg-white dark:bg-gray-800 backdrop:bg-black backdrop:bg-opacity-50">
                <DepartmentForm
                    department={departmentToEdit}
                    onSave={handleSaveDepartment}
                    onClose={() => deptModalRef.current?.close()}
                />
            </dialog>
             {/* Delete Department Modal */}
            <dialog ref={deleteModalRef} className="rounded-lg shadow-xl p-0 w-full max-w-md bg-white dark:bg-gray-800 backdrop:bg-black backdrop:bg-opacity-50">
                 {departmentToDelete && (
                    <>
                        <div className="p-6 text-center">
                            <h3 className="text-lg font-bold">Xác nhận Xóa</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Bạn có chắc chắn muốn xóa khoa <span className="font-bold">{departmentToDelete.name}</span>? Hành động này sẽ xóa cả các phòng khám trực thuộc.</p>
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

// RoomManager sub-component
const RoomManager: React.FC<{ department: Department, setDepartments: React.Dispatch<React.SetStateAction<Department[]>>, canManage: boolean, onClose: () => void }> = ({ department, setDepartments, canManage, onClose }) => {
    const [roomToEdit, setRoomToEdit] = useState<Partial<ExaminationRoom> | null>(null);

    const handleSaveRoom = (roomData: Omit<ExaminationRoom, 'id'>) => {
        setDepartments(prevDepts => {
            return prevDepts.map(d => {
                if (d.id === department.id) {
                    let newRooms;
                    if (roomToEdit?.id) { // Edit existing room
                        newRooms = d.rooms.map(r => r.id === roomToEdit.id ? { ...r, ...roomData } : r);
                    } else { // Add new room
                        newRooms = [...d.rooms, { id: `R${Date.now()}`, ...roomData }];
                    }
                    return { ...d, rooms: newRooms };
                }
                return d;
            });
        });
        setRoomToEdit(null); // Close the form
    };

    const handleDeleteRoom = (roomId: string) => {
         setDepartments(prevDepts => {
            return prevDepts.map(d => {
                if (d.id === department.id) {
                    return { ...d, rooms: d.rooms.filter(r => r.id !== roomId) };
                }
                return d;
            });
        });
    }

    return (
        <>
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h3 className="text-xl font-bold">Quản lý Phòng khám: <span className="text-blue-500">{department.name}</span></h3>
                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">&times;</button>
            </div>
            <div className="p-6">
                {canManage && !roomToEdit && <button onClick={() => setRoomToEdit({})} className="mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg text-sm">Thêm phòng mới</button>}
                {roomToEdit && <RoomForm room={roomToEdit} onSave={handleSaveRoom} onCancel={() => setRoomToEdit(null)} />}

                <table className="w-full text-sm mt-4">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2">Mã phòng</th>
                            <th className="px-4 py-2">Tên phòng</th>
                            <th className="px-4 py-2">Trạng thái</th>
                            {canManage && <th className="px-4 py-2">Hành động</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {department.rooms.map(room => (
                            <tr key={room.id} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2 font-mono">{room.id}</td>
                                <td className="px-4 py-2">{room.name}</td>
                                <td className="px-4 py-2">{room.status}</td>
                                {canManage && <td className="px-4 py-2 space-x-2">
                                    <button onClick={() => setRoomToEdit(room)} className="font-medium text-yellow-500 hover:underline">Sửa</button>
                                    <button onClick={() => handleDeleteRoom(room.id)} className="font-medium text-red-500 hover:underline">Xóa</button>
                                </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Đóng</button>
            </div>
        </>
    );
};

const RoomForm: React.FC<{ room: Partial<ExaminationRoom>, onSave: (data: Omit<ExaminationRoom, 'id'>) => void, onCancel: () => void }> = ({ room, onSave, onCancel }) => {
    const [name, setName] = useState(room.name || '');
    const [status, setStatus] = useState(room.status || 'Sẵn sàng');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, status: status as ExaminationRoom['status'] });
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 space-y-3">
            <h4 className="font-semibold">{room.id ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}</h4>
             <div className="grid grid-cols-2 gap-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên phòng" required className="p-2 border rounded-md" />
                {/* FIX: Cast the value from the select onChange event to the correct type to resolve a TypeScript error where a generic 'string' was being assigned to a state expecting a specific string literal union type ('Sẵn sàng' | 'Đang sử dụng' | 'Bảo trì'). */}
                <select value={status} onChange={e => setStatus(e.target.value as ExaminationRoom['status'])} className="p-2 border rounded-md">
                    <option>Sẵn sàng</option>
                    <option>Đang sử dụng</option>
                    <option>Bảo trì</option>
                </select>
            </div>
            <div className="space-x-2">
                <button type="submit" className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm">Lưu</button>
                <button type="button" onClick={onCancel} className="bg-gray-300 py-1 px-3 rounded-md text-sm">Hủy</button>
            </div>
        </form>
    );
}

const DepartmentForm: React.FC<{ department: Department | null, onSave: (data: Omit<Department, 'id' | 'rooms'>) => void, onClose: () => void }> = ({ department, onSave, onClose }) => {
    const [name, setName] = useState(department?.name || '');
    const [head, setHead] = useState(department?.head || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, head });
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h3 className="text-xl font-bold">{department ? 'Chỉnh sửa Khoa/Phòng' : 'Thêm Khoa/Phòng mới'}</h3>
                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">&times;</button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tên Khoa/Phòng</label>
                    <input value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Trưởng khoa/Phụ trách</label>
                    <input value={head} onChange={e => setHead(e.target.value)} required className="w-full p-2 border rounded-md" />
                </div>
            </div>
            <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">Lưu</button>
            </div>
        </form>
    )
}

export default FacilityManagement;
