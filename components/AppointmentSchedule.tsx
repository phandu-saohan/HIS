import React, { useState, useRef, useEffect, useMemo } from 'react';
import { type Appointment, type UserRole } from '../types';
import { Search, Plus, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { vi } from 'date-fns/locale';


interface AppointmentScheduleProps {
  currentUserRole: UserRole;
  currentUserId: string;
  appointments: Appointment[];
  doctors: { id: string, name: string }[];
  onAddAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const AppointmentSchedule: React.FC<AppointmentScheduleProps> = ({ currentUserRole, currentUserId, appointments, doctors, onAddAppointment, onUpdateAppointment, onDeleteAppointment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const canManageAppointments = ['Nhân viên Đăng ký/Tiếp tân', 'Quản trị Hệ thống', 'Quản lý'].includes(currentUserRole);
  
  const groupedAppointments = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    let upcomingAppointments = appointments
      .filter(app => new Date(app.date) >= today)
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      upcomingAppointments = upcomingAppointments.filter(app => 
        app.patientName.toLowerCase().includes(lowerSearch) ||
        app.doctorName.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterDate) {
      upcomingAppointments = upcomingAppointments.filter(app => app.date === filterDate);
    }

    for (const app of upcomingAppointments) {
        if (!groups[app.date]) {
            groups[app.date] = [];
        }
        groups[app.date].push(app);
    }
    return groups;
  }, [appointments, searchTerm, filterDate]);

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
      <div className="modern-card p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">Quản lý Lịch hẹn</h2>
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('calendar')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600' : 'text-gray-500'}`}
                        title="Xem lịch"
                    >
                        <CalendarIcon size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600' : 'text-gray-500'}`}
                        title="Xem danh sách"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm tên bệnh nhân, bác sĩ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                {viewMode === 'list' && (
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                )}
                {canManageAppointments && (
                    <button 
                        onClick={handleAddNew}
                        className="btn-primary flex items-center whitespace-nowrap"
                    >
                        <Plus size={20} />
                        <span className="ml-2">Thêm Lịch hẹn</span>
                    </button>
                )}
            </div>
        </div>

        {viewMode === 'calendar' ? (
            <CalendarView 
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                appointments={appointments}
                onDateClick={(date) => {
                    setFilterDate(date);
                    setViewMode('list');
                }}
            />
        ) : (
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
                        {filterDate && (
                            <button onClick={() => setFilterDate('')} className="mt-2 text-blue-500 hover:underline">Xóa bộ lọc ngày</button>
                        )}
                    </div>
                )}
            </div>
        )}
      </div>

      {isModalOpen && (
        <AppointmentFormModal 
            appointmentToEdit={appointmentToEdit}
            doctors={doctors}
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
    doctors: { id: string, name: string }[];
    onClose: () => void;
    onSave: (appointmentData: Omit<Appointment, 'id'>, id?: string) => void;
}

const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({ appointmentToEdit, doctors, onClose, onSave }) => {
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
        const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
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
                            {doctors.map(doctor => (
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

const CalendarView: React.FC<{
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
    appointments: Appointment[];
    onDateClick: (date: string) => void;
}> = ({ currentMonth, setCurrentMonth, appointments, onDateClick }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const getAppointmentsForDay = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return appointments.filter(app => app.date === dateStr);
    };

    return (
        <div className="calendar-container">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                </h3>
                <div className="flex space-x-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                        Hôm nay
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                    <div key={day} className="bg-gray-50 dark:bg-gray-800 py-2 text-center text-xs font-bold text-gray-500 uppercase">
                        {day}
                    </div>
                ))}
                {calendarDays.map((day, idx) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isTodayDay = isToday(day);
                    const dateStr = format(day, 'yyyy-MM-dd');

                    return (
                        <div 
                            key={idx} 
                            className={`min-h-[100px] bg-white dark:bg-gray-800 p-2 relative group transition-colors hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer ${!isCurrentMonth ? 'opacity-30' : ''}`}
                            onClick={() => onDateClick(dateStr)}
                        >
                            <span className={`text-sm font-medium ${isTodayDay ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700 dark:text-gray-300'}`}>
                                {format(day, 'd')}
                            </span>
                            
                            <div className="mt-1 space-y-1">
                                {dayAppointments.slice(0, 3).map(app => (
                                    <div key={app.id} className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded truncate">
                                        {app.time.split(' ')[0]} {app.patientName}
                                    </div>
                                ))}
                                {dayAppointments.length > 3 && (
                                    <div className="text-[10px] text-gray-500 font-medium pl-1">
                                        + {dayAppointments.length - 3} lịch hẹn
                                    </div>
                                )}
                            </div>

                            {/* Hover Details Popover */}
                            {dayAppointments.length > 0 && (
                                <div className="absolute z-10 left-full top-0 ml-2 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-3 hidden group-hover:block pointer-events-none">
                                    <p className="font-bold text-sm mb-2 border-b pb-1 dark:border-gray-700">
                                        Lịch hẹn ngày {format(day, 'dd/MM/yyyy')}
                                    </p>
                                    <div className="space-y-2">
                                        {dayAppointments.map(app => (
                                            <div key={app.id} className="text-xs">
                                                <div className="flex justify-between font-semibold">
                                                    <span>{app.time}</span>
                                                    <span className="text-blue-600">{app.patientName}</span>
                                                </div>
                                                <p className="text-gray-500">BS: {app.doctorName}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;


export default AppointmentSchedule;