import { useCallback, useState, Suspense, memo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, SearchHeader } from "../../home/layout/components";
import AddCourseModal from "../../home/layout/components/AddCourseModal";
import PracticeRightSidebar from "../component/RightSidebar";
import { getItem, setItem } from "../../../shared/utils/storage";
import { STORAGE_KEYS } from "../../../core/constants/storageKeys";
import { ContentLoading } from "../../../shared/components/loading";
import { Menu, X } from "lucide-react";

/**
 * PracticeLayout
 * Layout riêng cho Practice, giữ hành vi giống HomeLayout
 * nhưng sử dụng RightSidebar custom của module Practice.
 */
const PracticeLayout = () => {
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
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Toggle sidebar (stable reference)
    const handleToggleSidebar = useCallback(() => {
        setIsSidebarCollapsed((prev) => {
            const newValue = !prev;
            setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, newValue);
            return newValue;
        });
    }, []);

    // Toggle mobile menu
    const handleToggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen((prev) => !prev);
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
            {/* Mobile Menu Button - Hiển thị trên mobile */}
            <button
                onClick={handleToggleMobileMenu}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <X size={24} className="text-gray-900" />
                ) : (
                    <Menu size={24} className="text-gray-900" />
                )}
            </button>

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
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
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
                {/* Right Sidebar - custom cho Practice */}
                <div className="order-first lg:order-last">
                    <PracticeRightSidebar />
                </div>

                {/* Page content */}
                <main className="flex-1 px-4 xl:px-6 2xl:px-15 pt-10 lg:overflow-y-auto custom-scrollbar">
                    <SearchHeader onAddCourse={handleAddCourse} />
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

export default memo(PracticeLayout);
