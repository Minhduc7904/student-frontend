import { Suspense, memo, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { List, X } from 'lucide-react';
import { ContentLoading } from '../../../shared/components/loading';
import { AppBreadcrumb } from '../../../shared/components';
import AuthenticatedLayout from '../../../shared/components/layout/AuthenticatedLayout';
import { ROUTES } from '../../../core/constants';
import {
    fetchPublicStudentContinueExams,
    fetchPublicExamTypeCounts,
    fetchSubjects,
    selectContinueExams,
    selectContinueExamsError,
    selectContinueExamsFilters,
    selectContinueExamsLoading,
    selectContinueExamsPagination,
    selectHasFetchedContinueExams,
    selectHasFetchedPublicExamTypeCounts,
    selectHasFetchedSubjects,
} from '../store/examsSlice';
import { getExamTypeLabelById } from '../constants/examTypes';
import { selectExamDetail } from '../detail/store/examDetailSlice';
import {
    selectCurrentPracticeAttemptId,
    selectPracticeAttemptDetail,
    selectPracticeExamContent,
    selectPracticeAttemptLoading,
    selectPracticeSubmitAnswerError,
    selectPracticeSubmitAnswerLoading,
} from '../practice-attempt/store/practiceAttemptSlice';
import { selectPracticeResult } from '../practice-result/store';
import ContinueExamSidebar from './component/ContinueExamSidebar';
import PracticeAttemptSidebar from './component/PracticeAttemptSidebar';

/**
 * ExamsLayout
 * Layout riêng cho module exams, bọc bằng AuthenticatedLayout.
 */
const ExamsLayout = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const continueExams = useSelector(selectContinueExams);
    const continueExamsLoading = useSelector(selectContinueExamsLoading);
    const continueExamsError = useSelector(selectContinueExamsError);
    const continueExamsPagination = useSelector(selectContinueExamsPagination);
    const continueExamsFilters = useSelector(selectContinueExamsFilters);
    const examDetail = useSelector(selectExamDetail);
    const practiceAttemptDetail = useSelector(selectPracticeAttemptDetail);
    const practiceAttemptLoading = useSelector(selectPracticeAttemptLoading);
    const practiceExamContent = useSelector(selectPracticeExamContent);
    const practiceSubmitAnswerLoading = useSelector(selectPracticeSubmitAnswerLoading);
    const practiceSubmitAnswerError = useSelector(selectPracticeSubmitAnswerError);
    const practiceResult = useSelector(selectPracticeResult);
    const currentPracticeAttemptId = useSelector(selectCurrentPracticeAttemptId);
    const hasFetchedPublicTypeCounts = useSelector(selectHasFetchedPublicExamTypeCounts);
    const hasFetchedSubjects = useSelector(selectHasFetchedSubjects);
    const hasFetchedContinueExams = useSelector(selectHasFetchedContinueExams);
    const [isPracticeSidebarOpen, setIsPracticeSidebarOpen] = useState(false);
    const isPracticeAttemptRoute = useMemo(() => {
        const pathParts = location.pathname.split('/').filter(Boolean);
        const examsIndex = pathParts.indexOf('exams');
        const practiceKeyword = examsIndex >= 0 ? pathParts[examsIndex + 5] : null;
        return practiceKeyword === 'practice';
    }, [location.pathname]);

    useEffect(() => {
        if (!hasFetchedPublicTypeCounts) {
            dispatch(fetchPublicExamTypeCounts());
        }
    }, [dispatch, hasFetchedPublicTypeCounts]);

    useEffect(() => {
        if (!hasFetchedSubjects) {
            dispatch(
                fetchSubjects({
                    page: 1,
                    limit: 100,
                    sortBy: 'name',
                    sortOrder: 'asc',
                })
            );
        }
    }, [dispatch, hasFetchedSubjects]);

    useEffect(() => {
        if (isPracticeAttemptRoute) return;

        if (!hasFetchedContinueExams) {
            dispatch(
                fetchPublicStudentContinueExams({
                    page: continueExamsFilters?.page || 1,
                    limit: continueExamsFilters?.limit || 3,
                })
            );
        }
    }, [
        continueExamsFilters?.limit,
        continueExamsFilters?.page,
        dispatch,
        hasFetchedContinueExams,
        isPracticeAttemptRoute,
    ]);

    useEffect(() => {
        setIsPracticeSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleNavigateQuestion = () => {
            setIsPracticeSidebarOpen(false);
        };

        window.addEventListener('practice-attempt:navigate-question', handleNavigateQuestion);

        return () => {
            window.removeEventListener('practice-attempt:navigate-question', handleNavigateQuestion);
        };
    }, []);

    const handleContinueExamsPageChange = (page) => {
        if (isPracticeAttemptRoute) return;

        dispatch(
            fetchPublicStudentContinueExams({
                page,
                limit: continueExamsFilters?.limit || 3,
                examId: continueExamsFilters?.examId || undefined,
            })
        );
    };

    const breadcrumbItems = useMemo(() => {
        const pathParts = location.pathname.split('/').filter(Boolean);
        const examsIndex = pathParts.indexOf('exams');
        const typeSegment = examsIndex >= 0 ? pathParts[examsIndex + 1] : null;
        const idSegment = examsIndex >= 0 ? pathParts[examsIndex + 2] : null;
        const attemptSegment = examsIndex >= 0 ? pathParts[examsIndex + 4] : null;
        const attemptAction = examsIndex >= 0 ? pathParts[examsIndex + 5] : null;
        const isPracticeAttemptRoute = attemptAction === 'practice';
        const isPracticeResultRoute = attemptAction === 'result';
        const isAttemptFlowRoute = isPracticeAttemptRoute || isPracticeResultRoute;
        const examTypeFromResult = practiceResult?.typeOfExam || practiceResult?.examType || practiceResult?.typeExam || null;
        const resolvedTypeSegment = typeSegment || examTypeFromResult;
        const examTypeLabel = resolvedTypeSegment ? getExamTypeLabelById(resolvedTypeSegment) : null;
        const isCurrentAttemptMatch =
            attemptSegment != null && String(currentPracticeAttemptId) === String(attemptSegment);
        const examTitleFromState = location.state?.examTitle;
        const examTitleFromResult = practiceResult?.examTitle || practiceResult?.title;
        const examTitleFromPracticeAttempt = isCurrentAttemptMatch ? practiceAttemptDetail?.examTitle : null;
        const examTitleFromStore = examDetail?.title;
        const examTitle = examTitleFromPracticeAttempt || examTitleFromState || examTitleFromResult || examTitleFromStore;

        const items = [{ label: 'Danh sách đề thi', to: ROUTES.EXAMS }];

        if (examTypeLabel) {
            items.push({ label: examTypeLabel, to: `${ROUTES.EXAMS}/${resolvedTypeSegment}` });
        }

        if (idSegment && examTitle) {
            if (isAttemptFlowRoute && resolvedTypeSegment) {
                items.push({ label: examTitle, to: ROUTES.EXAM_TYPE_DETAIL(resolvedTypeSegment, idSegment) });
            } else {
                items.push({ label: examTitle });
            }
        } else if (idSegment && isAttemptFlowRoute && resolvedTypeSegment) {
            items.push({ label: 'Đề thi', to: ROUTES.EXAM_TYPE_DETAIL(resolvedTypeSegment, idSegment) });
        }

        if (isPracticeAttemptRoute) {
            items.push({ label: 'Luyện tập' });
        }

        if (isPracticeResultRoute) {
            items.push({ label: 'Kết quả' });
        }

        return items;
    }, [
        currentPracticeAttemptId,
        examDetail?.title,
        location.pathname,
        location.state,
        practiceAttemptDetail?.examTitle,
        practiceResult?.examTitle,
        practiceResult?.title,
        practiceResult?.typeExam,
        practiceResult?.examType,
        practiceResult?.typeOfExam,
    ]);

    return (
        <AuthenticatedLayout>
            <div className="flex-1 bg-[#F7F8FA]">
                <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-8 xl:px-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <main className="min-w-0">
                            <AppBreadcrumb items={breadcrumbItems} />

                            <Suspense fallback={<ContentLoading />}>
                                <Outlet />
                            </Suspense>
                        </main>

                        {isPracticeAttemptRoute ? (
                            <div className="hidden lg:block">
                                <PracticeAttemptSidebar
                                    attemptDetail={practiceAttemptDetail}
                                    attemptId={currentPracticeAttemptId}
                                    loading={practiceAttemptLoading}
                                    examContent={practiceExamContent}
                                    submitAnswerLoading={practiceSubmitAnswerLoading}
                                    submitAnswerError={practiceSubmitAnswerError}
                                />
                            </div>
                        ) : (
                            <ContinueExamSidebar
                                attempts={Array.isArray(continueExams) ? continueExams : []}
                                pagination={continueExamsPagination}
                                loading={continueExamsLoading}
                                error={continueExamsError}
                                onPageChange={handleContinueExamsPageChange}
                            />
                        )}
                    </div>
                </div>

                {isPracticeAttemptRoute ? (
                    <>
                        <button
                            type="button"
                            onClick={() => setIsPracticeSidebarOpen(true)}
                            className="fixed bottom-5 right-4 z-50 inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 p-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700 lg:hidden"
                        >
                            <List size={16} />
                        </button>

                        <div className={`fixed inset-0 z-70 lg:hidden ${isPracticeSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                            <div
                                role="presentation"
                                onClick={() => setIsPracticeSidebarOpen(false)}
                                className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-300 ${isPracticeSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                            />

                            <div className={`absolute inset-y-0 right-0 w-full bg-[#F7F8FA] transition-transform duration-300 ${isPracticeSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                                    <p className="text-sm font-semibold text-slate-900">Sidebar luyện tập</p>
                                    <button
                                        type="button"
                                        onClick={() => setIsPracticeSidebarOpen(false)}
                                        className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-300 p-2 text-slate-700 transition-colors hover:bg-slate-50"
                                        aria-label="Đóng sidebar"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="h-[calc(100vh-57px)] overflow-y-auto px-4 py-4">
                                    <PracticeAttemptSidebar
                                        attemptDetail={practiceAttemptDetail}
                                        attemptId={currentPracticeAttemptId}
                                        loading={practiceAttemptLoading}
                                        examContent={practiceExamContent}
                                        submitAnswerLoading={practiceSubmitAnswerLoading}
                                        submitAnswerError={practiceSubmitAnswerError}
                                        asideClassName="h-full"
                                        questionListClassName="max-h-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </AuthenticatedLayout>
    );
};

export default memo(ExamsLayout);
