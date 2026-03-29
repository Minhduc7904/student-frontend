import { memo } from "react";
import { ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import { Pagination } from "../../../shared/components";
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

const normalizeStatus = (status) => {
    if (!status) return "";
    return String(status).trim().toUpperCase();
};

const formatScore = (item) => {
    const points = pickFirstDefined(item, ["points", "score", "point", "totalPoints"]);
    const maxPoints = pickFirstDefined(item, ["maxPoints", "maxPoint", "totalScore"]);

    if (points !== "" && maxPoints !== "") {
        return `${points}/${maxPoints}`;
    }

    return points || "--";
};

const formatTimeSpent = (item) => {
    if (item?.timeSpentDisplay) return item.timeSpentDisplay;
    if (item?.workingTimeDisplay) return item.workingTimeDisplay;

    const startedAt = pickFirstDefined(item, ["startedAt", "createdAt"]);
    const endedAt = pickFirstDefined(item, ["endAt", "submittedAt"]);

    const startedMs = startedAt ? new Date(startedAt).getTime() : NaN;
    const endedMs = endedAt ? new Date(endedAt).getTime() : NaN;

    if (!Number.isFinite(startedMs) || !Number.isFinite(endedMs) || endedMs < startedMs) {
        return "--";
    }

    const totalSeconds = Math.floor((endedMs - startedMs) / 1000);
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;

    if (hh > 0) {
        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    }

    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};

const getStatusMeta = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "IN_PROGRESS") {
        return {
            text: "Đang làm",
            className: "bg-amber-50 text-amber-700",
            canContinue: true,
        };
    }

    if (normalized === "SUBMITTED" || normalized === "SUBMITED") {
        return {
            text: "Đã nộp",
            className: "bg-emerald-50 text-emerald-700",
            canContinue: false,
        };
    }

    return {
        text: status || "--",
        className: "bg-slate-100 text-slate-700",
        canContinue: false,
    };
};

const getRowHighlightClass = (index) => {
    return index % 2 === 0 ? "border-transparent bg-[#f8fafc]" : "border-transparent bg-[#f1f5f9]";
};

const buildContinuePath = (item) => {
    const status = normalizeStatus(pickFirstDefined(item, ["status"]));
    if (status !== "IN_PROGRESS") return "";

    const typeOfExam = pickFirstDefined(item, ["typeOfExam", "typeExam", "typeexam"]);
    const examId = pickFirstDefined(item, ["examId", "id"]);

    if (!examId) return "";
    if (typeOfExam) return ROUTES.EXAM_TYPE_DETAIL(typeOfExam, examId);

    return ROUTES.EXAM_DETAIL(examId);
};

const ExamHistoryList = ({ data, loading, error, emptyText, onPageChange }) => {
    const navigate = useNavigate();
    const items = normalizeHistoryItems(data);
    const pagination = data?.pagination || data?.meta || null;

    const total = pagination?.total ?? items.length;
    const currentPage = Number(pagination?.page) || 1;
    const totalPages = Number(pagination?.totalPages) || 1;

    const normalizedError = !error
        ? ""
        : typeof error === "string"
            ? error
            : error?.message || "Không thể tải lịch sử đề mẫu.";

    const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

    if (loading) {
        return (
            <div className="w-full overflow-hidden">
                <div className="hidden w-full md:block">
                    <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-500">
                        <div className="w-16 text-start">#</div>
                        <div className="w-[30%] text-start">Tên đề</div>
                        <div className="w-[14%] text-start">Trạng thái</div>
                        <div className="w-[12%] text-start">Điểm</div>
                        <div className="w-[16%] text-start">Nộp bài</div>
                        <div className="flex-1 text-start">TG làm</div>
                    </div>

                    <div className="mt-2 flex flex-col gap-0.5">
                        {skeletonRows.map((rowIndex) => (
                            <div
                                key={`exam-history-skeleton-${rowIndex}`}
                                className="ranking-skeleton-row flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 even:bg-[#f1f5f9]"
                            >
                                <div className="w-16">
                                    <div className="ranking-skeleton-block h-4 w-8 rounded-md" />
                                </div>
                                <div className="w-[30%]">
                                    <div className="ranking-skeleton-block h-4 w-4/5 rounded-md" />
                                </div>
                                <div className="w-[14%]">
                                    <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                </div>
                                <div className="w-[12%]">
                                    <div className="ranking-skeleton-block h-4 w-14 rounded-md" />
                                </div>
                                <div className="w-[16%]">
                                    <div className="ranking-skeleton-block h-4 w-24 rounded-md" />
                                </div>
                                <div className="flex-1">
                                    <div className="ranking-skeleton-block h-4 w-14 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-2 space-y-2 md:hidden">
                    {skeletonRows.slice(0, 5).map((rowIndex) => (
                        <div
                            key={`exam-history-mobile-skeleton-${rowIndex}`}
                            className="rounded-xl border border-transparent bg-[#f8fafc] p-3 even:bg-[#f1f5f9]"
                        >
                            <div className="ranking-skeleton-block h-4 w-full rounded-md" />
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
                {emptyText || "Chưa có dữ liệu lịch sử đề mẫu."}
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            <div className="hidden w-full md:block">
                <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                    <div className="w-16 text-start">#</div>
                    <div className="w-[30%] text-start">Tên đề</div>
                    <div className="w-[14%] text-start">Trạng thái</div>
                    <div className="w-[12%] text-start">Điểm</div>
                    <div className="w-[16%] text-start">Nộp bài</div>
                    <div className="flex-1 text-start">TG làm</div>
                </div>

                <div className="mt-2 flex flex-col gap-0.5">
                    {items.map((item, index) => {
                        const statusMeta = getStatusMeta(item?.status);
                        const continuePath = buildContinuePath(item);

                        return (
                            <div
                                key={`exam-${pickFirstDefined(item, ["attemptId", "id"]) || "row"}-${index}`}
                                className="group relative overflow-hidden rounded-xl"
                            >
                                <div
                                    className={`ranking-wave-row flex items-center border px-4 py-2 transition-all duration-300 ${continuePath ? "md:group-hover:-translate-x-14 md:group-hover:mr-1" : ""} ${getRowHighlightClass(index)}`}
                                >
                                    <div className="w-16 text-sm font-semibold text-gray-700">#{item?.attemptId ?? index + 1}</div>
                                    <div className="w-[30%] text-start text-sm font-medium text-gray-700 line-clamp-1">{item?.examTitle ?? "--"}</div>
                                    <div className="w-[14%] text-start text-sm">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusMeta.className}`}>
                                            {statusMeta.text}
                                        </span>
                                    </div>
                                    <div className="w-[12%] text-start text-sm font-semibold text-gray-900">{formatScore(item)}</div>
                                    <div className="w-[16%] text-start text-sm text-gray-700">{formatDateTime(pickFirstDefined(item, ["endAt", "submittedAt"]))}</div>
                                    <div className="flex-1 text-start text-sm text-gray-700">{formatTimeSpent(item)}</div>
                                </div>

                                {continuePath ? (
                                    <button
                                        type="button"
                                        onClick={() => navigate(continuePath)}
                                        className="absolute right-0 top-0 hidden h-full w-14 translate-x-full items-center justify-center bg-blue-600 text-white opacity-0 scale-95 transition-all duration-500 hover:bg-blue-700 active:scale-95 md:flex md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-hover:scale-100"
                                        aria-label="Tiếp tục làm bài"
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2 md:hidden">
                {items.map((item, index) => {
                    const statusMeta = getStatusMeta(item?.status);
                    const continuePath = buildContinuePath(item);

                    return (
                        <article
                            key={`exam-mobile-${pickFirstDefined(item, ["attemptId", "id"]) || "row"}-${index}`}
                            className={`rounded-xl border px-3 py-3 ${getRowHighlightClass(index)}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-800">Lần #{item?.attemptId ?? index + 1}</p>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusMeta.className}`}>
                                    {statusMeta.text}
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium text-gray-800 line-clamp-2">{item?.examTitle || "Không có tiêu đề đề thi"}</p>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                    Điểm: <span className="font-semibold text-slate-900">{formatScore(item)}</span>
                                </div>
                                <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                    TG làm: <span className="font-semibold text-slate-900">{formatTimeSpent(item)}</span>
                                </div>
                                <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600 col-span-2">
                                    Nộp bài: <span className="font-semibold text-slate-900">{formatDateTime(pickFirstDefined(item, ["endAt", "submittedAt"]))}</span>
                                </div>
                            </div>

                            {continuePath ? (
                                <button
                                    type="button"
                                    onClick={() => navigate(continuePath)}
                                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                                >
                                    <Eye size={15} />
                                    Tiếp tục làm bài
                                </button>
                            ) : null}
                        </article>
                    );
                })}
            </div>

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    disabled={loading || !onPageChange}
                />
                <p className="mt-2 text-center text-xs text-slate-500">Tổng {total} bản ghi</p>
            </div>
        </div>
    );
};

export default memo(ExamHistoryList);
