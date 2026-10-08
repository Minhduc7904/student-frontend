import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpDown, Coins, RefreshCw } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, CustomDropdown, DebouncedSearchInput, Pagination } from "../../../shared/components";
import { profileService } from "../../../core/services/modules/profileService";
import { getStudentTotalPoint } from "../utils/studentPointUtils";
import { ROUTES } from "../../../core/constants";
import { PointLogItem } from "./PointLogItem";
import { formatNumber, normalizeLogsPayload, toSafeNumber } from "./pointLogFormat";

const TYPE_OPTIONS = [
    { label: "Tất cả", value: "" },
    { label: "Cộng điểm", value: "BONUS" },
    { label: "Trừ điểm", value: "PENALTY" },
];

const SORT_OPTIONS = [
    { label: "Mới nhất", value: "desc" },
    { label: "Cũ nhất", value: "asc" },
];

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
