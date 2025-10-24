import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const satisfactionData = [
  { name: 'Rất hài lòng', value: 450 },
  { name: 'Hài lòng', value: 320 },
  { name: 'Bình thường', value: 150 },
  { name: 'Không hài lòng', value: 50 },
];

const waitTimeData = [
    { name: 'Tim mạch', 'Thời gian chờ (phút)': 15 },
    { name: 'Thần kinh', 'Thời gian chờ (phút)': 25 },
    { name: 'Chỉnh hình', 'Thời gian chờ (phút)': 30 },
    { name: 'Nhi khoa', 'Thời gian chờ (phút)': 10 },
    { name: 'Tổng quát', 'Thời gian chờ (phút)': 22 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const QualityManagement: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Quản lý Chất lượng Bệnh viện</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Đánh giá Hài lòng Người bệnh</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={satisfactionData} 
                                cx="50%" 
                                cy="50%" 
                                labelLine={false} 
                                outerRadius={110} 
                                fill="#8884d8" 
                                dataKey="value" 
                                nameKey="name" 
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {satisfactionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip wrapperClassName="!bg-gray-700 !border-gray-600 !rounded-lg" contentStyle={{backgroundColor: 'transparent', border: 'none'}} itemStyle={{color: 'white'}}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Thời gian chờ trung bình theo Khoa</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={waitTimeData} layout="vertical">
                            <XAxis type="number" stroke="rgb(156 163 175)" />
                            <YAxis type="category" dataKey="name" stroke="rgb(156 163 175)" width={80}/>
                            <Tooltip wrapperClassName="!bg-gray-700 !border-gray-600 !rounded-lg" contentStyle={{backgroundColor: 'transparent', border: 'none'}} itemStyle={{color: 'white'}} labelStyle={{color:'rgb(156 163 175)'}}/>
                            <Legend />
                            <Bar dataKey="Thời gian chờ (phút)" fill="#8884d8" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default QualityManagement;