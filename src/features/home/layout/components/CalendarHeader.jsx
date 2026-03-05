import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = ({ month, year, onPrevMonth, onNextMonth }) => {
    return (
        <div className="w-full mt-6 px-6 flex justify-between items-center">
            <span className="text-blue-950 text-subhead-4">
                Tháng {month + 1}, {year}
            </span>

            <div className="flex gap-4">
                <button
                    onClick={onPrevMonth}
                    className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full 
                               hover:bg-blue-100 hover:text-blue-800
                               active:scale-95 transition-all duration-200"
                >
                    <ChevronLeft size={16} className="text-blue-950" />
                </button>

                <button
                    onClick={onNextMonth}
                    className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full 
                               hover:bg-blue-100 hover:text-blue-800
                               active:scale-95 transition-all duration-200"
                >
                    <ChevronRight size={16} className="text-blue-950" />
                </button>
            </div>
        </div>
    );
};

export default memo(CalendarHeader);
