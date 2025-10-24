import React, { useMemo } from 'react';
import { type FinancialRecord } from '../types';
import Card from './ui/Card';

interface FinancialLedgerProps {
    records: FinancialRecord[];
}

const FinancialLedger: React.FC<FinancialLedgerProps> = ({ records }) => {

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const income = records.filter(r => r.type === 'Thu').reduce((sum, r) => sum + r.amount, 0);
        const expense = records.filter(r => r.type === 'Chi').reduce((sum, r) => sum + r.amount, 0);
        return {
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense,
        };
    }, [records]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Kế toán & Thu chi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card title="Tổng thu" value={totalIncome.toLocaleString('vi-VN') + ' VND'} icon={<ArrowUpIcon />} color="bg-green-100 dark:bg-green-900 text-green-500" />
                <Card title="Tổng chi" value={totalExpense.toLocaleString('vi-VN') + ' VND'} icon={<ArrowDownIcon />} color="bg-red-100 dark:bg-red-900 text-red-500" />
                <Card title="Số dư" value={balance.toLocaleString('vi-VN') + ' VND'} icon={<ScaleIcon />} color="bg-blue-100 dark:bg-blue-900 text-blue-500" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4">Lịch sử Giao dịch</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ngày</th>
                                <th scope="col" className="px-6 py-3">Mô tả</th>
                                <th scope="col" className="px-6 py-3">Loại</th>
                                <th scope="col" className="px-6 py-3 text-right">Số tiền (VND)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{record.date}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{record.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${record.type === 'Thu' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono ${record.type === 'Thu' ? 'text-green-600' : 'text-red-600'}`}>
                                        {record.type === 'Thu' ? '+' : '-'} {record.amount.toLocaleString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ArrowUpIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>;
const ArrowDownIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path></svg>;
const ScaleIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l-6-2m6 2l-3 1m-3-1l-3 9a5.002 5.002 0 006.001 0M18 7l-3 9m-3-9l-6-2m0 0l-3 1m0 0l3 9a5.002 5.002 0 006.001 0M18 7l-3 9m3-9l-6-2m6 2l3 1m-3-1l3 9a5.002 5.002 0 006.001 0M18 7l3 9"></path></svg>;

export default FinancialLedger;