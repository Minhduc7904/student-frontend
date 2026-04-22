import { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OngDocSach1 from '../../../assets/images/OngDocSach1.png';
import { Pagination } from '../../../shared/components/pagination';
import PracticeByChapterQuestionCard from '../by-chapter/component/question-cards/PracticeByChapterQuestionCard';
import RedoWrongStatsSidebar from './component/RedoWrongStatsSidebar';
import {
    fetchRedoWrongQuestions,
    fetchRedoWrongStatistics,
    selectRedoWrongQuestions,
    selectRedoWrongQuestionsPagination,
    selectRedoWrongLoadingQuestions,
    selectRedoWrongQuestionsError,
    selectRedoWrongStatistics,
    selectRedoWrongStatisticsLoading,
    selectRedoWrongStatisticsError,
} from './store';

const RedoWrongQuestionsPage = () => {
    const dispatch = useDispatch();

    const questions = useSelector(selectRedoWrongQuestions);
    const questionsPagination = useSelector(selectRedoWrongQuestionsPagination);
    const loadingQuestions = useSelector(selectRedoWrongLoadingQuestions);
    const questionsError = useSelector(selectRedoWrongQuestionsError);

    const statistics = useSelector(selectRedoWrongStatistics);
    const statisticsLoading = useSelector(selectRedoWrongStatisticsLoading);
    const statisticsError = useSelector(selectRedoWrongStatisticsError);

    const isInitialQuestionsLoading = loadingQuestions && questions.length === 0;

    // Fetch questions and statistics on mount
    useEffect(() => {
        dispatch(fetchRedoWrongQuestions({ page: 1, limit: 10 }));
        dispatch(fetchRedoWrongStatistics());
    }, [dispatch]);

    const handleQuestionsPageChange = useCallback(
        (nextPage) => {
            if (loadingQuestions) return;

            const normalizedPage = Number(nextPage) || 1;
            if (normalizedPage === (questionsPagination?.page || 1)) return;

            dispatch(
                fetchRedoWrongQuestions({
                    page: normalizedPage,
                    limit: questionsPagination?.limit || 10,
                })
            );
        },
        [dispatch, loadingQuestions, questionsPagination?.page, questionsPagination?.limit]
    );

    return (
        <section className="w-full py-1">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
                {/* ── Stats Sidebar ── */}
                <aside className="lg:self-start">
                    <RedoWrongStatsSidebar
                        statistics={statistics}
                        statisticsLoading={statisticsLoading}
                        statisticsError={statisticsError}
                        onRetry={() => dispatch(fetchRedoWrongStatistics())}
                    />
                </aside>

                {/* ── Questions Panel ── */}
                <div className="rounded-3xl border border-pink-100 bg-white p-4 md:p-6">
                    <div className="flex items-start gap-4">
                        <img
                            src={OngDocSach1}
                            alt="Làm lại câu sai"
                            className="hidden h-16 w-16 shrink-0 object-contain lg:block"
                        />
                        <div>
                            <p className="text-h2 text-pink-800">Làm lại câu sai</p>
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
                                Tập trung xử lý điểm yếu bằng cách làm lại các câu hỏi bạn đã trả lời sai.
                                Xem thống kê ở bên trái để nắm rõ tình hình học tập.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-base font-semibold text-slate-900">Danh sách câu hỏi đã trả lời</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Hiển thị tất cả câu trả lời của bạn.
                                </p>
                            </div>
                            <p className="text-xs font-medium text-slate-500">
                                Tổng: {questionsPagination?.total ?? questions.length} câu
                            </p>
                        </div>

                        {isInitialQuestionsLoading ? (
                            <div className="mt-4 space-y-3">
                                <div className="h-24 animate-pulse rounded-xl bg-slate-200/70" />
                                <div className="h-24 animate-pulse rounded-xl bg-slate-200/70" />
                            </div>
                        ) : null}

                        {!isInitialQuestionsLoading && questionsError ? (
                            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                                <p>{questionsError}</p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(
                                            fetchRedoWrongQuestions({
                                                page: questionsPagination?.page || 1,
                                                limit: questionsPagination?.limit || 10,
                                            })
                                        )
                                    }
                                    className="mt-2 cursor-pointer rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white"
                                >
                                    Tải lại
                                </button>
                            </div>
                        ) : null}

                        {!isInitialQuestionsLoading && !questionsError && questions.length === 0 ? (
                            <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-white px-3 py-3 text-sm text-slate-500">
                                Không có câu sai nào.
                            </div>
                        ) : null}

                        {!isInitialQuestionsLoading && !questionsError && questions.length > 0 ? (
                            <>
                                <div className="mt-4 space-y-3">
                                    {questions.map((question, index) => {
                                        const absoluteIndex =
                                            ((questionsPagination?.page || 1) - 1) *
                                            (questionsPagination?.limit || 10) +
                                            index;

                                        return (
                                            <PracticeByChapterQuestionCard
                                                key={question.questionId || `question-${absoluteIndex + 1}`}
                                                question={question}
                                                index={absoluteIndex}
                                            />
                                        );
                                    })}
                                </div>

                                <Pagination
                                    className="mt-4"
                                    currentPage={questionsPagination?.page || 1}
                                    totalPages={Math.max(1, questionsPagination?.totalPages || 1)}
                                    onPageChange={handleQuestionsPageChange}
                                    disabled={loadingQuestions}
                                />
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(RedoWrongQuestionsPage);
