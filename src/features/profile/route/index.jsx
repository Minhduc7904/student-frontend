import ProfileLayout from "../layout/ProfileLayout";
import ProfilePage from "../index";
import ProfileEditInforPage from "../edit-infor";
import ProfileSettingPage from "../setting";
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
            {
                path: ROUTES.STUDENT_PROFILE,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <ProfilePage />,
                        meta: {
                            title: "Trang cá nhân học sinh",
                            description: "Xem thông tin cá nhân học sinh",
                        },
                    },
                ],
            },
            {
                path: ROUTES.PROFILE_EDIT_INFO,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <ProfileEditInforPage />,
                        meta: {
                            title: "Chỉnh sửa thông tin cá nhân",
                            description: "Trang chỉnh sửa thông tin cá nhân học sinh",
                        },
                    },
                ],
            },
            {
                path: ROUTES.PROFILE_SETTING,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <ProfileSettingPage />,
                        meta: {
                            title: "Cài đặt hồ sơ",
                            description: "Trang cài đặt hồ sơ học sinh",
                        },
                    },
                ],
            },
        ],
    },
];

export default profileRoutes;
