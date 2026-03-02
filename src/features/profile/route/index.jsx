import ProfileLayout from "../layout/ProfileLayout";
import ProfilePage from "../index";
import { ROUTES } from "../../../core/constants";
import { ProtectedRoute } from "../../../shared/components/protected/ProtectedRoute";
import { Outlet } from "react-router-dom";

/**
 * Profile Routes
 * Route độc lập với layout riêng cho trang Profile
 */
export const profileRoutes = [
    {
        path: "/",
        element: (
            <ProfileLayout>
                <Outlet />
            </ProfileLayout>
        ),
        children: [
            {
                path: ROUTES.PROFILE,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <ProfilePage />,
                        meta: {
                            title: "Thông tin cá nhân",
                            description: "Trang thông tin cá nhân học sinh",
                        },
                    },
                ],
            },
        ],
    },
];

export default profileRoutes;
