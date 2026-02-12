import { useState, useRef, useEffect, memo } from "react";
import { ChevronDown } from "lucide-react";
import { SvgIcon } from "@/shared/components";
import CalendarIcon from "@/assets/icons/Calendar.svg";

const FILTER_OPTIONS = [
    { label: "Tuần này", value: "week" },
    { label: "Tuần trước", value: "lastWeek" },
    { label: "Tháng này", value: "month" },
];

const DUMMY_DATA = {
    week: {
        hours: 5,
        minutes: 12,
        days: [60, 80, 40, 100, 70, 50, 30],
    },
    lastWeek: {
        hours: 8,
        minutes: 25,
        days: [40, 60, 90, 120, 50, 20, 10],
    },
    month: {
        hours: 32,
        minutes: 10,
        days: [100, 90, 120, 80, 70, 60, 50],
    },
};

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

const StudyStatsCard = () => {
    const [selected, setSelected] = useState("week");
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const data = DUMMY_DATA[selected];

    // 👉 Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex w-full flex-col gap-4 relative" ref={dropdownRef}>

            {/* Header */}
            <div className="flex w-full flex-col gap-3">

                <div className="px-3 w-full flex justify-between items-center">

                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <SvgIcon src={CalendarIcon} />
                        <span className="text-gray-900 text-text-5">
                            {FILTER_OPTIONS.find(o => o.value === selected)?.label}
                        </span>
                    </div>

                    {/* Dropdown Button */}
                    <button
                        type="button"
                        onClick={() => setOpen(prev => !prev)}
                        className="
                            p-2 rounded-full
                            cursor-pointer
                            hover:bg-gray-100
                            transition-all duration-200
                            active:scale-95
                        "
                    >
                        <ChevronDown
                            size={20}
                            className={`
                                transition-transform duration-300
                                ${open ? "rotate-180" : ""}
                            `}
                        />
                    </button>
                </div>

                {/* Dropdown */}
                {open && (
                    <div className="
                        absolute top-12 right-0
                        bg-white shadow-lg rounded-lg
                        p-2 z-20 w-40
                        animate-in fade-in zoom-in-95 duration-150
                    ">
                        {FILTER_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setSelected(option.value);
                                    setOpen(false);
                                }}
                                className="
                                    block w-full text-left
                                    px-4 py-2
                                    cursor-pointer
                                    hover:bg-gray-100
                                    rounded-md text-text-5
                                    transition
                                "
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Total time */}
                <div className="flex px-3 gap-8 text-gray-900 text-[24px] font-semibold">
                    <div className="flex gap-3">
                        <span>{data.hours}</span>
                        <span>Giờ</span>
                    </div>
                    <div className="flex gap-3">
                        <span>{data.minutes}</span>
                        <span>Phút</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex justify-between w-full h-32 px-3 items-end">

                {(() => {
                    const maxValue = Math.max(...data.days);

                    return data.days.map((value, index) => {
                        const percent = (value / maxValue) * 100;

                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-end h-full group relative"
                            >
                                {/* Tooltip */}
                                <div className="
                                    absolute -top-8 opacity-0
                                    group-hover:opacity-100
                                    transition-all duration-200
                                    bg-gray-900 text-white text-xs
                                    px-2 py-1 rounded
                                    whitespace-nowrap
                                ">
                                    {value} phút
                                </div>

                                {/* Bar */}
                                <div
                                    className="
                                        w-7 bg-yellow-100 rounded-sm
                                        transition-all duration-300
                                        group-hover:bg-yellow-200
                                        max-h-full
                                    "
                                    style={{ height: `${percent}%` }}
                                />

                                <div className="text-blue-800 text-subhead-5 mt-2">
                                    {daysOfWeek[index]}
                                </div>
                            </div>
                        );
                    });
                })()}
            </div>
        </div>
    );
};

export default memo(StudyStatsCard);
