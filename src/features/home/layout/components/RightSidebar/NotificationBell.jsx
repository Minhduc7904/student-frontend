import { memo } from "react";
import { SvgIcon } from "../../../../../shared/components";
import BellIcon from "../../../../../assets/icons/Bell.svg";

/**
 * NotificationBell Component
 * Hiển thị icon thông báo với badge số lượng
 */
const NotificationBell = memo(({ count = 0 }) => {
    return (
        <div className="relative inline-flex">
            <div className="flex items-center justify-center p-[2px]">
                <SvgIcon src={BellIcon} />
            </div>

            {/* Badge */}
            {count > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-h5">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </div>
    );
});

NotificationBell.displayName = "NotificationBell";

export default NotificationBell;
