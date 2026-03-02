import React, { useState, useMemo } from 'react';
import { type Patient, type Appointment, type Department, type UserRole, type QueueTicket } from '../types';
import { Search, UserPlus, CheckCircle, Printer, Activity, ArrowRight, User, Scan } from 'lucide-react';
import { mockDepartments } from '../data/mockData';
import PatientFormModal from './PatientFormModal';
import CCCDScanner from './CCCDScanner';

interface ReceptionProps {
    patients: Patient[];
    appointments: Appointment[];
    onRegisterPatient: (patientData: Omit<Patient, 'id' | 'avatar'>) => void;
    onCheckIn: (patientId: string, departmentId: string) => void;
    currentUserRole: UserRole;
}

const Reception: React.FC<ReceptionProps> = ({ patients, appointments, onRegisterPatient, onCheckIn, currentUserRole }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [initialFormData, setInitialFormData] = useState<Partial<Patient> | undefined>(undefined);
    const [vitals, setVitals] = useState({ weight: '', height: '', bp: '', temp: '' });
    const [selectedDept, setSelectedDept] = useState('DEPT03'); // Default to General Clinic

    const filteredPatients = useMemo(() => {
        if (searchTerm.length < 2) return [];
        return patients.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.phoneNumber.includes(searchTerm)
        ).slice(0, 5);
    }, [patients, searchTerm]);

    const patientAppointments = useMemo(() => {
        if (!selectedPatient) return [];
        return appointments.filter(a => a.patientId === selectedPatient.id && a.status === 'Đã xác nhận');
    }, [selectedPatient, appointments]);

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setSearchTerm('');
    };

    const handleCheckIn = () => {
        if (!selectedPatient) return;
        onCheckIn(selectedPatient.id, selectedDept);
        alert(`Đã tiếp đón bệnh nhân ${selectedPatient.name}. Số thứ tự hàng chờ đã được cấp.`);
        setSelectedPatient(null);
        setVitals({ weight: '', height: '', bp: '', temp: '' });
    };

    const handleScanResult = (data: string) => {
        setIsScanning(false);
        // Vietnamese CCCD QR format: CCCD|OldID|FullName|DOB|Gender|Address|IssueDate
        const parts = data.split('|');
        if (parts.length >= 6) {
            const nationalId = parts[0];
            const name = parts[2];
            const dobRaw = parts[3]; // DDMMYYYY
            const gender = parts[4];
            const address = parts[5];

            // Convert DDMMYYYY to YYYY-MM-DD
            let dob = '';
            if (dobRaw.length === 8) {
                dob = `${dobRaw.substring(4, 8)}-${dobRaw.substring(2, 4)}-${dobRaw.substring(0, 2)}`;
            }

            // Check if patient already exists
            const existingPatient = patients.find(p => p.nationalId === nationalId);
            if (existingPatient) {
                setSelectedPatient(existingPatient);
                alert(`Tìm thấy bệnh nhân: ${existingPatient.name}`);
            } else {
                setInitialFormData({
                    name,
                    dateOfBirth: dob,
                    gender: gender === 'Nam' ? 'Nam' : (gender === 'Nữ' ? 'Nữ' : 'Khác'),
                    nationalId,
                    address
                });
                setIsRegistering(true);
            }
        } else {
            alert("Định dạng mã QR không hợp lệ hoặc không phải CCCD Việt Nam.");
        }
    };

    const handleSaveNewPatient = (patientData: Omit<Patient, 'id' | 'assignedDoctorId' | 'doctor'>) => {
        onRegisterPatient(patientData);
        setIsRegistering(false);
        setInitialFormData(undefined);
        alert("Đăng ký bệnh nhân mới thành công!");
    };

    return (
        <div className="space-y-6">
            <div className="modern-card p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <UserPlus className="mr-2 text-blue-500" />
                    Tiếp đón & Nhận bệnh
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Search & Selection */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">Tìm kiếm bệnh nhân</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Nhập tên, mã BN hoặc SĐT..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-modern pl-10"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                            
                            {filteredPatients.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                    {filteredPatients.map(p => (
                                        <button 
                                            key={p.id}
                                            onClick={() => handleSelectPatient(p)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-0 dark:border-gray-700 flex items-center"
                                        >
                                            <img src={p.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                                            <div>
                                                <p className="font-medium">{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.id} • {p.phoneNumber}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                            <button 
                                onClick={() => setIsScanning(true)}
                                className="w-full btn-primary flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Scan className="w-4 h-4 mr-2" />
                                Quét CCCD
                            </button>
                            <button 
                                onClick={() => {
                                    setInitialFormData(undefined);
                                    setIsRegistering(true);
                                }}
                                className="w-full btn-secondary flex items-center justify-center"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Đăng ký bệnh nhân mới
                            </button>
                        </div>

                        {selectedPatient && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <img src={selectedPatient.avatar} alt="" className="w-12 h-12 rounded-full mr-3 border-2 border-white dark:border-gray-700" />
                                        <div>
                                            <h3 className="font-bold text-lg">{selectedPatient.name}</h3>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">{selectedPatient.id}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-600">
                                        <Printer className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p><span className="text-gray-500">NS:</span> {selectedPatient.dateOfBirth}</p>
                                    <p><span className="text-gray-500">GT:</span> {selectedPatient.gender}</p>
                                    <p className="col-span-2"><span className="text-gray-500">SĐT:</span> {selectedPatient.phoneNumber}</p>
                                    <p className="col-span-2"><span className="text-gray-500">Đ/C:</span> {selectedPatient.address}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Middle Column: Appointments & Vitals */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedPatient ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Appointments Section */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                        Lịch hẹn hôm nay
                                    </h3>
                                    {patientAppointments.length > 0 ? (
                                        <div className="space-y-2">
                                            {patientAppointments.map(app => (
                                                <div key={app.id} className="p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-medium">{app.time}</p>
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Đã hẹn</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.doctorName}</p>
                                                    <p className="text-xs text-gray-500">{app.departmentName}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Không có lịch hẹn nào được tìm thấy cho hôm nay.</p>
                                    )}

                                    <div className="pt-4 border-t dark:border-gray-700">
                                        <label className="block text-sm font-medium mb-2">Chọn khoa khám</label>
                                        <select 
                                            value={selectedDept}
                                            onChange={(e) => setSelectedDept(e.target.value)}
                                            className="input-modern"
                                        >
                                            {mockDepartments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Vitals Section */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center">
                                        <Activity className="w-5 h-5 mr-2 text-red-500" />
                                        Chỉ số sinh tồn (Tùy chọn)
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Cân nặng (kg)</label>
                                            <input 
                                                type="text" 
                                                value={vitals.weight}
                                                onChange={(e) => setVitals({...vitals, weight: e.target.value})}
                                                className="input-modern" 
                                                placeholder="--"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Chiều cao (cm)</label>
                                            <input 
                                                type="text" 
                                                value={vitals.height}
                                                onChange={(e) => setVitals({...vitals, height: e.target.value})}
                                                className="input-modern" 
                                                placeholder="--"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Huyết áp (mmHg)</label>
                                            <input 
                                                type="text" 
                                                value={vitals.bp}
                                                onChange={(e) => setVitals({...vitals, bp: e.target.value})}
                                                className="input-modern" 
                                                placeholder="120/80"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Nhiệt độ (°C)</label>
                                            <input 
                                                type="text" 
                                                value={vitals.temp}
                                                onChange={(e) => setVitals({...vitals, temp: e.target.value})}
                                                className="input-modern" 
                                                placeholder="36.5"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button 
                                            onClick={handleCheckIn}
                                            className="w-full btn-primary py-4 text-lg flex items-center justify-center"
                                        >
                                            Tiếp nhận & Cấp số
                                            <ArrowRight className="ml-2 w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                                <User className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg">Vui lòng chọn bệnh nhân để bắt đầu tiếp đón</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isRegistering && (
                <PatientFormModal 
                    patient={null}
                    initialData={initialFormData}
                    onSave={handleSaveNewPatient}
                    onClose={() => {
                        setIsRegistering(false);
                        setInitialFormData(undefined);
                    }}
                />
            )}

            {isScanning && (
                <CCCDScanner 
                    onScan={handleScanResult}
                    onClose={() => setIsScanning(false)}
                />
            )}

            {/* Quick Stats / Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="modern-card p-4 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mr-3">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Đã tiếp đón</p>
                        <p className="text-xl font-bold">42</p>
                    </div>
                </div>
                <div className="modern-card p-4 flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mr-3">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Đã khám xong</p>
                        <p className="text-xl font-bold">18</p>
                    </div>
                </div>
                <div className="modern-card p-4 flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                        <Printer className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Chờ in phiếu</p>
                        <p className="text-xl font-bold">3</p>
                    </div>
                </div>
                <div className="modern-card p-4 flex items-center">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mr-3">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Cần hỗ trợ</p>
                        <p className="text-xl font-bold">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reception;
