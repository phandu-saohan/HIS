import React, { useState, useMemo } from 'react';
import { type InpatientRecord, type UserRole, type InpatientStatus, type ServiceItem, type ServiceOrderItem, type NursingTask, type FinancialRecord, type VitalSigns, type VitalSignRecord, type Medication, type PrescribedMedication, type LabTest, type RadiologyExam } from '../types';

// Icons for the new selector
const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
// FIX: Correctly define the ExclamationTriangleIcon component to accept a `title` prop and render it as an SVG `<title>` element, resolving the prop type error. This provides accessible tooltips for icon alerts.
const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }> = ({ title, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


const LOW_STOCK_THRESHOLD = 50;
const EXPIRY_THRESHOLD_DAYS = 30;

const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const soon = new Date();
    soon.setDate(soon.getDate() + EXPIRY_THRESHOLD_DAYS);
    const expiry = new Date(expiryDate);
    return expiry < soon && expiry >= new Date();
};


interface IPDManagementProps {
    inpatientRecords: InpatientRecord[];
    onUpdateInpatientRecord: (record: InpatientRecord) => void;
    serviceItems: ServiceItem[];
    medications: Medication[];
    onAddFinancialRecords: (records: Omit<FinancialRecord, 'id'>[]) => void;
    currentUserRole: UserRole;
    onAddLabTest: (testData: Omit<LabTest, 'id' | 'orderId' | 'status' | 'results'>) => void;
    onAddRadiologyExam: (examData: Omit<RadiologyExam, 'id' | 'orderId' | 'status' | 'report'>) => void;
}

const statuses: InpatientStatus[] = ['Nhập viện', 'Đang điều trị', 'Chờ xuất viện', 'Đã xuất viện'];

const statusConfig: Record<InpatientStatus, { title: string; color: string; textColor: string; bgColor: string }> = {
    'Nhập viện': { title: 'Mới Nhập viện', color: 'border-blue-500', textColor: 'text-blue-800 dark:text-blue-300', bgColor: 'bg-blue-100 dark:bg-blue-900/50' },
    'Đang điều trị': { title: 'Đang Điều trị', color: 'border-yellow-500', textColor: 'text-yellow-800 dark:text-yellow-300', bgColor: 'bg-yellow-100 dark:bg-yellow-900/50' },
    'Chờ xuất viện': { title: 'Chờ Xuất viện', color: 'border-purple-500', textColor: 'text-purple-800 dark:text-purple-300', bgColor: 'bg-purple-100 dark:bg-purple-900/50' },
    'Đã xuất viện': { title: 'Đã Xuất viện', color: 'border-green-500', textColor: 'text-green-800 dark:text-green-300', bgColor: 'bg-green-100 dark:bg-green-900/50' },
};


const IPDManagement: React.FC<IPDManagementProps> = (props) => {
    const [selectedRecord, setSelectedRecord] = useState<InpatientRecord | null>(null);
    const [filterStatus, setFilterStatus] = useState<InpatientStatus | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRecords = useMemo(() => {
        return props.inpatientRecords.filter(record => {
            const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
            const matchesSearch = searchTerm === '' || 
                                  record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  record.patientId.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [props.inpatientRecords, filterStatus, searchTerm]);
    
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6">Quản lý Bệnh nhân Nội trú (IPD)</h2>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden h-full">
                {/* Master List */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full">
                     <h3 className="text-lg font-semibold mb-2 px-2 text-gray-800 dark:text-gray-200">Danh sách Bệnh nhân</h3>
                     <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <input 
                            type="text" 
                            placeholder="Tìm bệnh nhân..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm"
                        />
                         <select 
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value as InpatientStatus | 'All')}
                            className="w-full sm:w-auto p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm"
                        >
                             <option value="All">Tất cả Trạng thái</option>
                             {statuses.map(s => <option key={s} value={s}>{statusConfig[s].title}</option>)}
                         </select>
                     </div>
                    <div className="overflow-y-auto space-y-3 pr-2 -mr-2 flex-grow">
                        {filteredRecords.map(record => (
                             <PatientListItem 
                                key={record.id}
                                record={record}
                                isSelected={selectedRecord?.id === record.id}
                                onClick={() => setSelectedRecord(record)}
                             />
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden h-full">
                    {selectedRecord ? (
                        <InpatientDetailView
                            record={selectedRecord}
                            onClose={() => setSelectedRecord(null)}
                            {...props}
                        />
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 dark:text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                            <p className="mt-4 text-lg font-semibold">Chưa chọn bệnh nhân</p>
                            <p className="text-sm">Chọn một bệnh nhân từ danh sách bên trái để xem và quản lý hồ sơ.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Patient List Item ---
const PatientListItem: React.FC<{ record: InpatientRecord, isSelected: boolean, onClick: () => void }> = ({ record, isSelected, onClick }) => {
    const config = statusConfig[record.status];
    return (
        <div onClick={onClick} className={`p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${isSelected ? `bg-blue-100 dark:bg-blue-900/50 border-blue-500` : `bg-gray-50 dark:bg-gray-700/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700`}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img src={record.patientAvatar} alt={record.patientName} className="w-9 h-9 rounded-full" />
                    <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{record.patientName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{record.patientId}</p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.textColor} ${config.bgColor}`}>{record.status}</span>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p><span className="font-semibold">Giường:</span> {record.bedId} - {record.department}</p>
                <p className="truncate"><span className="font-semibold">Chẩn đoán:</span> {record.primaryDiagnosis}</p>
            </div>
        </div>
    );
};

// --- Inpatient Detail View (replaces modal) ---
interface InpatientDetailViewProps extends IPDManagementProps {
    record: InpatientRecord;
    onClose: () => void;
}
type ModalTab = 'overview' | 'orders' | 'prescription' | 'nursing' | 'billing' | 'discharge';

const InpatientDetailView: React.FC<InpatientDetailViewProps> = ({ record, onClose, onUpdateInpatientRecord, serviceItems, medications, onAddFinancialRecords, currentUserRole, onAddLabTest, onAddRadiologyExam }) => {
    const [localRecord, setLocalRecord] = useState<InpatientRecord>(record);
    const [activeTab, setActiveTab] = useState<ModalTab>('overview');

    // Update local state if the selected record prop changes
    React.useEffect(() => {
        setLocalRecord(record);
    }, [record]);
    
    const handleUpdateAndSave = (updatedRecord: InpatientRecord) => {
        // Find newly added billable items and create financial records
        const newFinancialRecords: Omit<FinancialRecord, 'id'>[] = [];
        const today = new Date().toISOString().split('T')[0];
        
        // Handle new clinical orders
        const originalOrderIds = new Set(record.clinicalOrders.map(o => o.serviceId));
        updatedRecord.clinicalOrders.forEach(order => {
            if (!originalOrderIds.has(order.serviceId)) {
                newFinancialRecords.push({
                    date: today,
                    description: `Dịch vụ nội trú: ${order.serviceName} (BN: ${record.patientName})`,
                    type: 'Thu',
                    amount: order.price,
                });

                // Also create LIS/RIS records
                const service = serviceItems.find(s => s.id === order.serviceId);
                if (service) {
                    if (service.category.startsWith('Xét nghiệm')) {
                        onAddLabTest({
                            patientId: updatedRecord.patientId,
                            patientName: updatedRecord.patientName,
                            testName: order.serviceName,
                            orderDate: today,
                        });
                    } else if (service.category.startsWith('Chẩn đoán hình ảnh')) {
                        onAddRadiologyExam({
                            patientId: updatedRecord.patientId,
                            patientName: updatedRecord.patientName,
                            modality: order.serviceName,
                            orderDate: today,
                        });
                    }
                }
            }
        });

        // Handle new prescriptions
        const originalPrescriptionIds = new Set(record.prescription?.map(p => p.medicationId) || []);
        updatedRecord.prescription?.forEach(med => {
            if (!originalPrescriptionIds.has(med.medicationId)) {
                newFinancialRecords.push({
                    date: today,
                    description: `Thuốc: ${med.medicationName} (SL: ${med.quantity}) - BN: ${record.patientName}`,
                    type: 'Thu',
                    amount: med.cost * med.quantity,
                });
            }
        });

        if (newFinancialRecords.length > 0) {
            onAddFinancialRecords(newFinancialRecords);
        }
        
        onUpdateInpatientRecord(updatedRecord);
        setLocalRecord(updatedRecord); // Keep local state in sync
    };
    
    const handleSignAndFinalizeDischarge = () => {
        if (!localRecord.dischargeSummary?.trim()) {
            alert('Vui lòng nhập Tổng kết Bệnh án trước khi ký số.');
            return;
        }
    
        if (!window.confirm('Bạn có chắc chắn muốn ký số và hoàn tất ra viện cho bệnh nhân này? Hành động này sẽ tạo giao dịch tài chính cuối cùng và không thể hoàn tác.')) {
            return;
        }
    
        // 1. Calculate final bill
        const totalCharges = localRecord.clinicalOrders.reduce((sum, order) => sum + order.price, 0);
        const finalRecord: Omit<FinancialRecord, 'id'> = {
            date: new Date().toISOString().split('T')[0],
            description: `Thanh toán toàn bộ viện phí - BN: ${localRecord.patientName} (ID: ${localRecord.patientId})`,
            type: 'Thu',
            amount: totalCharges,
        };
        onAddFinancialRecords([finalRecord]);
    
        // 2. Update patient record
        const updatedRecord: InpatientRecord = { 
            ...localRecord, 
            status: 'Đã xuất viện', 
            dischargeDate: new Date().toISOString().split('T')[0],
            isDischargeSummarySigned: true,
        };
        onUpdateInpatientRecord(updatedRecord);
    
        // 3. Close this detail view
        onClose();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <img src={localRecord.patientAvatar} alt={localRecord.patientName} className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-bold">{localRecord.patientName} <span className="text-base font-normal text-gray-500">({localRecord.patientId})</span></h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Chẩn đoán: {localRecord.primaryDiagnosis}</p>
                    </div>
                </div>
                 <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-3xl leading-none">&times;</button>
            </div>
            {/* Tabs */}
            <div className="border-b dark:border-gray-700 px-4 flex-shrink-0">
                <nav className="-mb-px flex space-x-4">
                    <ModalTabButton label="Tổng quan" tab="overview" activeTab={activeTab} onClick={setActiveTab} />
                    <ModalTabButton label="Y lệnh & Điều trị" tab="orders" activeTab={activeTab} onClick={setActiveTab} />
                    <ModalTabButton label="Kê đơn" tab="prescription" activeTab={activeTab} onClick={setActiveTab} />
                    <ModalTabButton label="Theo dõi Điều dưỡng" tab="nursing" activeTab={activeTab} onClick={setActiveTab} />
                    <ModalTabButton label="Viện phí" tab="billing" activeTab={activeTab} onClick={setActiveTab} />
                    <ModalTabButton label="Xuất viện" tab="discharge" activeTab={activeTab} onClick={setActiveTab} />
                </nav>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow overflow-y-auto">
               {activeTab === 'overview' && <OverviewTab record={localRecord} setRecord={setLocalRecord} currentUserRole={currentUserRole} />}
               {activeTab === 'orders' && <OrdersTab record={localRecord} setRecord={setLocalRecord} serviceItems={serviceItems} currentUserRole={currentUserRole} />}
               {activeTab === 'prescription' && <PrescriptionTab record={localRecord} setRecord={setLocalRecord} availableMedications={medications} currentUserRole={currentUserRole} />}
               {activeTab === 'nursing' && <NursingTab record={localRecord} setRecord={setLocalRecord} currentUserRole={currentUserRole} />}
               {activeTab === 'billing' && <BillingTab record={localRecord} />}
               {activeTab === 'discharge' && <DischargeTab record={localRecord} setRecord={setLocalRecord} currentUserRole={currentUserRole} onSignAndFinalize={handleSignAndFinalizeDischarge} />}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2 mt-auto border-t dark:border-gray-700 flex-shrink-0">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Đóng</button>
                {localRecord.status !== 'Đã xuất viện' && (
                    <button onClick={() => handleUpdateAndSave(localRecord)} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">Lưu thay đổi</button>
                )}
            </div>
        </div>
    );
};

// --- Sub Components for Modal Tabs ---

const ModalTabButton: React.FC<{label: string, tab: ModalTab, activeTab: ModalTab, onClick: (t:ModalTab) => void}> = ({label, tab, activeTab, onClick}) => (
    <button onClick={() => onClick(tab)} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{label}</button>
);

const OverviewTab: React.FC<{ record: InpatientRecord, setRecord: (r: InpatientRecord) => void, currentUserRole: UserRole }> = ({ record, setRecord, currentUserRole }) => {
    const canChangeStatus = ['Bác sĩ/Y sĩ', 'Điều dưỡng', 'Quản lý'].includes(currentUserRole);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoItem label="Ngày nhập viện" value={record.admissionDate} />
            <InfoItem label="Khoa" value={record.department} />
            <InfoItem label="Bác sĩ điều trị" value={record.admittingDoctor} />
            <InfoItem label="Giường" value={record.bedId} />
            <div className="md:col-span-2">
                 <label className="font-semibold text-gray-600 dark:text-gray-400">Trạng thái bệnh nhân</label>
                 <select 
                    value={record.status} 
                    onChange={e => setRecord({...record, status: e.target.value as InpatientStatus})}
                    disabled={!canChangeStatus || record.status === 'Đã xuất viện'}
                    className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
                >
                     {statuses.map(s => <option key={s} value={s}>{statusConfig[s].title}</option>)}
                 </select>
            </div>
        </div>
    );
};
const InfoItem: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div>
        <p className="font-semibold text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-gray-900 dark:text-white">{value}</p>
    </div>
);

const OrdersTab: React.FC<{ record: InpatientRecord, setRecord: (r: InpatientRecord) => void, serviceItems: ServiceItem[], currentUserRole: UserRole }> = ({ record, setRecord, serviceItems, currentUserRole }) => {
    const isDoctor = currentUserRole === 'Bác sĩ/Y sĩ';
    const [newCareOrder, setNewCareOrder] = useState({ description: '', time: '' });

    const handleAddCareOrder = () => {
        if (!newCareOrder.description.trim()) return;
        const newTask: NursingTask = {
            id: `NT${Date.now()}`,
            ...newCareOrder,
            isCompleted: false,
            createdBy: 'Dr. Current' // Mock
        };
        setRecord({ ...record, nursingTasks: [...record.nursingTasks, newTask] });
        setNewCareOrder({ description: '', time: '' });
    };

    return (
        <div className="space-y-6">
            <ServiceOrderSelector 
                title="Chỉ định Dịch vụ CLS"
                availableServices={serviceItems}
                selectedItems={record.clinicalOrders}
                onSelectionChange={items => setRecord({...record, clinicalOrders: items})}
                disabled={!isDoctor}
            />
             <div>
                <h4 className="font-semibold mb-2">Chỉ định Chăm sóc (cho Điều dưỡng)</h4>
                {isDoctor && (
                    <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg mb-2">
                        <input value={newCareOrder.description} onChange={e => setNewCareOrder(p => ({...p, description: e.target.value}))} placeholder="Mô tả công việc" className="flex-grow p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600" />
                        <input value={newCareOrder.time} onChange={e => setNewCareOrder(p => ({...p, time: e.target.value}))} placeholder="Thời gian/Tần suất" className="w-1/3 p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600" />
                        <button onClick={handleAddCareOrder} className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600">Thêm</button>
                    </div>
                )}
                <ul className="space-y-1 text-sm max-h-48 overflow-y-auto pr-2">
                    {record.nursingTasks.map(task => <li key={task.id} className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded">{task.time} - {task.description}</li>)}
                    {record.nursingTasks.length === 0 && <p className="text-xs text-gray-500">Chưa có chỉ định chăm sóc nào.</p>}
                </ul>
            </div>
        </div>
    );
};

const PrescriptionTab: React.FC<{ record: InpatientRecord, setRecord: (r: InpatientRecord) => void, availableMedications: Medication[], currentUserRole: UserRole }> = ({ record, setRecord, availableMedications, currentUserRole }) => {
    const isDoctor = currentUserRole === 'Bác sĩ/Y sĩ';
    
    return (
        <div>
            <InpatientPrescriptionCreator
                availableMedications={availableMedications}
                prescribedItems={record.prescription || []}
                onPrescriptionChange={items => setRecord({ ...record, prescription: items })}
                disabled={!isDoctor}
            />
             {!isDoctor && <p className="text-xs text-yellow-600 mt-2">Chỉ bác sĩ mới có thể kê đơn thuốc.</p>}
        </div>
    );
};

const NursingTab: React.FC<{ record: InpatientRecord, setRecord: (r: InpatientRecord) => void, currentUserRole: UserRole }> = ({ record, setRecord, currentUserRole }) => {
    const isNurse = currentUserRole === 'Điều dưỡng';
    const [vitals, setVitals] = useState<Partial<VitalSigns>>({});

    const handleToggleTask = (taskId: string) => {
        if (!isNurse) return;
        const updatedTasks = record.nursingTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, isCompleted: !task.isCompleted, completedBy: 'Nurse Current', completedAt: new Date().toISOString() };
            }
            return task;
        });
        setRecord({ ...record, nursingTasks: updatedTasks });
    };
    
    const handleAddVitals = () => {
        const newRecord: VitalSignRecord = {
            timestamp: new Date().toLocaleString('sv-SE'),
            vitals: vitals as VitalSigns,
            recordedBy: 'Nurse Current'
        };
        setRecord({...record, vitalSignRecords: [newRecord, ...record.vitalSignRecords]});
        setVitals({});
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-semibold mb-2">Thực hiện Y lệnh Chăm sóc</h4>
                <ul className="space-y-2 text-sm max-h-80 overflow-y-auto pr-2">
                    {record.nursingTasks.map(task => (
                        <li key={task.id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                            <input type="checkbox" checked={task.isCompleted} onChange={() => handleToggleTask(task.id)} disabled={!isNurse} className="w-4 h-4 mr-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label className={`flex-grow ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.time} - {task.description}</label>
                        </li>
                    ))}
                     {record.nursingTasks.length === 0 && <p className="text-xs text-gray-500">Chưa có chỉ định chăm sóc nào.</p>}
                </ul>
            </div>
            <div>
                 <h4 className="font-semibold mb-2">Ghi nhận Dấu hiệu sống</h4>
                 {isNurse && (
                    <div className="space-y-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <input onChange={e => setVitals(p=>({...p, temp: e.target.value}))} placeholder="Nhiệt độ" className="p-1 border rounded dark:bg-gray-800 dark:border-gray-600" />
                            <input onChange={e => setVitals(p=>({...p, bp: e.target.value}))} placeholder="Huyết áp" className="p-1 border rounded dark:bg-gray-800 dark:border-gray-600" />
                            <input onChange={e => setVitals(p=>({...p, hr: e.target.value}))} placeholder="Nhịp tim" className="p-1 border rounded dark:bg-gray-800 dark:border-gray-600" />
                            <input onChange={e => setVitals(p=>({...p, spo2: e.target.value}))} placeholder="SpO2" className="p-1 border rounded dark:bg-gray-800 dark:border-gray-600" />
                        </div>
                        <button onClick={handleAddVitals} className="w-full bg-blue-500 text-white p-1.5 text-sm rounded hover:bg-blue-600">Thêm Ghi nhận</button>
                    </div>
                 )}
                 <h4 className="font-semibold mb-2 text-xs uppercase">Lịch sử Theo dõi</h4>
                 <ul className="space-y-1 text-xs max-h-48 overflow-y-auto pr-2">
                    {record.vitalSignRecords.map(vr => (
                        <li key={vr.timestamp} className="p-1.5 bg-gray-50 dark:bg-gray-900/50 rounded">
                            <p className="font-semibold">{vr.timestamp}</p>
                            <p>HA: {vr.vitals.bp}, M: {vr.vitals.hr}, T: {vr.vitals.temp}, SpO2: {vr.vitals.spo2}</p>
                        </li>
                    ))}
                     {record.vitalSignRecords.length === 0 && <p className="text-xs text-gray-500">Chưa có ghi nhận dấu hiệu sống.</p>}
                 </ul>
            </div>
        </div>
    );
};

const BillingTab: React.FC<{ record: InpatientRecord }> = ({ record }) => {
    const servicesTotal = record.clinicalOrders.reduce((sum, item) => sum + item.price, 0);
    const medsTotal = record.prescription?.reduce((sum, item) => sum + (item.cost * item.quantity), 0) || 0;
    const total = servicesTotal + medsTotal;
    
    return (
        <div>
            <h4 className="font-semibold mb-2">Bảng kê Chi phí Điều trị</h4>
            <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                    <tr className="border-b dark:border-gray-600"><th className="text-left p-2">Mô tả</th><th className="text-right p-2">Đơn giá</th></tr>
                </thead>
                <tbody>
                    <tr className="font-bold bg-gray-100 dark:bg-gray-900/50"><td colSpan={2} className="p-2">Dịch vụ lâm sàng</td></tr>
                    {record.clinicalOrders.map(item => (
                        <tr key={item.serviceId} className="border-b dark:border-gray-700"><td className="p-2 pl-4">{item.serviceName}</td><td className="p-2 text-right font-mono">{item.price.toLocaleString('vi-VN')} đ</td></tr>
                    ))}
                    {record.prescription && record.prescription.length > 0 && (
                       <tr className="font-bold bg-gray-100 dark:bg-gray-900/50"><td colSpan={2} className="p-2">Thuốc</td></tr>
                    )}
                    {record.prescription?.map(item => (
                        <tr key={item.medicationId} className="border-b dark:border-gray-700">
                            <td className="p-2 pl-4">{item.medicationName} (SL: {item.quantity})</td>
                            <td className="p-2 text-right font-mono">{(item.cost * item.quantity).toLocaleString('vi-VN')} đ</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold border-t-2 dark:border-gray-600">
                        <td className="p-2">Tổng cộng</td>
                        <td className="p-2 text-right font-mono text-lg">{total.toLocaleString('vi-VN')} đ</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

const DischargeTab: React.FC<{ 
    record: InpatientRecord, 
    setRecord: (r: InpatientRecord) => void, 
    currentUserRole: UserRole, 
    onSignAndFinalize: () => void 
}> = ({ record, setRecord, currentUserRole, onSignAndFinalize }) => {
    const isDoctor = currentUserRole === 'Bác sĩ/Y sĩ';

    return (
        <div>
            <h4 className="font-semibold mb-2">Tổng kết Bệnh án & Lời dặn</h4>
            <textarea
                value={record.dischargeSummary || ''}
                onChange={e => setRecord({ ...record, dischargeSummary: e.target.value })}
                rows={10}
                placeholder="Nhập tóm tắt quá trình điều trị, kết quả, hướng điều trị tiếp theo và lời dặn cho bệnh nhân..."
                className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-600"
                disabled={!isDoctor || record.status === 'Đã xuất viện' || record.isDischargeSummarySigned}
            />
            {isDoctor && record.status !== 'Đã xuất viện' && !record.isDischargeSummarySigned && (
                <button 
                    onClick={onSignAndFinalize} 
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    disabled={!record.dischargeSummary?.trim()}
                >
                    Hoàn tất và Ký số Báo cáo Ra viện
                </button>
            )}
            {record.isDischargeSummarySigned && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-md text-sm font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Báo cáo ra viện đã được ký số và không thể chỉnh sửa.
                </div>
            )}
             {isDoctor && record.status === 'Đang điều trị' && (
                 <p className="text-xs text-gray-500 mt-2">Lưu ý: Ký báo cáo sẽ tự động hoàn tất quá trình ra viện và tạo giao dịch thanh toán cuối cùng.</p>
             )}
        </div>
    );
};

// Reusable Service Selector
const ServiceOrderSelector: React.FC<{ title: string, availableServices: ServiceItem[], selectedItems: ServiceOrderItem[], onSelectionChange: (items: ServiceOrderItem[]) => void, disabled: boolean }> = ({ title, availableServices, selectedItems, onSelectionChange, disabled }) => {
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
            price: service.price,
            notes: '',
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
            {disabled ? <p className="text-xs text-gray-500">Chỉ bác sĩ mới có thể thêm chỉ định.</p> :
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
                    disabled={disabled}
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
            }
            <div className="mt-2 space-y-2">
                {selectedItems.map(item => (
                    <div key={item.serviceId} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        <div className="flex justify-between items-center">
                            <span>{item.serviceName}</span>
                            <div className="flex items-center space-x-3">
                                <span className="font-mono text-xs">{item.price.toLocaleString('vi-VN')} đ</span>
                                {!disabled && <button onClick={() => handleRemove(item.serviceId)}><XCircleIcon className="w-5 h-5 text-red-500 hover:text-red-700" /></button>}
                            </div>
                        </div>
                        <input 
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => handleNoteChange(item.serviceId, e.target.value)}
                            placeholder="Thêm ghi chú cho dịch vụ này..."
                            className="w-full text-xs p-1 mt-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                            disabled={disabled}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Inpatient Prescription Creator Component
interface InpatientPrescriptionCreatorProps {
    availableMedications: Medication[];
    prescribedItems: PrescribedMedication[];
    onPrescriptionChange: (items: PrescribedMedication[]) => void;
    disabled: boolean;
}
const InpatientPrescriptionCreator: React.FC<InpatientPrescriptionCreatorProps> = ({ availableMedications, prescribedItems, onPrescriptionChange, disabled }) => {
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

    const handleSelect = (med: Medication) => {
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
            <label className="block text-sm font-medium mb-1">Đơn thuốc nội trú</label>
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
                    disabled={disabled}
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
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {prescribedItems.map((item, index) => {
                    const medDetails = availableMedications.find(m => m.id === item.medicationId);
                    const alerts = medDetails ? getMedicationAlerts(medDetails) : { lowStock: false, expiringSoon: false };

                    return (
                        <div key={item.medicationId} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-semibold">{index + 1}. {item.medicationName}</p>
                                {!disabled && <button onClick={() => handleRemove(item.medicationId)}><XCircleIcon className="w-5 h-5 text-red-500 hover:text-red-700 flex-shrink-0" /></button>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm">
                                 <input type="text" value={item.dosage} onChange={e => handleUpdate(item.medicationId, 'dosage', e.target.value)} placeholder="Liều dùng & Tần suất" className="p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 sm:col-span-3" disabled={disabled}/>
                                 <input type="number" value={item.quantity} onChange={e => handleUpdate(item.medicationId, 'quantity', parseInt(e.target.value) || 0)} placeholder="Số lượng" className="p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 sm:col-span-2" disabled={disabled}/>
                                 <input type="text" value={item.notes || ''} onChange={e => handleUpdate(item.medicationId, 'notes', e.target.value)} placeholder="Hướng dẫn" className="p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 sm:col-span-5" disabled={disabled}/>
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
                 {prescribedItems.length === 0 && <p className="text-xs text-center text-gray-500 py-4">Chưa có thuốc nào được kê.</p>}
            </div>
        </div>
    );
};


export default IPDManagement;