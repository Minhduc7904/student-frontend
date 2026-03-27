import { memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import {
    getMyPaymentsAsync,
    selectLoadingPayments,
    selectMyPayments,
    selectPaymentPagination,
} from "./store/tuitionPaymentSlice";

const formatCurrency = (value) => {
    const numeric = Number(value || 0);
    return `${new Intl.NumberFormat("vi-VN").format(Number.isFinite(numeric) ? numeric : 0)} đ`;
};

const resolveItemStatus = (item) => item?.statusLabel || (item?.status === "PAID" ? "Đã đóng" : "Chưa đóng");

const resolveItemDate = (item) => {
    const dateValue = item?.paidAt || item?.createdAt || item?.updatedAt;
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

const getPaymentPeriod = (item) => {
    const month = Number(item?.month);
    const year = Number(item?.year);
    if (!Number.isFinite(month) || !Number.isFinite(year)) return "--";
    return `Tháng ${month}/${year}`;
};

const PaymentPage = () => {
    const dispatch = useDispatch();
    const loadingPayments = useSelector(selectLoadingPayments);
    const payments = useSelector(selectMyPayments);
    const pagination = useSelector(selectPaymentPagination);

    const sortedPayments = useMemo(() => {
        if (!Array.isArray(payments)) return [];
        return [...payments].sort((a, b) => {
            const yearDiff = Number(b?.year || 0) - Number(a?.year || 0);
            if (yearDiff !== 0) return yearDiff;
            return Number(b?.month || 0) - Number(a?.month || 0);
        });
    }, [payments]);

    const totalRecords = pagination?.total ?? sortedPayments.length;

    const handleReload = () => {
        dispatch(getMyPaymentsAsync({ page: 1, limit: 20 }));
    };

    if (loadingPayments) {
        return (
            <section>
                <div className="w-full overflow-hidden">
                    <div className="hidden w-full md:block">
                        <div className="mt-2 flex flex-col gap-0.5">
                            {Array.from({ length: 8 }, (_, rowIndex) => (
                                <div
                                    key={`payment-skeleton-${rowIndex}`}
                                    className="flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 even:bg-[#f1f5f9]"
                                >
                                    <div className="w-[22%]">
                                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                                    </div>
                                    <div className="w-[16%]">
                                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                                    </div>
                                    <div className="w-[20%]">
                                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                                    </div>
                                    <div className="w-[21%]">
                                        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!sortedPayments || sortedPayments.length === 0) {
        return (
            <section>
                <div className="rounded-xl border border-gray-100 bg-[#F7F7F8] p-4 text-sm text-gray-600">
                    Hiện chưa có khoản học phí nào.
                </div>
            </section>
        );
    }

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

            <div className="w-full overflow-hidden">
                <div className="hidden w-full md:block">
                    <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                        <button
                            type="button"
                            className="flex w-[22%] items-center gap-1 text-left"
                            title="Kỳ thu"
                        >
                            Kỳ thu
                            <ArrowUpDown size={12} className="text-gray-400" />
                        </button>
                        <div className="w-[16%] text-start">Trạng thái</div>
                        <button
                            type="button"
                            className="flex w-[20%] items-center gap-1 text-left"
                            title="Số tiền"
                        >
                            Số tiền
                            <ArrowUpDown size={12} className="text-gray-400" />
                        </button>
                        <div className="w-[21%] text-start">Ngày đóng</div>
                        <div className="flex-1 text-start">Cập nhật</div>
                    </div>

                    <div className="mt-2 flex flex-col gap-0.5">
                        {sortedPayments.map((item, index) => (
                            <div
                                key={item?.paymentId ?? `${item?.month}-${item?.year}-${index}`}
                                className={`flex items-center rounded-xl border px-4 py-2 ${getRowHighlightClass(index)}`}
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
                                <div className="w-[21%] text-sm text-gray-700">{resolveItemDate(item)}</div>
                                <div className="flex-1 text-sm text-gray-700">{resolveItemDate({ paidAt: item?.updatedAt })}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 md:hidden">
                    {sortedPayments.map((item, index) => (
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
                                <div className="col-span-2 rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                    Cập nhật: <span className="font-semibold text-slate-900">{resolveItemDate({ paidAt: item?.updatedAt })}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(PaymentPage);
