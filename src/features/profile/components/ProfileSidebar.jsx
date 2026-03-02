import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Shield, LogOut } from "lucide-react";
import { logoutAsync } from "../../auth/store/authSlice";
import { ROUTES } from "../../../core/constants";

/**
 * Tabs configuration
 */
export const PROFILE_TABS = {
    INFO: "info",
    SECURITY: "security",
};

const TABS = [
    { key: PROFILE_TABS.INFO, label: "Thông tin cá nhân", icon: User },
    { key: PROFILE_TABS.SECURITY, label: "Bảo mật", icon: Shield },
];

/**
 * ProfileSidebar Component
 * Sidebar trái với các tab điều hướng trong trang Profile
 */
const ProfileSidebar = memo(({ activeTab, onTabChange }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        try {
            await dispatch(logoutAsync()).unwrap();
            navigate(ROUTES.LOGIN, { replace: true });
        } catch {
            // handled by slice
        }
    }, [dispatch, navigate]);

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tab items */}
                {TABS.map(({ key, label, icon: Icon }) => {
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => onTabChange(key)}
                            className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors cursor-pointer ${
                                isActive
                                    ? "bg-blue-50 text-blue-800 border-l-3 border-blue-800"
                                    : "text-gray-700 hover:bg-gray-50 border-l-3 border-transparent"
                            }`}
                        >
                            <Icon size={20} className={isActive ? "text-blue-800" : "text-gray-400"} />
                            <span className="text-text-4 font-medium">{label}</span>
                        </button>
                    );
                })}

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                    <LogOut size={20} />
                    <span className="text-text-4 font-medium">Đăng xuất</span>
                </button>
            </nav>
        </aside>
    );
});

ProfileSidebar.displayName = "ProfileSidebar";

export default ProfileSidebar;
