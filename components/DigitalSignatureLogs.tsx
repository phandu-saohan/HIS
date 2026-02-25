import React, { useState } from 'react';
import { mockDocumentVersions, mockSignatureLogs } from '../data/mockData';
import { Search, ShieldCheck, FileText, Clock, Key, CheckCircle, AlertTriangle } from 'lucide-react';

const DigitalSignatureLogs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

    const filteredVersions = mockDocumentVersions.filter(v => 
        v.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedVersion = mockDocumentVersions.find(v => v.id === selectedVersionId);
    const relatedLogs = mockSignatureLogs.filter(log => log.versionId === selectedVersionId);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                        <ShieldCheck className="w-8 h-8 mr-3 text-blue-600" />
                        Quản lý Chữ ký số & Lưu vết (Audit Trail)
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Theo dõi lịch sử ký số, đảm bảo tính toàn vẹn và chống chối bỏ theo Thông tư 46/2018/TT-BYT.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Document Versions */}
                <div className="lg:col-span-1 border-r dark:border-gray-700 pr-0 lg:pr-6">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã tài liệu, loại..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {filteredVersions.map(version => (
                            <div 
                                key={version.id}
                                onClick={() => setSelectedVersionId(version.id)}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                    selectedVersionId === version.id 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                                        <FileText className="w-4 h-4 mr-1.5 text-gray-500" />
                                        {version.documentType}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                        version.status === 'SIGNED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        version.status === 'VOID' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    }`}>
                                        {version.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Mã tài liệu: <span className="font-medium">{version.documentId}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Phiên bản: v{version.versionNumber}</span>
                                    <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(version.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details & Signatures */}
                <div className="lg:col-span-2">
                    {selectedVersion ? (
                        <div className="space-y-6">
                            {/* Document Integrity Info */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
                                    Tính toàn vẹn Dữ liệu (Integrity)
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mã băm (SHA-256 Hash)</p>
                                        <p className="font-mono text-xs bg-gray-200 dark:bg-gray-900 p-2 rounded text-gray-800 dark:text-gray-300 break-all">
                                            {selectedVersion.hashValue}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nội dung (JSON)</p>
                                        <pre className="font-mono text-xs bg-gray-200 dark:bg-gray-900 p-3 rounded text-gray-800 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(JSON.parse(selectedVersion.contentJson), null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Signatures List */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <Key className="w-5 h-5 mr-2 text-blue-500" />
                                    Lịch sử Ký số (Signature Logs)
                                </h3>
                                {relatedLogs.length > 0 ? (
                                    <div className="space-y-4">
                                        {relatedLogs.map(log => (
                                            <div key={log.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                                                            {log.signerName}
                                                        </span>
                                                        <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                            {log.signatureType === 'ORGANIZATION' ? 'Ký Tổ chức' : 'Ký Cá nhân'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-green-600 text-sm font-medium">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Hợp lệ
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm mb-3">
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Thời gian ký: </span>
                                                        <span className="text-gray-900 dark:text-gray-200">{new Date(log.signingTime).toLocaleString('vi-VN')}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">IP Address: </span>
                                                        <span className="text-gray-900 dark:text-gray-200">{log.ipAddress}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Cert Serial: </span>
                                                        <span className="font-mono text-gray-900 dark:text-gray-200">{log.certSerial}</span>
                                                    </div>
                                                    {log.tsaTimestamp && (
                                                        <div>
                                                            <span className="text-gray-500 dark:text-gray-400">TSA Timestamp: </span>
                                                            <span className="text-gray-900 dark:text-gray-200">{new Date(log.tsaTimestamp).toLocaleString('vi-VN')}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Giá trị chữ ký (Base64)</p>
                                                    <p className="font-mono text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded text-gray-600 dark:text-gray-400 truncate">
                                                        {log.signatureValue}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                        <AlertTriangle className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400">Chưa có chữ ký số nào cho phiên bản này.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-20">
                            <ShieldCheck className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-lg">Chọn một phiên bản tài liệu để xem chi tiết lưu vết</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DigitalSignatureLogs;
