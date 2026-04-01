import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, SmoothLineChartCard } from '../../../../shared/components';
import { ROUTES } from '../../../../core/constants';
import ExamHistoryAttemptCard from '../../detail/component/ExamHistoryAttemptCard';
import { mapApiTypeCodeToExamTypeId, normalizeExamType } from '../../constants/examTypes';

const resolveAttemptType = (attempt) => {
    const directType = normalizeExamType(attempt?.examType || attempt?.type || attempt?.typeOfExam);
    if (directType) return directType;

    return mapApiTypeCodeToExamTypeId(attempt?.typeOfExam);
};

const ContinueExamSidebar = ({
    attempts = [],
    pagination = {},
    recentAttemptsStats = [],
    recentAttemptsStatsLoading = false,
    recentAttemptsStatsError = null,
    loading = false,
    error = null,
    onPageChange,
}) => {
    const navigate = useNavigate();
    const currentPage = Number(pagination?.page) || 1;
    const totalPages = Number(pagination?.totalPages) || 1;
    const total = Number(pagination?.total) || (Array.isArray(attempts) ? attempts.length : 0);

    const handleContinueAttempt = (attempt) => {
        const attemptId = attempt?.attemptId || attempt?.id;
        const examId = attempt?.examId;
        const typeExam = resolveAttemptType(attempt);

        if (!attemptId || !examId || !typeExam) return;

        navigate(ROUTES.EXAM_TYPE_ATTEMPT_PRACTICE(typeExam, examId, attemptId), {
            state: {
                examTitle: attempt?.examTitle || `Đề thi #${examId}`,
            },
        });
    };

    if (loading) {
        return (
            <aside className="h-fit">
                <div className="mb-4 animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="h-4 w-3/5 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-2/5 rounded bg-slate-100" />
                    <div className="mt-3 h-40 w-full rounded bg-slate-100" />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Đề thi tiếp tục làm</h2>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">...</span>
                </div>

                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={`continue-exam-skeleton-${index + 1}`}
                            className="animate-pulse rounded-xl border border-slate-200 bg-white p-4"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="h-4 w-2/3 rounded bg-slate-200" />
                                <div className="h-5 w-20 rounded-full bg-slate-200" />
                            </div>

                            <div className="mt-3 space-y-2">
                                <div className="h-3 w-1/2 rounded bg-slate-100" />
                                <div className="h-3 w-2/3 rounded bg-slate-100" />
                                <div className="h-3 w-1/2 rounded bg-slate-100" />
                            </div>

                            <div className="mt-3 h-9 w-full rounded-lg bg-slate-200" />
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-slate-100" />
                    <div className="h-7 w-7 rounded-lg bg-slate-100" />
                    <div className="h-7 w-7 rounded-lg bg-slate-100" />
                </div>
            </aside>
        );
    }

    return (
        <aside className="h-fit">
            <SmoothLineChartCard
                title="Thống kê điểm 10 bài gần nhất"
                subtitle={recentAttemptsStatsLoading ? 'Đang tải dữ liệu...' : 'Dữ liệu từ lịch sử bài thi'}
                items={Array.isArray(recentAttemptsStats) ? recentAttemptsStats : []}
                chartType="exam"
                onlySubmitted
                showExpandButton={false}
                emptyText={
                    recentAttemptsStatsError
                        ? (typeof recentAttemptsStatsError === 'string'
                            ? recentAttemptsStatsError
                            : recentAttemptsStatsError?.message || 'Không thể tải thống kê điểm gần nhất.')
                        : 'Chưa có dữ liệu thống kê điểm 10 bài gần nhất.'
                }
                className="mb-4"
            />

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Đề thi tiếp tục làm</h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {total}
                </span>
            </div>

            {error ? (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {typeof error === 'string' ? error : error?.message || 'Không thể tải đề thi đang làm'}
                </div>
            ) : null}

            {!attempts.length ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    Bạn chưa có đề thi nào đang làm.
                </div>
            ) : (
                <div className="space-y-3">
                    {attempts.map((attempt, index) => (
                        <ExamHistoryAttemptCard
                            key={String(attempt?.attemptId || attempt?.id || index)}
                            attempt={attempt}
                            index={index}
                            onContinueAttempt={handleContinueAttempt}
                            className="min-w-0 w-full"
                            showExamTitle
                            showScore={false}
                            showSubmittedAt={false}
                        />
                    ))}
                </div>
            )}

            <Pagination
                className="mt-4 lg:pt-2"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                disabled={loading}
            />
        </aside>
    );
};

export default memo(ContinueExamSidebar);
