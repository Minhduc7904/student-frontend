/**
 * Pure formatting helpers for the point history. Kept free of React so they can be unit-tested.
 *
 * Attendance point logs carry `metadata.status` (PRESENT | ABSENT | LATE) and `metadata.attendanceType`
 * (REGULAR | MAKEUP). The two are independent: the type is read only from `metadata.attendanceType`
 * and is never inferred from the status.
 */

export const SOURCE_LABELS = {
    ATTENDANCE: "Điểm danh",
    COMPETITION_SUBMIT: "Nộp bài cuộc thi",
    LEARNING_ITEM_LEARNED: "Hoàn thành bài học",
    HOMEWORK_SUBMIT: "Nộp bài tập",
    EXAM_SUBMIT: "Nộp bài kiểm tra",
    MANUAL: "Cập nhật thủ công",
};

export const REFERENCE_LABELS = {
    ATTENDANCE: "Điểm danh",
    COMPETITION: "Cuộc thi",
    COMPETITION_SUBMIT: "Bài nộp cuộc thi",
    LEARNING_ITEM: "Bài học",
    HOMEWORK: "Bài tập",
    EXAM: "Bài kiểm tra",
};

export const METADATA_LABELS = {
    attendanceId: "Mã điểm danh",
    sessionId: "Mã buổi học",
    status: "Trạng thái",
    attendanceType: "Loại điểm danh",
    competitionId: "Mã cuộc thi",
    competitionSubmitId: "Mã bài nộp",
    learningItemId: "Mã bài học",
};

export const VALUE_LABELS = {
    PRESENT: "Có mặt",
    ABSENT: "Vắng mặt",
    LATE: "Đi muộn",
    BONUS: "Cộng điểm",
    PENALTY: "Trừ điểm",
};

export const ATTENDANCE_TYPE_LABELS = {
    REGULAR: "Học thường",
    MAKEUP: "Học bù",
};

export const UNKNOWN_ATTENDANCE_TYPE_LABEL = "Không xác định";

export const toSafeNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

export const formatNumber = (value) => toSafeNumber(value).toLocaleString("vi-VN");

export const formatDateTime = (value) => {
    if (!value) return "--";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const formatLabel = (value, labels = {}) => {
    if (!value) return "--";
    return labels[value] || String(value).replaceAll("_", " ").toLowerCase();
};

/**
 * Label for `metadata.attendanceType`: a known value maps to its label, a missing value to `null`
 * (nothing to show) and any other value to a safe fallback instead of the raw string.
 */
export const getAttendanceTypeLabel = (attendanceType) => {
    if (attendanceType === undefined || attendanceType === null || attendanceType === "") return null;
    return Object.hasOwn(ATTENDANCE_TYPE_LABELS, attendanceType)
        ? ATTENDANCE_TYPE_LABELS[attendanceType]
        : UNKNOWN_ATTENDANCE_TYPE_LABEL;
};

/** Display value for one metadata entry. */
export const formatMetadataValue = (key, value) => {
    if (key === "attendanceType") {
        return getAttendanceTypeLabel(value) ?? "--";
    }
    if (value === undefined || value === null || value === "") return "--";
    return VALUE_LABELS[value] || String(value);
};

/**
 * Metadata entries to display: known keys first in a fixed order (so the attendance type is never pushed
 * out by unrelated keys), then the rest, limited to four.
 */
export const getMetadataEntries = (metadata) => {
    const entries = Object.entries(metadata && typeof metadata === "object" ? metadata : {});
    const knownKeys = Object.keys(METADATA_LABELS);
    const rank = (key) => {
        const index = knownKeys.indexOf(key);
        return index === -1 ? knownKeys.length : index;
    };

    return entries
        .map((entry, position) => ({ entry, position }))
        .sort((left, right) => rank(left.entry[0]) - rank(right.entry[0]) || left.position - right.position)
        .map(({ entry }) => entry)
        .slice(0, 4);
};

export const translateNote = (log) => {
    const note = String(log?.note || "").trim();
    const points = formatNumber(log?.points);
    const sourceLabel = formatLabel(log?.source, SOURCE_LABELS);
    const status = log?.metadata?.status ? formatLabel(log.metadata.status, VALUE_LABELS) : "";
    const typeLabel = getAttendanceTypeLabel(log?.metadata?.attendanceType);
    const attendanceDetail = [status.toLowerCase(), typeLabel ? typeLabel.toLowerCase() : ""]
        .filter(Boolean)
        .join(", ");

    if (/attendance/i.test(note) || log?.source === "ATTENDANCE") {
        if (log?.type === "BONUS") {
            return `Được cộng ${points} điểm khi điểm danh${attendanceDetail ? `: ${attendanceDetail}` : ""}.`;
        }
        return `Bị trừ ${points} điểm từ điểm danh${attendanceDetail ? `: ${attendanceDetail}` : ""}.`;
    }

    if (log?.type === "BONUS") {
        return `Được cộng ${points} điểm từ ${sourceLabel.toLowerCase()}.`;
    }

    if (log?.type === "PENALTY") {
        return `Bị trừ ${points} điểm từ ${sourceLabel.toLowerCase()}.`;
    }

    return `Điểm được cập nhật từ ${sourceLabel.toLowerCase()}.`;
};

export const normalizeLogsPayload = (response) => {
    const payload = response?.data || response || {};

    return {
        items: Array.isArray(payload.data) ? payload.data : [],
        meta: payload.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
        totalPoint: payload.totalPoint,
    };
};
