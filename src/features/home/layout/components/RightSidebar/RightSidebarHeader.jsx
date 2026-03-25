import { memo } from "react";
import Points from "./Points";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";

/**
 * RightSidebarHeader Component
 * Header của right sidebar chứa Points, Notification, User Avatar
 */
const RightSidebarHeader = memo(({ profile, compact = false }) => {
    return (
        <div className={`flex w-auto lg:w-full flex-row items-center justify-end lg:justify-between ${compact ? 'gap-2' : 'gap-4 sm:gap-6'}`}>
            <Points points={profile?.points || 0} compact={compact} />
            <NotificationBell compact={compact} />
            <UserAvatar
                avatarUrl={profile?.avatarUrl}
                fullName={profile?.fullName}
                email={profile?.email}
                compact={compact}
            />
        </div>
    );
});

RightSidebarHeader.displayName = "RightSidebarHeader";

export default RightSidebarHeader;
