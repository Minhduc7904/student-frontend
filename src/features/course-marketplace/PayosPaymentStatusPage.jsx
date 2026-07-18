import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert, Clock3, CreditCard, LoaderCircle, RefreshCw, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../core/constants";
import { courseService } from "../../core/services/modules/courseService";
import { useInvoicePaymentStatus } from "./hooks/useInvoicePaymentStatus";
import { getPayosPaymentDetails, getSavedPayosPayment, savePayosPayment } from "./paymentUtils";

const STATUS_COPY = {
    PAYMENT_FAILED: { title: "Thanh toán chưa thành công", description: "PayOS chưa xác nhận được giao dịch này. Bạn có thể tạo lại một phiên thanh toán mới." },
    EXPIRED: { title: "Phiên thanh toán đã hết hạn", description: "Liên kết PayOS chỉ có hiệu lực trong thời gian giới hạn. Hãy tạo lại phiên thanh toán để tiếp tục." },
    CANCELLED: { title: "Bạn đã hủy thanh toán", description: "Hóa đơn chưa được thanh toán. Bạn có thể quay lại PayOS bất cứ khi nào sẵn sàng." },
};

const PageShell = ({ children }) => (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 px-4 py-8 text-blue-950 sm:px-6">
        <section className="w-full max-w-lg overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-200/40">
            {children}
        </section>
    </main>
);

const PayosPaymentStatusPage = ({ mode = "return" }) => {
    const navigate = useNavigate();
    const savedPayment = useMemo(() => getSavedPayosPayment(), []);
    const [resolvedPayment, setResolvedPayment] = useState(mode === "cancel" ? { status: "CANCELLED" } : null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryError, setRetryError] = useState("");
    const isCancelPage = mode === "cancel";

    const handlePaid = useCallback((payment) => {
        setResolvedPayment(payment);
    }, []);

    const handleTerminal = useCallback((payment) => {
        setResolvedPayment(payment);
    }, []);

    const { isChecking, error: pollingError, payment: polledPayment } = useInvoicePaymentStatus({
        invoiceId: savedPayment?.invoiceId,
        enabled: Boolean(savedPayment?.invoiceId) && !isCancelPage && !resolvedPayment,
        onPaid: handlePaid,
        onTerminal: handleTerminal,
    });

    const payment = resolvedPayment || polledPayment;
    const isPaid = payment?.status === "PAID" && payment?.enrollmentCreated;
    const statusCopy = STATUS_COPY[payment?.status] || STATUS_COPY.CANCELLED;

    const retryPayment = async () => {
        if (!savedPayment?.invoiceId || isRetrying) return;

        setIsRetrying(true);
        setRetryError("");
        try {
            const response = await courseService.createPayosPayment(savedPayment.invoiceId);
            const nextPayment = getPayosPaymentDetails(response);

            if (!nextPayment.paymentUrl) throw new Error("Không thể tạo liên kết thanh toán PayOS. Vui lòng thử lại sau.");

            savePayosPayment({ ...savedPayment, ...nextPayment });
            window.location.assign(nextPayment.paymentUrl);
        } catch (requestError) {
            setRetryError(requestError?.message || "Không thể tạo lại phiên thanh toán. Vui lòng thử lại sau.");
        } finally {
            setIsRetrying(false);
        }
    };

    if (!savedPayment?.invoiceId) {
        return (
            <PageShell>
                <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-700"><CircleAlert size={32} /></span>
                    <h1 className="mt-5 text-2xl font-bold">Không tìm thấy phiên thanh toán</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600">Để bảo mật, trạng thái thanh toán chỉ được kiểm tra bằng mã hóa đơn đã lưu trong phiên mua khóa học.</p>
                    <button type="button" onClick={() => navigate(ROUTES.COURSE_MARKETPLACE)} className="mt-7 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800">
                        <ArrowLeft size={18} /> Quay lại danh sách khóa học
                    </button>
                </div>
            </PageShell>
        );
    }

    if (isPaid) {
        return (
            <PageShell>
                <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={36} /></span>
                    <p className="mt-5 text-sm font-bold uppercase tracking-wider text-emerald-700">PayOS đã xác nhận</p>
                    <h1 className="mt-2 text-2xl font-bold">Thanh toán thành công</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{savedPayment.courseTitle ? `Khóa học “${savedPayment.courseTitle}” đã sẵn sàng cho bạn.` : "Khóa học đã được mở trong tài khoản của bạn."}</p>
                    <button type="button" onClick={() => navigate(savedPayment.courseId ? ROUTES.COURSE_DETAIL(savedPayment.courseId) : ROUTES.COURSE_ENROLLMENTS, { replace: true, state: { resetAll: true } })} className="mt-7 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800">
                        <School size={18} /> Vào học
                    </button>
                </div>
            </PageShell>
        );
    }

    if (resolvedPayment || isCancelPage) {
        return (
            <PageShell>
                <div className="px-6 py-9 sm:px-10 sm:py-11">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-700"><CircleAlert size={32} /></span>
                    <div className="mt-5 text-center">
                        <h1 className="text-2xl font-bold">{statusCopy.title}</h1>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{statusCopy.description}</p>
                    </div>
                    {retryError ? <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">{retryError}</p> : null}
                    <div className="mt-7 grid gap-3">
                        <button type="button" onClick={retryPayment} disabled={isRetrying} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                            {isRetrying ? <LoaderCircle size={18} className="animate-spin" /> : <RefreshCw size={18} />} Tạo lại thanh toán PayOS
                        </button>
                        <button type="button" onClick={() => navigate(ROUTES.COURSE_MARKETPLACE)} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50">
                            <ArrowLeft size={18} /> Quay lại khóa học
                        </button>
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700"><CreditCard size={32} /></span>
                <h1 className="mt-5 text-2xl font-bold">Đang xác nhận thanh toán</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">Hệ thống đang kiểm tra giao dịch trực tiếp với hóa đơn của bạn. Không sử dụng dữ liệu trên đường dẫn trả về để xác nhận thanh toán.</p>
                <div className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
                    {isChecking ? <LoaderCircle size={18} className="animate-spin" /> : <Clock3 size={18} />} Kiểm tra lại mỗi 2 giây
                </div>
                {pollingError ? <p className="mt-4 text-sm font-medium leading-6 text-red-700">{pollingError}</p> : null}
            </div>
        </PageShell>
    );
};

export default PayosPaymentStatusPage;
