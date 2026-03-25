import { Trophy } from 'lucide-react';

/**
 * Percentage ring (SVG circle progress)
 */
const PercentageRing = ({ percentage }) => {
    const pct = Math.min(Math.max(percentage ?? 0, 0), 100);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    const color = pct >= 80 ? '#059669' : pct >= 50 ? '#2563eb' : '#dc2626';

    return (
        <div className="relative h-28 w-28 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                />
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-h3 font-bold" style={{ color }}>
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

    const labelColor = pct >= 80 ? 'text-emerald-700' : pct >= 65 ? 'text-blue-700' : pct >= 50 ? 'text-amber-700' : 'text-red-700';

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="text-subhead-4 font-semibold text-gray-900">Điểm số</h2>
            </div>

            <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-8">
                <PercentageRing percentage={pct} />

                <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:col-span-2">
                        <p className="text-text-5 text-slate-600">Điểm đạt được</p>
                        <p className="mt-1 text-h3 font-bold text-slate-900">
                            {totalPoints != null ? totalPoints : '—'}
                            {maxPoints != null && (
                                <span className="text-subhead-4 font-normal text-slate-500"> / {maxPoints}</span>
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-text-5 text-slate-600">Đánh giá</p>
                        <p className={`mt-1 text-subhead-4 font-semibold ${labelColor}`}>{label}</p>
                    </div>

                    {maxPoints != null && (
                        <div className="rounded-xl border border-slate-200 bg-white p-3 md:col-span-3">
                            <div className="mb-2 flex items-center justify-between text-text-5">
                                <span className="text-slate-600">Tiến độ điểm</span>
                                <span className="font-semibold text-slate-800">{pct}%</span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${pct}%`,
                                        backgroundColor: pct >= 80 ? '#059669' : pct >= 50 ? '#2563eb' : '#dc2626',
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;
