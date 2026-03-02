import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface CCCDScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

const CCCDScanner: React.FC<CCCDScannerProps> = ({ onScan, onClose }) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scannerRef.current.render(
            (decodedText) => {
                onScan(decodedText);
                if (scannerRef.current) {
                    scannerRef.current.clear().catch(error => {
                        console.error("Failed to clear scanner", error);
                    });
                }
            },
            (errorMessage) => {
                // parse error, ignore
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear scanner on unmount", error);
                });
            }
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-blue-600 text-white">
                    <h3 className="text-lg font-bold">Quét mã QR CCCD</h3>
                    <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6">
                    <div id="reader" className="w-full rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>Vui lòng đưa mã QR trên CCCD vào khung hình để quét</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-center">
                    <button 
                        onClick={onClose}
                        className="btn-secondary w-full"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CCCDScanner;
