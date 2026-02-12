import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchMyEnrollments,
    selectEnrollments,
    selectLoadingMyEnrollments,
    selectCourseEnrollmentError,
    selectCourseEnrollmentFilters,
    selectCourseEnrollmentPagination,
} from "../store/courseEnrollmentSlice";
import CourseCard from "./CourseCard";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Course List Component
 * Hiển thị danh sách khóa học đã đăng ký
 */
const CourseList = memo(() => {
    const dispatch = useDispatch();

    const enrollments = useSelector(selectEnrollments);
    const loading = useSelector(selectLoadingMyEnrollments);
    const error = useSelector(selectCourseEnrollmentError);
    const filters = useSelector(selectCourseEnrollmentFilters);
    const pagination = useSelector(selectCourseEnrollmentPagination);

    useEffect(() => {
        dispatch(
            fetchMyEnrollments({
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
            })
        );
    }, [dispatch, filters, pagination.page, pagination.limit]);

    const handlePrev = () => {
        if (pagination.page > 1) {
            dispatch(
                fetchMyEnrollments({
                    ...filters,
                    page: pagination.page - 1,
                    limit: pagination.limit,
                })
            );
        }
    };

    const handleNext = () => {
        dispatch(
            fetchMyEnrollments({
                ...filters,
                page: pagination.page + 1,
                limit: pagination.limit,
            })
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={40} className="animate-spin text-yellow-400" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="text-red-500 text-lg font-medium mb-2">
                    Có lỗi xảy ra
                </div>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    // Empty state
    if (!enrollments || enrollments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Chưa có khóa học nào
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                    Bạn chưa đăng ký khóa học nào. Hãy thêm mã khóa học để bắt đầu học!
                </p>
            </div>
        );
    }

    const cardColors = [
        "bg-blue-lighter",
        "bg-yellow-50",
        "bg-red-100",
        "bg-green-100",
        "bg-blue-soft",
        "bg-purple-100",
    ];

    return (
        <div className="w-full relative flex items-center justify-center">

            {/* LEFT ARROW */}
            <button
                onClick={handlePrev}
                disabled={!pagination.hasPrevious}
                className=" cursor-pointer absolute -left-4 z-10 p-3 rounded-full bg-white shadow-md hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={24} />
            </button>

            {/* GRID */}
            <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-y-5 py-4 sm:py-5 lg:py-6">
                {enrollments.slice(0, 6).map((enrollment, index) => (
                    <CourseCard
                        key={enrollment.enrollmentId}
                        enrollment={enrollment}
                        bgColor={cardColors[index % cardColors.length]}
                    />
                ))}
            </div>

            {/* RIGHT ARROW */}
            <button
                onClick={handleNext}
                disabled={!pagination.hasNext}
                className="cursor-pointer absolute -right-4 z-10 p-3 rounded-full bg-white shadow-md hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"

            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
});

CourseList.displayName = "CourseList";

export default CourseList;
