import { memo } from "react";
import { Card } from "../../../../shared/components";

const toSafeNumber = (value) => {
    const next = Number(value);
    return Number.isFinite(next) ? next : 0;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const RedoWrongSummaryDonutCard = ({ summary, fallbackAnswered = 0, fallbackCorrect = 0, fallbackIncorrect = 0 }) => {
    const answeredCount = Math.max(0, toSafeNumber(summary?.totalAnswered) || toSafeNumber(fallbackAnswered));
    const correctCount = Math.max(0, toSafeNumber(summary?.totalCorrect) || toSafeNumber(fallbackCorrect));
    const incorrectCount = Math.max(0, toSafeNumber(summary?.totalIncorrect) || toSafeNumber(fallbackIncorrect));
    const unknownCount = Math.max(0, answeredCount - correctCount - incorrectCount);

    const overallCorrectRate = Number(summary?.overallCorrectRate);

    const correctPercent = answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;
    const incorrectPercent = answeredCount > 0 ? (incorrectCount / answeredCount) * 100 : 0;

    const donutStyle = {
        background: `conic-gradient(
            #22c55e 0% ${clamp(correctPercent, 0, 100)}%,
            #ef4444 ${clamp(correctPercent, 0, 100)}% ${clamp(correctPercent + incorrectPercent, 0, 100)}%,
            #94a3b8 ${clamp(correctPercent + incorrectPercent, 0, 100)}% 100%
        )`,
    };

    const legendItems = [
        { key: "correct", label: "Đúng", value: correctCount, color: "#22c55e" },
        { key: "incorrect", label: "Sai", value: incorrectCount, color: "#ef4444" },
        { key: "unknown", label: "Khác", value: unknownCount, color: "#94a3b8" },
    ];

    return (
        <Card className="w-full rounded-2xl border-pink-200 bg-gradient-to-br from-white to-pink-50/40 p-4">
            <div className="flex h-full flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Tổng quan câu sai</p>

                <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative h-40 w-40 shrink-0">
                        <div className="h-40 w-40 rounded-full" style={donutStyle} />
                        <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white">
                            <p className="text-2xl font-bold text-slate-800">
                                {Number.isFinite(overallCorrectRate) ? `${overallCorrectRate.toFixed(2)}%` : "--"}
                            </p>
                            <p className="text-xs font-medium text-slate-500">Tỷ lệ đúng</p>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-3 gap-1 md:w-auto md:grid-cols-1">
                        {legendItems.map((item) => (
                            <div
                                key={item.key}
                                className="w-full rounded-lg bg-[#00000005] px-2.5 py-2 text-center md:min-w-28 md:px-3 md:py-2.5 md:text-left"
                            >
                                <p className="text-xs font-medium" style={{ color: item.color }}>
                                    {item.label}
                                </p>
                                <p className="text-xs text-slate-700">
                                    {item.value}/{answeredCount}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default memo(RedoWrongSummaryDonutCard);
