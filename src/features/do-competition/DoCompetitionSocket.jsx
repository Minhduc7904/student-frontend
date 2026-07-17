import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    selectCompetition,
    selectFinishSubmitError,
    selectFinishSubmitLoading,
    selectFinishSubmitResult,
    selectSections,
    selectSocketConnection,
    selectSocketTimeIsOver,
    selectSocketRemainingSeconds,
    selectSocketTimeInitialized,
    selectSocketTimeSyncVersion,
    selectTotalErrors,
    selectUnassignedQuestions,
    resetCompetitionAttemptState,
} from './store/doCompetitionSlice';
import { useCompetitionSocket } from './hooks/useCompetitionSocket';
import { navigateToCompetitionResult } from './utils/attemptResultNavigation';
import CompetitionQuestionControls from './competition-room/CompetitionQuestionControls';
import CompetitionQuestionList from './competition-room/CompetitionQuestionList';
import CompetitionQuestionNavigator from './competition-room/CompetitionQuestionNavigator';
import CompetitionQuestionPanel from './competition-room/CompetitionQuestionPanel';
import CompetitionRoomHeader from './competition-room/CompetitionRoomHeader';
import CompetitionSettingsPopover from './competition-room/CompetitionSettingsPopover';
import CompetitionSubmitModal from './competition-room/CompetitionSubmitModal';
import { flattenCompetitionQuestions, formatCompetitionTime, getCompetitionQuestionGroups, getQuestionSyncState } from './competition-room/questionUtils';

export const DoCompetitionSocket = ({ isHomeworkCompetition = false }) => {
    const { competitionId, submitId, courseId, lessonId, learningItemId, homeworkContentId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const competition = useSelector(selectCompetition);
    const sections = useSelector(selectSections);
    const unassignedQuestions = useSelector(selectUnassignedQuestions);
    const connection = useSelector(selectSocketConnection);
    const remainingSeconds = useSelector(selectSocketRemainingSeconds);
    const timeInitialized = useSelector(selectSocketTimeInitialized);
    const timeSyncVersion = useSelector(selectSocketTimeSyncVersion);
    const timeIsOver = useSelector(selectSocketTimeIsOver);
    const finishLoading = useSelector(selectFinishSubmitLoading);
    const finishError = useSelector(selectFinishSubmitError);
    const finishResult = useSelector(selectFinishSubmitResult);
    const totalErrors = useSelector(selectTotalErrors);
    const resetAndNavigateToResult = useCallback((resultSubmitId = submitId) => {
        dispatch(resetCompetitionAttemptState());
        navigateToCompetitionResult({
            navigate,
            isHomeworkCompetition,
            courseId,
            lessonId,
            learningItemId,
            competitionId,
            submitId: resultSubmitId,
        });
    }, [competitionId, courseId, dispatch, isHomeworkCompetition, learningItemId, lessonId, navigate, submitId]);
    const handleFinishError = useCallback((payload) => {
        resetAndNavigateToResult(payload?.result?.competitionSubmitId ?? payload?.competitionSubmitId ?? submitId);
    }, [resetAndNavigateToResult, submitId]);
    const { saveAnswer, retryAnswer, flushPending, finishAttempt, requestTimeSync } = useCompetitionSocket({
        competitionId,
        submitId,
        onFinishError: handleFinishError,
    });

    const questionGroups = useMemo(() => getCompetitionQuestionGroups(sections, unassignedQuestions), [sections, unassignedQuestions]);
    const questions = useMemo(() => flattenCompetitionQuestions(sections, unassignedQuestions), [sections, unassignedQuestions]);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [flaggedIds, setFlaggedIds] = useState(() => new Set());
    const [navigatorOpen, setNavigatorOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [preferences, setPreferences] = useState({ theme: 'light', fontScale: 1, viewMode: 'single' });
    const autoSubmitStartedRef = useRef(false);
    const autoSubmitTimeSyncVersionRef = useRef(null);
    const isDark = preferences.theme === 'dark';

    useEffect(() => {
        if (!currentQuestionId && questions[0]?.question.questionId) setCurrentQuestionId(questions[0].question.questionId);
    }, [currentQuestionId, questions]);

    const currentIndex = questions.findIndex(({ question }) => question.questionId === currentQuestionId);
    const currentItem = questions[currentIndex] ?? questions[0];
    const savedCount = questions.filter(({ question }) => getQuestionSyncState(question) === 'saved').length;
    const pendingCount = questions.filter(({ question }) => getQuestionSyncState(question) === 'pending').length;

    const selectQuestion = useCallback((questionId) => {
        setCurrentQuestionId(questionId);
        setNavigatorOpen(false);
        window.requestAnimationFrame(() => {
            if (preferences.viewMode === 'list') {
                document.getElementById(`competition-question-${questionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }, [preferences.viewMode]);

    const toggleFlag = useCallback((questionId) => {
        if (!questionId) return;
        setFlaggedIds((previous) => {
            const next = new Set(previous);
            if (next.has(questionId)) next.delete(questionId);
            else next.add(questionId);
            return next;
        });
    }, []);

    const handleAnswer = useCallback((item, change) => {
        if (!item) return;
        const { question } = item;
        const answer = question.answer ?? {};
        let body;

        if (change.type === 'SINGLE_CHOICE') body = { selectedStatementIds: [change.statementId] };
        else if (change.type === 'MULTIPLE_CHOICE') {
            const selected = answer.selectedStatementIds ?? [];
            body = { selectedStatementIds: selected.includes(change.statementId) ? selected.filter((id) => id !== change.statementId) : [...selected, change.statementId] };
        } else if (change.type === 'TRUE_FALSE') {
            const values = (answer.trueFalseAnswers ?? []).filter((entry) => entry.statementId !== change.statementId);
            values.push({ statementId: change.statementId, isTrue: change.isTrue });
            body = { trueFalseAnswers: values };
        } else body = { answer: change.answer ?? '' };

        saveAnswer({
            questionId: question.questionId,
            answerId: answer.competitionAnswerId ?? answer.answerId ?? 0,
            body,
        });
    }, [saveAnswer]);

    const confirmSubmit = useCallback(async () => {
        setSubmitError('');
        const flushResult = await flushPending();
        if (!flushResult.ok) {
            setSubmitError(flushResult.reason);
            return;
        }
        finishAttempt(isHomeworkCompetition ? homeworkContentId : undefined);
    }, [finishAttempt, flushPending, homeworkContentId, isHomeworkCompetition]);

    useEffect(() => {
        if (!finishResult?.competitionSubmitId || String(finishResult.competitionSubmitId) !== String(submitId)) return;
        resetAndNavigateToResult(finishResult.competitionSubmitId);
    }, [finishResult, resetAndNavigateToResult, submitId]);

    useEffect(() => {
        if (!timeInitialized || !questions.length || autoSubmitStartedRef.current) return;
        if (remainingSeconds > 0) {
            autoSubmitTimeSyncVersionRef.current = null;
            return;
        }

        if (autoSubmitTimeSyncVersionRef.current === null) {
            autoSubmitTimeSyncVersionRef.current = timeSyncVersion;
            console.info('[Competition auto submit] Countdown reached zero; requesting final time sync', { submitId, timeSyncVersion });
            const requested = requestTimeSync();
            if (!requested) console.warn('[Competition auto submit] Final time sync was not emitted because the socket is disconnected');
            return;
        }

        if (timeSyncVersion <= autoSubmitTimeSyncVersionRef.current) return;
        console.info('[Competition auto submit] Final time sync received', { submitId, timeSyncVersion, remainingSeconds, timeIsOver });
        if (!timeIsOver) {
            console.info('[Competition auto submit] Server reports that the attempt is still active; auto submit cancelled');
            return;
        }

        autoSubmitStartedRef.current = true;
        const submitExpiredAttempt = async () => {
            console.info('[Competition auto submit] Flushing pending answers before submit', { submitId });
            const flushResult = await flushPending();
            if (!flushResult.ok) {
                console.error('[Competition auto submit] Pending answers could not be saved', flushResult);
                setSubmitError(flushResult.reason);
                return;
            }
            console.info('[Competition auto submit] Pending answers flushed; emitting finish attempt', { submitId });
            finishAttempt(isHomeworkCompetition ? homeworkContentId : undefined);
        };

        submitExpiredAttempt();
    }, [finishAttempt, flushPending, homeworkContentId, isHomeworkCompetition, questions.length, remainingSeconds, requestTimeSync, timeInitialized, timeIsOver, timeSyncVersion]);

    const pageTheme = isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-blue-50/60 text-blue-950';
    const surface = isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-blue-100 bg-white text-blue-950';

    if (!currentItem) return <div className={`min-h-dvh ${pageTheme}`}><CompetitionRoomHeader title="Đang kết nối phòng thi" remainingTime="--:--" connected={connection === 'connected'} theme={preferences.theme} onOpenNavigator={() => setNavigatorOpen(true)} onOpenSettings={() => setSettingsOpen(true)} onSubmit={() => setSubmitModalOpen(true)} /><main className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-5 text-center"><div className={`rounded-2xl border p-7 shadow-sm ${surface}`}><WifiOff className="mx-auto text-blue-700 dark:text-blue-300" size={30} /><h2 className="mt-4 text-lg font-bold">Đang tải đề và bài làm của bạn</h2><p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Hệ thống sẽ tự đồng bộ lại ngay khi kết nối ổn định.</p></div></main></div>;

    const progressWidth = questions.length ? (savedCount / questions.length) * 100 : 0;

    return <div className={`min-h-dvh ${pageTheme}`}><CompetitionRoomHeader title={competition?.title ?? competition?.name} remainingTime={formatCompetitionTime(remainingSeconds)} connected={connection === 'connected'} theme={preferences.theme} onOpenNavigator={() => setNavigatorOpen(true)} onOpenSettings={() => setSettingsOpen(true)} onSubmit={() => setSubmitModalOpen(true)} />
        <main className="mx-auto grid max-w-[1440px] gap-5 px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:px-7">
            <section className="min-w-0">
                {preferences.viewMode === 'single' ? <><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{currentItem.sectionName} · Câu {currentItem.number}/{currentItem.totalInSection}</p><div className={`h-2 min-w-40 flex-1 overflow-hidden rounded-full sm:max-w-xs ${isDark ? 'bg-slate-800' : 'bg-blue-100'}`}><div className="h-full rounded-full bg-blue-800 transition-[width] duration-300" style={{ width: `${progressWidth}%` }} /></div><p className="text-sm font-bold text-blue-700 dark:text-blue-300">{savedCount}/{questions.length} đã lưu</p></div><CompetitionQuestionPanel item={currentItem} onAnswer={(change) => handleAnswer(currentItem, change)} onRetry={() => retryAnswer(currentItem.question.questionId)} onToggleFlag={() => toggleFlag(currentItem.question.questionId)} isFlagged={flaggedIds.has(currentItem.question.questionId)} theme={preferences.theme} fontScale={preferences.fontScale} /><CompetitionQuestionControls hasPrevious={currentIndex > 0} hasNext={currentIndex < questions.length - 1} onPrevious={() => selectQuestion(questions[Math.max(0, currentIndex - 1)]?.question.questionId)} onNext={() => selectQuestion(questions[Math.min(questions.length - 1, currentIndex + 1)]?.question.questionId)} onSubmit={() => setSubmitModalOpen(true)} theme={preferences.theme} /></> : <CompetitionQuestionList groups={questionGroups} currentQuestionId={currentQuestionId} flaggedIds={flaggedIds} onAnswer={handleAnswer} onRetry={retryAnswer} onToggleFlag={toggleFlag} onSubmit={() => setSubmitModalOpen(true)} theme={preferences.theme} fontScale={preferences.fontScale} />}
            </section>
            <CompetitionQuestionNavigator groups={questionGroups} currentQuestionId={currentItem.question.questionId} flaggedIds={flaggedIds} onSelect={selectQuestion} onToggleFlag={toggleFlag} onSubmit={() => setSubmitModalOpen(true)} onClose={() => setNavigatorOpen(false)} mobileOpen={navigatorOpen} theme={preferences.theme} />
        </main>
        {settingsOpen ? <CompetitionSettingsPopover preferences={preferences} onChange={(changes) => setPreferences((current) => ({ ...current, ...changes }))} onClose={() => setSettingsOpen(false)} /> : null}
        <CompetitionSubmitModal open={submitModalOpen} total={questions.length} saved={savedCount} errors={totalErrors} pending={pendingCount} loading={finishLoading} error={submitError || finishError} onCancel={() => { setSubmitModalOpen(false); setSubmitError(''); }} onConfirm={confirmSubmit} theme={preferences.theme} />
    </div>;
};

export default DoCompetitionSocket;
