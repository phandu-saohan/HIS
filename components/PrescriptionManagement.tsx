import React, { useState } from 'react';
import { type PrescriptionRecord, type PrescriptionStatus } from '../types';

interface PrescriptionManagementProps {
    prescriptionRecords: PrescriptionRecord[];
    onUpdateStatus: (recordId: string, status: PrescriptionStatus) => void;
}

const PrescriptionManagement: React.FC<PrescriptionManagementProps> = ({ prescriptionRecords, onUpdateStatus }) => {
    const [selectedRecord, setSelectedRecord] = useState<PrescriptionRecord | null>(null);
    
    const getStatusClass = (status: PrescriptionStatus) => {
        switch (status) {
            case 'Mới': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Đã cấp phát': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Đã hủy': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Quản lý Đơn thuốc</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Đơn thuốc</th>
                                <th scope="col" className="px-6 py-3">Tên bệnh nhân</th>
                                <th scope="col" className="px-6 py-3">Bác sĩ kê đơn</th>
                                <th scope="col" className="px-6 py-3">Ngày kê đơn</th>
                                <th scope="col" className="px-6 py-3">Trạng thái</th>
                                <th scope="col" className="px-6 py-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptionRecords.map((p) => (
                                <tr key={p.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.id}</td>
                                    <td className="px-6 py-4">{p.patientName}</td>
                                    <td className="px-6 py-4">{p.doctorName}</td>
                                    <td className="px-6 py-4">{p.date}</td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(p.status)}`}>{p.status}</span></td>
                                    <td className="px-6 py-4"><button onClick={() => setSelectedRecord(p)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Xem chi tiết</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedRecord && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={() => setSelectedRecord(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold">Chi tiết Đơn thuốc: {selectedRecord.id}</h3>
                        {/* Details here */}
                        <div className="text-right mt-4">
                            {selectedRecord.status === 'Mới' && <button onClick={() => { onUpdateStatus(selectedRecord.id, 'Đã cấp phát'); setSelectedRecord(null); }} className="bg-green-500 text-white px-4 py-2 rounded-lg">Xác nhận Cấp phát</button>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PrescriptionManagement;
