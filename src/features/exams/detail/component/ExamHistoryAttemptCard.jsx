import { memo } from 'react';
import { formatDateTime } from '../../../../shared/utils';

const getAttemptField = (attempt, keys, fallback = '--') => {
    for (let i = 0; i < keys.length; i += 1) {
        const value = attempt?.[keys[i]];
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }

    return fallback;
};

const formatAttemptDateTime = (value) => {
    if (!value || value === '--') return '--';

    const formatted = formatDateTime(value);
    return formatted || '--';
};

const normalizeStatus = (status) => {
    if (!status) return '--';
    return String(status).trim().toUpperCase();
};

const formatNumberValue = (value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return '--';

    if (Number.isInteger(parsed)) {
        return String(parsed);
    }

    return parsed.toFixed(2).replace(/\.00$/, '');
};

const formatMinutesDuration = (minutesValue) => {
    const minutes = Number(minutesValue);
    if (!Number.isFinite(minutes) || minutes < 0) return '--';

    const totalSeconds = Math.round(minutes * 60);
    const safeSeconds = Math.max(0, totalSeconds);
    const hours = Math.floor(safeSeconds / 3600);
    const mins = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    }

    if (mins > 0) {
        return `${mins}m ${String(secs).padStart(2, '0')}s`;
    }

    return `${secs}s`;
};

const computeWorkingMinutes = (attempt) => {
    const directWorkingMinutes = getAttemptField(
        attempt,
        ['workingDurationMinutes', 'spentMinutes', 'elapsedMinutes', 'timeSpentMinutes', 'workTimeMinutes'],
        null
    );

    const parsedWorkingMinutes = Number(directWorkingMinutes);
    if (Number.isFinite(parsedWorkingMinutes) && parsedWorkingMinutes >= 0) {
        return parsedWorkingMinutes;
    }

    const startedAtRaw = getAttemptField(attempt, ['startedAt', 'createdAt'], null);
    const submittedAtRaw = getAttemptField(attempt, ['endAt', 'submittedAt'], null);

    const startedAtMs = startedAtRaw ? new Date(startedAtRaw).getTime() : NaN;
    const submittedAtMs = submittedAtRaw ? new Date(submittedAtRaw).getTime() : NaN;
    if (!Number.isFinite(startedAtMs) || !Number.isFinite(submittedAtMs) || submittedAtMs < startedAtMs) {
        return null;
    }

    return (submittedAtMs - startedAtMs) / 60000;
};

const getStatusMeta = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === 'IN_PROGRESS') {
        return {
            text: 'Đang làm',
            className: 'bg-amber-50 text-amber-700',
            actionLabel: 'Làm tiếp',
            actionClassName: 'bg-amber-500 text-white hover:bg-amber-600',
            actionType: 'continue',
        };
    }

    if (normalized === 'SUBMITTED' || normalized === 'SUBMITED') {
        return {
            text: 'Đã nộp bài',
            className: 'bg-emerald-50 text-emerald-700',
            actionLabel: 'Xem kết quả',
            actionClassName: 'bg-blue-600 text-white hover:bg-blue-700',
            actionType: 'result',
        };
    }

    return {
        text: status || '--',
        className: 'bg-slate-100 text-slate-700',
        actionLabel: null,
        actionClassName: '',
        actionType: null,
    };
};

const ExamHistoryAttemptCard = ({
    attempt,
    index,
    onContinueAttempt,
    onViewResult,
    className = '',
    showExamTitle = false,
    showScore = true,
    showSubmittedAt = true,
}) => {
    const attemptId = getAttemptField(attempt, ['attemptId', 'id'], `${index + 1}`);
    const status = getAttemptField(attempt, ['status'], '--');
    const normalizedStatus = normalizeStatus(status);
    const isSubmittedAttempt = normalizedStatus === 'SUBMITTED' || normalizedStatus === 'SUBMITED';
    const statusMeta = getStatusMeta(status);
    const points = getAttemptField(attempt, ['points', 'score', 'point'], '--');
    const maxPoints = getAttemptField(attempt, ['maxPoints', 'totalPoints', 'maxScore'], '--');
    const scoreDisplay = `${formatNumberValue(points)} / ${formatNumberValue(maxPoints)}`;
    const startedAt = formatAttemptDateTime(getAttemptField(attempt, ['startedAt', 'createdAt'], '--'));
    const submittedAt = formatAttemptDateTime(
        getAttemptField(attempt, ['endAt', 'submittedAt'], '--')
    );
    const duration = getAttemptField(attempt, ['duration', 'durationMinutes'], '--');
    const workingTimeMinutes = computeWorkingMinutes(attempt);
    const workingTimeDisplay = formatMinutesDuration(workingTimeMinutes);
    const questionCount = getAttemptField(attempt, ['questionCount', 'totalQuestions'], '--');
    const examTitle = getAttemptField(attempt, ['examTitle', 'title'], '--');

    return (
        <article className={`min-w-70 rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900 min-w-0 flex-1 line-clamp-2">
                    {showExamTitle ? examTitle : `Lần làm #${index + 1}`}
                </p>
                <span className={`shrink-0 whitespace-nowrap inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusMeta.className}`}>
                    {statusMeta.text}
                </span>
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                {showScore ? (
                    <p>
                        Điểm: <span className="font-semibold text-slate-900">{scoreDisplay}</span>
                    </p>
                ) : null}
                <p>
                    Số câu: <span className="text-slate-900">{questionCount}</span>
                </p>
                <p>
                    Bắt đầu: <span className="text-slate-900">{startedAt}</span>
                </p>
                {showSubmittedAt ? (
                    <p>
                        Nộp bài: <span className="text-slate-900">{submittedAt}</span>
                    </p>
                ) : null}
                <p>
                    Thời lượng: <span className="text-slate-900">{duration} phút</span>
                </p>
                {isSubmittedAttempt ? (
                    <p>
                        Thời gian làm bài: <span className="text-slate-900">{workingTimeDisplay}</span>
                    </p>
                ) : null}
            </div>

            {statusMeta.actionLabel ? (
                <button
                    type="button"
                    onClick={() => {
                        if (statusMeta.actionType === 'continue') {
                            onContinueAttempt?.(attempt);
                            return;
                        }

                        if (statusMeta.actionType === 'result') {
                            onViewResult?.(attempt);
                        }
                    }}
                    className={`cursor-pointer mt-3 inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${statusMeta.actionClassName}`}
                >
                    {statusMeta.actionLabel}
                </button>
            ) : null}
        </article>
    );
};

export default memo(ExamHistoryAttemptCard);
