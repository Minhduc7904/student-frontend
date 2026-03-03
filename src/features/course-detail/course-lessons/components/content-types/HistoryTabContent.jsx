import {
    Clock,
    FileText,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Trophy,
    AlertCircle,
    CheckCircle2,
    Hourglass,
    Eye,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { formatDateTime } from "@/shared/utils";
import { useCompetitionHistory } from "../../../hooks/useCompetitionHistory";

/**
 * Status badge configuration for competition submit statuses
 */
const SUBMIT_STATUS = {
    SUBMITTED: {
        label: "Đã nộp",
        bgClass: "bg-blue-100",
        textClass: "text-blue-700",
        Icon: CheckCircle2,
    },
    GRADED: {
        label: "Đã chấm",
        bgClass: "bg-green-100",
        textClass: "text-green-700",
        Icon: Trophy,
    },
};

/**
 * Format duration from seconds to readable string
 */
const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "N/A";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

/**
 * StatusBadge — hiển thị trạng thái lần thi
 */
const StatusBadge = ({ status }) => {
    const config = SUBMIT_STATUS[status] ?? {
        label: status,
        bgClass: "bg-gray-100",
        textClass: "text-gray-600",
        Icon: AlertCircle,
    };
    const { Icon } = config;

    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-text-5 font-medium ${config.bgClass} ${config.textClass}`}
        >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {config.label}
        </span>
    );
};

/**
 * HistoryRow — 1 hàng trong bảng lịch sử (desktop)
 */
const HistoryRow = ({ item, index, onViewResult }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition">
        {/* Lần thi */}
        <td className="py-3.5 px-4">
            <span className="text-text-4 font-semibold text-gray-900">
                #{item.attemptNumber ?? index + 1}
            </span>
        </td>

        {/* Trạng thái */}
        <td className="py-3.5 px-4">
            <StatusBadge status={item.status} />
        </td>

        {/* Điểm */}
        <td className="py-3.5 px-4">
            <span className="text-text-4 font-semibold text-gray-900">
                {item.totalPoints != null
                    ? `${item.totalPoints}/${item.maxPoints ?? "?"}`
                    : "Chờ chấm"}
            </span>
            {item.percentageScore != null && (
                <span className="text-text-5 text-gray-500 ml-1">
                    ({item.percentageScore.toFixed(1)}%)
                </span>
            )}
        </td>

        {/* Thời gian làm */}
        <td className="py-3.5 px-4">
            <span className="text-text-4 text-gray-700">
                {formatDuration(item.timeSpentSeconds)}
            </span>
        </td>

        {/* Thời gian nộp */}
        <td className="py-3.5 px-4">
            <span className="text-text-4 text-gray-700">
                {item.submittedAt ? formatDateTime(item.submittedAt) : "N/A"}
            </span>
        </td>

        {/* Xem kết quả */}
        <td className="py-3.5 px-4">
            {onViewResult && item.competitionSubmitId ? (
                <button
                    type="button"
                    onClick={() => onViewResult(item.competitionSubmitId)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-text-5 font-medium cursor-pointer transition active:scale-95 whitespace-nowrap"
                >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    Xem kết quả
                </button>
            ) : (
                <span className="text-text-5 text-gray-400">—</span>
            )}
        </td>
    </tr>
);

/**
 * HistoryCard — 1 card cho mobile view
 */
const HistoryCard = ({ item, index, onViewResult }) => (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Header: attempt number + status */}
        <div className="flex items-center justify-between">
            <span className="text-subhead-5 font-semibold text-gray-900">
                Lần #{item.attemptNumber ?? index + 1}
            </span>
            <StatusBadge status={item.status} />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            {/* Điểm */}
            <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="text-text-5 text-gray-500">Điểm:</span>
            </div>
            <span className="text-text-5 font-semibold text-gray-900 text-right">
                {item.totalPoints != null
                    ? `${item.totalPoints}/${item.maxPoints ?? "?"}`
                    : "Chờ chấm"}
                {item.percentageScore != null && (
                    <span className="text-gray-500 font-normal ml-1">
                        ({item.percentageScore.toFixed(1)}%)
                    </span>
                )}
            </span>

            {/* Thời gian làm */}
            <div className="flex items-center gap-1.5">
                <Hourglass className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-text-5 text-gray-500">Thời gian:</span>
            </div>
            <span className="text-text-5 text-gray-900 text-right">
                {formatDuration(item.timeSpentSeconds)}
            </span>

            {/* Thời gian nộp */}
            <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-text-5 text-gray-500">Nộp lúc:</span>
            </div>
            <span className="text-text-5 text-gray-900 text-right">
                {item.submittedAt ? formatDateTime(item.submittedAt) : "N/A"}
            </span>
        </div>

        {/* Xem kết quả button */}
        {onViewResult && item.competitionSubmitId && (
            <button
                type="button"
                onClick={() => onViewResult(item.competitionSubmitId)}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-text-5 font-medium cursor-pointer transition active:scale-95"
            >
                <Eye className="w-3.5 h-3.5 shrink-0" />
                Xem chi tiết kết quả
            </button>
        )}
    </div>
);

/**
 * Pagination Controls
 */
const Pagination = ({ pagination, onPageChange, loading }) => {
    const { page, totalPages, total } = pagination;
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-2">
            <span className="text-text-5 text-gray-500">
                Tổng {total} lượt thi
            </span>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => onPageChange(page - 1)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-text-5 text-gray-700 px-2 select-none">
                    {page} / {totalPages}
                </span>

                <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => onPageChange(page + 1)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

/**
 * HistoryTabContent
 * Hiển thị lịch sử các lần thi đã nộp (SUBMITTED / GRADED) với phân trang
 */
export const HistoryTabContent = ({ competitionId, competition }) => {
    const navigate = useNavigate();
    const { history, pagination, loading, error, fetchPage, refresh } =
        useCompetitionHistory(competitionId);

    const hasFullRules = !!(competition?.allowViewScore || competition?.showResultDetail || competition?.allowViewAnswer);
    const onViewResult = hasFullRules
        ? (submitId) => navigate(ROUTES.COMPETITION_RESULT(submitId))
        : null;

    /* ── Loading state ──────────────────────────────── */
    if (loading && history.length === 0) {
        return (
            <div className="py-10 flex w-full justify-center items-center">
                <div className="flex items-center gap-2 text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-text-4">Đang tải lịch sử...</span>
                </div>
            </div>
        );
    }

    /* ── Error state ────────────────────────────────── */
    if (error) {
        return (
            <div className="py-10 flex flex-col gap-3 w-full justify-center items-center">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <span className="text-text-4 text-red-500">
                    Không thể tải lịch sử làm bài
                </span>
                <button
                    type="button"
                    onClick={refresh}
                    className="px-4 py-2 text-text-5 font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition active:scale-95"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    /* ── No competitionId ───────────────────────────── */
    if (!competitionId) {
        return (
            <div className="py-10 flex flex-col gap-3 w-full justify-center items-center">
                <FileText className="w-10 h-10 text-gray-300" />
                <span className="text-text-4 text-gray-500">
                    Chưa có dữ liệu lịch sử
                </span>
            </div>
        );
    }

    /* ── Empty state ────────────────────────────────── */
    if (history.length === 0) {
        return (
            <div className="py-10 flex flex-col gap-3 w-full justify-center items-center rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
                <div className="flex flex-col gap-1.5 items-center">
                    <span className="text-subhead-5 sm:text-subhead-4 text-gray-900 font-semibold">
                        Chưa có lịch sử làm bài
                    </span>
                    <span className="text-text-5 sm:text-text-4 text-gray-500">
                        Bạn chưa nộp bài lần nào
                    </span>
                </div>
            </div>
        );
    }

    /* ── Main content ───────────────────────────────── */
    return (
        <div className="py-4 sm:py-6 flex w-full flex-col gap-5 justify-center items-center rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">

            {/* Header */}
            <div className="w-full flex items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-800 shrink-0" />
                    <span className="text-subhead-4 font-semibold text-gray-900">
                        Lịch sử làm bài
                    </span>
                </div>
                <button
                    type="button"
                    onClick={refresh}
                    disabled={loading}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer transition disabled:opacity-40"
                    title="Tải lại"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
            </div>

            {/* ─── Desktop Table (hidden on mobile) ─── */}
            <div className="w-full px-4 sm:px-8 hidden sm:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-text-4 font-semibold text-gray-900">
                                    Lần
                                </th>
                                <th className="text-left py-3 px-4 text-text-4 font-semibold text-gray-900">
                                    Trạng thái
                                </th>
                                <th className="text-left py-3 px-4 text-text-4 font-semibold text-gray-900">
                                    Điểm
                                </th>
                                <th className="text-left py-3 px-4 text-text-4 font-semibold text-gray-900">
                                    Thời gian làm
                                </th>
                                <th className="text-left py-3 px-4 text-text-4 font-semibold text-gray-900">
                                    Thời gian nộp
                                </th>
                                <th className="text-left py-3 px-4 text-text-4 font-semibold text-gray-900">
                                    Kết quả
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, i) => (
                                <HistoryRow
                                    key={item.competitionSubmitId ?? i}
                                    item={item}
                                    index={i}
                                    onViewResult={onViewResult}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── Mobile Cards (hidden on sm+) ─── */}
            <div className="w-full px-4 flex flex-col gap-3 sm:hidden">
                {history.map((item, i) => (
                    <HistoryCard
                        key={item.competitionSubmitId ?? i}
                        item={item}
                        index={i}
                        onViewResult={onViewResult}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="w-full px-4 sm:px-8">
                <Pagination
                    pagination={pagination}
                    onPageChange={fetchPage}
                    loading={loading}
                />
            </div>
        </div>
    );
};
