import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clipboard, Clock3, CreditCard, LoaderCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { ROUTES, SOCKET_EVENTS } from "../../core/constants";
import { courseService } from "../../core/services/modules/courseService";
import { courseEnrollmentService } from "../../core/services/modules/courseEnrollmentService";
import { socketService } from "../../core/services/socket/socket.service";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};
const formatCurrency = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} đ`;
const formatCountdown = (seconds) => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(Math.max(0, seconds) % 60).padStart(2, "0")}`;
const isPaidStatus = (status) => String(status || "").toUpperCase() === "PAID";

const CoursePaymentIntentPage = () => {
    const { courseId, paymentIntentId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const initialInstructions = useRef(location.state?.instructions ?? null);
    const courseReference = location.state?.courseReference || courseId;
    const courseTitle = location.state?.courseTitle || `Khóa học #${courseId}`;
    const [instructions, setInstructions] = useState(initialInstructions.current);
    const [intentStatus, setIntentStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingQr, setUpdatingQr] = useState(false);
    const [syncingEnrollment, setSyncingEnrollment] = useState(false);
    const [enrollmentSynced, setEnrollmentSynced] = useState(false);
    const [error, setError] = useState("");
    const [remainingSeconds, setRemainingSeconds] = useState(null);
    const renewalRef = useRef(false);
    const enrollmentSyncStarted = useRef(false);

    const paymentIsPaid = isPaidStatus(intentStatus);

    const syncEnrollment = useCallback(async () => {
        if (enrollmentSyncStarted.current) return;
        enrollmentSyncStarted.current = true;
        setSyncingEnrollment(true);
        try {
            await courseEnrollmentService.getMyEnrollments({ page: 1, limit: 100 });
            setEnrollmentSynced(true);
        } catch (requestError) {
            enrollmentSyncStarted.current = false;
            setError(requestError?.message || "Đã xác nhận thanh toán nhưng chưa thể tải lại khóa học.");
        } finally {
            setSyncingEnrollment(false);
        }
    }, []);

    const markPaid = useCallback(() => {
        setIntentStatus("PAID");
        setInstructions(null);
        syncEnrollment();
    }, [syncEnrollment]);

    const getIntentSnapshot = useCallback(async () => {
        const response = await courseService.getCoursePaymentIntentStatus(courseReference, paymentIntentId);
        const snapshot = unwrap(response);
        setIntentStatus(snapshot?.intentStatus || "");
        if (isPaidStatus(snapshot?.intentStatus)) markPaid();
        return snapshot;
    }, [courseReference, markPaid, paymentIntentId]);

    const loadInstructions = useCallback(async () => {
        setUpdatingQr(true);
        setError("");
        try {
            const response = await courseService.getCoursePaymentInstructions(courseReference);
            const nextInstructions = unwrap(response);
            const status = String(nextInstructions?.status || "").toUpperCase();
            if (["FREE", "ACTIVE"].includes(status)) {
                markPaid();
                return nextInstructions;
            }
            if (!nextInstructions?.paymentIntentId || status !== "PENDING") {
                throw new Error("Phiên thanh toán chưa sẵn sàng. Vui lòng thử lại sau.");
            }
            setInstructions(nextInstructions);
            setIntentStatus("PENDING");
            return nextInstructions;
        } catch (requestError) {
            setError(requestError?.message || "Không thể lấy mã QR thanh toán. Vui lòng thử lại.");
            return null;
        } finally {
            setUpdatingQr(false);
        }
    }, [courseReference, markPaid]);

    const loadPayment = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const snapshot = await getIntentSnapshot();
            if (isPaidStatus(snapshot?.intentStatus)) return;
            const savedInstructions = initialInstructions.current;
            if (savedInstructions?.paymentIntentId && String(savedInstructions.paymentIntentId) === String(paymentIntentId)) {
                setInstructions(savedInstructions);
                setIntentStatus(savedInstructions.status || "PENDING");
                initialInstructions.current = null;
            } else {
                await loadInstructions();
            }
        } catch (requestError) {
            setError(requestError?.message || "Không thể tải trạng thái thanh toán khóa học.");
        } finally {
            setLoading(false);
        }
    }, [getIntentSnapshot, loadInstructions, paymentIntentId]);

    useEffect(() => {
        loadPayment();
    }, [loadPayment]);

    useEffect(() => {
        if (!instructions?.expiresAt || paymentIsPaid || String(instructions?.status || "").toUpperCase() !== "PENDING") {
            setRemainingSeconds(null);
            return undefined;
        }

        const updateCountdown = () => {
            const seconds = Math.ceil((new Date(instructions.expiresAt).getTime() - Date.now()) / 1000);
            setRemainingSeconds(Math.max(0, seconds));
            if (seconds > 0) renewalRef.current = false;
            if (seconds <= 0 && !renewalRef.current) {
                renewalRef.current = true;
                loadInstructions();
            }
        };
        updateCountdown();
        const timer = window.setInterval(updateCountdown, 1000);
        return () => window.clearInterval(timer);
    }, [instructions?.expiresAt, instructions?.status, loadInstructions, paymentIsPaid]);

    useEffect(() => {
        if (!paymentIntentId || paymentIsPaid) return undefined;
        let retryTimer;
        let socket;
        let disposed = false;
        let subscribed = false;
        let detachSocket = () => {};

        const leaveIntentRoom = () => {
            if (!subscribed || !socket?.connected) return;
            socket.emit(SOCKET_EVENTS.COURSE_PAYMENT_INTENT.UNSUBSCRIBE, { paymentIntentId: Number(paymentIntentId) });
            subscribed = false;
        };

        const applyIntent = (payload) => {
            const intent = payload?.intent ?? payload;
            if (!intent || String(intent.paymentIntentId) !== String(paymentIntentId)) return;
            setIntentStatus(intent.intentStatus || "");
            if (isPaidStatus(intent.intentStatus)) {
                leaveIntentRoom();
                markPaid();
            }
        };

        const attach = () => {
            socket = socketService.socket;
            if (!socket) {
                retryTimer = window.setTimeout(attach, 250);
                return;
            }

            const subscribe = async () => {
                try {
                    const snapshot = await getIntentSnapshot();
                    if (disposed || isPaidStatus(snapshot?.intentStatus)) {
                        leaveIntentRoom();
                        return;
                    }
                    socket.emit(SOCKET_EVENTS.COURSE_PAYMENT_INTENT.SUBSCRIBE, { paymentIntentId: Number(paymentIntentId) });
                    subscribed = true;
                } catch {
                    // The socket's next reconnect will retry the REST snapshot before subscribing again.
                }
            };
            const handleStatus = (payload) => applyIntent(payload);
            const handlePaid = (payload) => applyIntent(payload);
            const handleSocketError = (payload) => {
                if (payload?.code?.startsWith("COURSE_PAYMENT") || payload?.code === "INVALID_PAYMENT_INTENT_ID") {
                    setError(payload?.message || "Không thể đồng bộ trạng thái thanh toán.");
                }
            };

            socket.on(SOCKET_EVENTS.COURSE_PAYMENT_INTENT.STATUS, handleStatus);
            socket.on(SOCKET_EVENTS.COURSE_PAYMENT_INTENT.PAID, handlePaid);
            socket.on("error", handleSocketError);
            socket.on("connect", subscribe);
            if (socket.connected) subscribe();

            detachSocket = () => {
                leaveIntentRoom();
                socket.off(SOCKET_EVENTS.COURSE_PAYMENT_INTENT.STATUS, handleStatus);
                socket.off(SOCKET_EVENTS.COURSE_PAYMENT_INTENT.PAID, handlePaid);
                socket.off("error", handleSocketError);
                socket.off("connect", subscribe);
            };
        };

        attach();
        return () => {
            disposed = true;
            window.clearTimeout(retryTimer);
            detachSocket();
        };
    }, [getIntentSnapshot, markPaid, paymentIntentId, paymentIsPaid]);

    const copyTransferContent = async () => {
        try {
            await navigator.clipboard.writeText(instructions?.transferContent || "");
        } catch {
            setError("Không thể sao chép nội dung chuyển khoản trên thiết bị này.");
        }
    };

    if (loading) {
        return <main className="min-h-dvh bg-blue-50 px-4 py-8"><div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-blue-100 bg-white p-6"><div className="h-7 w-52 rounded bg-blue-100" /><div className="mt-6 h-80 rounded-2xl bg-blue-50" /></div></main>;
    }

    const account = instructions?.receivingBankAccount;
    const pendingQr = String(instructions?.status || "").toUpperCase() === "PENDING" && !paymentIsPaid;

    return (
        <main className="min-h-dvh bg-blue-50 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-3xl">
                <button type="button" onClick={() => navigate(ROUTES.COURSE_PURCHASE_DETAIL(courseId))} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-blue-800 transition hover:text-blue-950"><ArrowLeft size={18} /> Quay lại khóa học</button>
                <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-950/5">
                    <header className="bg-blue-800 px-5 py-6 text-white sm:px-7">
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-100">Thanh toán khóa học</p>
                        <div className="mt-2 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">{courseTitle}</h1><p className="mt-1 text-sm text-blue-100">Số tiền cần thanh toán: <strong className="text-white">{formatCurrency(instructions?.amount)}</strong></p></div><span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold">{paymentIsPaid ? "Đã thanh toán" : pendingQr ? "Đang chờ thanh toán" : "Cập nhật giao dịch"}</span></div>
                    </header>

                    <div className="p-5 sm:p-7">
                        {error ? <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
                        {paymentIsPaid ? <div className="py-6 text-center sm:py-10"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={42} /></span><p className="mt-5 text-sm font-bold uppercase tracking-wide text-emerald-700">Giao dịch đã được xác nhận</p><h2 className="mt-2 text-2xl font-bold text-blue-950">Thanh toán thành công</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">Khóa học của bạn đang được cập nhật trước khi mở nội dung.</p><button type="button" onClick={() => navigate(ROUTES.COURSE_DETAIL(courseId), { replace: true, state: { resetAll: true } })} disabled={!enrollmentSynced || syncingEnrollment} className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60">{syncingEnrollment ? <LoaderCircle size={18} className="animate-spin" /> : null}{enrollmentSynced ? "Vào học ngay" : "Đang cập nhật khóa học"}</button>{!enrollmentSynced && !syncingEnrollment ? <button type="button" onClick={syncEnrollment} className="mt-3 block w-full text-sm font-bold text-blue-800 hover:text-blue-950">Thử tải lại khóa học</button> : null}</div> : pendingQr ? <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start"><div className="order-2 space-y-4 lg:order-1"><div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-800">Thông tin chuyển khoản</p><div className="mt-3 space-y-3 text-sm"><p className="flex justify-between gap-3"><span className="text-gray-600">Ngân hàng</span><strong className="text-right text-blue-950">{account?.bankCode || "--"}</strong></p><p className="flex justify-between gap-3"><span className="text-gray-600">Số tài khoản</span><strong className="text-right text-blue-950">{account?.accountNumber || "--"}</strong></p><p className="flex justify-between gap-3"><span className="text-gray-600">Chủ tài khoản</span><strong className="text-right text-blue-950">{account?.accountHolder || "--"}</strong></p><p className="flex justify-between gap-3"><span className="text-gray-600">Số tiền</span><strong className="text-right text-blue-950">{formatCurrency(instructions?.amount)}</strong></p></div></div><div className="rounded-xl border border-blue-100 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-800">Nội dung chuyển khoản</p><p className="mt-2 break-words rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold leading-6 text-blue-950">{instructions?.transferContent}</p><button type="button" onClick={copyTransferContent} className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-950"><Clipboard size={16} /> Sao chép nội dung</button></div></div><aside className="order-1 lg:order-2"><div className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm"><img src={instructions?.qrCodeUrl} alt="Mã QR thanh toán khóa học" className="aspect-square w-full rounded-xl object-contain" /></div><div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-yellow-50 px-3 py-2.5 text-sm font-bold text-yellow-800"><Clock3 size={17} /> {remainingSeconds === null ? "Đang chuẩn bị phiên thanh toán" : `Mã QR còn hiệu lực ${formatCountdown(remainingSeconds)}`}</div></aside><div className="order-3 border-t border-blue-100 pt-5"><button type="button" onClick={loadInstructions} disabled={updatingQr} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">{updatingQr ? <LoaderCircle size={18} className="animate-spin" /> : <RefreshCw size={18} />} Tải lại mã QR</button></div></div> : <div className="py-8 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-700"><CreditCard size={32} /></span><h2 className="mt-5 text-xl font-bold text-blue-950">Phiên thanh toán chưa sẵn sàng</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">Hệ thống đang cập nhật trạng thái thanh toán khóa học của bạn.</p><button type="button" onClick={loadPayment} disabled={updatingQr} className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60"><RefreshCw size={18} /> Thử lại</button></div>}
                    </div>
                    <footer className="flex items-center gap-2 border-t border-blue-100 bg-blue-50/60 px-5 py-3 text-xs leading-5 text-blue-950 sm:px-7"><ShieldCheck size={16} className="shrink-0 text-blue-700" /> Giao dịch được đối soát tự động qua SePay. Giữ nguyên số tiền và nội dung chuyển khoản để hệ thống xác nhận nhanh chóng.</footer>
                </section>
            </div>
        </main>
    );
};

export default CoursePaymentIntentPage;
