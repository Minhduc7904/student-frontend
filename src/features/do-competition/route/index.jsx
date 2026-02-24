import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';
import DoCompetitionStart from '../DoCompetitionStart';
import DoCompetition from '../DoCompetition';

/**
 * Do Competition Routes
 */
export const doCompetitionRoutes = [
    {
        path: '/do-competition/:competitionId/start',
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <DoCompetitionStart />,
                meta: {
                    title: 'Bắt đầu làm bài',
                    description: 'Kiểm tra điều kiện và bắt đầu làm bài thi',
                },
            },
        ],
    },
    {
        path: '/do-competition/:competitionId/submit/:submitId',
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <DoCompetition />,
                meta: {
                    title: 'Làm bài thi',
                    description: 'Thực hiện làm bài thi',
                },
            },
        ],
    },
];

export default doCompetitionRoutes;
