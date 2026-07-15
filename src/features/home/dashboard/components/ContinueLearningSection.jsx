import { useRef } from "react";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { ContentLoading } from "../../../../shared/components";
import ContinueLearningCard from "./ContinueLearningCard";

const ContinueLearningSection = ({ enrollments, loading, error, openingCourseId, onOpenCourse }) => {
    const trackRef = useRef(null);

    const scrollCards = (direction) => {
        trackRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
    };

    return (
        <section aria-labelledby="continue-learning-title">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-800">Học tập</p>
                    <h1 id="continue-learning-title" className="mt-1 text-2xl font-bold text-blue-950 sm:text-3xl">Học tiếp</h1>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                    <button type="button" onClick={() => scrollCards(-1)} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-blue-100 bg-white text-blue-800 transition hover:border-blue-300 hover:bg-blue-50" aria-label="Xem khóa học trước"><ChevronLeft size={19} /></button>
                    <button type="button" onClick={() => scrollCards(1)} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-blue-100 bg-white text-blue-800 transition hover:border-blue-300 hover:bg-blue-50" aria-label="Xem khóa học tiếp theo"><ChevronRight size={19} /></button>
                </div>
            </div>

            {loading ? <ContentLoading message="Đang tải khóa học để học tiếp..." height="py-24" /> : null}
            {!loading && error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-6 text-sm font-medium text-red-600">{error}</div> : null}
            {!loading && !error && !enrollments.length ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white px-6 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><GraduationCap size={24} /></span>
                    <h2 className="mt-4 text-lg font-bold text-blue-950">Chưa có khóa học để học tiếp</h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Khóa học đang tham gia sẽ xuất hiện tại đây theo tiến độ của bạn.</p>
                </div>
            ) : null}
            {!loading && !error && enrollments.length ? (
                <div ref={trackRef} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 pt-1 custom-scrollbar sm:-mx-6 sm:px-6 xl:-mx-8 xl:px-8">
                    {enrollments.map((enrollment) => {
                        const courseId = enrollment?.course?.courseId ?? enrollment?.courseId;
                        return <div key={enrollment?.enrollmentId || courseId} className="snap-start"><ContinueLearningCard enrollment={enrollment} onOpen={onOpenCourse} isOpening={openingCourseId === courseId} /></div>;
                    })}
                </div>
            ) : null}
        </section>
    );
};

export default ContinueLearningSection;
