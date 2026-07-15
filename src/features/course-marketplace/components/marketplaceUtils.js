import { getLastNameFirstName } from "../../../shared/utils";

export const formatCoursePrice = (course) => {
    const price = Number(course?.priceVND);

    if (course?.isFree || price === 0) return "Miễn phí";
    if (!Number.isFinite(price)) return "Đang cập nhật";

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(price);
};

export const getMarketplaceTeacher = (course) => ({
    name: getLastNameFirstName(course?.teacher, course?.teacherName || "Đang cập nhật"),
    avatarUrl: course?.teacherAvatarUrl || course?.teacher?.avatarUrl || "",
});

export const getMarketplaceThumbnail = (course) => (
    course?.thumbnail?.viewUrl
    || course?.media?.thumbnail?.viewUrl
    || course?.imageUrl
    || ""
);

export const getMarketplaceSubject = (course) => (
    course?.subjectName || course?.subject?.name || "Môn học"
);
