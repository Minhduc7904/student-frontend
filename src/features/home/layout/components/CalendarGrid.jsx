import { memo, useMemo } from "react";
import CalendarWeekHeader from "./CalendarWeekHeader";
import CalendarDay from "./CalendarDay";

const CalendarGrid = ({ paddedDays, sessions, loading }) => {
    const sessionMap = useMemo(() => {
        const map = {};
        if (sessions) {
            sessions.forEach((session) => (map[session.day] = session));
        }
        return map;
    }, [sessions]);

    return (
        <div className="flex flex-col gap-4 mb-7">
            <CalendarWeekHeader />
            <div className="grid grid-cols-7 gap-y-4 px-6 text-center">
                {paddedDays.map((day, i) => (
                    <CalendarDay
                        key={i}
                        day={day}
                        session={day ? sessionMap[day] || null : null}
                        loading={loading}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(CalendarGrid);
