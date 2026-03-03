import { Trophy, Clock, Hash, Calendar, CheckCircle, XCircle, AlertCircle, Hourglass } from 'lucide-react';

/**
 * Status badge helpers
 */
const STATUS_CONFIG = {
    SUBMITTED: {
        label: 'Đã nộp bài',
        icon: CheckCircle,
        className: 'bg-green-100 text-green-700 border border-green-200',
    },
    IN_PROGRESS: {
        label: 'Đang làm',
        icon: Hourglass,
        className: 'bg-blue-100 text-blue-700 border border-blue-200',
    },
    GRADED: {
        label: 'Đã chấm điểm',
        icon: Trophy,
        className: 'bg-purple-100 text-purple-700 border border-purple-200',
    },
    ABANDONED: {
        label: 'Đã hủy',
        icon: XCircle,
        className: 'bg-red-100 text-red-700 border border-red-200',
    },
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] ?? {
        label: status,
        icon: AlertCircle,
        className: 'bg-gray-100 text-gray-600 border border-gray-200',
    };
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-text-5 font-medium ${config.className}`}>
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {config.label}
        </span>
    );
};

/**
 * Format seconds → "mm:ss" hoặc "HH:mm:ss"
 */
const formatDuration = (seconds) => {
    if (seconds == null) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Format datetime
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * ResultHeader
 * Hiển thị tiêu đề cuộc thi, trạng thái, lần thứ, và thời gian
 */
const ResultHeader = ({ result }) => {
    const competition = result?.competition;
    const { status, attemptNumber, startedAt, submittedAt, timeSpentSeconds, rules } = result ?? {};

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Accent bar */}
            <div className="h-1.5 bg-linear-to-r from-blue-800 to-cyan-500" />

            <div className="px-5 sm:px-8 py-5 sm:py-6 flex flex-col gap-4">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-head-5 sm:text-head-4 font-bold text-gray-900 leading-snug">
                            {competition?.title ?? 'Bài thi'}
                        </h1>
                        {competition?.description && (
                            <p className="text-text-5 text-gray-500 line-clamp-2">
                                {competition.description}
                            </p>
                        )}
                    </div>
                    <StatusBadge status={status} />
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-3 sm:gap-5 text-text-5 text-gray-600">
                    {/* Attempt number */}
                    <span className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-gray-400" />
                        Lần thứ <strong className="text-gray-800">{attemptNumber}</strong>
                    </span>

                    {/* Start time */}
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Bắt đầu: <strong className="text-gray-800">{formatDate(startedAt)}</strong>
                    </span>

                    {/* Submitted time */}
                    {submittedAt && (
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            Nộp bài: <strong className="text-gray-800">{formatDate(submittedAt)}</strong>
                        </span>
                    )}

                    {/* Time spent */}
                    {rules?.allowViewScore && timeSpentSeconds != null && (
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            Thời gian làm: <strong className="text-gray-800">{formatDuration(timeSpentSeconds)}</strong>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultHeader;
