import React, { useState } from 'react';
import { type Asset } from '../types';

const mockAssets: Asset[] = [
    { id: 'ASSET01', name: 'Máy X-Quang', location: 'Phòng CĐHA', status: 'Hoạt động', lastMaintenance: '2024-05-10', nextMaintenance: '2024-11-10' },
    { id: 'ASSET02', name: 'Máy siêu âm', location: 'Phòng siêu âm 1', status: 'Bảo trì', lastMaintenance: '2024-07-20', nextMaintenance: '2025-01-20' },
    { id: 'ASSET03', name: 'Máy thở', location: 'Khoa Hồi sức', status: 'Hoạt động', lastMaintenance: '2024-06-15', nextMaintenance: '2024-12-15' },
    { id: 'ASSET04', name: 'Máy xét nghiệm máu', location: 'Phòng Lab', status: 'Hoạt động', lastMaintenance: '2024-07-01', nextMaintenance: '2025-01-01' },
    { id: 'ASSET05', name: 'Giường mổ điện', location: 'Phòng mổ 2', status: 'Ngừng hoạt động', lastMaintenance: '2024-04-01', nextMaintenance: 'N/A' },
];

const AssetManagement: React.FC = () => {
    const [assets] = useState<Asset[]>(mockAssets);

    const getStatusClass = (status: Asset['status']) => {
        switch (status) {
            case 'Hoạt động': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Bảo trì': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Ngừng hoạt động': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Quản lý Tài sản/Thiết bị</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tên thiết bị</th>
                            <th scope="col" className="px-6 py-3">Vị trí</th>
                            <th scope="col" className="px-6 py-3">Trạng thái</th>
                            <th scope="col" className="px-6 py-3">Bảo trì lần cuối</th>
                            <th scope="col" className="px-6 py-3">Bảo trì tiếp theo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset) => (
                            <tr key={asset.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{asset.name}</td>
                                <td className="px-6 py-4">{asset.location}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(asset.status)}`}>
                                        {asset.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{asset.lastMaintenance}</td>
                                <td className="px-6 py-4">{asset.nextMaintenance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AssetManagement;