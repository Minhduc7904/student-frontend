import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '../features/auth/routes';
import homeRoutes from '../features/home/routes';
import courseDetailRoutes from '../features/course-detail/route';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../core/constants';
import NotFoundPage from '../features/not-found';

const router = createBrowserRouter([
    // Auth routes (login, register, forgot password, etc.)
    ...authRoutes,
    // Home routes (dashboard, profile, etc.)
    ...homeRoutes,
    // Course detail routes
    ...courseDetailRoutes,
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
