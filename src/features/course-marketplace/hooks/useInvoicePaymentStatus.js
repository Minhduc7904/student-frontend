import { useEffect, useRef, useState } from "react";
import { courseService } from "../../../core/services/modules/courseService";
import { getInvoiceDetails } from "../paymentUtils";

const POLL_INTERVAL = 2000;
const TERMINAL_STATUSES = new Set(["PAYMENT_FAILED", "EXPIRED", "CANCELLED"]);

export const useInvoicePaymentStatus = ({ invoiceId, enabled, onPaid, onTerminal }) => {
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState("");
    const [payment, setPayment] = useState(null);
    const paidCallbackRef = useRef(onPaid);
    const terminalCallbackRef = useRef(onTerminal);

    useEffect(() => {
        paidCallbackRef.current = onPaid;
    }, [onPaid]);

    useEffect(() => {
        terminalCallbackRef.current = onTerminal;
    }, [onTerminal]);

    useEffect(() => {
        if (!invoiceId || !enabled) {
            setIsChecking(false);
            return undefined;
        }

        let active = true;
        let hasCompleted = false;
        let isRequesting = false;

        const checkPaymentStatus = async () => {
            if (isRequesting || hasCompleted) return;

            isRequesting = true;
            setIsChecking(true);
            setError("");

            try {
                const response = await courseService.getOnlineCourseInvoicePaymentStatus(invoiceId);
                const nextPayment = getInvoiceDetails(response);

                if (!active) return;

                setPayment(nextPayment);

                if (nextPayment.status === "PAID" && nextPayment.enrollmentCreated) {
                    hasCompleted = true;
                    paidCallbackRef.current?.(nextPayment);
                } else if (TERMINAL_STATUSES.has(nextPayment.status)) {
                    hasCompleted = true;
                    terminalCallbackRef.current?.(nextPayment);
                }
            } catch (requestError) {
                if (active) setError(requestError?.message || "Chưa thể kiểm tra trạng thái thanh toán.");
            } finally {
                isRequesting = false;
                if (active) setIsChecking(false);
            }
        };

        checkPaymentStatus();
        const intervalId = window.setInterval(checkPaymentStatus, POLL_INTERVAL);

        return () => {
            active = false;
            window.clearInterval(intervalId);
        };
    }, [enabled, invoiceId]);

    return { isChecking, error, payment };
};
