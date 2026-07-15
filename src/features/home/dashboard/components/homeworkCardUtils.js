const getPrimaryHomeworkContent = (homework) => homework?.homeworkContents?.[0] || {};

export const getHomeworkType = (homework) => {
    const type = String(getPrimaryHomeworkContent(homework)?.type || homework?.type || "").toUpperCase();
    return type.includes("FILE") ? "FILE_UPLOAD" : "COMPETITION";
};

export const getHomeworkDeadline = (homework) => {
    const content = getPrimaryHomeworkContent(homework);
    return content?.deadline || content?.dueDate || homework?.deadline || homework?.dueDate || null;
};

export const getHomeworkStatus = (homework) => {
    const content = getPrimaryHomeworkContent(homework);
    const submitted = Boolean(content?.homeworkSubmit || content?.isSubmitted || homework?.homeworkSubmit || homework?.isSubmitted);
    if (submitted) return "COMPLETED";

    const deadline = getHomeworkDeadline(homework);
    if (deadline && new Date(deadline).getTime() < Date.now()) return "OVERDUE";

    return "INCOMPLETE";
};

export const formatHomeworkDeadline = (deadline) => {
    if (!deadline) return "Không giới hạn thời gian";

    const date = new Date(deadline);
    if (Number.isNaN(date.getTime())) return "Đang cập nhật hạn nộp";

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const getHomeworkStatusDisplay = (status) => ({
    COMPLETED: { label: "Đã hoàn thành", className: "bg-green-100 text-green-700" },
    OVERDUE: { label: "Quá hạn", className: "bg-red-50 text-red-600" },
    INCOMPLETE: { label: "Chưa hoàn thành", className: "bg-yellow-50 text-blue-950" },
}[status] || { label: "Đang cập nhật", className: "bg-blue-50 text-blue-800" });
