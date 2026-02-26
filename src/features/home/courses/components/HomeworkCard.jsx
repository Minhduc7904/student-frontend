import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, AlertCircle, Timer } from "lucide-react";
import { formatDate } from "../../../../shared/utils";
import Play from "../../../../assets/icons/Play.svg";
import { SvgIcon } from "../../../../shared/components";
import { ROUTES } from "../../../../core/constants";

const HomeworkCard = memo(({ homework }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(ROUTES.COURSE_LEARNING_ITEM(homework.courseId, homework.lessonId, homework.learningItemId));
    };

    const getStatus = (hw) => {
        const now = new Date();
        if (hw.isOverdue && !hw.allowLateSubmit) return "OVERDUE";
        if (hw.isSubmitted) return "COMPLETED";

        if (hw.competition) {
            const startDate = new Date(hw.competition.startDate);
            const endDate = new Date(hw.competition.endDate);

            if (now < startDate) return "NOT_STARTED";
            if (now > endDate) return "OVERDUE";

            return "INCOMPLETE";
        }

        return "INCOMPLETE";
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "COMPLETED":
                return {
                    bg: "bg-white",
                    text: "text-green-500",
                    icon: CheckCircle2,
                    label: "Đã hoàn thành",
                };
            case "OVERDUE":
                return {
                    bg: "bg-red-100",
                    text: "text-red-600",
                    icon: AlertCircle,
                    label: "Quá hạn",
                };
            case "NOT_STARTED":
                return {
                    bg: "bg-red-500",
                    text: "text-red-100",
                    icon: Timer,
                    label: "Chưa bắt đầu",
                };
            default:
                return {
                    bg: "bg-white",
                    text: "text-pink-500",
                    icon: Clock,
                    label: "Chưa làm",
                };
        }
    };

    return (
        <div className="flex flex-col w-full gap-2 sm:gap-3">
            {/* Header */}
            <div className="w-full">
                <span className="text-gray-1000 text-text-5 sm:text-subhead-5 md:text-subhead-4">
                    {homework.learningItem.title} - {homework.lessonTitle}
                </span>
            </div>

            {/* Homework List */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full">
                {homework.homeworkContents.length === 0 ? (
                    // Empty State khi không có homework content
                    <div className="flex flex-col items-center justify-center px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 rounded-xl sm:rounded-2xl border border-gray-100">
                        <div className="text-gray-400 text-4xl sm:text-5xl mb-3">📋</div>
                        <span className="text-text-5 sm:text-subhead-5 text-gray-600 text-center">
                            Chưa có nội dung bài tập
                        </span>
                    </div>
                ) : (
                    homework.homeworkContents.map((hw, index) => {
                        const status = getStatus(hw);
                        const config = getStatusConfig(status);
                        const StatusIcon = config.icon;

                        return (
                            <div
                                key={index}
                                onClick={handleNavigate}
                                className="hover:scale-101 cursor-pointer transition flex flex-col sm:flex-row w-full items-start sm:items-center justify-between px-3 py-3 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm bg-white gap-3 sm:gap-4 md:gap-6"
                            >
                            {/* Left Content */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0 w-full sm:w-auto">
                                <span className="text-gray-1000 text-text-5 sm:text-subhead-5 md:text-subhead-4 truncate">
                                    {hw.content}
                                </span>
                                <span className="text-text-5 sm:text-text-5 text-gray-600 truncate">
                                    Hạn nộp: {formatDate(hw.dueDate)}
                                </span>
                            </div>

                            {/* Competition Info & Actions - Flex row trên mobile */}
                            <div className="flex flex-row sm:flex-row items-center sm:items-center justify-between sm:justify-end gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto">
                                {/* Competition Info */}
                                {hw.competition && (
                                    <div className="flex flex-col items-start shrink-0">
                                        <span className="text-text-5 sm:text-text-4 whitespace-nowrap text-gray-500">
                                            Thời gian
                                        </span>
                                        <span className="text-text-5 sm:text-subhead-5 whitespace-nowrap">
                                            {hw.competition.durationMinutes
                                                ? hw.competition.durationMinutes + " phút"
                                                : "Không giới hạn"}
                                        </span>
                                    </div>
                                )}

                                {/* Right Action */}
                                <div className="flex flex-col gap-1.5 sm:gap-2 items-end shrink-0">
                                    {/* Status Badge */}
                                    <div
                                        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1 sm:gap-2 ${config.bg}`}
                                    >
                                        <span
                                            className={`text-text-5 sm:text-subhead-5 whitespace-nowrap ${config.text}`}
                                        >
                                            {config.label}
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    {status !== "NOT_STARTED" && status !== "OVERDUE" && (
                                        <button
                                            onClick={handleNavigate}
                                            className="cursor-pointer hover:bg-[#183D87] active:scale-105 transition flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-800 rounded-md sm:rounded-lg text-white"
                                        >
                                            <SvgIcon src={Play} width={14} height={14} className="sm:w-[18px] sm:h-[18px]" />
                                            <span className="whitespace-nowrap text-text-5 sm:text-subhead-5">
                                                Làm ngay
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })
                )}
            </div>
        </div>
    );
});

HomeworkCard.displayName = "HomeworkCard";

export default HomeworkCard;
