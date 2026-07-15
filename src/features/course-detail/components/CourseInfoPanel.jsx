import {
    BookOpenCheck,
    CalendarDays,
    GraduationCap,
    Monitor,
    PlayCircle,
    School,
} from "lucide-react";
import { formatPrice } from "./courseDetailUtils";
import { CourseThumbnail } from "./CourseThumbnail";
import { Avatar } from "../../../shared/components/images";
import { getLastNameFirstName } from "../../../shared/utils";

const InfoLine = ({ icon: Icon, label, value, avatarUrl }) => (
    <div className="flex items-start gap-3">
        {avatarUrl !== undefined ? (
            <Avatar src={avatarUrl} alt={value} size="sm" className="shrink-0 ring-2 ring-blue-50" />
        ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                <Icon size={17} />
            </span>
        )}
        <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold leading-5 text-blue-950">{value}</p>
        </div>
    </div>
);

export const CourseInfoPanel = ({ course, courseImage, totalLessons, isEnrolled, onContinue, showPrice = false, primaryAction }) => {
    const teacher = {
        ...course?.teacher,
        firstName: course?.teacher?.firstName || course?.teacherFirstName,
        lastName: course?.teacher?.lastName || course?.teacherLastName,
    };
    const teacherName = getLastNameFirstName(teacher, course?.teacherName || "Đang cập nhật");
    const teacherAvatarUrl = course?.teacherAvatarUrl || course?.teacher?.avatarUrl || "";
    const subjectName = course?.subjectName || course?.subject?.name || "Đang cập nhật";
    const PrimaryActionIcon = primaryAction?.Icon;

    return (
        <aside className="order-1 h-fit lg:sticky lg:top-6 lg:order-2 lg:self-start">
            <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                <CourseThumbnail course={course} fallbackImage={courseImage} />
                <div className="p-4 sm:p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-800">
                        {isEnrolled ? "Khóa học của bạn" : "Thông tin khóa học"}
                    </p>
                    {showPrice ? (
                        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <p className="text-2xl font-bold text-blue-950">
                                {formatPrice(course?.priceVND, course?.isFree)}
                            </p>
                            {course?.hasDiscount && course?.discountPercentage ? (
                                <span className="rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                                    Giảm {course.discountPercentage}%
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {primaryAction ? (
                        <button
                            type="button"
                            onClick={primaryAction.onClick}
                            disabled={primaryAction.disabled}
                            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                        >
                            {PrimaryActionIcon ? <PrimaryActionIcon size={18} /> : null}
                            {primaryAction.label}
                        </button>
                    ) : isEnrolled ? (
                        <button
                            type="button"
                            onClick={onContinue}
                            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900 active:scale-[0.98]"
                        >
                            <PlayCircle size={18} />
                            Vào bài học
                        </button>
                    ) : (
                        <p className="mt-5 rounded-xl bg-yellow-50 px-3 py-3 text-sm font-semibold leading-6 text-blue-950">
                            Bạn có thể xem trước lộ trình bên dưới. Nội dung chi tiết sẽ mở trong trang học.
                        </p>
                    )}

                    <div className="mt-6 space-y-4 border-t border-blue-100 pt-5">
                        <InfoLine icon={School} label="Môn học" value={subjectName} />
                        <InfoLine icon={GraduationCap} label="Giáo viên" value={teacherName} avatarUrl={teacherAvatarUrl} />
                        <InfoLine icon={BookOpenCheck} label="Khối lớp" value={course?.grade ? `Lớp ${course.grade}` : "Đang cập nhật"} />
                        <InfoLine icon={CalendarDays} label="Năm học" value={course?.academicYear || "Đang cập nhật"} />
                        <InfoLine icon={PlayCircle} label="Số buổi" value={`${totalLessons} buổi học`} />
                        <InfoLine icon={Monitor} label="Thiết bị" value="Máy tính hoặc điện thoại" />
                    </div>
                </div>
            </article>
        </aside>
    );
};
