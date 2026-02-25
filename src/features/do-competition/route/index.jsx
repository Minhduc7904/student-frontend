import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';
import DoCompetitionStart from '../DoCompetitionStart';
import DoCompetition from '../DoCompetition';
/**
 * Do Competition Routes
 */
export const doCompetitionRoutes = [
    {
        path: ROUTES.DO_COMPETITION_START(':competitionId'),
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
        path: ROUTES.DO_HOMEWORK_COMPETITION_START(':courseId', ':lessonId', ':learningItemId', ':homeworkContentId', ':competitionId'),
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <DoCompetitionStart isHomeworkCompetition={true} />,
                meta: {
                    title: 'Bắt đầu làm bài',
                    description: 'Kiểm tra điều kiện và bắt đầu làm bài thi',
                },
            },
        ],
    },
    {
        path: ROUTES.DO_HOMEWORK_COMPETITION_SUBMIT(':courseId', ':lessonId', ':learningItemId', ':homeworkContentId', ':competitionId', ':submitId'),
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <DoCompetition isHomeworkCompetition={true} />,
                meta: {
                    title: 'Làm bài thi',
                    description: 'Thực hiện làm bài thi',
                },
            },
        ],
    },
    {
        path: ROUTES.DO_COMPETITION_SUBMIT(':competitionId', ':submitId'),
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
