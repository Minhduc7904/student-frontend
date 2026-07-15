import { ArrowUpRight, BookOpenCheck, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../core/constants";
import { getLessonCourseName, getLessonItemCounts, getLessonProgress, getLessonTitle } from "./latestLessonUtils";

const LatestLessonCard = ({ lesson }) => {
    const navigate = useNavigate();
    const progress = getLessonProgress(lesson);
    const counts = getLessonItemCounts(lesson);
    const courseId = lesson?.courseId ?? lesson?.course?.courseId;
    const lessonId = lesson?.lessonId ?? lesson?.id;

    const openLesson = () => {
        if (courseId && lessonId) navigate(ROUTES.COURSE_LESSON(courseId, lessonId));
    };

    return (
        <button type="button" onClick={openLesson} disabled={!courseId || !lessonId} className="group flex min-h-48 w-full cursor-pointer flex-col rounded-2xl border border-blue-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-65 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><BookOpenCheck size={20} /></span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-50 px-2.5 py-1 text-xs font-bold text-blue-950"><PlayCircle size={13} /> Bài học</span>
            </div>
            <div className="mt-4 min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-wide text-blue-800">{getLessonCourseName(lesson)}</p>
                <h3 className="mt-1 line-clamp-2 text-base font-bold leading-6 text-blue-950">{getLessonTitle(lesson)}</h3>
            </div>
            <div className="mt-auto border-t border-blue-100 pt-4">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold"><span className="text-gray-600">{counts.completed}/{counts.total} nội dung</span><span className="text-blue-800">{progress}%</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-blue-800 transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
                <div className="mt-3 flex justify-end"><ArrowUpRight size={19} className="text-blue-800 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
            </div>
        </button>
    );
};

export default LatestLessonCard;
