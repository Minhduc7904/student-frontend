import { memo, Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import { ContentLoading } from "../../../shared/components/loading";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
import { useCourseDetail } from "../../course-detail/hooks/useCourseDetail";

const CoursePurchaseNotFound = () => (
    <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
            <h1 className="mb-4 text-7xl font-bold text-gray-300 sm:text-9xl">404</h1>
            <h2 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl">Không tìm thấy khóa học</h2>
            <p className="mb-8 text-gray-600">Khóa học này không còn mở đăng ký hoặc không tồn tại.</p>
            <Link to={ROUTES.COURSE_MARKETPLACE} className="inline-flex cursor-pointer rounded-lg bg-blue-800 px-6 py-3 font-semibold text-white transition hover:bg-blue-900">
                Quay lại mua khóa học
            </Link>
        </div>
    </div>
);

const CoursePurchaseDetailLayout = () => {
    const {
        courseId,
        courseDetail,
        loading,
        error,
        lessons,
        lessonsLoading,
        lessonsError,
    } = useCourseDetail();

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="flex min-h-dvh flex-1 items-center justify-center bg-blue-50">
                    <ContentLoading />
                </div>
            </AuthenticatedLayout>
        );
    }

    if (error || !courseDetail) {
        return (
            <AuthenticatedLayout>
                <CoursePurchaseNotFound />
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
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
        </AuthenticatedLayout>
    );
};

export default memo(CoursePurchaseDetailLayout);
