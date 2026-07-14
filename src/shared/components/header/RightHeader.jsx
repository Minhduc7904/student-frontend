import { memo } from "react";
import { useNavigate } from "react-router-dom";
import Points from "./Points";
import Streak from "./Streak";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";
import { getStudentTotalPoint } from "../../../features/profile/utils/studentPointUtils";
import { ROUTES } from "../../../core/constants";

/**
 * RightHeader Component
 * Header của right  chứa Points, Notification, User Avatar
 */
const RightHeader = memo(({ profile, compact = false }) => {
    const navigate = useNavigate();
    const totalPoint = getStudentTotalPoint(profile);

    return (
        <div className={`flex w-auto lg:w-full flex-row items-center justify-end lg:justify-between ${compact ? 'gap-2' : 'gap-4 sm:gap-6'}`}>
            <Points
                points={totalPoint}
                compact={compact}
                onClick={() => navigate(ROUTES.PROFILE_POINTS)}
            />
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
