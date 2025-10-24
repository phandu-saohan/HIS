
import React from 'react';
import Card from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const quickStats = [
  { name: 'Bệnh nhân mới', value: 12 },
  { name: 'Ca phẫu thuật', value: 4 },
  { name: 'Xuất viện', value: 8 },
  { name: 'Lịch hẹn', value: 32 },
]

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Bảng điều khiển Tổng quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Tổng số bệnh nhân" value={125} icon={<UsersIcon />} color="bg-blue-100 dark:bg-blue-900 text-blue-500" />
        <Card title="Giường có sẵn" value={48} icon={<BedIcon />} color="bg-green-100 dark:bg-green-900 text-green-500" />
        <Card title="Bác sĩ đang trực" value={22} icon={<DoctorIcon />} color="bg-yellow-100 dark:bg-yellow-900 text-yellow-500" />
        <Card title="Doanh thu hôm nay" value={"150M"} icon={<CurrencyIcon />} color="bg-indigo-100 dark:bg-indigo-900 text-indigo-500" />
      </div>

       <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">Hoạt động trong ngày</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quickStats}>
              <XAxis dataKey="name" stroke="rgb(156 163 175)" />
              <YAxis stroke="rgb(156 163 175)"/>
              <Tooltip wrapperClassName="!bg-gray-700 !border-gray-600 !rounded-lg" contentStyle={{backgroundColor: 'transparent', border: 'none'}} itemStyle={{color: 'white'}} labelStyle={{color:'rgb(156 163 175)'}}/>
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
};

// Icons
const UsersIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const BedIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 9.5V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2.5M18 14v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5m6-4v10m-4-7h8" /></svg>;
const DoctorIcon = () => <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
const CurrencyIcon = () => <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0 12v-1m0-1c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" /></svg>;


export default Dashboard;
