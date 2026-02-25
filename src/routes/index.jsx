import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from '../features/auth/routes';
import { homeRoutes } from '../features/home/routes';
import { courseDetailRoutes } from '../features/course-detail/route';
import { doCompetitionRoutes } from '../features/do-competition/route';
import NotFoundPage from '../features/not-found';

/**
 * Main Router Configuration
 * Combines all feature routes
 */
const router = createBrowserRouter([
    ...authRoutes,
    ...homeRoutes,
    ...courseDetailRoutes,
    ...doCompetitionRoutes,
    {
        path: '*',
        element: <NotFoundPage />
    }
]);

export default router;
