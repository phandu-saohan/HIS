import React, { useState } from 'react';
import { type ServiceItem } from '../types';
import { mockServiceItems, mockDepartments } from '../data/mockData';

const ServiceMasterManagement: React.FC = () => {
    const [services, setServices] = useState<ServiceItem[]>(mockServiceItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<ServiceItem | null>(null);

    const handleSave = (formData: Omit<ServiceItem, 'id'>, id?: string) => {
        if (id) {
            setServices(prev => prev.map(s => s.id === id ? { ...s, ...formData } : s));
        } else {
            setServices(prev => [{ ...formData, id: `SRV${Date.now()}` }, ...prev]);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Quản lý Danh mục Dịch vụ</h2>
                    <button onClick={() => { setServiceToEdit(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusIcon /> <span className="ml-2">Thêm dịch vụ</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Tên Dịch vụ</th>
                                <th className="px-6 py-3">Phân loại</th>
                                <th className="px-6 py-3">Khoa/Phòng</th>
                                <th className="px-6 py-3 text-right">Đơn giá (VND)</th>
                                <th className="px-6 py-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(service => (
                                <tr key={service.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium">{service.name}</td>
                                    <td className="px-6 py-4">{service.category}</td>
                                    <td className="px-6 py-4">{mockDepartments.find(d => d.id === service.departmentId)?.name || 'Chung'}</td>
                                    <td className="px-6 py-4 text-right font-mono">{service.price.toLocaleString('vi-VN')}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => { setServiceToEdit(service); setIsModalOpen(true); }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Sửa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <ServiceFormModal service={serviceToEdit} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

// Form Modal
const ServiceFormModal: React.FC<{ service: ServiceItem | null, onSave: (data: Omit<ServiceItem, 'id'>, id?: string) => void, onClose: () => void }> = ({ service, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: service?.name || '',
        category: service?.category || 'Dịch vụ lâm sàng',
        departmentId: service?.departmentId || 'DEPT03',
        price: service?.price || 0
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({...prev, [name]: type === 'number' ? parseFloat(value) : value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, service?.id);
    }

    const inputClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500";
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold">{service ? 'Sửa' : 'Thêm'} Dịch vụ</h3></div>
                    <div className="p-6 space-y-4">
                        <div><label className="text-sm font-medium">Tên dịch vụ</label><input name="name" value={formData.name} onChange={handleChange} required className={inputClass} /></div>
                        <div><label className="text-sm font-medium">Phân loại</label><input name="category" value={formData.category} onChange={handleChange} required className={inputClass} /></div>
                        <div><label className="text-sm font-medium">Khoa/Phòng</label>
                            <select name="departmentId" value={formData.departmentId} onChange={handleChange} className={inputClass}>
                                {mockDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div><label className="text-sm font-medium">Đơn giá</label><input name="price" type="number" value={formData.price} onChange={handleChange} required className={inputClass} /></div>
                    </div>
                    <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                        <button type="submit" className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;

export default ServiceMasterManagement;
