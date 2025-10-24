import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type Patient } from '../types';
import { mockDepartments } from '../data/mockData';

interface PatientDetailProps {
    patient: Patient;
    onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'metrics'>('info');

    const calculateAge = (dateOfBirth: string) => {
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
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại danh sách</span>
                </button>
            </div>

            <div className="space-y-6">
                {/* Main Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-6">
                    <img src={patient.avatar} alt={patient.name} className="w-24 h-24 rounded-full ring-4 ring-blue-500/50" />
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{patient.name}</h3>
                        <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">ID: {patient.id}</p>
                        <div className="flex space-x-4 mt-2 text-gray-600 dark:text-gray-300">
                            <span>{calculateAge(patient.dateOfBirth)} tuổi</span>
                            <span>&bull;</span>
                            <span>{patient.gender}</span>
                        </div>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="border-b dark:border-gray-700">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton text="Thông tin Chung" tab="info" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton text="Chỉ số Sức khỏe" tab="metrics" activeTab={activeTab} onClick={setActiveTab} />
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <InfoCard title="Thông tin Cá nhân">
                            <InfoRow label="Ngày sinh" value={patient.dateOfBirth} />
                            <InfoRow label="Số CCCD/CMND" value={patient.nationalId} />
                            <InfoRow label="Nghề nghiệp" value={patient.occupation} />
                            <InfoRow label="Địa chỉ" value={patient.address} isFullWidth={true} />
                        </InfoCard>

                        {/* Contact Info */}
                        <InfoCard title="Thông tin Liên hệ">
                            <InfoRow label="Số điện thoại" value={patient.phoneNumber} />
                            <InfoRow label="Người thân liên hệ" value={patient.emergencyContact.name} />
                            <InfoRow label="SĐT người thân" value={patient.emergencyContact.phone} />
                        </InfoCard>

                        {/* Admission Info */}
                        <InfoCard title="Thông tin Khám bệnh" isFullWidth={true}>
                            <InfoRow label="Đối tượng" value={patient.patientType} />
                            <InfoRow label="Mã BHYT" value={patient.healthInsuranceId || 'Không có'} />
                            <InfoRow label="Ngày nhập viện" value={patient.admissionDate} />
                            <InfoRow label="Khoa đăng ký" value={getDepartmentName(patient.admittingDepartment)} />
                            <InfoRow label="Bác sĩ điều trị" value={patient.doctor} />
                            <InfoRow label="Lý do đến khám" value={patient.reasonForVisit} isFullWidth={true} />
                        </InfoCard>
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
            </div>
        </div>
    );
};

// Sub-components
type TabType = 'info' | 'metrics';
const TabButton: React.FC<{ text: string, tab: TabType, activeTab: TabType, onClick: (tab: TabType) => void }> = ({ text, tab, activeTab, onClick }) => (
    <button onClick={() => onClick(tab)} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
        {text}
    </button>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode; isFullWidth?: boolean }> = ({ title, children, isFullWidth }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${isFullWidth ? 'lg:col-span-2' : ''}`}>
        <h4 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800 dark:text-gray-200">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            {children}
        </div>
    </div>
);

const InfoRow: React.FC<{ label: string; value: string; isFullWidth?: boolean }> = ({ label, value, isFullWidth }) => (
    <div className={isFullWidth ? 'md:col-span-2' : ''}>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
);

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

export default PatientDetail;