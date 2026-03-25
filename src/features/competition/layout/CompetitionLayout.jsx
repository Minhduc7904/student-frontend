import { useCallback, useState, Suspense, memo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sidebar, SearchHeader } from "../../home/layout/components";
import AddCourseModal from "../../home/layout/components/AddCourseModal";
import CompetitionRightSidebar from "../component/RightSidebar";
import RightSidebarHeader from "../../home/layout/components/RightSidebar/RightSidebarHeader";
import { getItem, setItem } from "../../../shared/utils/storage";
import { STORAGE_KEYS } from "../../../core/constants/storageKeys";
import { selectProfile } from "../../profile/store/profileSlice";
import { ContentLoading } from "../../../shared/components/loading";
import { Logo } from "../../../shared/components";
import { Menu, X } from "lucide-react";
import BackgroundCompetition from "../../../assets/images/BackgroundCompetition.png";
/**
 * CompetitionLayout
 * Layout riêng cho Competition, giữ hành vi giống PracticeLayout.
 */
const CompetitionLayout = () => {
    const profile = useSelector(selectProfile);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
        return saved ?? false;
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 768 && width < 1024 && !isSidebarCollapsed) {
                setIsSidebarCollapsed(true);
                setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToggleSidebar = useCallback(() => {
        setIsSidebarCollapsed((prev) => {
            const newValue = !prev;
            setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, newValue);
            return newValue;
        });
    }, []);

    const handleToggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen((prev) => !prev);
    }, []);

    const handleAddCourse = useCallback(() => {
        setIsAddCourseModalOpen(true);
    }, []);

    const handleCloseAddCourseModal = useCallback(() => {
        setIsAddCourseModalOpen(false);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    return (
        <div className="h-dvh flex bg-gray-50 overflow-hidden">
            <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/95 px-3 py-1.5 backdrop-blur md:hidden">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleToggleMobileMenu}
                        className="rounded-lg p-1.5"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X size={20} className="text-gray-900" />
                        ) : (
                            <Menu size={20} className="text-gray-900" />
                        )}
                    </button>
                    <Logo mode="default" className="h-7 w-auto object-contain" containerClassName="flex items-center" />
                </div>

                <RightSidebarHeader profile={profile} compact />
            </header>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-gray-100 opacity-50 z-40"
                    onClick={handleToggleMobileMenu}
                />
            )}

            <div
                className={`
                fixed md:relative
                h-dvh z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}
            >
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={handleToggleSidebar}
                />
            </div>

            <div className="relative flex-1 flex flex-col lg:flex-row h-full overflow-y-auto overflow-x-hidden lg:overflow-hidden custom-scrollbar">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <img
                        src={BackgroundCompetition}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="pointer-events-none absolute inset-0 z-1 bg-slate-900/5" />

                <main className="relative z-10 flex-1 flex items-center flex-col px-4 xl:px-6 2xl:px-15 pt-14.5 md:pt-4 lg:pt-10 lg:overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="w-full flex flex-col lg:flex-row lg:gap-19 gap-10">
                        <div className="hidden md:block flex-1">
                            <SearchHeader onAddCourse={handleAddCourse} />
                        </div>
                        <div className="order-first hidden md:block lg:order-last">
                            <CompetitionRightSidebar />
                        </div>
                    </div>

                    <div className="w-full max-w-7xl flex items-center justify-center mb-6">
                        <Suspense fallback={<ContentLoading />}>
                            <Outlet />
                        </Suspense>
                    </div>

                    <footer className="mt-auto w-auto self-stretch -mx-4 xl:-mx-6 2xl:-mx-15 border-t border-slate-300 bg-white py-4 text-center text-sm text-slate-600">
                        Developed by{' '}
                        <a
                            href="https://www.facebook.com/nm.duc7904"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sky-700 underline underline-offset-4 transition-colors hover:text-sky-600"
                        >
                            Nguyễn Minh Đức
                        </a>
                    </footer>
                </main>
            </div>

            <AddCourseModal
                isOpen={isAddCourseModalOpen}
                onClose={handleCloseAddCourseModal}
            />
        </div>
    );
};

export default memo(CompetitionLayout);
