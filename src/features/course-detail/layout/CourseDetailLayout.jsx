import { Suspense, memo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ContentLoading } from "../../../shared/components/loading";
import { ROUTES } from "../../../core/constants";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
import { useCourseDetail } from "../hooks";

const CourseNotFound = () => (
    <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
            <h1 className="mb-4 text-7xl font-bold text-gray-300 sm:text-9xl">404</h1>
            <h2 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl">
                Không tìm thấy khóa học
            </h2>
            <p className="mb-8 text-gray-600">
                Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link
                to={ROUTES.COURSE_ENROLLMENTS}
                className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
            >
                Quay về danh sách khóa học
            </Link>
        </div>
    </div>
);

const CourseDetailLayout = () => {
    const location = useLocation();
    const {
        courseId,
        courseDetail,
        loading,
        error,
        lessons,
        lessonsLoading,
        lessonsError,
    } = useCourseDetail();
    const isLessonRoute = location.pathname.includes("/lessons/");

    const renderWithOptionalHeader = (children) => (
        isLessonRoute ? children : <AuthenticatedLayout>{children}</AuthenticatedLayout>
    );

    if (loading) {
        return renderWithOptionalHeader(
            <div className="flex min-h-dvh flex-1 items-center justify-center bg-white">
                <ContentLoading />
            </div>
        );
    }

    if (error || !courseDetail) {
        return renderWithOptionalHeader(<CourseNotFound />);
    }

    return renderWithOptionalHeader(
        <div className={isLessonRoute ? "h-dvh overflow-hidden" : "flex-1 overflow-y-auto custom-scrollbar"}>
            <Suspense fallback={<ContentLoading />}>
                <Outlet
                    context={{
                        courseId,
                        courseDetail,
                        loading,
                        error,
                        lessons,
                        lessonsLoading,
                        lessonsError,
                    }}
                />
            </Suspense>
        </div>
    );
};

export default memo(CourseDetailLayout);
