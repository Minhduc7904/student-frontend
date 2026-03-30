import { memo, useEffect, useRef, useState } from 'react';
import { Card } from '../../../../shared/components';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const PracticeResultAnswerStatsCard = ({
    correctAnswers = 0,
    incorrectAnswers = 0,
    unansweredQuestions = 0,
    totalQuestions = 0,
}) => {
    const [hoveredKey, setHoveredKey] = useState(null);
    const [pinnedKey, setPinnedKey] = useState(null);
    const [displayedKey, setDisplayedKey] = useState(null);
    const [isCenterTextVisible, setIsCenterTextVisible] = useState(true);
    const transitionTimerRef = useRef(null);

    const normalizedTotalQuestions = Number(totalQuestions) > 0
        ? Number(totalQuestions)
        : Math.max(Number(correctAnswers) + Number(incorrectAnswers) + Number(unansweredQuestions), 0);

    const safeCorrectAnswers = clamp(Number(correctAnswers) || 0, 0, normalizedTotalQuestions || Number.MAX_SAFE_INTEGER);
    const safeIncorrectAnswers = clamp(Number(incorrectAnswers) || 0, 0, normalizedTotalQuestions || Number.MAX_SAFE_INTEGER);
    const safeUnansweredQuestions = clamp(Number(unansweredQuestions) || 0, 0, normalizedTotalQuestions || Number.MAX_SAFE_INTEGER);

    const answeredQuestions = clamp(
        safeCorrectAnswers + safeIncorrectAnswers,
        0,
        normalizedTotalQuestions || Number.MAX_SAFE_INTEGER
    );

    const resultChartItems = [
        { key: 'correct', label: 'Đúng', value: safeCorrectAnswers, color: '#22c55e' },
        { key: 'incorrect', label: 'Sai', value: safeIncorrectAnswers, color: '#ef4444' },
        { key: 'unanswered', label: 'Chưa trả lời', value: safeUnansweredQuestions, color: '#94a3b8' },
    ];

    const chartSize = 160;
    const chartStrokeWidth = 8;
    const chartRadius = (chartSize - chartStrokeWidth) / 2;
    const chartCircumference = 2 * Math.PI * chartRadius;
    const chartSliceArc = chartCircumference / resultChartItems.length;
    const chartSegmentGap = 14;
    const chartSegmentArc = chartSliceArc - chartSegmentGap;

    const activeKey = pinnedKey || hoveredKey;

    useEffect(() => {
        setIsCenterTextVisible(false);

        if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
        }

        transitionTimerRef.current = setTimeout(() => {
            setDisplayedKey(activeKey);
            setIsCenterTextVisible(true);
        }, 160);

        return () => {
            if (transitionTimerRef.current) {
                clearTimeout(transitionTimerRef.current);
            }
        };
    }, [activeKey]);

    const activeItem = displayedKey
        ? resultChartItems.find((item) => item.key === displayedKey)
        : null;
    const centerValue = activeItem ? activeItem.value : answeredQuestions;
    const centerTotal = normalizedTotalQuestions || 0;
    const centerLabel = activeItem ? activeItem.label : 'Đã trả lời';

    return (
        <Card className="w-full flex-1 rounded-2xl border-slate-200 p-4">
            <div className="flex h-full flex-col gap-3">
                <p className="text-xs uppercase text-slate-500">Thống kê câu trả lời</p>

                <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
                    <svg width={chartSize} height={chartSize} className="shrink-0 transition-all duration-300 ease-out">
                        <g transform={`rotate(-90 ${chartSize / 2} ${chartSize / 2})`}>
                            {resultChartItems.map((item, index) => {
                                const isHighlighted = !hoveredKey && !pinnedKey
                                    ? true
                                    : activeKey === item.key;
                                const percent = normalizedTotalQuestions > 0 ? item.value / normalizedTotalQuestions : 0;
                                const progressArc = isHighlighted
                                    ? Math.min(percent * chartSegmentArc, chartSegmentArc)
                                    : 0;
                                const segmentStart = index * chartSliceArc + chartSegmentGap / 2;

                                return (
                                    <g key={item.key}>
                                        <circle
                                            cx={chartSize / 2}
                                            cy={chartSize / 2}
                                            r={chartRadius}
                                            stroke={isHighlighted ? `${item.color}33` : 'transparent'}
                                            strokeWidth={chartStrokeWidth}
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${chartSegmentArc} ${chartCircumference}`}
                                            strokeDashoffset={-segmentStart}
                                            style={{ transition: 'stroke 320ms ease, opacity 320ms ease' }}
                                        />

                                        <circle
                                            cx={chartSize / 2}
                                            cy={chartSize / 2}
                                            r={chartRadius}
                                            stroke={item.color}
                                            strokeWidth={chartStrokeWidth}
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${progressArc} ${chartCircumference}`}
                                            strokeDashoffset={-segmentStart}
                                            style={{ transition: 'stroke-dasharray 380ms ease, opacity 320ms ease' }}
                                        />
                                    </g>
                                );
                            })}
                        </g>

                        <text
                            x="50%"
                            y="52%"
                            textAnchor="middle"
                            className={`fill-gray-600 transition-opacity duration-200 ${isCenterTextVisible ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <tspan className="text-3xl font-bold fill-gray-800">{centerValue}</tspan>
                            <tspan className="text-sm font-medium fill-gray-500">/{centerTotal}</tspan>
                        </text>
                        <text
                            x="50%"
                            y="66%"
                            textAnchor="middle"
                            className={`transition-opacity duration-200 ${isCenterTextVisible ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <tspan className="text-xs font-medium fill-gray-500">{centerLabel}</tspan>
                        </text>
                    </svg>

                    <div className="grid w-full grid-cols-3 gap-1 md:w-auto md:grid-cols-1">
                        {resultChartItems.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onMouseEnter={() => setHoveredKey(item.key)}
                                onMouseLeave={() => setHoveredKey(null)}
                                onFocus={() => setHoveredKey(item.key)}
                                onBlur={() => setHoveredKey(null)}
                                onClick={() => {
                                    setPinnedKey((prev) => (prev === item.key ? null : item.key));
                                    setHoveredKey(item.key);
                                }}
                                className={`w-full cursor-pointer rounded-lg bg-[#00000005] px-2.5 py-2 text-center transition-all duration-200 md:min-w-28 md:px-3 md:py-2.5 md:text-left ${activeKey && activeKey !== item.key ? 'opacity-60' : 'opacity-100'} ${pinnedKey === item.key ? 'ring-1 ring-slate-300' : ''}`}
                            >
                                <p className="text-xs font-medium" style={{ color: item.color }}>
                                    {item.label}
                                </p>
                                <p className="text-xs text-slate-700">
                                    {item.value}/{centerTotal}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default memo(PracticeResultAnswerStatsCard);