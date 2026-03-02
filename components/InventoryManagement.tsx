import React, { useState } from 'react';
import { type MedicalSupply } from '../types';

interface InventoryManagementProps {
    supplies: MedicalSupply[];
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ supplies }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSupplies = supplies.filter(supply => 
        supply.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="modern-card p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý Vật tư Y tế</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm vật tư..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tên vật tư</th>
                            <th scope="col" className="px-6 py-3">Danh mục</th>
                            <th scope="col" className="px-6 py-3">Tồn kho</th>
                            <th scope="col" className="px-6 py-3">Nhà cung cấp</th>
                            <th scope="col" className="px-6 py-3">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSupplies.map((supply) => (
                            <tr key={supply.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{supply.name}</td>
                                <td className="px-6 py-4">{supply.category}</td>
                                <td className="px-6 py-4">{supply.stock}</td>
                                <td className="px-6 py-4">{supply.supplier}</td>
                                <td className="px-6 py-4">
                                    {supply.stock < 40 ? (
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                            Cần nhập thêm
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            Còn hàng
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;

export default InventoryManagement;