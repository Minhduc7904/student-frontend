import { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import PracticeResultSummaryCard from './component/PracticeResultSummaryCard';
import {
    clearPracticeResult,
    fetchPracticeResult,
    selectPracticeResultError,
    selectPracticeResultLoading,
    selectPracticeResult,
} from './store';

const ExamPracticeResultPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { attemptId, typeExam, id } = useParams();

    const loading = useSelector(selectPracticeResultLoading);
    const error = useSelector(selectPracticeResultError);
    const result = useSelector(selectPracticeResult);

    const normalizedAttemptId = useMemo(() => {
        if (!attemptId) return null;
        const parsed = Number(attemptId);
        return Number.isNaN(parsed) ? attemptId : parsed;
    }, [attemptId]);

    useEffect(() => {
        if (!normalizedAttemptId) return;

        dispatch(fetchPracticeResult(normalizedAttemptId));

        return () => {
            dispatch(clearPracticeResult());
        };
    }, [dispatch, normalizedAttemptId]);

    const handleBack = () => {
        if (typeExam && id) {
            navigate(ROUTES.EXAM_TYPE_DETAIL(typeExam, id));
            return;
        }

        navigate(ROUTES.EXAMS);
    };

    if (loading) {
        return (
            <Card>
                <div className="animate-pulse space-y-3">
                    <div className="h-6 w-52 rounded bg-slate-200" />
                    <div className="h-4 w-64 rounded bg-slate-200" />
                    <div className="h-32 rounded-xl bg-slate-100" />
                </div>
            </Card>
        );
    }

    if (error) {
        const normalizedError = typeof error === 'string' ? error : error?.message || 'Không thể tải kết quả bài làm.';

        return (
            <Card>
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={18} className="mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">Tải dữ liệu thất bại</p>
                            <p className="mt-1 text-sm">{normalizedError}</p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleBack}
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft size={15} />
                    Quay lại
                </button>
            </Card>
        );
    }

    return (
        <section className="space-y-4">

            <PracticeResultSummaryCard
                attemptDetail={result}
                questions={Array.isArray(result?.questions) ? result.questions : []}
            />
        </section>
    );
};

export default memo(ExamPracticeResultPage);
