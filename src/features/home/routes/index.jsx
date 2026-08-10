import DashboardLayout from '../layout/DashboardLayout';
import CoursesLayout from '../layout/CoursesLayout';
import { DashboardPage } from '../dashboard';
import EnrollmentsPage from '../courses';
import CourseMarketplacePage from '../../course-marketplace';
import BookMarketplacePage from '../../book-marketplace';
import BookPurchaseDetailPage from '../../book-marketplace/BookPurchaseDetailPage';
import CoursePurchaseDetailPage from '../../course-marketplace/CoursePurchaseDetailPage';
import CoursePaymentIntentPage from '../../course-marketplace/CoursePaymentIntentPage';
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
                path: ROUTES.BOOK_MARKETPLACE,
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <CoursesLayout />,
                        children: [
                            {
                                index: true,
                                element: <BookMarketplacePage />,
                                meta: {
                                    title: 'Mua sách',
                                    description: 'Catalog sách dành cho học sinh',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                path: ROUTES.BOOK_PURCHASE_DETAIL(':bookSlug'),
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <CoursesLayout />,
                        children: [
                            {
                                index: true,
                                element: <BookPurchaseDetailPage />,
                                meta: {
                                    title: 'Chi tiết sách',
                                    description: 'Thông tin và hình ảnh sách',
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
            {
                path: ROUTES.COURSE_PAYMENT_INTENT(':courseId', ':paymentIntentId'),
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <CoursePaymentIntentPage />,
                    },
                ],
            },
        ]
    }
];

export default homeRoutes;
