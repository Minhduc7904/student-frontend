import HomeLayout from '../layout/HomeLayout';
import { DashboardPage } from '../dashboard';
import EnrollmentsPage from '../courses';
import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';
import { Outlet } from 'react-router-dom';
/** * Home Routes
 * Main application routes that require authentication
 */
export const homeRoutes = [
    {
        path: '/',
        element: (
            <HomeLayout >
                <Outlet />
            </HomeLayout>
        ),
        children: [
            {
                path: ROUTES.DASHBOARD,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                        meta: {
                            title: 'Tổng quan',
                            description: 'Trang tổng quan',
                        },
                    },
                ],
            },
            {
                path: ROUTES.COURSE_ENROLLMENTS,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <EnrollmentsPage />,
                        meta: {
                            title: 'Khóa học của bạn',
                            description: 'Danh sách khóa học đã đăng ký',
                        },
                    },
                ],
            },
        ]
    }
];

export default homeRoutes;
