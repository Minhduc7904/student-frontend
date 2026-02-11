import HomeLayout from '../layout/HomeLayout';
import { DashboardPage } from '../dashboard';
import { ROUTES } from '../../../core/constants';

/** * Home Routes
 * Main application routes that require authentication
 */
export const homeRoutes = [
    {
        path: '/',
        element: <HomeLayout />,
        children: [
            {
                path: ROUTES.DASHBOARD,
                element: <DashboardPage />,
                meta: {
                    title: 'Dashboard',
                    description: 'Tổng quan học tập',
                }
            },
        ]
    }
];

export default homeRoutes;
