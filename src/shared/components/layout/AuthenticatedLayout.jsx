import { useCallback, useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import AddCourseModal from "../../../features/home/layout/components/AddCourseModal";
import { Sidebar } from "../../../features/home/layout/components";
import { DesktopTopHeader } from "../header";
import { getItem, setItem } from "../../utils/storage";
import { STORAGE_KEYS } from "../../../core/constants/storageKeys";
import { selectMyProfile } from "../../../features/profile/store/profileSlice";

/**
 * AuthenticatedLayout
 * Shell chung cho các trang sau đăng nhập: top header, mobile drawer sidebar và add course modal.
 */
const AuthenticatedLayout = memo(({ children }) => {
    const myProfile = useSelector(selectMyProfile);

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
    }, [isSidebarCollapsed]);

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
            <div className="w-full flex flex-col bg-white overflow-y-auto">
                <DesktopTopHeader
                    profile={myProfile}
                    onAddCourse={handleAddCourse}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onToggleMobileMenu={handleToggleMobileMenu}
                />
                {children}
            </div>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-gray-100 opacity-50 z-40"
                    onClick={handleToggleMobileMenu}
                />
            )}

            <div
                className={`
                fixed md:hidden
                h-dvh z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            >
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={handleToggleSidebar}
                />
            </div>

            <AddCourseModal
                isOpen={isAddCourseModalOpen}
                onClose={handleCloseAddCourseModal}
            />
        </div>
    );
});

AuthenticatedLayout.displayName = "AuthenticatedLayout";

export default AuthenticatedLayout;
