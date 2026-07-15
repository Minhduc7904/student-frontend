import { useEffect, useRef, useState } from "react";
import { courseService } from "../../../core/services/modules/courseService";
import { getInvoiceDetails } from "../paymentUtils";

const POLL_INTERVAL = 10000;

export const useInvoicePaymentStatus = ({ invoiceId, enabled, onPaid }) => {
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState("");
    const paidCallbackRef = useRef(onPaid);

    useEffect(() => {
        paidCallbackRef.current = onPaid;
    }, [onPaid]);

    useEffect(() => {
        if (!invoiceId || !enabled) return undefined;

        let active = true;
        let hasCompleted = false;

        const checkPaymentStatus = async () => {
            setIsChecking(true);
            setError("");

            try {
                const response = await courseService.getOnlineCourseInvoicePaymentStatus(invoiceId);
                const payment = getInvoiceDetails(response);

                if (active && payment.status === "PAID" && !hasCompleted) {
                    hasCompleted = true;
                    paidCallbackRef.current?.(payment);
                }
            } catch (requestError) {
                if (active) setError(requestError?.message || "Chưa thể kiểm tra trạng thái thanh toán.");
            } finally {
                if (active) setIsChecking(false);
            }
        };

        const intervalId = window.setInterval(checkPaymentStatus, POLL_INTERVAL);

        return () => {
            active = false;
            window.clearInterval(intervalId);
        };
    }, [enabled, invoiceId]);

    return { isChecking, error };
};
