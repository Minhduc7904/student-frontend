import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpDown, Eye, Lock, RefreshCw } from "lucide-react";
import { ROUTES } from "../../../core/constants";
import { Pagination } from "../../../shared/components";
import {
    getPublicStudentSubmittedHistoryAsync,
    selectPublicStudentSubmittedHistory,
    selectPublicStudentSubmittedHistoryError,
    selectPublicStudentSubmittedHistoryLoading,
} from "../../profile/store/profileSlice";
import { HISTORY_QUERY } from "../constants";
import "../../competition/ranking/ranking-loading.css";

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

const formatBoolean = (value) => (value ? "Có" : "Không");

const formatScore = (item) => {
    if (!item?.hasScore) return "--";
    if (item?.totalPoints == null || item?.maxPoints == null) return "--";
    return `${item.totalPoints}/${item.maxPoints}`;
};

const formatPercent = (value) => {
    if (value == null) return "--";
    return `${Number(value).toFixed(1)}%`;
};

const getStatusClass = (status) => {
    if (status === "SUBMITTED") return "bg-emerald-50 text-emerald-700";
    if (status === "IN_PROGRESS") return "bg-amber-50 text-amber-700";
    return "bg-slate-100 text-slate-700";
};

const getFieldItems = (item) => [
    { label: "competitionSubmitId", value: item?.competitionSubmitId ?? "--" },
    { label: "competitionId", value: item?.competitionId ?? "--" },
    { label: "attemptNumber", value: item?.attemptNumber ?? "--" },
    { label: "status", value: item?.status || "--" },
    { label: "canViewDetail", value: formatBoolean(Boolean(item?.canViewDetail)) },
    { label: "startedAt", value: formatDateTime(item?.startedAt) },
    { label: "submittedAt", value: formatDateTime(item?.submittedAt) },
    { label: "timeSpentSeconds", value: item?.timeSpentSeconds ?? "--" },
    { label: "timeSpentDisplay", value: item?.timeSpentDisplay || "--" },
    { label: "totalPoints/maxPoints", value: formatScore(item) },
    { label: "scorePercentage", value: formatPercent(item?.scorePercentage) },
    { label: "isGraded", value: formatBoolean(Boolean(item?.isGraded)) },
    { label: "hasScore", value: formatBoolean(Boolean(item?.hasScore)) },
    { label: "createdAt", value: formatDateTime(item?.createdAt) },
    { label: "updatedAt", value: formatDateTime(item?.updatedAt) },
];

const CompetitionHistoryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isOtherStudentHistory = false } = useOutletContext() || {};
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get("studentId") || undefined;
    const historyData = useSelector(selectPublicStudentSubmittedHistory);
    const loading = useSelector(selectPublicStudentSubmittedHistoryLoading);
    const error = useSelector(selectPublicStudentSubmittedHistoryError);

    const [page, setPage] = useState(1);
    const limit = 20;
    const [sortBy, setSortBy] = useState("submittedAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const historyItems = useMemo(() => normalizeHistoryItems(historyData), [historyData]);
    const pagination = historyData?.pagination || historyData?.meta || null;

    const total = pagination?.total ?? historyItems.length;
    const currentPage = pagination?.page ?? page;
    const totalPages = pagination?.totalPages ?? 1;

    const normalizedError = useMemo(() => {
        if (!error) return "";
        return typeof error === "string" ? error : error?.message || "Không thể tải lịch sử làm bài.";
    }, [error]);

    useEffect(() => {
        const query = {
            ...HISTORY_QUERY,
            page,
            limit,
            sortBy,
            sortOrder,
            ...(studentId ? { studentId } : {}),
        };

        dispatch(
            getPublicStudentSubmittedHistoryAsync(query)
        );
    }, [dispatch, page, sortBy, sortOrder, studentId]);

    const formatTimeSpent = (item) => {
        if (item?.timeSpentDisplay) return item.timeSpentDisplay;

        const seconds = item?.timeSpentSeconds;
        if (seconds == null || Number.isNaN(Number(seconds))) return "--";

        const totalSeconds = Math.max(0, Number(seconds));
        const hh = Math.floor(totalSeconds / 3600);
        const mm = Math.floor((totalSeconds % 3600) / 60);
        const ss = totalSeconds % 60;

        if (hh > 0) {
            return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
        }

        return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    };

    const getRowHighlightClass = (index) => {
        return index % 2 === 0 ? "border-transparent bg-[#f8fafc]" : "border-transparent bg-[#f1f5f9]";
    };

    const handleReload = () => {
        const query = {
            ...HISTORY_QUERY,
            page,
            limit,
            sortBy,
            sortOrder,
            ...(studentId ? { studentId } : {}),
        };

        dispatch(
            getPublicStudentSubmittedHistoryAsync(query)
        );
    };

    const toggleSort = (field) => {
        setPage(1);
        if (sortBy === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }

        setSortBy(field);
        setSortOrder("desc");
    };

    const getSortLabel = (field) => {
        if (sortBy !== field) return "Chưa sắp xếp";
        return sortOrder === "asc" ? "Tăng dần" : "Giảm dần";
    };

    const skeletonRows = Array.from({ length: 10 }, (_, index) => index);

    return (
        <section className="">
            <div className="mb-3">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleReload}
                        disabled={loading}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-text-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Reload
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="w-full overflow-hidden">
                    <div className="hidden w-full md:block">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-500">
                            <button
                                type="button"
                                onClick={() => toggleSort("attemptNumber")}
                                className="cursor-pointer flex w-20 items-center gap-1 text-left"
                                title={`Sắp xếp lần thi: ${getSortLabel("attemptNumber")}`}
                            >
                                Lần thi
                                <ArrowUpDown size={12} className={sortBy === "attemptNumber" ? "text-blue-700" : "text-gray-400"} />
                            </button>
                            <div className="w-[26%] text-start">Tên cuộc thi</div>
                            <div className="w-[14%] text-start">Trạng thái</div>
                            <button
                                type="button"
                                onClick={() => toggleSort("totalPoints")}
                                className="cursor-pointer flex h-fit  w-[14%] items-center gap-1 text-left"
                                title={`Sắp xếp điểm: ${getSortLabel("totalPoints")}`}
                            >
                                Điểm
                                <ArrowUpDown size={12} className={sortBy === "totalPoints" ? "text-blue-700" : "text-gray-400"} />
                            </button>
                            <div className="w-[10%] text-start">%</div>
                            <button
                                type="button"
                                onClick={() => toggleSort("submittedAt")}
                                className="cursor-pointer flex w-[18%] items-center gap-1 text-left"
                                title={`Sắp xếp nộp bài: ${getSortLabel("submittedAt")}`}
                            >
                                Nộp bài
                                <ArrowUpDown size={12} className={sortBy === "submittedAt" ? "text-blue-700" : "text-gray-400"} />
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleSort("timeSpentSeconds")}
                                className="cursor-pointer flex flex-1 items-center gap-1 text-left"
                                title={`Sắp xếp thời gian: ${getSortLabel("timeSpentSeconds")}`}
                            >
                                TG
                                <ArrowUpDown size={12} className={sortBy === "timeSpentSeconds" ? "text-blue-700" : "text-gray-400"} />
                            </button>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {skeletonRows.map((rowIndex) => (
                                <div
                                    key={`history-skeleton-${rowIndex}`}
                                    className="ranking-skeleton-row flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 even:bg-[#f1f5f9]"
                                    style={{ animationDelay: `${rowIndex * 35}ms` }}
                                >
                                    <div className="w-20">
                                        <div className="ranking-skeleton-block h-4 w-10 rounded-md" />
                                    </div>
                                    <div className="w-[26%]">
                                        <div className="ranking-skeleton-block h-4 w-32 rounded-md" />
                                    </div>
                                    <div className="w-[14%]">
                                        <div className="ranking-skeleton-block h-4 w-24 rounded-md" />
                                    </div>
                                    <div className="w-[14%]">
                                        <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                    </div>
                                    <div className="w-[10%]">
                                        <div className="ranking-skeleton-block h-4 w-14 rounded-md" />
                                    </div>
                                    <div className="w-[18%]">
                                        <div className="ranking-skeleton-block h-4 w-28 rounded-md" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-2 space-y-2 md:hidden">
                        {skeletonRows.slice(0, 6).map((rowIndex) => (
                            <div
                                key={`history-mobile-skeleton-${rowIndex}`}
                                className="rounded-xl border border-transparent bg-[#f8fafc] p-3 even:bg-[#f1f5f9]"
                            >
                                <div className="ranking-skeleton-block h-4 w-24 rounded-md" />
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                </div>
                                <div className="mt-3 ranking-skeleton-block h-8 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : normalizedError ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                    {normalizedError}
                </div>
            ) : historyItems.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Chưa có dữ liệu lịch sử làm bài.
                </div>
            ) : (
                <div className="w-full overflow-hidden">
                    <div className="hidden w-full md:block">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                            <button
                                type="button"
                                onClick={() => toggleSort("attemptNumber")}
                                className="cursor-pointer flex w-20 items-center gap-1 text-left"
                                title={`Sắp xếp lần thi: ${getSortLabel("attemptNumber")}`}
                            >
                                Lần thi
                                <ArrowUpDown size={12} className={sortBy === "attemptNumber" ? "text-blue-700" : "text-gray-400"} />
                            </button>
                            <div className="w-[26%] text-start">Tên cuộc thi</div>
                            <div className="w-[14%] text-start">Trạng thái</div>
                            <button
                                type="button"
                                onClick={() => toggleSort("totalPoints")}
                                className="cursor-pointer flex w-[14%] items-center gap-1 text-left"
                                title={`Sắp xếp điểm: ${getSortLabel("totalPoints")}`}
                            >
                                Điểm
                                <ArrowUpDown size={12} className={sortBy === "totalPoints" ? "text-blue-700" : "text-gray-400"} />
                            </button>
                            <div className="w-[10%] text-start">%</div>
                            <button
                                type="button"
                                onClick={() => toggleSort("submittedAt")}
                                className="cursor-pointer flex w-[18%] items-center gap-1 text-left"
                                title={`Sắp xếp nộp bài: ${getSortLabel("submittedAt")}`}
                            >
                                Nộp bài
                                <ArrowUpDown size={12} className={sortBy === "submittedAt" ? "text-blue-700" : "text-gray-400"} />
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleSort("timeSpentSeconds")}
                                className="cursor-pointer flex flex-1 items-center gap-1 text-left"
                                title={`Sắp xếp thời gian: ${getSortLabel("timeSpentSeconds")}`}
                            >
                                TG
                                <ArrowUpDown size={12} className={sortBy === "timeSpentSeconds" ? "text-blue-700" : "text-gray-400"} />
                            </button>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {historyItems.map((item, index) => {
                                const canViewResult = !isOtherStudentHistory && Boolean(item?.canViewDetail);

                                return (
                                <div
                                    key={item?.competitionSubmitId ?? `${item?.attemptNumber ?? "attempt"}-${index}`}
                                    className="group relative overflow-hidden rounded-xl"
                                >
                                    <div
                                        className={`ranking-wave-row flex items-center border px-4 py-2 transition-all duration-300 md:group-hover:-translate-x-14 md:group-hover:mr-1 ${getRowHighlightClass(index)}`}
                                        style={{ animationDelay: `${Math.min(index, 19) * 55}ms` }}
                                    >
                                        <div className="w-20 text-sm font-semibold text-gray-700">#{item?.attemptNumber ?? "--"}</div>
                                        <div className="w-[26%] text-start text-sm font-medium text-gray-700">{item?.competitionTitle ?? "--"}</div>
                                        <div className="w-[14%] text-start text-sm text-gray-700">{item?.status ?? "--"}</div>
                                        <div className="w-[14%] text-start text-sm font-semibold text-gray-900">{formatScore(item)}</div>
                                        <div className="w-[10%] text-start text-sm font-semibold text-gray-900">{formatPercent(item?.scorePercentage)}</div>
                                        <div className="w-[18%] text-start text-sm text-gray-700">{formatDateTime(item?.submittedAt)}</div>
                                        <div className="flex-1 text-start text-sm text-gray-700">{formatTimeSpent(item)}</div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => canViewResult && navigate(ROUTES.COMPETITION_RESULT(item?.competitionId, item?.competitionSubmitId))}
                                        disabled={!canViewResult}
                                        className={`absolute right-0 top-0 hidden h-full w-14 translate-x-full items-center justify-center text-white opacity-0 scale-95 transition-all duration-500 md:flex md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-hover:scale-100 ${
                                            canViewResult
                                                ? "cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-95"
                                                : "cursor-not-allowed bg-gray-400"
                                        }`}
                                        aria-label={canViewResult ? "Xem kết quả" : "Không thể xem kết quả"}
                                    >
                                        {canViewResult ? <ArrowRight size={20} /> : <Lock size={18} />}
                                    </button>
                                </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2 md:hidden">
                        {historyItems.map((item, index) => {
                            const canViewResult = !isOtherStudentHistory && Boolean(item?.canViewDetail);

                            return (
                            <article
                                key={`mobile-${item?.competitionSubmitId ?? `${item?.attemptNumber ?? "attempt"}-${index}`}`}
                                className={`rounded-xl border px-3 py-3 ${getRowHighlightClass(index)}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-gray-800">Lần #{item?.attemptNumber ?? "--"}</p>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(item?.status)}`}>
                                        {item?.status ?? "--"}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm font-medium text-gray-800">{item?.competitionTitle || "Không có tiêu đề cuộc thi"}</p>

                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Điểm: <span className="font-semibold text-slate-900">{formatScore(item)}</span>
                                    </div>
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        %: <span className="font-semibold text-slate-900">{formatPercent(item?.scorePercentage)}</span>
                                    </div>
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Nộp bài: <span className="font-semibold text-slate-900">{formatDateTime(item?.submittedAt)}</span>
                                    </div>
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Thời gian: <span className="font-semibold text-slate-900">{formatTimeSpent(item)}</span>
                                    </div>
                                </div>

                                {canViewResult ? (
                                    <button
                                        type="button"
                                        onClick={() => navigate(ROUTES.COMPETITION_RESULT(item?.competitionId, item?.competitionSubmitId))}
                                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                                    >
                                        <Eye size={15} />
                                        Xem kết quả
                                    </button>
                                ) : (
                                    <div className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500">
                                        <Lock size={15} />
                                        Đã khóa
                                    </div>
                                )}
                            </article>
                            );
                        })}
                    </div>

                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default memo(CompetitionHistoryPage);
