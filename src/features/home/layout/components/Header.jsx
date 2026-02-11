import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAsync } from "../../../auth/store/authSlice";
import { User, LogOut, ChevronDown } from "lucide-react";

export const Header = ({ title = "Hệ thống quản lý học tập" }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Get user info from profile state
    const profile = useSelector((state) => state.profile?.profile);
    const userName = profile?.name || "Người dùng";
    const userAvatar = profile?.avatar;

    const handleLogout = async () => {
        try {
            await dispatch(logoutAsync()).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="
            bg-white
            shadow-sm
            px-6
            py-4
            flex
            justify-between
            items-center
            sticky top-0 z-10
        ">
            {/* Page Title */}
            <h1 className="text-h4 sm:text-h3 text-gray-900 font-semibold">
                {title}
            </h1>

            {/* User Menu */}
            <div className="relative">
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="
                        flex items-center gap-2
                        px-3 py-2
                        hover:bg-gray-100
                        rounded-lg
                        transition-colors
                    "
                >
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={20} className="text-blue-800" />
                        )}
                    </div>

                    {/* User Name - Hidden on mobile */}
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-text-5 text-gray-700">
                            Xin chào 👋
                        </span>
                        <span className="text-text-4 text-gray-900 font-semibold">
                            {userName}
                        </span>
                    </div>

                    {/* Dropdown Arrow */}
                    <ChevronDown
                        size={16}
                        className={`text-gray-700 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowUserMenu(false)}
                        />

                        {/* Menu */}
                        <div className="
                            absolute right-0 mt-2
                            w-48
                            bg-white
                            rounded-lg
                            shadow-lg
                            border border-gray-200
                            py-2
                            z-20
                        ">
                            <button
                                onClick={() => {
                                    setShowUserMenu(false);
                                    navigate('/profile');
                                }}
                                className="
                                    w-full px-4 py-2
                                    flex items-center gap-3
                                    hover:bg-gray-100
                                    transition-colors
                                    text-left
                                "
                            >
                                <User size={20} className="text-gray-700" />
                                <span className="text-text-4 text-gray-900">
                                    Hồ sơ của tôi
                                </span>
                            </button>

                            <div className="border-t border-gray-200 my-2" />

                            <button
                                onClick={() => {
                                    setShowUserMenu(false);
                                    handleLogout();
                                }}
                                className="
                                    w-full px-4 py-2
                                    flex items-center gap-3
                                    hover:bg-red-50
                                    transition-colors
                                    text-left
                                "
                            >
                                <LogOut size={20} className="text-red-500" />
                                <span className="text-text-4 text-red-500">
                                    Đăng xuất
                                </span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
