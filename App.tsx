import React, { useState, useMemo, useEffect } from 'react';
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
import UserDepartmentManagement from './components/UserDepartmentManagement';
import FacilityManagement from './components/FacilityManagement';
import QualityManagement from './components/QualityManagement';
import SecurityManagement from './components/SecurityManagement';
import BusinessProcessFlow from './components/BusinessProcessFlow';
import PatientPortal from './components/PatientPortal';
import Telemedicine from './components/Telemedicine';
import PatientDetail from './components/PatientDetail';
import DigitalSignatureLogs from './components/DigitalSignatureLogs';
import Reception from './components/Reception';
import QueueManagement from './components/QueueManagement';

// Types and mock data
import { type UserRole, type Staff, type Patient, type FinancialRecord, type OutpatientVisit, type Medication, type MedicationCategory, type Supplier, type LabTest, type RadiologyExam, type InpatientRecord, type Appointment, type TelemedicineSession, type QueueTicket, type Invoice, type Department, type ServiceItem, type AuditLog, type DocumentVersion, type SignatureLog, type WorkShift, type AttendanceRecord, type PayrollRecord, type TrainingRecord, type MedicalSupply, type Asset, type Role, type LabTestStatus, type RadiologyExamStatus } from './types';
import { mockVisits } from './data/mockData';
import { 
    getPatients, addPatient, updatePatient, deletePatient,
    getStaff, addStaff, updateStaff, deleteStaff,
    getAppointments, addAppointment, updateAppointment, deleteAppointment,
    getFinancialRecords, addFinancialRecord,
    getOpdVisits, updateOpdVisit,
    getInpatientRecords, updateInpatientRecord,
    getMedications, addMedication, updateMedication, deleteMedication,
    getMedicationCategories, addMedicationCategory, updateMedicationCategory, deleteMedicationCategory,
    getSuppliers, addSupplier, updateSupplier, deleteSupplier,
    getLabTests, addLabTest, updateLabTest, deleteLabTest,
    getRadiologyExams, addRadiologyExam, updateRadiologyExam, deleteRadiologyExam,
    getTelemedicineSessions, updateTelemedicineSession,
    getInvoices, addInvoice, updateInvoice, deleteInvoice,
    getQueueTickets, addQueueTicket, updateQueueTicket,
    getDepartments, getServiceItems,    getAuditLogs, addAuditLog,
    getDocumentVersions, getSignatureLogs,
    getWorkShifts, getAttendanceRecords, getPayrollRecords, getTrainingRecords,
    getMedicalSupplies, addMedicalSupply, updateMedicalSupply, deleteMedicalSupply,
    getAssets, addAsset, updateAsset, deleteAsset,
    getRoles, addRole, updateRole, deleteRole,
    addDepartment, updateDepartment, deleteDepartment
} from './services/supabaseService';

const App: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>('Reception');
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Bác sĩ/Y sĩ');
    
    // State for data that can be modified
    const [patients, setPatients] = useState<Patient[]>([]);
    const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
    const [opdVisits, setOpdVisits] = useState<OutpatientVisit[]>([]);
    const [inpatientRecords, setInpatientRecords] = useState<InpatientRecord[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [medicationCategories, setMedicationCategories] = useState<MedicationCategory[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [labTests, setLabTests] = useState<LabTest[]>([]);
    const [radiologyExams, setRadiologyExams] = useState<RadiologyExam[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [telemedicineSessions, setTelemedicineSessions] = useState<TelemedicineSession[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [queueTickets, setQueueTickets] = useState<QueueTicket[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [documentVersions, setDocumentVersions] = useState<DocumentVersion[]>([]);
    const [signatureLogs, setSignatureLogs] = useState<SignatureLog[]>([]);
    const [workShifts, setWorkShifts] = useState<WorkShift[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
    const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
    const [medicalSupplies, setMedicalSupplies] = useState<MedicalSupply[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    
    const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [
                patientsData, staffData, appointmentsData, financialData,
                opdData, inpatientData, medicationsData, categoriesData,
                suppliersData, labData, radiologyData, teleData,
                invoicesData, queueData, departmentsData, serviceData,
                auditData, docData, sigData,
                shiftsData, attendanceData, payrollData, trainingData,
                suppliesData, assetsData, rolesData
            ] = await Promise.all([
                getPatients(), getStaff(), getAppointments(), getFinancialRecords(),
                getOpdVisits(), getInpatientRecords(), getMedications(), getMedicationCategories(),
                getSuppliers(), getLabTests(), getRadiologyExams(), getTelemedicineSessions(),
                getInvoices(), getQueueTickets(), getDepartments(), getServiceItems(),
                getAuditLogs(), getDocumentVersions(), getSignatureLogs(),
                getWorkShifts(), getAttendanceRecords(), getPayrollRecords(), getTrainingRecords(),
                getMedicalSupplies(), getAssets(), getRoles()
            ]);

            setPatients(patientsData);
            setStaff(staffData);
            setAppointments(appointmentsData);
            setFinancialRecords(financialData);
            setOpdVisits(opdData);
            setInpatientRecords(inpatientData);
            setMedications(medicationsData);
            setMedicationCategories(categoriesData);
            setSuppliers(suppliersData);
            setLabTests(labData);
            setRadiologyExams(radiologyData);
            setTelemedicineSessions(teleData);
            setInvoices(invoicesData);
            setQueueTickets(queueData);
            setDepartments(departmentsData);
            setServiceItems(serviceData);
            setAuditLogs(auditData);
            setDocumentVersions(docData);
            setSignatureLogs(sigData);
            setWorkShifts(shiftsData);
            setAttendanceRecords(attendanceData);
            setPayrollRecords(payrollData);
            setTrainingRecords(trainingData);
            setMedicalSupplies(suppliesData);
            setAssets(assetsData);
            setRoles(rolesData);
        };
        fetchData();
    }, []);

    // Handlers to modify state from child components
    const handleAddPatient = async (patientData: Omit<Patient, 'id'>) => {
        const newPatientId = await addPatient(patientData);
        const newPatient = { ...patientData, id: newPatientId } as Patient;
        setPatients(prev => [newPatient, ...prev]);
    };

    const handleUpdatePatient = async (updatedPatient: Patient) => {
        const { id, ...patientData } = updatedPatient;
        await updatePatient(id, patientData);
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    };
    
    const handleDeletePatient = async (patientId: string) => {
        await deletePatient(patientId);
        setPatients(prev => prev.filter(p => p.id !== patientId));
    };

    const handleViewDetail = (patientId: string) => {
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            setViewingPatient(patient);
            setActiveComponent('PatientDetail');
        }
    };
    
    const handleAddFinancialRecords = async (records: Omit<FinancialRecord, 'id'>[]) => {
        const newRecords = await Promise.all(records.map(async r => {
            const id = await addFinancialRecord(r);
            return { ...r, id };
        }));
        setFinancialRecords(prev => [...prev, ...newRecords]);
    };
    
    const handleUpdateOpdVisit = async (visit: OutpatientVisit) => {
        const { id, ...visitData } = visit;
        await updateOpdVisit(id, visitData);
        setOpdVisits(prev => prev.map(v => v.id === visit.id ? visit : v));
    };

    const handleUpdateInpatientRecord = async (updatedRecord: InpatientRecord) => {
        const { id, ...recordData } = updatedRecord;
        await updateInpatientRecord(id, recordData);
        setInpatientRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    };
    
    const handleUpdateMedicationStock = async (medicationId: string, quantityChange: number) => {
        const med = medications.find(m => m.id === medicationId);
        if (med) {
            const newStock = Math.max(0, med.stock + quantityChange);
            await updateMedication(medicationId, { stock: newStock });
            setMedications(prev => prev.map(m => m.id === medicationId ? { ...m, stock: newStock } : m));
        }
    };

    const handleDeleteMedicationStock = async (id: string) => {
        try {
            await deleteMedication(id);
            setMedications(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa thuốc:', error);
        }
    };

    const handleAddMedication = async (data: Omit<Medication, 'id'>) => {
        try {
            const id = await addMedication(data);
            setMedications(prev => [{ ...data, id }, ...prev]);
        } catch (error) {
            console.error('Lỗi khi thêm thuốc:', error);
        }
    };

    const handleUpdateMedicationFull = async (data: Medication) => {
        try {
            const { id, ...rest } = data;
            await updateMedication(id, rest);
            setMedications(prev => prev.map(m => m.id === id ? data : m));
        } catch (error) {
            console.error('Lỗi khi cập nhật thuốc:', error);
        }
    };

    const handleAddMedicationCategory = async (data: Omit<MedicationCategory, 'id'>) => {
        try {
            const id = await addMedicationCategory(data);
            setMedicationCategories(prev => [{ ...data, id }, ...prev]);
        } catch (error) {
            console.error('Lỗi khi thêm danh mục thuốc:', error);
        }
    };

    const handleUpdateMedicationCategory = async (data: MedicationCategory) => {
        try {
            const { id, ...rest } = data;
            await updateMedicationCategory(id, rest);
            setMedicationCategories(prev => prev.map(c => c.id === id ? data : c));
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục thuốc:', error);
        }
    };

    const handleDeleteMedicationCategory = async (id: string) => {
        try {
            await deleteMedicationCategory(id);
            setMedicationCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa danh mục thuốc:', error);
        }
    };

    const handleAddSupplier = async (data: Omit<Supplier, 'id'>) => {
        try {
            const id = await addSupplier(data);
            setSuppliers(prev => [{ ...data, id }, ...prev]);
        } catch (error) {
            console.error('Lỗi khi thêm nhà cung cấp:', error);
        }
    };

    const handleUpdateSupplier = async (data: Supplier) => {
        try {
            const { id, ...rest } = data;
            await updateSupplier(id, rest);
            setSuppliers(prev => prev.map(s => s.id === id ? data : s));
        } catch (error) {
            console.error('Lỗi khi cập nhật nhà cung cấp:', error);
        }
    };

    const handleDeleteSupplier = async (id: string) => {
        try {
            await deleteSupplier(id);
            setSuppliers(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa nhà cung cấp:', error);
        }
    };

    const handleAddLabTest = async (testData: Omit<LabTest, 'id' | 'orderId' | 'status' | 'results'>) => {
        const fullTestData = {
            ...testData,
            orderId: `ORD-L${Date.now().toString().slice(-4)}`,
            status: 'Đã chỉ định' as LabTestStatus,
            results: '',
        };
        const id = await addLabTest(fullTestData);
        const newTest: LabTest = { ...fullTestData, id };
        setLabTests(prev => [newTest, ...prev]);
    };

    const handleDeleteLabTest = async (testId: string) => {
        await deleteLabTest(testId);
        setLabTests(prev => prev.filter(t => t.id !== testId));
    };
    
    const handleUpdateLabTest = async (test: LabTest) => {
        const { id, ...testData } = test;
        await updateLabTest(id, testData);
        setLabTests(prev => prev.map(t => t.id === test.id ? test : t));
    };

    const handleAddRadiologyExam = async (examData: Omit<RadiologyExam, 'id' | 'orderId' | 'status' | 'report'>) => {
        const fullExamData = {
            ...examData,
            orderId: `ORD-R${Date.now().toString().slice(-4)}`,
            status: 'Đã chỉ định' as RadiologyExamStatus,
            report: '',
        };
        const id = await addRadiologyExam(fullExamData);
        const newExam: RadiologyExam = { ...fullExamData, id };
        setRadiologyExams(prev => [newExam, ...prev]);
    };

    const handleDeleteRadiologyExam = async (examId: string) => {
        await deleteRadiologyExam(examId);
        setRadiologyExams(prev => prev.filter(e => e.id !== examId));
    };

    const handleUpdateRadiologyExam = async (exam: RadiologyExam) => {
        const { id, ...examData } = exam;
        await updateRadiologyExam(id, examData);
        setRadiologyExams(prev => prev.map(e => e.id === exam.id ? exam : e));
    };

    const handleAddStaff = async (staffData: Omit<Staff, 'id'>) => {
        const id = await addStaff(staffData);
        const newStaff: Staff = { ...staffData, id };
        setStaff(prev => [newStaff, ...prev]);
    };

    const handleUpdateStaff = async (updatedStaff: Staff) => {
        const { id, ...staffData } = updatedStaff;
        await updateStaff(id, staffData);
        setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    };

    const handleDeleteStaff = async (staffId: string) => {
        await deleteStaff(staffId);
        setStaff(prev => prev.filter(s => s.id !== staffId));
    };

    const handleAddRole = async (data: Omit<Role, 'id'>) => {
        try {
            const id = await addRole(data);
            setRoles(prev => [{ ...data, id }, ...prev]);
        } catch (error) {
            console.error('Lỗi khi thêm vai trò:', error);
        }
    };

    const handleUpdateRole = async (data: Role) => {
        try {
            const { id, ...rest } = data;
            await updateRole(id, rest);
            setRoles(prev => prev.map(r => r.id === id ? data : r));
        } catch (error) {
            console.error('Lỗi khi cập nhật vai trò:', error);
        }
    };

    const handleDeleteRole = async (id: string) => {
        try {
            await deleteRole(id);
            setRoles(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa vai trò:', error);
        }
    };

    const handleAddDepartment = async (data: Omit<Department, 'id'>) => {
        try {
            const id = await addDepartment(data);
            setDepartments(prev => [{ ...data, id }, ...prev]);
        } catch (error) {
            console.error('Lỗi khi thêm khoa:', error);
        }
    };

    const handleUpdateDepartment = async (data: Department) => {
        try {
            const { id, ...rest } = data;
            await updateDepartment(id, rest);
            setDepartments(prev => prev.map(d => d.id === id ? data : d));
        } catch (error) {
            console.error('Lỗi khi cập nhật khoa:', error);
        }
    };

    const handleDeleteDepartment = async (id: string) => {
        try {
            await deleteDepartment(id);
            setDepartments(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa khoa:', error);
        }
    };

    const handleAddInvoice = async (data: Omit<Invoice, 'id'>) => {
        try {
            const id = await addInvoice(data);
            setInvoices(prev => [{ ...data, id }, ...prev]);
        } catch (error) {
            console.error('Lỗi khi thêm hóa đơn:', error);
        }
    };

    const handleUpdateInvoice = async (data: Invoice) => {
        try {
            const { id, ...rest } = data;
            await updateInvoice(id, rest);
            setInvoices(prev => prev.map(inv => inv.id === id ? data : inv));
        } catch (error) {
            console.error('Lỗi khi cập nhật hóa đơn:', error);
        }
    };

    const handleDeleteInvoice = async (id: string) => {
        try {
            await deleteInvoice(id);
            setInvoices(prev => prev.filter(inv => inv.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa hóa đơn:', error);
        }
    };

    const handleCheckIn = async (patientId: string, departmentId: string) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return;

        const ticketData: Omit<QueueTicket, 'id'> = {
            patientName: patient.name,
            departmentId: departmentId,
            status: 'Đang chờ'
        };
        const id = await addQueueTicket(ticketData);
        const newTicket: QueueTicket = { ...ticketData, id };
        setQueueTickets(prev => [...prev, newTicket]);
    };

    const handleCallNextPatient = async (ticketId: number) => {
        await updateQueueTicket(ticketId, { status: 'Đang khám' });
        setQueueTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Đang khám' } : t));
    };

    const handleAddAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
        const id = await addAppointment(appointmentData);
        const newAppointment: Appointment = { ...appointmentData, id };
        setAppointments(prev => [...prev, newAppointment]);
    };

    const handleUpdateAppointment = async (updatedAppointment: Appointment) => {
        const { id, ...appointmentData } = updatedAppointment;
        await updateAppointment(id, appointmentData);
        setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
    };

    const handleDeleteAppointment = async (appointmentId: string) => {
        await deleteAppointment(appointmentId);
        setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    };
    
    const handleUpdateTelemedicineSession = async (updatedSession: TelemedicineSession) => {
        const { id, ...sessionData } = updatedSession;
        await updateTelemedicineSession(id, sessionData);
        setTelemedicineSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    };

    const renderActiveComponent = () => {
        // Handle patient detail view separately
        if (activeComponent === 'PatientDetail' && viewingPatient) {
            return <PatientDetail 
                patient={viewingPatient} 
                onBack={() => setActiveComponent('PatientRegistration')} 
                opdVisits={opdVisits.filter(v => v.patientId === viewingPatient.id)}
                inpatientRecords={inpatientRecords.filter(r => r.patientId === viewingPatient.id)}
                labTests={labTests.filter(t => t.patientId === viewingPatient.id)}
                radiologyExams={radiologyExams.filter(e => e.patientId === viewingPatient.id)}
                invoices={invoices.filter(i => i.patientId === viewingPatient.id)}
                emrVisits={mockVisits[viewingPatient.id] || []}
            />;
        }

        switch (activeComponent) {
            case 'Dashboard': return <Dashboard />;
            case 'Reception': return <Reception 
                                        patients={patients} 
                                        appointments={appointments} 
                                        onRegisterPatient={handleAddPatient} 
                                        onCheckIn={handleCheckIn}
                                        currentUserRole={currentUserRole}
                                    />;
            case 'QueueManagement': return <QueueManagement 
                                                queueTickets={queueTickets} 
                                                departments={departments} 
                                                onCallNextPatient={handleCallNextPatient} 
                                            />;
            case 'PatientRegistration': return <PatientRegistration onAddPatient={handleAddPatient} onUpdatePatient={handleUpdatePatient} onDeletePatient={handleDeletePatient} onViewDetail={handleViewDetail} currentUserRole={currentUserRole} patients={patients} />;
            case 'OPDManagement': return <OPDManagement 
                                            visits={opdVisits} 
                                            onUpdateVisit={handleUpdateOpdVisit} 
                                            medications={medications} 
                                            serviceItems={serviceItems} 
                                            onAddFinancialRecords={handleAddFinancialRecords}
                                            onAddLabTest={handleAddLabTest}
                                            onAddRadiologyExam={handleAddRadiologyExam}
                                            onUpdateMedicationStock={handleUpdateMedicationStock}
                                        />;
            case 'IPDManagement': return <IPDManagement 
                                            inpatientRecords={inpatientRecords}
                                            onUpdateInpatientRecord={handleUpdateInpatientRecord}
                                            serviceItems={serviceItems}
                                            medications={medications}
                                            onAddFinancialRecords={handleAddFinancialRecords}
                                            currentUserRole={currentUserRole}
                                            onAddLabTest={handleAddLabTest}
                                            onAddRadiologyExam={handleAddRadiologyExam}
                                            onUpdateMedicationStock={handleUpdateMedicationStock}
                                        />;
            case 'EMR': return <EMR currentUserRole={currentUserRole} />;
            case 'NursingInformationSystem': return <NursingInformationSystem inpatientRecords={inpatientRecords} onUpdateInpatientRecord={handleUpdateInpatientRecord} currentUserRole={currentUserRole} />;
            case 'AppointmentSchedule': return <AppointmentSchedule 
                                                    currentUserRole={currentUserRole} 
                                                    currentUserId="S001" 
                                                    appointments={appointments} 
                                                    doctors={staff.filter(s => s.role === 'Bác sĩ').map(s => ({ id: s.id, name: s.name }))}
                                                    onAddAppointment={handleAddAppointment}
                                                    onUpdateAppointment={handleUpdateAppointment}
                                                    onDeleteAppointment={handleDeleteAppointment}
                                                />;
            case 'OTSchedule': return <OTSchedule />;
            case 'AIChat': return <AIChat />;
            case 'LIS': return <LIS labTests={labTests} onUpdateLabTest={handleUpdateLabTest} onAddLabTest={handleAddLabTest} onDeleteLabTest={handleDeleteLabTest} currentUserRole={currentUserRole} />;
            case 'RISPACS': return <RISPACS radiologyExams={radiologyExams} onUpdateExam={handleUpdateRadiologyExam} onAddRadiologyExam={handleAddRadiologyExam} onDeleteRadiologyExam={handleDeleteRadiologyExam} currentUserRole={currentUserRole} />;
            case 'ServiceBilling': return <ServiceBilling 
                                            invoices={invoices}
                                            patients={patients}
                                            serviceItems={serviceItems}
                                            onAddInvoice={handleAddInvoice}
                                            onUpdateInvoice={handleUpdateInvoice}
                                            onDeleteInvoice={handleDeleteInvoice}
                                        />;
            case 'InsuranceClaims': return <InsuranceClaims />;
            case 'FinancialLedger': return <FinancialLedger records={financialRecords} />;
            case 'ServiceMasterManagement': return <ServiceMasterManagement />;
            case 'PharmacyManagement': return <PharmacyManagement 
                                                medications={medications} 
                                                categories={medicationCategories} 
                                                suppliers={suppliers} 
                                                onAddMedication={handleAddMedication}
                                                onUpdateMedication={handleUpdateMedicationFull}
                                                onDeleteMedication={handleDeleteMedicationStock}
                                                onAddCategory={handleAddMedicationCategory}
                                                onUpdateCategory={handleUpdateMedicationCategory}
                                                onDeleteCategory={handleDeleteMedicationCategory}
                                                onAddSupplier={handleAddSupplier}
                                                onUpdateSupplier={handleUpdateSupplier}
                                                onDeleteSupplier={handleDeleteSupplier}
                                            />;
            case 'InventoryManagement': return <InventoryManagement supplies={medicalSupplies} />;
            case 'AssetManagement': return <AssetManagement assets={assets} />;
            case 'HRManagement': return <HRManagement 
                                            currentUserRole={currentUserRole} 
                                            staffList={staff}
                                            workShifts={workShifts}
                                            attendanceRecords={attendanceRecords}
                                            payrollRecords={payrollRecords}
                                            trainingRecords={trainingRecords}
                                            onAddStaff={handleAddStaff}
                                            onUpdateStaff={handleUpdateStaff}
                                            onDeleteStaff={handleDeleteStaff}
                                        />;
            case 'UserDepartmentManagement': return <UserDepartmentManagement 
                                                currentUserRole={currentUserRole} 
                                                users={staff}
                                                departments={departments}
                                                onAddUser={handleAddStaff}
                                                onUpdateUser={handleUpdateStaff}
                                                onDeleteUser={handleDeleteStaff}
                                            />;
            case 'FacilityManagement': return <FacilityManagement 
                                                currentUserRole={currentUserRole} 
                                                departments={departments}
                                                onAddDepartment={handleAddDepartment}
                                                onUpdateDepartment={handleUpdateDepartment}
                                                onDeleteDepartment={handleDeleteDepartment}
                                            />;
            case 'QualityManagement': return <QualityManagement />;
            case 'SecurityManagement': return <SecurityManagement 
                                                currentUserRole={currentUserRole} 
                                                roles={roles}
                                                onAddRole={handleAddRole}
                                                onUpdateRole={handleUpdateRole}
                                                onDeleteRole={handleDeleteRole}
                                                auditLogs={auditLogs}
                                            />;
            case 'DigitalSignatureLogs': return <DigitalSignatureLogs />;
            case 'BusinessProcessFlow': return <BusinessProcessFlow />;
            case 'PatientPortal': return <PatientPortal 
                                            appointments={appointments} 
                                            onAddAppointment={handleAddAppointment}
                                            onUpdateAppointment={handleUpdateAppointment}
                                            onDeleteAppointment={handleDeleteAppointment}
                                            departments={departments}
                                            doctors={staff.filter(s => s.role === 'Bác sĩ').map(s => ({ id: s.id, name: s.name, departmentId: s.department }))}
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
