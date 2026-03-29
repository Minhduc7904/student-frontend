import { memo } from 'react';
import { Pagination } from '../../../../shared/components';
import ExamHistoryAttemptCard from './ExamHistoryAttemptCard';

const getAttemptItems = (attempts) => {
    if (!attempts) return [];

    if (Array.isArray(attempts)) return attempts;
    if (Array.isArray(attempts?.items)) return attempts.items;
    if (Array.isArray(attempts?.content)) return attempts.content;
    if (Array.isArray(attempts?.data)) return attempts.data;
    if (Array.isArray(attempts?.results)) return attempts.results;

    return [];
};

const normalizeError = (error) => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (typeof error?.message === 'string') return error.message;
    return 'Không thể tải lịch sử làm bài.';
};

const ExamHistoryTabContent = ({
    attempts,
    loading = false,
    error = null,
    pagination = {},
    onPageChange,
    onContinueAttempt,
    onViewResult,
}) => {
    const items = getAttemptItems(attempts);
    const normalizedError = normalizeError(error);
    const currentPage = Number(pagination?.page) || 1;
    const totalPages = Number(pagination?.totalPages) || 1;
    const total = Number(pagination?.total) || items.length;

    if (loading) {
        return (
            <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={`history-skeleton-${index + 1}`}
                        className="h-40 min-w-70 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
                    />
                ))}
            </div>
        );
    }

    if (normalizedError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {normalizedError}
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Chưa có lịch sử làm bài cho đề thi này.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
                {items.map((attempt, index) => (
                    <ExamHistoryAttemptCard
                        key={`${attempt?.attemptId || attempt?.id || index + 1}-${index + 1}`}
                        attempt={attempt}
                        index={index}
                        onContinueAttempt={onContinueAttempt}
                        onViewResult={onViewResult}
                    />
                ))}
            </div>

            <div className="space-y-2 flex flex-col lg:flex-row items-center justify-center lg:justify-between">
                <p className="text-center text-xs text-slate-500">Tổng {total} lượt làm bài</p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default memo(ExamHistoryTabContent);
