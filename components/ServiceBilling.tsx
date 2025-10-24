import React, { useState, useMemo, useEffect } from 'react';
import { type Invoice, type Patient, type BillableItem } from '../types';
import { mockPatients, mockServiceItems } from '../data/mockData';
import Card from './ui/Card';

const initialMockInvoices: Invoice[] = [
  { 
    id: 'INV001', 
    patientId: 'P001',
    patientName: 'Nguyễn Văn An', 
    amount: 1539000, 
    date: '2024-07-25', 
    dueDate: '2024-08-24',
    status: 'Paid',
    items: [
      { id: 'SRV001', description: 'Khám chuyên khoa', quantity: 1, unitPrice: 150000, total: 150000 },
      { id: 'SRV006', description: 'Điện tâm đồ (ECG)', quantity: 2, unitPrice: 80000, total: 160000 },
      { id: 'MED003', description: 'Aspirin 81mg', quantity: 30, unitPrice: 700, total: 21000 },
      { id: 'IPD_STAY', description: 'Phí giường bệnh nội trú (2 ngày)', quantity: 2, unitPrice: 604000, total: 1208000 },
    ]
  },
  { 
    id: 'INV002', 
    patientId: 'P002',
    patientName: 'Trần Thị Bình', 
    amount: 304000, 
    date: '2024-07-28', 
    dueDate: '2024-08-27',
    status: 'Pending',
    items: [
       { id: 'SRV001', description: 'Khám chuyên khoa', quantity: 1, unitPrice: 150000, total: 150000 },
       { id: 'SRV004', description: 'Chụp X-quang ngực thẳng', quantity: 1, unitPrice: 120000, total: 120000 },
       { id: 'MED001', description: 'Amoxicillin 500mg', quantity: 20, unitPrice: 1200, total: 24000 },
    ]
  },
  { 
    id: 'INV003', 
    patientId: 'P003',
    patientName: 'Lê Văn Cường', 
    amount: 3200000, 
    date: '2024-06-15', 
    dueDate: '2024-07-15',
    status: 'Overdue',
    items: [
      { id: 'SURGERY', description: 'Phẫu thuật đầu gối', quantity: 1, unitPrice: 3000000, total: 3000000 },
      { id: 'MED002', description: 'Paracetamol 500mg', quantity: 40, unitPrice: 500, total: 20000 },
      { id: 'BANDAGE', description: 'Băng gạc', quantity: 10, unitPrice: 18000, total: 180000 },
    ]
  },
  { 
    id: 'INV004', 
    patientId: 'P004',
    patientName: 'Phạm Thị Dung', 
    amount: 250000, 
    date: '2024-07-27', 
    dueDate: '2024-08-26',
    status: 'Paid',
    items: [
        { id: 'SRV001', description: 'Khám chuyên khoa', quantity: 1, unitPrice: 150000, total: 150000 },
        { id: 'SRV005', description: 'Siêu âm ổ bụng tổng quát', quantity: 1, unitPrice: 100000, total: 100000 },
    ]
  },
];


const ServiceBilling: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>(initialMockInvoices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'form'>('view');
    const [invoiceToManage, setInvoiceToManage] = useState<Invoice | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<Invoice['status'] | 'All'>('All');

    const dashboardStats = useMemo(() => {
        return invoices.reduce((acc, inv) => {
            if (inv.status === 'Paid') {
                acc.totalRevenue += inv.amount;
            }
            if (inv.status === 'Pending' || inv.status === 'Overdue') {
                acc.outstandingAmount += inv.amount;
            }
            if (inv.status === 'Overdue') {
                acc.overdueInvoices += 1;
            }
            return acc;
        }, { totalRevenue: 0, outstandingAmount: 0, overdueInvoices: 0 });
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices
            .filter(inv => filterStatus === 'All' || inv.status === filterStatus)
            .filter(inv => 
                inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [invoices, filterStatus, searchTerm]);
    
    const handleOpenModal = (invoice: Invoice | null, mode: 'view' | 'form') => {
        setInvoiceToManage(invoice);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setInvoiceToManage(null);
    };

    const handleSaveInvoice = (data: Invoice) => {
        if (invoiceToManage) { // Edit
            setInvoices(prev => prev.map(inv => inv.id === invoiceToManage.id ? data : inv));
        } else { // New
            setInvoices(prev => [data, ...prev]);
        }
        handleCloseModal();
    };

    const handleDeleteInvoice = (id: string) => {
        if(window.confirm('Bạn có chắc muốn xóa hóa đơn này?')) {
            setInvoices(prev => prev.filter(inv => inv.id !== id));
        }
    };
    
    const handleMarkAsPaid = (id: string) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? {...inv, status: 'Paid'} : inv));
        handleCloseModal();
    };
    
    const getStatusClass = (status: Invoice['status']) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }
    const getStatusText = (status: Invoice['status']) => ({ 'Paid': 'Đã thanh toán', 'Pending': 'Chờ xử lý', 'Overdue': 'Quá hạn' }[status]);

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Quản lý Viện phí</h2>
                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Tổng Doanh thu" value={dashboardStats.totalRevenue.toLocaleString('vi-VN') + ' đ'} icon={<CurrencyDollarIcon />} color="bg-green-100 dark:bg-green-900 text-green-500" />
                    <Card title="Còn lại Phải thu" value={dashboardStats.outstandingAmount.toLocaleString('vi-VN') + ' đ'} icon={<ArrowPathIcon />} color="bg-yellow-100 dark:bg-yellow-900 text-yellow-500" />
                    <Card title="Hóa đơn Quá hạn" value={dashboardStats.overdueInvoices} icon={<ClockIcon />} color="bg-red-100 dark:bg-red-900 text-red-500" />
                </div>

                {/* Main Table View */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input type="text" placeholder="Tìm theo tên, ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-64 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"/>
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            </div>
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                <option value="All">Tất cả Trạng thái</option>
                                <option value="Paid">Đã thanh toán</option>
                                <option value="Pending">Chờ xử lý</option>
                                <option value="Overdue">Quá hạn</option>
                            </select>
                        </div>
                        <button onClick={() => handleOpenModal(null, 'form')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center w-full sm:w-auto justify-center">
                            <PlusIcon />
                            <span className="ml-2">Tạo hóa đơn</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">ID Hóa đơn</th>
                                    <th className="px-6 py-3">Tên bệnh nhân</th>
                                    <th className="px-6 py-3 text-right">Số tiền (VND)</th>
                                    <th className="px-6 py-3">Ngày lập</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{invoice.id}</td>
                                        <td className="px-6 py-4">{invoice.patientName}</td>
                                        <td className="px-6 py-4 text-right font-mono">{invoice.amount.toLocaleString('vi-VN')}</td>
                                        <td className="px-6 py-4">{invoice.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(invoice.status)}`}>{getStatusText(invoice.status)}</span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center space-x-2">
                                            <button onClick={() => handleOpenModal(invoice, 'view')} className="p-1 text-blue-500 hover:text-blue-700" title="Xem"><EyeIcon /></button>
                                            <button onClick={() => handleOpenModal(invoice, 'form')} className="p-1 text-yellow-500 hover:text-yellow-700" title="Sửa"><PencilIcon /></button>
                                            <button onClick={() => handleDeleteInvoice(invoice.id)} className="p-1 text-red-500 hover:text-red-700" title="Xóa"><TrashIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isModalOpen && <InvoiceModal mode={modalMode} invoice={invoiceToManage} onSave={handleSaveInvoice} onMarkAsPaid={handleMarkAsPaid} onClose={handleCloseModal} />}
        </>
    );
};

// --- Modal Component ---
interface InvoiceModalProps {
    mode: 'view' | 'form';
    invoice: Invoice | null;
    onSave: (data: Invoice) => void;
    onMarkAsPaid: (id: string) => void;
    onClose: () => void;
}
const InvoiceModal: React.FC<InvoiceModalProps> = (props) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={props.onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {props.mode === 'view' && props.invoice ? (
                    <InvoiceDetailView invoice={props.invoice} onClose={props.onClose} onMarkAsPaid={props.onMarkAsPaid} />
                ) : (
                    <InvoiceFormView invoice={props.invoice} onSave={props.onSave} onClose={props.onClose} />
                )}
            </div>
        </div>
    );
};

// --- Detail View Sub-component ---
const InvoiceDetailView: React.FC<{ invoice: Invoice, onClose: () => void, onMarkAsPaid: (id: string) => void }> = ({ invoice, onClose, onMarkAsPaid }) => {
    return (
        <>
            <div className="p-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold">Chi tiết Hóa đơn: {invoice.id}</h3></div>
            <div className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><p className="font-semibold text-gray-500">Bệnh nhân</p><p>{invoice.patientName} ({invoice.patientId})</p></div>
                    <div><p className="font-semibold text-gray-500">Ngày lập</p><p>{invoice.date}</p></div>
                    <div><p className="font-semibold text-gray-500">Hạn thanh toán</p><p>{invoice.dueDate}</p></div>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700"><tr className="text-left"><th className="p-2">Mô tả</th><th className="p-2 w-20 text-center">SL</th><th className="p-2 w-32 text-right">Đơn giá</th><th className="p-2 w-32 text-right">Thành tiền</th></tr></thead>
                    <tbody>
                        {invoice.items.map(item => (
                            <tr key={item.id} className="border-b dark:border-gray-600"><td className="p-2">{item.description}</td><td className="p-2 text-center">{item.quantity}</td><td className="p-2 text-right font-mono">{item.unitPrice.toLocaleString('vi-VN')}</td><td className="p-2 text-right font-mono">{item.total.toLocaleString('vi-VN')}</td></tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr><td colSpan={3} className="p-2 text-right font-bold text-lg">TỔNG CỘNG</td><td className="p-2 text-right font-bold text-lg font-mono">{invoice.amount.toLocaleString('vi-VN')} đ</td></tr>
                    </tfoot>
                </table>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2 mt-auto">
                <button type="button" className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 flex items-center"><PrinterIcon /><span className="ml-2">In Hóa đơn</span></button>
                <div>
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Đóng</button>
                    {invoice.status !== 'Paid' && <button type="button" onClick={() => onMarkAsPaid(invoice.id)} className="ml-2 px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700">Ghi nhận Thanh toán</button>}
                </div>
            </div>
        </>
    );
};

// --- Form View Sub-component ---
const InvoiceFormView: React.FC<{ invoice: Invoice | null, onSave: (data: Invoice) => void, onClose: () => void }> = ({ invoice, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'amount'>>({
        patientId: invoice?.patientId || '',
        patientName: invoice?.patientName || '',
        date: invoice?.date || new Date().toISOString().split('T')[0],
        dueDate: invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: invoice?.status || 'Pending',
        items: invoice?.items || []
    });

    useEffect(() => {
        const patient = mockPatients.find(p => p.id === formData.patientId);
        if(patient) {
            setFormData(f => ({...f, patientName: patient.name}));
        }
    }, [formData.patientId]);
    
    const totalAmount = useMemo(() => formData.items.reduce((sum, item) => sum + item.total, 0), [formData.items]);
    
    const handleItemsChange = (items: BillableItem[]) => {
        setFormData(prev => ({ ...prev, items }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData: Invoice = {
            ...formData,
            id: invoice?.id || `INV${Date.now()}`,
            amount: totalAmount,
        };
        onSave(finalData);
    };

    const inputClass = "block w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm";
    
    return (
        <>
            <div className="p-4 border-b dark:border-gray-700"><h3 className="text-xl font-bold">{invoice ? 'Chỉnh sửa Hóa đơn' : 'Tạo Hóa đơn mới'}</h3></div>
            <form id="invoice-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium">Bệnh nhân</label>
                        <select value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className={inputClass} required>
                            <option value="">-- Chọn bệnh nhân --</option>
                            {mockPatients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                        </select>
                    </div>
                    <div><label className="text-sm font-medium">Ngày lập</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputClass} required/></div>
                    <div><label className="text-sm font-medium">Hạn thanh toán</label><input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className={inputClass} required/></div>
                </div>
                <ItemEditor items={formData.items} onItemsChange={handleItemsChange} />
                <div className="text-right font-bold text-xl">Tổng cộng: {totalAmount.toLocaleString('vi-VN')} đ</div>
            </form>
            <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 space-x-2 mt-auto">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-200">Hủy</button>
                <button type="submit" form="invoice-form" className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white">Lưu Hóa đơn</button>
            </div>
        </>
    );
};

// Item Editor for Form
const ItemEditor: React.FC<{ items: BillableItem[], onItemsChange: (items: BillableItem[]) => void }> = ({ items, onItemsChange }) => {
    // A simplified item selector for demonstration
    const availableItems = mockServiceItems.map(s => ({ id: s.id, description: s.name, unitPrice: s.price }));

    const handleAddItem = (item: { id: string, description: string, unitPrice: number }) => {
        const newItem: BillableItem = { ...item, quantity: 1, total: item.unitPrice };
        onItemsChange([...items, newItem]);
    };

    const handleUpdateItem = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
        const newItems = [...items];
        const item = newItems[index];
        item[field] = value;
        item.total = item.quantity * item.unitPrice;
        onItemsChange(newItems);
    };

    const handleRemoveItem = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="text-sm font-medium">Các khoản mục</label>
            <div className="space-y-2 mt-1">
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <input value={item.description} disabled className="col-span-6 p-1.5 border rounded bg-gray-200 dark:bg-gray-800 text-sm" />
                        <input type="number" value={item.quantity} onChange={e => handleUpdateItem(index, 'quantity', Number(e.target.value))} min="1" className="col-span-2 p-1.5 border rounded text-sm text-center" />
                        <input type="number" value={item.unitPrice} onChange={e => handleUpdateItem(index, 'unitPrice', Number(e.target.value))} min="0" className="col-span-2 p-1.5 border rounded text-sm text-right" />
                        <span className="col-span-1 font-mono text-sm text-right">{item.total.toLocaleString()}</span>
                        <button type="button" onClick={() => handleRemoveItem(index)} className="col-span-1"><TrashIcon className="w-4 h-4 text-red-500 mx-auto"/></button>
                    </div>
                ))}
            </div>
            <div className="mt-2">
                <select onChange={(e) => { const item = availableItems.find(i => i.id === e.target.value); if (item) handleAddItem(item); e.target.value = ''; }} className="p-2 border rounded bg-gray-50 text-sm">
                    <option value="">-- Thêm dịch vụ --</option>
                    {availableItems.filter(avail => !items.some(i => i.id === avail.id)).map(item => <option key={item.id} value={item.id}>{item.description}</option>)}
                </select>
            </div>
        </div>
    );
}

// Icons
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>;
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const CurrencyDollarIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0 12v-1m0-1c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" /></svg>;
const ClockIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowPathIcon = () => <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.182m0-4.991v4.99" /></svg>;
const PrinterIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

export default ServiceBilling;