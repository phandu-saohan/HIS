import React, { useState, useRef, useEffect, useMemo } from 'react';
import { type Appointment, type UserRole } from '../types';
import { mockDoctors } from '../data/mockData';


interface AppointmentScheduleProps {
  currentUserRole: UserRole;
  currentUserId: string;
  appointments: Appointment[];
  onAddAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const AppointmentSchedule: React.FC<AppointmentScheduleProps> = ({ currentUserRole, currentUserId, appointments, onAddAppointment, onUpdateAppointment, onDeleteAppointment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);

  const canManageAppointments = ['Nhân viên Đăng ký/Tiếp tân', 'Quản trị Hệ thống', 'Quản lý'].includes(currentUserRole);
  
  const groupedAppointments = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const upcomingAppointments = appointments
      .filter(app => new Date(app.date) >= today)
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

    for (const app of upcomingAppointments) {
        if (!groups[app.date]) {
            groups[app.date] = [];
        }
        groups[app.date].push(app);
    }
    return groups;
  }, [appointments]);

  const sortedDates = Object.keys(groupedAppointments).sort();

  const handleAddNew = () => {
    setAppointmentToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (app: Appointment) => {
    setAppointmentToEdit(app);
    setIsModalOpen(true);
  };
  
  const handleDelete = (appId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này không?')) {
        onDeleteAppointment(appId);
    }
  };

  const handleFormSave = (appointmentData: Omit<Appointment, 'id'>, id?: string) => {
    if (id) {
        onUpdateAppointment({ ...appointmentData, id });
    } else {
        onAddAppointment(appointmentData);
    }
    setIsModalOpen(false);
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Quản lý Lịch hẹn</h2>
            {canManageAppointments && (
                <button 
                    onClick={handleAddNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <PlusIcon />
                    <span className="ml-2">Thêm Lịch hẹn</span>
                </button>
            )}
        </div>
        <div className="space-y-6">
            {sortedDates.length > 0 ? (
                sortedDates.map(date => (
                    <div key={date}>
                        <h3 className="font-bold text-lg mb-3 border-b pb-2 dark:border-gray-700">{formatDateHeader(date)}</h3>
                        <div className="space-y-3">
                            {groupedAppointments[date].map(app => (
                                <AppointmentCard 
                                    key={app.id}
                                    appointment={app}
                                    canManage={canManageAppointments}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <p>Không có lịch hẹn nào sắp tới.</p>
                </div>
            )}
        </div>
      </div>

      {isModalOpen && (
        <AppointmentFormModal 
            appointmentToEdit={appointmentToEdit}
            onClose={() => {
              setIsModalOpen(false);
              setAppointmentToEdit(null);
            }}
            onSave={handleFormSave}
        />
      )}
    </>
  );
};

const AppointmentCard: React.FC<{
    appointment: Appointment;
    canManage: boolean;
    onEdit: (app: Appointment) => void;
    onDelete: (id: string) => void;
}> = ({ appointment, canManage, onEdit, onDelete }) => (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
            <div className="text-center w-16 flex-shrink-0">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{appointment.time.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">{appointment.time.split(' ')[1]}</p>
            </div>
            <div className="border-l pl-4 dark:border-gray-600">
                <p className="font-semibold text-gray-900 dark:text-white">{appointment.patientName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">BS: {appointment.doctorName}</p>
                <p className="text-xs italic text-gray-500 truncate max-w-xs">{appointment.reason}</p>
            </div>
        </div>
        {canManage && (
            <div className="flex space-x-2">
                <button onClick={() => onEdit(appointment)} className="p-1 text-yellow-500 hover:text-yellow-700" title="Sửa"><PencilIcon /></button>
                <button onClick={() => onDelete(appointment.id)} className="p-1 text-red-500 hover:text-red-700" title="Xóa"><TrashIcon /></button>
            </div>
        )}
    </div>
);

interface AppointmentFormModalProps {
    appointmentToEdit: Appointment | null;
    onClose: () => void;
    onSave: (appointmentData: Omit<Appointment, 'id'>, id?: string) => void;
}

const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({ appointmentToEdit, onClose, onSave }) => {
    const isEditMode = !!appointmentToEdit;
    const [formData, setFormData] = useState({
        patientName: appointmentToEdit?.patientName || '',
        doctorId: appointmentToEdit?.doctorId || '',
        date: appointmentToEdit?.date || '',
        time: appointmentToEdit?.time || '',
        reason: appointmentToEdit?.reason || '',
    });

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedDoctor = mockDoctors.find(d => d.id === formData.doctorId);
        if (!selectedDoctor) {
            alert('Vui lòng chọn bác sĩ.');
            return;
        }
        onSave({
            patientName: formData.patientName,
            doctorName: selectedDoctor.name,
            doctorId: formData.doctorId,
            date: formData.date,
            time: formData.time,
            reason: formData.reason,
        }, appointmentToEdit?.id);
    };
    
    const inputFieldClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600";
    
    const commonTimes = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                 <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold">{isEditMode ? 'Chỉnh sửa Lịch hẹn' : 'Tạo Lịch hẹn mới'}</h3>
                </div>
                <form id="appointment-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    <div><label className="block text-sm font-medium">Tên Bệnh nhân</label><input type="text" name="patientName" value={formData.patientName} onChange={handleChange} className={inputFieldClass} required /></div>
                    <div>
                        <label className="block text-sm font-medium">Bác sĩ</label>
                        <select name="doctorId" value={formData.doctorId} onChange={handleChange} className={inputFieldClass} required>
                            <option value="">-- Chọn Bác sĩ --</option>
                            {mockDoctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium">Ngày hẹn</label><input type="date" name="date" value={formData.date} onChange={handleChange} className={inputFieldClass} required /></div>
                        <div>
                            <label className="block text-sm font-medium">Giờ hẹn</label>
                            <select name="time" value={formData.time} onChange={handleChange} className={inputFieldClass} required>
                                <option value="">-- Chọn giờ --</option>
                                {commonTimes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium">Lý do hẹn</label><textarea name="reason" value={formData.reason} onChange={handleChange} rows={3} className={inputFieldClass} required /></div>
                </form>
                 <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2 mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                    <button type="submit" form="appointment-form" className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">{isEditMode ? 'Lưu thay đổi' : 'Lưu Lịch hẹn'}</button>
                </div>
            </div>
        </div>
    );
};

const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;


export default AppointmentSchedule;