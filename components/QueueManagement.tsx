import React, { useState } from 'react';
import { type QueueTicket, type Department } from '../types';

interface QueueManagementProps {
    queueTickets: QueueTicket[];
    departments: Department[];
    onCallNextPatient: (ticketId: number) => void;
}

const QueueManagement: React.FC<QueueManagementProps> = ({ queueTickets, departments, onCallNextPatient }) => {
    const [selectedDeptId, setSelectedDeptId] = useState<string>('DEPT03'); // Default to Khoa Khám Bệnh

    const filteredQueue = queueTickets.filter(q => q.departmentId === selectedDeptId);

    const waiting = filteredQueue.filter(q => q.status === 'Đang chờ');
    const serving = filteredQueue.filter(q => q.status === 'Đang khám');
    const done = filteredQueue.filter(q => q.status === 'Đã khám');

    const handleCallNext = () => {
        const nextPatientInLine = waiting[0];
        if (nextPatientInLine) {
            onCallNextPatient(nextPatientInLine.id);
        } else {
            alert('Không có bệnh nhân nào trong hàng chờ.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">Quản lý Hàng chờ</h2>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedDeptId}
                        onChange={e => setSelectedDeptId(e.target.value)}
                        className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    >
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <button onClick={handleCallNext} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                        Gọi số tiếp theo
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QueueColumn title="Đang chờ" tickets={waiting} color="yellow" />
                <QueueColumn title="Đang khám" tickets={serving} color="blue" />
                <QueueColumn title="Đã khám" tickets={done} color="green" />
            </div>
        </div>
    );
};

interface QueueColumnProps {
    title: string;
    tickets: QueueTicket[];
    color: 'yellow' | 'blue' | 'green';
}

const QueueColumn: React.FC<QueueColumnProps> = ({ title, tickets, color }) => {
    const colors = {
        yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/50',
        blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/50',
        green: 'border-green-500 bg-green-50 dark:bg-green-900/50',
    };
    return (
        <div className={`p-4 rounded-lg ${colors[color]} border-t-4 shadow`}>
            <h3 className="font-bold text-lg mb-4">{title} ({tickets.length})</h3>
            <ul className="space-y-3">
                {tickets.map(ticket => (
                    <li key={ticket.id} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                        <p className="font-bold text-xl">Số {ticket.id.toString().slice(-4)}</p>
                        <p className="text-gray-600 dark:text-gray-300">{ticket.patientName}</p>
                    </li>
                ))}
                {tickets.length === 0 && <p className="text-sm text-gray-500">Không có bệnh nhân.</p>}
            </ul>
        </div>
    );
};

export default QueueManagement;
