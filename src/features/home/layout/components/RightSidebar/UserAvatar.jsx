import { memo, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, ChevronDown, LogOut, Wallet, UserCircle } from "lucide-react";
import { logoutAsync } from "../../../../auth/store/authSlice";
import { ROUTES } from "../../../../../core/constants/routes";

/**
 * UserAvatar Component
 * Hiển thị avatar của user với dropdown menu
 * - Thông tin người dùng
 * - Học phí
 * - Đăng xuất
 */
const UserAvatar = memo(({ avatarUrl, fullName, email }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const handleNavigate = useCallback(
        (path) => {
            setIsOpen(false);
            navigate(path);
        },
        [navigate]
    );

    const handleLogout = useCallback(async () => {
        setIsOpen(false);
        try {
            await dispatch(logoutAsync()).unwrap();
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [dispatch, navigate]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={handleToggle}
                className="relative inline-flex cursor-pointer group focus:outline-none"
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-[60px] h-[60px] object-cover rounded-full ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-200"
                    />
                ) : (
                    <div className="rounded-full p-2 w-[60px] h-[60px] bg-blue-100 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-200">
                        <User className="text-blue-800 w-full h-full" />
                    </div>
                )}

                <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-white p-[2px] rounded-full">
                    <div
                        className={`w-full h-full bg-blue-100 flex items-center justify-center rounded-full overflow-hidden transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                    >
                        <ChevronDown size={16} className="text-blue-800" />
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={fullName}
                                    className="w-10 h-10 object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-blue-800" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {fullName || "Người dùng"}
                                </p>
                                {email && (
                                    <p className="text-xs text-gray-500 truncate">
                                        {email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <button
                            onClick={() => handleNavigate(ROUTES.PROFILE)}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group/item"
                        >
                            <UserCircle
                                size={20}
                                className="text-gray-400 group-hover/item:text-blue-500 transition-colors"
                            />
                            <span className="text-sm text-gray-700 group-hover/item:text-gray-900 transition-colors">
                                Thông tin cá nhân
                            </span>
                        </button>

                        <button
                            onClick={() => handleNavigate(ROUTES.PAYMENT)}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group/item"
                        >
                            <Wallet
                                size={20}
                                className="text-gray-400 group-hover/item:text-blue-500 transition-colors"
                            />
                            <span className="text-sm text-gray-700 group-hover/item:text-gray-900 transition-colors">
                                Học phí
                            </span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1" />

                    {/* Logout */}
                    <div className="py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left group/item"
                        >
                            <LogOut
                                size={20}
                                className="text-gray-400 group-hover/item:text-red-500 transition-colors"
                            />
                            <span className="text-sm text-gray-700 group-hover/item:text-red-500 transition-colors">
                                Đăng xuất
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
