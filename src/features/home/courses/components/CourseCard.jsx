import { memo } from "react";
import { Image } from "../../../../shared/components/images";
import MathCourseImage from "../../../../assets/images/MathCourseImage.png";
import EnglishCourseImage from "../../../../assets/images/EnglishCourseImage.png";
import PhysicCourseImage from "../../../../assets/images/PhysicCourseImage.png";
import { SUBJECT_IDS } from "../../../../core/constants/subject";
import { PartyPopper } from "lucide-react";

/**
 * Course Card Component
 * Hiển thị thông tin khóa học đã đăng ký
 */
const CourseCard = memo(({ enrollment, bgColor = 'bg-blue-lighter' }) => {
    const { course, status, completionPercentage = 0 } = enrollment;

    const progress = Math.min(100, Math.max(0, completionPercentage));

    const getProgressColor = () => {
        if (progress < 30) return "from-red-400 to-red-500";
        if (progress < 70) return "from-yellow-400 to-yellow-500";
        return "from-green-400 to-green-500";
    };

    const getSubjectImage = (subjectId) => {
        switch (subjectId) {
            case SUBJECT_IDS.MATH:
                return MathCourseImage;
            case SUBJECT_IDS.ENGLISH:
                return EnglishCourseImage;
            case SUBJECT_IDS.PHYSICS:
                return PhysicCourseImage;
            default:
                return MathCourseImage;
        }
    };

    return (
        <div className="w-full flex justify-start items-center">
            <div className={`hover:scale-105 transition active:scale-105 cursor-pointer w-full px-4 sm:px-5 lg:px-6 py-3 gap-4 flex flex-col justify-center items-center rounded-2xl ${bgColor}`}>

                {/* Header */}
                <div className="flex flex-row gap-4 items-center w-full">
                    <div className="w-10 h-10 rounded flex-shrink-0">
                        <Image
                            src={course.imageUrl || getSubjectImage(course.subjectId)}
                            alt={course.title}
                            className="w-full h-full object-contain rounded"
                        />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-sm font-semibold text-black truncate">
                            {course.title || "Tên khóa học"}
                        </span>
                        <span className="text-xs text-blue-900 truncate">
                            {course.teacherName || "Giáo viên"}
                        </span>
                    </div>
                </div>

                {/* Progress */}
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-700 ease-out rounded-full`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">
                            {true ? <>Đã hoàn thành <PartyPopper className="inline-block w-4 h-4 text-red-500" /></> : "Hoàn thành"}
                        </span>
                        <span className="font-semibold text-blue-600">
                            {progress}%
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
});
CourseCard.displayName = "CourseCard";

export default CourseCard;
