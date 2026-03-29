import { memo, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Lock, Menu, X } from "lucide-react";
import { Logo } from "../logo";
import { ROUTES } from "../../../core/constants";
import DeMauImage from "../../../assets/images/DeMau.png";
import LuyenDeImage from "../../../assets/images/LuyenDe.png";
import RightHeader from "./RightHeader";
import SearchHeader from "./SearchHeader";
/**
 * DesktopTopHeader
 * Header desktop/tablet chứa khu vực search và thông tin user.
 */
const DesktopTopHeader = memo(({ profile, onAddCourse, isMobileMenuOpen = false, onToggleMobileMenu = () => { } }) => {
    const location = useLocation();
    const [isPracticeMenuOpen, setIsPracticeMenuOpen] = useState(false);
    const [isPracticeMenuPinned, setIsPracticeMenuPinned] = useState(false);
    const practiceMenuRef = useRef(null);

    const navItems = [
        { label: "Tổng quan", path: ROUTES.DASHBOARD },
        { label: "Khóa học", path: ROUTES.COURSE_ENROLLMENTS },
        { label: "Cuộc thi", path: ROUTES.COMPETITION },
    ];

    const practiceItems = [
        { label: "Đề mẫu", path: ROUTES.EXAMS, image: DeMauImage },
        { label: "Phòng luyện đề", path: ROUTES.PRACTICE, image: LuyenDeImage, locked: true },
    ];

    const isActive = (path) => {
        if (location.pathname === path) {
            return true;
        }
        return location.pathname.startsWith(`${path}/`);
    };

    const isPracticeActive = practiceItems.some((item) => isActive(item.path));

    const handlePracticeMouseEnter = () => {
        if (!isPracticeMenuPinned) {
            setIsPracticeMenuOpen(true);
        }
    };

    const handlePracticeMouseLeave = () => {
        if (!isPracticeMenuPinned) {
            setIsPracticeMenuOpen(false);
        }
    };

    const handlePracticeTriggerClick = () => {
        setIsPracticeMenuPinned((prevPinned) => {
            const nextPinned = !prevPinned;
            setIsPracticeMenuOpen(nextPinned);
            return nextPinned;
        });
    };

    const handlePracticeItemClick = () => {
        setIsPracticeMenuPinned(false);
        setIsPracticeMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!practiceMenuRef.current?.contains(event.target)) {
                setIsPracticeMenuPinned(false);
                setIsPracticeMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

            <div className="hidden md:block w-full border-b border-gray-200 bg-white relative z-40">
                <div className="mx-auto w-full max-w-300 px-4 py-2.5 xl:py-0">
                    <div className="grid grid-cols-1 gap-2 xl:h-12.5 xl:grid-cols-[auto_1fr_auto] xl:items-center xl:gap-8">
                        <div className="flex items-center justify-between xl:justify-start">
                            <Logo mode="default" className="h-7 w-auto object-contain" containerClassName="flex items-center" />

                            <div className="xl:hidden">
                                <RightHeader profile={profile} compact />
                            </div>
                        </div>

                        <nav className="flex items-center gap-6 overflow-visible border-b border-gray-100 pb-2 xl:h-full xl:border-b-0 xl:pb-0">
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

                            <div
                                ref={practiceMenuRef}
                                className="relative h-9 shrink-0 xl:h-full"
                                onMouseEnter={handlePracticeMouseEnter}
                                onMouseLeave={handlePracticeMouseLeave}
                            >
                                <button
                                    type="button"
                                    onClick={handlePracticeTriggerClick}
                                    className={`inline-flex h-9 cursor-pointer items-center gap-1 border-b-2 text-sm font-semibold transition-colors xl:h-full ${isPracticeActive
                                        ? "border-blue-800 text-blue-800"
                                        : "border-transparent text-gray-500 hover:border-blue-200 hover:text-blue-800"
                                        }`}
                                    aria-haspopup="menu"
                                    aria-expanded={isPracticeMenuOpen}
                                >
                                    Luyện tập
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${isPracticeMenuOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isPracticeMenuOpen ? (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-full w-45 rounded-lg border border-gray-200 bg-white p-1 shadow-lg z-50"
                                    >
                                        {practiceItems.map((item) => {
                                            const active = isActive(item.path);

                                            if (item.locked) {
                                                return (
                                                    <div
                                                        key={item.path}
                                                        className="relative flex w-full cursor-not-allowed items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-500"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.label}
                                                            className="h-7 w-7 shrink-0 rounded object-cover blur-[1px]"
                                                            loading="lazy"
                                                        />
                                                        <span className="blur-[0.7px]">{item.label}</span>
                                                        <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
                                                            <Lock size={11} />
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={handlePracticeItemClick}
                                                    role="menuitem"
                                                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${active
                                                        ? "bg-blue-50 text-blue-800 font-semibold"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={item.label}
                                                        className="h-7 w-7 shrink-0 rounded object-cover"
                                                        loading="lazy"
                                                    />
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
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
