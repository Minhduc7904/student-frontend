import { Play, Trophy, CheckCircle2, Youtube } from "lucide-react";
import { formatDate } from '@/shared/utils';

// Status configuration
const STATUS_CONFIG = {
    DO_NOW: {
        label: 'Chưa làm',
        color: 'red',
        bgClass: 'bg-red-100',
        textClass: 'text-red-500',
        buttonText: 'Làm ngay',
        buttonClass: 'bg-blue-800 text-white hover:bg-blue-900',
        buttonIcon: true
    },
    REDO: {
        label: 'Làm lại',
        color: 'orange',
        bgClass: 'bg-orange-100',
        textClass: 'text-orange-500',
        buttonText: 'Làm lại',
        buttonClass: 'bg-blue-800 text-white hover:bg-blue-900',
        buttonIcon: true
    },
    LATE_SUBMIT: {
        label: 'Nộp muộn',
        color: 'yellow',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-600',
        buttonText: 'Làm bài (Muộn)',
        buttonClass: 'bg-yellow-600 text-white hover:bg-yellow-700',
        buttonIcon: true
    },
    OVERDUE: {
        label: 'Quá hạn',
        color: 'gray',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-500',
        buttonText: 'Đã quá hạn',
        buttonClass: 'bg-gray-300 text-gray-500 cursor-not-allowed',
        buttonIcon: false,
        disabled: true
    },
    COMPLETED: {
        label: 'Đã hoàn thành',
        color: 'green',
        bgClass: 'bg-green-100',
        textClass: 'text-green-600',
        buttonText: 'Xem lại bài làm',
        buttonClass: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        buttonIcon: false
    }
};

const DETAIL_FIELDS = [
    { label: 'Trạng thái', key: 'status' },
    { label: 'Số câu', key: 'questionCount' },
    { label: 'Thời gian', key: 'duration' },
    { label: 'Thời hạn', key: 'deadline' },
    { label: 'Thời gian còn lại', key: 'timeRemaining' },
    { label: 'Nhận xét', key: 'feedback' }
];

/**
 * Format remaining time from seconds
 */
const formatRemainingTime = (seconds) => {
    if (!seconds || seconds <= 0) return 'Hết hạn';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days} ngày`);
    if (hours > 0) parts.push(`${hours} giờ`);
    if (days === 0 && minutes > 0) parts.push(`${minutes} phút`);

    return parts.length > 0 ? parts.join(' ') : 'Dưới 1 phút';
};

/**
 * Get detail data from content
 */
const getDetailData = (content) => {
    if (!content || !content.progress) {
        return {
            status: 'Chưa có dữ liệu',
            questionCount: 0,
            duration: 'N/A',
            deadline: 'N/A',
            timeRemaining: 'N/A',
            feedback: 'N/A'
        };
    }

    const { progress, competition, dueDate } = content;
    const statusConfig = STATUS_CONFIG[progress.status] || STATUS_CONFIG.DO_NOW;

    return {
        status: statusConfig.label,
        questionCount: progress.questionCount || 0,
        duration: competition?.duration ? `${competition.duration} phút` : 'N/A',
        deadline: progress.deadline ? formatDate(progress.deadline) : (dueDate ? formatDate(dueDate) : 'Không có thời hạn'),
        timeRemaining: progress.remainingTimeSeconds ? formatRemainingTime(progress.remainingTimeSeconds) :
            (progress.status === 'OVERDUE' || progress.status === 'COMPLETED' ? 'N/A' : 'N/A'),
        feedback: progress.homeworkSubmit ? (progress.homeworkSubmit.feedback || 'Không có nhận xét') : 'Chưa nộp bài'
    };
};

/**
 * ScoreCard
 * Hiển thị điểm số và lịch sử các lần nộp bài khi competition.allowViewScore = true
 */
const ScoreCard = ({ progress, homeworkSubmit }) => {
    const submit = homeworkSubmit ?? progress?.homeworkSubmit ?? null;

    const isSubmitted = !!submit;
    const hasScore = submit?.points != null;
    const maxPoints = submit?.maxPoints ?? null;

    return (
        <div className="w-full flex flex-col gap-4 px-8 py-6 bg-white rounded-[20px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">

            {/* Header */}
            <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className="text-subhead-4 font-semibold text-gray-900">
                    Kết quả bài tập
                </span>
            </div>

            {/* Content */}
            {isSubmitted ? (
                <div className="flex items-center gap-4 px-5 py-4 rounded-xl border bg-green-50 border-green-200">

                    {/* Icon */}
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />

                    {/* Info */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-500">
                            {hasScore ? "Điểm bài tập" : "Đã nộp bài"}
                        </span>

                        <span className={`text-xl font-bold ${hasScore ? "text-green-700" : "text-gray-700"
                            }`}>
                            {hasScore
                                ? `${submit.points}${maxPoints != null ? ` / ${maxPoints}` : ""}`
                                : "Đang chờ chấm điểm"}
                        </span>

                        {submit?.submitAt && (
                            <span className="text-xs text-gray-500">
                                Nộp lúc: {formatDate(submit.submitAt)}
                            </span>
                        )}
                    </div>

                    {/* Status badge */}
                    <div className="ml-auto">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${hasScore
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {hasScore ? "Đã chấm" : "Chờ chấm"}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center py-6 text-gray-400 text-sm">
                    Bạn chưa nộp bài
                </div>
            )}
        </div>
    );
};

export const DetailTabContent = ({ content, onStartCompetition }) => {
    const detailData = getDetailData(content);
    const status = content?.progress?.status || 'DO_NOW';
    const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.DO_NOW;
    const allowViewScore = content?.competition?.allowViewScore ?? false;

    const allowViewSolution = content?.competition?.allowViewSolutionYoutubeUrl ?? false;
    const hasSubmitted = !!(content?.homeworkSubmit ?? content?.progress?.homeworkSubmit);
    const isOverdue = status === 'OVERDUE';
    const canViewSolution = allowViewSolution && (isOverdue || hasSubmitted);
    const solutionUrl = content?.competition?.exam?.solutionYoutubeUrl ?? '';

    return (
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
                            {DETAIL_FIELDS.map(field => {
                                const value = detailData[field.key];

                                // Render status badge instead of plain text
                                if (field.key === 'status') {
                                    return (
                                        <div key={field.key} className="py-0.5">
                                            <div className={`w-fit px-3 py-0.5 ${statusConfig.bgClass} rounded-lg`}>
                                                <span className={`${statusConfig.textClass} text-text-5`}>
                                                    {value}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={field.key} className="p-0.5">
                                        <span className="text-text-4 text-gray-900">
                                            {value}
                                        </span>
                                    </div>
                                );
                            })}
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
                        disabled={statusConfig.disabled}
                        onClick={statusConfig.disabled ? undefined : onStartCompetition}
                        className={`w-60 rounded-lg transition px-3 py-2 ${statusConfig.buttonClass} ${!statusConfig.disabled ? 'cursor-pointer active:scale-95' : ''
                            } flex flex-row gap-2.5 justify-center items-center`}
                    >
                        {statusConfig.buttonIcon && <Play className="w-5 h-5" />}
                        <span className="text-subhead-4">
                            {statusConfig.buttonText}
                        </span>
                    </button>
                </div>
            </div>

            {/* Score Card - chỉ hiển thị khi allowViewScore = true */}
            {allowViewScore && (
                <ScoreCard
                    progress={content?.progress}
                    homeworkSubmit={content?.homeworkSubmit}
                />
            )}

            {/* Video Solution Card */}
            <div className="w-full flex flex-row gap-4 px-8 py-4 bg-white rounded-[20px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[#E1E1E14D]/30">
                <svg width="59" height="56" viewBox="0 0 59 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="58.6667" height="55.6667" rx="12" fill="#DFE9FF" />
                    <path d="M40 16H18.6667C17.1939 16 16 17.1939 16 18.6667V32C16 33.4728 17.1939 34.6667 18.6667 34.6667H40C41.4728 34.6667 42.6667 33.4728 42.6667 32V18.6667C42.6667 17.1939 41.4728 16 40 16Z" stroke="#194DB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22.667 39.667H36.0003" stroke="#194DB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M32.5176 24.2526C32.6643 24.3284 32.7861 24.4373 32.8708 24.5684C32.9554 24.6995 33 24.8482 33 24.9996C33 25.151 32.9554 25.2997 32.8708 25.4308C32.7861 25.5619 32.6643 25.6709 32.5176 25.7467L26.4459 28.8843C26.2992 28.9601 26.1328 29 25.9634 29C25.794 29 25.6276 28.9601 25.481 28.8843C25.3343 28.8086 25.2127 28.6996 25.1282 28.5685C25.0438 28.4373 24.9996 28.2886 25 28.1373V21.862C24.9997 21.7109 25.044 21.5623 25.1283 21.4314C25.2127 21.3004 25.3342 21.1916 25.4806 21.1158C25.627 21.0401 25.7932 21.0002 25.9623 21C26.1315 20.9998 26.2978 21.0395 26.4444 21.1149L32.5176 24.2526Z" stroke="#194DB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex flex-col gap-3 flex-1">
                    <div className="flex flex-col gap-2">
                        <div className="p-0.5">
                            <span className="text-subhead-4 text-gray-900">
                                Video chữa bài
                            </span>
                        </div>
                        <div className="p-0.5">
                            <span className="text-text-4 text-[#5E5E5E]">
                                {canViewSolution
                                    ? solutionUrl
                                        ? 'Click để xem video giải thích chi tiết'
                                        : 'Chưa có video chữa bài'
                                    : 'Chỉ có thể xem sau khi nộp bài hoặc hết hạn'}
                            </span>
                        </div>
                    </div>
                    {canViewSolution && solutionUrl ? (
                        <a
                            href={solutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-fit px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors active:scale-95"
                        >
                            <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                            <span className="text-text-5 font-medium text-red-700">Xem trên YouTube</span>
                        </a>
                    ) : (
                        <div className={`w-fit px-3 py-0.5 ${canViewSolution ? 'bg-gray-100' : statusConfig.bgClass} rounded-lg`}>
                            <span className={`${canViewSolution ? 'text-gray-500' : statusConfig.textClass} text-text-5`}>
                                {canViewSolution ? 'Chưa có video' : statusConfig.label}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};