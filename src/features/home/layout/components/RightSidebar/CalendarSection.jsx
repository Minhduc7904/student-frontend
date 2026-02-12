import { memo } from "react";
import CalendarComponent from "../Calendar";

/**
 * CalendarSection Component
 * Section hiển thị lịch học tập
 */
const CalendarSection = memo(() => {
    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full pl-6">
                <span className="text-h3 font-680 text-blue-900">
                    Lịch học tập
                </span>
            </div>
            <CalendarComponent />
        </div>
    );
});

CalendarSection.displayName = "CalendarSection";

export default CalendarSection;
