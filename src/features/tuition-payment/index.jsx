import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, CircleAlert, Clock3, CreditCard, MessageCircle, RefreshCw, WalletCards, X } from "lucide-react";
import { ROUTES } from "../../core/constants";
import { Modal } from "../../shared/components/modal/Modal";
import { Pagination } from "../../shared/components";
import {
    getMyPaymentsAsync,
    selectLoadingPayments,
    selectMyPayments,
    selectPaymentError,
    selectPaymentPagination,
} from "./store/tuitionPaymentSlice";

const formatCurrency = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} đ`;

const getPaymentAmount = (payment) => payment?.amount ?? payment?.totalAmount ?? payment?.payableAmount ?? payment?.money ?? 0;

const getPaymentPeriod = (payment) => {
    const month = Number(payment?.month);
    const year = Number(payment?.year);
    return Number.isFinite(month) && Number.isFinite(year) ? `Học phí tháng ${month}/${year}` : payment?.title || "Khoản học phí";
};

const formatDate = (value) => {
    if (!value) return "Chưa cập nhật";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Chưa cập nhật" : date.toLocaleDateString("vi-VN");
};

const getPaymentState = (payment) => {
    const tuitionStatus = String(payment?.status || "").toUpperCase();
    const intentStatus = String(payment?.paymentIntent?.status || "").toUpperCase();

    if (tuitionStatus === "PAID" || intentStatus === "PAID") return { label: "Đã thanh toán", className: "bg-emerald-50 text-emerald-700", Icon: CheckCircle2, action: "none" };
    if (intentStatus === "PENDING") return { label: "Sẵn sàng thanh toán", className: "bg-blue-50 text-blue-800", Icon: Clock3, action: "pay" };
    if (intentStatus === "EXPIRED") return { label: "Phiên đã hết hạn", className: "bg-yellow-50 text-yellow-800", Icon: CircleAlert, action: "contact" };
    if (intentStatus === "CANCELLED") return { label: "Phiên đã hủy", className: "bg-slate-100 text-slate-700", Icon: CircleAlert, action: "contact" };
    return { label: "Chờ sắp xếp thanh toán", className: "bg-yellow-50 text-yellow-800", Icon: Clock3, action: "contact" };
};

const PaymentCard = ({ payment, onPay, onContact }) => {
    const state = getPaymentState(payment);
    const StatusIcon = state.Icon;
    const intent = payment?.paymentIntent;

    return (
        <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/[0.03] transition sm:p-5 sm:hover:border-blue-200 sm:hover:shadow-md sm:hover:shadow-blue-950/[0.06]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-blue-950 sm:text-lg">{getPaymentPeriod(payment)}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${state.className}`}><StatusIcon size={14} /> {state.label}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1.5"><WalletCards size={16} className="text-blue-700" /> Mã học phí #{payment?.paymentId ?? "--"}</span>
                        {payment?.paidAt ? <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} className="text-blue-700" /> Đã đóng: {formatDate(payment.paidAt)}</span> : null}
                        {intent?.expiresAt ? <span className="inline-flex items-center gap-1.5"><Clock3 size={16} className="text-blue-700" /> Hết hạn: {formatDate(intent.expiresAt)}</span> : null}
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:min-w-52 sm:items-end">
                    <p className="text-xl font-extrabold text-blue-950">{formatCurrency(getPaymentAmount(payment))}</p>
                    {state.action === "pay" ? <button type="button" onClick={() => onPay(payment)} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900 sm:w-auto"><CreditCard size={18} /> Thanh toán ngay</button> : null}
                    {state.action === "contact" ? <button type="button" onClick={() => onContact(payment)} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50 sm:w-auto"><MessageCircle size={18} /> Thanh toán</button> : null}
                </div>
            </div>
        </article>
    );
};

const LoadingCards = () => <div className="space-y-3">{Array.from({ length: 4 }, (_, index) => <div key={index} className="animate-pulse rounded-2xl border border-blue-100 p-5"><div className="h-5 w-44 rounded bg-blue-100" /><div className="mt-4 h-4 w-72 max-w-full rounded bg-blue-50" /><div className="mt-5 h-11 w-full rounded-xl bg-blue-50 sm:ml-auto sm:w-44" /></div>)}</div>;

const PaymentPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoadingPayments);
    const payments = useSelector(selectMyPayments);
    const pagination = useSelector(selectPaymentPagination);
    const error = useSelector(selectPaymentError);
    const [page, setPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const limit = 20;

    const paymentItems = useMemo(() => Array.isArray(payments) ? payments : payments?.items ?? payments?.rows ?? payments?.data ?? [], [payments]);
    const normalizedError = typeof error === "string" ? error : error?.message;

    useEffect(() => {
        dispatch(getMyPaymentsAsync({ page, limit, sortBy: "period", sortOrder: "desc" }));
    }, [dispatch, page]);

    const refreshPayments = () => dispatch(getMyPaymentsAsync({ page, limit, sortBy: "period", sortOrder: "desc" }));

    const handlePayNow = (payment) => {
        const intentId = payment?.paymentIntent?.paymentIntentId;
        if (!payment?.paymentId || !intentId) {
            setSelectedPayment(payment);
            return;
        }
        navigate(ROUTES.TUITION_PAYMENT_INTENT(payment.paymentId, intentId));
    };

    const totalRecords = pagination?.total ?? paymentItems.length;

    return (
        <section>
            <div className="flex flex-col gap-3 border-b border-blue-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-800">Quản lý học phí</p>
                    <h2 className="mt-1 text-xl font-bold text-blue-950 sm:text-2xl">Các khoản cần theo dõi</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Phiên thanh toán trực tuyến sẽ có nút thanh toán ngay. Các khoản khác cần được thầy giáo hỗ trợ.</p>
                </div>
                <button type="button" onClick={refreshPayments} disabled={loading} className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 px-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Làm mới</button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm font-medium text-gray-600">{totalRecords} khoản học phí</p></div>

            <div className="mt-3">
                {loading ? <LoadingCards /> : normalizedError ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">{normalizedError}</div> : paymentItems.length ? <div className="space-y-3">{paymentItems.map((payment, index) => <PaymentCard key={payment?.paymentId ?? index} payment={payment} onPay={handlePayNow} onContact={setSelectedPayment} />)}</div> : <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 px-5 py-12 text-center"><WalletCards className="mx-auto text-blue-700" size={32} /><h3 className="mt-4 text-lg font-bold text-blue-950">Chưa có khoản học phí</h3><p className="mt-2 text-sm text-gray-600">Khi nhà trường tạo học phí, thông tin sẽ xuất hiện tại đây.</p></div>}
            </div>

            {paymentItems.length && !loading ? <div className="mt-5"><Pagination currentPage={pagination?.page ?? page} totalPages={pagination?.totalPages ?? 1} onPageChange={setPage} /></div> : null}

            <Modal isOpen={Boolean(selectedPayment)} onClose={() => setSelectedPayment(null)} overlayClassName="overflow-y-auto">
                <section onClick={(event) => event.stopPropagation()} className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                    <header className="flex items-start justify-between gap-4 bg-blue-50 px-5 py-5">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700"><MessageCircle size={22} /></span>
                        <button type="button" onClick={() => setSelectedPayment(null)} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-blue-950" aria-label="Đóng"><X size={18} /></button>
                    </header>
                    <div className="px-5 pb-6">
                        <h2 className="text-xl font-bold text-blue-950">Liên hệ thầy giáo để đóng học phí</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-600">Khoản <strong>{getPaymentPeriod(selectedPayment)}</strong> hiện chưa có phiên thanh toán trực tuyến. Vui lòng liên hệ giáo viên chủ nhiệm hoặc bộ phận học vụ để được hỗ trợ.</p>
                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-950"><span className="font-semibold">Mã học phí:</span> #{selectedPayment?.paymentId ?? "--"}<br /><span className="font-semibold">Số tiền:</span> {formatCurrency(getPaymentAmount(selectedPayment))}</div>
                        <button type="button" onClick={() => setSelectedPayment(null)} className="mt-6 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900">Đã hiểu</button>
                    </div>
                </section>
            </Modal>
        </section>
    );
};

export default memo(PaymentPage);
