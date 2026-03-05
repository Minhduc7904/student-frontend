import { memo } from "react";
import { DAYS_OF_WEEK } from "./Calendar";

const CalendarWeekHeader = () => (
    <div className="grid grid-cols-7 px-6 text-center">
        {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="p-1 text-subhead-5 text-blue-950">
                {day}
            </div>
        ))}
    </div>
);

export default memo(CalendarWeekHeader);
