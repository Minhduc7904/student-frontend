import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import ExamDetailInfoCard from './component/ExamDetailInfoCard';
import ExamHistoryTabContent from './component/ExamHistoryTabContent';
import ExamFullExamTabContent from './component/ExamFullExamTabContent';
import ExamPracticeTabContent from './component/ExamPracticeTabContent';
import ExamDiscussionTabContent from './component/ExamDiscussionTabContent';
import ExamVideoSolutionTabContent from './component/ExamVideoSolutionTabContent';
import ExamQuestionsTabContent from './component/ExamQuestionsTabContent';
import {
    fetchPublicStudentExam,
    fetchPublicStudentExamAttemptsByExamId,
    fetchPublicStudentExamDetail,
    selectCurrentExamContentId,
    selectCurrentExamDetailId,
    selectExamContent,
    selectExamContentError,
    selectExamContentLoading,
    selectExamContentSectionsWithQuestions,
    selectExamDetail,
    selectExamDetailError,
    selectExamDetailLoading,
    selectPublicStudentExamAttempts,
    selectPublicStudentExamAttemptsError,
    selectPublicStudentExamAttemptsLoading,
    selectPublicStudentExamAttemptsPagination,
    selectStartPublicStudentExamAttemptLoading,
    startPublicStudentExamAttempt,
} from './store/examDetailSlice';

const extractYoutubeVideoId = (url = '') => {
    if (!url) return '';

    try {
        const parsed = new URL(url);

        // 👉 youtu.be/abc123
        if (parsed.hostname.includes('youtu.be')) {
            return parsed.pathname.slice(1);
        }

        // 👉 youtube.com/watch?v=abc123
        const v = parsed.searchParams.get('v');
        if (v) return v;

        // 👉 youtube.com/embed/abc123
        if (parsed.pathname.includes('/embed/')) {
            return parsed.pathname.split('/embed/')[1];
        }

        return '';
    } catch {
        return '';
    }
};

const ExamDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { typeexam, id } = useParams();
    const examDetail = useSelector(selectExamDetail);
    const examContent = useSelector(selectExamContent);
    const examContentLoading = useSelector(selectExamContentLoading);
    const examContentError = useSelector(selectExamContentError);
    const sectionsWithQuestions = useSelector(selectExamContentSectionsWithQuestions);
    const loading = useSelector(selectExamDetailLoading);
    const error = useSelector(selectExamDetailError);
    const examAttempts = useSelector(selectPublicStudentExamAttempts);
    const examAttemptsLoading = useSelector(selectPublicStudentExamAttemptsLoading);
    const examAttemptsError = useSelector(selectPublicStudentExamAttemptsError);
    const examAttemptsPagination = useSelector(selectPublicStudentExamAttemptsPagination);
    const startExamAttemptLoading = useSelector(selectStartPublicStudentExamAttemptLoading);
    const currentExamContentId = useSelector(selectCurrentExamContentId);
    const currentExamId = useSelector(selectCurrentExamDetailId);
    const [examModeTab, setExamModeTab] = useState('history');
    const [activeTab, setActiveTab] = useState('discussion');
    const [historyPage, setHistoryPage] = useState(1);

    useEffect(() => {
        if (!id) return;
        if (String(currentExamId) === String(id) && examDetail) return;

        dispatch(fetchPublicStudentExamDetail(id));
    }, [dispatch, id, currentExamId, examDetail]);

    useEffect(() => {
        if (!id) return;
        if (String(currentExamContentId) === String(id) && examContent) return;

        dispatch(fetchPublicStudentExam(id));
    }, [dispatch, id, currentExamContentId, examContent]);

    useEffect(() => {
        if (!id) return;

        setHistoryPage(1);
    }, [id]);

    useEffect(() => {
        if (!id) return;

        dispatch(fetchPublicStudentExamAttemptsByExamId({
            examId: id,
            page: historyPage,
            limit: 10,
        }));
    }, [dispatch, id, historyPage]);

    const title = useMemo(() => {
        if (examDetail?.title) return examDetail.title;
        return `Chi tiết đề thi #${id || '--'}`;
    }, [examDetail, id]);

    const tabItems = useMemo(() => {
        const tabs = [
            { key: 'discussion', label: 'Thảo luận' },
        ];

        if (examDetail?.solutionYoutubeUrl) {
            tabs.push({ key: 'video-solution', label: 'Video chữa' });
        }

        tabs.push({ key: 'questions', label: 'Câu hỏi' });
        return tabs;
    }, [examDetail?.solutionYoutubeUrl]);

    const examModeTabs = useMemo(
        () => [
            { key: 'history', label: 'Lịch sử' },
            { key: 'full-exam', label: 'Làm full đề' },
            { key: 'practice', label: 'Luyện tập' },
        ],
        []
    );

    useEffect(() => {
        if (!tabItems.some((tab) => tab.key === activeTab)) {
            setActiveTab(tabItems[0]?.key || 'discussion');
        }
    }, [activeTab, tabItems]);

    const videoEmbedUrl = useMemo(() => {
        const videoId = extractYoutubeVideoId(examDetail?.solutionYoutubeUrl || '');
        if (!videoId) return '';
        return `https://www.youtube.com/embed/${videoId}`;
    }, [examDetail?.solutionYoutubeUrl]);

    const normalizedExamId = useMemo(() => {
        if (!id) return null;
        const parsed = Number(id);
        return Number.isNaN(parsed) ? id : parsed;
    }, [id]);

    const navigateToPracticeAttempt = (attemptId, attemptExamTitle) => {
        if (!typeexam || !normalizedExamId || !attemptId) return;

        navigate(ROUTES.EXAM_TYPE_ATTEMPT_PRACTICE(typeexam, normalizedExamId, attemptId), {
            state: {
                examTitle: attemptExamTitle || examDetail?.title || `Đề thi #${normalizedExamId}`,
            },
        });
    };

    const handleStartFullExam = async () => {
        if (!normalizedExamId) return;

        const resultAction = await dispatch(startPublicStudentExamAttempt({
            examId: normalizedExamId,
            duration: 90,
        }));

        const payload = resultAction?.payload;
        const isSuccess = resultAction?.meta?.requestStatus === 'fulfilled' && payload?.success === true;
        const attemptId = payload?.data?.attemptId;

        if (isSuccess && attemptId != null) {
            navigateToPracticeAttempt(attemptId, payload?.data?.examTitle);
        }
    };

    const handleStartPractice = async ({ questionIds, duration }) => {
        if (!normalizedExamId) return;

        const resultAction = await dispatch(startPublicStudentExamAttempt({
            examId: normalizedExamId,
            duration,
            questionIds,
        }));

        const payload = resultAction?.payload;
        const isSuccess = resultAction?.meta?.requestStatus === 'fulfilled' && payload?.success === true;
        const attemptId = payload?.data?.attemptId;

        if (isSuccess && attemptId != null) {
            navigateToPracticeAttempt(attemptId, payload?.data?.examTitle);
        }
    };

    const handleContinueAttempt = (attempt) => {
        const attemptId = attempt?.attemptId || attempt?.id;
        if (!attemptId) return;

        navigateToPracticeAttempt(attemptId, attempt?.examTitle);
    };

    const handleViewResultAttempt = (attempt) => {
        const attemptId = attempt?.attemptId || attempt?.id;
        if (!typeexam || !normalizedExamId || !attemptId) return;

        navigate(ROUTES.EXAM_TYPE_ATTEMPT_RESULT(typeexam, normalizedExamId, attemptId), {
            state: {
                examTitle: attempt?.examTitle || examDetail?.title || `Đề thi #${normalizedExamId}`,
            },
        });
    };

    if (loading) {
        return (
            <Card>
                <div className="animate-pulse space-y-3">
                    <div className="h-6 w-48 rounded bg-slate-200" />
                    <div className="h-4 w-80 rounded bg-slate-200" />
                    <div className="h-20 rounded-xl bg-slate-100" />
                </div>
            </Card>
        );
    }

    if (error) {
        const normalizedError = typeof error === 'string' ? error : error?.message || 'Không thể tải chi tiết đề thi.';

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
                    onClick={() => navigate(-1)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft size={15} />
                    Quay lại
                </button>
            </Card>
        );
    }

    return (
        <section className="space-y-4">
            <ExamDetailInfoCard
                title={title}
                examDetail={examDetail}
                id={id}
                typeexam={typeexam}
                onBack={() => navigate(-1)}
            />

            <Card>
                <div className="border-b border-gray-100 px-1 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {examModeTabs.map((tab) => {
                            const isActive = examModeTab === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setExamModeTab(tab.key)}
                                    className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-4">
                    {examModeTab === 'history' ? (
                        <ExamHistoryTabContent
                            attempts={examAttempts}
                            loading={examAttemptsLoading}
                            error={examAttemptsError}
                            pagination={examAttemptsPagination}
                            onPageChange={setHistoryPage}
                            onContinueAttempt={handleContinueAttempt}
                            onViewResult={handleViewResultAttempt}
                        />
                    ) : null}

                    {examModeTab === 'full-exam' ? (
                        <ExamFullExamTabContent
                            onStart={handleStartFullExam}
                            disabled={!normalizedExamId || startExamAttemptLoading}
                            loading={startExamAttemptLoading}
                        />
                    ) : null}

                    {examModeTab === 'practice' ? (
                        <ExamPracticeTabContent
                            examId={normalizedExamId}
                            sectionsWithQuestions={sectionsWithQuestions}
                            onStart={handleStartPractice}
                            isStarting={startExamAttemptLoading}
                        />
                    ) : null}
                </div>
            </Card>


            <Card>
                <div className="border-b border-gray-100 px-1 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {tabItems.map((tab) => {
                            const isActive = activeTab === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-4">
                    {activeTab === 'discussion' ? (
                        <ExamDiscussionTabContent />
                    ) : null}

                    {activeTab === 'video-solution' ? (
                        <ExamVideoSolutionTabContent videoEmbedUrl={videoEmbedUrl} />
                    ) : null}

                    {activeTab === 'questions' ? (
                        <ExamQuestionsTabContent
                            examContentError={examContentError}
                            sectionsWithQuestions={sectionsWithQuestions}
                            examContentLoading={examContentLoading}
                        />
                    ) : null}
                </div>
            </Card>
        </section>
    );
};

export default memo(ExamDetailPage);
