import { memo, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { ZoomIn, X } from "lucide-react";
import { Card } from "../card";

const pickFirstDefined = (obj, keys) => {
    for (const key of keys) {
        const value = obj?.[key];
        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }
    return null;
};

const normalizeStatus = (status) => String(status || "").trim().toUpperCase();

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

    return items
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
};

const SmoothLineChartCard = ({
    title,
    subtitle,
    items = [],
    chartType,
    onlySubmitted = false,
    variant = "compact",
    showExpandButton = true,
    onExpand,
    onClose,
    className = "",
    emptyText = "Chưa có dữ liệu điểm để vẽ biểu đồ.",
}) => {
    const chartData = useMemo(() => buildChartData(Array.isArray(items) ? items : [], { onlySubmitted }), [items, onlySubmitted]);
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
        <Card className={`rounded-2xl border-slate-200 ${isModal ? "p-3 sm:p-4" : "p-4"} ${className}`.trim()}>
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
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
                    {emptyText}
                </div>
            ) : (
                <div className="mt-3 rounded-xl border border-slate-100 bg-white px-2 py-2">
                    <ReactECharts option={chartOption} style={{ height: chartHeight, width: "100%" }} notMerge lazyUpdate />
                </div>
            )}
        </Card>
    );
};

SmoothLineChartCard.displayName = "SmoothLineChartCard";

export default memo(SmoothLineChartCard);
