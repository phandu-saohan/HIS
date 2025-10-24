import React from 'react';
import { type UserRole } from '../types';

interface HeaderProps {
    currentUserRole: UserRole;
    setCurrentUserRole: (role: UserRole) => void;
}

const allRoles: UserRole[] = [
    'Bác sĩ/Y sĩ',
    'Điều dưỡng',
    'Nhân viên Đăng ký/Tiếp tân',
    'Nhân viên Viện phí/Kế toán',
    'Dược sĩ/Thủ kho',
    'Kỹ thuật viên Xét nghiệm',
    'Kỹ thuật viên Chẩn đoán Hình ảnh',
    'Nhân viên Nhân sự (HR)',
    'Trưởng khoa/Người duyệt',
    'Quản lý',
    'Quản trị Hệ thống',
];

const Header: React.FC<HeaderProps> = ({ currentUserRole, setCurrentUserRole }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Chào mừng trở lại!</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân..."
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
        </div>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <BellIcon />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
         <div className="flex items-center space-x-3">
            <div className="relative">
                <select 
                    value={currentUserRole}
                    onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                    className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1.5 pl-3 pr-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <optgroup label="Vai trò">
                        {allRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </optgroup>
                </select>
                <UserGroupIcon className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"/>
            </div>
            <div className="flex items-center space-x-2">
                <img 
                    src="https://picsum.photos/id/1005/40/40" 
                    alt="User Avatar" 
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <p className="font-semibold text-sm">Người dùng Hiện tại</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUserRole}</p>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

// Icons
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BellIcon = () => <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const UserGroupIcon = (props: {className: string}) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.284-2.72a3 3 0 0 0-4.682-2.72m-3.09 5.438a9.093 9.093 0 0 1 3.741-.479M12 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm12 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>;

export default Header;