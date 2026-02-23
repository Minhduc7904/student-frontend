import { Play } from "lucide-react";

const DETAIL_MOCK_DATA = {
    status: 'Chưa làm',
    questionCount: 20,
    duration: '45 phút',
    deadline: '20/02/2025',
    timeRemaining: '5 ngày 10 giờ',
    feedback: 'Chờ chữa bài'
};

const DETAIL_FIELDS = [
    { label: 'Trạng thái', key: 'status' },
    { label: 'Số câu', key: 'questionCount' },
    { label: 'Thời gian', key: 'duration' },
    { label: 'Thời hạn', key: 'deadline' },
    { label: 'Thời gian còn lại', key: 'timeRemaining' },
    { label: 'Nhận xét', key: 'feedback' }
];

export const DetailTabContent = ({ content }) => (
    <div className="w-full flex flex-col gap-6">
        {/* Information Card */}
        <div className="py-4 rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] gap-5 flex flex-col justify-center items-center w-full">
            {/* Details Grid */}
            <div className="flex flex-col gap-1.5 justify-center items-center w-full">
                <div className="px-10 pb-4 gap-2 flex flex-row justify-center items-center w-full">
                    <div className="flex flex-col gap-2 justify-center items-start">
                        {DETAIL_FIELDS.map(field => (
                            <div key={field.key} className="p-0.5">
                                <span className="text-subhead-4 text-gray-900">
                                    {field.label}:
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col gap-2 justify-center items-start">
                        {DETAIL_FIELDS.map(field => (
                            <div key={field.key} className="p-0.5">
                                <span className="text-text-4 text-gray-900">
                                    {DETAIL_MOCK_DATA[field.key]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warning Section */}
                <div className="flex flex-col gap-3.5 justify-center items-center w-full px-10">
                    <div className="w-full h-1 bg-gray-100 rounded-full" />
                    <div className="p-0.5">
                        <span className="text-red-600 text-text-5">
                            *Lưu ý: Không thoát, tải lại trang hoặc chuyển sang ứng dụng khác khi đang làm bài. Hệ thống có thể tự động nộp bài nếu phát hiện gián đoạn.
                        </span>
                    </div>
                </div>
            </div>

            {/* Start Button */}
            <div className="w-full flex justify-center items-center">
                <button
                    type="button"
                    className="w-60 rounded-lg cursor-pointer active:scale-95 transition px-3 py-2 bg-blue-100 flex flex-row gap-2.5 justify-center items-center"
                >
                    <Play className="w-5 h-5 text-blue-800" />
                    <span className="text-subhead-4 text-blue-800">
                        Làm bài
                    </span>
                </button>
            </div>
        </div>

        {/* Video Solution Card */}
        <div className="w-full flex flex-row gap-4 px-8 py-4 bg-white rounded-[20px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[#E1E1E14D]/30">
            <svg width="59" height="56" viewBox="0 0 59 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="58.6667" height="55.6667" rx="12" fill="#DFE9FF" />
                <path d="M40 16H18.6667C17.1939 16 16 17.1939 16 18.6667V32C16 33.4728 17.1939 34.6667 18.6667 34.6667H40C41.4728 34.6667 42.6667 33.4728 42.6667 32V18.6667C42.6667 17.1939 41.4728 16 40 16Z" stroke="#194DB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22.667 39.667H36.0003" stroke="#194DB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M32.5176 24.2526C32.6643 24.3284 32.7861 24.4373 32.8708 24.5684C32.9554 24.6995 33 24.8482 33 24.9996C33 25.151 32.9554 25.2997 32.8708 25.4308C32.7861 25.5619 32.6643 25.6709 32.5176 25.7467L26.4459 28.8843C26.2992 28.9601 26.1328 29 25.9634 29C25.794 29 25.6276 28.9601 25.481 28.8843C25.3343 28.8086 25.2127 28.6996 25.1282 28.5685C25.0438 28.4373 24.9996 28.2886 25 28.1373V21.862C24.9997 21.7109 25.044 21.5623 25.1283 21.4314C25.2127 21.3004 25.3342 21.1916 25.4806 21.1158C25.627 21.0401 25.7932 21.0002 25.9623 21C26.1315 20.9998 26.2978 21.0395 26.4444 21.1149L32.5176 24.2526Z" stroke="#194DB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <div className="p-0.5">
                        <span className="text-subhead-4 text-gray-900">
                            Video chữa bài
                        </span>
                    </div>
                    <div className="p-0.5">
                        <span className="text-text-4 text-[#5E5E5E]">
                            Chỉ có thể xem sau khi làm bài
                        </span>
                    </div>
                </div>
                <div className="w-fit px-3 py-0.5 bg-red-100 rounded-lg">
                    <span className="text-red-500 text-text-5">
                        Chưa làm
                    </span>
                </div>
            </div>
        </div>
    </div>
);
