import { Suspense, memo, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import {
    getProfileAsync,
    selectProfile,
    selectProfileLoading,
} from "../store/profileSlice";
import { ContentLoading } from "../../../shared/components/loading";
import { Logo } from "../../../shared/components/logo/Logo";
import { ROUTES } from "../../../core/constants";

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
    const profile = useSelector(selectProfile);
    const loading = useSelector(selectProfileLoading);

    // Fetch profile nếu chưa có
    useEffect(() => {
        if (!profile) {
            dispatch(getProfileAsync());
        }
    }, [dispatch, profile]);

    return (
        <div className="h-dvh flex flex-col bg-gray-50 overflow-hidden">
            {/* Top Bar */}
            <header className="shrink-0 bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between">
                {/* Left: Logo + Title */}
                <div className="flex items-center gap-4">
                    <Logo
                        className="h-9 md:h-10 w-auto object-contain"
                        containerClassName="flex items-center shrink-0 cursor-pointer"
                        alt="Logo"
                    />
                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                    <h1 className="text-h4 text-gray-900 hidden sm:block">Thông tin cá nhân</h1>
                </div>

                {/* Right: Back button */}
                <button
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-text-4 text-gray-700 hover:bg-gray-100 hover:text-blue-800 transition-colors group cursor-pointer"
                    aria-label="Quay lại"
                >
                    <ArrowLeft
                        size={18}
                        className="group-hover:-translate-x-0.5 transition-transform"
                    />
                    <span className="hidden sm:inline">Quay lại</span>
                </button>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                {loading && !profile ? (
                    <ContentLoading message="Đang tải thông tin..." height="h-96" />
                ) : (
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
                        <Suspense fallback={<ContentLoading />}>
                            <Outlet context={{ profile, loading }} />
                        </Suspense>
                    </div>
                )}
            </main>
        </div>
    );
};

export default memo(ProfileLayout);
