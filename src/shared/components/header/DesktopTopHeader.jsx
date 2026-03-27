import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "../logo";
import { ROUTES } from "../../../core/constants";
import RightHeader from "./RightHeader";
import SearchHeader from "./SearchHeader";
/**
 * DesktopTopHeader
 * Header desktop/tablet chứa khu vực search và thông tin user.
 */
const DesktopTopHeader = memo(({ profile, onAddCourse, isMobileMenuOpen = false, onToggleMobileMenu = () => { } }) => {
    const location = useLocation();

    const navItems = [
        { label: "Tổng quan", path: ROUTES.DASHBOARD },
        { label: "Khóa học", path: ROUTES.COURSE_ENROLLMENTS },
        { label: "Cuộc thi", path: ROUTES.COMPETITION },
    ];

    const isActive = (path) => {
        if (location.pathname === path) {
            return true;
        }
        return location.pathname.startsWith(`${path}/`);
    };

    return (
        <>
            <div className="md:hidden w-full border-b border-gray-200 bg-white">
                <div className="mx-auto w-full max-w-300 px-3 py-1.5">
                    <div className="flex h-9 items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onToggleMobileMenu}
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

                        <RightHeader profile={profile} compact />
                    </div>
                </div>
            </div>

            <div className="hidden md:block w-full border-b border-gray-200 bg-white">
                <div className="mx-auto w-full max-w-300 px-4 py-2.5 xl:py-0">
                    <div className="grid grid-cols-1 gap-2 xl:h-12.5 xl:grid-cols-[auto_1fr_auto] xl:items-center xl:gap-8">
                        <div className="flex items-center justify-between xl:justify-start">
                            <Logo mode="default" className="h-7 w-auto object-contain" containerClassName="flex items-center" />

                            <div className="xl:hidden">
                                <RightHeader profile={profile} compact />
                            </div>
                        </div>

                        <nav className="flex items-center gap-6 overflow-x-auto border-b border-gray-100 pb-2 xl:h-full xl:border-b-0 xl:pb-0">
                            {navItems.map((item) => {
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`inline-flex h-9 shrink-0 items-center border-b-2 text-sm font-semibold transition-colors xl:h-full ${active
                                            ? "border-blue-800 text-blue-800"
                                            : "border-transparent text-gray-500 hover:border-blue-200 hover:text-blue-800"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center justify-between gap-3 xl:justify-end">
                            <div className="min-w-0 flex-1 xl:w-auto xl:flex-none">
                                <SearchHeader onAddCourse={onAddCourse} />
                            </div>

                            <div className="hidden xl:block">
                                <RightHeader profile={profile} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

DesktopTopHeader.displayName = "DesktopTopHeader";

export default DesktopTopHeader;
