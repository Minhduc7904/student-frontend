import { memo, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import { ZoomIn, X } from "lucide-react";
import { Card } from "../../../../shared/components";

if (typeof HighchartsMore === "function") {
    HighchartsMore(Highcharts);
}

const CHART_SIZE_BY_VARIANT = {
    compact: {
        height: 240,
        minSize: "18%",
        maxSize: "72%",
    },
    modal: {
        height: 420,
        minSize: "14%",
        maxSize: "60%",
    },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeBubbleValue = (rawValue, chapterCount, variant) => {
    const safeRaw = Math.max(1, Number(rawValue) || 1);
    const logScaled = Math.log2(safeRaw + 1) * 9;

    const floorValue =
        chapterCount >= 18
            ? variant === "modal"
                ? 10
                : 8
            : chapterCount >= 12
                ? variant === "modal"
                    ? 8
                    : 6
                : 1;

    return Math.max(floorValue, logScaled);
};

const getBubbleColor = (ratio) => {
    const safeRatio = clamp(Number(ratio) || 0, 0, 1);
    const base = 0.2 + safeRatio * 0.45;
    return `rgba(34, 197, 94, ${base.toFixed(3)})`;
};

const QuestionChapterBubbleClusterCard = ({
    byChapter,
    onExpand,
    variant = "compact",
    showExpandButton = true,
    onClose,
}) => {
    const chartConfig =
        CHART_SIZE_BY_VARIANT[variant] || CHART_SIZE_BY_VARIANT.compact;

    const { height: chartHeight, minSize, maxSize } = chartConfig;
    const isModal = variant === "modal";

    const points = useMemo(() => {
        const source = Array.isArray(byChapter) ? byChapter : [];
        const chapterCount = source.length;

        return source.map((item, index) => {
            const totalQuestions = Math.max(
                0,
                Number(item?.totalQuestionsInChapter) || 0
            );
            const answeredCount = Math.max(
                0,
                Number(item?.answeredCount) || 0
            );
            const correctCount = Math.max(
                0,
                Number(item?.correctCount) || 0
            );
            const incorrectCount = Math.max(
                0,
                Number(item?.incorrectCount) || 0
            );

            const label = item?.chapterName || "Không có chapter";

            const fillRatio =
                totalQuestions > 0
                    ? clamp(answeredCount / totalQuestions, 0, 1)
                    : answeredCount > 0
                        ? 1
                        : 0;

            const rawBubbleValue =
                totalQuestions > 0
                    ? totalQuestions
                    : Math.max(1, answeredCount);

            const bubbleValue = normalizeBubbleValue(rawBubbleValue, chapterCount, variant);

            return {
                id: `${item?.chapterId ?? "null"}-${index}`,
                name: label,
                value: bubbleValue,
                color: getBubbleColor(fillRatio),
                borderColor: "#1e40af",
                custom: {
                    chapterName: label,
                    chapterId: item?.chapterId,
                    totalQuestions,
                    answeredCount,
                    correctCount,
                    incorrectCount,
                    correctRate: Number(item?.correctRate) || 0,
                    rawBubbleValue,
                },
            };
        });
    }, [byChapter, variant]);

    const options = useMemo(() => {
        const chapterCount = points.length;
        const denseMode = chapterCount >= 12;
        const resolvedChartHeight = isModal
            ? chapterCount >= 20
                ? 560
                : chapterCount >= 14
                    ? 500
                    : chartHeight
            : chapterCount >= 20
                ? 360
                : chapterCount >= 14
                    ? 320
                    : chapterCount >= 10
                        ? 300
                        : chartHeight;

        const resolvedMaxSize =
            chapterCount <= 2
                ? "48%"
                : chapterCount <= 4
                    ? "56%"
                    : chapterCount <= 8
                        ? maxSize
                        : variant === "modal"
                            ? "54%"
                            : "66%";

        const resolvedMinSize =
            chapterCount <= 2
                ? "20%"
                : chapterCount <= 4
                    ? "18%"
                    : denseMode
                        ? isModal
                            ? "13%"
                            : "14%"
                        : minSize;

        return {
            chart: {
                type: "packedbubble",
                height: resolvedChartHeight,
                backgroundColor: "transparent",
                spacing: [4, 4, 4, 4],
            },

            title: { text: undefined },
            credits: { enabled: false },
            legend: { enabled: false },

            tooltip: {
                useHTML: false,
                // In modal, keep tooltip inside chart to avoid being hidden by backdrop stacking context.
                outside: !isModal,
                headerFormat: "",
                pointFormatter: function () {
                    const meta = this.custom || {};
                    return `<span style="font-size:12px;line-height:1.45;">
                        <span style="font-weight:600;color:#0f172a;">${meta.chapterName || this.name}</span><br/>
                        Tổng câu: ${meta.totalQuestions ?? 0}<br/>
                        Đã trả lời: ${meta.answeredCount ?? 0}<br/>
                        Đúng: ${meta.correctCount ?? 0}<br/>
                        Sai: ${meta.incorrectCount ?? 0}<br/>
                        Tỷ lệ đúng: ${meta.correctRate ?? 0}%
                    </span>`;
                },
                style: {
                    zIndex: 30,
                },
            },

            plotOptions: {
                packedbubble: {
                    minSize: resolvedMinSize,
                    maxSize: resolvedMaxSize,
                    zMin: 0,
                    zMax: Math.max(
                        ...points.map((point) => point.value),
                        1
                    ),

                    layoutAlgorithm: {
                        splitSeries: false,
                        gravitationalConstant: denseMode ? 0.02 : 0.03,
                        dragBetweenSeries: false,
                        parentNodeLimit: true,
                        bubblePadding: denseMode ? 2 : 5,
                    },

                    dataLabels: {
                        enabled: true,
                        // HTML labels create a separate DOM layer that can cover tooltip in modal.
                        useHTML: !isModal,
                        formatter: function () {
                            const name =
                                this.point?.custom?.chapterName ||
                                this.point?.name ||
                                "Khác";

                            const value = Number(this.point?.custom?.rawBubbleValue) || 0;

                            // 🧠 split theo từ (không cắt ngu)
                            const split = (text, maxLen, maxLines) => {
                                const words = text.split(" ");
                                const lines = [];
                                let current = "";

                                for (const w of words) {
                                    if ((current + " " + w).trim().length <= maxLen) {
                                        current = (current + " " + w).trim();
                                    } else {
                                        lines.push(current);
                                        current = w;
                                    }
                                    if (lines.length === maxLines) break;
                                }

                                if (lines.length < maxLines && current) {
                                    lines.push(current);
                                }

                                // nếu vẫn còn dư chữ → thêm ...
                                if (words.join(" ").length > lines.join(" ").length) {
                                    lines[lines.length - 1] += "...";
                                }

                                return lines.join("<br/>");
                            };

                            // 🎯 scale theo size bubble
                            if (value < 4) {
                                return `<span style="font-size:9px">${split(name, 8, 1)}</span>`;
                            }

                            if (value < 10) {
                                return `<span style="font-size:10px">${split(name, 10, 2)}</span>`;
                            }

                            if (value < 20) {
                                return `<span style="font-size:11px">${split(name, 12, 2)}</span>`;
                            }

                            return `<span style="font-size:12px;font-weight:600">${split(name, 14, 3)}</span>`;
                        },
                        backgroundColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 0,
                        padding: 0,
                        style: {
                            color: "#15803d",
                            textOutline: "none",
                            fontSize:
                                variant === "modal" ? "10px" : "9px",
                            fontWeight: "700",
                            textAlign: "center",
                            pointerEvents: "none", // 🔥 tránh chặn hover tooltip
                            zIndex: 1,
                        },
                    },

                    marker: {
                        lineColor: "transparent",
                        lineWidth: 0,
                        fillOpacity: 0.92,
                    },
                },
            },

            responsive: {
                rules: isModal
                    ? [
                        {
                            condition: { maxWidth: 640 },
                            chartOptions: {
                                chart: { height: 320 },
                                plotOptions: {
                                    packedbubble: {
                                        dataLabels: { style: { fontSize: "9px" } },
                                    },
                                },
                            },
                        },
                        {
                            condition: { minWidth: 641, maxWidth: 1024 },
                            chartOptions: {
                                chart: { height: 420 },
                            },
                        },
                        {
                            condition: { minWidth: 1025 },
                            chartOptions: {
                                chart: { height: 560 },
                                plotOptions: {
                                    packedbubble: {
                                        dataLabels: { style: { fontSize: "11px" } },
                                    },
                                },
                            },
                        },
                    ]
                    : [
                        {
                            condition: { maxWidth: 640 },
                            chartOptions: {
                                chart: { height: 220 },
                                plotOptions: {
                                    packedbubble: {
                                        dataLabels: { style: { fontSize: "8px" }, padding: 3 },
                                    },
                                },
                            },
                        },
                        {
                            condition: { minWidth: 641 },
                            chartOptions: {
                                chart: { height: 280 },
                            },
                        },
                    ],
            },

            series: [
                {
                    name: "Chapter",
                    data: points,
                },
            ],
        };
    }, [chartHeight, isModal, maxSize, minSize, points, variant]);

    return (
        <Card className={`w-full rounded-2xl border-slate-200 ${isModal ? "p-3 sm:p-4" : "p-4"}`}>
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs uppercase text-slate-500">
                        Theo Chương
                    </p>

                    {showExpandButton ? (
                        <button
                            type="button"
                            onClick={onExpand}
                            className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        >
                            <ZoomIn size={14} />
                        </button>
                    ) : null}
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                            aria-label="Đóng modal"
                        >
                            <X size={16} />
                        </button>)}
                </div>

                {!points.length ? (
                    <div className="mt-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center text-xs text-slate-500">
                        Chưa có dữ liệu.
                    </div>
                ) : (
                    <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/60 p-2">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default memo(QuestionChapterBubbleClusterCard);