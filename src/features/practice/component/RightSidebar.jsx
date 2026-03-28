import { memo } from "react";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../../profile/store/profileSlice";
import RightSidebarHeader from "../../../shared/components/header";

/**
 * PracticeRightSidebar Component
 * Sidebar bên phải hiển thị thông tin user, lịch, thời gian học
 */
const PracticeRightSidebar = memo(() => {
    const profile = useSelector(selectMyProfile);

    return (
        <div className="lg:h-dvh px-4 lg:py-0 lg:pr-8 xl:pr-11 pt-4 lg:pt-5 flex flex-col items-center border-l border-gray-100">
            <RightSidebarHeader profile={profile} />

            {/* Scrollable content area */}
            <div className="max-w-98.5 min-w-98.5 hidden flex-1 flex-col gap-4 mt-4 w-full overflow-x-hidden custom-scrollbar lg:mt-5 lg:flex lg:gap-5 lg:overflow-y-auto lg:pr-1 xl:mt-6 xl:gap-6">
                
            </div>
        </div>
    );
});

PracticeRightSidebar.displayName = "PracticeRightSidebar";

export default PracticeRightSidebar;
