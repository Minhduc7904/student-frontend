import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CustomDropdown, CustomTooltip } from "../../../shared/components";
import {
    getActivityYearStatsAsync,
    selectActivityYearStats,
} from "../store/profileSlice";

const DAYS = 7;
const WEEKS = 53;
const CURRENT_YEAR = new Date().getFullYear();

const getLevel = (count) => {
    if (!count || count <= 0) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
};

const getColor = (level) => {
    switch (level) {
        case 0:
            return "bg-gray-100";
        case 1:
            return "bg-green-100";
        case 2:
            return "bg-green-300";
        case 3:
            return "bg-green-500";
        case 4:
            return "bg-green-700";
        default:
            return "bg-gray-100";
    }
};

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const diffInDays = (from, to) => {
    return Math.floor((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
};

const formatDateLabel = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

/**
 * HeatmapChart
 * Thống kê hoạt động theo ngày trong năm (competition submit + exam attempt).
 */
const HeatmapChart = memo(({ year = CURRENT_YEAR }) => {
    const dispatch = useDispatch();
    const { id: studentId } = useParams();
    const activityStats = useSelector(selectActivityYearStats);
    const [selectedYear, setSelectedYear] = useState(year);

    const yearOptions = useMemo(
        () => [
            { label: `Năm ${CURRENT_YEAR}`, value: CURRENT_YEAR },
            { label: `Năm ${CURRENT_YEAR - 1}`, value: CURRENT_YEAR - 1 },
        ],
        []
    );

    useEffect(() => {
        setSelectedYear(year);
    }, [year]);

    useEffect(() => {
        dispatch(getActivityYearStatsAsync({ year: selectedYear, studentId }));
    }, [dispatch, selectedYear, studentId]);

    const monthLabels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const { heatmapData, monthLabelByWeek } = useMemo(() => {
        const yearStart = startOfDay(new Date(selectedYear, 0, 1));
        const gridStart = addDays(yearStart, -yearStart.getDay());
        const today = startOfDay(new Date());

        const matrix = Array.from({ length: WEEKS }, () =>
            Array.from({ length: DAYS }, () => ({
                level: 0,
                totalCount: 0,
                date: null,
                isInSelectedYear: false,
                isToday: false,
            }))
        );

        const monthStartLabels = Array.from({ length: WEEKS }, () => "");

        for (let month = 0; month < 12; month += 1) {
            const firstDayOfMonth = startOfDay(new Date(selectedYear, month, 1));
            const weekIndex = Math.floor(diffInDays(gridStart, firstDayOfMonth) / 7);

            if (weekIndex >= 0 && weekIndex < WEEKS && !monthStartLabels[weekIndex]) {
                monthStartLabels[weekIndex] = monthLabels[month];
            }
        }

        const days = activityStats?.days || [];
        const countByDate = new Map();

        days.forEach((dayItem) => {
            if (!dayItem?.date) return;
            countByDate.set(dayItem.date, Number(dayItem.totalCount || 0));
        });

        for (let weekIndex = 0; weekIndex < WEEKS; weekIndex += 1) {
            for (let dayOfWeekIndex = 0; dayOfWeekIndex < DAYS; dayOfWeekIndex += 1) {
                const cellDate = addDays(gridStart, weekIndex * 7 + dayOfWeekIndex);
                const isoDate = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
                const totalCount = countByDate.get(isoDate) || 0;

                matrix[weekIndex][dayOfWeekIndex] = {
                    level: getLevel(totalCount),
                    totalCount,
                    date: cellDate,
                    isInSelectedYear: cellDate.getFullYear() === selectedYear,
                    isToday: cellDate.getTime() === today.getTime(),
                };
            }
        }

        return {
            heatmapData: matrix,
            monthLabelByWeek: monthStartLabels,
        };
    }, [activityStats, selectedYear]);

    return (
        <div>
            <div className="mb-4 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-baseline gap-1">
                    <span className="text-[24px] font-semibold text-gray-900">
                        {activityStats?.totalActivities || 0}
                    </span>
                    <span className="text-sm text-gray-500">
                        bài nộp trong năm {selectedYear}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <p className="text-xs text-gray-500 sm:text-sm">
                        Tổng số ngày hoạt động: <span className="text-gray-900">{activityStats?.totalActiveDays || 0}</span>
                    </p>
                    <p className="text-xs text-gray-500 sm:text-sm">
                        Chuỗi dài nhất: <span className="text-gray-900">{activityStats?.maxStreak || 0}</span>
                    </p>
                    <CustomDropdown
                        id="activity-year-select"
                        value={selectedYear}
                        options={yearOptions}
                        onChange={(value) => setSelectedYear(Number(value))}
                        buttonClassName="min-w-28"
                        menuClassName="w-28"
                    />
                </div>
            </div>
            <div className="w-full overflow-x-auto pb-1">
                <div className="min-w-180 rounded-xl">
                    <div className="mb-2 flex gap-1 pl-7">
                        {monthLabelByWeek.map((label, weekIndex) => (
                            <div key={weekIndex} className="w-3 text-left text-[10px] text-gray-400">
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <div className="flex flex-col justify-between py-0.5 text-[10px] text-gray-400">
                            <span>Sun</span>
                            <span>Tue</span>
                            <span>Thu</span>
                            <span>Sat</span>
                        </div>

                        <div className="flex gap-1">
                            {heatmapData.map((week, colIndex) => (
                                <div key={colIndex} className="flex flex-col gap-1">
                                    {week.map((cell, rowIndex) => (
                                        <CustomTooltip
                                            key={rowIndex}
                                            text={`${cell.totalCount} bài đã nộp trong ${formatDateLabel(cell.date)}`}
                                        >
                                            <div
                                                className={`relative h-3 w-3 cursor-pointer rounded-sm transition-colors duration-300 ${
                                                    cell.isInSelectedYear ? getColor(cell.level) : "bg-gray-50"
                                                }`}
                                            >
                                                {cell.isToday ? (
                                                    <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                ) : null}
                                            </div>
                                        </CustomTooltip>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

HeatmapChart.displayName = "HeatmapChart";

export default HeatmapChart;
