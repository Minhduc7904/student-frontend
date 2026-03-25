import PracticeLayout from '../layout/PracticeLayout';
import PracticePage from '../index';
import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';

/**
 * Practice Routes
 * Route độc lập với layout riêng cho trang Practice.
 */
export const practiceRoutes = [
    {
        path: '/',
        element: <PracticeLayout />,
        children: [
            {
                path: ROUTES.PRACTICE,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <PracticePage />,
                        meta: {
                            title: 'Luyện tập',
                            description: 'Trang luyện tập của học sinh',
                        },
                    },
                ],
            },
        ],
    },
];

export default practiceRoutes;
