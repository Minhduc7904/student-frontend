import { BookOpenCheck } from "lucide-react";
import { ContentLoading } from "../../../../shared/components";
import DashboardPagination from "./DashboardPagination";
import LatestLessonCard from "./LatestLessonCard";

const LatestLessonsSection = ({ lessons, pagination, loading, error, onPreviousPage, onNextPage }) => (
    <section className="mt-8 border-t border-blue-100 pt-6 sm:mt-12 sm:pt-10" aria-labelledby="latest-lessons-title">
        <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-800">Mới cập nhật</p>
            <h2 id="latest-lessons-title" className="mt-1 text-2xl font-bold text-blue-950 sm:text-3xl">Bài học mới</h2>
        </div>

        {loading ? <ContentLoading message="Đang tải bài học mới..." height="py-20" /> : null}
        {!loading && error ? <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-6 text-sm font-medium text-red-600">{error}</div> : null}
        {!loading && !error && !lessons.length ? (
            <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white px-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><BookOpenCheck size={24} /></span>
                <h3 className="mt-4 text-lg font-bold text-blue-950">Chưa có bài học mới</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Bài học mới từ các khóa đang tham gia sẽ xuất hiện tại đây.</p>
            </div>
        ) : null}
        {!loading && !error && lessons.length ? (
            <>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                    {lessons.map((lesson) => <LatestLessonCard key={lesson.lessonId || lesson.id} lesson={lesson} />)}
                </div>
                <DashboardPagination pagination={pagination} onPrevious={onPreviousPage} onNext={onNextPage} label="bài học mới" />
            </>
        ) : null}
    </section>
);

export default LatestLessonsSection;
