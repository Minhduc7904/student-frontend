import { memo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { ZoomIn, X } from "lucide-react";
import { Card } from "../../../../shared/components";
import { Modal } from "../../../../shared/components/modal/Modal";
import QuestionStatsSummaryDonutCard from "./QuestionStatsSummaryDonutCard";
import QuestionChapterBubbleClusterCard from "./QuestionChapterBubbleClusterCard";
import QuestionDifficultyStatsCard from "./QuestionDifficultyStatsCard";

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

const formatXAxisLabelMultiline = (value) => {
    const [datePart = "--", timePart = ""] = String(value || "").split(" ");
    return timePart ? `${datePart}\n${timePart}` : datePart;
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

const SmoothLineChartCard = ({
    title,
    subtitle,
    items,
    chartType,
    onlySubmitted = false,
    variant = "compact",
    showExpandButton = true,
    onExpand,
    onClose,
}) => {
    const chartData = buildChartData(items, { onlySubmitted });
    const isModal = variant === "modal";
    const chartHeight = isModal ? 420 : 260;
    const maxVisibleTicks = isModal ? 10 : 5;
    const axisInterval = chartData.length > maxVisibleTicks ? Math.ceil(chartData.length / maxVisibleTicks) - 1 : 0;

    const chartOption = {
        grid: {
            left: 38,
            right: 14,
            top: 18,
            bottom: 28,
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: chartData.map((row) => formatXAxisLabel(row.at)),
            axisLabel: {
                color: "#64748b",
                fontSize: isModal ? 10 : 9,
                interval: axisInterval,
                hideOverlap: true,
                lineHeight: isModal ? 14 : 12,
                margin: 10,
                formatter: (value) => formatXAxisLabelMultiline(value),
            },
            axisTick: { show: false },
            axisLine: { lineStyle: { color: "#e2e8f0" } },
        },
        yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: {
                color: "#64748b",
                fontSize: 10,
                formatter: "{value}%",
            },
            splitLine: {
                lineStyle: { color: "#e2e8f0", type: "dashed" },
            },
        },
        tooltip: {
            trigger: "axis",
            confine: true,
            backgroundColor: "rgba(255,255,255,0.98)",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            textStyle: {
                color: "#0f172a",
                fontSize: 12,
            },
            formatter: (params) => {
                const row = chartData[params?.[0]?.dataIndex] || null;
                if (!row) return "";

                const titleLabel = getTitleByType(row.item, chartType);
                const scoreLabel = formatScorePair(row.item);
                const timeSpentLabel = formatTimeSpent(row.item);
                const percentLabel = Number(row.percent || 0).toFixed(2);

                return `
                    <div style="display:flex;flex-direction:column;gap:4px;min-width:180px;">
                        <div style="font-weight:700;color:#0f172a;">${titleLabel}</div>
                        <div>Thời điểm: ${formatXAxisLabel(row.at)}</div>
                        <div>Điểm: ${scoreLabel}</div>
                        <div>Tỷ lệ: ${percentLabel}%</div>
                        <div>Thời gian làm bài: ${timeSpentLabel}</div>
                    </div>
                `;
            },
        },
        series: [
            {
                data: chartData.map((row) => Number(row.percent.toFixed(2))),
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 7,
                lineStyle: {
                    width: 3,
                    color: "#2563eb",
                },
                itemStyle: {
                    color: "#2563eb",
                    borderColor: "#ffffff",
                    borderWidth: 1,
                },
                areaStyle: {
                    color: "rgba(37, 99, 235, 0.12)",
                },
            },
        ],
    };

    return (
        <Card className={`rounded-2xl border-slate-200 ${isModal ? "p-3 sm:p-4" : "p-4"}`}>
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                </div>

                {showExpandButton ? (
                    <button
                        type="button"
                        onClick={onExpand}
                        className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        aria-label="Phóng to biểu đồ"
                    >
                        <ZoomIn size={14} />
                    </button>
                ) : null}

                {onClose ? (
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        aria-label="Đóng modal"
                    >
                        <X size={16} />
                    </button>
                ) : null}
            </div>

            {chartData.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500">
                    Chưa có dữ liệu điểm để vẽ biểu đồ.
                </div>
            ) : (
                <div className="mt-3 rounded-xl border border-slate-100 bg-white px-2 py-2">
                    <ReactECharts option={chartOption} style={{ height: chartHeight, width: "100%" }} notMerge lazyUpdate />
                </div>
            )}
        </Card>
    );
};

export const CompetitionHistoryStatsSidebar = memo(({ submittedHistory }) => {
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const items = normalizeHistoryItems(submittedHistory);
    const submittedCount = items.filter((item) => isSubmittedItem(item)).length;

    return (
        <>
            <SmoothLineChartCard
                title="Thống kê cuộc thi"
                subtitle={`Đã nộp ${submittedCount} bài`}
                items={items}
                chartType="competition"
                onlySubmitted
                onExpand={() => setIsChartModalOpen(true)}
            />

            <Modal isOpen={isChartModalOpen} onClose={() => setIsChartModalOpen(false)}>
                <div
                    className="w-full max-h-[90vh] max-w-[96vw] overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-[92vw] lg:max-w-6xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="max-h-[calc(90vh-64px)] overflow-y-auto">
                        <SmoothLineChartCard
                            title="Thống kê cuộc thi"
                            subtitle={`Đã nộp ${submittedCount} bài`}
                            items={items}
                            chartType="competition"
                            onlySubmitted
                            variant="modal"
                            showExpandButton={false}
                            onClose={() => setIsChartModalOpen(false)}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
});

CompetitionHistoryStatsSidebar.displayName = "CompetitionHistoryStatsSidebar";

export const QuestionHistoryStatsSidebar = memo(({ questionHistory, questionStatistics, onOpenChapterModal }) => {
    const items = normalizeHistoryItems(questionHistory);
    const summary = questionStatistics?.summary || null;
    const answeredCount = summary?.totalAnswered ?? items.length;
    const correctCount = summary?.totalCorrect ?? items.filter((item) => item?.isCorrect === true).length;
    const incorrectCount = summary?.totalIncorrect ?? items.filter((item) => item?.isCorrect === false).length;
    const byChapter = Array.isArray(questionStatistics?.byChapter) ? questionStatistics.byChapter : [];
    const byDifficulty = Array.isArray(questionStatistics?.byDifficulty) ? questionStatistics.byDifficulty : [];

    return (
        <div className="space-y-4">
            <QuestionStatsSummaryDonutCard
                summary={summary}
                fallbackAnswered={answeredCount}
                fallbackCorrect={correctCount}
                fallbackIncorrect={incorrectCount}
            />
            <QuestionDifficultyStatsCard byDifficulty={byDifficulty} />
            <QuestionChapterBubbleClusterCard byChapter={byChapter} onExpand={onOpenChapterModal} />
        </div>
    );
});

QuestionHistoryStatsSidebar.displayName = "QuestionHistoryStatsSidebar";

export const ExamHistoryStatsSidebar = memo(({ examHistory }) => {
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const items = normalizeHistoryItems(examHistory);
    const submittedCount = items.filter((item) => isSubmittedItem(item)).length;

    return (
        <>
            <SmoothLineChartCard
                title="Thống kê đề mẫu"
                subtitle={`Đã nộp ${submittedCount} lượt`}
                items={items}
                chartType="exam"
                onlySubmitted
                onExpand={() => setIsChartModalOpen(true)}
            />

            <Modal isOpen={isChartModalOpen} onClose={() => setIsChartModalOpen(false)}>
                <div
                    className="w-full max-h-[90vh] max-w-[96vw] overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-[92vw] lg:max-w-6xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="max-h-[calc(90vh-64px)] overflow-y-auto">
                        <SmoothLineChartCard
                            title="Thống kê đề mẫu"
                            subtitle={`Đã nộp ${submittedCount} lượt`}
                            items={items}
                            chartType="exam"
                            onlySubmitted
                            variant="modal"
                            showExpandButton={false}
                            onClose={() => setIsChartModalOpen(false)}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
});

ExamHistoryStatsSidebar.displayName = "ExamHistoryStatsSidebar";
