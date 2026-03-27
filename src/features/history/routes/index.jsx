import { Navigate } from "react-router-dom";
import HistoryLayout from "../layout/HistoryLayout";
import CompetitionHistoryPage from "../competition";
import QuestionHistoryPage from "../question";
import ExamHistoryPage from "../exam";
import { ROUTES } from "../../../core/constants";
import { ProtectedRoute } from "../../../shared/components/protected/ProtectedRoute";

/**
 * History Routes
 * Route độc lập cho lịch sử làm bài, không phụ thuộc Profile routes.
 */
export const historyRoutes = [
    {
        path: "/",
        element: <HistoryLayout />,
        children: [
            {
                path: ROUTES.HISTORY,
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Navigate to={ROUTES.HISTORY_COMPETITION} replace />,
                    },
                    {
                        path: "competition",
                        element: <CompetitionHistoryPage />,
                        meta: {
                            title: "Lịch sử cuộc thi",
                            description: "Trang lịch sử làm bài cuộc thi",
                        },
                    },
                    {
                        path: "question",
                        element: <QuestionHistoryPage />,
                        meta: {
                            title: "Lịch sử câu hỏi",
                            description: "Trang lịch sử trả lời câu hỏi",
                        },
                    },
                    {
                        path: "exam",
                        element: <ExamHistoryPage />,
                        meta: {
                            title: "Lịch sử đề mẫu",
                            description: "Trang lịch sử làm đề mẫu",
                        },
                    },
                ],
            },
        ],
    },
];

export default historyRoutes;
