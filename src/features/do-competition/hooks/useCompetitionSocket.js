import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SOCKET_EVENTS } from '../../../core/constants/socketEvents';
import { socketService } from '../../../core/services/socket/socket.service';
import {
    selectSocketRemainingSeconds,
    socketAnswerChanged,
    socketAnswerFailed,
    socketAnswerSaved,
    socketAttemptSubscribed,
    socketConnectionChanged,
    socketExamLoaded,
    socketFinishFailed,
    socketFinishStarted,
    socketFinishSucceeded,
    socketTickTime,
    socketTimeSynced,
} from '../store/doCompetitionSlice';

const SAVE_DEBOUNCE_MS = 650;
const SAVE_TIMEOUT_MS = 8000;

const logAnswerSaveFailure = ({ source, entry, payload }) => {
    console.error('[Competition answer sync failed]', {
        source,
        questionId: entry.questionId,
        revision: entry.sentRevision ?? entry.revision,
        submitId: entry.submitId,
        payload,
    });
};

export const useCompetitionSocket = ({ competitionId, submitId, onFinishError }) => {
    const dispatch = useDispatch();
    const remainingSeconds = useSelector(selectSocketRemainingSeconds);
    const queuedAnswersRef = useRef(new Map());
    const activeSaveRef = useRef(null);
    const mountedRef = useRef(true);

    const requestTimeSync = useCallback(() => {
        const socket = socketService.socket;
        if (!socket?.connected) return false;

        console.info('[Competition timer] Request time sync', { submitId: Number(submitId) });
        socket.emit(SOCKET_EVENTS.COMPETITION.TIME_GET, { submitId: Number(submitId) });
        return true;
    }, [submitId]);

    const synchronizeAttempt = useCallback(() => {
        const socket = socketService.socket;
        if (!socket?.connected) return false;

        socket.emit(SOCKET_EVENTS.COMPETITION.ATTEMPT_SUBSCRIBE, { submitId: Number(submitId) });
        socket.emit(SOCKET_EVENTS.COMPETITION.EXAM_GET, { competitionId: Number(competitionId) });
        requestTimeSync();
        return true;
    }, [competitionId, requestTimeSync, submitId]);

    const sendNext = useCallback(() => {
        if (activeSaveRef.current) return;
        const next = [...queuedAnswersRef.current.values()].find((entry) => !entry.inFlight && !entry.errored);
        const socket = socketService.socket;
        if (!next || !socket?.connected) return;

        next.inFlight = true;
        next.sentRevision = next.revision;
        activeSaveRef.current = next;
        socket.emit(SOCKET_EVENTS.COMPETITION.ANSWER_SAVE, {
            submitId: Number(submitId),
            answerId: next.answerId ?? 0,
            ...next.body,
        });
        next.timeout = window.setTimeout(() => {
            if (activeSaveRef.current !== next) return;
            logAnswerSaveFailure({
                source: 'timeout_waiting_for_answer_saved',
                entry: { ...next, submitId: Number(submitId) },
            });
            activeSaveRef.current = null;
            next.inFlight = false;
            next.errored = true;
            dispatch(socketAnswerFailed({ questionId: next.questionId, revision: next.sentRevision }));
        }, SAVE_TIMEOUT_MS);
    }, [dispatch, submitId]);

    const saveAnswer = useCallback(({ questionId, answerId, body }) => {
        const previous = queuedAnswersRef.current.get(questionId);
        const revision = (previous?.revision ?? 0) + 1;
        const entry = previous ?? { questionId, revision, body, answerId, inFlight: false, errored: false };

        if (entry.timer) window.clearTimeout(entry.timer);
        entry.revision = revision;
        entry.body = body;
        entry.answerId = answerId;
        entry.errored = false;
        queuedAnswersRef.current.set(questionId, entry);
        dispatch(socketAnswerChanged({ questionId, body, revision }));

        entry.timer = window.setTimeout(() => {
            entry.timer = null;
            sendNext();
        }, SAVE_DEBOUNCE_MS);
    }, [dispatch, sendNext]);

    const handleAnswerSaved = useCallback((payload) => {
        const active = activeSaveRef.current;
        if (!active) return;
        if (active.timeout) window.clearTimeout(active.timeout);
        active.timeout = null;
        activeSaveRef.current = null;
        active.inFlight = false;

        const answer = payload?.answer ?? payload?.data ?? {};
        dispatch(socketAnswerSaved({ questionId: active.questionId, answer, revision: active.sentRevision }));
        if (active.revision === active.sentRevision) queuedAnswersRef.current.delete(active.questionId);
        window.setTimeout(sendNext, 0);
    }, [dispatch, sendNext]);

    const handleSaveError = useCallback((payload) => {
        const active = activeSaveRef.current;
        if (!active) return;
        logAnswerSaveFailure({
            source: 'socket_error_event',
            entry: { ...active, submitId: Number(submitId) },
            payload,
        });
        if (active.timeout) window.clearTimeout(active.timeout);
        active.timeout = null;
        activeSaveRef.current = null;
        active.inFlight = false;

        if (active.revision === active.sentRevision) {
            active.errored = true;
            dispatch(socketAnswerFailed({ questionId: active.questionId, revision: active.sentRevision }));
            return;
        }
        window.setTimeout(sendNext, 0);
    }, [dispatch, sendNext, submitId]);

    const retryAnswer = useCallback((questionId) => {
        const entry = queuedAnswersRef.current.get(questionId);
        if (!entry) return;
        entry.errored = false;
        sendNext();
    }, [sendNext]);

    const flushPending = useCallback(async () => {
        [...queuedAnswersRef.current.values()].forEach((entry) => {
            if (entry.timer) {
                window.clearTimeout(entry.timer);
                entry.timer = null;
            }
        });
        sendNext();

        const startedAt = Date.now();
        while (queuedAnswersRef.current.size) {
            if ([...queuedAnswersRef.current.values()].some((entry) => entry.errored)) {
                return { ok: false, reason: 'Một hoặc nhiều câu trả lời chưa được lưu.' };
            }
            if (Date.now() - startedAt > SAVE_TIMEOUT_MS + 1000) {
                return { ok: false, reason: 'Hệ thống chưa xác nhận lưu đáp án. Vui lòng kiểm tra kết nối.' };
            }
            sendNext();
            await new Promise((resolve) => window.setTimeout(resolve, 80));
        }
        return { ok: true };
    }, [sendNext]);

    const finishAttempt = useCallback((homeworkContentId) => {
        const socket = socketService.socket;
        if (!socket?.connected) {
            console.error('[Competition submit] Cannot emit finish attempt: socket disconnected', { submitId });
            dispatch(socketFinishFailed('Mất kết nối với máy chủ. Chưa thể nộp bài.'));
            return false;
        }
        dispatch(socketFinishStarted());
        const finishPayload = {
            submitId: Number(submitId),
            ...(homeworkContentId ? { homeworkContentId: Number(homeworkContentId) } : {}),
        };
        console.info('[Competition submit] Emit finish attempt', finishPayload);
        socket.emit(SOCKET_EVENTS.COMPETITION.ATTEMPT_FINISH, finishPayload);
        return true;
    }, [dispatch, submitId]);

    useEffect(() => {
        mountedRef.current = true;
        let retryTimer;
        let detach = () => {};

        const attach = () => {
            const socket = socketService.socket;
            if (!mountedRef.current) return;
            if (!socket) {
                retryTimer = window.setTimeout(attach, 200);
                return;
            }
            const handleConnect = () => {
                dispatch(socketConnectionChanged('connected'));
                synchronizeAttempt();
                window.setTimeout(sendNext, 0);
            };
            const handleDisconnect = () => dispatch(socketConnectionChanged('disconnected'));
            const handleSubscribed = (payload) => {
                dispatch(socketAttemptSubscribed(payload));
                if (payload?.time) {
                    console.info('[Competition timer] Received time from attempt subscription', payload.time);
                    dispatch(socketTimeSynced(payload.time));
                }
            };
            const handleExamLoaded = (payload) => dispatch(socketExamLoaded(payload?.exam ?? payload));
            const handleTimeSynced = (payload) => {
                const time = payload?.time ?? payload;
                console.info('[Competition timer] Received time sync', time);
                dispatch(socketTimeSynced(time));
            };
            const handleFinished = (payload) => {
                console.info('[Competition submit] Received attempt finished', payload);
                dispatch(socketFinishSucceeded(payload?.result ?? payload));
            };
            const handleError = (payload) => {
                const message = payload?.message ?? 'Không thể đồng bộ bài làm với máy chủ.';
                if (activeSaveRef.current) handleSaveError(payload);
                else {
                    console.error('[Competition submit] Server error', payload);
                    dispatch(socketFinishFailed(message));
                    if (payload?.code === 'ATTEMPT_ALREADY_SUBMITTED') onFinishError?.(payload);
                }
            };

            socket.on('connect', handleConnect);
            socket.on('disconnect', handleDisconnect);
            socket.on('connect_error', handleDisconnect);
            socket.on(SOCKET_EVENTS.COMPETITION.ATTEMPT_SUBSCRIBED, handleSubscribed);
            socket.on(SOCKET_EVENTS.COMPETITION.EXAM_LOADED, handleExamLoaded);
            socket.on(SOCKET_EVENTS.COMPETITION.TIME_SYNC, handleTimeSynced);
            socket.on(SOCKET_EVENTS.COMPETITION.ANSWER_SAVED, handleAnswerSaved);
            socket.on(SOCKET_EVENTS.COMPETITION.ATTEMPT_FINISHED, handleFinished);
            socket.on('error', handleError);

            if (socket.connected) handleConnect();

            detach = () => {
                socket.off('connect', handleConnect);
                socket.off('disconnect', handleDisconnect);
                socket.off('connect_error', handleDisconnect);
                socket.off(SOCKET_EVENTS.COMPETITION.ATTEMPT_SUBSCRIBED, handleSubscribed);
                socket.off(SOCKET_EVENTS.COMPETITION.EXAM_LOADED, handleExamLoaded);
                socket.off(SOCKET_EVENTS.COMPETITION.TIME_SYNC, handleTimeSynced);
                socket.off(SOCKET_EVENTS.COMPETITION.ANSWER_SAVED, handleAnswerSaved);
                socket.off(SOCKET_EVENTS.COMPETITION.ATTEMPT_FINISHED, handleFinished);
                socket.off('error', handleError);
            };
        };

        attach();
        return () => {
            mountedRef.current = false;
            window.clearTimeout(retryTimer);
            detach();
        };
    }, [dispatch, handleAnswerSaved, handleSaveError, onFinishError, sendNext, synchronizeAttempt]);

    useEffect(() => {
        if (remainingSeconds <= 0) return undefined;
        const interval = window.setInterval(() => dispatch(socketTickTime()), 1000);
        return () => window.clearInterval(interval);
    }, [dispatch, remainingSeconds]);

    useEffect(() => () => {
        queuedAnswersRef.current.forEach((entry) => {
            if (entry.timer) window.clearTimeout(entry.timer);
            if (entry.timeout) window.clearTimeout(entry.timeout);
        });
    }, []);

    return { saveAnswer, retryAnswer, flushPending, finishAttempt, requestTimeSync, synchronizeAttempt };
};

export default useCompetitionSocket;
