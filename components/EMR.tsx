import React, { useState, useMemo, useEffect } from 'react';
import { type Patient, type EMRVisit, type EMRDiagnosis, type UserRole, type AuditLog } from '../types';
import { mockPatients as allPatients, mockVisits as allVisits, mockDiagnoses as allDiagnoses, mockEmrAuditLog } from '../data/mockData';

type Tab = 'info' | 'history' | 'diagnosis' | 'notes' | 'audit';

interface EMRProps {
    currentUserRole: UserRole;
}

const EMR: React.FC<EMRProps> = ({ currentUserRole }) => {
    const [visits, setVisits] = useState(allVisits);
    const [diagnoses, setDiagnoses] = useState(allDiagnoses);
    const [auditLog, setAuditLog] = useState(mockEmrAuditLog);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    
    // State for filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredPatients = useMemo(() => {
        let patients = [...allPatients];

        // Filter by search term
        if (searchTerm.trim() !== '') {
            patients = patients.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            
            if(end) end.setHours(23, 59, 59, 999); // Include the whole end day

            patients = patients.filter(p => {
                const patientVisits = visits[p.id] || [];
                const patientDiagnoses = diagnoses[p.id] || [];

                const hasVisitInRange = patientVisits.some(v => {
                    const visitDate = new Date(v.date);
                    if (start && end) return visitDate >= start && visitDate <= end;
                    if (start) return visitDate >= start;
                    if (end) return visitDate <= end;
                    return false;
                });

                const hasDiagnosisInRange = patientDiagnoses.some(d => {
                    const diagnosisDate = new Date(d.date);
                    if (start && end) return diagnosisDate >= start && diagnosisDate <= end;
                    if (start) return diagnosisDate >= start;
                    if (end) return diagnosisDate <= end;
                    return false;
                });

                return hasVisitInRange || hasDiagnosisInRange;
            });
        }

        return patients;
    }, [searchTerm, startDate, endDate, visits, diagnoses]);

    // Deselect patient if they are filtered out
    useEffect(() => {
        if (selectedPatient && !filteredPatients.some(p => p.id === selectedPatient.id)) {
            setSelectedPatient(null);
        }
    }, [filteredPatients, selectedPatient]);
    
    // Set initial patient
     useEffect(() => {
        if (filteredPatients.length > 0 && !selectedPatient) {
            setSelectedPatient(filteredPatients[0]);
        }
    }, [filteredPatients, selectedPatient]);


    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    const addAuditEntry = (patientId: string, recordId: string, action: string, details: string) => {
        const newEntry: AuditLog = {
            id: `LOG${Date.now()}`,
            timestamp: new Date().toLocaleString('sv-SE'),
            user: 'Dr. Emily Carter', // Mocked user
            userRole: currentUserRole,
            action,
            details,
            patientId,
            recordId,
        };
        setAuditLog(prev => [newEntry, ...prev]);
    };

    const handleSaveVisit = (patientId: string, visit: EMRVisit) => {
        const updatedVisits = { ...visits };
        const patientVisits = updatedVisits[patientId] || [];
        const originalVisit = patientVisits.find(v => v.id === visit.id);
        const isNew = !originalVisit;
    
        if (isNew) {
            updatedVisits[patientId] = [...patientVisits, visit];
            addAuditEntry(patientId, visit.id, 'Tạo Lần khám', `Tạo hồ sơ khám mới: ${visit.reason}`);
        } else {
            let action = 'Cập nhật Lần khám';
            let details = `Cập nhật thông tin cho lần khám ngày ${visit.date}`;
    
            if (visit.isSigned && !originalVisit.isSigned) {
                action = 'Ký số Lần khám';
                details = `Ký số hồ sơ khám ngày ${visit.date}`;
            } else if (!visit.isSigned && originalVisit.notes !== visit.notes) {
                action = 'Cập nhật Ghi chú Khám';
                details = `Nội dung thay đổi cho lần khám ngày ${visit.date}.\nTRƯỚC: "${originalVisit.notes}"\nSAU: "${visit.notes}"`;
            }
            
            updatedVisits[patientId] = patientVisits.map(v => (v.id === visit.id ? visit : v));
            addAuditEntry(patientId, visit.id, action, details);
        }
        setVisits(updatedVisits);
    };
    
    const handleSaveDiagnosis = (patientId: string, diagnosis: EMRDiagnosis) => {
        const isNew = !diagnoses[patientId]?.some(d => d.id === diagnosis.id);
        const updatedDiagnoses = { ...diagnoses };
        if (isNew) {
            updatedDiagnoses[patientId] = [...(updatedDiagnoses[patientId] || []), diagnosis];
            addAuditEntry(patientId, diagnosis.id, 'Tạo Chẩn đoán', `Thêm chẩn đoán mới: ${diagnosis.description}`);
        } else {
            updatedDiagnoses[patientId] = updatedDiagnoses[patientId].map(d => d.id === diagnosis.id ? diagnosis : d);
            const action = diagnosis.isSigned ? 'Ký số Chẩn đoán' : 'Cập nhật Chẩn đoán';
            addAuditEntry(patientId, diagnosis.id, action, `Cập nhật chẩn đoán ${diagnosis.code}`);
        }
        setDiagnoses(updatedDiagnoses);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col h-full">
                <h2 className="text-xl font-bold mb-4">Danh sách Bệnh nhân</h2>
                
                <div className="space-y-3 mb-4 pr-2">
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên, ID..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 text-sm">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Từ ngày</label>
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={e => setStartDate(e.target.value)} 
                                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Đến ngày</label>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={e => setEndDate(e.target.value)} 
                                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow">
                    <ul className="space-y-2">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map(patient => (
                                <li key={patient.id}>
                                    <button onClick={() => handlePatientSelect(patient)} className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedPatient?.id === patient.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                        <img src={patient.avatar} alt={patient.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold">{patient.name}</p>
                                            <p className={`text-sm ${selectedPatient?.id === patient.id ? 'text-blue-200' : 'text-gray-500'}`}>{patient.id}</p>
                                        </div>
                                    </button>
                                </li>
                            ))
                        ) : (
                             <p className="text-sm text-gray-500 text-center py-4">Không tìm thấy bệnh nhân nào.</p>
                        )}
                    </ul>
                </div>
            </div>
            <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col overflow-y-hidden">
                {selectedPatient ? (
                   <EMRDetailView
                        key={selectedPatient.id}
                        patient={selectedPatient}
                        visits={visits[selectedPatient.id] || []}
                        diagnoses={diagnoses[selectedPatient.id] || []}
                        auditLog={auditLog.filter(log => log.patientId === selectedPatient.id)}
                        currentUserRole={currentUserRole}
                        onSaveVisit={handleSaveVisit}
                        onSaveDiagnosis={handleSaveDiagnosis}
                   />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Chọn một bệnh nhân để xem hồ sơ.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// EMR Detail View Component
const EMRDetailView: React.FC<{
    patient: Patient,
    visits: EMRVisit[],
    diagnoses: EMRDiagnosis[],
    auditLog: AuditLog[],
    currentUserRole: UserRole,
    onSaveVisit: (patientId: string, visit: EMRVisit) => void,
    onSaveDiagnosis: (patientId: string, diagnosis: EMRDiagnosis) => void
}> = ({ patient, visits, diagnoses, auditLog, currentUserRole, onSaveVisit, onSaveDiagnosis }) => {
    const [activeTab, setActiveTab] = useState<Tab>('history');
    const [editingVisitId, setEditingVisitId] = useState<string | null>(null);
    const [visitNotes, setVisitNotes] = useState('');
    
    const canEdit = currentUserRole === 'Bác sĩ/Y sĩ';

    const handleEditVisit = (visit: EMRVisit) => {
        if (!canEdit || visit.isSigned) return;
        setEditingVisitId(visit.id);
        setVisitNotes(visit.notes);
    };

    const handleSaveNotes = (visit: EMRVisit) => {
        if (!canEdit) return;
        const updatedVisit = { ...visit, notes: visitNotes, isSigned: false };
        onSaveVisit(patient.id, updatedVisit);
        setEditingVisitId(null);
    };
    
    const handleSignVisit = (visit: EMRVisit) => {
        if (!canEdit || visit.isSigned) return;
        if (window.confirm('Bạn có chắc chắn muốn ký số và khóa hồ sơ này? Hành động này không thể hoàn tác.')) {
            const updatedVisit = { ...visit, notes: visitNotes, isSigned: true };
            if(editingVisitId === visit.id) { // if editing, save notes before signing
                 onSaveVisit(patient.id, updatedVisit);
                 setEditingVisitId(null);
            } else {
                onSaveVisit(patient.id, { ...visit, isSigned: true });
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingVisitId(null);
        setVisitNotes('');
    };

    const calculateAge = (dateOfBirth: string) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    
    return (
        <>
            <div className="flex items-center space-x-4 mb-6 pb-4 border-b dark:border-gray-700">
                <img src={patient.avatar} alt={patient.name} className="w-16 h-16 rounded-full" />
                <div>
                    <h2 className="text-2xl font-bold">{patient.name}</h2>
                    <p className="text-gray-500">{patient.reasonForVisit}</p>
                </div>
            </div>
            <div className="flex space-x-1 border-b dark:border-gray-700 mb-4">
                <TabButton text="Thông tin chung" tab="info" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton text="Lịch sử khám" tab="history" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton text="Chẩn đoán" tab="diagnosis" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton text="Ghi chú Bác sĩ" tab="notes" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton text="Lịch sử Cập nhật" tab="audit" activeTab={activeTab} onClick={setActiveTab} />
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-4">
                {activeTab === 'info' && <InfoTab patient={patient} calculateAge={calculateAge} />}
                {activeTab === 'history' && <VisitHistoryTab visits={visits} editingVisitId={editingVisitId} visitNotes={visitNotes} setVisitNotes={setVisitNotes} handleEditVisit={handleEditVisit} handleSaveNotes={handleSaveNotes} handleSignVisit={handleSignVisit} handleCancelEdit={handleCancelEdit} canEdit={canEdit} />}
                {activeTab === 'diagnosis' && <DiagnosisTab diagnoses={diagnoses} canEdit={canEdit} onSave={(diag) => onSaveDiagnosis(patient.id, diag)} />}
                {activeTab === 'audit' && <AuditTrailTab auditLog={auditLog} />}
                {activeTab === 'notes' && <p>Ghi chú của bác sĩ sẽ được hiển thị ở đây.</p>}
            </div>
        </>
    );
};

const InfoTab: React.FC<{patient: Patient, calculateAge: (dob: string) => number}> = ({patient, calculateAge}) => (
    <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Tuổi:</span> {calculateAge(patient.dateOfBirth)}</div>
            <div><span className="font-semibold">Giới tính:</span> {patient.gender}</div>
            <div><span className="font-semibold">Số CCCD:</span> {patient.nationalId}</div>
            <div><span className="font-semibold">Mã BHYT:</span> {patient.healthInsuranceId || 'Không có'}</div>
        </div>
        <div className="pt-4 border-t dark:border-gray-600">
             <h4 className="font-semibold mb-2">Thông tin Nhập viện</h4>
             <div className="grid grid-cols-2 gap-4">
                <div><span className="font-semibold">Ngày nhập viện:</span> {patient.admissionDate}</div>
                <div><span className="font-semibold">Bác sĩ điều trị:</span> {patient.doctor}</div>
             </div>
        </div>
    </div>
);

const VisitHistoryTab: React.FC<{
    visits: EMRVisit[], 
    editingVisitId: string|null, 
    visitNotes: string, 
    setVisitNotes: (notes: string) => void, 
    handleEditVisit: (v: EMRVisit) => void, 
    handleSaveNotes: (v: EMRVisit) => void, 
    handleSignVisit: (v: EMRVisit) => void,
    handleCancelEdit: () => void,
    canEdit: boolean
}> = 
({visits, editingVisitId, visitNotes, setVisitNotes, handleEditVisit, handleSaveNotes, handleSignVisit, handleCancelEdit, canEdit}) => (
    <ul className="space-y-4">
        {visits.map(visit => (
            <li key={visit.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold">{visit.date} - {visit.reason}</p>
                        <p className="text-sm">Bác sĩ: {visit.doctor}</p>
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        {canEdit && !visit.isSigned && editingVisitId !== visit.id && (
                             <>
                                <button onClick={() => handleEditVisit(visit)} className="text-sm font-medium text-yellow-500 hover:text-yellow-700">Sửa</button>
                                <button onClick={() => handleSignVisit(visit)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Ký số</button>
                            </>
                        )}
                        {visit.isSigned && (
                            <span className="text-xs font-semibold text-green-600 flex items-center"><LockClosedIcon/> Đã ký số</span>
                        )}
                    </div>
                </div>
                {editingVisitId === visit.id ? (
                    <div className="mt-2">
                        <textarea value={visitNotes} onChange={e => setVisitNotes(e.target.value)} rows={4} className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 text-sm" />
                        <div className="mt-2 flex items-center space-x-2">
                            <button onClick={() => handleSaveNotes(visit)} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold">Lưu Ghi chú</button>
                            <button onClick={() => handleSignVisit(visit)} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold">Lưu & Ký số</button>
                            <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-3 py-1 rounded-md text-sm font-semibold">Hủy</button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{visit.notes}</p>
                )}
            </li>
        ))}
    </ul>
);

const DiagnosisTab: React.FC<{diagnoses: EMRDiagnosis[], canEdit: boolean, onSave: (d: EMRDiagnosis) => void}> = ({diagnoses, canEdit, onSave}) => (
     <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr><th className="px-4 py-2">Ngày</th><th className="px-4 py-2">Chẩn đoán</th><th className="px-4 py-2">Trạng thái</th><th className="px-4 py-2">Hành động</th></tr>
        </thead>
        <tbody>
        {diagnoses.map(diag => (
            <tr key={diag.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{diag.date}</td>
                <td className="px-4 py-2">
                    <div className="flex items-center">
                        <span className="bg-gray-200 dark:bg-gray-600 rounded-md px-2 py-1 text-xs font-mono font-bold text-gray-800 dark:text-gray-200 mr-3">{diag.code}</span>
                        <span>{diag.description}</span>
                    </div>
                </td>
                <td className="px-4 py-2">{diag.status}</td>
                <td className="px-4 py-2">
                    {canEdit && !diag.isSigned && <button onClick={() => onSave({...diag, isSigned: true})} className="text-sm text-blue-600">Ký số</button>}
                    {diag.isSigned && <span className="text-xs font-semibold text-green-600 flex items-center"><LockClosedIcon/> Đã ký</span>}
                </td>
            </tr>
        ))}
        </tbody>
    </table>
);

const AuditTrailTab: React.FC<{auditLog: AuditLog[]}> = ({auditLog}) => (
    <div className="text-sm">
        {auditLog.map(log => (
            <div key={log.id} className="flex space-x-3 border-l-2 pl-4 pb-4 relative">
                 <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800"></div>
                <div>
                    <p className="font-semibold">{log.action} - <span className="font-normal text-gray-500 dark:text-gray-400">{log.timestamp}</span></p>
                    <p className="text-xs">Thực hiện bởi: {log.user} ({log.userRole})</p>
                    <p className="text-xs mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-md whitespace-pre-wrap">
                        <span className="font-semibold">Chi tiết:</span> {log.details}
                    </p>
                </div>
            </div>
        ))}
    </div>
);

// Icons
const LockClosedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;
interface TabButtonProps { text: string; tab: Tab; activeTab: Tab; onClick: (tab: Tab) => void; }
const TabButton: React.FC<TabButtonProps> = ({ text, tab, activeTab, onClick }) => (
    <button onClick={() => onClick(tab)} className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${activeTab === tab ? 'bg-white dark:bg-gray-800 border-t border-x border-gray-300 dark:border-gray-600 text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
        {text}
    </button>
);

export default EMR;