import { memo } from "react";
import Points from "./Points";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";

/**
 * RightSidebarHeader Component
 * Header của right sidebar chứa Points, Notification, User Avatar
 */
const RightSidebarHeader = memo(({ profile, notificationCount = 3 }) => {
    return (
        <div className="w-full flex flex-row lg:justify-between justify-end gap-8 items-center">
            <Points points={profile?.points || 0} />
            <NotificationBell count={notificationCount} />
            <UserAvatar
                avatarUrl={profile?.avatarUrl}
                fullName={profile?.fullName}
                email={profile?.email}
            />
        </div>
    );
});

RightSidebarHeader.displayName = "RightSidebarHeader";

export default RightSidebarHeader;
