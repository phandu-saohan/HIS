import React from 'react';
import Card from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const patientData = [
  { name: 'Thứ 2', bệnh_nhân: 30 },
  { name: 'Thứ 3', bệnh_nhân: 45 },
  { name: 'Thứ 4', bệnh_nhân: 28 },
  { name: 'Thứ 5', bệnh_nhân: 52 },
  { name: 'Thứ 6', bệnh_nhân: 48 },
  { name: 'Thứ 7', bệnh_nhân: 60 },
  { name: 'CN', bệnh_nhân: 55 },
];

const departmentData = [
  { name: 'Tim mạch', value: 400 },
  { name: 'Thần kinh', value: 300 },
  { name: 'Chỉnh hình', value: 300 },
  { name: 'Nhi khoa', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reporting: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Báo cáo & Thống kê</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Tổng số bệnh nhân" value={125} icon={<UsersIcon />} color="bg-blue-100 dark:bg-blue-900 text-blue-500" />
        <Card title="Giường có sẵn" value={48} icon={<BedIcon />} color="bg-green-100 dark:bg-green-900 text-green-500" />
        <Card title="Lịch hẹn hôm nay" value={32} icon={<CalendarIcon />} color="bg-yellow-100 dark:bg-yellow-900 text-yellow-500" />
        <Card title="Nhân viên đang làm việc" value={76} icon={<BriefcaseIcon />} color="bg-indigo-100 dark:bg-indigo-900 text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">Lượt nhập viện hàng tuần</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patientData}>
              <XAxis dataKey="name" stroke="rgb(156 163 175)" />
              <YAxis stroke="rgb(156 163 175)"/>
              <Tooltip wrapperClassName="!bg-gray-700 !border-gray-600 !rounded-lg" contentStyle={{backgroundColor: 'transparent', border: 'none'}} itemStyle={{color: 'white'}} labelStyle={{color:'rgb(156 163 175)'}}/>
              <Legend />
              <Bar dataKey="bệnh_nhân" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">Bệnh nhân theo khoa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => entry.name}>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip wrapperClassName="!bg-gray-700 !border-gray-600 !rounded-lg" contentStyle={{backgroundColor: 'transparent', border: 'none'}} itemStyle={{color: 'white'}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Icons
const UsersIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const BedIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 9.5V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2.5M18 14v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5m6-4v10m-4-7h8" /></svg>;
const CalendarIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const BriefcaseIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

export default Reporting;