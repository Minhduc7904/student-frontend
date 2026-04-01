import { memo } from "react";
import { Pagination } from "../../../shared/components";
import MarkdownRenderer from "../../../shared/components/markdown/MarkdownRenderer";
import "../../competition/ranking/ranking-loading.css";

const pickFirstDefined = (obj, keys) => {
    for (const key of keys) {
        const value = obj?.[key];
        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }
    return "";
};

const normalizeHistoryItems = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.history)) return data.history;
    if (Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const formatDateTime = (value) => {
    if (!value) return "--";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("vi-VN");
};

const formatTimeSpent = (item) => {
    const rawSeconds = Number(pickFirstDefined(item, ["timeSpentSeconds", "spentSeconds"]));
    if (!Number.isFinite(rawSeconds) || rawSeconds < 0) return "--";

    const totalSeconds = Math.max(0, Math.round(rawSeconds));
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;

    if (hh > 0) {
        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    }

    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};

const truncateText = (value, maxLength = 110) => {
    const text = String(value || "").trim();
    if (!text) return "--";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}...`;
};

const getResultMeta = (item) => {
    const isCorrect = pickFirstDefined(item, ["isCorrect", "correct"]);

    if (isCorrect === true) {
        return {
            text: "Đúng",
            className: "bg-emerald-50 text-emerald-700",
        };
    }

    if (isCorrect === false) {
        return {
            text: "Sai",
            className: "bg-rose-50 text-rose-700",
        };
    }

    return {
        text: "--",
        className: "bg-slate-100 text-slate-700",
    };
};

const getRowHighlightClass = (index) => {
    return index % 2 === 0 ? "border-transparent bg-[#f8fafc]" : "border-transparent bg-[#f1f5f9]";
};

const QuestionHistoryList = ({ data, pagination, loading, error, emptyText, onPageChange }) => {
    const items = normalizeHistoryItems(data);
    const paginationData = pagination || data?.pagination || data?.meta || null;

    const total = paginationData?.total ?? items.length;
    const currentPage = Number(paginationData?.page) || 1;
    const totalPages = Number(paginationData?.totalPages) || 1;

    const normalizedError = !error
        ? ""
        : typeof error === "string"
            ? error
            : error?.message || "Không thể tải lịch sử câu hỏi.";

    const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

    if (loading) {
        return (
            <div className="w-full overflow-hidden">
                <div className="hidden w-full md:block">
                    <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-500">
                        <div className="w-16 text-start">#</div>
                        <div className="w-[56%] text-start">Nội dung câu hỏi</div>
                        <div className="w-[14%] text-start">Kết quả</div>
                        <div className="flex-1 text-start">Thời gian</div>
                    </div>

                    <div className="mt-2 flex flex-col gap-0.5">
                        {skeletonRows.map((rowIndex) => (
                            <div
                                key={`question-history-skeleton-${rowIndex}`}
                                className="ranking-skeleton-row flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 even:bg-[#f1f5f9]"
                            >
                                <div className="w-16">
                                    <div className="ranking-skeleton-block h-4 w-8 rounded-md" />
                                </div>
                                <div className="w-[56%]">
                                    <div className="ranking-skeleton-block h-4 w-4/5 rounded-md" />
                                </div>
                                <div className="w-[14%]">
                                    <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                </div>
                                <div className="flex-1">
                                    <div className="ranking-skeleton-block h-4 w-28 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-2 space-y-2 md:hidden">
                    {skeletonRows.slice(0, 5).map((rowIndex) => (
                        <div
                            key={`question-history-mobile-skeleton-${rowIndex}`}
                            className="rounded-xl border border-transparent bg-[#f8fafc] p-3 even:bg-[#f1f5f9]"
                        >
                            <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (normalizedError) {
        return (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                {normalizedError}
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                {emptyText || "Chưa có dữ liệu lịch sử câu hỏi."}
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            <div className="hidden w-full md:block">
                <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                    <div className="w-16 text-start">#</div>
                    <div className="w-[56%] text-start">Nội dung câu hỏi</div>
                    <div className="w-[14%] text-start">Kết quả</div>
                    <div className="flex-1 text-start">Thời gian</div>
                </div>

                <div className="mt-2 flex flex-col gap-0.5">
                    {items.map((item, index) => {
                        const questionMarkdown = pickFirstDefined(item, [
                            "processedQuestionContent",
                            "questionContent",
                            "content",
                            "questionTitle",
                            "title",
                            "name",
                        ]);
                        const title = truncateText( pickFirstDefined(item, [
                            "questionContent",
                            "content",
                            "questionTitle",
                            "title",
                            "name",
                        ]));
                        const timeSpent = formatTimeSpent(item);
                        const resultMeta = getResultMeta(item);

                        return (
                            <div
                                key={`question-${pickFirstDefined(item, ["questionAnswerId", "id"]) || "row"}-${index}`}
                                className={`group ranking-wave-row flex items-start border px-4 py-2.5 transition-all duration-300 ease-out hover:shadow-sm hover:ring-1 hover:ring-blue-100 ${getRowHighlightClass(index)}`}
                                tabIndex={0}
                            >
                                <div className="w-16 pt-0.5 text-sm font-semibold text-gray-700">#{index + 1}</div>
                                <div className="w-[56%] text-start text-sm text-gray-700">
                                    <div className="max-h-16 overflow-hidden opacity-100 transition-all duration-300 ease-out group-hover:delay-150 group-focus-within:delay-150 group-hover:max-h-0 group-hover:opacity-0 group-focus-within:max-h-0 group-focus-within:opacity-0">
                                        <p className="font-medium text-gray-700 transition-colors duration-300 group-hover:text-slate-900">
                                            {title}
                                        </p>
                                    </div>

                                    <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:delay-150 group-focus-within:delay-150 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
                                        <div className="min-h-0 overflow-hidden">
                                            <div className="mt-2 h-full rounded-lg">
                                                <MarkdownRenderer content={questionMarkdown} className="h-full text-text-5 leading-relaxed" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[14%] pt-0.5 text-start text-sm">
                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${resultMeta.className}`}>
                                        {resultMeta.text}
                                    </span>
                                </div>
                                <div className="flex-1 pt-0.5 text-start text-sm text-gray-700">{timeSpent}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2 md:hidden">
                {items.map((item, index) => {
                    const questionMarkdown = pickFirstDefined(item, [
                        "processedQuestionContent",
                        "questionContent",
                        "content",
                        "questionTitle",
                        "title",
                        "name",
                    ]);
                    const title = truncateText(questionMarkdown, 90);
                    const timeSpent = formatTimeSpent(item);
                    const resultMeta = getResultMeta(item);

                    return (
                        <article
                            key={`question-mobile-${pickFirstDefined(item, ["questionAnswerId", "id"]) || "row"}-${index}`}
                            className={`rounded-xl border px-3 py-3 ${getRowHighlightClass(index)}`}
                        >
                            <div className="mt-2 rounded-md border border-slate-200 bg-white/80 p-2">
                                <MarkdownRenderer
                                    content={questionMarkdown}
                                    className="text-text-5 leading-relaxed"
                                />
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                    Kết quả: <span className="font-semibold text-slate-900">{resultMeta.text}</span>
                                </div>
                                <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                    Thời gian: <span className="font-semibold text-slate-900">{timeSpent}</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">Tổng {total} bản ghi</p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    disabled={loading || !onPageChange}
                />
            </div>
        </div>
    );
};

export default memo(QuestionHistoryList);
