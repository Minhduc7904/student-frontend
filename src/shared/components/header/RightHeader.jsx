import { memo } from "react";
import Points from "./Points";
import Streak from "./Streak";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";

/**
 * RightHeader Component
 * Header của right  chứa Points, Notification, User Avatar
 */
const RightHeader = memo(({ profile, compact = false }) => {
    return (
        <div className={`flex w-auto lg:w-full flex-row items-center justify-end lg:justify-between ${compact ? 'gap-2' : 'gap-4 sm:gap-6'}`}>
            <Points points={profile?.totalPoint ?? profile?.points ?? 0} compact={compact} />
            <Streak streak={profile?.streak ?? 0} compact={compact} />
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

RightHeader.displayName = "RightHeader";

export default RightHeader;
