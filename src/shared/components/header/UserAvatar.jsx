import { memo, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User } from "lucide-react";
import { logoutAsync } from "../../../features/auth/store/authSlice";
import { ROUTES } from "../../../core/constants/routes";
import UserAvatarDropdown from "./UserAvatarDropdown";

/**
 * UserAvatar Component
 * Hiển thị avatar của user với dropdown menu
 * - Thông tin người dùng
 * - Học phí
 * - Đăng xuất
 */
const UserAvatar = memo(({ avatarUrl, fullName, email, compact = false }) => {
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
        <div className="relative flex items-center justify-center" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={handleToggle}
                className="inline-flex cursor-pointer group focus:outline-none"
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={fullName}
                        className={`object-cover rounded-full ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-200 ${
                            compact ? 'h-9 w-9' : 'h-8 w-8'
                        }`}
                    />
                ) : (
                    <div className={`rounded-full bg-blue-100 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-200 ${
                        compact ? 'h-9 w-9 p-1.5' : 'h-6 w-6 p-1.5 lg:p-2'
                    }`}>
                        <User className="text-blue-800 w-full h-full" />
                    </div>
                )}
            </button>

            {isOpen && (
                <UserAvatarDropdown
                    avatarUrl={avatarUrl}
                    fullName={fullName}
                    email={email}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
});

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
