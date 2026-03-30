import { memo } from "react";
import { Card, CustomTooltip } from "../../../../shared/components";

const normalizeHistoryItems = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.history)) return data.history;
    if (Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const normalizeStatus = (status) => String(status || "").trim().toUpperCase();

const pickFirstDefined = (obj, keys) => {
    for (const key of keys) {
        const value = obj?.[key];
        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }
    return null;
};

const toDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const formatXAxisLabel = (value) => {
    const date = toDate(value);
    if (!date) return "--";

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");

    return `${dd}/${mm} ${hh}:${mi}`;
};

const toPercent = (item) => {
    // Prefer points/maxPoints for exam attempts to avoid mismatched percentage fields.
    const points = Number(pickFirstDefined(item, ["totalPoints", "points", "score", "point"]));
    const maxPoints = Number(pickFirstDefined(item, ["maxPoints", "maxPoint", "totalScore"]));
    if (Number.isFinite(points) && Number.isFinite(maxPoints) && maxPoints > 0) {
        return Math.min(100, Math.max(0, (points / maxPoints) * 100));
    }

    const directPercent = Number(pickFirstDefined(item, ["scorePercentage", "percent", "percentage"]));
    if (Number.isFinite(directPercent)) {
        const normalizedPercent = directPercent > 0 && directPercent <= 1 ? directPercent * 100 : directPercent;
        return Math.min(100, Math.max(0, normalizedPercent));
    }

    return 0;
};

const formatScorePair = (item) => {
    const points = pickFirstDefined(item, ["totalPoints", "points", "score", "point"]);
    const maxPoints = pickFirstDefined(item, ["maxPoints", "maxPoint", "totalScore"]);

    if (points == null || maxPoints == null) return "--";
    return `${points}/${maxPoints}`;
};

const formatTimeSpent = (item) => {
    if (item?.timeSpentDisplay) return item.timeSpentDisplay;
    if (item?.workingTimeDisplay) return item.workingTimeDisplay;

    const rawSeconds = Number(pickFirstDefined(item, ["timeSpentSeconds", "workingTimeSeconds", "durationSeconds"]));
    if (Number.isFinite(rawSeconds) && rawSeconds >= 0) {
        const totalSeconds = Math.floor(rawSeconds);
        const hh = Math.floor(totalSeconds / 3600);
        const mm = Math.floor((totalSeconds % 3600) / 60);
        const ss = totalSeconds % 60;

        if (hh > 0) return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
        return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    }

    return "--";
};

const getTitleByType = (item, chartType) => {
    if (chartType === "competition") {
        return pickFirstDefined(item, ["competitionTitle", "title"]) || "--";
    }

    return pickFirstDefined(item, ["examTitle", "title"]) || "--";
};

const isSubmittedItem = (item) => {
    const status = normalizeStatus(item?.status);
    return status === "SUBMITTED" || status === "SUBMITED";
};

const buildChartData = (items, options = {}) => {
    const { onlySubmitted = false } = options;

    const rows = items
        .filter((item) => (onlySubmitted ? isSubmittedItem(item) : true))
        .map((item) => ({
            item,
            at: pickFirstDefined(item, ["submittedAt", "endAt", "updatedAt", "createdAt", "startedAt"]),
            percent: toPercent(item),
        }))
        .filter((row) => row.at != null)
        .sort((a, b) => {
            const dateA = toDate(a.at)?.getTime() || 0;
            const dateB = toDate(b.at)?.getTime() || 0;
            return dateA - dateB;
        });

    return rows;
};

const BarChart = ({ title, subtitle, items, chartType, onlySubmitted = false }) => {
    const chartData = buildChartData(items, { onlySubmitted });

    return (
        <Card>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

            {chartData.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500">
                    Chưa có dữ liệu điểm để vẽ biểu đồ.
                </div>
            ) : (
                <div className="mt-4">
                    <div className="flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
                        <span className="text-[11px] font-medium text-slate-500">0%</span>
                        <span className="text-[11px] font-medium text-slate-500">50%</span>
                        <span className="text-[11px] font-semibold text-slate-700">100%</span>
                    </div>

                    <div className="mt-3 overflow-x-auto">
                        <div className="flex min-w-[320px] items-end gap-2 pb-1">
                            {chartData.map((row, index) => {
                                const height = Math.max(8, Math.round((row.percent / 100) * 140));
                                const percentLabel = row.percent.toFixed(2);
                                const titleLabel = getTitleByType(row.item, chartType);
                                const scoreLabel = formatScorePair(row.item);
                                const timeSpentLabel = formatTimeSpent(row.item);
                                const tooltipContent = (
                                    <div className="space-y-1 text-xs text-slate-700">
                                        <p className="font-semibold text-slate-900">{titleLabel}</p>
                                        <p>Điểm: {scoreLabel}</p>
                                        <p>Thời gian làm bài: {timeSpentLabel}</p>
                                    </div>
                                );

                                return (
                                    <div key={`bar-${index}`} className="flex w-9 shrink-0 flex-col items-center gap-1">
                                        <CustomTooltip text={tooltipContent} className="w-full">
                                            <div className="h-36 w-full rounded-md bg-slate-100 p-0.5">
                                                <div
                                                    className="w-full rounded-sm bg-blue-500 transition-all duration-300"
                                                    style={{
                                                        height: `${height}px`,
                                                        marginTop: `${140 - height}px`,
                                                    }}
                                                />
                                            </div>
                                        </CustomTooltip>
                                        <span className="text-[10px] font-semibold text-slate-700">{percentLabel}%</span>
                                        <span className="w-full text-center text-[10px] text-slate-500 leading-tight">
                                            {formatXAxisLabel(row.at)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export const CompetitionHistoryStatsSidebar = memo(({ activityStats, submittedHistory }) => {
    const items = normalizeHistoryItems(submittedHistory);
    const submittedCount = items.filter((item) => isSubmittedItem(item)).length;

    return (
        <BarChart
            title="Thống kê cuộc thi"
            subtitle={`Đã nộp ${submittedCount} bài • Ngày hoạt động ${activityStats?.totalActiveDays || 0}`}
            items={items}
            chartType="competition"
            onlySubmitted
        />
    );
});

CompetitionHistoryStatsSidebar.displayName = "CompetitionHistoryStatsSidebar";

export const QuestionHistoryStatsSidebar = memo(({ activityStats, questionHistory }) => {
    const items = normalizeHistoryItems(questionHistory);
    const correctCount = items.filter((item) => item?.isCorrect === true).length;
    const incorrectCount = items.filter((item) => item?.isCorrect === false).length;

    return (
        <Card>
            <h2 className="text-lg font-semibold text-gray-800">Thống kê câu hỏi</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#F7F7F8] p-3">
                    <p className="text-xs text-gray-500">Tổng hoạt động trong năm</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{activityStats?.totalActivities || 0}</p>
                </div>

                <div className="rounded-lg bg-[#F7F7F8] p-3">
                    <p className="text-xs text-gray-500">Đã trả lời</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{items.length}</p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-600">Đúng</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-700">{correctCount}</p>
                </div>

                <div className="rounded-lg bg-rose-50 p-3">
                    <p className="text-xs text-rose-600">Sai</p>
                    <p className="mt-1 text-lg font-semibold text-rose-700">{incorrectCount}</p>
                </div>
            </div>
        </Card>
    );
});

QuestionHistoryStatsSidebar.displayName = "QuestionHistoryStatsSidebar";

export const ExamHistoryStatsSidebar = memo(({ activityStats, examHistory }) => {
    const items = normalizeHistoryItems(examHistory);
    const submittedCount = items.filter((item) => isSubmittedItem(item)).length;

    return (
        <BarChart
            title="Thống kê đề mẫu"
            subtitle={`Đã nộp ${submittedCount} lượt • Chuỗi dài nhất ${activityStats?.maxStreak || 0}`}
            items={items}
            chartType="exam"
            onlySubmitted
        />
    );
});

ExamHistoryStatsSidebar.displayName = "ExamHistoryStatsSidebar";
