import React, { useState, useMemo } from 'react';
import { type InpatientRecord, type UserRole, type VitalSigns, type VitalSignRecord, type NursingNote, type NursingTask } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NISProps {
    inpatientRecords: InpatientRecord[];
    onUpdateInpatientRecord: (record: InpatientRecord) => void;
    currentUserRole: UserRole;
}

const NursingInformationSystem: React.FC<NISProps> = (props) => {
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(props.inpatientRecords.length > 0 ? props.inpatientRecords[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');

    const activeRecords = useMemo(() => 
        props.inpatientRecords.filter(r => r.status === 'Đang điều trị' || r.status === 'Nhập viện' || r.status === 'Chờ xuất viện')
    , [props.inpatientRecords]);

    const filteredRecords = useMemo(() => {
        return activeRecords.filter(record => 
            record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.bedId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeRecords, searchTerm]);

    const selectedRecord = useMemo(() => 
        props.inpatientRecords.find(r => r.id === selectedRecordId) || null
    , [selectedRecordId, props.inpatientRecords]);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6">Hệ thống Thông tin Điều dưỡng (NIS)</h2>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden h-full">
                {/* Master List */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full">
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên hoặc giường..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm mb-4"
                    />
                    <div className="overflow-y-auto space-y-3 pr-2 -mr-2 flex-grow">
                        {filteredRecords.map(record => (
                            <PatientListItem 
                                key={record.id}
                                record={record}
                                isSelected={selectedRecordId === record.id}
                                onClick={() => setSelectedRecordId(record.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden h-full">
                    {selectedRecord ? (
                        <PatientCareWorkspace
                            key={selectedRecord.id}
                            record={selectedRecord}
                            onUpdate={props.onUpdateInpatientRecord}
                            currentUserRole={props.currentUserRole}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4">
                            <p>Chọn một bệnh nhân để xem kế hoạch chăm sóc.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Patient List Item ---
const PatientListItem: React.FC<{ record: InpatientRecord, isSelected: boolean, onClick: () => void }> = ({ record, isSelected, onClick }) => {
    const pendingTasks = record.nursingTasks.filter(t => !t.isCompleted).length;
    return (
        <div onClick={onClick} className={`p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500' : 'bg-gray-50 dark:bg-gray-700/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img src={record.patientAvatar} alt={record.patientName} className="w-9 h-9 rounded-full" />
                    <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{record.patientName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Giường {record.bedId}</p>
                    </div>
                </div>
                {pendingTasks > 0 && <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">{pendingTasks}</span>}
            </div>
        </div>
    );
};

// --- Patient Care Workspace ---
interface PatientCareWorkspaceProps {
    record: InpatientRecord;
    onUpdate: (record: InpatientRecord) => void;
    currentUserRole: UserRole;
}
const PatientCareWorkspace: React.FC<PatientCareWorkspaceProps> = ({ record, onUpdate, currentUserRole }) => {
    const isNurse = currentUserRole === 'Điều dưỡng';
    const [newNote, setNewNote] = useState('');
    const [vitalsInput, setVitalsInput] = useState<Partial<VitalSigns>>({temp: '', bp: '', hr: '', spo2: ''});
    const [newCareOrder, setNewCareOrder] = useState({ description: '', time: '' });

    const handleToggleTask = (taskId: string) => {
        const updatedRecord = {
            ...record,
            nursingTasks: record.nursingTasks.map(task => 
                task.id === taskId 
                ? { ...task, isCompleted: !task.isCompleted, completedBy: 'Current Nurse', completedAt: new Date().toISOString() } 
                : task
            )
        };
        onUpdate(updatedRecord);
    };
    
    const handleAddVitals = () => {
        if (!vitalsInput.bp || !vitalsInput.hr || !vitalsInput.spo2 || !vitalsInput.temp) {
            alert("Vui lòng nhập đầy đủ các dấu hiệu sống.");
            return;
        }
        const newVitalsRecord: VitalSignRecord = {
            timestamp: new Date().toLocaleString('sv-SE'),
            vitals: vitalsInput as VitalSigns,
            recordedBy: 'Current Nurse'
        };
        const updatedRecord = { ...record, vitalSignRecords: [newVitalsRecord, ...record.vitalSignRecords] };
        onUpdate(updatedRecord);
        setVitalsInput({temp: '', bp: '', hr: '', spo2: ''}); // Reset form
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const newNoteRecord: NursingNote = {
            timestamp: new Date().toLocaleString('sv-SE'),
            note: newNote,
            author: 'Current Nurse'
        };
        const updatedRecord = { ...record, nursingNotes: [newNoteRecord, ...record.nursingNotes] };
        onUpdate(updatedRecord);
        setNewNote('');
    };

    const handleAddCareOrder = () => {
        if (!newCareOrder.description.trim()) {
            alert("Vui lòng nhập mô tả công việc chăm sóc.");
            return;
        }
        const newTask: NursingTask = {
            id: `NT${Date.now()}`,
            description: newCareOrder.description,
            time: newCareOrder.time || 'Khi cần', // Default time if not specified
            isCompleted: false,
            createdBy: 'Current Nurse', // Assuming the current user is a nurse
            createdAt: new Date().toISOString()
        };
        const updatedRecord = { ...record, nursingTasks: [...record.nursingTasks, newTask] };
        onUpdate(updatedRecord);
        setNewCareOrder({ description: '', time: '' }); // Reset form
    };

    const vitalChartData = useMemo(() => {
        return record.vitalSignRecords.map(vr => ({
            time: new Date(vr.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit'}),
            ...vr.vitals,
            bp_systolic: parseInt(vr.vitals.bp.split('/')[0]),
            bp_diastolic: parseInt(vr.vitals.bp.split('/')[1]),
            hr: parseInt(vr.vitals.hr),
            spo2: parseInt(vr.vitals.spo2),
            temp: parseFloat(vr.vitals.temp)
        })).reverse();
    }, [record.vitalSignRecords]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b dark:border-gray-700 flex-shrink-0">
                <h3 className="text-lg font-bold">{record.patientName}</h3>
                <p className="text-sm text-gray-500">Giường {record.bedId} - {record.primaryDiagnosis}</p>
            </div>
            <div className="flex-grow p-4 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Tasks and Notes */}
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2">Kế hoạch Chăm sóc</h4>
                        {isNurse && (
                            <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg mb-2">
                                <input 
                                    value={newCareOrder.description} 
                                    onChange={e => setNewCareOrder(p => ({...p, description: e.target.value}))} 
                                    placeholder="Thêm công việc chăm sóc..." 
                                    className="flex-grow p-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600" 
                                />
                                <input 
                                    value={newCareOrder.time} 
                                    onChange={e => setNewCareOrder(p => ({...p, time: e.target.value}))} 
                                    placeholder="Thời gian/Tần suất" 
                                    className="w-1/3 p-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600" 
                                />
                                <button onClick={handleAddCareOrder} className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600 text-sm">Thêm</button>
                            </div>
                        )}
                        <ul className="space-y-2 text-sm max-h-60 overflow-y-auto pr-2">
                            {record.nursingTasks.map(task => (
                                <li key={task.id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                                    <input type="checkbox" checked={task.isCompleted} onChange={() => handleToggleTask(task.id)} disabled={!isNurse} className="w-4 h-4 mr-3" />
                                    <label className={`flex-grow ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.description}</label>
                                    <span className="text-xs text-gray-400">{task.time}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Ghi chú Điều dưỡng</h4>
                        {isNurse && (
                             <div className="flex space-x-2 mb-2">
                                <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={2} placeholder="Thêm ghi chú..." className="flex-grow p-2 text-sm border rounded" />
                                <button onClick={handleAddNote} className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600">Lưu</button>
                            </div>
                        )}
                        <ul className="space-y-2 text-xs max-h-48 overflow-y-auto pr-2">
                            {record.nursingNotes.map(note => (
                                <li key={note.timestamp} className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                                    <p className="font-semibold">{note.timestamp} <span className="font-normal text-gray-500">({note.author})</span></p>
                                    <p className="whitespace-pre-wrap">{note.note}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Right Column: Vitals */}
                <div>
                     <h4 className="font-semibold mb-2">Theo dõi Dấu hiệu sống</h4>
                     {isNurse && (
                        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg mb-4 text-sm">
                            <input value={vitalsInput.temp || ''} onChange={e=>setVitalsInput(p=>({...p, temp: e.target.value}))} placeholder="Nhiệt độ" className="p-1.5 border rounded" />
                            <input value={vitalsInput.bp || ''} onChange={e=>setVitalsInput(p=>({...p, bp: e.target.value}))} placeholder="Huyết áp" className="p-1.5 border rounded" />
                            <input value={vitalsInput.hr || ''} onChange={e=>setVitalsInput(p=>({...p, hr: e.target.value}))} placeholder="Nhịp tim" className="p-1.5 border rounded" />
                            <input value={vitalsInput.spo2 || ''} onChange={e=>setVitalsInput(p=>({...p, spo2: e.target.value}))} placeholder="SpO2" className="p-1.5 border rounded" />
                            <button onClick={handleAddVitals} className="col-span-2 bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600">Thêm Ghi nhận</button>
                        </div>
                     )}
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vitalChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                <XAxis dataKey="time" fontSize={10} />
                                <YAxis yAxisId="left" fontSize={10} />
                                <YAxis yAxisId="right" orientation="right" fontSize={10} />
                                <Tooltip wrapperClassName="!bg-gray-700 !text-xs !rounded" contentStyle={{backgroundColor: 'transparent', border: 'none'}} itemStyle={{color: 'white'}} labelStyle={{color:'rgb(156 163 175)'}}/>
                                <Legend wrapperStyle={{fontSize: "10px"}}/>
                                <Line yAxisId="left" type="monotone" dataKey="hr" name="Nhịp tim" stroke="#8884d8" dot={false} />
                                <Line yAxisId="left" type="monotone" dataKey="spo2" name="SpO2" stroke="#82ca9d" dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="temp" name="Nhiệt độ" stroke="#ffc658" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default NursingInformationSystem;