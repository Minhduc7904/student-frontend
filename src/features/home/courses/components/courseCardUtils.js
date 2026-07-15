import MathCourseImage from "../../../../assets/images/MathCourseImage.jpg";
import EnglishCourseImage from "../../../../assets/images/EnglishCourseImage.png";
import PhysicCourseImage from "../../../../assets/images/PhysicCourseImage.png";
import { SUBJECT_IDS } from "../../../../core/constants/subject";
import { getLastNameFirstName } from "../../../../shared/utils";

export const getEnrollmentProgress = (enrollment) => {
    const progress = Number(enrollment?.completionPercentage);
    return Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : 0;
};

const getSubjectFallbackImage = (subjectId) => {
    switch (subjectId) {
        case SUBJECT_IDS.ENGLISH:
            return EnglishCourseImage;
        case SUBJECT_IDS.PHYSICS:
            return PhysicCourseImage;
        default:
            return MathCourseImage;
    }
};

export const getEnrollmentThumbnail = (enrollment) => {
    const course = enrollment?.course;

    return enrollment?.thumbnail?.viewUrl
        || course?.thumbnail?.viewUrl
        || course?.media?.thumbnail?.viewUrl
        || course?.imageUrl
        || getSubjectFallbackImage(course?.subjectId);
};

export const getEnrollmentSubject = (enrollment) => {
    const course = enrollment?.course;
    return course?.subjectName
        || course?.subject?.name
        || (typeof course?.subject === "string" ? course.subject : "")
        || "Môn học";
};

export const getEnrollmentGrade = (enrollment) => {
    const grade = enrollment?.course?.grade || enrollment?.student?.grade;
    return grade ? `Khối ${grade}` : "Khối đang cập nhật";
};

export const getEnrollmentTeacher = (enrollment) => {
    const course = enrollment?.course;
    const teacher = course?.teacher;

    return {
        name: getLastNameFirstName(teacher, enrollment?.teacherName || course?.teacherName || "Đang cập nhật"),
        avatarUrl: enrollment?.teacherAvatarUrl || teacher?.avatarUrl || "",
    };
};
