import DashboardLayout from '../layout/DashboardLayout';
import CoursesLayout from '../layout/CoursesLayout';
import { DashboardPage } from '../dashboard';
import EnrollmentsPage from '../courses';
import CourseMarketplacePage from '../../course-marketplace';
import CoursePurchaseDetailPage from '../../course-marketplace/CoursePurchaseDetailPage';
import CoursePurchaseDetailLayout from '../../course-marketplace/layout/CoursePurchaseDetailLayout';
import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';
import { Outlet } from 'react-router-dom';
/** * Home Routes
 * Main application routes that require authentication
 */
export const homeRoutes = [
    {
        path: '/',
        element: <Outlet />,
        children: [
            {
                path: ROUTES.DASHBOARD,
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <DashboardLayout />,
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
                ],
            },
            {
                path: ROUTES.COURSE_ENROLLMENTS,
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <CoursesLayout />,
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
                ],
            },
            {
                path: ROUTES.COURSE_MARKETPLACE,
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <CoursesLayout />,
                        children: [
                            {
                                index: true,
                                element: <CourseMarketplacePage />,
                                meta: {
                                    title: 'Mua khóa học',
                                    description: 'Danh sách khóa học online có thể đăng ký',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                path: ROUTES.COURSE_PURCHASE_DETAIL(':courseId'),
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <CoursePurchaseDetailLayout />,
                        children: [
                            {
                                index: true,
                                element: <CoursePurchaseDetailPage />,
                                meta: {
                                    title: 'Chi tiết mua khóa học',
                                    description: 'Trang mua khóa học',
                                },
                            },
                        ],
                    },
                ],
            },
        ]
    }
];

export default homeRoutes;
