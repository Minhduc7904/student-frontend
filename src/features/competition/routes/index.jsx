import CompetitionLayout from '../layout/CompetitionLayout';
import CompetitionPage from '../index';
import CompetitionDetailPage from '../competitionDetail';
import CompetitionDetailInfoTab from '../competitionDetail/component/CompetitionDetailInfoTab';
import CompetitionExamPage from '../exam';
import CompetitionRankingPage from '../ranking';
import CompetitionHistoryPage from '../history';
import CompetitionResultPage from '../result';
import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';

/**
 * Competition Routes
 * Route độc lập với layout riêng cho trang Competition.
 */
export const competitionRoutes = [
    {
        path: '/',
        element: <CompetitionLayout />,
        children: [
            {
                path: ROUTES.COMPETITION,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <CompetitionPage />,
                        meta: {
                            title: 'Competition',
                            description: 'Trang competition của học sinh',
                        },
                    },
                    {
                        path: ':competitionId',
                        element: <CompetitionDetailPage />,
                        children: [
                            {
                                index: true,
                                element: <CompetitionDetailInfoTab />,
                                meta: {
                                    title: 'Competition Info',
                                    description: 'Trang thong tin competition',
                                },
                            },
                            {
                                path: 'exam',
                                element: <CompetitionExamPage />,
                                meta: {
                                    title: 'Competition Exam',
                                    description: 'Trang de thi competition',
                                },
                            },
                            {
                                path: 'ranking',
                                element: <CompetitionRankingPage />,
                                meta: {
                                    title: 'Competition Ranking',
                                    description: 'Trang bang xep hang competition',
                                },
                            },
                            {
                                path: 'history',
                                element: <CompetitionHistoryPage />,
                                meta: {
                                    title: 'Competition History',
                                    description: 'Trang lich su lam bai competition',
                                },
                            },
                            {
                                path: 'result/:submitId',
                                element: <CompetitionResultPage />,
                                meta: {
                                    title: 'Competition Result',
                                    description: 'Trang ket qua competition',
                                },
                            },
                        ],
                        meta: {
                            title: 'Competition Detail',
                            description: 'Trang chi tiết competition của học sinh',
                        },
                    },
                ],
            },
        ],
    },
];

export default competitionRoutes;
