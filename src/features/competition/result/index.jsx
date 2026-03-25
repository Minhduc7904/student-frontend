import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AlertTriangle, FileText, Lock, RefreshCw } from 'lucide-react';

import { ResultHeader, ScoreCard, StatsBar, AnswerCard } from './components';
import { ROUTES } from '../../../core/constants';

import {
    fetchCompetitionResult,
    selectCompetitionResult,
    selectCompetitionResultLoading,
    selectCompetitionResultError,
    clearResult,
} from './store';

const ResultLoading = () => (
    <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
            <div>
                <div className="h-6 w-48 animate-pulse rounded-md bg-slate-200" />
                <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-slate-100" />
            </div>
            <div className="h-8 w-28 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="space-y-3">
            {[0, 1, 2].map((idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="h-4 w-40 animate-pulse rounded-md bg-slate-200" />
                    <div className="mt-3 h-3 w-full animate-pulse rounded-md bg-slate-200" />
                    <div className="mt-2 h-3 w-5/6 animate-pulse rounded-md bg-slate-100" />
                    <div className="mt-2 h-3 w-4/6 animate-pulse rounded-md bg-slate-100" />
                </div>
            ))}
        </div>
    </section>
);

const ResultError = ({ error, onRetry, onBack }) => (
    <section className="mt-5 rounded-2xl border border-red-100 bg-white p-4 md:p-5">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500">
                <AlertTriangle size={20} />
            </div>
            <h2 className="text-subhead-4 font-semibold text-red-700">Không thể tải kết quả</h2>
            <p className="text-text-5 text-red-600">
                {error ?? 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
                <button
                    onClick={onRetry}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-text-5 font-semibold text-white transition-colors hover:bg-red-700"
                >
                    <RefreshCw size={14} />
                    Thử lại
                </button>
                <button
                    onClick={onBack}
                    className="cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-text-5 font-semibold text-red-700 transition-colors hover:bg-red-100"
                >
                    Quay lại cuộc thi
                </button>
            </div>
        </div>
    </section>
);

const RestrictedResult = ({ result }) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
        <div className="flex items-center gap-2 text-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600">
                <Lock size={15} />
            </div>
            <h2 className="text-subhead-4 font-semibold">Kết quả chưa được công bố</h2>
        </div>
        <p className="mt-2 max-w-2xl text-text-5 text-slate-600">
            Giáo viên chưa cho phép xem điểm hoặc chi tiết bài làm. Vui lòng quay lại sau.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
            {[
                { label: 'Xem điểm', allowed: result?.rules?.allowViewScore },
                { label: 'Xem chi tiết', allowed: result?.rules?.showResultDetail },
                { label: 'Xem đáp án', allowed: result?.rules?.allowViewAnswer },
            ].map(({ label, allowed }) => (
                <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-text-5 ${
                        allowed
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-500'
                    }`}
                >
                    {allowed ? '✓' : '✗'} {label}
                </span>
            ))}
        </div>
    </div>
);

const CompetitionResultPage = ({ submitId: submitIdProp, competitionId: competitionIdProp, onBack }) => {
    const { submitId: submitIdFromParams, competitionId: competitionIdFromParams } = useParams();
    const submitId = submitIdProp ?? submitIdFromParams;
    const competitionId = competitionIdProp ?? competitionIdFromParams;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const result = useSelector(selectCompetitionResult);
    const loading = useSelector(selectCompetitionResultLoading);
    const error = useSelector(selectCompetitionResultError);

    useEffect(() => {
        if (submitId) {
            dispatch(fetchCompetitionResult(submitId));
        }

        return () => {
            dispatch(clearResult());
        };
    }, [submitId, dispatch]);

    const handleRetry = () => dispatch(fetchCompetitionResult(submitId));
    const handleBack = () => {
        if (typeof onBack === 'function') {
            onBack();
            return;
        }

        if (competitionId) {
            navigate(ROUTES.COMPETITION_DETAIL(competitionId), { replace: true });
            return;
        }
        navigate(ROUTES.DASHBOARD, { replace: true });
    };

    if (loading) {
        return <ResultLoading />;
    }

    if (error) {
        return <ResultError error={error} onRetry={handleRetry} onBack={handleBack} />;
    }

    if (!result) return null;

    const { rules, answers } = result;
    const noVisibleContent = !rules?.allowViewScore && !rules?.showResultDetail;

    return (
        <div className="mt-5 flex flex-col gap-4">
            <ResultHeader result={result} />
            <ScoreCard result={result} />
            <StatsBar result={result} />

            {noVisibleContent && <RestrictedResult result={result} />}

            {rules?.showResultDetail && answers?.length > 0 && (
                <section className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <h2 className="text-subhead-4 font-semibold text-gray-900">Chi tiết câu trả lời</h2>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-text-5 font-semibold text-slate-700">
                            {answers.length} câu
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {answers.map((answer, idx) => (
                            <AnswerCard
                                key={answer.competitionAnswerId}
                                answer={answer}
                                index={idx}
                                rules={rules}
                            />
                        ))}
                    </div>
                </section>
            )}

            {rules?.showResultDetail && (!answers || answers.length === 0) && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white py-12 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <FileText size={18} />
                    </div>
                    <p className="text-text-5 text-slate-600">Không có câu trả lời nào được ghi nhận.</p>
                </div>
            )}
        </div>
    );
};

export default CompetitionResultPage;