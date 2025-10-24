import React, { useState, useRef } from 'react';
import { type LabTest, type LabTestStatus, type UserRole } from '../types';
import { getLabImageAnalysis } from '../services/geminiService';
import Spinner from './ui/Spinner';

interface LISProps {
    labTests: LabTest[];
    onUpdateLabTest: (updatedTest: LabTest) => void;
    onAddLabTest: (newTest: Omit<LabTest, 'id' | 'orderId' | 'status' | 'results'>) => void;
    onDeleteLabTest: (testId: string) => void;
    currentUserRole: UserRole;
}

const LIS: React.FC<LISProps> = ({ labTests, onUpdateLabTest, onAddLabTest, onDeleteLabTest, currentUserRole }) => {
    const [testToManage, setTestToManage] = useState<LabTest | null>(null);
    const [isNew, setIsNew] = useState(false);

    const canManage = ['Kỹ thuật viên Xét nghiệm', 'Quản trị Hệ thống', 'Quản lý'].includes(currentUserRole);

    const handleOpenModal = (test: LabTest | null) => {
        setIsNew(!test);
        setTestToManage(test);
    };

    const handleCloseModal = () => {
        setTestToManage(null);
    };

    const handleSave = (testData: LabTest) => {
        if (isNew) {
            const { id, orderId, status, results, ...rest } = testData;
            onAddLabTest(rest);
        } else {
            onUpdateLabTest(testData);
        }
        handleCloseModal();
    };

    const handleDelete = (test: LabTest) => {
        if(window.confirm(`Bạn có chắc chắn muốn xóa xét nghiệm "${test.testName}" cho bệnh nhân ${test.patientName}?`)) {
            onDeleteLabTest(test.id);
        }
    };

    const getStatusClass = (status: LabTest['status']) => {
        switch (status) {
            case 'Có kết quả': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Đã lấy mẫu': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Đã chỉ định': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Đã hủy': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Hệ thống thông tin Xét nghiệm (LIS)</h2>
                    {canManage && (
                        <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                            <PlusIcon /> <span className="ml-2">Thêm mới</span>
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Yêu cầu</th>
                                <th scope="col" className="px-6 py-3">Tên bệnh nhân</th>
                                <th scope="col" className="px-6 py-3">Tên xét nghiệm</th>
                                <th scope="col" className="px-6 py-3">Ngày chỉ định</th>
                                <th scope="col" className="px-6 py-3">Trạng thái</th>
                                <th scope="col" className="px-6 py-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labTests.map((test) => (
                                <tr key={test.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{test.orderId}</td>
                                    <td className="px-6 py-4">{test.patientName}</td>
                                    <td className="px-6 py-4">{test.testName}</td>
                                    <td className="px-6 py-4">{test.orderDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                                            {test.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(test)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            Quản lý
                                        </button>
                                        {canManage && (
                                            <button onClick={() => handleDelete(test)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                                Xóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {(testToManage || isNew) && (
                <LabTestDetailModal
                    test={testToManage}
                    isNew={isNew}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

// --- Lab Test Detail Modal ---
interface LabTestDetailModalProps {
    test: LabTest | null;
    isNew: boolean;
    onClose: () => void;
    onSave: (updatedTest: LabTest) => void;
}

const LabTestDetailModal: React.FC<LabTestDetailModalProps> = ({ test, isNew, onClose, onSave }) => {
    const defaultTest: LabTest = {
        id: '', orderId: '', patientId: '', patientName: '', testName: '', orderDate: new Date().toISOString().split('T')[0], status: 'Đã chỉ định', results: ''
    };
    const [localTest, setLocalTest] = useState<LabTest>(test || defaultTest);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalTest(prev => ({...prev, [name]: value}));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalTest(prev => ({ ...prev, imageUrl: reader.result as string, aiDiagnosis: '' })); // Reset AI diagnosis on new image
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAnalyzeClick = async () => {
        if (!localTest.imageUrl) return;
        setIsLoadingAI(true);
        try {
            const [header, base64Data] = localTest.imageUrl.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
            
            const analysis = await getLabImageAnalysis(base64Data, mimeType);
            setLocalTest(prev => ({ ...prev, aiDiagnosis: analysis }));
        } catch (error) {
            console.error("AI Analysis failed:", error);
            setLocalTest(prev => ({ ...prev, aiDiagnosis: "Lỗi phân tích, vui lòng thử lại." }));
        } finally {
            setIsLoadingAI(false);
        }
    };
    
    const handleSave = () => {
        onSave(localTest);
    };
    
    const formatAIResponse = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('**')) return <p key={index} className="font-bold mt-2">{line.replace(/\*\*/g, '')}</p>;
            if (line.startsWith('* ')) return <li key={index} className="ml-5 list-disc">{line.replace('* ', '')}</li>;
            return <p key={index} className="my-1">{line}</p>;
        });
    };

    const inputClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold">{isNew ? "Tạo Yêu cầu Xét nghiệm mới" : `Chi tiết Xét nghiệm: ${test?.testName} (BN: ${test?.patientName})`}</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                    {/* Left Column: Image & AI */}
                    <div className="space-y-4">
                        <div className="p-4 border dark:border-gray-700 rounded-lg">
                            <h4 className="font-semibold mb-2">Hình ảnh Kết quả</h4>
                            <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mb-2">
                                {localTest.imageUrl ? (
                                    <img src={localTest.imageUrl} alt="Kết quả xét nghiệm" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-gray-500">Chưa có hình ảnh</span>
                                )}
                            </div>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="w-full text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 py-2 px-3 rounded-md">
                                Tải lên hình ảnh
                            </button>
                        </div>
                        <div className="p-4 border dark:border-gray-700 rounded-lg">
                            <h4 className="font-semibold mb-2">Phân tích của AI</h4>
                             <button onClick={handleAnalyzeClick} disabled={!localTest.imageUrl || isLoadingAI} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed mb-2">
                                {isLoadingAI ? <Spinner /> : 'Chẩn đoán bằng AI'}
                            </button>
                            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md min-h-[100px] text-sm">
                                {localTest.aiDiagnosis ? formatAIResponse(localTest.aiDiagnosis) : <p className="text-gray-500">Kết quả phân tích sẽ hiển thị ở đây.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Tên bệnh nhân</label>
                            <input type="text" name="patientName" value={localTest.patientName} onChange={handleInputChange} className={inputClass} disabled={!isNew} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Tên xét nghiệm</label>
                            <input type="text" name="testName" value={localTest.testName} onChange={handleInputChange} className={inputClass} disabled={!isNew} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Ngày chỉ định</label>
                            <input type="date" name="orderDate" value={localTest.orderDate} onChange={handleInputChange} className={inputClass} disabled={!isNew} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Trạng thái Xét nghiệm</label>
                            <select name="status" value={localTest.status} onChange={handleInputChange} className={inputClass}>
                                <option>Đã chỉ định</option>
                                <option>Đã lấy mẫu</option>
                                <option>Có kết quả</option>
                                <option>Đã hủy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Kết quả/Ghi chú (văn bản)</label>
                            <textarea name="results" value={localTest.results} onChange={handleInputChange} rows={8} className={inputClass} placeholder="Nhập kết quả, chỉ số, hoặc ghi chú của kỹ thuật viên..." />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2 mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Hủy</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">Lưu</button>
                </div>
            </div>
        </div>
    );
};

const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;

export default LIS;