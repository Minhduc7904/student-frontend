import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import {
    getPublicStudentExamAttemptsAsync,
    getPublicStudentQuestionAnswersAsync,
    getPublicStudentSubmittedHistoryAsync,
    selectPublicStudentExamAttempts,
    selectPublicStudentExamAttemptsLoading,
    selectPublicStudentQuestionAnswers,
    selectPublicStudentQuestionAnswersLoading,
    selectPublicStudentSubmittedHistory,
    selectPublicStudentSubmittedHistoryLoading,
} from "../store/profileSlice";

const HISTORY_QUERY = { page: 1, limit: 20 };

const HISTORY_TABS = {
    COMPETITION: "competition",
    QUESTION: "question",
    EXAM: "exam",
};

const normalizeStatus = (status) => {
    if (!status) return "";
    return String(status).trim().toUpperCase();
};

const pickFirstDefined = (obj, keys) => {
    for (const key of keys) {
        const value = obj?.[key];
        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }
    return "";
};

const normalizeHistoryItems = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.history)) return data.history;
    if (Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const formatRelativeTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    const diffMs = Date.now() - date.getTime();
    if (diffMs <= 0) return "Vừa xong";

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} tháng trước`;

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} năm trước`;
};

const formatPointsText = (item) => {
    const totalPoints = pickFirstDefined(item, ["points", "score", "point", "totalPoints", "totalPoint"]);
    const maxPoints = pickFirstDefined(item, ["maxPoints", "maxPoint", "totalScore"]);

    if (totalPoints !== "" && maxPoints !== "") {
        return `${totalPoints}/${maxPoints}`;
    }

    const fallbackScore = pickFirstDefined(item, ["score", "point"]);
    return fallbackScore !== "" ? String(fallbackScore) : "";
};

const truncateText = (value, maxLength = 85) => {
    const text = String(value || "").trim();
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}...`;
};

const getHistoryRowModel = (item, index, activeTab) => {
    if (activeTab === HISTORY_TABS.COMPETITION) {
        const title =
            pickFirstDefined(item, ["competitionTitle", "title", "name"]) ||
            `Bài nộp cuộc thi #${index + 1}`;
        const time = formatRelativeTime(pickFirstDefined(item, ["submittedAt", "createdAt", "updatedAt"]));
        const pointsText = formatPointsText(item);

        return {
            title,
            timeText: time,
            rightText: pointsText !== "" ? `Điểm: ${pointsText}` : "",
            badgeClass: "bg-emerald-50 text-emerald-700",
        };
    }

    if (activeTab === HISTORY_TABS.QUESTION) {
        const rawTitle =
            pickFirstDefined(item, ["questionContent", "content", "questionTitle", "title", "name"]) ||
            `Câu hỏi #${index + 1}`;
        const title = truncateText(rawTitle);
        const answeredAt = formatRelativeTime(pickFirstDefined(item, ["answeredAt", "createdAt", "updatedAt"]));
        const isCorrect = pickFirstDefined(item, ["isCorrect", "correct"]);
        const correctText = isCorrect === true ? "Đúng" : isCorrect === false ? "Sai" : "";

        return {
            title,
            timeText: answeredAt,
            rightText: correctText,
            badgeClass:
                isCorrect === false
                    ? "bg-rose-50 text-rose-700"
                    : "bg-blue-50 text-blue-700",
        };
    }

    const title =
        pickFirstDefined(item, ["examTitle", "title", "name"]) ||
        `Đề mẫu #${index + 1}`;
    const attemptedAt = formatRelativeTime(pickFirstDefined(item, ["attemptedAt", "submittedAt", "createdAt", "updatedAt"]));
    const examStatus = normalizeStatus(pickFirstDefined(item, ["status"]));

    if (examStatus === "IN_PROGRESS") {
        return {
            title,
            timeText: attemptedAt,
            rightText: "Đang làm",
            badgeClass: "bg-amber-50 text-amber-700",
        };
    }

    const pointsText = formatPointsText(item);

    return {
        title,
        timeText: attemptedAt,
        rightText: pointsText !== "" ? `Điểm: ${pointsText}` : "",
        badgeClass: "bg-emerald-50 text-emerald-700",
    };
};

const HistoryListCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: studentId } = useParams();
    const submittedHistory = useSelector(selectPublicStudentSubmittedHistory);
    const submittedHistoryLoading = useSelector(selectPublicStudentSubmittedHistoryLoading);
    const questionHistory = useSelector(selectPublicStudentQuestionAnswers);
    const questionHistoryLoading = useSelector(selectPublicStudentQuestionAnswersLoading);
    const examHistory = useSelector(selectPublicStudentExamAttempts);
    const examHistoryLoading = useSelector(selectPublicStudentExamAttemptsLoading);

    const [activeHistoryTab, setActiveHistoryTab] = useState(HISTORY_TABS.COMPETITION);
    const [isSwitchingTab, setIsSwitchingTab] = useState(false);
    const [hasTriggeredTabFetch, setHasTriggeredTabFetch] = useState(false);

    const handleChangeHistoryTab = (nextTab) => {
        if (nextTab === activeHistoryTab) return;
        setActiveHistoryTab(nextTab);
        setIsSwitchingTab(true);
        setHasTriggeredTabFetch(false);
    };

    const historyQuery = useMemo(() => {
        if (!studentId) return HISTORY_QUERY;
        return {
            ...HISTORY_QUERY,
            studentId,
        };
    }, [studentId]);

    useEffect(() => {
        if (activeHistoryTab === HISTORY_TABS.COMPETITION) {
            dispatch(getPublicStudentSubmittedHistoryAsync(historyQuery));
            setHasTriggeredTabFetch(true);
            return;
        }

        if (activeHistoryTab === HISTORY_TABS.QUESTION) {
            dispatch(getPublicStudentQuestionAnswersAsync(historyQuery));
            setHasTriggeredTabFetch(true);
            return;
        }

        dispatch(getPublicStudentExamAttemptsAsync(historyQuery));
        setHasTriggeredTabFetch(true);
    }, [activeHistoryTab, dispatch, historyQuery]);

    const activeItems = useMemo(() => {
        if (activeHistoryTab === HISTORY_TABS.COMPETITION) {
            return normalizeHistoryItems(submittedHistory);
        }

        if (activeHistoryTab === HISTORY_TABS.QUESTION) {
            return normalizeHistoryItems(questionHistory);
        }

        return normalizeHistoryItems(examHistory);
    }, [activeHistoryTab, submittedHistory, questionHistory, examHistory]);

    const activeLoading =
        activeHistoryTab === HISTORY_TABS.COMPETITION
            ? submittedHistoryLoading
            : activeHistoryTab === HISTORY_TABS.QUESTION
                ? questionHistoryLoading
                : examHistoryLoading;

    useEffect(() => {
        if (!isSwitchingTab) return;
        if (!hasTriggeredTabFetch) return;
        if (activeLoading) return;
        setIsSwitchingTab(false);
    }, [activeLoading, hasTriggeredTabFetch, isSwitchingTab]);

    const shouldShowLoading = activeLoading || isSwitchingTab;

    const historyRouteByTab = {
        [HISTORY_TABS.COMPETITION]: ROUTES.HISTORY_COMPETITION,
        [HISTORY_TABS.QUESTION]: ROUTES.HISTORY_QUESTION,
        [HISTORY_TABS.EXAM]: ROUTES.HISTORY_EXAM,
    };

    const getRowNavigatePath = (item) => {
        if (activeHistoryTab === HISTORY_TABS.COMPETITION) {
            const competitionId = pickFirstDefined(item, ["competitionId", "id"]);
            const submitId = pickFirstDefined(item, ["competitionSubmitId", "submitId", "id"]);
            if (competitionId && submitId) {
                return ROUTES.COMPETITION_RESULT(competitionId, submitId);
            }
            return "";
        }

        if (activeHistoryTab === HISTORY_TABS.EXAM) {
            const status = normalizeStatus(pickFirstDefined(item, ["status"]));
            if (status !== "IN_PROGRESS") return "";

            const typeOfExam = pickFirstDefined(item, ["typeOfExam", "typeExam", "typeexam"]);
            const examId = pickFirstDefined(item, ["examId", "id"]);
            if (!examId) return "";

            if (typeOfExam) {
                return ROUTES.EXAM_TYPE_DETAIL(typeOfExam, examId);
            }

            return ROUTES.EXAM_DETAIL(examId);
        }

        return "";
    };

    const getRowKey = (item, index) => {
        const baseId = pickFirstDefined(item, [
            "questionAnswerId",
            "competitionSubmitId",
            "submitId",
            "attemptId",
            "id",
        ]);
        return `${activeHistoryTab}-${baseId || "row"}-${index}`;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleChangeHistoryTab(HISTORY_TABS.COMPETITION)}
                        className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeHistoryTab === HISTORY_TABS.COMPETITION
                            ? "bg-[#F7F7F8] text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        Cuộc thi
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChangeHistoryTab(HISTORY_TABS.QUESTION)}
                        className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeHistoryTab === HISTORY_TABS.QUESTION
                            ? "bg-[#F7F7F8] text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        Câu hỏi
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChangeHistoryTab(HISTORY_TABS.EXAM)}
                        className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeHistoryTab === HISTORY_TABS.EXAM
                            ? "bg-[#F7F7F8] text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        Đề mẫu
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        const targetRoute = historyRouteByTab[activeHistoryTab];
                        const search = studentId ? `?studentId=${encodeURIComponent(studentId)}` : "";
                        navigate(`${targetRoute}${search}`);
                    }}
                    className="self-start text-sm font-medium text-gray-600 hover:text-gray-700 hover:underline cursor-pointer sm:self-auto"
                >
                    Xem tất cả
                </button>
            </div>

            {shouldShowLoading ? (
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-12 animate-pulse rounded-md bg-gray-100" />
                    ))}
                </div>
            ) : activeItems.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có dữ liệu lịch sử.</p>
            ) : (
                <div key={activeHistoryTab} className="space-y-2">
                    {activeItems.map((item, index) => {
                        const rowModel = getHistoryRowModel(item, index, activeHistoryTab);
                        const navigatePath = getRowNavigatePath(item);
                        const isRowClickable = Boolean(navigatePath);

                        return (
                            <div
                                key={getRowKey(item, index)}
                                onClick={() => {
                                    if (!isRowClickable) return;
                                    navigate(navigatePath);
                                }}
                                className={`${isRowClickable ? "cursor-pointer" : "cursor-default"} flex flex-col items-start justify-between gap-2 rounded-lg px-3 py-2 sm:flex-row sm:items-center ${index % 2 === 0 ? "bg-[#F7F7F8]" : "bg-white"
                                    }`}
                            >
                                <div className="min-w-0 w-full sm:w-auto">
                                    <p className="line-clamp-2 text-sm font-medium text-gray-900 sm:truncate">{rowModel.title}</p>
                                    <p className="mt-0.5 text-xs text-gray-500">{rowModel.timeText || "Vừa xong"}</p>
                                </div>

                                {rowModel.rightText ? (
                                    <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium sm:ml-4 ${rowModel.badgeClass}`}>
                                        {rowModel.rightText}
                                    </span>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default memo(HistoryListCard);