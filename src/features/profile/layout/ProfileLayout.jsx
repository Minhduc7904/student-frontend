import { Suspense, memo, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Settings, User } from "lucide-react";
import {
    getMyProfileAsync,
    getProfileAsync,
    selectEditInfoTab,
    selectMyProfile,
    selectProfile,
    selectSettingTab,
    selectMyProfileLoading,
    setEditInfoTab,
    setSettingTab,
    selectStudentProfileLoading,
} from "../store/profileSlice";
import { ROUTES } from "../../../core/constants";
import { ContentLoading } from "../../../shared/components/loading";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
import ProfilePageSkeleton from "../components/ProfilePageSkeleton";
import ProfileInfoCard from "../components/ProfileInfoCard";

const ProfileDisplayAvatar = memo(({ avatarUrl, fullName }) => {
    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={fullName || "Avatar"}
                className="h-20 w-20 rounded-lg object-cover"
            />
        );
    }

    return (
        <div className="h-20 w-20 rounded-lg bg-blue-100 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-800" />
        </div>
    );
});
ProfileDisplayAvatar.displayName = "ProfileDisplayAvatar";

/**
 * ProfileLayout
 * Layout riêng cho trang Profile:
 * - Header với logo + nút quay lại
 * - Nền sáng, không có sidebar
 * - Content area scrollable giữa màn hình
 */
const ProfileLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { id: studentId } = useParams();
    const myProfile = useSelector(selectMyProfile);
    const profile = useSelector(selectProfile);
    const editInfoTab = useSelector(selectEditInfoTab);
    const settingTab = useSelector(selectSettingTab);
    const myProfileLoading = useSelector(selectMyProfileLoading);
    const studentProfileLoading = useSelector(selectStudentProfileLoading);
    const requestedTargetRef = useRef(null);
    const isStudentProfileRoute = Boolean(studentId);
    const isViewingOtherProfile = isStudentProfileRoute;
    const isProfileEditInfoRoute =
        pathname === ROUTES.PROFILE_EDIT_INFO || pathname.endsWith(ROUTES.PROFILE_EDIT_INFO);
    const isProfileSettingRoute =
        pathname === ROUTES.PROFILE_SETTING || pathname.endsWith(ROUTES.PROFILE_SETTING);
    const isProfileLoading = isStudentProfileRoute ? studentProfileLoading : myProfileLoading;
    const viewedProfile = isStudentProfileRoute ? profile : myProfile;
    const shouldHidePersonalInfoCard = isProfileEditInfoRoute || isProfileSettingRoute;

    const editInfoTabs = [
        { key: "basic", label: "Cơ bản" },
        { key: "personal", label: "Cá nhân" },
        { key: "contact", label: "Liên hệ" },
        { key: "study", label: "Học tập" },
    ];

    const settingTabs = [
        { key: "password", label: "Mật khẩu" },
        { key: "notification", label: "Thông báo" },
    ];

    useEffect(() => {
        if (!studentId || !myProfile) return;

        const myProfileIds = [
            myProfile?.studentId,
            myProfile?.id,
            myProfile?.userId,
            myProfile?.student?.id,
        ]
            .filter((value) => value !== undefined && value !== null && value !== "")
            .map((value) => String(value));

        if (myProfileIds.includes(String(studentId))) {
            navigate(ROUTES.PROFILE, { replace: true });
        }
    }, [myProfile, navigate, studentId]);

    // Fetch profile nếu chưa có
    useEffect(() => {
        const targetProfileId = studentId ? String(studentId) : "me";

        const currentProfileIds = [
            profile?.studentId,
            profile?.id,
            profile?.userId,
            profile?.student?.id,
        ]
            .filter((value) => value !== undefined && value !== null && value !== "")
            .map((value) => String(value));

        const hasExpectedProfile =
            targetProfileId === "me"
                ? Boolean(myProfile)
                : currentProfileIds.includes(targetProfileId);

        if (hasExpectedProfile || isProfileLoading || requestedTargetRef.current === targetProfileId) {
            return;
        }

        requestedTargetRef.current = targetProfileId;

        const loadAction = studentId
            ? getProfileAsync({ studentId })
            : getMyProfileAsync();

        dispatch(loadAction)
            .unwrap()
            .catch(() => {
                requestedTargetRef.current = null;
            });
    }, [dispatch, isProfileLoading, myProfile, profile, studentId]);

    return (
        <AuthenticatedLayout>
            <main className="flex-1 bg-[#F7F8FA] overflow-y-auto custom-scrollbar">
                {isProfileLoading ? (
                    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
                        <ProfilePageSkeleton />
                    </div>
                ) : (
                    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                            <div className="flex w-full flex-col px-4 lg:sticky lg:top-6 lg:w-75 lg:min-w-75 lg:flex-none lg:self-start lg:px-0">
                                <div className="flex flex-col gap-4">
                                    <div className="flex space-x-4">
                                        <ProfileDisplayAvatar avatarUrl={viewedProfile?.avatarUrl} fullName={viewedProfile?.fullName} />
                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <p className="text-subhead-4 text-gray-900">{viewedProfile?.fullName || "Người dùng"}</p>
                                                <p className="text-text-5 text-gray-500">{viewedProfile?.username}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Xếp hạng:</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-text-5 text-gray-900">
                                            <span className="font-bold">0</span> Người theo dõi - <span className="font-bold">0</span> Đang theo dõi
                                        </p>
                                    </div>
                                    {!isViewingOtherProfile ? (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => navigate(ROUTES.PROFILE_EDIT_INFO)}
                                                className="
                                                    rounded h-9 w-full cursor-pointer
                                                    text-[rgb(45,181,93)] text-subhead-5
                                                    bg-[rgba(45,181,93,0.08)]

                                                    transition-all duration-200

                                                    hover:bg-[rgba(45,181,93,0.16)]
                                                    hover:text-[rgb(36,150,77)]

                                                    active:scale-[0.98]
                                                "
                                            >
                                                Chỉnh sửa hồ sơ
                                            </button>
                                            <button
                                                onClick={() => navigate(ROUTES.PROFILE_SETTING)}
                                                className="
                                                    rounded h-9 w-full cursor-pointer
                                                    inline-flex items-center justify-center gap-1.5
                                                    text-gray-700 text-subhead-5
                                                    bg-white border border-gray-200

                                                    transition-all duration-200

                                                    hover:bg-gray-50
                                                    hover:border-gray-300

                                                    active:scale-[0.98]
                                                "
                                            >
                                                <Settings size={15} />
                                                Cài đặt
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <>
                                    <div className="mb-4 mt-2.5 h-px w-full border-b border-gray-100" />
                                    {!shouldHidePersonalInfoCard ? (
                                        <div className="flex flex-col gap-4">
                                            <ProfileInfoCard profile={viewedProfile} />
                                        </div>
                                    ) : null}
                                    {isProfileEditInfoRoute ? (
                                        <div className="flex flex-col gap-2">
                                            {editInfoTabs.map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    type="button"
                                                    onClick={() => dispatch(setEditInfoTab(tab.key))}
                                                    className={`cursor-pointer rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                                                        editInfoTab === tab.key
                                                            ? "bg-[rgba(45,181,93,0.12)] text-[rgb(36,150,77)]"
                                                            : "bg-[#F7F7F8] text-gray-600 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                    {isProfileSettingRoute ? (
                                        <div className="flex flex-col gap-2">
                                            {settingTabs.map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    type="button"
                                                    onClick={() => dispatch(setSettingTab(tab.key))}
                                                    className={`cursor-pointer rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                                                        settingTab === tab.key
                                                            ? "bg-[rgba(45,181,93,0.12)] text-[rgb(36,150,77)]"
                                                            : "bg-[#F7F7F8] text-gray-600 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                    <div className="mb-4 mt-2.5 h-px w-full border-b border-gray-100" />
                                </>
                            </div>

                            <div className="flex-1">
                                <Suspense fallback={<ContentLoading />}>
                                    <Outlet context={{ profile: viewedProfile, loading: isProfileLoading, studentId }} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </AuthenticatedLayout>
    );
};

export default memo(ProfileLayout);
