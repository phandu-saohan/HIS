import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { type Medication, type MedicationCategory, type Supplier } from '../types';
import Card from './ui/Card';

interface PharmacyManagementProps {
    medications: Medication[];
    setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
    categories: MedicationCategory[];
    setCategories: React.Dispatch<React.SetStateAction<MedicationCategory[]>>;
    suppliers: Supplier[];
    setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

const LOW_STOCK_THRESHOLD = 50;
const EXPIRY_THRESHOLD_DAYS = 30;

type PharmacyTab = 'dashboard' | 'list' | 'categories' | 'suppliers';

const PharmacyManagement: React.FC<PharmacyManagementProps> = ({ medications, setMedications, categories, setCategories, suppliers, setSuppliers }) => {
    const [activeTab, setActiveTab] = useState<PharmacyTab>('dashboard');
    const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
    const [medicationToEdit, setMedicationToEdit] = useState<Medication | null>(null);

    const handleAddNewMedication = () => {
        setMedicationToEdit(null);
        setIsMedicationModalOpen(true);
    };

    const handleEditMedication = (med: Medication) => {
        setMedicationToEdit(med);
        setIsMedicationModalOpen(true);
    };

    const handleDeleteMedication = (medId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
            setMedications(prev => prev.filter(m => m.id !== medId));
        }
    }

    const handleSaveMedication = (medData: Omit<Medication, 'id'>, id?: string) => {
        if (id) {
            setMedications(prev => prev.map(m => m.id === id ? { ...medData, id } : m));
        } else {
            const newMed = { ...medData, id: `MED${Date.now()}` };
            setMedications(prev => [newMed, ...prev]);
        }
        setIsMedicationModalOpen(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quản lý Dược phẩm</h2>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    <TabButton text="Tổng quan" tab="dashboard" activeTab={activeTab} onClick={setActiveTab} icon={<ChartBarIcon />} />
                    <TabButton text="Danh sách Thuốc" tab="list" activeTab={activeTab} onClick={setActiveTab} icon={<ClipboardListIcon />} />
                    <TabButton text="Danh mục thuốc" tab="categories" activeTab={activeTab} onClick={setActiveTab} icon={<TagIcon />} />
                    <TabButton text="Nhà cung cấp" tab="suppliers" activeTab={activeTab} onClick={setActiveTab} icon={<TruckIcon />} />
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === 'dashboard' && <DashboardView medications={medications} />}
                {activeTab === 'list' && <MedicationListView medications={medications} onAddNew={handleAddNewMedication} onEdit={handleEditMedication} onDelete={handleDeleteMedication} categories={categories} suppliers={suppliers} />}
                {activeTab === 'categories' && <CategoryManagementView categories={categories} setCategories={setCategories} />}
                {activeTab === 'suppliers' && <SupplierManagementView suppliers={suppliers} setSuppliers={setSuppliers} />}
            </div>
            {isMedicationModalOpen && (
                <MedicationFormModal
                    medication={medicationToEdit}
                    onSave={handleSaveMedication}
                    onClose={() => setIsMedicationModalOpen(false)}
                    categories={categories}
                    suppliers={suppliers}
                />
            )}
        </div>
    );
};

const TabButton: React.FC<{ text: string, tab: PharmacyTab, activeTab: string, onClick: (tab: any) => void, icon: React.ReactNode }> = ({ text, tab, activeTab, onClick, icon }) => (
    <button onClick={() => onClick(tab)} className={`flex items-center space-x-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {icon}
        <span>{text}</span>
    </button>
);

const isExpiringSoon = (expiryDate: string) => {
    const soon = new Date();
    soon.setDate(soon.getDate() + EXPIRY_THRESHOLD_DAYS);
    return new Date(expiryDate) < soon && new Date(expiryDate) > new Date();
};

const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();


// Dashboard View
const DashboardView: React.FC<{ medications: Medication[] }> = ({ medications }) => {
    const stats = useMemo(() => {
        const lowStockItems = medications.filter(m => m.stock < LOW_STOCK_THRESHOLD).length;
        const expiringSoonItems = medications.filter(m => isExpiringSoon(m.expiryDate)).length;
        const totalValue = medications.reduce((sum, m) => sum + (m.stock * m.cost), 0);
        return { lowStockItems, expiringSoonItems, totalValue };
    }, [medications]);

    const categoryData = useMemo(() => {
        const categories = medications.reduce((acc, med) => {
            acc[med.category] = (acc[med.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [medications]);

    const lowStockChartData = useMemo(() => {
        return medications
            .filter(m => m.stock < LOW_STOCK_THRESHOLD * 2)
            .sort((a, b) => a.stock - b.stock)
            .slice(0, 5);
    }, [medications]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Tổng số loại thuốc (SKU)" value={medications.length} icon={<CubeIcon />} color="bg-blue-100 dark:bg-blue-900 text-blue-500" />
                <Card title="Sắp hết hàng" value={stats.lowStockItems} icon={<ExclamationCircleIcon />} color="bg-yellow-100 dark:bg-yellow-900 text-yellow-500" />
                <Card title="Sắp hết hạn" value={stats.expiringSoonItems} icon={<CalendarIcon />} color="bg-red-100 dark:bg-red-900 text-red-500" />
                <Card title="Tổng giá trị kho" value={stats.totalValue.toLocaleString('vi-VN') + ' đ'} icon={<CurrencyDollarIcon />} color="bg-green-100 dark:bg-green-900 text-green-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Các thuốc có tồn kho thấp nhất</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={lowStockChartData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                            <XAxis type="number" stroke="rgb(156 163 175)" />
                            <YAxis type="category" dataKey="name" stroke="rgb(156 163 175)" width={120} fontSize="12" />
                            <Tooltip wrapperClassName="!bg-gray-700 !border-gray-600 !rounded-lg" contentStyle={{ backgroundColor: 'transparent', border: 'none' }} itemStyle={{ color: 'white' }} labelStyle={{ color: 'rgb(156 163 175)' }} />
                            <Bar dataKey="stock" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Tồn kho"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Phân loại thuốc</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} fill="#8884d8" dataKey="value" nameKey="name">
                                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip wrapperClassName="!bg-gray-700 !border-gray-600 !rounded-lg" contentStyle={{ backgroundColor: 'transparent', border: 'none' }} itemStyle={{ color: 'white' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


// Medication List View
const MedicationListView: React.FC<{ medications: Medication[], onAddNew: () => void, onEdit: (med: Medication) => void, onDelete: (id: string) => void, categories: MedicationCategory[], suppliers: Supplier[] }> = ({ medications, onAddNew, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredMeds = useMemo(() => medications.filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase())), [medications, searchTerm]);

    const getStockStatus = (med: Medication) => {
        if (isExpired(med.expiryDate)) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-400 text-white">Hết hạn</span>;
        if (med.stock === 0) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-800">Hết hàng</span>;
        if (med.stock < LOW_STOCK_THRESHOLD) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">Sắp hết</span>;
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">Còn hàng</span>;
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <input type="text" placeholder="Tìm kiếm thuốc..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                </div>
                <button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon /> <span className="ml-2">Thêm thuốc mới</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Tên thuốc</th>
                            <th className="px-6 py-3">Danh mục</th>
                            <th className="px-6 py-3">Tồn kho</th>
                            <th className="px-6 py-3">Hạn sử dụng</th>
                            <th className="px-6 py-3">Nhà cung cấp</th>
                            <th className="px-6 py-3">Trạng thái</th>
                            <th className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMeds.map((med) => (
                            <tr key={med.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{med.name}</td>
                                <td className="px-6 py-4">{med.category}</td>
                                <td className="px-6 py-4">{med.stock} {med.unit}</td>
                                <td className={`px-6 py-4 ${isExpiringSoon(med.expiryDate) ? 'text-yellow-500 font-bold' : ''} ${isExpired(med.expiryDate) ? 'text-red-500 font-bold' : ''}`}>
                                    {med.expiryDate}
                                    {isExpiringSoon(med.expiryDate) && <span className="text-xs ml-1">(Sắp hết hạn)</span>}
                                    {isExpired(med.expiryDate) && <span className="text-xs ml-1">(Đã hết hạn)</span>}
                                </td>
                                <td className="px-6 py-4">{med.supplier}</td>
                                <td className="px-6 py-4">{getStockStatus(med)}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => onEdit(med)} className="p-1 text-yellow-500 hover:text-yellow-700"><PencilIcon /></button>
                                    <button onClick={() => onDelete(med.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Medication Form Modal
const MedicationFormModal: React.FC<{ medication: Medication | null, onSave: (med: Omit<Medication, 'id'>, id?: string) => void, onClose: () => void, categories: MedicationCategory[], suppliers: Supplier[] }> = ({ medication, onSave, onClose, categories, suppliers }) => {
    const [formData, setFormData] = useState({
        name: medication?.name || '', 
        category: medication?.category || '', 
        stock: medication?.stock || 0, 
        unit: medication?.unit || 'Viên', 
        supplier: medication?.supplier || '', 
        cost: medication?.cost || 0, 
        expiryDate: medication?.expiryDate || '', 
        location: medication?.location || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, medication?.id);
    };

    const inputClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold">{medication ? 'Chỉnh sửa thông tin Thuốc' : 'Thêm thuốc mới'}</h3>
                </div>
                <form id="med-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium">Tên thuốc</label><input name="name" value={formData.name} onChange={handleChange} required className={inputClass} /></div>
                        <div>
                            <label className="block text-sm font-medium">Danh mục</label>
                            <select name="category" value={formData.category} onChange={handleChange} required className={inputClass}>
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium">Tồn kho</label><input name="stock" type="number" value={formData.stock} onChange={handleChange} required className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">Đơn vị</label><input name="unit" value={formData.unit} onChange={handleChange} required className={inputClass} /></div>
                        <div>
                            <label className="block text-sm font-medium">Nhà cung cấp</label>
                            <select name="supplier" value={formData.supplier} onChange={handleChange} required className={inputClass}>
                                <option value="">-- Chọn nhà cung cấp --</option>
                                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium">Giá nhập (trên 1 đơn vị)</label><input name="cost" type="number" value={formData.cost} onChange={handleChange} required className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">Hạn sử dụng</label><input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} required className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">Vị trí kho</label><input name="location" value={formData.location} onChange={handleChange} required className={inputClass} /></div>
                    </div>
                </form>
                <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2 mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                    <button type="submit" form="med-form" className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">Lưu</button>
                </div>
            </div>
        </div>
    );
};

// Category Management View
const CategoryManagementView: React.FC<{ categories: MedicationCategory[], setCategories: React.Dispatch<React.SetStateAction<MedicationCategory[]>> }> = ({ categories, setCategories }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toEdit, setToEdit] = useState<MedicationCategory | null>(null);

    const handleSave = (data: Omit<MedicationCategory, 'id'>, id?: string) => {
        if (id) {
            setCategories(prev => prev.map(c => c.id === id ? { ...data, id } : c));
        } else {
            setCategories(prev => [{ ...data, id: `CAT${Date.now()}` }, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
            setCategories(prev => prev.filter(c => c.id !== id));
        }
    };
    
    return (
        <div>
             <div className="flex justify-end mb-4">
                <button onClick={() => { setToEdit(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon /> <span className="ml-2">Thêm danh mục</span>
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Tên danh mục</th>
                            <th className="px-6 py-3">Mô tả</th>
                            <th className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{c.name}</td>
                                <td className="px-6 py-4">{c.description}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => { setToEdit(c); setIsModalOpen(true); }} className="p-1 text-yellow-500 hover:text-yellow-700"><PencilIcon /></button>
                                    <button onClick={() => handleDelete(c.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <CategoryFormModal category={toEdit} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

const CategoryFormModal: React.FC<{ category: MedicationCategory | null, onSave: (data: Omit<MedicationCategory, 'id'>, id?: string) => void, onClose: () => void }> = ({ category, onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: category?.name || '', description: category?.description || '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData, category?.id); };
    const inputClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600";
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold">{category ? 'Sửa' : 'Thêm'} danh mục</h3></div>
                    <div className="p-6 space-y-4">
                        <div><label className="block text-sm font-medium">Tên danh mục</label><input value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} required className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">Mô tả</label><textarea value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} rows={3} required className={inputClass} /></div>
                    </div>
                    <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2"><button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-200">Hủy</button><button type="submit" className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white">Lưu</button></div>
                </form>
            </div>
        </div>
    );
};

// Supplier Management View
const SupplierManagementView: React.FC<{ suppliers: Supplier[], setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>> }> = ({ suppliers, setSuppliers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toEdit, setToEdit] = useState<Supplier | null>(null);

    const handleSave = (data: Omit<Supplier, 'id'>, id?: string) => {
        if (id) {
            setSuppliers(prev => prev.map(s => s.id === id ? { ...data, id } : s));
        } else {
            setSuppliers(prev => [{ ...data, id: `SUP${Date.now()}` }, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) {
            setSuppliers(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <div>
             <div className="flex justify-end mb-4">
                <button onClick={() => { setToEdit(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon /> <span className="ml-2">Thêm nhà cung cấp</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Tên NCC</th>
                            <th className="px-6 py-3">Người liên hệ</th>
                            <th className="px-6 py-3">Điện thoại</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(s => (
                            <tr key={s.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium">{s.name}</td>
                                <td className="px-6 py-4">{s.contactPerson}</td>
                                <td className="px-6 py-4">{s.phone}</td>
                                <td className="px-6 py-4">{s.email}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => { setToEdit(s); setIsModalOpen(true); }} className="p-1 text-yellow-500"><PencilIcon /></button>
                                    <button onClick={() => handleDelete(s.id)} className="p-1 text-red-500"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <SupplierFormModal supplier={toEdit} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const SupplierFormModal: React.FC<{ supplier: Supplier | null, onSave: (data: Omit<Supplier, 'id'>, id?: string) => void, onClose: () => void }> = ({ supplier, onSave, onClose }) => {
    const [formData, setFormData] = useState({ 
        name: supplier?.name || '', 
        contactPerson: supplier?.contactPerson || '', 
        phone: supplier?.phone || '', 
        email: supplier?.email || '', 
        address: supplier?.address || '' 
    });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData, supplier?.id); };
    const inputClass = "mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700";
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold">{supplier ? 'Sửa' : 'Thêm'} nhà cung cấp</h3></div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm">Tên NCC</label><input value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} required className={inputClass} /></div>
                        <div><label className="block text-sm">Người liên hệ</label><input value={formData.contactPerson} onChange={e => setFormData(p => ({...p, contactPerson: e.target.value}))} required className={inputClass} /></div>
                        <div><label className="block text-sm">Điện thoại</label><input value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} required className={inputClass} /></div>
                        <div><label className="block text-sm">Email</label><input type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} required className={inputClass} /></div>
                        <div className="md:col-span-2"><label className="block text-sm">Địa chỉ</label><input value={formData.address} onChange={e => setFormData(p => ({...p, address: e.target.value}))} required className={inputClass} /></div>
                    </div>
                    <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2"><button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-200">Hủy</button><button type="submit" className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white">Lưu</button></div>
                </form>
            </div>
        </div>
    );
};


// Icons
const ChartBarIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ClipboardListIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const CubeIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const ExclamationCircleIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CalendarIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const CurrencyDollarIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0 12v-1m0-1c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" /></svg>;
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const TagIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM11 3L5 9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2m4-10v2m0 4v2m-8-4h.01" /></svg>;
const TruckIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zM8 5.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2 .5a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0v-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.923 7.077a2 2 0 01.387-1.364l-1.364-.387a2 2 0 01-1.364.387l-.387-1.364a2 2 0 01-1.364-.387L12 5.077l-1.192.341a2 2 0 01-1.364.387l-.387 1.364a2 2 0 01-1.364-.387l-1.364.387a2 2 0 01.387 1.364l.387 1.364a2 2 0 01-.387 1.364l1.364.387a2 2 0 011.364-.387l.387 1.364a2 2 0 011.364.387l1.192-.341 1.192.341a2 2 0 011.364-.387l.387-1.364a2 2 0 011.364.387l1.364-.387a2 2 0 01-.387-1.364l-.387-1.364z" /></svg>;

export default PharmacyManagement;