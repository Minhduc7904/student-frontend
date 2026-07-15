import { memo } from "react";
import { BookOpen } from "lucide-react";
import { ContentLoading } from "../../../../shared/components";
import { useCourseList } from "../hooks";
import CourseCard from "./CourseCard";
import EnrollmentPagination from "./EnrollmentPagination";
import EnrollmentCourseFilters from "./EnrollmentCourseFilters";

const CourseList = memo(() => {
    const { enrollments, loading, error, filters, pagination, subjects, loadingSubjects, handlePrev, handleNext, updateFilters } = useCourseList();

    return (
        <div className="w-full">
            <EnrollmentCourseFilters filters={filters} subjects={subjects} loadingSubjects={loadingSubjects} onFiltersChange={updateFilters} />
            {loading ? <ContentLoading message="Đang tải khóa học..." height="py-20" /> : null}
            {!loading && error ? (
                <div className="border border-red-100 bg-red-50 px-4 py-5 text-center text-sm font-medium text-red-600">
                    Không thể tải danh sách khóa học. {error}
                </div>
            ) : null}
            {!loading && !error && !enrollments?.length ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-blue-200 bg-white px-6 py-16 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                        <BookOpen size={24} />
                    </span>
                    <h2 className="mt-4 text-lg font-bold text-blue-950">Chưa có khóa học nào</h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
                        Khóa học bạn đã đăng ký sẽ xuất hiện tại đây.
                    </p>
                </div>
            ) : null}
            {!loading && !error && enrollments?.length ? (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
                        {enrollments.map((enrollment) => (
                            <CourseCard key={enrollment.enrollmentId} enrollment={enrollment} />
                        ))}
                    </div>
                    <EnrollmentPagination pagination={pagination} onPrevious={handlePrev} onNext={handleNext} />
                </>
            ) : null}
        </div>
    );
});

CourseList.displayName = "CourseList";

export default CourseList;
