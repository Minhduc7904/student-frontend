import { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
import { Card } from "../../../shared/components";
import {
    getActivityYearStatsAsync,
    selectActivityYearStats,
    selectMyProfile,
    selectProfile,
    selectPublicStudentExamAttempts,
    selectPublicStudentQuestionAnswers,
    selectPublicStudentSubmittedHistory,
} from "../../profile/store/profileSlice";

const tabs = [
    { label: "Lịch sử cuộc thi", to: ROUTES.HISTORY_COMPETITION },
    { label: "Lịch sử câu hỏi", to: ROUTES.HISTORY_QUESTION },
    { label: "Lịch sử đề mẫu", to: ROUTES.HISTORY_EXAM },
];

const normalizeHistoryItems = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.history)) return data.history;
    if (Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const HistoryLayout = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get("studentId") || undefined;
    const activityStats = useSelector(selectActivityYearStats);
    const myProfile = useSelector(selectMyProfile);
    const viewedProfile = useSelector(selectProfile);
    const submittedHistory = useSelector(selectPublicStudentSubmittedHistory);
    const questionHistory = useSelector(selectPublicStudentQuestionAnswers);
    const examHistory = useSelector(selectPublicStudentExamAttempts);

    useEffect(() => {
        dispatch(
            getActivityYearStatsAsync({
                year: new Date().getFullYear(),
                studentId,
            })
        );
    }, [dispatch, studentId]);

    const stats = useMemo(() => {
        const competitionCount = normalizeHistoryItems(submittedHistory).length;
        const questionCount = normalizeHistoryItems(questionHistory).length;
        const examCount = normalizeHistoryItems(examHistory).length;

        return {
            competitionCount,
            questionCount,
            examCount,
            totalLoaded: competitionCount + questionCount + examCount,
            totalActivities: activityStats?.totalActivities || 0,
            totalActiveDays: activityStats?.totalActiveDays || 0,
            maxStreak: activityStats?.maxStreak || 0,
        };
    }, [activityStats, examHistory, questionHistory, submittedHistory]);

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
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-800">Thống kê</h2>
                                <div className="mt-4 space-y-3">
                                    <div className="rounded-lg bg-[#F7F7F8] p-3">
                                        <p className="text-xs text-gray-500">Tổng hoạt động trong năm</p>
                                        <p className="mt-1 text-xl font-semibold text-gray-900">{stats.totalActivities}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-[#F7F7F8] p-3">
                                            <p className="text-xs text-gray-500">Ngày hoạt động</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{stats.totalActiveDays}</p>
                                        </div>
                                        <div className="rounded-lg bg-[#F7F7F8] p-3">
                                            <p className="text-xs text-gray-500">Chuỗi dài nhất</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{stats.maxStreak}</p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-[#F7F7F8] p-3">
                                        <p className="text-xs text-gray-500">Bản ghi đã tải</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{stats.totalLoaded}</p>
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                                            <span className="rounded bg-white px-2 py-1 text-center">Thi: {stats.competitionCount}</span>
                                            <span className="rounded bg-white px-2 py-1 text-center">Hỏi: {stats.questionCount}</span>
                                            <span className="rounded bg-white px-2 py-1 text-center">Đề: {stats.examCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </aside>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
};

export default memo(HistoryLayout);
