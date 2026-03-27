import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, ArrowUpDown, CheckCircle2, RefreshCw } from "lucide-react";
import {
    getMyPaymentsAsync,
    selectPaymentError,
    selectLoadingPayments,
    selectMyPayments,
    selectPaymentPagination,
} from "./store/tuitionPaymentSlice";
import { Pagination } from "../../shared/components";
import "../competition/ranking/ranking-loading.css";

const formatCurrency = (value) => {
    const numeric = Number(value || 0);
    return `${new Intl.NumberFormat("vi-VN").format(Number.isFinite(numeric) ? numeric : 0)} đ`;
};

const resolveItemStatus = (item) => item?.statusLabel || (item?.status === "PAID" ? "Đã đóng" : "Chưa đóng");

const resolveItemDate = (item) => {
    const dateValue = item?.paidAt;
    if (!dateValue) return "--";

    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return "--";

    return parsed.toLocaleDateString("vi-VN");
};

const resolveItemAmount = (item) => {
    return item?.amount ?? item?.totalAmount ?? item?.payableAmount ?? item?.money ?? 0;
};

const getStatusClass = (item) => {
    const normalized = String(item?.status || "").toUpperCase();
    if (normalized === "PAID") return "bg-emerald-50 text-emerald-700";
    if (normalized === "UNPAID") return "bg-amber-50 text-amber-700";
    return "bg-slate-100 text-slate-700";
};

const getRowHighlightClass = (index) => {
    return index % 2 === 0 ? "border-transparent bg-[#f8fafc]" : "border-transparent bg-[#f1f5f9]";
};

const getActionClass = (item) => {
    const normalized = String(item?.status || "").toUpperCase();
    if (normalized === "PAID") {
        return "bg-emerald-600 hover:bg-emerald-700";
    }
    return "bg-amber-500 hover:bg-amber-600";
};

const getActionText = (item) => {
    const normalized = String(item?.status || "").toUpperCase();
    return normalized === "PAID" ? "Đã đóng" : "Chưa đóng";
};

const getPaymentPeriod = (item) => {
    const month = Number(item?.month);
    const year = Number(item?.year);
    if (!Number.isFinite(month) || !Number.isFinite(year)) return "--";
    return `Tháng ${month}/${year}`;
};

const normalizePaymentItems = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const PaymentPage = () => {
    const dispatch = useDispatch();
    const loadingPayments = useSelector(selectLoadingPayments);
    const payments = useSelector(selectMyPayments);
    const pagination = useSelector(selectPaymentPagination);
    const error = useSelector(selectPaymentError);

    const [page, setPage] = useState(1);
    const limit = 20;
    const [sortBy, setSortBy] = useState("period");
    const [sortOrder, setSortOrder] = useState("desc");

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

    const paymentItems = useMemo(() => normalizePaymentItems(payments), [payments]);
    const totalRecords = pagination?.total ?? paymentItems.length;
    const currentPage = pagination?.page ?? page;
    const totalPages = pagination?.totalPages ?? 1;
    const skeletonRows = Array.from({ length: 10 }, (_, index) => index);
    const normalizedError = useMemo(() => {
        if (!error) return "";
        return typeof error === "string" ? error : error?.message || "Không thể tải danh sách học phí.";
    }, [error]);

    useEffect(() => {
        const query = {
            page,
            limit,
            sortBy,
            sortOrder,
        };
        dispatch(getMyPaymentsAsync(query));
    }, [dispatch, page, sortBy, sortOrder]);

    const handleReload = () => {
        dispatch(
            getMyPaymentsAsync({
                page,
                limit,
                sortBy,
                sortOrder,
            })
        );
    };

    return (
        <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-gray-500">Tổng bản ghi: {totalRecords}</p>
                <button
                    type="button"
                    onClick={handleReload}
                    disabled={loadingPayments}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-text-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw size={14} className={loadingPayments ? "animate-spin" : ""} />
                    Reload
                </button>
            </div>

            {loadingPayments ? (
                <div className="w-full overflow-hidden">
                    <div className="hidden w-full md:block">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-500">
                            <div className="w-[22%]">Kỳ thu</div>
                            <div className="w-[16%]">Trạng thái</div>
                            <div className="w-[20%]">Số tiền</div>
                            <div className="flex-1">Ngày đóng</div>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {skeletonRows.map((rowIndex) => (
                                <div
                                    key={`payment-skeleton-${rowIndex}`}
                                    className="ranking-skeleton-row flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 even:bg-[#f1f5f9]"
                                    style={{ animationDelay: `${rowIndex * 35}ms` }}
                                >
                                    <div className="w-[22%]">
                                        <div className="ranking-skeleton-block h-4 w-20 rounded-md" />
                                    </div>
                                    <div className="w-[16%]">
                                        <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                    </div>
                                    <div className="w-[20%]">
                                        <div className="ranking-skeleton-block h-4 w-24 rounded-md" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="ranking-skeleton-block h-4 w-28 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-2 space-y-2 md:hidden">
                        {skeletonRows.slice(0, 6).map((rowIndex) => (
                            <div
                                key={`payment-mobile-skeleton-${rowIndex}`}
                                className="rounded-xl border border-transparent bg-[#f8fafc] p-3 even:bg-[#f1f5f9]"
                            >
                                <div className="ranking-skeleton-block h-4 w-24 rounded-md" />
                                <div className="mt-3 grid grid-cols-2 gap-2">
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
            ) : !paymentItems || paymentItems.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Hiện chưa có khoản học phí nào.
                </div>
            ) : (
            <div className="w-full overflow-hidden">
                <div className="hidden w-full md:block">
                    <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                        <button
                            type="button"
                            onClick={() => toggleSort("period")}
                            className="cursor-pointer flex w-[22%] items-center gap-1 text-left"
                            title={`Sắp xếp kỳ thu: ${getSortLabel("period")}`}
                        >
                            Kỳ thu
                            <ArrowUpDown size={12} className={sortBy === "period" ? "text-blue-700" : "text-gray-400"} />
                        </button>
                        <div className="w-[16%] text-start">Trạng thái</div>
                        <button
                            type="button"
                            onClick={() => toggleSort("amount")}
                            className="cursor-pointer flex w-[20%] items-center gap-1 text-left"
                            title={`Sắp xếp số tiền: ${getSortLabel("amount")}`}
                        >
                            Số tiền
                            <ArrowUpDown size={12} className={sortBy === "amount" ? "text-blue-700" : "text-gray-400"} />
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleSort("paidAt")}
                            className="cursor-pointer flex flex-1 items-center gap-1 text-left"
                            title={`Sắp xếp ngày đóng: ${getSortLabel("paidAt")}`}
                        >
                            Ngày đóng
                            <ArrowUpDown size={12} className={sortBy === "paidAt" ? "text-blue-700" : "text-gray-400"} />
                        </button>
                    </div>

                    <div className="mt-2 flex flex-col gap-0.5">
                        {paymentItems.map((item, index) => (
                            <div
                                key={item?.paymentId ?? `${item?.month}-${item?.year}-${index}`}
                                className="group relative overflow-hidden rounded-xl"
                            >
                                <div
                                    className={`ranking-wave-row flex items-center border px-4 py-2 transition-all duration-300 md:group-hover:-translate-x-14 md:group-hover:mr-1 ${getRowHighlightClass(index)}`}
                                    style={{ animationDelay: `${Math.min(index, 19) * 55}ms` }}
                                >
                                    <div className="w-[22%] text-sm font-semibold text-gray-700">{getPaymentPeriod(item)}</div>
                                    <div className="w-[16%] text-start">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(item)}`}>
                                            {resolveItemStatus(item)}
                                        </span>
                                    </div>
                                    <div className="w-[20%] text-sm font-semibold text-gray-900">
                                        {formatCurrency(resolveItemAmount(item))}
                                    </div>
                                    <div className="flex-1 text-sm text-gray-700">{resolveItemDate(item)}</div>
                                </div>

                                <button
                                    type="button"
                                    className={`absolute right-0 top-0 hidden h-full w-14 translate-x-full items-center justify-center text-white opacity-0 scale-95 transition-all duration-500 md:flex md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-hover:scale-100 ${getActionClass(item)}`}
                                    title={getActionText(item)}
                                    aria-label={getActionText(item)}
                                >
                                    {String(item?.status || "").toUpperCase() === "PAID" ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <ArrowRight size={18} />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 md:hidden">
                    {paymentItems.map((item, index) => (
                        <article
                            key={`mobile-payment-${item?.paymentId ?? `${item?.month}-${item?.year}-${index}`}`}
                            className={`rounded-xl border px-3 py-3 ${getRowHighlightClass(index)}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-800">{getPaymentPeriod(item)}</p>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(item)}`}>
                                    {resolveItemStatus(item)}
                                </span>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                    Số tiền: <span className="font-semibold text-slate-900">{formatCurrency(resolveItemAmount(item))}</span>
                                </div>
                                <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                    Ngày đóng: <span className="font-semibold text-slate-900">{resolveItemDate(item)}</span>
                                </div>
                            </div>

                            <div className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white ${getActionClass(item)}`}>
                                {String(item?.status || "").toUpperCase() === "PAID" ? <CheckCircle2 size={15} /> : <ArrowRight size={15} />}
                                {getActionText(item)}
                            </div>
                        </article>
                    ))}
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

export default memo(PaymentPage);
