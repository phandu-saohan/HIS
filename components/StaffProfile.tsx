import React from 'react';
import { type Staff } from '../types';
import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, FileText, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

interface StaffProfileProps {
    staff: Staff;
    onBack: () => void;
}

const StaffProfile: React.FC<StaffProfileProps> = ({ staff, onBack }) => {
    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Back Button */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại danh sách
                </button>
                <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center ${
                        staff.status === 'Online' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${staff.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        {staff.status}
                    </span>
                </div>
            </div>

            {/* Main Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                        <div className="px-6 pb-8 -mt-16 text-center">
                            <div className="relative inline-block">
                                <img 
                                    src={staff.avatar} 
                                    alt={staff.name} 
                                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-2xl mx-auto" 
                                />
                                <div className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{staff.name}</h2>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold">{staff.role}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{staff.department}</p>
                            
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Mã NV</p>
                                    <p className="font-mono text-slate-900 dark:text-white">{staff.employeeId}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Hợp đồng</p>
                                    <p className="text-slate-900 dark:text-white">{staff.contractType}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                            <UserCheck className="w-5 h-5 mr-2 text-blue-500" />
                            Thông tin liên hệ
                        </h3>
                        <div className="space-y-3">
                            <ContactItem icon={<Mail className="w-4 h-4" />} label="Email" value={staff.email} />
                            <ContactItem icon={<Phone className="w-4 h-4" />} label="Điện thoại" value={staff.contact} />
                            <ContactItem icon={<MapPin className="w-4 h-4" />} label="Địa chỉ" value={staff.address} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Professional Summary */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <GraduationCap className="w-6 h-6 mr-3 text-indigo-500" />
                            Trình độ & Chuyên môn
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {staff.qualifications}
                            </p>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <Briefcase className="w-6 h-6 mr-3 text-emerald-500" />
                            Thông tin công tác
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailItem icon={<Calendar className="w-5 h-5" />} label="Ngày vào làm" value={staff.joinDate} />
                            <DetailItem icon={<Calendar className="w-5 h-5" />} label="Ngày sinh" value={staff.dateOfBirth} />
                            <DetailItem icon={<FileText className="w-5 h-5" />} label="Mức lương cơ bản" value={`${staff.salary.toLocaleString('vi-VN')} VNĐ`} />
                            <DetailItem icon={<ShieldCheck className="w-5 h-5" />} label="Trạng thái tài khoản" value="Đã xác thực" />
                        </div>
                    </div>

                    {/* Quick Stats / Achievements */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard label="Thâm niên" value="4 năm" color="blue" />
                        <StatCard label="Đánh giá" value="4.9/5" color="indigo" />
                        <StatCard label="Dự án/Khóa học" value="12" color="emerald" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
        <div className="mt-1 text-slate-400">{icon}</div>
        <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{label}</p>
            <p className="text-sm text-slate-900 dark:text-white break-all">{value}</p>
        </div>
    </div>
);

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-500">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const StatCard: React.FC<{ label: string; value: string; color: 'blue' | 'indigo' | 'emerald' }> = ({ label, value, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    };

    return (
        <div className={`p-6 rounded-3xl border ${colors[color]} text-center shadow-sm`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
};

export default StaffProfile;
