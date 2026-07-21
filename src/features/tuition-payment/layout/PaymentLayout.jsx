import { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BadgeDollarSign, CheckCircle2, CreditCard, ReceiptText } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
import {
    getMyStatsMoneyAsync,
    getMyStatsStatusAsync,
    selectLoadingStatsMoney,
    selectLoadingStatsStatus,
    selectMyPayments,
    selectPaymentPagination,
    selectStatsMoney,
    selectStatsStatus,
} from "../store/tuitionPaymentSlice";

const getNumberByKeys = (source, keys) => {
    if (!source || typeof source !== "object") return 0;
    for (const key of keys) {
        const numeric = Number(source[key]);
        if (Number.isFinite(numeric)) return numeric;
    }
    return 0;
};

const formatCurrency = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} đ`;

const PaymentLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const payments = useSelector(selectMyPayments);
    const pagination = useSelector(selectPaymentPagination);
    const statsStatus = useSelector(selectStatsStatus);
    const statsMoney = useSelector(selectStatsMoney);
    const loadingStatsStatus = useSelector(selectLoadingStatsStatus);
    const loadingStatsMoney = useSelector(selectLoadingStatsMoney);

    useEffect(() => {
        dispatch(getMyStatsStatusAsync());
        dispatch(getMyStatsMoneyAsync());
    }, [dispatch]);

    const stats = useMemo(() => ({
        totalRecords: getNumberByKeys(pagination, ["total"]) || payments?.length || 0,
        paidCount: getNumberByKeys(statsStatus, ["paid", "PAID", "done", "completed", "success"]),
        pendingCount: getNumberByKeys(statsStatus, ["pending", "PENDING", "unpaid", "UNPAID", "due"]),
        totalPaidMoney: getNumberByKeys(statsMoney, ["paidAmount", "totalPaid", "paid", "income", "collected"]),
        totalDueMoney: getNumberByKeys(statsMoney, ["dueAmount", "remaining", "unpaid", "pending", "debt"]),
    }), [pagination, payments, statsMoney, statsStatus]);

    const firstPendingPayment = useMemo(() => (
        (Array.isArray(payments) ? payments : []).find((payment) => (
            String(payment?.paymentIntent?.status || "").toUpperCase() === "PENDING"
            && payment?.paymentId
            && payment?.paymentIntent?.paymentIntentId
        ))
    ), [payments]);

    const goToFirstPendingPayment = () => {
        if (!firstPendingPayment) return;
        navigate(ROUTES.TUITION_PAYMENT_INTENT(firstPendingPayment.paymentId, firstPendingPayment.paymentIntent.paymentIntentId));
    };

    const statCards = [
        { label: "Khoản học phí", value: stats.totalRecords, Icon: ReceiptText, tone: "bg-blue-50 text-blue-800" },
        { label: "Đã hoàn tất", value: loadingStatsStatus ? "…" : stats.paidCount, Icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
        { label: "Cần xử lý", value: loadingStatsStatus ? "…" : stats.pendingCount, Icon: CreditCard, tone: "bg-yellow-50 text-yellow-800" },
    ];

    return (
        <AuthenticatedLayout>
            <main className="min-h-full flex-1 overflow-y-auto bg-blue-50/70 custom-scrollbar">
                <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                    <header className="overflow-hidden rounded-2xl bg-blue-800 px-5 py-6 text-white shadow-lg shadow-blue-900/15 sm:px-7 sm:py-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-2xl">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-yellow-300"><BadgeDollarSign size={22} /></span>
                                <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Học phí của bạn</h1>
                                {firstPendingPayment ? <button type="button" onClick={goToFirstPendingPayment} className="mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-100"><CreditCard size={18} /> Thanh toán ngay</button> : null}
                            </div>
                            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-xs font-medium text-blue-100">Còn cần thanh toán</p>
                                <p className="mt-1 text-xl font-bold text-white">{loadingStatsMoney ? "…" : formatCurrency(stats.totalDueMoney)}</p>
                            </div>
                        </div>
                    </header>

                    <section className="mt-4 grid gap-3 sm:grid-cols-3">
                        {statCards.map(({ label, value, Icon, tone }) => (
                            <article key={label} className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3.5 shadow-sm shadow-blue-950/5">
                                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon size={20} /></span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-gray-500">{label}</p>
                                    <p className="mt-0.5 text-xl font-bold text-blue-950">{value}</p>
                                </div>
                            </article>
                        ))}
                    </section>

                    <section className="mt-5 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-950/5 sm:p-5">
                        <Outlet />
                    </section>
                </div>
            </main>
        </AuthenticatedLayout>
    );
};

export default memo(PaymentLayout);
