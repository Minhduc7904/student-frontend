import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';
import CompetitionResultPage from '../CompetitionResultPage';

/**
 * Competition Result Routes
 * Route: /do-competition/submit/:submitId/result
 */
export const competitionResultRoutes = [
    {
        path: ROUTES.COMPETITION_RESULT(':submitId'),
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <CompetitionResultPage />,
                meta: {
                    title: 'Kết quả bài thi',
                    description: 'Chi tiết kết quả sau khi làm bài thi',
                },
            },
        ],
    },
];
