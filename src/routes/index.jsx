import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from '../features/auth/routes';
import { homeRoutes } from '../features/home/routes';
import { profileRoutes } from '../features/profile/route';
import { courseDetailRoutes } from '../features/course-detail/route';
import { doCompetitionRoutes } from '../features/do-competition/route';
import NotFoundPage from '../features/not-found';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../core/constants';
/**
 * Main Router Configuration
 * Combines all feature routes
 */
const router = createBrowserRouter([
    // Auth routes (login, register, forgot password, etc.)
    ...authRoutes,
    // Home routes (dashboard, etc.)
    ...homeRoutes,
    // Profile routes (standalone layout)
    ...profileRoutes,
    // Course detail routes
    ...courseDetailRoutes,
    // Do competition routes
    ...doCompetitionRoutes,
    {
        index: true, // Default route at '/'
        element: <Navigate to={ROUTES.LOGIN} replace />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
], {
    basename: '/student' // Đồng bộ với base trong vite.config.js
});

export default router;
