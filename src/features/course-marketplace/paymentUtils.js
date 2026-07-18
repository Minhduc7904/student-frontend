import { formatPrice } from "../course-detail/components/courseDetailUtils";

export const unwrapApiPayload = (response) => {
    const body = response?.data ?? response ?? {};
    return body?.data ?? body;
};

const toBoolean = (value) => value === true || value === 1 || value === "1" || value === "true";

export const getInvoiceDetails = (response) => {
    const payload = unwrapApiPayload(response);
    const invoice = payload?.invoice ?? payload?.onlineCourseInvoice ?? payload;

    return {
        invoice,
        invoiceId: invoice?.invoiceId ?? invoice?.id ?? payload?.invoiceId ?? payload?.id,
        status: String(invoice?.status ?? payload?.status ?? "PENDING_PAYMENT").toUpperCase(),
        enrollmentCreated: toBoolean(invoice?.enrollmentCreated ?? payload?.enrollmentCreated),
    };
};

export const getPayosPaymentDetails = (response) => {
    const payload = unwrapApiPayload(response);

    return {
        invoiceId: payload?.invoiceId,
        invoiceCode: payload?.invoiceCode,
        attemptId: payload?.attemptId,
        attemptCode: payload?.attemptCode,
        orderCode: payload?.orderCode,
        amount: payload?.amount,
        currency: payload?.currency,
        expiresAt: payload?.expiresAt,
        paymentUrl: payload?.paymentUrl,
        status: String(payload?.status ?? "PENDING_PAYMENT").toUpperCase(),
    };
};

const PAYOS_PAYMENT_STORAGE_KEY = "student.payos-course-payment";

export const savePayosPayment = (payment) => {
    try {
        window.localStorage.setItem(PAYOS_PAYMENT_STORAGE_KEY, JSON.stringify(payment));
    } catch {
        // The return page can still be opened manually; it will show a safe recovery action.
    }
};

export const getSavedPayosPayment = () => {
    try {
        const saved = window.localStorage.getItem(PAYOS_PAYMENT_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

export const getInvoiceAmount = (invoice, course) => Number(
    invoice?.amountVND
    ?? invoice?.totalAmountVND
    ?? invoice?.amount
    ?? invoice?.totalAmount
    ?? course?.priceVND
    ?? 0
);

export const getTransferContent = ({ course, profile, invoiceId }) => {
    const date = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date()).replace(/\//g, "");
    const courseCode = course?.code || `COURSE${course?.courseId || ""}`;
    const username = profile?.username || "HOCSINH";

    return `${date} ${courseCode} ${username} ${invoiceId}`.trim();
};

export const getVietQrUrl = ({ amount, transferContent }) => {
    const query = new URLSearchParams({
        amount: String(Math.max(0, Math.round(amount || 0))),
        addInfo: transferContent,
        accountName: "NGUYEN MINH DUC",
    });

    return `https://img.vietqr.io/image/TPB-04185544601-compact2.png?${query.toString()}`;
};

export { formatPrice };
