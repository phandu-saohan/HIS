
import React from 'react';

const StaffList: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Danh sách Nhân viên</h2>
            <p className="text-gray-600 dark:text-gray-400">
                This component would display a list of all staff members.
                It would be part of the HR module, allowing for viewing staff profiles, contact information, and roles.
            </p>
        </div>
    );
};

export default StaffList;
