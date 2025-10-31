import React, { useState, useMemo, useEffect } from 'react';
import { type OutpatientVisit, type OutpatientVisitStatus, type Medication, type ServiceItem, type ServiceOrderItem, type PrescribedMedication, type FinancialRecord, type LabTest, type RadiologyExam } from '../types';

interface OPDManagementProps {
    visits: OutpatientVisit[];
    onUpdateVisit: (visit: OutpatientVisit) => void;
    medications: Medication[];
    serviceItems: ServiceItem[];
    onAddFinancialRecords: (records: Omit<FinancialRecord, 'id'>[]) => void;
    onAddLabTest: (testData: Omit<LabTest, 'id' | 'orderId' | 'status' | 'results'>) => void;
    onAddRadiologyExam: (examData: Omit<RadiologyExam, 'id' | 'orderId' | 'status' | 'report'>) => void;
}

const LOW_STOCK_THRESHOLD = 50;
const EXPIRY_THRESHOLD_DAYS = 30;

const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const soon = new Date();
    soon.setDate(soon.getDate() + EXPIRY_THRESHOLD_DAYS);
    const expiry = new Date(expiryDate);
    return expiry < soon && expiry >= new Date();
};


const columns: OutpatientVisitStatus[] = ['Chờ khám', 'Đang khám', 'Chờ kết quả CLS', 'Đã hoàn thành'];

// Icons
// FIX: Changed icon components from `React.FC<React.SVGProps<SVGSVGElement>>` to a direct function component definition `(props: React.SVGProps<SVGSVGElement>)`. 
// This resolves a TypeScript issue with passing standard SVG props like `title`.
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const StethoscopeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m-2.828-2.828a4.5 4.5 0 00-6.364 0 4.5 4.5 0 000 6.364l6.364 6.364 6.364-6.364a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0zM12 18.75h.008v.008H12v-.008z" /></svg>;
const BeakerIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477zM12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const MagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
// FIX: Correctly define the ExclamationTriangleIcon component to accept a `title` prop and render it as an SVG `<title>` element, resolving the prop type error. This provides accessible tooltips for icon alerts.
const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }> = ({ title, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


const columnConfig: Record<OutpatientVisitStatus, { title: string; color: string; icon: React.ReactNode }> = {
    'Chờ khám': { title: 'Chờ khám', color: 'text-yellow-500', icon: <ClockIcon className="w-5 h-5 text-yellow-500" /> },
    'Đang khám': { title: 'Đang khám', color: 'text-blue-500', icon: <StethoscopeIcon className="w-5 h-5 text-blue-500" /> },
    'Chờ kết quả CLS': { title: 'Chờ kết quả CLS', color: 'text-purple-500', icon: <BeakerIcon className="w-5 h-5 text-purple-500" /> },
    'Đã hoàn thành': { title: 'Đã hoàn thành', color: 'text-green-500', icon: <CheckCircleIcon className="w-5 h-5 text-green-500" /> },
};

const OPDManagement: React.FC<OPDManagementProps> = ({ visits, onUpdateVisit, medications, serviceItems, onAddFinancialRecords, onAddLabTest, onAddRadiologyExam }) => {
    const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);

    const selectedVisit = useMemo(() => {
        return visits.find(v => v.id === selectedVisitId) || null;
    }, [selectedVisitId, visits]);

    const visitsByStatus = useMemo(() => {
        return columns.reduce((acc, status) => {
            acc[status] = visits.filter(v => v.status === status);
            return acc;
        }, {} as Record<OutpatientVisitStatus, OutpatientVisit[]>);
    }, [visits]);

    const handleSave = (updatedVisit: OutpatientVisit) => {
        onUpdateVisit(updatedVisit);
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6">Quản lý Quy trình Khám Ngoại trú (OPD)</h2>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Left Column: Patient List */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 px-2 text-gray-800 dark:text-gray-200">Danh sách Bệnh nhân</h3>
                    <div className="overflow-y-auto space-y-4 pr-2 -mr-2">
                        {columns.map(status => (
                            <AccordionGroup
                                key={status}
                                status={status}
                                visits={visitsByStatus[status]}
                                selectedVisitId={selectedVisitId}
                                onSelectVisit={setSelectedVisitId}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column: Detail View */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
                    {selectedVisit ? (
                        <VisitDetailView
                            key={selectedVisit.id}
                            visit={selectedVisit}
                            onSave={handleSave}
                            medications={medications}
                            serviceItems={serviceItems}
                            onAddFinancialRecords={onAddFinancialRecords}
                            onAddLabTest={onAddLabTest}
                            onAddRadiologyExam={onAddRadiologyExam}
                            allVisits={visits}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4">
                             <StethoscopeIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                            <p className="mt-4 text-lg font-semibold">Chưa chọn bệnh nhân</p>
                            <p className="text-sm">Chọn một bệnh nhân từ danh sách để xem chi tiết.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AccordionGroup: React.FC<{ status: OutpatientVisitStatus, visits: OutpatientVisit[], selectedVisitId: string | null, onSelectVisit: (id: string) => void }> = ({ status, visits, selectedVisitId, onSelectVisit }) => {
    const [isOpen, setIsOpen] = useState(true);
    const config = columnConfig[status];

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-expanded={isOpen}>
                <div className="flex items-center">
                    {config.icon}
                    <span className={`ml-2 font-bold ${config.color}`}>{config.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2.5 py-0.5">{visits.length}</span>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="mt-2 space-y-2 pl-2">
                    {visits.map(visit => (
                        <PatientListItem
                            key={visit.id}
                            visit={visit}
                            isSelected={visit.id === selectedVisitId}
                            onClick={() => onSelectVisit(visit.id)}
                        />
                    ))}
                    {visits.length === 0 && <p className="text-xs text-gray-500 text-center py-2">Không có bệnh nhân.</p>}
                </div>
            )}
        </div>
    );
};

const PatientListItem: React.FC<{ visit: OutpatientVisit, isSelected: boolean, onClick: () => void }> = ({ visit, isSelected, onClick }) => (
    <div onClick={onClick} className={`p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500' : 'bg-gray-50 dark:bg-gray-700/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
         <div className="flex items-center space-x-3">
            <img src={visit.patientAvatar} alt={visit.patientName} className="w-9 h-9 rounded-full" />
            <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{visit.patientName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Đến lúc: {visit.arrivalTime}</p>
            </div>
        </div>
    </div>
);

type ModalTab = 'consult' | 'orders' | 'prescription';

interface VisitDetailViewProps {
    visit: OutpatientVisit;
    onSave: (visit: OutpatientVisit) => void;
    medications: Medication[];
    serviceItems: ServiceItem[];
    onAddFinancialRecords: (records: Omit<FinancialRecord, 'id'>[]) => void;
    onAddLabTest: (testData: Omit<LabTest, 'id' | 'orderId' | 'status' | 'results'>) => void;
    onAddRadiologyExam: (examData: Omit<RadiologyExam, 'id' | 'orderId' | 'status' | 'report'>) => void;
    allVisits: OutpatientVisit[];
}

const VisitDetailView: React.FC<VisitDetailViewProps> = ({ visit, onSave, medications, serviceItems, onAddFinancialRecords, onAddLabTest, onAddRadiologyExam, allVisits }) => {
    const [formData, setFormData] = useState<OutpatientVisit>(visit);
    const [activeTab, setActiveTab] = useState<ModalTab>('consult');

    const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return '';
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleVitalSignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, vitalSigns: { ...prev.vitalSigns, [name]: value } }));
    };

    const handleClinicalNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, clinicalNotes: { ...prev.clinicalNotes, [name]: value } }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        let updatedData = { ...formData };
        if ((formData.labOrders?.length || formData.radiologyOrders?.length) && formData.status === 'Đang khám') {
            if (window.confirm("Bạn đã thêm chỉ định cận lâm sàng. Bạn có muốn chuyển trạng thái bệnh nhân sang 'Chờ kết quả CLS' không?")) {
                updatedData.status = 'Chờ kết quả CLS';
            }
        }
        
        // Create financial transactions for new items
        const newFinancialRecords: Omit<FinancialRecord, 'id'>[] = [];
        const today = new Date().toISOString().split('T')[0];

        // New Lab Orders
        const originalLabOrderIds = new Set(visit.labOrders?.map(o => o.serviceId) || []);
        formData.labOrders?.forEach(order => {
            if (!originalLabOrderIds.has(order.serviceId)) {
                newFinancialRecords.push({
                    date: today,
                    description: `Dịch vụ CLS: ${order.serviceName}`,
                    type: 'Thu',
                    amount: order.price,
                });
            }
        });

        // New Radiology Orders
        const originalRadiologyOrderIds = new Set(visit.radiologyOrders?.map(o => o.serviceId) || []);
        formData.radiologyOrders?.forEach(order => {
            if (!originalRadiologyOrderIds.has(order.serviceId)) {
                newFinancialRecords.push({
                    date: today,
                    description: `Dịch vụ CLS: ${order.serviceName}`,
                    type: 'Thu',
                    amount: order.price,
                });
            }
        });

        // New Prescriptions
        const originalMedicationIds = new Set(visit.prescription?.map(p => p.medicationId) || []);
        formData.prescription?.forEach(med => {
            if (!originalMedicationIds.has(med.medicationId)) {
                newFinancialRecords.push({
                    date: today,
                    description: `Thuốc: ${med.medicationName} (SL: ${med.quantity})`,
                    type: 'Thu',
                    amount: med.cost * med.quantity,
                });
            }
        });
        
        if (newFinancialRecords.length > 0) {
            onAddFinancialRecords(newFinancialRecords);
        }

        // Create corresponding Lab/Radiology records for new orders
        // New Lab Orders -> LIS
        formData.labOrders?.forEach(order => {
            if (!originalLabOrderIds.has(order.serviceId)) {
                onAddLabTest({
                    patientId: formData.patientId,
                    patientName: formData.patientName,
                    testName: order.serviceName,
                    orderDate: today,
                });
            }
        });

        // New Radiology Orders -> RIS/PACS
        formData.radiologyOrders?.forEach(order => {
            if (!originalRadiologyOrderIds.has(order.serviceId)) {
                onAddRadiologyExam({
                    patientId: formData.patientId,
                    patientName: formData.patientName,
                    modality: order.serviceName,
                    orderDate: today,
                });
            }
        });

        onSave(updatedData);
    };
    
    const inputClass = "block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm focus:ring-blue-500 focus:border-blue-500";
    
    const TabButton: React.FC<{tab: ModalTab, label: string}> = ({tab, label}) => (
        <button 
            type="button"
            onClick={() => setActiveTab(tab)} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-x border-t transition-colors ${activeTab === tab ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 border-b-white dark:border-b-gray-800' : 'bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b dark:border-gray-700">
                <h3 className="text-xl font-bold">{visit.patientName}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>ID: <span className="font-mono">{visit.patientId}</span></span>
                    <span className="mx-2">&bull;</span>
                    <span>{calculateAge(visit.patientDateOfBirth)} tuổi</span>
                </div>
            </div>
            <div className="flex-grow p-6 flex flex-col gap-6 overflow-y-auto">
                {/* Vitals Section */}
                <fieldset className="border p-4 rounded-md dark:border-gray-700">
                    <legend className="text-lg font-semibold px-2">Dấu hiệu sinh tồn</legend>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-2">
                        <div><label className="block text-sm font-medium">Nhiệt độ (°C)</label><input name="temp" value={formData.vitalSigns.temp} onChange={handleVitalSignChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">Huyết áp</label><input name="bp" value={formData.vitalSigns.bp} onChange={handleVitalSignChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">Nhịp tim</label><input name="hr" value={formData.vitalSigns.hr} onChange={handleVitalSignChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">SpO2 (%)</label><input name="spo2" value={formData.vitalSigns.spo2} onChange={handleVitalSignChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">Cân nặng (kg)</label><input name="weight" value={formData.vitalSigns.weight} onChange={handleVitalSignChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium">Chiều cao (cm)</label><input name="height" value={formData.vitalSigns.height} onChange={handleVitalSignChange} className={inputClass} /></div>
                    </div>
                </fieldset>

                {/* Main content area */}
                <div>
                    <div className="border-b border-gray-300 dark:border-gray-600">
                        <nav className="-mb-px flex space-x-2">
                            <TabButton tab="consult" label="Khám & Chẩn đoán" />
                            <TabButton tab="orders" label="Chỉ định CLS" />
                            <TabButton tab="prescription" label="Kê đơn" />
                        </nav>
                    </div>
                    <div className="pt-4">
                        {activeTab === 'consult' && (
                            <div className="space-y-4">
                                 <div><label className="block text-sm font-medium">Lý do vào viện</label><textarea name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} rows={2} className={inputClass}/></div>
                                 <div><label className="block text-sm font-medium">Bệnh sử, Tiền sử</label><textarea name="history" value={formData.clinicalNotes.history} onChange={handleClinicalNotesChange} rows={4} className={inputClass} /></div>
                                 <div><label className="block text-sm font-medium">Khám lâm sàng</label><textarea name="examination" value={formData.clinicalNotes.examination} onChange={handleClinicalNotesChange} rows={4} className={inputClass} /></div>
                                 <div><label className="block text-sm font-medium">Chẩn đoán sơ bộ</label><textarea name="preliminaryDiagnosis" value={formData.preliminaryDiagnosis} onChange={handleChange} rows={2} className={inputClass} /></div>
                                 <div><label className="block text-sm font-medium">Chẩn đoán xác định</label><textarea name="finalDiagnosis" value={formData.finalDiagnosis} onChange={handleChange} rows={2} className={inputClass} /></div>
                            </div>
                        )}
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                               <ServiceOrderSelector
                                    title="Chỉ định Xét nghiệm"
                                    availableServices={serviceItems.filter(s => s.category.startsWith('Xét nghiệm'))}
                                    selectedItems={formData.labOrders || []}
                                    onSelectionChange={items => setFormData(prev => ({...prev, labOrders: items}))}
                               />
                               <ServiceOrderSelector
                                    title="Chỉ định Chẩn đoán Hình ảnh"
                                    availableServices={serviceItems.filter(s => s.category.startsWith('Chẩn đoán hình ảnh'))}
                                    selectedItems={formData.radiologyOrders || []}
                                    onSelectionChange={items => setFormData(prev => ({...prev, radiologyOrders: items}))}
                               />
                            </div>
                        )}
                         {activeTab === 'prescription' && (
                            <PrescriptionCreator
                                availableMedications={medications}
                                prescribedItems={formData.prescription || []}
                                onPrescriptionChange={items => setFormData(prev => ({...prev, prescription: items}))}
                                allVisits={allVisits}
                                currentPatientId={visit.patientId}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 space-x-4 mt-auto border-t dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <label className="block text-sm font-medium whitespace-nowrap">Cập nhật trạng thái:</label>
                    <select name="status" value={formData.status} onChange={handleChange} className={`${inputClass} mt-0 w-auto`}>
                        {columns.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">Lưu thay đổi</button>
            </div>
        </div>
    );
};

// --- Sub-components for VisitDetailView ---

interface ServiceOrderSelectorProps {
    title: string;
    availableServices: ServiceItem[];
    selectedItems: ServiceOrderItem[];
    onSelectionChange: (items: ServiceOrderItem[]) => void;
}
const ServiceOrderSelector: React.FC<ServiceOrderSelectorProps> = ({ title, availableServices, selectedItems, onSelectionChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const filteredServices = useMemo(() => {
        if (!searchTerm) return [];
        const selectedIds = new Set(selectedItems.map(item => item.serviceId));
        return availableServices.filter(service => 
            !selectedIds.has(service.id) && 
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5);
    }, [searchTerm, availableServices, selectedItems]);

    const handleSelect = (service: ServiceItem) => {
        const newItem: ServiceOrderItem = {
            serviceId: service.id,
            serviceName: service.name,
            price: service.price
        };
        onSelectionChange([...selectedItems, newItem]);
        setSearchTerm('');
    };

    const handleRemove = (serviceId: string) => {
        onSelectionChange(selectedItems.filter(item => item.serviceId !== serviceId));
    };
    
    const handleNoteChange = (serviceId: string, note: string) => {
        const updatedItems = selectedItems.map(item => 
            item.serviceId === serviceId ? { ...item, notes: note } : item
        );
        onSelectionChange(updatedItems);
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{title}</label>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Tìm kiếm và thêm dịch vụ..."
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
                {isFocused && filteredServices.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredServices.map(service => (
                            <li key={service.id} onMouseDown={() => handleSelect(service)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm">
                                {service.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mt-2 space-y-2">
                {selectedItems.map(item => (
                    <div key={item.serviceId} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        <div className="flex justify-between items-center">
                            <span>{item.serviceName}</span>
                            <div className="flex items-center space-x-3">
                                <span className="font-mono text-xs">{item.price.toLocaleString('vi-VN')} đ</span>
                                <button onClick={() => handleRemove(item.serviceId)}><XCircleIcon className="w-5 h-5 text-red-500 hover:text-red-700" /></button>
                            </div>
                        </div>
                        <input 
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => handleNoteChange(item.serviceId, e.target.value)}
                            placeholder="Thêm ghi chú cho dịch vụ này..."
                            className="w-full text-xs p-1 mt-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};


interface PrescriptionCreatorProps {
    availableMedications: Medication[];
    prescribedItems: PrescribedMedication[];
    onPrescriptionChange: (items: PrescribedMedication[]) => void;
    allVisits: OutpatientVisit[];
    currentPatientId: string;
}
const PrescriptionCreator: React.FC<PrescriptionCreatorProps> = ({ availableMedications, prescribedItems, onPrescriptionChange, allVisits, currentPatientId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const getMedicationAlerts = (med: Medication) => ({
        lowStock: med.stock < LOW_STOCK_THRESHOLD,
        expiringSoon: isExpiringSoon(med.expiryDate),
    });

    const filteredMeds = useMemo(() => {
        if (!searchTerm) return [];
        const prescribedIds = new Set(prescribedItems.map(item => item.medicationId));
        return availableMedications.filter(med => 
            !prescribedIds.has(med.id) &&
            med.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5);
    }, [searchTerm, availableMedications, prescribedItems]);

    const previouslyPrescribedMeds = useMemo(() => {
        const history = allVisits
            .filter(v => v.patientId === currentPatientId)
            .flatMap(v => v.prescription || []);
        
        const uniqueMedIds = [...new Set(history.map(p => p.medicationId))];
        
        return uniqueMedIds
            .map(id => availableMedications.find(med => med.id === id))
            .filter((med): med is Medication => !!med);
    }, [allVisits, currentPatientId, availableMedications]);

    const frequentlyUsedMeds = useMemo(() => {
        // Mock frequently used medications for demonstration
        const frequentIds = ['MED001', 'MED002', 'MED003'];
        return frequentIds
            .map(id => availableMedications.find(med => med.id === id))
            .filter((med): med is Medication => !!med);
    }, [availableMedications]);

    const handleSelect = (med: Medication) => {
        const isAlreadyPrescribed = prescribedItems.some(item => item.medicationId === med.id);
        if (isAlreadyPrescribed) {
            setSearchTerm('');
            return;
        }

        const newItem: PrescribedMedication = {
            medicationId: med.id,
            medicationName: med.name,
            dosage: '',
            quantity: 1,
            cost: med.cost,
        };
        onPrescriptionChange([...prescribedItems, newItem]);
        setSearchTerm('');
    };

    const handleUpdate = (medId: string, field: 'dosage' | 'quantity' | 'notes', value: string | number) => {
        onPrescriptionChange(prescribedItems.map(item => 
            item.medicationId === medId ? { ...item, [field]: value } : item
        ));
    };
    
    const handleRemove = (medId: string) => {
        onPrescriptionChange(prescribedItems.filter(item => item.medicationId !== medId));
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Đơn thuốc</label>
            <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Tìm kiếm và thêm thuốc..."
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
                 {isFocused && filteredMeds.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredMeds.map(med => {
                            const alerts = getMedicationAlerts(med);
                            return (
                                <li key={med.id} onMouseDown={() => handleSelect(med)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex justify-between items-center">
                                    <span>{med.name}</span>
                                    {(alerts.lowStock || alerts.expiringSoon) && <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" title={`Tồn kho: ${med.stock}, HSD: ${med.expiryDate}`} />}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            
            {/* Quick Suggestions */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SuggestionBox title="Thuốc đã kê" meds={previouslyPrescribedMeds} onSelect={handleSelect} />
                <SuggestionBox title="Thuốc hay dùng" meds={frequentlyUsedMeds} onSelect={handleSelect} />
            </div>

            <div className="space-y-3">
                {prescribedItems.map((item, index) => {
                    const medDetails = availableMedications.find(m => m.id === item.medicationId);
                    const alerts = medDetails ? getMedicationAlerts(medDetails) : { lowStock: false, expiringSoon: false };

                    return (
                        <div key={item.medicationId} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-semibold">{index + 1}. {item.medicationName}</p>
                                <button onClick={() => handleRemove(item.medicationId)}><XCircleIcon className="w-5 h-5 text-red-500 hover:text-red-700 flex-shrink-0" /></button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm">
                                 <input type="text" value={item.dosage} onChange={e => handleUpdate(item.medicationId, 'dosage', e.target.value)} placeholder="Liều dùng & Tần suất (VD: 1v x 2 lần/ngày)" className="p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 sm:col-span-3" />
                                 <input type="number" value={item.quantity} onChange={e => handleUpdate(item.medicationId, 'quantity', parseInt(e.target.value) || 0)} placeholder="Số lượng" className="p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 sm:col-span-2" />
                                 <input type="text" value={item.notes || ''} onChange={e => handleUpdate(item.medicationId, 'notes', e.target.value)} placeholder="Hướng dẫn (VD: Uống sau ăn no)" className="p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 sm:col-span-5" />
                            </div>
                            {(alerts.lowStock || alerts.expiringSoon) && medDetails && (
                                <div className="mt-2 flex items-center text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 p-1.5 rounded-md">
                                    <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>
                                        {alerts.lowStock && `Tồn kho thấp (${medDetails.stock}). `}
                                        {alerts.expiringSoon && `Sắp hết hạn (${medDetails.expiryDate}).`}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SuggestionBox: React.FC<{title: string, meds: Medication[], onSelect: (med: Medication) => void}> = ({ title, meds, onSelect }) => (
    <div>
        <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{title}</h5>
        <div className="p-2 border dark:border-gray-600 rounded-md max-h-24 overflow-y-auto">
            {meds.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                    {meds.map(med => (
                        <button key={med.id} type="button" onClick={() => onSelect(med)} className="text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-2 py-1 rounded-full">
                            {med.name}
                        </button>
                    ))}
                </div>
            ) : <p className="text-xs text-gray-400">Không có dữ liệu.</p>}
        </div>
    </div>
);


export default OPDManagement;
