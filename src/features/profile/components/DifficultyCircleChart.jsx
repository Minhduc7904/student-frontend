import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    getDifficultyStatsAsync,
    selectDifficultyStats,
    selectDifficultyStatsLoading,
} from "../store/profileSlice";

/**
 * DifficultyCircleChart
 * Thống kê số câu đã làm theo độ khó (mock data).
 */
const DifficultyCircleChart = memo(() => {
    const dispatch = useDispatch();
    const { id: studentId } = useParams();
    const difficultyStats = useSelector(selectDifficultyStats);
    const difficultyStatsLoading = useSelector(selectDifficultyStatsLoading);

    const [hoveredLabel, setHoveredLabel] = useState(null);
    const [displayedLabel, setDisplayedLabel] = useState(null);
    const [isCenterTextVisible, setIsCenterTextVisible] = useState(true);
    const transitionTimerRef = useRef(null);

    useEffect(() => {
        dispatch(getDifficultyStatsAsync({ studentId }));
    }, [dispatch, studentId]);

    const difficultyColorMap = {
        NB: "#2db55d",
        TH: "#4cc9f0",
        VD: "#f72585",
        VDC: "#ffbe0b",
    };

    const fallbackData = [
        { label: "NB", value: 0, total: 0, color: difficultyColorMap.NB },
        { label: "TH", value: 0, total: 0, color: difficultyColorMap.TH },
        { label: "VD", value: 0, total: 0, color: difficultyColorMap.VD },
        { label: "VDC", value: 0, total: 0, color: difficultyColorMap.VDC },
    ];

    const data = difficultyStats?.items?.length
        ? difficultyStats.items.map((item) => ({
            label: item.difficulty,
            value: item.done || 0,
            total: item.total || 0,
            color: difficultyColorMap[item.difficulty] || "#94a3b8",
        }))
        : fallbackData;

    const size = 160;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const quarterArc = circumference / 4;
    const segmentGap = 15;
    const segmentArc = quarterArc - segmentGap;

    const totalSolved = difficultyStats?.totalDone ?? data.reduce((sum, d) => sum + d.value, 0);
    const totalQuestions = difficultyStats?.totalQuestions ?? data.reduce((sum, d) => sum + d.total, 0);
    useEffect(() => {
        setIsCenterTextVisible(false);

        if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
        }

        transitionTimerRef.current = setTimeout(() => {
            setDisplayedLabel(hoveredLabel);
            setIsCenterTextVisible(true);
        }, 160);

        return () => {
            if (transitionTimerRef.current) {
                clearTimeout(transitionTimerRef.current);
            }
        };
    }, [hoveredLabel]);

    const activeItem = displayedLabel
        ? data.find((item) => item.label === displayedLabel)
        : null;
    const centerValue = activeItem ? activeItem.value : totalSolved;
    const centerTotal = activeItem ? activeItem.total : totalQuestions;

    return (
        <div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1 flex justify-center items-center">
                    <svg width={size} height={size} className="shrink-0 transition-all duration-300 ease-out">
                        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                            {data.map((item, index) => {
                                const isActive = !hoveredLabel || hoveredLabel === item.label;
                                const percent = item.total > 0 ? item.value / item.total : 0;
                                const progressArc = isActive ? Math.min(percent * segmentArc, segmentArc) : 0;
                                const segmentStart = index * quarterArc + segmentGap / 2;

                                return (
                                    <g key={item.label}>
                                        <circle
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            stroke={isActive ? `${item.color}33` : "transparent"}
                                            strokeWidth={strokeWidth}
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${segmentArc} ${circumference}`}
                                            strokeDashoffset={-segmentStart}
                                            style={{ transition: "stroke 320ms ease, opacity 320ms ease" }}
                                        />

                                        <circle
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            stroke={item.color}
                                            strokeWidth={strokeWidth}
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${progressArc} ${circumference}`}
                                            strokeDashoffset={-segmentStart}
                                            style={{ transition: "stroke-dasharray 380ms ease, opacity 320ms ease" }}
                                        />
                                    </g>
                                );
                            })}
                        </g>

                        <text
                            x="50%"
                            y="52%"
                            textAnchor="middle"
                            className={`fill-gray-600 transition-opacity duration-200 ${isCenterTextVisible ? "opacity-100" : "opacity-0"}`}
                        >
                            <tspan className="text-3xl font-bold fill-gray-800">
                                {difficultyStatsLoading ? "..." : centerValue}
                            </tspan>
                            <tspan className="text-sm font-medium fill-gray-500">
                                /{difficultyStatsLoading ? "..." : centerTotal}
                            </tspan>
                        </text>
                        <text
                            x="50%"
                            y="66%"
                            textAnchor="middle"
                            className={`transition-opacity duration-200 ${isCenterTextVisible ? "opacity-100" : "opacity-0"}`}
                        >
                            <tspan className="text-sm font-semibold fill-[#2db55d]">✓</tspan>
                            <tspan className="text-xs font-medium fill-gray-400"> Đã giải</tspan>
                        </text>
                    </svg>
                </div>
                {/* Legend */}
                <div className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4 md:w-auto md:grid-cols-2">
                    {data.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onMouseEnter={() => setHoveredLabel(item.label)}
                            onMouseLeave={() => setHoveredLabel(null)}
                            onClick={() => setHoveredLabel((prev) => (prev === item.label ? null : item.label))}
                            className={`w-full bg-[#00000005] cursor-pointer flex flex-col justify-center items-center rounded-lg gap-0.5 px-3 py-2.5 transition-colors md:w-22.5 ${hoveredLabel && hoveredLabel !== item.label ? "opacity-60" : "opacity-100"
                                }`}
                        >
                            <p className="text-xs font-medium" style={{ color: item.color }}>
                                {item.label}
                            </p>
                            <p className="text-xs text-gray-700">
                                {item.value}/{item.total}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});

DifficultyCircleChart.displayName = "DifficultyCircleChart";

export default DifficultyCircleChart;
