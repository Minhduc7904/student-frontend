import { LoaderCircle, PlayCircle } from "lucide-react";
import { Avatar, Image } from "../../../../shared/components/images";
import {
    getEnrollmentGrade,
    getEnrollmentProgress,
    getEnrollmentSubject,
    getEnrollmentTeacher,
    getEnrollmentThumbnail,
} from "../../courses/components/courseCardUtils";

const ContinueLearningCard = ({ enrollment, onOpen, isOpening }) => {
    const course = enrollment?.course || {};
    const progress = getEnrollmentProgress(enrollment);
    const teacher = getEnrollmentTeacher(enrollment);

    return (
        <button
            type="button"
            onClick={() => onOpen(enrollment)}
            disabled={isOpening}
            className="group relative flex w-[calc(100vw-3rem)] max-w-[19rem] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-3 text-left shadow-sm transition active:scale-[0.99] hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md disabled:cursor-wait disabled:opacity-75 sm:w-[19rem]"
            aria-label={`Học tiếp khóa ${course.title || "học tập"}`}
        >
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-blue-100">
                <Image src={getEnrollmentThumbnail(enrollment)} alt={course.title || "Ảnh khóa học"} className="h-full w-full transition duration-300 group-hover:scale-[1.03]" loading="lazy" />
                <span className="absolute inset-0 grid place-items-center bg-blue-950/0 text-white transition group-hover:bg-blue-950/25">
                    {isOpening ? <LoaderCircle size={28} className="animate-spin" /> : <PlayCircle size={30} className="opacity-0 transition group-hover:opacity-100" />}
                </span>
            </div>

            <div className="flex flex-1 flex-col px-0.5 pt-3">
                <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800">{getEnrollmentSubject(enrollment)}</span>
                    <span className="rounded-lg bg-yellow-50 px-2.5 py-1 text-[11px] font-bold text-blue-950">{getEnrollmentGrade(enrollment)}</span>
                </div>

                <h2 className="mt-3 line-clamp-2 min-h-12 text-base font-bold leading-6 text-blue-950">{course.title || "Khóa học đang cập nhật"}</h2>

                <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-blue-100" aria-label={`Tiến độ ${progress}%`}>
                        <div className="h-full rounded-full bg-blue-800 transition-[width] duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-blue-800">Đã hoàn thành {progress}%</p>
                </div>

                <div className="mt-4 flex items-center gap-2.5 border-t border-blue-100 pt-3">
                    <Avatar src={teacher.avatarUrl} alt={teacher.name} size="sm" className="shrink-0 ring-2 ring-blue-50" />
                    <p className="truncate text-sm font-bold text-blue-950">{teacher.name}</p>
                </div>
            </div>
        </button>
    );
};

export default ContinueLearningCard;
