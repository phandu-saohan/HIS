
import React from 'react';

const PatientList: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Danh sách Bệnh nhân</h2>
            <p className="text-gray-600 dark:text-gray-400">
                This component would display a comprehensive list of all patients.
                Functionality would include searching, filtering, and sorting patients.
                Each patient would have a link to their detailed EMR.
            </p>
        </div>
    );
};

export default PatientList;
