import React, { useState } from 'react';
import { type InsuranceClaim } from '../types';

const mockClaims: InsuranceClaim[] = [
    { id: 'CLM001', patientName: 'Nguyễn Văn An', provider: 'Bảo hiểm Y tế Việt Nam', amount: 1200000, submittedDate: '2023-10-05', status: 'Đã duyệt' },
    { id: 'CLM002', patientName: 'Trần Thị Bình', provider: 'Bảo hiểm Y tế Việt Nam', amount: 600000, submittedDate: '2023-10-06', status: 'Đã nộp' },
    { id: 'CLM003', patientName: 'Lê Văn Cường', provider: 'Bảo hiểm Y tế Việt Nam', amount: 2500000, submittedDate: '2023-10-06', status: 'Bị từ chối' },
    { id: 'CLM004', patientName: 'Phạm Thị Dung', provider: 'Bảo hiểm Y tế Việt Nam', amount: 400000, submittedDate: '2023-10-07', status: 'Đã duyệt' },
    { id: 'CLM005', patientName: 'Hoàng Văn Em', provider: 'Bảo hiểm Y tế Việt Nam', amount: 1000000, submittedDate: '2023-10-08', status: 'Chờ xử lý' },
];

const InsuranceClaims: React.FC = () => {
    const [claims] = useState<InsuranceClaim[]>(mockClaims);
    
    const getStatusClass = (status: InsuranceClaim['status']) => {
        switch (status) {
            case 'Đã duyệt': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Đã nộp': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Chờ xử lý': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Bị từ chối': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Quản lý Bảo hiểm Y tế (BHYT)</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID Yêu cầu</th>
                            <th scope="col" className="px-6 py-3">Tên bệnh nhân</th>
                            <th scope="col" className="px-6 py-3">Số tiền (VND)</th>
                            <th scope="col" className="px-6 py-3">Ngày nộp</th>
                            <th scope="col" className="px-6 py-3">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim) => (
                            <tr key={claim.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{claim.id}</td>
                                <td className="px-6 py-4">{claim.patientName}</td>
                                <td className="px-6 py-4">{claim.amount.toLocaleString('vi-VN')}</td>
                                <td className="px-6 py-4">{claim.submittedDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(claim.status)}`}>
                                        {claim.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InsuranceClaims;