import { memo } from "react";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../../profile/store/profileSlice";
import RightSidebarHeader from "../../../shared/components/header";

/**
 * CompetitionRightSidebar Component
 * Sidebar bên phải cho trang Competition.
 */
const CompetitionRightSidebar = memo(() => {
    const profile = useSelector(selectMyProfile);

    return (
        <RightSidebarHeader profile={profile} />
    );
});

CompetitionRightSidebar.displayName = "CompetitionRightSidebar";

export default CompetitionRightSidebar;
