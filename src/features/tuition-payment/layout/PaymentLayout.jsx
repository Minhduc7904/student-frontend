import { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
import { Card } from "../../../shared/components";
import {
    getMyPaymentsAsync,
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
        const value = source[key];
        const numeric = Number(value);
        if (Number.isFinite(numeric)) return numeric;
    }

    return 0;
};

const formatCurrency = (value) => {
    const numeric = Number(value || 0);
    return `${new Intl.NumberFormat("vi-VN").format(Number.isFinite(numeric) ? numeric : 0)} đ`;
};

const PaymentLayout = () => {
    const dispatch = useDispatch();
    const payments = useSelector(selectMyPayments);
    const pagination = useSelector(selectPaymentPagination);
    const statsStatus = useSelector(selectStatsStatus);
    const statsMoney = useSelector(selectStatsMoney);
    const loadingStatsStatus = useSelector(selectLoadingStatsStatus);
    const loadingStatsMoney = useSelector(selectLoadingStatsMoney);

    useEffect(() => {
        dispatch(getMyPaymentsAsync({ page: 1, limit: 20 }));
        dispatch(getMyStatsStatusAsync());
        dispatch(getMyStatsMoneyAsync());
    }, [dispatch]);

    const stats = useMemo(() => {
        const totalRecords = getNumberByKeys(pagination, ["total"]) || payments?.length || 0;

        const paidCount = getNumberByKeys(statsStatus, [
            "paid",
            "PAID",
            "done",
            "completed",
            "success",
        ]);
        const pendingCount = getNumberByKeys(statsStatus, [
            "pending",
            "PENDING",
            "unpaid",
            "UNPAID",
            "due",
        ]);

        const totalPaidMoney = getNumberByKeys(statsMoney, [
            "paidAmount",
            "totalPaid",
            "paid",
            "income",
            "collected",
        ]);
        const totalDueMoney = getNumberByKeys(statsMoney, [
            "dueAmount",
            "remaining",
            "unpaid",
            "pending",
            "debt",
        ]);

        return {
            totalRecords,
            paidCount,
            pendingCount,
            totalPaidMoney,
            totalDueMoney,
        };
    }, [pagination, payments, statsMoney, statsStatus]);

    return (
        <AuthenticatedLayout>
            <main className="flex-1 overflow-y-auto bg-[#F7F8FA] custom-scrollbar">
                <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                        <section className="flex min-w-0 flex-col gap-4">
                            <div className="text-2xl font-semibold text-gray-600">
                                <p>Thanh toán</p>
                            </div>
                            <Card className="p-0">
                                <Outlet />
                            </Card>
                        </section>

                        <aside className="lg:sticky lg:top-6 lg:self-start">
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-800">Thống kê</h2>
                                <div className="mt-4 space-y-3">
                                    <div className="rounded-lg bg-[#F7F7F8] p-3">
                                        <p className="text-xs text-gray-500">Tổng khoản học phí</p>
                                        <p className="mt-1 text-xl font-semibold text-gray-900">{stats.totalRecords}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-[#F7F7F8] p-3">
                                            <p className="text-xs text-gray-500">Đã thanh toán</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                                {loadingStatsStatus ? "..." : stats.paidCount}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-[#F7F7F8] p-3">
                                            <p className="text-xs text-gray-500">Chờ thanh toán</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                                {loadingStatsStatus ? "..." : stats.pendingCount}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-[#F7F7F8] p-3">
                                        <p className="text-xs text-gray-500">Tổng tiền đã thanh toán</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">
                                            {loadingStatsMoney ? "..." : formatCurrency(stats.totalPaidMoney)}
                                        </p>
                                        <p className="mt-2 text-xs text-gray-500">Còn cần thanh toán</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {loadingStatsMoney ? "..." : formatCurrency(stats.totalDueMoney)}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </aside>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
};

export default memo(PaymentLayout);
