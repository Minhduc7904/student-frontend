import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clipboard, Clock3, CreditCard, Landmark, LoaderCircle, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { ROUTES, SOCKET_EVENTS } from "../../core/constants";
import { socketService } from "../../core/services/socket/socket.service";
import { tuitionPaymentService } from "../../core/services/modules/tuitionPaymentService";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};
const formatCurrency = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} đ`;
const formatCountdown = (seconds) => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(Math.max(0, seconds) % 60).padStart(2, "0")}`;
const isPaid = (detail, intentStatus) => String(detail?.status || "").toUpperCase() === "PAID" || String(intentStatus || detail?.paymentIntent?.status || "").toUpperCase() === "PAID";

const PaymentIntentPage = () => {
    const { paymentId } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [intentStatus, setIntentStatus] = useState("");
    const [instructions, setInstructions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creatingQr, setCreatingQr] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState("");
    const [remainingSeconds, setRemainingSeconds] = useState(null);
    const renewalRef = useRef(false);

    const paymentIntentId = payment?.paymentIntent?.paymentIntentId;
    const paymentIsPaid = isPaid(payment, intentStatus);

    const refreshIntentStatus = useCallback(async () => {
        const response = await tuitionPaymentService.getPaymentIntentStatus(paymentId);
        const snapshot = unwrap(response);
        setIntentStatus(snapshot?.intentStatus || "");
        setPayment((current) => current ? {
            ...current,
            status: snapshot?.tuitionPaymentStatus ?? current.status,
            paidAt: snapshot?.paidAt ?? current.paidAt,
            paymentIntent: {
                ...current.paymentIntent,
                paymentIntentId: snapshot?.paymentIntentId ?? current.paymentIntent?.paymentIntentId,
                status: snapshot?.intentStatus ?? current.paymentIntent?.status,
            },
        } : current);
        return snapshot;
    }, [paymentId]);

    const loadInstructions = useCallback(async () => {
        setCreatingQr(true);
        setError("");
        try {
            const response = await tuitionPaymentService.getPaymentInstructions(paymentId);
            const nextInstructions = unwrap(response);
            setInstructions(nextInstructions);
            setIntentStatus(nextInstructions?.status || "PENDING");
            setPayment((current) => current ? {
                ...current,
                paymentIntent: {
                    ...current.paymentIntent,
                    paymentIntentId: nextInstructions?.paymentIntentId ?? current.paymentIntent?.paymentIntentId,
                    status: nextInstructions?.status ?? current.paymentIntent?.status,
                },
            } : current);
            return nextInstructions;
        } catch (requestError) {
            setError(requestError?.message || "Không thể tạo mã QR thanh toán. Vui lòng thử lại.");
            return null;
        } finally {
            setCreatingQr(false);
        }
    }, [paymentId]);

    const refreshInstructions = useCallback(async () => {
        setCreatingQr(true);
        setError("");
        try {
            const response = await tuitionPaymentService.refreshPaymentInstructions(paymentId);
            const nextInstructions = unwrap(response);
            setInstructions(nextInstructions);
            setIntentStatus(nextInstructions?.status || "PENDING");
            setPayment((current) => current ? {
                ...current,
                paymentIntent: {
                    ...current.paymentIntent,
                    paymentIntentId: nextInstructions?.paymentIntentId ?? current.paymentIntent?.paymentIntentId,
                    status: nextInstructions?.status ?? current.paymentIntent?.status,
                },
            } : current);
        } catch (requestError) {
            setError(requestError?.message || "Không thể tạo mã QR mới. Vui lòng thử lại.");
        } finally {
            setCreatingQr(false);
        }
    }, [paymentId]);

    const loadPayment = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [detailResponse, statusResponse] = await Promise.all([
                tuitionPaymentService.getDetail(paymentId),
                tuitionPaymentService.getPaymentIntentStatus(paymentId),
            ]);
            const detail = unwrap(detailResponse);
            const snapshot = unwrap(statusResponse);
            setPayment({
                ...detail,
                paymentIntent: {
                    ...detail?.paymentIntent,
                    paymentIntentId: snapshot?.paymentIntentId ?? detail?.paymentIntent?.paymentIntentId,
                    status: snapshot?.intentStatus ?? detail?.paymentIntent?.status,
                },
            });
            setIntentStatus(snapshot?.intentStatus || detail?.paymentIntent?.status || "");
            if (!isPaid(detail, snapshot?.intentStatus) && String(snapshot?.intentStatus || detail?.paymentIntent?.status || "").toUpperCase() === "PENDING") {
                await loadInstructions();
            }
        } catch (requestError) {
            setError(requestError?.message || "Không thể tải thông tin học phí. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [loadInstructions, paymentId]);

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

        const isPaidSnapshot = (snapshot) => (
            String(snapshot?.tuitionPaymentStatus || "").toUpperCase() === "PAID"
            || String(snapshot?.intentStatus || "").toUpperCase() === "PAID"
        );

        const leaveIntentRoom = () => {
            if (!subscribed || !socket?.connected) return;
            socket.emit(SOCKET_EVENTS.TUITION_PAYMENT_INTENT.UNSUBSCRIBE, { paymentIntentId: Number(paymentIntentId) });
            subscribed = false;
        };

        const applyIntent = (payload) => {
            const intent = payload?.intent ?? payload;
            if (!intent || String(intent.paymentIntentId) !== String(paymentIntentId)) return;
            setIntentStatus(intent.intentStatus || "");
            if (isPaidSnapshot(intent)) {
                leaveIntentRoom();
                setInstructions(null);
                setPayment((current) => current ? { ...current, status: "PAID", paidAt: intent.paidAt ?? current.paidAt, paymentIntent: { ...current.paymentIntent, status: "PAID" } } : current);
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
                    const snapshot = await refreshIntentStatus();
                    if (disposed || isPaidSnapshot(snapshot)) {
                        leaveIntentRoom();
                        return;
                    }
                    socket.emit(SOCKET_EVENTS.TUITION_PAYMENT_INTENT.SUBSCRIBE, { paymentIntentId: Number(paymentIntentId) });
                    subscribed = true;
                } catch {
                    // A later reconnect or the socket status event will retry the snapshot.
                }
            };
            const handleStatus = (payload) => applyIntent(payload);
            const handlePaid = (payload) => applyIntent(payload);
            const handleSocketError = (payload) => {
                if (payload?.code?.startsWith("TUITION_PAYMENT") || payload?.code === "INVALID_PAYMENT_INTENT_ID") {
                    setError(payload?.message || "Không thể đồng bộ trạng thái thanh toán.");
                }
            };

            socket.on(SOCKET_EVENTS.TUITION_PAYMENT_INTENT.STATUS, handleStatus);
            socket.on(SOCKET_EVENTS.TUITION_PAYMENT_INTENT.PAID, handlePaid);
            socket.on("error", handleSocketError);
            socket.on("connect", subscribe);
            if (socket.connected) subscribe();

            detachSocket = () => {
                leaveIntentRoom();
                socket.off(SOCKET_EVENTS.TUITION_PAYMENT_INTENT.STATUS, handleStatus);
                socket.off(SOCKET_EVENTS.TUITION_PAYMENT_INTENT.PAID, handlePaid);
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
    }, [paymentIntentId, paymentIsPaid, refreshIntentStatus]);

    const cancelAttempt = async () => {
        if (!instructions?.paymentAttemptId || cancelling) return;
        setCancelling(true);
        setError("");
        try {
            const response = await tuitionPaymentService.cancelPaymentAttempt(paymentId, instructions.paymentAttemptId);
            const cancelled = unwrap(response);
            setInstructions((current) => current ? { ...current, ...cancelled, status: "CANCELLED" } : current);
        } catch (requestError) {
            setError(requestError?.message || "Không thể hủy giao dịch. Vui lòng thử lại.");
        } finally {
            setCancelling(false);
        }
    };

    const copyTransferContent = async () => {
        try {
            await navigator.clipboard.writeText(instructions?.transferContent || "");
        } catch {
            setError("Không thể sao chép nội dung chuyển khoản trên thiết bị này.");
        }
    };

    if (loading) return <main className="min-h-dvh bg-blue-50 px-4 py-8"><div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-blue-100 bg-white p-6"><div className="h-7 w-52 rounded bg-blue-100" /><div className="mt-6 h-80 rounded-2xl bg-blue-50" /></div></main>;

    const account = instructions?.receivingBankAccount;
    const pendingQr = String(instructions?.status || "").toUpperCase() === "PENDING" && !paymentIsPaid;
    const cancelled = String(instructions?.status || "").toUpperCase() === "CANCELLED";

    return (
        <main className="min-h-dvh bg-blue-50 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-3xl">
                <button type="button" onClick={() => navigate(ROUTES.PAYMENT)} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-blue-800 transition hover:text-blue-950"><ArrowLeft size={18} /> Quay lại học phí</button>
                <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-950/5">
                    <header className="bg-blue-800 px-5 py-6 text-white sm:px-7">
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-100">Thanh toán học phí</p>
                        <div className="mt-2 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">Học phí #{payment?.paymentId ?? paymentId}</h1><p className="mt-1 text-sm text-blue-100">Số tiền cần thanh toán: <strong className="text-white">{formatCurrency(payment?.amount)}</strong></p></div><span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold">{paymentIsPaid ? "Đã thanh toán" : pendingQr ? "Đang chờ thanh toán" : "Cập nhật giao dịch"}</span></div>
                    </header>

                    <div className="p-5 sm:p-7">
                        {error ? <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
                        {paymentIsPaid ? <div className="py-6 text-center sm:py-10"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={42} /></span><p className="mt-5 text-sm font-bold uppercase tracking-wide text-emerald-700">Giao dịch đã được xác nhận</p><h2 className="mt-2 text-2xl font-bold text-blue-950">Thanh toán thành công</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">Học phí của bạn đã được cập nhật. Cảm ơn bạn đã hoàn tất thanh toán.</p></div> : pendingQr ? <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start"><div className="order-2 space-y-4 lg:order-1"><div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-800">Thông tin chuyển khoản</p><div className="mt-3 space-y-3 text-sm"><p className="flex justify-between gap-3"><span className="text-gray-600">Ngân hàng</span><strong className="text-right text-blue-950">{account?.bankCode || "--"}</strong></p><p className="flex justify-between gap-3"><span className="text-gray-600">Số tài khoản</span><strong className="text-right text-blue-950">{account?.accountNumber || "--"}</strong></p><p className="flex justify-between gap-3"><span className="text-gray-600">Chủ tài khoản</span><strong className="text-right text-blue-950">{account?.accountHolder || "--"}</strong></p><p className="flex justify-between gap-3"><span className="text-gray-600">Số tiền</span><strong className="text-right text-blue-950">{formatCurrency(instructions?.amount)}</strong></p></div></div><div className="rounded-xl border border-blue-100 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-800">Nội dung chuyển khoản</p><p className="mt-2 break-words rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold leading-6 text-blue-950">{instructions?.transferContent}</p><button type="button" onClick={copyTransferContent} className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-950"><Clipboard size={16} /> Sao chép nội dung</button></div></div><aside className="order-1 lg:order-2"><div className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm"><img src={instructions?.qrCodeUrl} alt="Mã QR thanh toán học phí" className="aspect-square w-full rounded-xl object-contain" /></div><div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-yellow-50 px-3 py-2.5 text-sm font-bold text-yellow-800"><Clock3 size={17} /> {remainingSeconds === null ? "Đang chuẩn bị phiên thanh toán" : `Mã QR còn hiệu lực ${formatCountdown(remainingSeconds)}`}</div></aside><div className="order-3 flex flex-col gap-3 border-t border-blue-100 pt-5 sm:flex-row"><button type="button" onClick={cancelAttempt} disabled={cancelling} className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">{cancelling ? <LoaderCircle size={18} className="animate-spin" /> : <XCircle size={18} />} Hủy giao dịch</button><button type="button" onClick={refreshInstructions} disabled={creatingQr} className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">{creatingQr ? <LoaderCircle size={18} className="animate-spin" /> : <RefreshCw size={18} />} Làm mới mã QR</button></div></div> : <div className="py-8 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-700"><CreditCard size={32} /></span><h2 className="mt-5 text-xl font-bold text-blue-950">{cancelled ? "Giao dịch đã được hủy" : "Phiên thanh toán chưa sẵn sàng"}</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">{cancelled ? "Bạn có thể tạo một mã QR mới khi sẵn sàng tiếp tục thanh toán." : "Hệ thống đang cập nhật trạng thái học phí của bạn."}</p><button type="button" onClick={refreshInstructions} disabled={creatingQr} className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">{creatingQr ? <LoaderCircle size={18} className="animate-spin" /> : <RefreshCw size={18} />} Tạo mã QR mới</button></div>}
                    </div>
                    <footer className="flex items-center gap-2 border-t border-blue-100 bg-blue-50/60 px-5 py-3 text-xs leading-5 text-blue-950 sm:px-7"><ShieldCheck size={16} className="shrink-0 text-blue-700" /> Giao dịch được đối soát tự động. Giữ nguyên số tiền và nội dung chuyển khoản để hệ thống xác nhận nhanh chóng.</footer>
                </section>
            </div>
        </main>
    );
};

export default PaymentIntentPage;
