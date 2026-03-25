import { Trophy, Clock, Hash, Calendar, CheckCircle, XCircle, AlertCircle, Hourglass } from 'lucide-react';

/**
 * Status badge helpers
 */
const STATUS_CONFIG = {
    SUBMITTED: {
        label: 'Đã nộp bài',
        icon: CheckCircle,
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    IN_PROGRESS: {
        label: 'Đang làm',
        icon: Hourglass,
        className: 'border-blue-200 bg-blue-50 text-blue-700',
    },
    GRADED: {
        label: 'Đã chấm điểm',
        icon: Trophy,
        className: 'border-amber-200 bg-amber-50 text-amber-700',
    },
    ABANDONED: {
        label: 'Đã hủy',
        icon: XCircle,
        className: 'border-red-200 bg-red-50 text-red-700',
    },
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] ?? {
        label: status,
        icon: AlertCircle,
        className: 'border-slate-200 bg-slate-100 text-slate-700',
    };
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-text-5 font-semibold ${config.className}`}>
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
        <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-h4 leading-snug text-gray-900">
                            {competition?.title ?? 'Bài thi'}
                        </h1>
                        {competition?.description && (
                            <p className="line-clamp-2 text-text-5 text-gray-600">
                                {competition.description}
                            </p>
                        )}
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-text-5 text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-2">
                        <Hash className="h-3.5 w-3.5 text-slate-400" />
                        <span>Lần thứ</span>
                        <strong className="text-slate-900">{attemptNumber ?? '--'}</strong>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Bắt đầu</span>
                        <strong className="truncate text-slate-900">{formatDate(startedAt)}</strong>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Nộp bài</span>
                        <strong className="truncate text-slate-900">{formatDate(submittedAt)}</strong>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Thời gian làm</span>
                        <strong className="text-slate-900">
                            {rules?.allowViewScore && timeSpentSeconds != null ? formatDuration(timeSpentSeconds) : '--'}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultHeader;
