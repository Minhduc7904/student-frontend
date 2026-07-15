import { CheckCircle2, CircleDollarSign, Clock3, RefreshCw, X } from "lucide-react";
import { Modal } from "../../../shared/components/modal/Modal";
import { formatPrice, getInvoiceAmount, getTransferContent, getVietQrUrl } from "../paymentUtils";

const DetailRow = ({ label, children, className = "" }) => (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
        <span className="shrink-0 text-sm text-gray-600">{label}</span>
        <span className="min-w-0 text-right text-sm font-bold text-blue-950">{children}</span>
    </div>
);

const PurchasePaymentModal = ({ isOpen, onClose, course, invoice, invoiceId, profile, status, isChecking, error }) => {
    const isPaid = status === "PAID";
    const amount = getInvoiceAmount(invoice, course);
    const transferContent = getTransferContent({ course, profile, invoiceId });
    const qrUrl = getVietQrUrl({ amount, transferContent });

    return (
        <Modal isOpen={isOpen} onClose={isPaid ? undefined : onClose} overlayClassName="overflow-y-auto">
            <section onClick={(event) => event.stopPropagation()} className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                {!isPaid ? (
                    <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-blue-950" aria-label="Đóng thanh toán">
                        <X size={18} />
                    </button>
                ) : null}

                {isPaid ? (
                    <div className="px-6 py-12 text-center sm:px-10">
                        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 animate-bounce-in"><CheckCircle2 size={38} /></span>
                        <h2 className="mt-5 text-2xl font-bold text-green-700">Thanh toán thành công</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-600">Khóa học đã được thêm vào tài khoản của bạn. Đang mở trang khóa học...</p>
                    </div>
                ) : (
                    <>
                        <header className="border-b border-blue-100 bg-blue-50 px-5 py-5 sm:px-6">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-blue-800"><CircleDollarSign size={22} /></span>
                            <h2 className="mt-3 pr-8 text-xl font-bold text-blue-950">Thanh toán khóa học</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Quét mã QR hoặc chuyển khoản đúng nội dung bên dưới.</p>
                        </header>

                        <div className="space-y-5 p-5 sm:p-6">
                            <div className="mx-auto w-full max-w-64 overflow-hidden rounded-xl border border-blue-100 bg-white p-2">
                                <img src={qrUrl} alt="Mã VietQR thanh toán khóa học" className="aspect-square w-full object-contain" />
                            </div>

                            <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                                <DetailRow label="Ngân hàng">Tien Phong Bank</DetailRow>
                                <DetailRow label="Số tài khoản">04185544601</DetailRow>
                                <DetailRow label="Chủ tài khoản">NGUYEN MINH DUC</DetailRow>
                                <DetailRow label="Số tiền">{formatPrice(amount, amount === 0)}</DetailRow>
                                <div className="border-t border-blue-100 pt-3">
                                    <p className="text-sm text-gray-600">Nội dung chuyển khoản</p>
                                    <p className="mt-1 break-all rounded-lg bg-white px-3 py-2 text-sm font-bold leading-6 text-blue-950">{transferContent}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 rounded-xl bg-yellow-50 px-3 py-3 text-sm leading-6 text-blue-950">
                                {isChecking ? <RefreshCw size={17} className="mt-0.5 shrink-0 animate-spin" /> : <Clock3 size={17} className="mt-0.5 shrink-0" />}
                                <span>{isChecking ? "Đang kiểm tra giao dịch..." : "Hệ thống tự kiểm tra giao dịch mỗi 10 giây."}</span>
                            </div>
                            {error ? <p className="text-center text-sm font-medium text-red-600">{error}</p> : null}
                        </div>
                    </>
                )}
            </section>
        </Modal>
    );
};

export default PurchasePaymentModal;
