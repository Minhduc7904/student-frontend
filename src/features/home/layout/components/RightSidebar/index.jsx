import { memo } from "react";
import { useSelector } from "react-redux";
import { selectProfile } from "../../../../profile/store/profileSlice";
import RightSidebarHeader from "./RightSidebarHeader";
import CalendarSection from "./CalendarSection";
import StudyTimeSection from "./StudyTimeSection";

/**
 * RightSidebar Component
 * Sidebar bên phải hiển thị thông tin user, lịch, thời gian học
 */
const RightSidebar = memo(() => {
    const profile = useSelector(selectProfile);

    return (
        <div className="lg:h-dvh px-4 lg:py-0 lg:pr-8 xl:pr-11 pt-4 lg:pt-5 flex flex-col items-center">
            <RightSidebarHeader profile={profile} notificationCount={3} />
            
            {/* Scrollable content area */}
            <div className="flex-1 lg:block hidden lg:overflow-y-auto custom-scrollbar flex flex-col gap-4 lg:gap-5 xl:gap-6 mt-4 lg:mt-5 xl:mt-6 w-full overflow-x-hidden lg:pr-1">
                <CalendarSection />
                <StudyTimeSection />
            </div>
        </div>
    );
});

RightSidebar.displayName = "RightSidebar";

export default RightSidebar;
