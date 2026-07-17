import { ArrowUpRight, ClipboardList, FileUp, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../core/constants";
import {
    formatHomeworkDeadline,
    getHomeworkDeadline,
    getHomeworkStatus,
    getHomeworkStatusDisplay,
    getHomeworkType,
} from "./homeworkCardUtils";

const DashboardHomeworkCard = ({ homework }) => {
    const navigate = useNavigate();
    const status = getHomeworkStatus(homework);
    const statusDisplay = getHomeworkStatusDisplay(status);
    const homeworkType = getHomeworkType(homework);
    const Icon = homeworkType === "FILE_UPLOAD" ? FileUp : Trophy;
    const deadline = getHomeworkDeadline(homework);

    const openHomework = () => {
        if (homework?.courseId && homework?.lessonId && homework?.learningItemId) {
            navigate(ROUTES.COURSE_LEARNING_ITEM(homework.courseId, homework.lessonId, homework.learningItemId));
        }
    };

    return (
        <button type="button" onClick={openHomework} className="group flex min-h-48 w-full cursor-pointer flex-col rounded-2xl border border-blue-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/40 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><Icon size={20} /></span>
                <span className={`max-w-[60%] truncate rounded-lg px-2.5 py-1 text-xs font-bold ${statusDisplay.className}`}>{statusDisplay.label}</span>
            </div>
            <div className="mt-4 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-800">{homeworkType === "FILE_UPLOAD" ? "Nộp bài" : "Bài thi"}</p>
                <h3 className="mt-1 line-clamp-2 break-words text-base font-bold leading-6 text-blue-950">{homework?.title || "Bài tập đang cập nhật"}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-gray-600">{homework?.lessonTitle || "Buổi học đang cập nhật"}</p>
            </div>
            <div className="mt-auto flex items-end justify-between gap-3 border-t border-blue-100 pt-4">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">Hạn nộp</p>
                    <p className="mt-1 truncate text-sm font-bold text-blue-950">{formatHomeworkDeadline(deadline)}</p>
                </div>
                <ArrowUpRight size={19} className="shrink-0 text-blue-800 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
        </button>
    );
};

export default DashboardHomeworkCard;
