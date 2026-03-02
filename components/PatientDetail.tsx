import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type Patient, type OutpatientVisit, type InpatientRecord, type LabTest, type RadiologyExam, type Invoice, type EMRVisit } from '../types';
import { mockDepartments } from '../data/mockData';
import { Activity, Clock, FileText, Stethoscope, AlertCircle, User, Phone, MapPin, Briefcase, Calendar, ShieldCheck, Heart, FlaskConical, Microscope, Receipt, ChevronRight, Download, Printer, ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';

interface PatientDetailProps {
    patient: Patient;
    onBack: () => void;
    opdVisits?: OutpatientVisit[];
    inpatientRecords?: InpatientRecord[];
    labTests?: LabTest[];
    radiologyExams?: RadiologyExam[];
    invoices?: Invoice[];
    emrVisits?: EMRVisit[];
}

const PatientDetail: React.FC<PatientDetailProps> = ({ 
    patient, 
    onBack, 
    opdVisits = [], 
    inpatientRecords = [], 
    labTests = [], 
    radiologyExams = [], 
    invoices = [],
    emrVisits = []
}) => {
    const [activeTab, setActiveTab] = useState<'info' | 'metrics' | 'history' | 'notes' | 'paraclinical' | 'billing' | 'prescriptions'>('info');

    const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return 0;
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getDepartmentName = (deptId: string) => mockDepartments.find(d => d.id === deptId)?.name || deptId;
    
    const patientMetrics = patient.healthMetrics || [];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Chi tiết Bệnh nhân</h2>
                <button
                    onClick={onBack}
                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại danh sách
                </button>
            </div>

            <div className="space-y-8">
                {/* Main Profile Header */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                    <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 relative">
                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
                    </div>
                    <div className="px-8 pb-8 -mt-16 relative flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-8">
                        <div className="relative">
                            <img 
                                src={patient.avatar} 
                                alt={patient.name} 
                                className="w-40 h-40 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-2xl" 
                            />
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-2xl shadow-lg border-4 border-white dark:border-slate-800">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left pb-2">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{patient.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    patient.patientType === 'BHYT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    patient.patientType === 'Yêu cầu' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                    {patient.patientType}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400">
                                <span className="flex items-center"><User className="w-4 h-4 mr-1.5" /> {calculateAge(patient.dateOfBirth)} tuổi &bull; {patient.gender}</span>
                                <span className="flex items-center font-mono bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-xs">ID: {patient.id}</span>
                            </div>
                        </div>
                        <div className="flex space-x-3 pb-2">
                            <div className="text-center px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Nhóm máu</p>
                                <p className="text-xl font-black text-red-500">O+</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">BMI</p>
                                <p className="text-xl font-black text-emerald-500">22.4</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="border-b dark:border-gray-700 bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-sm overflow-x-auto">
                    <nav className="-mb-px flex space-x-2">
                        <TabButton text="Thông tin Chung" tab="info" activeTab={activeTab} onClick={setActiveTab} icon={<User className="w-4 h-4" />} />
                        <TabButton text="Ghi chú & Tiền sử" tab="notes" activeTab={activeTab} onClick={setActiveTab} icon={<FileText className="w-4 h-4" />} />
                        <TabButton text="Chỉ số Sức khỏe" tab="metrics" activeTab={activeTab} onClick={setActiveTab} icon={<Activity className="w-4 h-4" />} />
                        <TabButton text="Cận lâm sàng" tab="paraclinical" activeTab={activeTab} onClick={setActiveTab} icon={<Microscope className="w-4 h-4" />} />
                        <TabButton text="Đơn thuốc" tab="prescriptions" activeTab={activeTab} onClick={setActiveTab} icon={<FileText className="w-4 h-4" />} />
                        <TabButton text="Hóa đơn" tab="billing" activeTab={activeTab} onClick={setActiveTab} icon={<Receipt className="w-4 h-4" />} />
                        <TabButton text="Lịch sử Khám & Điều trị" tab="history" activeTab={activeTab} onClick={setActiveTab} icon={<Clock className="w-4 h-4" />} />
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <InfoCard title="Thông tin Cá nhân" icon={<User className="w-5 h-5 text-blue-500" />}>
                            <InfoRow label="Ngày sinh" value={patient.dateOfBirth} icon={<Calendar className="w-4 h-4" />} />
                            <InfoRow label="Số CCCD/CMND" value={patient.nationalId} icon={<ShieldCheck className="w-4 h-4" />} />
                            <InfoRow label="Nghề nghiệp" value={patient.occupation} icon={<Briefcase className="w-4 h-4" />} />
                            <InfoRow label="Địa chỉ" value={patient.address} isFullWidth={true} icon={<MapPin className="w-4 h-4" />} />
                        </InfoCard>

                        {/* Contact Info */}
                        <InfoCard title="Thông tin Liên hệ" icon={<Phone className="w-5 h-5 text-emerald-500" />}>
                            <InfoRow label="Số điện thoại" value={patient.phoneNumber} icon={<Phone className="w-4 h-4" />} />
                            <InfoRow label="Người thân liên hệ" value={patient.emergencyContact.name} icon={<User className="w-4 h-4" />} />
                            <InfoRow label="SĐT người thân" value={patient.emergencyContact.phone} icon={<Phone className="w-4 h-4" />} />
                        </InfoCard>

                        {/* Admission Info */}
                        <InfoCard title="Thông tin Khám bệnh" isFullWidth={true} icon={<Stethoscope className="w-5 h-5 text-indigo-500" />}>
                            <InfoRow label="Đối tượng" value={patient.patientType} />
                            <InfoRow label="Mã BHYT" value={patient.healthInsuranceId || 'Không có'} />
                            <InfoRow label="Ngày nhập viện" value={patient.admissionDate} />
                            <InfoRow label="Khoa đăng ký" value={getDepartmentName(patient.admittingDepartment)} />
                            <InfoRow label="Bác sĩ điều trị" value={patient.doctor || 'Chưa phân công'} />
                            <InfoRow label="Lý do đến khám" value={patient.reasonForVisit} isFullWidth={true} />
                        </InfoCard>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-bold flex items-center text-gray-800 dark:text-white">
                                <FileText className="w-6 h-6 mr-2 text-blue-500" />
                                Ghi chú & Tiền sử Bệnh lý
                            </h4>
                        </div>
                        
                        {patient.notes ? (
                            <div className="prose dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
                                <Markdown>{patient.notes}</Markdown>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                                <p>Chưa có ghi chú hoặc tiền sử bệnh lý cho bệnh nhân này.</p>
                                <p className="text-sm">Vui lòng cập nhật trong phần chỉnh sửa thông tin.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'metrics' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h4 className="text-lg font-bold mb-4">Theo dõi Dấu hiệu sống</h4>
                        {patientMetrics.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={patientMetrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                                    <XAxis dataKey="date" stroke="rgb(156 163 175)" />
                                    <YAxis yAxisId="left" stroke="rgb(156 163 175)" />
                                    <YAxis yAxisId="right" orientation="right" stroke="rgb(156 163 175)" />
                                    <Tooltip wrapperClassName="!bg-gray-700 !border-gray-600 !rounded-lg" contentStyle={{backgroundColor: 'transparent', border: 'none'}} itemStyle={{color: 'white'}} labelStyle={{color:'rgb(156 163 175)'}}/>
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="bp_systolic" name="Huyết áp T.Thu" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line yAxisId="left" type="monotone" dataKey="bp_diastolic" name="Huyết áp T.Trương" stroke="#82ca9d" />
                                    <Line yAxisId="left" type="monotone" dataKey="heart_rate" name="Nhịp tim" stroke="#ffc658" />
                                    <Line yAxisId="right" type="monotone" dataKey="temperature" name="Nhiệt độ (°C)" stroke="#ff7300" />
                                    <Line yAxisId="right" type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#387908" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu chỉ số sức khỏe cho bệnh nhân này.</p>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* EMR Visits */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
                            <h4 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                                <FileText className="w-6 h-6 mr-3 text-purple-500" />
                                Lịch sử Khám bệnh (EMR)
                            </h4>
                            {emrVisits.length > 0 ? (
                                <div className="space-y-4">
                                    {emrVisits.map(visit => (
                                        <div key={visit.id} className="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-900 dark:text-white">Ngày khám: {visit.date}</h5>
                                                        <p className="text-xs text-slate-500 flex items-center mt-1">
                                                            <User className="w-3 h-3 mr-1" /> Bác sĩ: {visit.doctor}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    visit.isSigned ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                    {visit.isSigned ? 'Đã ký số' : 'Chưa ký'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Lý do khám / Chẩn đoán</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{visit.reason}</p>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Ghi chú & Phương pháp điều trị</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{visit.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">Không có lịch sử khám bệnh EMR.</div>
                            )}
                        </div>

                        {/* Outpatient History */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
                            <h4 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                                <Stethoscope className="w-6 h-6 mr-3 text-blue-500" />
                                Lịch sử Khám Ngoại trú
                            </h4>
                            {opdVisits.length > 0 ? (
                                <div className="space-y-4">
                                    {opdVisits.map(visit => (
                                        <div key={visit.id} className="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                                                        <Stethoscope className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-900 dark:text-white">Mã khám: {visit.id}</h5>
                                                        <p className="text-xs text-slate-500 flex items-center mt-1">
                                                            <Clock className="w-3 h-3 mr-1" /> {visit.arrivalTime}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    visit.status === 'Đã hoàn thành' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    visit.status === 'Đang khám' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                    {visit.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Lý do khám</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{visit.reasonForVisit}</p>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Chẩn đoán</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{visit.finalDiagnosis || visit.preliminaryDiagnosis || 'Chưa có chẩn đoán'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">Không có lịch sử khám ngoại trú.</div>
                            )}
                        </div>

                        {/* Inpatient History */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
                            <h4 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                                <Activity className="w-6 h-6 mr-3 text-emerald-500" />
                                Lịch sử Điều trị Nội trú
                            </h4>
                            {inpatientRecords.length > 0 ? (
                                <div className="space-y-4">
                                    {inpatientRecords.map(record => (
                                        <div key={record.id} className="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                                                        <Activity className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-900 dark:text-white">Hồ sơ bệnh án: {record.id}</h5>
                                                        <p className="text-xs text-slate-500 flex items-center mt-1">
                                                            <Calendar className="w-3 h-3 mr-1" /> Nhập viện: {record.admissionDate}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    record.status === 'Đã xuất viện' ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                                                    record.status === 'Đang điều trị' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Khoa / Giường</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{record.department} - {record.bedId}</p>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Bác sĩ điều trị</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{record.admittingDoctor}</p>
                                                </div>
                                                <div className="md:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Chẩn đoán chính</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{record.primaryDiagnosis}</p>
                                                </div>
                                                {record.dischargeDate && (
                                                    <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày xuất viện: {record.dischargeDate}</p>
                                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Đã ký số</span>
                                                        </div>
                                                        {record.dischargeSummary && (
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                                                <span className="font-bold text-slate-900 dark:text-white not-italic mr-2">Tổng kết:</span> 
                                                                {record.dischargeSummary}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">Không có lịch sử điều trị nội trú.</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'paraclinical' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Lab Tests */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
                            <h4 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                                <FlaskConical className="w-6 h-6 mr-3 text-emerald-500" />
                                Kết quả Xét nghiệm
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-slate-100 dark:border-slate-700">
                                            <th className="pb-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Ngày chỉ định</th>
                                            <th className="pb-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Tên xét nghiệm</th>
                                            <th className="pb-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Kết quả</th>
                                            <th className="pb-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Trạng thái</th>
                                            <th className="pb-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                        {labTests.length > 0 ? labTests.map((test) => (
                                            <tr key={test.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                <td className="py-4 text-slate-600 dark:text-slate-400">{test.orderDate}</td>
                                                <td className="py-4 font-bold text-slate-900 dark:text-white">{test.testName}</td>
                                                <td className="py-4">
                                                    <span className={`font-medium ${test.results.includes('Dương tính') || test.results.includes('Cao') ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        {test.results || 'Đang chờ...'}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        test.status === 'Có kết quả' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}>
                                                        {test.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-slate-400">Không có dữ liệu xét nghiệm</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Radiology Exams */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
                            <h4 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                                <Microscope className="w-6 h-6 mr-3 text-indigo-500" />
                                Chẩn đoán Hình ảnh
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {radiologyExams.length > 0 ? radiologyExams.map((exam) => (
                                    <div key={exam.id} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{exam.orderDate}</p>
                                                <h5 className="text-lg font-bold text-slate-900 dark:text-white">{exam.modality}</h5>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                exam.status === 'Có kết quả' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {exam.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 italic">
                                            {exam.report || 'Đang chờ bác sĩ đọc kết quả...'}
                                        </p>
                                        <div className="flex justify-end space-x-2">
                                            <button className="flex items-center px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 transition-colors">
                                                Xem phim
                                            </button>
                                            <button className="flex items-center px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">
                                                Tải báo cáo
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="md:col-span-2 py-8 text-center text-slate-400">Không có dữ liệu chẩn đoán hình ảnh</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'prescriptions' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
                            <h4 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                                <FileText className="w-6 h-6 mr-3 text-blue-500" />
                                Danh sách Đơn thuốc
                            </h4>
                            
                            {/* Combine prescriptions from all visits */}
                            {(() => {
                                const allPrescriptions = [
                                    ...opdVisits.map(v => ({ date: v.arrivalTime, type: 'Ngoại trú', medications: v.prescription || [] })),
                                    ...inpatientRecords.map(r => ({ date: r.admissionDate, type: 'Nội trú', medications: r.prescription || [] }))
                                ].filter(p => p.medications.length > 0)
                                 .sort((a, b) => b.date.localeCompare(a.date));

                                return allPrescriptions.length > 0 ? (
                                    <div className="space-y-6">
                                        {allPrescriptions.map((p, idx) => (
                                            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                                                <div className="px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Ngày kê đơn: {p.date}</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.type === 'Nội trú' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {p.type}
                                                        </span>
                                                    </div>
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center">
                                                        <Printer className="w-4 h-4 mr-1" /> In đơn thuốc
                                                    </button>
                                                </div>
                                                <div className="p-6">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-700">
                                                                <th className="pb-2 font-bold uppercase tracking-wider">Tên thuốc</th>
                                                                <th className="pb-2 font-bold uppercase tracking-wider">Liều dùng</th>
                                                                <th className="pb-2 font-bold uppercase tracking-wider text-center">SL</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                                            {p.medications.map((med, mIdx) => (
                                                                <tr key={mIdx}>
                                                                    <td className="py-3 font-bold text-slate-900 dark:text-white">{med.medicationName}</td>
                                                                    <td className="py-3 text-slate-600 dark:text-slate-400">{med.dosage}</td>
                                                                    <td className="py-3 text-center font-mono">{med.quantity}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400">Không có dữ liệu đơn thuốc.</div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-xl font-bold flex items-center text-slate-900 dark:text-white">
                                <Receipt className="w-6 h-6 mr-3 text-amber-500" />
                                Lịch sử Hóa đơn & Thanh toán
                            </h4>
                            <div className="flex space-x-2">
                                <button className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-blue-600 transition-colors">
                                    <Printer className="w-5 h-5" />
                                </button>
                                <button className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-blue-600 transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {invoices.length > 0 ? invoices.map((invoice) => (
                                <div key={invoice.id} className="group bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
                                    <div className="p-6 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-2xl ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                <Receipt className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{invoice.date}</p>
                                                <h5 className="text-lg font-bold text-slate-900 dark:text-white">Hóa đơn #{invoice.id}</h5>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-8">
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng tiền</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white">{invoice.amount.toLocaleString('vi-VN')} đ</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                                                    invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                    {invoice.status === 'Paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                                </span>
                                                <button className="text-blue-600 text-xs font-bold hover:underline">Chi tiết</button>
                                            </div>
                                        </div>
                                    </div>
                                    {invoice.status === 'Pending' && (
                                        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-800 flex justify-between items-center">
                                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Hạn thanh toán: {invoice.dueDate}</p>
                                            <button className="px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm">Thanh toán ngay</button>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="py-16 text-center text-slate-400">Không có dữ liệu hóa đơn</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-components
type TabType = 'info' | 'metrics' | 'history' | 'notes' | 'paraclinical' | 'billing' | 'prescriptions';
const TabButton: React.FC<{ text: string, tab: TabType, activeTab: TabType, onClick: (tab: TabType) => void, icon?: React.ReactNode }> = ({ text, tab, activeTab, onClick, icon }) => (
    <button 
        onClick={() => onClick(tab)} 
        className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
        }`}
    >
        {icon && <span className="mr-2">{icon}</span>}
        {text}
    </button>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode; isFullWidth?: boolean; icon?: React.ReactNode }> = ({ title, children, isFullWidth, icon }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700 ${isFullWidth ? 'lg:col-span-2' : ''}`}>
        <h4 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
            {icon && <span className="mr-3">{icon}</span>}
            {title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {children}
        </div>
    </div>
);

const InfoRow: React.FC<{ label: string; value: string; isFullWidth?: boolean; icon?: React.ReactNode }> = ({ label, value, isFullWidth, icon }) => (
    <div className={`${isFullWidth ? 'md:col-span-2' : ''} flex items-start space-x-3`}>
        {icon && <div className="mt-1 text-slate-400">{icon}</div>}
        <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
            <p className="font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

export default PatientDetail;