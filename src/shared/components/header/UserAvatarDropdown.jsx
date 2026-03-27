import { memo, useState } from "react";
import { User, LogOut, TrendingUp, Coins, UserCircle, Wallet, Settings } from "lucide-react";
import { ROUTES } from "../../../core/constants/routes";
import { ComingSoonModal } from "../modal/ComingSoonModal";

/**
 * UserAvatarDropdown
 * Menu dropdown của avatar người dùng.
 */
const UserAvatarDropdown = memo(({ avatarUrl, fullName, email, onNavigate, onLogout, onClose }) => {
    const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

    const quickMenus = [
        {
            key: "progress",
            label: "Lịch sử",
            icon: TrendingUp,
            path: ROUTES.HISTORY,
        },
        {
            key: "points",
            label: "Điểm",
            icon: Coins,
            path: ROUTES.DASHBOARD,
        },
        // {
        //     key: "notebook",
        //     label: "Sổ tay",
        //     icon: NotebookPen,
        //     path: ROUTES.LIBRARY,
        // },
        {
            key: "profile",
            label: "Hồ sơ",
            icon: UserCircle,
            path: ROUTES.PROFILE,
        },
        {
            key: "payment",
            label: "Thanh toán",
            icon: Wallet,
            path: ROUTES.PAYMENT,
        },
    ];

    const handleQuickMenuClick = (item) => {
        
        if (item.key === "points") {
            onClose();
            setIsComingSoonOpen(true);
            return;
        }

        onNavigate(item.path);
    };

    return (
        <>
            <div className="absolute right-0 top-full mt-4 w-auto min-w-[18rem] max-w-[min(92vw,24rem)] p-4 bg-white rounded-[13px] shadow-lg py-2 z-60 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="">
                    <button
                        type="button"
                        onClick={() => onNavigate(ROUTES.PROFILE)}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg mb-4 mt-1 text-left transition-colors hover:bg-gray-50"
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={fullName}
                                className="w-12 h-12 object-cover rounded-full"
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
                    </button>
                </div>
                {/* Menu Items */}
                <div className="grid grid-cols-3 grid-rows-2 gap-2 pb-3">
                    {quickMenus.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.key}
                                onClick={() => handleQuickMenuClick(item)}
                                className="cursor-pointer bg-[#F5F5F5] group/menu flex flex-col items-center justify-start gap-1 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
                            >
                                <Icon className="h-10 w-10 text-gray-400 transition-colors group-hover/menu:text-blue-500" />
                                <span className="text-[11px] font-medium text-gray-700 transition-colors group-hover/menu:text-gray-900">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="border-t border-gray-100 my-1" />

                <div className="py-1">
                    <button
                        onClick={() => onNavigate(ROUTES.PROFILE_SETTING)}
                        className="cursor-pointer w-full px-4 py-2.5 flex rounded items-center gap-3 hover:bg-gray-50 transition-colors text-left group/item"
                    >
                        <Settings
                            size={20}
                            className="text-gray-400 group-hover/item:text-gray-600 transition-colors"
                        />
                        <span className="text-sm text-gray-700 group-hover/item:text-gray-900 transition-colors">
                            Cài đặt
                        </span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="cursor-pointer w-full px-4 py-2.5 flex rounded items-center gap-3 hover:bg-red-50 transition-colors text-left group/item"
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

            <ComingSoonModal isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} />
        </>
    );
});

UserAvatarDropdown.displayName = "UserAvatarDropdown";

export default UserAvatarDropdown;
