import { memo, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import { ZoomIn, X } from "lucide-react";
import { Card } from "../../../../shared/components";

if (typeof HighchartsMore === "function") {
    HighchartsMore(Highcharts);
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const normalizeBubbleValue = (raw, count, variant) => {
    const s = Math.max(1, Number(raw) || 1);
    const log = Math.log2(s + 1) * 9;
    const floor = count >= 18 ? (variant === "modal" ? 10 : 8) : count >= 12 ? (variant === "modal" ? 8 : 6) : 1;
    return Math.max(floor, log);
};

const getBubbleColor = (ratio) => {
    const r = clamp(Number(ratio) || 0, 0, 1);
    return `rgba(236, 72, 153, ${(0.2 + r * 0.45).toFixed(3)})`;
};

const RedoWrongChapterBubbleClusterCard = ({ byChapter, onExpand, variant = "compact", showExpandButton = true, onClose }) => {
    const isModal = variant === "modal";
    const cfg = variant === "modal" ? { h: 420, min: "14%", max: "60%" } : { h: 240, min: "18%", max: "72%" };

    const points = useMemo(() => {
        const src = Array.isArray(byChapter) ? byChapter : [];
        const n = src.length;
        return src.map((item, i) => {
            const total = Math.max(0, Number(item?.totalQuestionsInChapter) || 0);
            const ans = Math.max(0, Number(item?.answeredCount) || 0);
            const cor = Math.max(0, Number(item?.correctCount) || 0);
            const inc = Math.max(0, Number(item?.incorrectCount) || 0);
            const label = item?.chapterName || "Không có chapter";
            const fill = total > 0 ? clamp(ans / total, 0, 1) : ans > 0 ? 1 : 0;
            const rawVal = total > 0 ? total : Math.max(1, ans);
            return {
                id: `${item?.chapterId ?? "null"}-${i}`, name: label,
                value: normalizeBubbleValue(rawVal, n, variant),
                color: getBubbleColor(fill), borderColor: "#be185d",
                custom: { chapterName: label, chapterId: item?.chapterId, totalQuestions: total, answeredCount: ans, correctCount: cor, incorrectCount: inc, correctRate: Number(item?.correctRate) || 0, rawBubbleValue: rawVal },
            };
        });
    }, [byChapter, variant]);

    const options = useMemo(() => {
        const n = points.length;
        const dense = n >= 12;
        const ch = isModal ? (n >= 20 ? 560 : n >= 14 ? 500 : cfg.h) : (n >= 20 ? 360 : n >= 14 ? 320 : n >= 10 ? 300 : cfg.h);
        const mx = n <= 2 ? "48%" : n <= 4 ? "56%" : n <= 8 ? cfg.max : isModal ? "54%" : "66%";
        const mn = n <= 2 ? "20%" : n <= 4 ? "18%" : dense ? (isModal ? "13%" : "14%") : cfg.min;

        const split = (text, maxLen, maxLines) => {
            const words = text.split(" "); const lines = []; let cur = "";
            for (const w of words) { if ((cur + " " + w).trim().length <= maxLen) { cur = (cur + " " + w).trim(); } else { lines.push(cur); cur = w; } if (lines.length === maxLines) break; }
            if (lines.length < maxLines && cur) lines.push(cur);
            if (words.join(" ").length > lines.join(" ").length) lines[lines.length - 1] += "...";
            return lines.join("<br/>");
        };

        return {
            chart: { type: "packedbubble", height: ch, backgroundColor: "transparent", spacing: [4, 4, 4, 4] },
            title: { text: undefined }, credits: { enabled: false }, legend: { enabled: false },
            tooltip: {
                useHTML: false, outside: !isModal, headerFormat: "",
                pointFormatter: function () {
                    const m = this.custom || {};
                    return `<span style="font-size:12px;line-height:1.45;"><span style="font-weight:600;color:#0f172a;">${m.chapterName || this.name}</span><br/>Tổng câu: ${m.totalQuestions ?? 0}<br/>Đã trả lời: ${m.answeredCount ?? 0}<br/>Đúng: ${m.correctCount ?? 0}<br/>Sai: ${m.incorrectCount ?? 0}<br/>Tỷ lệ đúng: ${m.correctRate ?? 0}%</span>`;
                },
                style: { zIndex: 30 },
            },
            plotOptions: {
                packedbubble: {
                    minSize: mn, maxSize: mx, zMin: 0, zMax: Math.max(...points.map((p) => p.value), 1),
                    layoutAlgorithm: { splitSeries: false, gravitationalConstant: dense ? 0.02 : 0.03, dragBetweenSeries: false, parentNodeLimit: true, bubblePadding: dense ? 2 : 5 },
                    dataLabels: {
                        enabled: true, useHTML: !isModal,
                        formatter: function () {
                            const name = this.point?.custom?.chapterName || this.point?.name || "Khác";
                            const v = Number(this.point?.custom?.rawBubbleValue) || 0;
                            if (v < 4) return `<span style="font-size:9px">${split(name, 8, 1)}</span>`;
                            if (v < 10) return `<span style="font-size:10px">${split(name, 10, 2)}</span>`;
                            if (v < 20) return `<span style="font-size:11px">${split(name, 12, 2)}</span>`;
                            return `<span style="font-size:12px;font-weight:600">${split(name, 14, 3)}</span>`;
                        },
                        backgroundColor: "transparent", borderWidth: 0, borderRadius: 0, padding: 0,
                        style: { color: "#9d174d", textOutline: "none", fontSize: isModal ? "10px" : "9px", fontWeight: "700", textAlign: "center", pointerEvents: "none", zIndex: 1 },
                    },
                    marker: { lineColor: "transparent", lineWidth: 0, fillOpacity: 0.92 },
                },
            },
            responsive: {
                rules: isModal
                    ? [{ condition: { maxWidth: 640 }, chartOptions: { chart: { height: 320 }, plotOptions: { packedbubble: { dataLabels: { style: { fontSize: "9px" } } } } } }, { condition: { minWidth: 641, maxWidth: 1024 }, chartOptions: { chart: { height: 420 } } }, { condition: { minWidth: 1025 }, chartOptions: { chart: { height: 560 }, plotOptions: { packedbubble: { dataLabels: { style: { fontSize: "11px" } } } } } }]
                    : [{ condition: { maxWidth: 640 }, chartOptions: { chart: { height: 220 }, plotOptions: { packedbubble: { dataLabels: { style: { fontSize: "8px" }, padding: 3 } } } } }, { condition: { minWidth: 641 }, chartOptions: { chart: { height: 280 } } }],
            },
            series: [{ name: "Chapter", data: points }],
        };
    }, [cfg.h, cfg.max, cfg.min, isModal, points, variant]);

    return (
        <Card className={`w-full rounded-2xl border-pink-200 ${isModal ? "p-3 sm:p-4" : "p-4"}`}>
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Theo Chương</p>
                    {showExpandButton ? (
                        <button type="button" onClick={onExpand} className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md border border-pink-200 bg-white text-pink-500 transition-colors hover:bg-pink-50 hover:text-pink-700">
                            <ZoomIn size={14} />
                        </button>
                    ) : null}
                    {onClose && (
                        <button type="button" onClick={onClose} className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md border border-pink-200 text-pink-500 transition-colors hover:bg-pink-50 hover:text-pink-700" aria-label="Đóng modal">
                            <X size={16} />
                        </button>
                    )}
                </div>
                {!points.length ? (
                    <div className="mt-2 rounded-lg border border-dashed border-pink-200 bg-pink-50 px-3 py-5 text-center text-xs text-pink-500">Chưa có dữ liệu.</div>
                ) : (
                    <div className="mt-2 rounded-xl border border-pink-100 bg-pink-50/60 p-2">
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default memo(RedoWrongChapterBubbleClusterCard);
