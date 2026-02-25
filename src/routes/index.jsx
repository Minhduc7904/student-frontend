import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../shared/components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import ExamsPage from '../pages/ExamsPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import TypographyDemo from '../pages/TypographyDemo';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'courses',
                element: <CoursesPage />
            },
            {
                path: 'courses/:id',
                element: <CourseDetailPage />
            },
            {
                path: 'exams',
                element: <ExamsPage />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            },
            {
                path: 'typography-demo',
                element: <TypographyDemo />
            },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    }
]);

export default router;
