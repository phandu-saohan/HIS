import React, { useState, useEffect, useMemo } from 'react';
import { getDepartmentSuggestion } from '../services/geminiService';
import { type PortalMessage, type Appointment, type Department } from '../types';
import Card from './ui/Card';

const mockMessages: PortalMessage[] = [
    { id: 'MSG01', patientName: 'Phạm Thị Dung', subject: 'Câu hỏi về đơn thuốc', date: '2024-07-29 10:30', isRead: false },
    { id: 'MSG02', patientName: 'Hoàng Văn Em', subject: 'Yêu cầu kết quả xét nghiệm', date: '2024-07-29 09:15', isRead: false },
    { id: 'MSG03', patientName: 'Lê Văn Cường', subject: 'Cảm ơn bác sĩ', date: '2024-07-28 16:45', isRead: true },
];

interface PatientPortalProps {
    appointments: Appointment[];
    onAddAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
    onUpdateAppointment: (appointment: Appointment) => void;
    onDeleteAppointment: (appointmentId: string) => void;
    departments: Omit<Department, 'rooms'>[];
    doctors: { id: string; name: string; departmentId: string; }[];
    currentPatient: { id: string; name: string; };
}


const PatientPortal: React.FC<PatientPortalProps> = ({ appointments, onAddAppointment, onUpdateAppointment, onDeleteAppointment, departments, doctors, currentPatient }) => {
    const [messages] = useState<PortalMessage[]>(mockMessages);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
    
    const unreadMessages = messages.filter(m => !m.isRead).length;

    const myUpcomingAppointments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        return appointments
            .filter(app => app.patientName === currentPatient.name && new Date(app.date) >= today)
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [appointments, currentPatient.name]);
    
    const handleEditAppointment = (app: Appointment) => {
        setAppointmentToEdit(app);
        setIsBookingModalOpen(true);
    };

    const handleDeleteAppointment = (appId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
            onDeleteAppointment(appId);
        }
    };

    const handleSaveAppointment = (data: Omit<Appointment, 'id'>, id?: string) => {
        if (id) {
            onUpdateAppointment({ ...data, id });
        } else {
            onAddAppointment(data);
        }
    };

    const handleCloseModal = () => {
        setIsBookingModalOpen(false);
        setAppointmentToEdit(null);
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Cổng thông tin Bệnh nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card title="Tin nhắn chưa đọc" value={unreadMessages} icon={<MailIcon />} color="bg-blue-100 dark:bg-blue-900 text-blue-500" />
                <Card title="Lịch hẹn sắp tới" value={myUpcomingAppointments.length} icon={<CalendarIcon />} color="bg-yellow-100 dark:bg-yellow-900 text-yellow-500" />
                <Card title="Bệnh nhân hoạt động" value={25} icon={<UsersIcon />} color="bg-green-100 dark:bg-green-900 text-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New Messages */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Tin nhắn mới từ Bệnh nhân</h3>
                    <ul className="space-y-3">
                        {messages.filter(m => !m.isRead).map(message => (
                            <li key={message.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{message.patientName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{message.date}</p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{message.subject}</p>
                            </li>
                        ))}
                         {messages.filter(m => !m.isRead).length === 0 && <p className="text-sm text-gray-500">Không có tin nhắn mới.</p>}
                    </ul>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-lg font-bold">Lịch hẹn sắp tới của bạn</h3>
                         <button onClick={() => setIsBookingModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center text-sm">
                            <PlusIcon />
                            <span className="ml-2">Đặt lịch hẹn mới</span>
                         </button>
                    </div>
                    <ul className="space-y-3">
                        {myUpcomingAppointments.map(app => (
                            <li key={app.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">Bác sĩ: {app.doctorName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{app.date} lúc {app.time}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">Lý do: "{app.reason}"</p>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0">
                                        <button onClick={() => handleEditAppointment(app)} className="p-1 text-yellow-500 hover:text-yellow-700" title="Sửa"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteAppointment(app.id)} className="p-1 text-red-500 hover:text-red-700" title="Hủy"><TrashIcon /></button>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {myUpcomingAppointments.length === 0 && <p className="text-sm text-gray-500">Bạn không có lịch hẹn nào sắp tới.</p>}
                    </ul>
                </div>
            </div>
            {isBookingModalOpen && (
                <AppointmentBookingModal
                    appointmentToEdit={appointmentToEdit}
                    onClose={handleCloseModal}
                    onSave={handleSaveAppointment}
                    departments={departments}
                    doctors={doctors}
                    appointments={appointments}
                    patientName={currentPatient.name}
                />
            )}
        </div>
    );
};

// --- Appointment Booking Modal ---
interface AppointmentBookingModalProps {
    appointmentToEdit: Appointment | null;
    onClose: () => void;
    onSave: (appointmentData: Omit<Appointment, 'id'>, id?: string) => void;
    departments: Omit<Department, 'rooms'>[];
    doctors: { id: string; name: string; departmentId: string; }[];
    appointments: Appointment[];
    patientName: string;
}

const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({ appointmentToEdit, onClose, onSave, departments, doctors, appointments, patientName }) => {
    const isEditMode = !!appointmentToEdit;
    const [reason, setReason] = useState(appointmentToEdit?.reason || '');
    const [selectedDept, setSelectedDept] = useState(() => {
        if (!appointmentToEdit) return '';
        const doctor = doctors.find(d => d.id === appointmentToEdit.doctorId);
        return doctor?.departmentId || '';
    });
    const [selectedDoctorId, setSelectedDoctorId] = useState(appointmentToEdit?.doctorId || '');
    const [selectedDate, setSelectedDate] = useState(appointmentToEdit?.date || new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState(appointmentToEdit?.time || '');
    const [isSuggestingDept, setIsSuggestingDept] = useState(false);

    const availableDoctors = useMemo(() => doctors.filter(d => d.departmentId === selectedDept), [doctors, selectedDept]);

    const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];

    const bookedSlots = useMemo(() => 
        new Set(appointments
            .filter(app => app.doctorId === selectedDoctorId && app.date === selectedDate && app.id !== appointmentToEdit?.id)
            .map(app => app.time))
    , [appointments, selectedDoctorId, selectedDate, appointmentToEdit]);
    
    const isFormComplete = selectedDept && selectedDoctorId && selectedDate && selectedTime && reason;

    const handleSuggestDepartment = async () => {
        if (!reason.trim()) return;
    
        setIsSuggestingDept(true);
        try {
            const departmentNames = departments.map(d => d.name);
            const suggestedDeptName = await getDepartmentSuggestion(reason, departmentNames);
    
            const suggestedDept = departments.find(d => d.name.toLowerCase() === suggestedDeptName.toLowerCase());
    
            if (suggestedDept) {
                setSelectedDept(suggestedDept.id);
                // Reset dependent fields as the department has changed
                setSelectedDoctorId('');
                setSelectedTime('');
            } else if (suggestedDeptName) {
                 alert(`AI đã gợi ý "${suggestedDeptName}", nhưng chuyên khoa này không có trong danh sách. Vui lòng chọn thủ công.`);
            } else {
                alert('AI không thể tìm thấy chuyên khoa phù hợp. Vui lòng chọn thủ công.');
            }
        } catch (error) {
            console.error("Failed to get AI department suggestion", error);
            alert('Đã xảy ra lỗi khi lấy gợi ý từ AI. Vui lòng thử lại.');
        } finally {
            setIsSuggestingDept(false);
        }
    };

    const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDept(e.target.value);
        setSelectedDoctorId('');
        setSelectedTime('');
    };
    
    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDoctorId(e.target.value);
        setSelectedTime('');
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        setSelectedTime('');
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const doctor = doctors.find(d => d.id === selectedDoctorId);
        if (!doctor || !isFormComplete) return;
        
        onSave({
            patientName,
            doctorName: doctor.name,
            doctorId: doctor.id,
            date: selectedDate,
            time: selectedTime,
            reason
        }, appointmentToEdit?.id);
        onClose();
    };
    
    const inputClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500";

    const Spinner: React.FC = () => (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    );
    const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4 4-4 5.293-5.293a1 1 0 011.414 0L21 12m-5-9l2.293 2.293a1 1 0 010 1.414l-2.293 2.293" /></svg>;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold">{isEditMode ? 'Chỉnh sửa Lịch hẹn' : 'Đặt lịch hẹn khám'}</h3></div>
                <form id="booking-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <label className="text-sm font-medium">1. Mô tả Lý do/Triệu chứng</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className={inputClass} placeholder="Ví dụ: Đau ngực, khó thở, ho kéo dài..." required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium flex justify-between items-center">
                                <span>2. Chọn Chuyên khoa</span>
                                <button 
                                    type="button" 
                                    onClick={handleSuggestDepartment}
                                    disabled={!reason.trim() || isSuggestingDept}
                                    className="flex items-center space-x-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSuggestingDept ? (
                                        <>
                                            <Spinner />
                                            <span>Đang phân tích...</span>
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-4 h-4" />
                                            <span>Gợi ý bằng AI</span>
                                        </>
                                    )}
                                </button>
                            </label>
                            <select value={selectedDept} onChange={handleDeptChange} className={inputClass} required>
                                <option value="">-- Chọn khoa --</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-medium">3. Chọn Bác sĩ</label>
                            <select value={selectedDoctorId} onChange={handleDoctorChange} className={inputClass} disabled={!selectedDept} required>
                                <option value="">-- Chọn bác sĩ --</option>
                                {availableDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium">4. Chọn Ngày khám</label>
                        <input type="date" value={selectedDate} onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} className={inputClass} disabled={!selectedDoctorId} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">5. Chọn Giờ khám</label>
                        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {timeSlots.map(time => {
                                const isBooked = bookedSlots.has(time);
                                return (
                                    <button
                                        type="button"
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        disabled={isBooked || !selectedDate}
                                        className={`p-2 rounded-md text-sm font-semibold text-center transition-colors ${
                                            selectedTime === time ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 
                                            isBooked ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 line-through cursor-not-allowed' : 
                                            'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800'
                                        }`}
                                    >{time}</button>
                                )
                            })}
                        </div>
                    </div>
                </form>
                 <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2 mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                    <button type="submit" form="booking-form" disabled={!isFormComplete} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">{isEditMode ? 'Lưu thay đổi' : 'Xác nhận Đặt lịch'}</button>
                </div>
            </div>
        </div>
    );
};


// Icons
const PlusIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const MailIcon = () => <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const CalendarIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const UsersIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

export default PatientPortal;