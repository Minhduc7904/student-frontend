import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getRemainingTime,
    selectRemainingTime,
    selectRemainingTimeLoading,
    selectRemainingTimeError
} from '../store/doCompetitionSlice';

/**
 * Parse time string "HH:MM:SS" or "MM:SS" to total seconds
 */
const parseTimeString = (timeStr) => {
    if (!timeStr) return 0;
    
    const parts = timeStr.split(':').map(Number);
    
    if (parts.length === 3) {
        // HH:MM:SS
        const [hours, minutes, seconds] = parts;
        return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
        // MM:SS
        const [minutes, seconds] = parts;
        return minutes * 60 + seconds;
    }
    
    return 0;
};

/**
 * Format seconds to HH:MM:SS or MM:SS
 */
const formatSeconds = (totalSeconds) => {
    if (totalSeconds <= 0) return '00:00';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        // HH:MM:SS format
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        // MM:SS format
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
};

/**
 * Custom Hook: useCompetitionTimer
 * Fetch API 1 lần và countdown trên client
 */

export const useCompetitionTimer = (submitId, options = {}) => {
    const {
        autoStart = true,
        onTimeUp = null,
        onError = null,
    } = options;

    const dispatch = useDispatch();
    const timeData = useSelector(selectRemainingTime);
    const loading = useSelector(selectRemainingTimeLoading);
    const error = useSelector(selectRemainingTimeError);

    const hasCalledTimeUpRef = useRef(false);
    const countdownIntervalRef = useRef(null);
    
    // Client-side countdown state (in seconds)
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    /**
     * Fetch remaining time
     */
    const fetchTime = useCallback(async () => {
        if (!submitId) return;

        try {
            const result = await dispatch(getRemainingTime(submitId)).unwrap();
            const data = result?.data;

            // Update countdown với thời gian từ server (parse từ formattedRemaining)
            if (data?.formattedRemaining) {
                const seconds = parseTimeString(data.formattedRemaining);
                setRemainingSeconds(seconds);
            }

            if (data?.isOverTime && !hasCalledTimeUpRef.current) {
                hasCalledTimeUpRef.current = true;
                onTimeUp?.(data);
            }

            return data;
        } catch (err) {
            onError?.(err);
            throw err;
        }
    }, [submitId, dispatch]);

    /**
     * Manual refresh
     */
    const refresh = useCallback(() => {
        return fetchTime();
    }, [fetchTime]);

    /**
     * Chỉ fetch 1 lần khi mount hoặc submitId thay đổi
     */
    useEffect(() => {
        if (!submitId || !autoStart) return;

        fetchTime();
    }, [submitId, autoStart, fetchTime]);

    /**
     * Client-side countdown (giảm mỗi giây)
     */
    useEffect(() => {
        // Chỉ countdown khi có remainingSeconds > 0
        if (remainingSeconds <= 0) {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            return;
        }

        // Start countdown
        countdownIntervalRef.current = setInterval(() => {
            setRemainingSeconds((prev) => {
                const newValue = prev - 1;
                
                // Check if time is up
                if (newValue <= 0 && !hasCalledTimeUpRef.current) {
                    hasCalledTimeUpRef.current = true;
                    if (onTimeUp) {
                        onTimeUp({ ...timeData, isOverTime: true });
                    }
                    return 0;
                }
                
                return newValue;
            });
        }, 1000);

        // Cleanup
        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        };
    }, [remainingSeconds, onTimeUp, timeData]);

    /**
     * Derived state
     */
    const isOverTime = remainingSeconds <= 0 || Boolean(timeData?.isOverTime);
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    const formattedTime = formatSeconds(remainingSeconds);
    const totalMinutes = timeData?.totalMinutes ?? 0;
    const elapsedMinutes = timeData?.elapsedMinutes ?? 0;

    return {
        // Raw
        timeData,

        // Status
        loading,
        error,

        // Derived (with client-side countdown)
        isOverTime,
        remainingMinutes,
        formattedTime,
        totalMinutes,
        elapsedMinutes,
        remainingSeconds,

        // Control
        refresh,
    };
};

export default useCompetitionTimer;