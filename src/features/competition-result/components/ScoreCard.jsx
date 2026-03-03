import { Trophy } from 'lucide-react';

/**
 * Percentage ring (SVG circle progress)
 */
const PercentageRing = ({ percentage }) => {
    const pct = Math.min(Math.max(percentage ?? 0, 0), 100);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    const color =
        pct >= 80 ? '#16a34a'  // green-600
        : pct >= 50 ? '#2563eb' // blue-600
        : '#dc2626';             // red-600

    return (
        <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Track */}
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                />
                {/* Progress */}
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
            </svg>
            {/* Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-head-4 font-bold" style={{ color }}>
                    {Math.round(pct)}%
                </span>
            </div>
        </div>
    );
};

/**
 * ScoreCard
 * Hiển thị điểm số – chỉ render khi rules.allowViewScore = true
 */
const ScoreCard = ({ result }) => {
    if (!result?.rules?.allowViewScore) return null;

    const { totalPoints, maxPoints, scorePercentage } = result;

    const pct = scorePercentage != null
        ? Math.round(scorePercentage)
        : maxPoints
        ? Math.round((totalPoints / maxPoints) * 100)
        : 0;

    const label =
        pct >= 80 ? 'Xuất sắc' :
        pct >= 65 ? 'Khá' :
        pct >= 50 ? 'Trung bình' :
        'Cần cố gắng thêm';

    const labelColor =
        pct >= 80 ? 'text-green-600' :
        pct >= 65 ? 'text-blue-600' :
        pct >= 50 ? 'text-yellow-600' :
        'text-red-600';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-8 py-5 sm:py-6">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-subhead-4 font-semibold text-gray-800">Điểm số</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
                {/* Ring */}
                <PercentageRing percentage={pct} />

                {/* Right info */}
                <div className="flex flex-col gap-3 flex-1">
                    {/* Score fraction */}
                    <div className="flex flex-col gap-0.5">
                        <span className="text-text-5 text-gray-500">Điểm đạt được</span>
                        <span className="text-head-3 font-bold text-gray-900">
                            {totalPoints != null ? totalPoints : '—'}
                            {maxPoints != null && (
                                <span className="text-subhead-4 font-normal text-gray-400"> / {maxPoints}</span>
                            )}
                        </span>
                    </div>

                    {/* Evaluation label */}
                    <span className={`text-subhead-5 font-semibold ${labelColor}`}>{label}</span>

                    {/* Progress bar */}
                    {maxPoints != null && (
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full transition-all duration-700"
                                style={{
                                    width: `${pct}%`,
                                    backgroundColor: pct >= 80 ? '#16a34a' : pct >= 50 ? '#2563eb' : '#dc2626',
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;
