import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import QuestionDetailQuestionCard from './component/question-cards/QuestionDetailQuestionCard';
import {
    clearQuestionDetailState,
    fetchPublicStudentQuestionDetail,
    fetchPublicStudentQuestionRelated,
    selectQuestionDetail,
    selectQuestionDetailError,
    selectQuestionDetailLoadingDetail,
    selectQuestionDetailLoadingRelated,
    selectQuestionDetailRelatedError,
    selectQuestionDetailRelatedQuestions,
} from './store';

const QuestionDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { questionId } = useParams();

    const questionDetail = useSelector(selectQuestionDetail);
    const relatedQuestions = useSelector(selectQuestionDetailRelatedQuestions);
    const loadingDetail = useSelector(selectQuestionDetailLoadingDetail);
    const detailError = useSelector(selectQuestionDetailError);
    const loadingRelated = useSelector(selectQuestionDetailLoadingRelated);
    const relatedError = useSelector(selectQuestionDetailRelatedError);

    useEffect(() => {
        if (!questionId) return;

        dispatch(fetchPublicStudentQuestionDetail(questionId));
        dispatch(fetchPublicStudentQuestionRelated({ questionId, limit: 8 }));

        return () => {
            dispatch(clearQuestionDetailState());
        };
    }, [dispatch, questionId]);

    const handleOpenQuestion = (nextQuestionId) => {
        if (!nextQuestionId) return;
        navigate(ROUTES.PRACTICE_QUESTION_DETAIL(nextQuestionId));
    };

    return (
        <section className="w-full py-1">
            <div className="rounded-3xl border border-blue-100 bg-white p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-h2 text-blue-800">Chi tiết câu hỏi</p>
                        <p className="mt-1 text-sm text-gray-600">
                            Luyện tập trực tiếp và xem thêm câu hỏi liên quan.
                        </p>
                    </div>

                    {questionId ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            Mã câu hỏi: {questionId}
                        </span>
                    ) : null}
                </div>

                {loadingDetail ? (
                    <div className="mt-4 space-y-3">
                        <div className="h-24 animate-pulse rounded-xl bg-slate-200/70" />
                    </div>
                ) : null}

                {!loadingDetail && detailError ? (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                        <p>{detailError}</p>
                        <button
                            type="button"
                            onClick={() => questionId && dispatch(fetchPublicStudentQuestionDetail(questionId))}
                            className="mt-2 cursor-pointer rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : null}

                {!loadingDetail && !detailError && questionDetail ? (
                    <div className="mt-4">
                        <QuestionDetailQuestionCard question={questionDetail} index={0} />
                    </div>
                ) : null}

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                        <div>
                            <p className="text-base font-semibold text-slate-900">Câu hỏi liên quan</p>
                            <p className="mt-1 text-xs text-slate-500">
                                Gợi ý thêm nội dung để bạn luyện tập tiếp.
                            </p>
                        </div>
                        <p className="text-xs font-medium text-slate-500">Tổng: {relatedQuestions.length} câu</p>
                    </div>

                    {loadingRelated ? (
                        <div className="mt-3 space-y-2">
                            <div className="h-14 animate-pulse rounded-xl bg-slate-200/70" />
                            <div className="h-14 animate-pulse rounded-xl bg-slate-200/70" />
                        </div>
                    ) : null}

                    {!loadingRelated && relatedError ? (
                        <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                            <p>{relatedError}</p>
                            <button
                                type="button"
                                onClick={() =>
                                    questionId && dispatch(fetchPublicStudentQuestionRelated({ questionId, limit: 8 }))
                                }
                                className="mt-2 cursor-pointer rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : null}

                    {!loadingRelated && !relatedError && relatedQuestions.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">Chưa có câu hỏi liên quan.</p>
                    ) : null}

                    {!loadingRelated && !relatedError && relatedQuestions.length > 0 ? (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                            {relatedQuestions.map((question, index) => (
                                <button
                                    key={question.questionId || `related-question-${index + 1}`}
                                    type="button"
                                    onClick={() => handleOpenQuestion(question.questionId)}
                                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-blue-200 hover:bg-blue-50"
                                >
                                    <p className="line-clamp-2 text-sm text-slate-700">{question.content}</p>
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

export default QuestionDetailPage;
