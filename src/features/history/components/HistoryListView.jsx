import { memo } from "react";
import { HISTORY_TYPES } from "../constants";

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

const formatRelativeTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    const diffMs = Date.now() - date.getTime();
    if (diffMs <= 0) return "Vừa xong";

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} tháng trước`;

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} năm trước`;
};

const formatPointsText = (item) => {
    const totalPoints = pickFirstDefined(item, ["totalPoints", "totalPoint"]);
    const maxPoints = pickFirstDefined(item, ["maxPoints", "maxPoint"]);

    if (totalPoints !== "" && maxPoints !== "") {
        return `${totalPoints}/${maxPoints}`;
    }

    const fallbackScore = pickFirstDefined(item, ["score", "point"]);
    return fallbackScore !== "" ? String(fallbackScore) : "";
};

const getHistoryRowModel = (item, index, type) => {
    if (type === HISTORY_TYPES.COMPETITION) {
        const title =
            pickFirstDefined(item, ["competitionTitle", "title", "name"]) ||
            `Bài nộp cuộc thi #${index + 1}`;
        const time = formatRelativeTime(pickFirstDefined(item, ["submittedAt", "createdAt", "updatedAt"]));
        const pointsText = formatPointsText(item);

        return {
            title,
            timeText: time,
            rightText: pointsText !== "" ? `Điểm: ${pointsText}` : "",
            badgeClass: "bg-emerald-50 text-emerald-700",
        };
    }

    if (type === HISTORY_TYPES.QUESTION) {
        const title =
            pickFirstDefined(item, ["questionContent", "content", "questionTitle", "title", "name"]) ||
            `Câu hỏi #${index + 1}`;
        const answeredAt = formatRelativeTime(pickFirstDefined(item, ["answeredAt", "createdAt", "updatedAt"]));
        const isCorrect = pickFirstDefined(item, ["isCorrect", "correct"]);
        const correctText = isCorrect === true ? "Đúng" : isCorrect === false ? "Sai" : "--";

        return {
            title,
            timeText: answeredAt,
            rightText: `isCorrect: ${correctText}`,
            badgeClass:
                isCorrect === false
                    ? "bg-rose-50 text-rose-700"
                    : "bg-blue-50 text-blue-700",
        };
    }

    const title =
        pickFirstDefined(item, ["examTitle", "title", "name"]) ||
        `Đề mẫu #${index + 1}`;
    const attemptedAt = formatRelativeTime(pickFirstDefined(item, ["attemptedAt", "submittedAt", "createdAt", "updatedAt"]));
    const pointsText = formatPointsText(item);

    return {
        title,
        timeText: attemptedAt,
        rightText: pointsText !== "" ? `Điểm: ${pointsText}` : "",
        badgeClass: "bg-violet-50 text-violet-700",
    };
};

const HistoryListView = ({ data, loading, type, emptyText }) => {
    const items = normalizeHistoryItems(data);

    if (loading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-12 animate-pulse rounded-md bg-gray-100" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return <p className="text-sm text-gray-500">{emptyText || "Chưa có dữ liệu lịch sử."}</p>;
    }

    return (
        <div className="space-y-2">
            {items.map((item, index) => {
                const rowModel = getHistoryRowModel(item, index, type);
                const rowKey = pickFirstDefined(item, ["id", "submitId", "attemptId", "questionAnswerId"]);

                return (
                    <div
                        key={rowKey || `${rowModel.title}-${index}`}
                        className={`flex flex-col items-start justify-between gap-2 rounded-lg px-3 py-2 sm:flex-row sm:items-center ${
                            index % 2 === 0 ? "bg-[#F7F7F8]" : "bg-white"
                        }`}
                    >
                        <div className="min-w-0 w-full sm:w-auto">
                            <p className="line-clamp-2 text-sm font-medium text-gray-900 sm:truncate">{rowModel.title}</p>
                            <p className="mt-0.5 text-xs text-gray-500">{rowModel.timeText || "Vừa xong"}</p>
                        </div>

                        {rowModel.rightText ? (
                            <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium sm:ml-4 ${rowModel.badgeClass}`}>
                                {rowModel.rightText}
                            </span>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};

export default memo(HistoryListView);
