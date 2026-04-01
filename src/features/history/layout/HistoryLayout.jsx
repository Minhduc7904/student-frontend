import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
import { Card } from "../../../shared/components";
import {
    CompetitionHistoryStatsSidebar,
    ExamHistoryStatsSidebar,
    QuestionHistoryStatsSidebar,
} from "./component/HistoryStatsSidebars";
import QuestionChapterBubbleClusterModal from "./component/QuestionChapterBubbleClusterModal";
import {
    selectMyProfile,
    selectProfile,
} from "../../profile/store/profileSlice";
import { selectCompetitionHistoryPageData } from "../competition/store/competitionHistoryPageSlice";
import { selectExamHistoryPageData } from "../exam/store/examHistoryPageSlice";
import {
    selectQuestionHistoryPageData,
    selectQuestionHistoryStatistics,
} from "../question/store/questionHistoryPageSlice";

const tabs = [
    { label: "Cuộc thi", to: ROUTES.HISTORY_COMPETITION },
    { label: "Câu hỏi", to: ROUTES.HISTORY_QUESTION },
    { label: "Đề mẫu", to: ROUTES.HISTORY_EXAM },
];

const HistoryLayout = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const studentId = searchParams.get("studentId") || undefined;
    const myProfile = useSelector(selectMyProfile);
    const viewedProfile = useSelector(selectProfile);
    const submittedHistory = useSelector(selectCompetitionHistoryPageData);
    const questionHistory = useSelector(selectQuestionHistoryPageData);
    const questionHistoryStatistics = useSelector(selectQuestionHistoryStatistics);
    const examHistory = useSelector(selectExamHistoryPageData);
    const byChapter = Array.isArray(questionHistoryStatistics?.byChapter) ? questionHistoryStatistics.byChapter : [];

    const currentHistoryRoute = useMemo(() => {
        const pathParts = location.pathname.split("/").filter(Boolean);
        const historyIndex = pathParts.indexOf("history");
        return historyIndex >= 0 ? pathParts[historyIndex + 1] || "competition" : "competition";
    }, [location.pathname]);

    const historyViewMeta = useMemo(() => {
        const normalizedStudentId = studentId ? String(studentId) : "";
        const myIds = [
            myProfile?.studentId,
            myProfile?.id,
            myProfile?.userId,
            myProfile?.student?.id,
        ]
            .filter((value) => value !== undefined && value !== null && value !== "")
            .map((value) => String(value));

        const isOwnHistory = !normalizedStudentId || myIds.includes(normalizedStudentId);
        const displayName = viewedProfile?.fullName || viewedProfile?.fullname || viewedProfile?.name || "";

        const title = isOwnHistory
            ? "Lịch sử"
            : displayName
                ? `Lịch sử của ${displayName}`
                : `Lịch sử của học sinh ${normalizedStudentId}`;

        return {
            isOwnHistory,
            isOtherStudentHistory: !isOwnHistory,
            title,
        };
    }, [myProfile, studentId, viewedProfile]);

    return (
        <AuthenticatedLayout>
            <main className="flex-1 bg-[#F7F8FA] overflow-y-auto custom-scrollbar">
                <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                        <section className="flex min-w-0 flex-col gap-4">
                            <div className="text-2xl font-semibold text-gray-600">
                                <p>{historyViewMeta.title}</p>
                            </div>

                            <Card className="flex-1 space-y-4 ">
                                <div className="flex flex-wrap items-center gap-2">
                                    {tabs.map((tab) => (
                                        <NavLink
                                            key={`${tab.to}-${studentId || "me"}`}
                                            to={studentId ? `${tab.to}?studentId=${encodeURIComponent(studentId)}` : tab.to}
                                            className={({ isActive }) =>
                                                `cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isActive
                                                    ? "bg-[#F7F7F8] text-gray-900"
                                                    : "text-gray-600 hover:bg-gray-50"
                                                }`
                                            }
                                            end
                                        >
                                            {tab.label}
                                        </NavLink>
                                    ))}
                                </div>
                                <Outlet context={{ isOtherStudentHistory: historyViewMeta.isOtherStudentHistory }} />
                            </Card>
                        </section>

                        <aside className="lg:sticky lg:top-6 lg:self-start">
                            {currentHistoryRoute === "question" ? (
                                <QuestionHistoryStatsSidebar
                                    questionHistory={questionHistory}
                                    questionStatistics={questionHistoryStatistics}
                                    onOpenChapterModal={() => setIsChapterModalOpen(true)}
                                />
                            ) : null}

                            {currentHistoryRoute === "exam" ? (
                                <ExamHistoryStatsSidebar
                                    examHistory={examHistory}
                                />
                            ) : null}

                            {(currentHistoryRoute === "competition" || (currentHistoryRoute !== "question" && currentHistoryRoute !== "exam")) ? (
                                <CompetitionHistoryStatsSidebar
                                    submittedHistory={submittedHistory}
                                />
                            ) : null}
                        </aside>
                    </div>
                </div>
            </main>

            <QuestionChapterBubbleClusterModal
                isOpen={isChapterModalOpen}
                onClose={() => setIsChapterModalOpen(false)}
                byChapter={byChapter}
            />
        </AuthenticatedLayout>
    );
};

export default memo(HistoryLayout);
