import { memo } from "react";
import { User, ChevronDown } from "lucide-react";

/**
 * UserAvatar Component
 * Hiển thị avatar của user với dropdown indicator
 */
const UserAvatar = memo(({ avatarUrl, fullName }) => {
    return (
        <div className="relative inline-flex">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-[60px] h-[60px] object-cover rounded-full"
                />
            ) : (
                <div className="rounded-full p-2 w-[60px] h-[60px] bg-blue-100 flex items-center justify-center overflow-hidden">
                    <User className="text-blue-800 w-full h-full" />
                </div>
            )}

            <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-white p-[2px] rounded-full">
                <div className="w-full h-full bg-blue-100 flex items-center justify-center rounded-full overflow-hidden">
                    <ChevronDown size={16} className="text-blue-800" />
                </div>
            </div>
        </div>
    );
});

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
