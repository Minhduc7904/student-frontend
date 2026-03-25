import { useMemo, useRef, useEffect } from 'react';
import { Activity, CheckCircle2, Clock3 } from 'lucide-react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const full = clean.length === 3
        ? clean.split('').map((ch) => ch + ch).join('')
        : clean;

    return {
        r: parseInt(full.slice(0, 2), 16),
        g: parseInt(full.slice(2, 4), 16),
        b: parseInt(full.slice(4, 6), 16),
    };
};

const rgbToHex = ({ r, g, b }) => {
    const toHex = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const interpolateColor = (from, to, ratio) => {
    const a = hexToRgb(from);
    const b = hexToRgb(to);
    const t = clamp(ratio, 0, 1);

    return rgbToHex({
        r: a.r + (b.r - a.r) * t,
        g: a.g + (b.g - a.g) * t,
        b: a.b + (b.b - a.b) * t,
    });
};

const interpolateThreeStops = (first, middle, last, ratio) => {
    const t = clamp(ratio, 0, 1);
    if (t <= 0.5) {
        return interpolateColor(first, middle, t / 0.5);
    }
    return interpolateColor(middle, last, (t - 0.5) / 0.5);
};

const CompetitionDetailStatusCircle = ({ timelineStatus, startDate, endDate, nowTs, attemptStatus, bestSubmittedScore }) => {
    const initialRemainingMsRef = useRef(null);

    const hasAttempted = attemptStatus === 'ATTEMPTED' || attemptStatus === 'SUBMITTED' || attemptStatus === 'IN_PROGRESS';
    const hasBestScore = bestSubmittedScore != null && Number.isFinite(Number(bestSubmittedScore));
    const showScoreCircle = hasAttempted && hasBestScore;

    const countdownTargetDate =
        timelineStatus === 'ONGOING'
            ? endDate
            : timelineStatus === 'UPCOMING'
                ? startDate
                : null;

    const countdownTargetMs = countdownTargetDate ? new Date(countdownTargetDate).getTime() : NaN;
    const hasCountdown = Number.isFinite(countdownTargetMs);
    const remainingMs = hasCountdown ? Math.max(0, countdownTargetMs - nowTs) : 0;

    useEffect(() => {
        if (!hasCountdown) {
            initialRemainingMsRef.current = null;
            return;
        }

        initialRemainingMsRef.current = Math.max(remainingMs, 1000);
    }, [hasCountdown, timelineStatus, countdownTargetMs]);

    const progressRatio = useMemo(() => {
        if (!hasCountdown) return 0;

        const initial = Math.max(initialRemainingMsRef.current ?? remainingMs, 1000);
        return clamp(remainingMs / initial, 0, 1);
    }, [hasCountdown, remainingMs]);

    const urgencyRatio = 1 - progressRatio;

    const statusConfig = useMemo(() => {
        if (timelineStatus === 'ONGOING') {
            return {
                label: 'Đang diễn ra',
                Icon: Activity,
                iconClass: 'text-emerald-600',
                iconBgClass: 'bg-white/70',
                ringColor: interpolateThreeStops('#22C55E', '#EAB308', '#EF4444', urgencyRatio),
                showCountdown: true,
            };
        }

        if (timelineStatus === 'UPCOMING') {
            return {
                label: 'Sắp diễn ra',
                Icon: Clock3,
                iconClass: 'text-blue-600',
                iconBgClass: 'bg-white/70',
                ringColor: interpolateThreeStops('#2563EB', '#EAB308', '#EF4444', urgencyRatio),
                showCountdown: true,
            };
        }

        return {
            label: 'Đã kết thúc',
            Icon: CheckCircle2,
            iconClass: 'text-gray-600',
            iconBgClass: 'bg-white/70',
            ringColor: '#9CA3AF',
            showCountdown: false,
        };
    }, [timelineStatus, urgencyRatio]);

    const radius = 28;
    const strokeWidth = 5;
    const circleSize = 72;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference * (1 - progressRatio);

    const scoreLabel = useMemo(() => {
        if (!showScoreCircle) return '--';

        const normalized = Number(bestSubmittedScore);
        if (!Number.isFinite(normalized)) return '--';

        return Number.isInteger(normalized) ? `${normalized}` : normalized.toFixed(1);
    }, [showScoreCircle, bestSubmittedScore]);

    return (
        <div className="inline-flex shrink-0 items-start gap-4">
            <div className="inline-flex flex-col items-center">
                <div className="relative mt-2 h-18 w-18 rounded-full">
                    <svg className="absolute inset-0 -rotate-90" width={circleSize} height={circleSize}>
                        <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={radius}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth={strokeWidth}
                        />

                        {statusConfig.showCountdown ? (
                            <circle
                                cx={circleSize / 2}
                                cy={circleSize / 2}
                                r={radius}
                                fill="none"
                                stroke={statusConfig.ringColor}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={progressOffset}
                                className="animate-pulse transition-all duration-700 ease-linear"
                            />
                        ) : (
                            <circle
                                cx={circleSize / 2}
                                cy={circleSize / 2}
                                r={radius}
                                fill="none"
                                stroke={statusConfig.ringColor}
                                strokeWidth={strokeWidth}
                            />
                        )}
                    </svg>

                    <div className={`absolute inset-2 flex items-center justify-center rounded-full ${statusConfig.iconBgClass}`}>
                        <statusConfig.Icon size={22} className={statusConfig.iconClass} />
                    </div>
                </div>
                <p className="text-text-5 font-semibold text-gray-700">{statusConfig.label}</p>
            </div>

            {showScoreCircle ? (
                <div className="inline-flex flex-col items-center">
                    <div className="relative mt-2 h-18 w-18 rounded-full">
                        <svg className="absolute inset-0 -rotate-90" width={circleSize} height={circleSize}>
                            <circle
                                cx={circleSize / 2}
                                cy={circleSize / 2}
                                r={radius}
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth={strokeWidth}
                            />
                            <circle
                                cx={circleSize / 2}
                                cy={circleSize / 2}
                                r={radius}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth={strokeWidth}
                            />
                        </svg>

                        <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-blue-50">
                            <span className="text-xs font-semibold text-blue-600">Điểm</span>
                            <span className="text-base font-bold text-blue-800">{scoreLabel}</span>
                        </div>
                    </div>
                    <p className="text-text-5 font-semibold text-gray-700">Tốt nhất</p>
                </div>
            ) : null}
        </div>
    );
};

export default CompetitionDetailStatusCircle;