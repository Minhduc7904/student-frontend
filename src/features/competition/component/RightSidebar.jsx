import { memo } from "react";
import { useSelector } from "react-redux";
import { selectProfile } from "../../profile/store/profileSlice";
import RightSidebarHeader from "../../home/layout/components/RightSidebar/RightSidebarHeader";

/**
 * CompetitionRightSidebar Component
 * Sidebar bên phải cho trang Competition.
 */
const CompetitionRightSidebar = memo(() => {
    const profile = useSelector(selectProfile);

    return (
        <RightSidebarHeader profile={profile} />
    );
});

CompetitionRightSidebar.displayName = "CompetitionRightSidebar";

export default CompetitionRightSidebar;
