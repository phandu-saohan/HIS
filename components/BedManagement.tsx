
import React, { useState } from 'react';
import { type Bed } from '../types';

const mockBeds: Bed[] = [
  { id: 'W1-B1', ward: 'Khoa tim mạch A', status: 'Đã có người', patientName: 'Nguyễn Văn An' },
  { id: 'W1-B2', ward: 'Khoa tim mạch A', status: 'Có sẵn' },
  { id: 'W1-B3', ward: 'Khoa tim mạch A', status: 'Đang dọn dẹp' },
  { id: 'W1-B4', ward: 'Khoa tim mạch A', status: 'Có sẵn' },
  { id: 'W2-B1', ward: 'Khoa thần kinh', status: 'Đã có người', patientName: 'Phạm Thị Dung' },
  { id: 'W2-B2', ward: 'Khoa thần kinh', status: 'Đã có người', patientName: 'Bệnh nhân mới' },
  { id: 'W2-B3', ward: 'Khoa thần kinh', status: 'Có sẵn' },
  { id: 'W3-B1', ward: 'Khoa chỉnh hình', status: 'Đã có người', patientName: 'Lê Văn Cường' },
  { id: 'W3-B2', ward: 'Khoa chỉnh hình', status: 'Có sẵn' },
  { id: 'W3-B3', ward: 'Khoa chỉnh hình', status: 'Có sẵn' },
];

const BedManagement: React.FC = () => {
  const [beds] = useState<Bed[]>(mockBeds);

  const getStatusColor = (status: Bed['status']) => {
    switch (status) {
      case 'Có sẵn': return 'border-green-500 bg-green-50 dark:bg-green-900';
      case 'Đã có người': return 'border-red-500 bg-red-50 dark:bg-red-900';
      case 'Đang dọn dẹp': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900';
      default: return 'border-gray-300';
    }
  };

  const wards = [...new Set(beds.map(bed => bed.ward))];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quản lý giường bệnh</h2>
      {wards.map(ward => (
        <div key={ward} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{ward}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {beds.filter(bed => bed.ward === ward).map((bed) => (
              <div key={bed.id} className={`p-4 rounded-lg shadow-md border-l-4 ${getStatusColor(bed.status)}`}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-lg">{bed.id}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    bed.status === 'Có sẵn' ? 'bg-green-200 text-green-800' : 
                    bed.status === 'Đã có người' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>{bed.status}</span>
                </div>
                {bed.status === 'Đã có người' && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{bed.patientName}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BedManagement;
