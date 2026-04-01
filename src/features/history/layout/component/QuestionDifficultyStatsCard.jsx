import { memo, useMemo, useState } from "react";
import { Card } from "../../../../shared/components";
import { DIFFICULTY_META, resolveDifficultyMeta } from "../../../../shared/constants";

const DIFFICULTY_TABS = [
    { key: "NB", label: DIFFICULTY_META.NB?.label || "Nhận biết" },
    { key: "TH", label: DIFFICULTY_META.TH?.label || "Thông hiểu" },
    { key: "VD", label: DIFFICULTY_META.VD?.label || "Vận dụng" },
    { key: "VDC", label: DIFFICULTY_META.VDC?.label || "Vận dụng cao" },
    { key: "UNCATEGORIZED", label: "Chưa phân loại" },
];

const toSafeNumber = (value) => {
    const next = Number(value);
    return Number.isFinite(next) ? next : 0;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const buildDifficultyMap = (byDifficulty) => {
    const source = Array.isArray(byDifficulty) ? byDifficulty : [];

    const mappedByCode = source.reduce((acc, item) => {
        const code = String(item?.difficulty || "").trim().toUpperCase();
        if (!code) return acc;
        acc[code] = item;
        return acc;
    }, {});

    const uncategorized = source.find((item) => item?.difficulty == null || String(item?.difficulty || "").trim() === "") || {};

    return DIFFICULTY_TABS.reduce((acc, tab) => {
        const isUncategorized = tab.key === "UNCATEGORIZED";
        const raw = isUncategorized ? uncategorized : mappedByCode[tab.key] || {};
        const meta = isUncategorized ? null : resolveDifficultyMeta(tab.key);
        const answeredCount = Math.max(0, toSafeNumber(raw?.answeredCount));
        const correctCount = Math.max(0, toSafeNumber(raw?.correctCount));
        const incorrectCount = Math.max(0, toSafeNumber(raw?.incorrectCount));
        const unknownCount = Math.max(0, answeredCount - correctCount - incorrectCount);

        const providedRate = Number(raw?.correctRate);
        const correctRate = Number.isFinite(providedRate)
            ? clamp(providedRate, 0, 100)
            : answeredCount > 0
                ? clamp((correctCount / answeredCount) * 100, 0, 100)
                : 0;

        acc[tab.key] = {
            key: tab.key,
            label: raw?.label || meta?.label || tab.label,
            className: meta?.className || "text-slate-700 bg-slate-50 border-slate-200",
            answeredCount,
            correctCount,
            incorrectCount,
            unknownCount,
            correctRate,
        };

        return acc;
    }, {});
};

const QuestionDifficultyStatsCard = ({ byDifficulty }) => {
    const difficultyMap = useMemo(() => buildDifficultyMap(byDifficulty), [byDifficulty]);
    const [activeKey, setActiveKey] = useState("NB");

    const activeItem = difficultyMap[activeKey] || difficultyMap.NB;
    const hasAnyAnswered = DIFFICULTY_TABS.some((tab) => (difficultyMap[tab.key]?.answeredCount || 0) > 0);

    const correctPercent = activeItem?.answeredCount > 0 ? (activeItem.correctCount / activeItem.answeredCount) * 100 : 0;
    const incorrectPercent = activeItem?.answeredCount > 0 ? (activeItem.incorrectCount / activeItem.answeredCount) * 100 : 0;

    const donutStyle = {
        background: `conic-gradient(
            #22c55e 0% ${clamp(correctPercent, 0, 100)}%,
            #ef4444 ${clamp(correctPercent, 0, 100)}% ${clamp(correctPercent + incorrectPercent, 0, 100)}%,
            #94a3b8 ${clamp(correctPercent + incorrectPercent, 0, 100)}% 100%
        )`,
    };

    const legendItems = [
        { key: "correct", label: "Đúng", value: activeItem?.correctCount || 0, color: "#22c55e" },
        { key: "incorrect", label: "Sai", value: activeItem?.incorrectCount || 0, color: "#ef4444" },
        { key: "unknown", label: "Khác", value: activeItem?.unknownCount || 0, color: "#94a3b8" },
    ];

    return (
        <Card className="w-full rounded-2xl border-slate-200 p-4">
            <div className="flex h-full flex-col gap-3">
                <p className="text-xs uppercase text-slate-500">Theo độ khó</p>

                <div className="-mx-1 overflow-x-auto px-1">
                    <div className="inline-flex min-w-full gap-1.5 pb-1">
                        {DIFFICULTY_TABS.map((tab) => {
                            const isActive = tab.key === activeKey;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveKey(tab.key)}
                                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                                        isActive
                                            ? "border-slate-800 bg-slate-800 text-white"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {!hasAnyAnswered ? (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center text-xs text-slate-500">
                        Chưa có dữ liệu theo độ khó.
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                                    activeItem?.className || "text-slate-700 bg-slate-50 border-slate-200"
                                }`}
                            >
                                {activeItem?.label || "--"}
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="relative h-40 w-40 shrink-0">
                                <div className="h-40 w-40 rounded-full" style={donutStyle} />
                                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white">
                                    <p className="text-2xl font-bold text-slate-800">{(activeItem?.correctRate || 0).toFixed(2)}%</p>
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
                                            {item.value}/{activeItem?.answeredCount || 0}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};

export default memo(QuestionDifficultyStatsCard);
