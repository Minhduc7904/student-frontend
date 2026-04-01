import { memo, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import { Search } from "lucide-react";
import { Card } from "../../../../shared/components";

if (typeof HighchartsMore === "function") {
    HighchartsMore(Highcharts);
}

const CHART_SIZE_BY_VARIANT = {
    compact: {
        height: 280,
        minSize: "28%",
        maxSize: "120%",
    },
    modal: {
        height: 560,
        minSize: "20%",
        maxSize: "130%",
    },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const splitLabel = (text = "", maxLineLength = 12, maxLines = 2) => {
    if (!text) return "Không có chapter";

    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
        if ((currentLine + " " + word).trim().length <= maxLineLength) {
            currentLine = (currentLine + " " + word).trim();
        } else {
            lines.push(currentLine);
            currentLine = word;
        }

        if (lines.length === maxLines) break;
    }

    if (lines.length < maxLines && currentLine) {
        lines.push(currentLine);
    }

    if (lines.length > maxLines) {
        lines[maxLines - 1] += "...";
    }

    return lines.join("<br/>");
};

const getBubbleColor = (ratio) => {
    const safeRatio = clamp(Number(ratio) || 0, 0, 1);
    const base = 0.25 + safeRatio * 0.65;
    return `rgba(59, 130, 246, ${base.toFixed(3)})`;
};

const QuestionChapterBubbleClusterCard = ({
    byChapter,
    onExpand,
    variant = "compact",
    showExpandButton = true,
}) => {
    const chartConfig =
        CHART_SIZE_BY_VARIANT[variant] || CHART_SIZE_BY_VARIANT.compact;

    const { height: chartHeight, minSize, maxSize } = chartConfig;
    const isModal = variant === "modal";

    const points = useMemo(() => {
        const source = Array.isArray(byChapter) ? byChapter : [];

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

            const bubbleValue =
                totalQuestions > 0
                    ? totalQuestions
                    : Math.max(1, answeredCount);

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
                },
            };
        });
    }, [byChapter]);

    const options = useMemo(() => {
        return {
            chart: {
                type: "packedbubble",
                height: chartHeight,
                backgroundColor: "transparent",
                spacing: [4, 4, 4, 4],
            },

            title: { text: undefined },
            credits: { enabled: false },
            legend: { enabled: false },

            tooltip: {
                useHTML: true,
                // In modal, keep tooltip inside chart to avoid being hidden by backdrop stacking context.
                outside: !isModal,
                headerFormat: "",
                pointFormatter: function () {
                    const meta = this.custom || {};
                    return `<div style="font-size:12px;line-height:1.45;">
                        <div style="font-weight:600;color:#0f172a;margin-bottom:4px;">
                            ${meta.chapterName || this.name}
                        </div>
                        <div>Tổng câu: ${meta.totalQuestions ?? 0}</div>
                        <div>Đã trả lời: ${meta.answeredCount ?? 0}</div>
                        <div>Đúng: ${meta.correctCount ?? 0}</div>
                        <div>Sai: ${meta.incorrectCount ?? 0}</div>
                        <div>Tỷ lệ đúng: ${meta.correctRate ?? 0}%</div>
                    </div>`;
                },
            },

            plotOptions: {
                packedbubble: {
                    minSize,
                    maxSize,
                    zMin: 0,
                    zMax: Math.max(
                        ...points.map((point) => point.value),
                        1
                    ),

                    layoutAlgorithm: {
                        splitSeries: false,
                        gravitationalConstant: 0.03,
                        dragBetweenSeries: false,
                        parentNodeLimit: true,
                        bubblePadding: 5,
                    },

                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        formatter: function () {
                            const value = this.point.value;
                            const name = this.point.custom.chapterName;

                            // bubble nhỏ → label cực ngắn
                            if (value < 5) {
                                return splitLabel(name, 8, 1); // 1 dòng, ngắn
                            }

                            // bubble vừa
                            if (value < 15) {
                                return splitLabel(name, 10, 2);
                            }

                            // bubble to
                            return splitLabel(name, 14, 2);
                        },
                        style: {
                            color: "#0f172a",
                            textOutline: "none",
                            fontSize:
                                variant === "modal" ? "11px" : "9px",
                            fontWeight: "600",
                            textAlign: "center",
                            pointerEvents: "none", // 🔥 tránh chặn hover tooltip
                        },
                    },

                    marker: {
                        lineColor: "#1e40af",
                        lineWidth: 1.5,
                    },
                },
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
        <Card className="w-full rounded-2xl border-slate-200 p-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs uppercase text-slate-500">
                        Theo chapter
                    </p>

                    {showExpandButton ? (
                        <button
                            type="button"
                            onClick={onExpand}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        >
                            <Search size={14} />
                        </button>
                    ) : null}
                </div>

                {!points.length ? (
                    <div className="mt-2 text-center text-xs text-slate-500">
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