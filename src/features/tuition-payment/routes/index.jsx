import PaymentLayout from "../layout/PaymentLayout";
import PaymentPage from "..";
import { ROUTES } from "../../../core/constants";
import { ProtectedRoute } from "../../../shared/components/protected/ProtectedRoute";

export const paymentRoutes = [
    {
        path: "/",
        element: <PaymentLayout />,
        children: [
            {
                path: ROUTES.PAYMENT,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <PaymentPage />,
                        meta: {
                            title: "Thanh toán",
                            description: "Trang quản lý thanh toán học phí",
                        },
                    },
                ],
            },
        ],
    },
];

export default paymentRoutes;
