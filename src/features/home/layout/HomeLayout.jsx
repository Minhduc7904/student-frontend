import { useCallback, useState, Suspense, memo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, RightSidebar, SearchHeader } from "./components";
import { useSelector } from "react-redux";
import AddCourseModal from "./components/AddCourseModal";
import RightSidebarHeader from "./components/RightSidebar/RightSidebarHeader";
import { getItem, setItem } from "../../../shared/utils/storage";
import { STORAGE_KEYS } from "../../../core/constants/storageKeys";
import { selectProfile } from "../../profile/store/profileSlice";
import { ContentLoading } from "../../../shared/components/loading";
import { Logo } from "../../../shared/components";
import { Menu, X } from "lucide-react";

/**
 * Home Layout
 * - Sidebar cố định
 * - Header cố định
 * - Content scroll độc lập
 */
const HomeLayout = () => {
    const profile = useSelector(selectProfile);
    // Load trạng thái sidebar từ localStorage
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
        return saved ?? false;
    });

    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Add course modal state
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

    // Auto collapse sidebar on tablet
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            // Auto collapse on tablet (768px - 1024px)
            if (width >= 768 && width < 1024 && !isSidebarCollapsed) {
                setIsSidebarCollapsed(true);
                setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Toggle sidebar (stable reference)
    const handleToggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(prev => {
            const newValue = !prev;
            setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, newValue);
            return newValue;
        });
    }, []);

    // Toggle mobile menu
    const handleToggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    // Handle add course
    const handleAddCourse = useCallback(() => {
        setIsAddCourseModalOpen(true);
    }, []);

    const handleCloseAddCourseModal = useCallback(() => {
        setIsAddCourseModalOpen(false);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
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

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-gray-100 opacity-50 z-40"
                    onClick={handleToggleMobileMenu}
                />
            )}

            {/* Sidebar - Desktop: hiển thị, Tablet: collapse, Mobile: drawer */}
            <div
                className={`
                fixed md:relative
                h-dvh z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}
            >
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={handleToggleSidebar}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row h-full bg-white overflow-y-auto lg:overflow-hidden custom-scrollbar">
                {/* Right Sidebar - Hiển thị trên cùng trên mobile, bên phải trên desktop */}
                <div className="order-first hidden md:block lg:order-last">
                    <RightSidebar />
                </div>

                {/* Page content */}
                <main className="flex-1 px-4 xl:px-6 2xl:px-15 pt-14.5 md:pt-10 lg:overflow-y-auto custom-scrollbar">
                    <div className="hidden md:block">
                        <SearchHeader onAddCourse={handleAddCourse} />
                    </div>
                    <Suspense fallback={<ContentLoading />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>

            {/* Add Course Modal */}
            <AddCourseModal
                isOpen={isAddCourseModalOpen}
                onClose={handleCloseAddCourseModal}
            />
        </div>
    );
};

export default memo(HomeLayout);
