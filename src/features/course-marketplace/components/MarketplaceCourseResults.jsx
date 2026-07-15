import { BookOpen } from "lucide-react";
import { ContentLoading } from "../../../shared/components";
import MarketplaceCourseCard from "./MarketplaceCourseCard";
import MarketplacePagination from "./MarketplacePagination";

const MarketplaceCourseResults = ({ courses, loading, error, pagination, onPageChange }) => {
    if (loading) return <ContentLoading message="Đang tìm khóa học phù hợp..." height="py-20" />;

    if (error) {
        return <div className="mt-6 border border-red-100 bg-red-50 px-4 py-5 text-center text-sm font-medium text-red-600">{error}</div>;
    }

    if (!courses.length) {
        return (
            <div className="mt-6 flex flex-col items-center justify-center border border-dashed border-blue-200 bg-white px-6 py-16 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><BookOpen size={24} /></span>
                <h2 className="mt-4 text-lg font-bold text-blue-950">Chưa tìm thấy khóa học phù hợp</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Thử thay đổi từ khóa hoặc bộ lọc để xem thêm khóa học.</p>
            </div>
        );
    }

    return (
        <section className="mt-6" aria-label="Danh sách khóa học có thể mua">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-blue-950">Khóa học đang mở</h2>
                <p className="text-sm font-medium text-gray-600">{pagination?.total ?? courses.length} khóa học</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
                {courses.map((course) => <MarketplaceCourseCard key={course.courseId} course={course} />)}
            </div>
            <MarketplacePagination pagination={pagination} onPageChange={onPageChange} />
        </section>
    );
};

export default MarketplaceCourseResults;
