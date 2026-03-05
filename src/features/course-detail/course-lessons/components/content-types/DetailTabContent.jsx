import { Play, Trophy, CheckCircle2, Youtube, Eye, Hash, Clock, CalendarClock, Timer, MessageSquare, AlertTriangle, Monitor, VideoOff } from "lucide-react";

/**
 * Extract YouTube video ID from URL
 */
const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { formatDate } from '@/shared/utils';

// Status configuration
const STATUS_CONFIG = {
    NOT_STARTED: {
        label: 'Chưa bắt đầu',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-600',
        dotClass: 'bg-blue-400',
        buttonText: 'Chưa đến thời gian',
        buttonClass: 'bg-gray-100 text-gray-400 cursor-not-allowed',
        buttonIcon: false,
        disabled: true
    },
    DO_NOW: {
        label: 'Chưa làm',
        bgClass: 'bg-red-50',
        textClass: 'text-red-500',
        dotClass: 'bg-red-400',
        buttonText: 'Làm ngay',
        buttonClass: 'bg-blue-800 text-white hover:bg-blue-900',
        buttonIcon: true
    },
    REDO: {
        label: 'Làm lại',
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-500',
        dotClass: 'bg-orange-400',
        buttonText: 'Làm lại',
        buttonClass: 'bg-blue-800 text-white hover:bg-blue-900',
        buttonIcon: true
    },
    LATE_SUBMIT: {
        label: 'Nộp muộn',
        bgClass: 'bg-yellow-50',
        textClass: 'text-yellow-600',
        dotClass: 'bg-yellow-400',
        buttonText: 'Làm bài (Muộn)',
        buttonClass: 'bg-yellow-600 text-white hover:bg-yellow-700',
        buttonIcon: true
    },
    OVERDUE: {
        label: 'Quá hạn',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-500',
        dotClass: 'bg-gray-400',
        buttonText: 'Đã quá hạn',
        buttonClass: 'bg-gray-100 text-gray-400 cursor-not-allowed',
        buttonIcon: false,
        disabled: true
    },
    COMPLETED: {
        label: 'Đã hoàn thành',
        bgClass: 'bg-green-50',
        textClass: 'text-green-600',
        dotClass: 'bg-green-400',
        buttonText: 'Xem lại bài làm',
        buttonClass: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        buttonIcon: false
    },
    RESUME: {
        label: 'Đang làm dở',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-600',
        dotClass: 'bg-purple-400',
        buttonText: 'Tiếp tục làm bài',
        buttonClass: 'bg-purple-600 text-white hover:bg-purple-700',
        buttonIcon: true
    }
};

const DETAIL_FIELDS = [
    { label: 'Trạng thái', key: 'status', icon: null },
    { label: 'Số câu', key: 'questionCount', icon: Hash },
    { label: 'Thời gian làm', key: 'duration', icon: Clock },
    { label: 'Thời hạn', key: 'deadline', icon: CalendarClock },
    { label: 'Còn lại', key: 'timeRemaining', icon: Timer },
    { label: 'Nhận xét GV', key: 'feedback', icon: MessageSquare },
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
const ScoreCard = ({ progress, homeworkSubmit, competition }) => {
    const navigate = useNavigate();
    const submit = homeworkSubmit ?? progress?.homeworkSubmit ?? null;

    const isSubmitted = !!submit;
    const hasScore = submit?.points != null;
    const maxPoints = submit?.maxPoints ?? null;

    const hasFullRules = !!(competition?.allowViewScore || competition?.showResultDetail || competition?.allowViewAnswer);

    const handleViewResult = () => {
        const submitId = submit?.competitionSubmitId;
        if (submitId) navigate(ROUTES.COMPETITION_RESULT(submitId));
    };

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

            {isSubmitted && hasFullRules && submit?.competitionSubmitId && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleViewResult}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-text-5 font-medium cursor-pointer transition active:scale-95"
                    >
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        Xem chi tiết kết quả
                    </button>
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
    const solutionVideoId = canViewSolution ? getYoutubeVideoId(solutionUrl) : null;

    return (
        <div className="w-full flex flex-col gap-4 sm:gap-5">
            {/* Info Card */}
            <div className="w-full bg-white rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-5 py-4 flex flex-col gap-3">
                    {/* Detail rows */}
                    <div className="flex flex-col divide-y divide-gray-50">
                        {DETAIL_FIELDS.map(field => {
                            const value = detailData[field.key];
                            const FieldIcon = field.icon;
                            return (
                                <div key={field.key} className="flex items-center justify-between gap-3 py-2.5">
                                    <div className="flex items-center gap-2 shrink-0">
                                        {FieldIcon && <FieldIcon size={14} className="text-gray-400 shrink-0" />}
                                        <span className="text-[12px] text-gray-500 font-medium">{field.label}</span>
                                    </div>
                                    {field.key === 'status' ? (
                                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${statusConfig.bgClass}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass ?? 'bg-gray-400'}`} />
                                            <span className={`text-[11px] font-semibold ${statusConfig.textClass}`}>{value}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[13px] text-blue-950 font-medium text-right">{value}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Warning */}
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
                        <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-red-500 leading-relaxed">
                            Không thoát, tải lại trang hoặc chuyển ứng dụng khi đang làm bài. Hệ thống có thể tự động nộp bài nếu phát hiện gián đoạn.
                        </span>
                    </div>

                    {/* Start Button */}
                    <button
                        type="button"
                        disabled={statusConfig.disabled}
                        onClick={statusConfig.disabled ? undefined : onStartCompetition}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] transition-all ${
                            statusConfig.disabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : `${statusConfig.buttonClass} cursor-pointer active:scale-[0.98]`
                        }`}
                    >
                        {statusConfig.buttonIcon && <Play size={16} />}
                        <span>{statusConfig.buttonText}</span>
                    </button>
                </div>
            </div>

            {/* Score Card */}
            {allowViewScore && (
                <ScoreCard
                    progress={content?.progress}
                    homeworkSubmit={content?.homeworkSubmit}
                    competition={content?.competition}
                />
            )}

            {/* Video Solution Card */}
            <div className="w-full flex flex-col gap-3 px-5 py-4 bg-white rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <Youtube size={16} className="text-red-600" />
                        </div>
                        <span className="text-[14px] font-semibold text-blue-950">Video chữa bài</span>
                    </div>
                    {canViewSolution && solutionUrl && (
                        <a
                            href={solutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] text-red-600 hover:underline cursor-pointer"
                        >
                            <Youtube size={12} />
                            Mở YouTube
                        </a>
                    )}
                </div>

                {/* Player / Locked state */}
                {canViewSolution ? (
                    solutionVideoId ? (
                        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${solutionVideoId}`}
                                title="Video chữa bài"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-video rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200">
                            <VideoOff size={28} className="text-gray-300" />
                            <span className="text-[12px] text-gray-400">Chưa có video chữa bài</span>
                        </div>
                    )
                ) : (
                    <div className="w-full aspect-video rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Monitor size={18} className="text-gray-400" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[13px] font-medium text-gray-500">Video chưa khả dụng</span>
                            <span className="text-[11px] text-gray-400">Có thể xem sau khi nộp bài hoặc hết hạn</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};