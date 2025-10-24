import React, { useState } from 'react';

const inpatientProcessData = [
    {
        stageNumber: 1,
        title: 'Tiếp Nhận và Nhập Viện',
        color: 'blue',
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>,
        activities: [
            { stt: '1.1', activity: 'Chỉ định Nhập viện', role: 'Bác sĩ Khám bệnh/Cấp cứu', system: 'Bác sĩ tạo Phiếu chỉ định nhập viện trên EMR, ghi rõ lý do, chẩn đoán ban đầu, và khoa dự kiến chuyển đến.' },
            { stt: '1.2', activity: 'Thủ tục Tiếp nhận', role: 'Nhân viên Tiếp đón/Viện phí', system: 'Tiếp nhận Phiếu chỉ định, xác minh danh tính (qua CCCD/BHYT), tạo Mã Bệnh Án nội trú, và ghi nhận thông tin hành chính.' },
            { stt: '1.3', activity: 'Tạm ứng Viện phí', role: 'Nhân viên Viện phí', system: 'Lập phiếu tạm ứng/thanh toán ban đầu, ghi nhận vào tài khoản viện phí của bệnh nhân trên hệ thống Kế toán.' },
            { stt: '1.4', activity: 'Chuyển khoa', role: 'Nhân viên Tiếp đón', system: 'Hệ thống xác định khoa/phòng/giường bệnh có sẵn và in Giấy chuyển khoa. Hồ sơ điện tử của bệnh nhân được chuyển sang Khoa Điều trị.' },
        ],
    },
    {
        stageNumber: 2,
        title: 'Điều Trị và Chăm Sóc',
        color: 'green',
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>,
        activities: [
            { stt: '2.1', activity: 'Nhận/Ổn định Bệnh nhân', role: 'Điều dưỡng Khoa', system: 'Điều dưỡng nhận bệnh nhân, nhập dữ liệu ban đầu (dấu hiệu sinh tồn, tình trạng), sắp xếp giường bệnh và xác nhận trên hệ thống.' },
            { stt: '2.2', activity: 'Khám/Lập Bệnh án', role: 'Bác sĩ Điều trị', system: 'Bác sĩ lập Hồ sơ Bệnh án Điện tử (EMR) đầy đủ, ghi nhận tiền sử, thăm khám chuyên khoa, và chẩn đoán xác định.' },
            { stt: '2.3', activity: 'Thực hiện Y lệnh', role: 'Bác sĩ/Điều dưỡng', system: 'Bác sĩ tạo Y lệnh điện tử (CPOE) (thuốc, xét nghiệm, chẩn đoán hình ảnh). Điều dưỡng tiếp nhận và xác nhận thực hiện y lệnh (Bệnh án Điện tử sẽ lưu lại dấu vết: Ai ra lệnh, ai thực hiện, thời gian).' },
            { stt: '2.4', activity: 'Quản lý Dược/Vật tư', role: 'Điều dưỡng/Thủ kho', system: 'Điều dưỡng gửi yêu cầu cấp phát thuốc/vật tư từ kho khoa. Dược sĩ kho cấp phát và trừ tồn kho trên hệ thống PIS/Quản lý kho.' },
            { stt: '2.5', activity: 'Cận Lâm Sàng', role: 'Kỹ thuật viên (Xét nghiệm/CĐHA)', system: 'Thực hiện chỉ định, nhập kết quả vào LIS/RIS. Kết quả được tự động đính kèm vào EMR và hiển thị cho Bác sĩ.' },
            { stt: '2.6', activity: 'Theo dõi/Ghi chép', role: 'Điều dưỡng/Bác sĩ', system: 'Cập nhật thường xuyên tình trạng bệnh nhân, tiến triển bệnh, các can thiệp và ghi chép vào Phiếu theo dõi điện tử trong EMR.' },
        ],
    },
    {
        stageNumber: 3,
        title: 'Ra Viện và Tổng kết',
        color: 'yellow',
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
        activities: [
            { stt: '3.1', activity: 'Chỉ định Ra viện', role: 'Bác sĩ Điều trị', system: 'Bác sĩ hoàn tất các ghi chép cuối cùng, tổng kết bệnh án, ký Chỉ định Ra viện bằng chữ ký điện tử. Kê đơn thuốc ra viện và hẹn tái khám (nếu cần).' },
            { stt: '3.2', activity: 'Kiểm tra Viện phí', role: 'Điều dưỡng Khoa', system: 'Điều dưỡng kiểm tra và khóa các chi phí đã phát sinh tại khoa, đảm bảo mọi dịch vụ đã được ghi nhận.' },
            { stt: '3.3', activity: 'Duyệt Bệnh án', role: 'Trưởng khoa', system: 'Trưởng khoa duyệt và đóng hồ sơ trên EMR, đảm bảo tính đầy đủ và hợp lệ về chuyên môn.' },
        ],
    },
    {
        stageNumber: 4,
        title: 'Thanh toán và Kết thúc',
        color: 'purple',
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
        activities: [
            { stt: '4.1', activity: 'Tổng hợp Chi phí', role: 'Nhân viên Viện phí', system: 'Hệ thống HIS tự động tổng hợp tất cả chi phí từ các module (Dược, Vật tư, Xét nghiệm, Dịch vụ kỹ thuật...) vào Bảng kê chi phí khám chữa bệnh.' },
            { stt: '4.2', activity: 'Thanh toán BHYT', role: 'Nhân viên Bảo hiểm', system: 'Thực hiện đối soát/thanh toán BHYT (trừ phần chi phí được BHYT chi trả).' },
            { stt: '4.3', activity: 'Thanh toán cuối', role: 'Nhân viên Viện phí', system: 'Tính toán số tiền bệnh nhân phải trả hoặc hoàn lại tiền tạm ứng. In Hóa đơn/Biên lai điện tử cuối cùng.' },
            { stt: '4.4', activity: 'Lưu trữ Hồ sơ', role: 'Quản trị Hệ thống', system: 'Hồ sơ bệnh án điện tử (EMR) được chuyển vào kho lưu trữ điện tử, đảm bảo thời gian lưu trữ tối thiểu 10 năm theo quy định.' },
        ],
    },
];

const outpatientProcessData = [
    {
        stageNumber: 1,
        title: 'Đăng ký & Tiếp đón',
        color: 'blue',
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" /></svg>,
        activities: [
            { stt: '1.1', activity: 'Đăng ký khám', role: 'Nhân viên Tiếp đón', system: 'Tìm kiếm hoặc tạo mới hồ sơ bệnh nhân, tạo lượt khám ngoại trú và cấp số thứ tự vào hàng chờ của khoa khám.' },
            { stt: '1.2', activity: 'Đo Dấu hiệu sinh tồn', role: 'Điều dưỡng', system: 'Điều dưỡng đo các chỉ số sinh tồn ban đầu và cập nhật vào hồ sơ lượt khám trên hệ thống.' },
            { stt: '1.3', activity: 'Vào hàng chờ', role: 'Bệnh nhân', system: 'Hệ thống Quản lý Hàng chờ (QueueManagement) hiển thị trạng thái "Đang chờ" của bệnh nhân trên màn hình chờ.' },
        ],
    },
    {
        stageNumber: 2,
        title: 'Khám & Chỉ định',
        color: 'green',
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>,
        activities: [
            { stt: '2.1', activity: 'Gọi khám', role: 'Bác sĩ', system: 'Bác sĩ sử dụng module Khám ngoại trú (OPDManagement) để gọi bệnh nhân tiếp theo. Trạng thái trong hàng chờ chuyển thành "Đang khám".' },
            { stt: '2.2', activity: 'Thăm khám & Chẩn đoán sơ bộ', role: 'Bác sĩ', system: 'Bác sĩ ghi nhận thông tin bệnh sử, kết quả khám và đưa ra chẩn đoán sơ bộ vào Bệnh án điện tử (EMR).' },
            { stt: '2.3', activity: 'Chỉ định Cận lâm sàng (CLS)', role: 'Bác sĩ', system: 'Nếu cần, bác sĩ tạo chỉ định xét nghiệm/CĐHA ngay trên hệ thống. Yêu cầu được tự động gửi đến LIS/RIS và các khoản phí được thêm vào mục thanh toán. Trạng thái bệnh nhân cập nhật thành "Chờ kết quả CLS".' },
        ],
    },
    {
        stageNumber: 3,
        title: 'Hoàn tất & Thanh toán',
        color: 'yellow',
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
        activities: [
            { stt: '3.1', activity: 'Chẩn đoán cuối & Kê đơn', role: 'Bác sĩ', system: 'Sau khi có kết quả CLS (nếu có), bác sĩ đưa ra chẩn đoán xác định, tư vấn và kê đơn thuốc điện tử. Đơn thuốc được chuyển đến hệ thống Quản lý Dược.' },
            { stt: '3.2', activity: 'Thanh toán Viện phí', role: 'Nhân viên Viện phí/Bệnh nhân', system: 'Bệnh nhân đến quầy thanh toán. Hệ thống tự động tổng hợp tất cả chi phí (khám, CLS, thuốc). Nhân viên thu tiền và in hóa đơn.' },
            { stt: '3.3', activity: 'Lãnh thuốc', role: 'Dược sĩ', system: 'Dược sĩ tiếp nhận đơn thuốc trên hệ thống, cấp phát thuốc cho bệnh nhân và cập nhật trạng thái đơn thuốc thành "Đã cấp phát".' },
            { stt: '3.4', activity: 'Kết thúc Lượt khám', role: 'Hệ thống', system: 'Sau khi thanh toán và lãnh thuốc, lượt khám của bệnh nhân được tự động chuyển sang trạng thái "Đã hoàn thành".' },
        ],
    },
];


const exportToCsv = (stageTitle: string, activities: typeof inpatientProcessData[0]['activities']) => {
    const headers = ["STT", "Hoạt Động", "Vai Trò Thực Hiện", "Tương Tác Hệ Thống (HIS/EMR)"];
    
    // Function to escape CSV fields
    const escapeCsvField = (field: string) => `"${field.replace(/"/g, '""')}"`;

    const rows = activities.map(act => [
        escapeCsvField(act.stt),
        escapeCsvField(act.activity),
        escapeCsvField(act.role),
        escapeCsvField(act.system)
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    // Sanitize filename
    const safeTitle = stageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute("download", `Quy_trinh_${safeTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const CollapsibleStageCard: React.FC<{ data: typeof inpatientProcessData[0], isInitiallyOpen: boolean }> = ({ data, isInitiallyOpen }) => {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);

    const colorClasses = {
        base: {
            blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
            green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
            yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300',
            purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
        },
        border: {
             blue: 'border-blue-500',
             green: 'border-green-500',
             yellow: 'border-yellow-500',
             purple: 'border-purple-500',
        }
    };

    const handleExport = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the card from collapsing when clicking export
        exportToCsv(data.title, data.activities);
    };

    return (
        <div className="pl-20 relative w-full">
            <div className={`absolute top-0 left-5 w-10 h-10 rounded-full flex items-center justify-center ring-8 ring-gray-100 dark:ring-gray-900 ${colorClasses.base[data.color]}`}>
                <data.icon className="w-6 h-6" />
            </div>

            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border ${isOpen ? 'border-gray-300 dark:border-gray-600' : 'border-transparent'}`}>
                <div className="p-4 flex justify-between items-center cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)} aria-expanded={isOpen}>
                    <h3 className="text-xl font-bold">{data.stageNumber}. {data.title}</h3>
                    <div className="flex items-center space-x-2">
                         <button onClick={handleExport} className="text-xs flex items-center space-x-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-1.5 px-3 rounded-full transition-colors">
                            <DocumentArrowDownIcon className="w-4 h-4" />
                            <span>Xuất CSV</span>
                         </button>
                        <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                </div>
                {isOpen && (
                     <div className={`px-4 pb-4 border-t border-gray-200 dark:border-gray-700`}>
                        <div className="pt-4 space-y-4">
                             {data.activities.map(act => <ActivityItem key={act.stt} data={act} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ActivityItem: React.FC<{ data: typeof inpatientProcessData[0]['activities'][0] }> = ({ data }) => {
    return (
        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="font-bold text-gray-500 dark:text-gray-400 text-sm mt-0.5">{data.stt}</div>
            <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{data.activity}</p>
                <div className="mt-2 text-xs space-y-2">
                    <div className="flex items-start">
                        <UserIcon className="w-4 h-4 mt-0.5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <p><span className="font-semibold">Vai trò:</span> {data.role}</p>
                    </div>
                    <div className="flex items-start">
                        <ComputerDesktopIcon className="w-4 h-4 mt-0.5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <p><span className="font-semibold">Tương tác HIS/EMR:</span> {data.system}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const BusinessProcessFlow: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-2">Quy Trình Nghiệp Vụ</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Luồng công việc chuẩn cho Bệnh nhân Điều trị Nội trú</p>
            
            <div className="relative flex flex-col items-center">
                {/* Vertical Connector Line */}
                <div className="absolute top-5 bottom-5 left-10 w-0.5 bg-gray-300 dark:bg-gray-600 rounded-full" aria-hidden="true"></div>
                
                <div className="space-y-8 w-full">
                    {inpatientProcessData.map((stage, index) => (
                        <CollapsibleStageCard
                            key={stage.stageNumber}
                            data={stage}
                            isInitiallyOpen={index === 0}
                        />
                    ))}
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-2 mt-16">Luồng công việc Khám ngoại trú</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Quy trình chuẩn từ lúc đăng ký đến khi bệnh nhân hoàn tất lượt khám.</p>
            <div className="relative flex flex-col items-center">
                {/* Vertical Connector Line */}
                <div className="absolute top-5 bottom-5 left-10 w-0.5 bg-gray-300 dark:bg-gray-600 rounded-full" aria-hidden="true"></div>
                
                <div className="space-y-8 w-full">
                    {outpatientProcessData.map((stage, index) => (
                        <CollapsibleStageCard
                            key={stage.stageNumber}
                            data={stage}
                            isInitiallyOpen={index === 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Icons
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const ComputerDesktopIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" /></svg>;
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
const DocumentArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;

export default BusinessProcessFlow;