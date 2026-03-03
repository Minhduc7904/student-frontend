import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import CompetitionResultLayout from './layout/CompetitionResultLayout';
import { ResultHeader, ScoreCard, StatsBar, AnswerCard } from './components';
import { PageLoading } from '../../shared/components/loading';
import { ROUTES } from '../../core/constants';

import {
    fetchCompetitionResult,
    selectCompetitionResult,
    selectCompetitionResultLoading,
    selectCompetitionResultError,
    clearResult,
} from './store';

// ─── Error state ─────────────────────────────────────────────────────────────
const ResultError = ({ error, onRetry, onBack }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl">😕</span>
        </div>
        <div className="flex flex-col gap-1">
            <h2 className="text-subhead-4 font-semibold text-gray-800">
                Không thể tải kết quả
            </h2>
            <p className="text-text-5 text-gray-500 max-w-sm">
                {error ?? 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'}
            </p>
        </div>
        <div className="flex gap-3 mt-2">
            <button
                onClick={onRetry}
                className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-text-5 font-medium transition-colors cursor-pointer"
            >
                Thử lại
            </button>
            <button
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-text-5 font-medium transition-colors cursor-pointer"
            >
                Về trang chủ
            </button>
        </div>
    </div>
);

// ─── Empty / restricted state ─────────────────────────────────────────────────
const RestrictedResult = ({ result }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-2xl">🔒</div>
        <h2 className="text-subhead-4 font-semibold text-gray-800">
            Kết quả chưa được công bố
        </h2>
        <p className="text-text-5 text-gray-500 max-w-sm">
            Giáo viên chưa cho phép xem điểm hoặc chi tiết bài làm. Vui lòng quay lại sau.
        </p>
        <div className="mt-1 flex flex-wrap gap-3 justify-center">
            {[
                { label: 'Xem điểm', allowed: result?.rules?.allowViewScore },
                { label: 'Xem chi tiết', allowed: result?.rules?.showResultDetail },
                { label: 'Xem đáp án', allowed: result?.rules?.allowViewAnswer },
            ].map(({ label, allowed }) => (
                <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-text-5 border
                        ${allowed ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-400'}`}
                >
                    {allowed ? '✓' : '✗'} {label}
                </span>
            ))}
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

/**
 * CompetitionResultPage
 * Route: /do-competition/submit/:submitId/result
 */
const CompetitionResultPage = () => {
    const { submitId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const result = useSelector(selectCompetitionResult);
    const loading = useSelector(selectCompetitionResultLoading);
    const error = useSelector(selectCompetitionResultError);

    // Fetch on mount
    useEffect(() => {
        if (submitId) {
            dispatch(fetchCompetitionResult(submitId));
        }
        return () => {
            dispatch(clearResult());
        };
    }, [submitId, dispatch]);

    const handleRetry = () => dispatch(fetchCompetitionResult(submitId));
    const handleBack = () => navigate(ROUTES.DASHBOARD, { replace: true });

    // ── Loading ──
    if (loading) {
        return (
            <CompetitionResultLayout>
                <PageLoading />
            </CompetitionResultLayout>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <CompetitionResultLayout>
                <ResultError error={error} onRetry={handleRetry} onBack={handleBack} />
            </CompetitionResultLayout>
        );
    }

    // ── No data yet ──
    if (!result) return null;

    const { rules, answers } = result;
    const noVisibleContent = !rules?.allowViewScore && !rules?.showResultDetail;

    return (
        <CompetitionResultLayout>
            <div className="flex flex-col gap-4 sm:gap-5">
                {/* ① Header: competition title + status + meta */}
                <ResultHeader result={result} />

                {/* ② Score card */}
                <ScoreCard result={result} />

                {/* ③ Quick stats */}
                <StatsBar result={result} />

                {/* ④ No content allowed */}
                {noVisibleContent && <RestrictedResult result={result} />}

                {/* ⑤ Answer list */}
                {rules?.showResultDetail && answers?.length > 0 && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-subhead-4 font-semibold text-gray-800">
                            Chi tiết câu trả lời
                            <span className="ml-2 text-text-5 font-normal text-gray-400">
                                ({answers.length} câu)
                            </span>
                        </h2>

                        {answers.map((answer, idx) => (
                            <AnswerCard
                                key={answer.competitionAnswerId}
                                answer={answer}
                                index={idx}
                                rules={rules}
                            />
                        ))}
                    </section>
                )}

                {/* ⑥ showResultDetail = true but no answers */}
                {rules?.showResultDetail && (!answers || answers.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-3xl mb-3">📋</span>
                        <p className="text-text-5 text-gray-500">Không có câu trả lời nào được ghi nhận.</p>
                    </div>
                )}
            </div>
        </CompetitionResultLayout>
    );
};

export default CompetitionResultPage;
