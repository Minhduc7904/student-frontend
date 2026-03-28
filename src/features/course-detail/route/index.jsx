import CourseDetailLayout from '../layout/CourseDetailLayout';
import { CourseDetailPage } from '../index';
import { ROUTES } from '../../../core/constants';
import { ProtectedRoute } from '../../../shared/components/protected/ProtectedRoute';
import { Outlet } from 'react-router-dom';
import { CourseLessonsPage } from '../course-lessons';
/** * Course Detail Routes
 * Main application routes that require authentication
 */
export const courseDetailRoutes = [
    {
        path: '/',
        element: (
            <CourseDetailLayout >
                <Outlet />
            </CourseDetailLayout>
        ),
        children: [
            {
                path: ROUTES.COURSE_DETAIL(':courseId'),
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <CourseDetailPage />,
                        meta: {
                            title: 'Chi tiết khóa học',
                            description: 'Trang chi tiết khóa học',
                        },
                    },
                    {
                        path: 'lessons/:lessonId',
                        element: <CourseLessonsPage />,
                        meta: {
                            title: 'Bài học khóa học',
                            description: 'Trang bài học khóa học',
                        },
                    },
                    {
                        path: 'lessons/:lessonId/learning-items/:learningItemId',
                        element: <CourseLessonsPage />,
                        meta: {
                            title: 'Mục học tập',
                            description: 'Trang mục học tập',
                        },
                    },
                    {
                        path: 'lessons/:lessonId/learning-items/:learningItemId/result/:competitionSubmitId',
                        element: <CourseLessonsPage />,
                        meta: {
                            title: 'Kết quả bài tập',
                            description: 'Trang kết quả bài tập',
                        },
                    },
                ],
            },
        ]
    }
];

export default courseDetailRoutes;
