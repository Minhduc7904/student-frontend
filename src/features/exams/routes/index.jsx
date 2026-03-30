import ExamsLayout from '../layout/ExamsLayout';
import ExamsPage from '../index';
import ExamTypePage from '../type/ExamTypePage';
import ExamDetailPage from '../detail/ExamDetailPage';
import ExamPracticeAttemptPage from '../practice-attempt/ExamPracticeAttemptPage';
import ExamPracticeResultPage from '../practice-result/ExamPracticeResultPage';
import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';

/**
 * Exams Routes
 * Route độc lập cho /exams với layout và guard riêng.
 */
export const examsRoutes = [
    {
        path: '/',
        element: <ExamsLayout />,
        children: [
            {
                path: ROUTES.EXAMS,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <ExamsPage />,
                        meta: {
                            title: 'Đề mẫu',
                            description: 'Danh sách đề mẫu của học sinh',
                        },
                    },
                    {
                        path: ':examType',
                        element: <ExamTypePage />,
                        meta: {
                            title: 'Chi tiet loai de thi',
                            description: 'Trang con theo tung loai de thi',
                        },
                    },
                    {
                        path: ':typeexam/:id',
                        element: <ExamDetailPage />,
                        meta: {
                            title: 'Chi tiet de thi',
                            description: 'Trang chi tiet de thi theo loai',
                        },
                    },
                    {
                        path: ':typeExam/:id/attempt/:attemptId/practice',
                        element: <ExamPracticeAttemptPage />,
                        meta: {
                            title: 'Luyen tap de thi',
                            description: 'Trang luyen tap theo lan lam bai thi',
                        },
                    },
                    {
                        path: ':typeExam/:id/attempt/:attemptId/result',
                        element: <ExamPracticeResultPage />,
                        meta: {
                            title: 'Ket qua de thi',
                            description: 'Trang ket qua theo lan lam bai thi',
                        },
                    },
                ],
            },
        ],
    },
];

export default examsRoutes;
