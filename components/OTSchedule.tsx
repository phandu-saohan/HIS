import React from 'react';

const mockSurgeries = [
    { id: 'S001', time: '09:00 AM', patientName: 'Lê Văn Cường', surgery: 'Thay khớp háng', surgeon: 'Dr. Lee', room: 'Phòng mổ 1' },
    { id: 'S002', time: '01:00 PM', patientName: 'Bệnh nhân mới', surgery: 'Cắt ruột thừa', surgeon: 'Dr. Smith', room: 'Phòng mổ 2' },
    { id: 'S003', time: '03:30 PM', patientName: 'Nguyễn Thị F', surgery: 'Phẫu thuật tim hở', surgeon: 'Dr. Carter', room: 'Phòng mổ 1' },
]

const OTSchedule: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <ClockIcon />
                <span className="ml-3">Lịch Phòng mổ (OT)</span>
            </h2>
             <ul className="space-y-4">
                {mockSurgeries.map(s => (
                    <li key={s.id} className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border-l-4 border-blue-500 shadow">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-bold text-blue-800 dark:text-blue-300">{s.time} - {s.room}</p>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">BS: {s.surgeon}</span>
                        </div>
                        <div className="mt-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{s.patientName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{s.surgery}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default OTSchedule;