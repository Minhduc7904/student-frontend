import { memo, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ==================== CONSTANTS ====================
const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const HOMEWORK_DATA = {
    "2026-0": [ // Tháng 1 (0-based)
        {
            id: 1,
            day: 15,
            title: "Bài tập về nhà",
            subject: "Toán nâng cao 12",
            deadline: "23:59 PM",
            color: "green",
        },
        {
            id: 2,
            day: 20,
            title: "Final Project",
            subject: "Android Development",
            deadline: "23:59 PM",
            color: "blue",
        },
        {
            id: 3,
            day: 25,
            title: "Ôn tập chương 3",
            subject: "Vật lý 12",
            deadline: "21:00 PM",
            color: "red",
        },
        {
            id: 4,
            day: 28,
            title: "Essay tuần 1",
            subject: "Tiếng Anh",
            deadline: "18:00 PM",
            color: "purple",
        },
    ],
    "2026-1": [ // Tháng 2
        {
            id: 5,
            day: 10,
            title: "Bài tập Hình học",
            subject: "Toán 12",
            deadline: "22:00 PM",
            color: "green",
        },
        {
            id: 6,
            day: 18,
            title: "Mini Project",
            subject: "ReactJS",
            deadline: "23:59 PM",
            color: "blue",
        },
    ],
    "2026-2": [ // Tháng 3
        {
            id: 7,
            day: 5,
            title: "Kiểm tra giữa kỳ",
            subject: "Hóa học 12",
            deadline: "20:00 PM",
            color: "red",
        },
        {
            id: 8,
            day: 12,
            title: "Assignment 3",
            subject: "NodeJS",
            deadline: "23:59 PM",
            color: "green",
        },
        {
            id: 9,
            day: 22,
            title: "Thi thử đại học",
            subject: "Toán",
            deadline: "19:30 PM",
            color: "blue",
        },
    ],
};

const COLOR_MAP = {
    green: { bg: "bg-green-100", text: "text-green-500" },
    blue: { bg: "bg-blue-100", text: "text-blue-800" },
    red: { bg: "bg-red-100", text: "text-red-500" },
    purple: { bg: "bg-purple-100", text: "text-purple-500" },
};

// ==================== SUB-COMPONENTS ====================

/**
 * CalendarHeader - Header với tháng/năm và navigation buttons
 */
const CalendarHeader = memo(({ month, year, onPrevMonth, onNextMonth }) => {
    return (
        <div className="w-full mt-6 px-6 flex justify-between items-center">
            <span className="text-blue-800 text-subhead-4">
                Tháng {month + 1}, {year}
            </span>

            <div className="flex gap-6">
                <button
                    type="button"
                    onClick={onPrevMonth}
                    className="cursor-pointer"
                    aria-label="Tháng trước"
                >
                    <ChevronLeft size={16} className="text-gray-subtle" />
                </button>

                <button
                    type="button"
                    onClick={onNextMonth}
                    className="cursor-pointer"
                    aria-label="Tháng sau"
                >
                    <ChevronRight size={16} className="text-gray-subtle" />
                </button>
            </div>
        </div>
    );
});
CalendarHeader.displayName = "CalendarHeader";

/**
 * CalendarWeekHeader - Header hiển thị các thứ trong tuần
 */
const CalendarWeekHeader = memo(() => {
    return (
        <div className="grid grid-cols-7 px-6 text-center">
            {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="p-1 text-subhead-5 text-gray-subtle">
                    {day}
                </div>
            ))}
        </div>
    );
});
CalendarWeekHeader.displayName = "CalendarWeekHeader";

/**
 * HomeworkTooltip - Tooltip hiển thị thông tin homework
 */
const HomeworkTooltip = memo(({ homework, position }) => {
    if (!position) return null;

    const tooltipStyle = {
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
        transform: 'translate(-50%, -100%)',
        marginTop: '-8px',
        zIndex: 9999,
    };

    return createPortal(
        <div style={tooltipStyle} className="px-3 py-2 bg-gray-900 text-white text-text-5 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn">
            <div className="flex flex-col gap-1">
                <span className="font-semibold">{homework.title}</span>
                <span className="text-gray-300">{homework.subject}</span>
                <span className="text-gray-400">Deadline: {homework.deadline}</span>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px]">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900"></div>
            </div>
        </div>,
        document.body
    );
});
HomeworkTooltip.displayName = "HomeworkTooltip";

/**
 * CalendarDay - Một ngày trong lịch
 */
const CalendarDay = memo(({ day, homework }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState(null);
    const dayRef = useRef(null);
    const hasDay = day !== null;
    const hasHomework = homework !== null;

    useEffect(() => {
        if (isHovered && hasHomework && dayRef.current) {
            const rect = dayRef.current.getBoundingClientRect();
            setTooltipPosition({
                left: rect.left + rect.width / 2,
                top: rect.top,
            });
        } else {
            setTooltipPosition(null);
        }
    }, [isHovered, hasHomework]);

    if (!hasDay) {
        return <div className="pointer-events-none"></div>;
    }

    const colorClasses = hasHomework ? COLOR_MAP[homework.color] : null;

    return (
        <>
            <div 
                ref={dayRef}
                className="relative"
                onMouseEnter={() => hasHomework && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className={`
                        w-[24px] h-[24px] flex justify-center items-center p-1 rounded-full
                        ${hasHomework ? `${colorClasses.bg} ${colorClasses.text} font-semibold` : "hover:bg-blue-100 text-blue-800"}
                        cursor-pointer
                    `}
                >
                    {day}
                </div>
            </div>
            {isHovered && hasHomework && <HomeworkTooltip homework={homework} position={tooltipPosition} />}
        </>
    );
});
CalendarDay.displayName = "CalendarDay";

/**
 * CalendarGrid - Lưới hiển thị các ngày trong tháng
 */
const CalendarGrid = memo(({ paddedDays, homeworks }) => {
    // Tạo map ngày -> homework data
    const homeworkMap = useMemo(() => {
        const map = {};
        homeworks.forEach(hw => {
            map[hw.day] = hw;
        });
        return map;
    }, [homeworks]);

    return (
        <div className="w-full flex flex-col gap-[14px] mb-[28px]">
            <CalendarWeekHeader />
            
            <div className="grid grid-cols-7 gap-y-4 px-6 text-subhead-5 text-center">
                {paddedDays.map((day, index) => (
                    <CalendarDay 
                        key={index} 
                        day={day} 
                        homework={day ? homeworkMap[day] || null : null}
                    />
                ))}
            </div>
        </div>
    );
});
CalendarGrid.displayName = "CalendarGrid";

/**
 * HomeworkItem - Một item bài tập
 */
const HomeworkItem = memo(({ item }) => {
    const color = COLOR_MAP[item.color];

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div
                    className={`w-10 h-10 rounded-full flex justify-center items-center ${color.bg}`}
                >
                    <span className={`text-[24px] font-semibold leading-none ${color.text}`}>
                        {item.day}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-subhead-4 text-gray-900">
                        {item.title}
                    </span>
                    <span className="text-text-5 text-gray-subtle">
                        {item.subject}
                    </span>
                </div>
            </div>

            <div className="text-gray-900 text-text-4">
                {item.deadline}
            </div>
        </div>
    );
});
HomeworkItem.displayName = "HomeworkItem";

/**
 * HomeworkList - Danh sách bài tập
 */
const HomeworkList = memo(({ homeworks }) => {
    if (homeworks.length === 0) {
        return (
            <div className="text-gray-subtle text-text-5">
                Không có bài tập trong tháng này
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
            {homeworks.map((item) => (
                <HomeworkItem key={item.id} item={item} />
            ))}
        </div>
    );
});
HomeworkList.displayName = "HomeworkList";

// ==================== MAIN COMPONENT ====================

/**
 * Calendar - Component lịch chính
 */
const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11

    // Tính toán paddedDays với useMemo
    const paddedDays = useMemo(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const startOffset = (firstDay + 6) % 7; // Convert to Monday = 0
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const totalCells = 42;

        return [
            ...Array(startOffset).fill(null),
            ...days,
            ...Array(totalCells - days.length - startOffset).fill(null),
        ];
    }, [year, month]);

    // Get homeworks for current month
    const homeworks = useMemo(() => {
        const homeworkKey = `${year}-${month}`;
        return HOMEWORK_DATA[homeworkKey] || [];
    }, [year, month]);

    // Navigation handlers
    const handlePrevMonth = useCallback(() => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    const handleNextMonth = useCallback(() => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    return (
        <div className="flex flex-col gap-6 lg:w-fit w-full">
            {/* Calendar Card */}
            <div className="w-full lg:w-[330px] gap-4 flex flex-col items-center rounded-2xl overflow-hidden shadow-sm bg-blue-50">
                <CalendarHeader
                    month={month}
                    year={year}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                />

                <div className="w-full lg:w-72 h-0 outline-[0.80px] outline-offset-[-0.40px] outline-gray-300" />

                <CalendarGrid paddedDays={paddedDays} homeworks={homeworks} />
            </div>

            {/* Homework List */}
            <HomeworkList homeworks={homeworks} />
        </div>
    );
};

export default memo(Calendar);
