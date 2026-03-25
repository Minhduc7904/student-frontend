import { memo } from "react";
import { useSelector } from "react-redux";
import { selectProfile } from "../../profile/store/profileSlice";
import RightSidebarHeader from "../../home/layout/components/RightSidebar/RightSidebarHeader";

/**
 * PracticeRightSidebar Component
 * Sidebar bên phải hiển thị thông tin user, lịch, thời gian học
 */
const PracticeRightSidebar = memo(() => {
    const profile = useSelector(selectProfile);

    return (
        <div className="lg:h-dvh px-4 lg:py-0 lg:pr-8 xl:pr-11 pt-4 lg:pt-5 flex flex-col items-center border-l border-gray-100">
            <RightSidebarHeader profile={profile} />

            {/* Scrollable content area */}
            <div className="max-w-[394px] min-w-[394px] flex-1 lg:block hidden lg:overflow-y-auto custom-scrollbar flex flex-col gap-4 lg:gap-5 xl:gap-6 mt-4 lg:mt-5 xl:mt-6 w-full overflow-x-hidden lg:pr-1">
                
            </div>
        </div>
    );
});

PracticeRightSidebar.displayName = "PracticeRightSidebar";

export default PracticeRightSidebar;
