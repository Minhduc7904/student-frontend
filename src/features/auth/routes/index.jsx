/**
 * Auth Routes
 * Authentication related routes (login, register, forgot password, etc.)
 */
import AuthLayout from '../layout/AuthLayout';
import LoginPage from '../login';
import LoadingRedirectPage from '../loading-redirect';
import LogoutPage from '../logout';
import { ROUTES } from '../../../core/constants';
/**
 * Auth routes configuration
 * These routes don't require authentication
 */
export const authRoutes = [
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <LoginPage />,
                meta: {
                    title: 'Đăng nhập',
                    description: 'Đăng nhập vào hệ thống',
                }
            },
            {
                path: ROUTES.LOADING_REDIRECT,
                element: <LoadingRedirectPage />,
                meta: {
                    title: 'Đang chuyển hướng...',
                    description: 'Vui lòng chờ trong giây lát',
                }
            },
            {
                path: ROUTES.LOGOUT,
                element: <LogoutPage />,
                meta: {
                    title: 'Đang đăng xuất...',
                    description: 'Vui lòng chờ trong giây lát',
                }
            },
        ]
    }
];

export default authRoutes;
