import { Suspense, memo } from "react";
import { Outlet, Link } from "react-router-dom";
import { ContentLoading } from "../../../shared/components/loading";
import { useCourseDetail } from "../hooks";
import StartList from '../../../assets/icons/StarList.svg';
import { SvgIcon } from "../../../shared/components";
import { ROUTES } from "../../../core/constants";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";

/**
 * Course Not Found Component
 */
const CourseNotFound = () => {
    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Không tìm thấy khóa học
                </h2>
                <p className="text-gray-600 mb-8">
                    Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <Link
                    to={ROUTES.COURSE_ENROLLMENTS}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg inline-block"
                >
                    Quay về danh sách khóa học
                </Link>
            </div>
        </div>
    );
};

/**
 * Course Detail Layout
 * - Fetch course detail và lessons
 * - Content scroll độc lập
 */
const CourseDetailLayout = () => {
    const {
        courseId,
        courseDetail,
        loading,
        error,
        lessons,
        lessonsLoading,
        lessonsError,
    } = useCourseDetail();

    // Hiển thị loading khi đang tải
    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="w-full bg-blue-800 h-20 flex items-center justify-end">
                    <SvgIcon src={StartList} width={232} height={137} />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <ContentLoading />
                </div>
            </AuthenticatedLayout>
        );
    }

    // Hiển thị 404 nếu có lỗi hoặc không tìm thấy course
    if (error || !courseDetail) {
        return (
            <AuthenticatedLayout>
                <div className="w-full bg-blue-800 h-20 flex items-center justify-end">
                    <SvgIcon src={StartList} width={232} height={137} />
                </div>
                <CourseNotFound />
            </AuthenticatedLayout>
        );
    }

    return (
        <div>
            <div className="w-full bg-blue-800 h-20 flex items-center justify-end">
                <SvgIcon src={StartList} width={232} height={137} />
            </div>
            {/* Main Content Area */}
            <Suspense fallback={<ContentLoading />}>
                <Outlet context={{
                    courseId,
                    courseDetail,
                    loading,
                    error,
                    lessons,
                    lessonsLoading,
                    lessonsError,
                }} />
            </Suspense>
        </div>
    );
};

export default memo(CourseDetailLayout);