import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PatientRegistration from './components/PatientRegistration';
import OPDManagement from './components/OPDManagement';
import IPDManagement from './components/IPDManagement';
import EMR from './components/EMR';
import NursingInformationSystem from './components/NursingInformationSystem';
import AppointmentSchedule from './components/AppointmentSchedule';
import OTSchedule from './components/OTSchedule';
import AIChat from './components/AIChat';
import LIS from './components/LIS';
import RISPACS from './components/RISPACS';
import ServiceBilling from './components/ServiceBilling';
import InsuranceClaims from './components/InsuranceClaims';
import FinancialLedger from './components/FinancialLedger';
import ServiceMasterManagement from './components/ServiceMasterManagement';
import PharmacyManagement from './components/PharmacyManagement';
import InventoryManagement from './components/InventoryManagement';
import AssetManagement from './components/AssetManagement';
import HRManagement from './components/HRManagement';
import FacilityManagement from './components/FacilityManagement';
import QualityManagement from './components/QualityManagement';
import SecurityManagement from './components/SecurityManagement';
import BusinessProcessFlow from './components/BusinessProcessFlow';
import PatientPortal from './components/PatientPortal';
import Telemedicine from './components/Telemedicine';
import PatientDetail from './components/PatientDetail';

// Types and mock data
import { type UserRole, type Patient, type FinancialRecord, type OutpatientVisit, type Medication, type MedicationCategory, type Supplier, type LabTest, type RadiologyExam, type InpatientRecord, type Appointment, type TelemedicineSession } from './types';
import { mockPatients, mockFinancialRecords, mockOutpatientVisits, mockMedications, mockMedicationCategories, mockSuppliers, mockLabTests, mockRadiologyExams, mockServiceItems, mockInpatientRecords, mockAppointments, mockDoctors, mockDepartments, mockTelemedicineSessions } from './data/mockData';

const App: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>('ServiceBilling');
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Bác sĩ/Y sĩ');
    
    // State for data that can be modified
    const [patients, setPatients] = useState<Patient[]>(mockPatients);
    const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(mockFinancialRecords);
    const [opdVisits, setOpdVisits] = useState<OutpatientVisit[]>(mockOutpatientVisits);
    const [inpatientRecords, setInpatientRecords] = useState<InpatientRecord[]>(mockInpatientRecords);
    const [medications, setMedications] = useState<Medication[]>(mockMedications);
    const [medicationCategories, setMedicationCategories] = useState<MedicationCategory[]>(mockMedicationCategories);
    const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
    const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests);
    const [radiologyExams, setRadiologyExams] = useState<RadiologyExam[]>(mockRadiologyExams);
    const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
    const [telemedicineSessions, setTelemedicineSessions] = useState<TelemedicineSession[]>(mockTelemedicineSessions);
    
    const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

    // Handlers to modify state from child components
    const handleAddPatient = (patientData: Omit<Patient, 'id' | 'avatar'>) => {
        const newPatient: Patient = {
            ...patientData,
            id: `P${Date.now().toString().slice(-4)}`,
            avatar: `https://picsum.photos/seed/${Date.now()}/40/40`,
        };
        setPatients(prev => [newPatient, ...prev]);
    };

    const handleUpdatePatient = (updatedPatient: Patient) => {
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    };
    
    const handleDeletePatient = (patientId: string) => {
        setPatients(prev => prev.filter(p => p.id !== patientId));
    };

    const handleViewDetail = (patientId: string) => {
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            setViewingPatient(patient);
            setActiveComponent('PatientDetail');
        }
    };
    
    const handleAddFinancialRecords = (records: Omit<FinancialRecord, 'id'>[]) => {
        const newRecords = records.map(r => ({ ...r, id: `FIN${Date.now()}${Math.random()}` }));
        setFinancialRecords(prev => [...prev, ...newRecords]);
    };
    
    const handleUpdateOpdVisit = (visit: OutpatientVisit) => {
        setOpdVisits(prev => prev.map(v => v.id === visit.id ? visit : v));
    };

    const handleUpdateInpatientRecord = (updatedRecord: InpatientRecord) => {
        setInpatientRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    };
    
    const handleAddLabTest = (testData: Omit<LabTest, 'id' | 'orderId' | 'status' | 'results'>) => {
        const newTest: LabTest = {
            ...testData,
            id: `LAB${Date.now()}`,
            orderId: `ORD-L${Date.now().toString().slice(-4)}`,
            status: 'Đã chỉ định',
            results: '',
        };
        setLabTests(prev => [newTest, ...prev].sort((a,b) => a.orderDate > b.orderDate ? -1 : 1));
    };

    const handleDeleteLabTest = (testId: string) => {
        setLabTests(prev => prev.filter(t => t.id !== testId));
    };
    
    const handleUpdateLabTest = (test: LabTest) => {
        setLabTests(prev => prev.map(t => t.id === test.id ? test : t));
    };

    const handleAddRadiologyExam = (examData: Omit<RadiologyExam, 'id' | 'orderId' | 'status' | 'report'>) => {
        const newExam: RadiologyExam = {
            ...examData,
            id: `RAD${Date.now()}`,
            orderId: `ORD-R${Date.now().toString().slice(-4)}`,
            status: 'Đã chỉ định',
            report: '',
        };
        setRadiologyExams(prev => [newExam, ...prev].sort((a,b) => a.orderDate > b.orderDate ? -1 : 1));
    };

    const handleDeleteRadiologyExam = (examId: string) => {
        setRadiologyExams(prev => prev.filter(e => e.id !== examId));
    };

    const handleUpdateRadiologyExam = (exam: RadiologyExam) => {
        setRadiologyExams(prev => prev.map(e => e.id === exam.id ? exam : e));
    };

    const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
        const newAppointment: Appointment = {
            ...appointmentData,
            id: `A${Date.now()}`,
        };
        setAppointments(prev => [...prev, newAppointment].sort((a,b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()));
    };

    const handleUpdateAppointment = (updatedAppointment: Appointment) => {
        setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a).sort((a,b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()));
    };

    const handleDeleteAppointment = (appointmentId: string) => {
        setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    };
    
    const handleUpdateTelemedicineSession = (updatedSession: TelemedicineSession) => {
        setTelemedicineSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    };

    const renderActiveComponent = () => {
        // Handle patient detail view separately
        if (activeComponent === 'PatientDetail' && viewingPatient) {
            return <PatientDetail patient={viewingPatient} onBack={() => setActiveComponent('PatientRegistration')} />;
        }

        switch (activeComponent) {
            case 'Dashboard': return <Dashboard />;
            case 'PatientRegistration': return <PatientRegistration onAddPatient={handleAddPatient} onUpdatePatient={handleUpdatePatient} onDeletePatient={handleDeletePatient} onViewDetail={handleViewDetail} currentUserRole={currentUserRole} patients={patients} />;
            case 'OPDManagement': return <OPDManagement 
                                            visits={opdVisits} 
                                            onUpdateVisit={handleUpdateOpdVisit} 
                                            medications={medications} 
                                            serviceItems={mockServiceItems} 
                                            onAddFinancialRecords={handleAddFinancialRecords}
                                            onAddLabTest={handleAddLabTest}
                                            onAddRadiologyExam={handleAddRadiologyExam}
                                        />;
            case 'IPDManagement': return <IPDManagement 
                                            inpatientRecords={inpatientRecords}
                                            onUpdateInpatientRecord={handleUpdateInpatientRecord}
                                            serviceItems={mockServiceItems}
                                            medications={medications}
                                            onAddFinancialRecords={handleAddFinancialRecords}
                                            currentUserRole={currentUserRole} 
                                            onAddLabTest={handleAddLabTest}
                                            onAddRadiologyExam={handleAddRadiologyExam}
                                        />;
            case 'EMR': return <EMR currentUserRole={currentUserRole} />;
            case 'NursingInformationSystem': return <NursingInformationSystem inpatientRecords={inpatientRecords} onUpdateInpatientRecord={handleUpdateInpatientRecord} currentUserRole={currentUserRole} />;
            case 'AppointmentSchedule': return <AppointmentSchedule 
                                                    currentUserRole={currentUserRole} 
                                                    currentUserId="S001" 
                                                    appointments={appointments} 
                                                    onAddAppointment={handleAddAppointment}
                                                    onUpdateAppointment={handleUpdateAppointment}
                                                    onDeleteAppointment={handleDeleteAppointment}
                                                />;
            case 'OTSchedule': return <OTSchedule />;
            case 'AIChat': return <AIChat />;
            case 'LIS': return <LIS labTests={labTests} onUpdateLabTest={handleUpdateLabTest} onAddLabTest={handleAddLabTest} onDeleteLabTest={handleDeleteLabTest} currentUserRole={currentUserRole} />;
            case 'RISPACS': return <RISPACS radiologyExams={radiologyExams} onUpdateExam={handleUpdateRadiologyExam} onAddRadiologyExam={handleAddRadiologyExam} onDeleteRadiologyExam={handleDeleteRadiologyExam} currentUserRole={currentUserRole} />;
            case 'ServiceBilling': return <ServiceBilling />;
            case 'InsuranceClaims': return <InsuranceClaims />;
            case 'FinancialLedger': return <FinancialLedger records={financialRecords} />;
            case 'ServiceMasterManagement': return <ServiceMasterManagement />;
            case 'PharmacyManagement': return <PharmacyManagement medications={medications} setMedications={setMedications} categories={medicationCategories} setCategories={setMedicationCategories} suppliers={suppliers} setSuppliers={setSuppliers} />;
            case 'InventoryManagement': return <InventoryManagement />;
            case 'AssetManagement': return <AssetManagement />;
            case 'HRManagement': return <HRManagement currentUserRole={currentUserRole} />;
            case 'FacilityManagement': return <FacilityManagement currentUserRole={currentUserRole} />;
            case 'QualityManagement': return <QualityManagement />;
            case 'SecurityManagement': return <SecurityManagement currentUserRole={currentUserRole} />;
            case 'BusinessProcessFlow': return <BusinessProcessFlow />;
            case 'PatientPortal': return <PatientPortal 
                                            appointments={appointments} 
                                            onAddAppointment={handleAddAppointment}
                                            onUpdateAppointment={handleUpdateAppointment}
                                            onDeleteAppointment={handleDeleteAppointment}
                                            departments={mockDepartments}
                                            doctors={mockDoctors}
                                            currentPatient={{id: "P004", name: "Phạm Thị Dung"}}
                                         />;
            case 'Telemedicine': return <Telemedicine sessions={telemedicineSessions} onUpdateSession={handleUpdateTelemedicineSession} />;
            // Other components can be added here
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} currentUserRole={currentUserRole} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header currentUserRole={currentUserRole} setCurrentUserRole={setCurrentUserRole} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    {renderActiveComponent()}
                </main>
            </div>
        </div>
    );
};

export default App;