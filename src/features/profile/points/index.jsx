import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpDown, CalendarDays, Coins, RefreshCw } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, CustomDropdown, DebouncedSearchInput, Pagination } from "../../../shared/components";
import { profileService } from "../../../core/services/modules/profileService";
import { getStudentTotalPoint } from "../utils/studentPointUtils";
import { ROUTES } from "../../../core/constants";

const TYPE_OPTIONS = [
    { label: "Tất cả", value: "" },
    { label: "Cộng điểm", value: "BONUS" },
    { label: "Trừ điểm", value: "PENALTY" },
];

const SORT_OPTIONS = [
    { label: "Mới nhất", value: "desc" },
    { label: "Cũ nhất", value: "asc" },
];

const SOURCE_LABELS = {
    ATTENDANCE: "Điểm danh",
    COMPETITION_SUBMIT: "Nộp bài cuộc thi",
    LEARNING_ITEM_LEARNED: "Hoàn thành bài học",
    HOMEWORK_SUBMIT: "Nộp bài tập",
    EXAM_SUBMIT: "Nộp bài kiểm tra",
    MANUAL: "Cập nhật thủ công",
};

const REFERENCE_LABELS = {
    ATTENDANCE: "Điểm danh",
    COMPETITION: "Cuộc thi",
    COMPETITION_SUBMIT: "Bài nộp cuộc thi",
    LEARNING_ITEM: "Bài học",
    HOMEWORK: "Bài tập",
    EXAM: "Bài kiểm tra",
};

const METADATA_LABELS = {
    attendanceId: "Mã điểm danh",
    sessionId: "Mã buổi học",
    status: "Trạng thái",
    competitionId: "Mã cuộc thi",
    competitionSubmitId: "Mã bài nộp",
    learningItemId: "Mã bài học",
};

const VALUE_LABELS = {
    PRESENT: "Có mặt",
    ABSENT: "Vắng mặt",
    LATE: "Đi muộn",
    BONUS: "Cộng điểm",
    PENALTY: "Trừ điểm",
};

const toSafeNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const formatNumber = (value) => toSafeNumber(value).toLocaleString("vi-VN");

const formatDateTime = (value) => {
    if (!value) return "--";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatLabel = (value, labels = {}) => {
    if (!value) return "--";
    return labels[value] || String(value).replaceAll("_", " ").toLowerCase();
};

const translateNote = (log) => {
    const note = String(log?.note || "").trim();
    const points = formatNumber(log?.points);
    const sourceLabel = formatLabel(log?.source, SOURCE_LABELS);
    const status = log?.metadata?.status ? formatLabel(log.metadata.status, VALUE_LABELS) : "";

    if (/attendance/i.test(note) || log?.source === "ATTENDANCE") {
        if (log?.type === "BONUS") {
            return `Được cộng ${points} điểm khi điểm danh${status ? `: ${status.toLowerCase()}` : ""}.`;
        }
        return `Bị trừ ${points} điểm từ điểm danh${status ? `: ${status.toLowerCase()}` : ""}.`;
    }

    if (log?.type === "BONUS") {
        return `Được cộng ${points} điểm từ ${sourceLabel.toLowerCase()}.`;
    }

    if (log?.type === "PENALTY") {
        return `Bị trừ ${points} điểm từ ${sourceLabel.toLowerCase()}.`;
    }

    return `Điểm được cập nhật từ ${sourceLabel.toLowerCase()}.`;
};

const normalizeLogsPayload = (response) => {
    const payload = response?.data || response || {};

    return {
        items: Array.isArray(payload.data) ? payload.data : [],
        meta: payload.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
        totalPoint: payload.totalPoint,
    };
};

const PointLogItem = memo(({ log }) => {
    const signedPoints = toSafeNumber(log?.signedPoints ?? log?.points);
    const isBonus = log?.type === "BONUS" || signedPoints >= 0;
    const referenceLabel = formatLabel(log?.referenceType, REFERENCE_LABELS);
    const metadataEntries = Object.entries(log?.metadata || {}).slice(0, 4);

    return (
        <article className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
                                isBonus
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                            }`}
                        >
                            {isBonus ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                            {isBonus ? "Cộng điểm" : "Trừ điểm"}
                        </span>
                        <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800">
                            {formatLabel(log?.source, SOURCE_LABELS)}
                        </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-blue-950">
                        {translateNote(log)}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} />
                            {formatDateTime(log?.createdAt)}
                        </span>
                        {log?.referenceId ? (
                            <span>
                                {referenceLabel} #{log.referenceId}
                            </span>
                        ) : null}
                    </div>

                    {metadataEntries.length ? (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {metadataEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-2"
                                >
                                    <p className="text-[11px] font-medium text-gray-500">
                                        {METADATA_LABELS[key] || key}
                                    </p>
                                    <p className="mt-0.5 text-xs font-semibold text-blue-950">
                                        {VALUE_LABELS[value] || String(value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className={`text-right text-xl font-bold ${isBonus ? "text-green-600" : "text-red-600"}`}>
                    {isBonus ? "+" : "-"}
                    {formatNumber(Math.abs(signedPoints))}
                </div>
            </div>
        </article>
    );
});

PointLogItem.displayName = "PointLogItem";

const ProfilePointsPage = () => {
    const navigate = useNavigate();
    const outletContext = useOutletContext();
    const profileTotalPoint = getStudentTotalPoint(outletContext?.profile);
    const [logs, setLogs] = useState([]);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [totalPoint, setTotalPoint] = useState(profileTotalPoint);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [type, setType] = useState("");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setTotalPoint(profileTotalPoint);
    }, [profileTotalPoint]);

    useEffect(() => {
        let ignore = false;

        const fetchPointLogs = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await profileService.getMyPointLogs({
                    page,
                    limit: 10,
                    search: search || undefined,
                    type: type || undefined,
                    sortBy: "createdAt",
                    sortOrder,
                });
                if (ignore) return;

                const normalized = normalizeLogsPayload(response);
                setLogs(normalized.items);
                setMeta(normalized.meta);
                if (normalized.totalPoint !== undefined && normalized.totalPoint !== null) {
                    setTotalPoint(normalized.totalPoint);
                }
            } catch (apiError) {
                if (ignore) return;
                setLogs([]);
                setError(apiError?.message || "Không thể tải lịch sử điểm. Vui lòng thử lại sau.");
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchPointLogs();

        return () => {
            ignore = true;
        };
    }, [page, refreshKey, search, sortOrder, type]);

    const visiblePage = meta?.page || page;
    const totalPages = Math.max(1, meta?.totalPages || 1);

    const currentPageStats = useMemo(() => {
        return logs.reduce(
            (acc, log) => {
                const value = Math.abs(toSafeNumber(log?.signedPoints ?? log?.points));
                if (log?.type === "PENALTY" || toSafeNumber(log?.signedPoints) < 0) {
                    acc.penalty += value;
                } else {
                    acc.bonus += value;
                }
                return acc;
            },
            { bonus: 0, penalty: 0 }
        );
    }, [logs]);

    const handleTypeChange = useCallback((nextType) => {
        setType(nextType);
        setPage(1);
    }, []);

    const handleSearchChange = useCallback((nextSearch) => {
        setSearch(nextSearch);
        setPage(1);
    }, []);

    const handleSortChange = useCallback((nextSortOrder) => {
        setSortOrder(nextSortOrder);
        setPage(1);
    }, []);

    const handleRefresh = useCallback(() => {
        setPage(1);
        setRefreshKey((currentKey) => currentKey + 1);
    }, []);

    const handleRedeemPoint = useCallback(() => {}, []);

    return (
        <div className="flex flex-col gap-4">
            <button
                type="button"
                onClick={() => navigate(ROUTES.PROFILE)}
                className="inline-flex h-9 w-fit cursor-pointer items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-blue-800 shadow-sm transition-colors hover:bg-blue-50 active:scale-[0.98]"
            >
                <ArrowLeft size={16} />
                Quay lại hồ sơ
            </button>

            <Card className="group relative overflow-hidden border-blue-100 bg-linear-to-br from-blue-50 via-white to-yellow-50 transition-all duration-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/70">
                <span className="pointer-events-none absolute inset-y-[-2rem] left-[-7rem] z-10 w-14 rotate-12 bg-white/70 opacity-0 blur-sm transition-all duration-700 ease-out group-hover:translate-x-[34rem] group-hover:opacity-100" />
                <div className="relative z-20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white shadow-sm">
                            <Coins size={24} />
                        </div>
                        <div>
                            <p className="text-text-5 font-medium text-gray-600">Điểm hiện có</p>
                            <p className="mt-1 text-3xl font-bold leading-none text-blue-800">
                                {formatNumber(totalPoint)}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRedeemPoint}
                        className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-yellow-500 px-4 text-sm font-semibold text-blue-950 transition-colors hover:bg-yellow-100 active:scale-[0.98] md:w-auto"
                    >
                        Đổi điểm
                    </button>
                </div>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
                <Card className="border-blue-100">
                    <p className="text-text-5 font-medium text-gray-500">Điểm cộng trang này</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                        +{formatNumber(currentPageStats.bonus)}
                    </p>
                </Card>
                <Card className="border-blue-100">
                    <p className="text-text-5 font-medium text-gray-500">Điểm trừ trang này</p>
                    <p className="mt-1 text-2xl font-bold text-red-600">
                        -{formatNumber(currentPageStats.penalty)}
                    </p>
                </Card>
            </div>

            <Card className="border-blue-100">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-h4 font-bold text-blue-950">Chi tiết điểm</h1>
                        <p className="mt-1 text-text-5 text-gray-500">
                            {formatNumber(meta?.total || 0)} lượt cộng/trừ điểm
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <DebouncedSearchInput
                            value={search}
                            onDebouncedChange={handleSearchChange}
                            placeholder="Tìm nguồn, ghi chú..."
                            containerClassName="w-full sm:w-64"
                            inputClassName="rounded-lg bg-white border border-gray-200 py-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                        <CustomDropdown
                            value={type}
                            options={TYPE_OPTIONS}
                            onChange={handleTypeChange}
                            buttonClassName="h-9"
                            menuClassName="left-0 right-auto w-full sm:w-36"
                        />
                        <CustomDropdown
                            value={sortOrder}
                            options={SORT_OPTIONS}
                            onChange={handleSortChange}
                            buttonClassName="h-9"
                            menuClassName="left-0 right-auto w-full sm:w-34"
                        />
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-50"
                        >
                            <RefreshCw size={15} />
                            Tải lại
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-28 animate-pulse rounded-xl border border-blue-100 bg-blue-50/60"
                            />
                        ))
                    ) : error ? (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-5 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    ) : logs.length ? (
                        logs.map((log) => (
                            <PointLogItem key={log.pointLogId || `${log.createdAt}-${log.referenceId}`} log={log} />
                        ))
                    ) : (
                        <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-8 text-center">
                            <ArrowUpDown className="mx-auto h-8 w-8 text-blue-300" />
                            <p className="mt-2 text-sm font-semibold text-blue-950">Chưa có lịch sử điểm</p>
                            <p className="mt-1 text-text-5 text-gray-500">
                                Khi có lượt cộng hoặc trừ điểm, thông tin sẽ xuất hiện tại đây.
                            </p>
                        </div>
                    )}
                </div>

                <Pagination
                    currentPage={visiblePage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    disabled={loading}
                    className="mt-5"
                />
            </Card>
        </div>
    );
};

export default memo(ProfilePointsPage);
