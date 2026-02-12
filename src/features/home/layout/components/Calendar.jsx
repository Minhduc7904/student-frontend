import { memo, useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import SessionList from "./SessionList";
import {
    fetchMySessions,
    selectMySessions,
    selectLoadingMySessions,
} from "../../../class-session/store/classSessionSlice";


// ==================== CONSTANTS ====================
export const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const COLOR_MAP = {
    green: { bg: "bg-green-100", text: "text-green-500" },
    blue: { bg: "bg-blue-100", text: "text-blue-800" },
    red: { bg: "bg-red-100", text: "text-red-500" },
    purple: { bg: "bg-purple-100", text: "text-purple-500" },
};

/**
 * Map session data to calendar format
 */
const mapSessionToCalendarFormat = (session) => {
    const sessionDate = new Date(session.sessionDate);
    const colors = ['green', 'blue', 'red', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return {
        id: session.classSessionId,
        day: sessionDate.getDate(),
        title: session.title || session.class?.name || "Buổi học",
        subject: session.class?.name || "Lớp học",
        deadline: sessionDate.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        color: randomColor,
        sessionData: session, // Giữ lại data gốc nếu cần
    };
};

const Calendar = () => {
    const dispatch = useDispatch();
    const [currentDate, setCurrentDate] = useState(new Date());

    const sessions = useSelector(selectMySessions);
    const loading = useSelector(selectLoadingMySessions);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Fetch sessions khi tháng thay đổi
    useEffect(() => {
        // Ngày đầu tiên trong tháng
        const sessionDateFrom = new Date(year, month, 1).toISOString();
        
        // Ngày cuối cùng trong tháng
        const lastDay = new Date(year, month + 1, 0).getDate();
        const sessionDateTo = new Date(year, month, lastDay, 23, 59, 59).toISOString();

        dispatch(fetchMySessions({
            page: 1,
            limit: 100,
            sessionDateFrom,
            sessionDateTo,
            sortBy: 'sessionDate',
            sortOrder: 'asc',
        }));
    }, [dispatch, year, month]);

    const paddedDays = useMemo(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const startOffset = (firstDay + 6) % 7;
        const totalCells = 42;

        return [
            ...Array(startOffset).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
            ...Array(totalCells - daysInMonth - startOffset).fill(null),
        ];
    }, [year, month]);

    // Map sessions to calendar format
    const calendarSessions = useMemo(() => {
        return sessions.map(mapSessionToCalendarFormat);
    }, [sessions]);

    const handlePrevMonth = useCallback(() => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    const handleNextMonth = useCallback(() => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    return (
        <div className="flex flex-col gap-6 lg:w-fit w-full">
            <div className="lg:w-[330px] flex flex-col rounded-2xl shadow-sm">
                <CalendarHeader
                    month={month}
                    year={year}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                />
                <CalendarGrid 
                    paddedDays={paddedDays} 
                    sessions={calendarSessions}
                    loading={loading}
                />
            </div>

            <SessionList 
                sessions={calendarSessions}
                loading={loading}
            />
        </div>
    );
};

export default memo(Calendar);