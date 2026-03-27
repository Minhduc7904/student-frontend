import { memo } from "react";
import CalendarSection from "./CalendarSection";
import StudyTimeSection from "./StudyTimeSection";

/**
 * RightSidebar Component
 * Sidebar bên phải hiển thị thông tin user, lịch, thời gian học
 */
const RightSidebar = memo(() => {
    return (
        <div className="lg:h-dvh px-4 lg:py-0 py-4 lg:pt-5 flex flex-col items-center">
            {/* Scrollable content area */}
            <div className="flex-1 lg:block hidden lg:overflow-y-auto custom-scrollbar flex flex-col gap-4 lg:gap-5 xl:gap-6 w-full overflow-x-hidden lg:pr-1">
                <CalendarSection />
                <StudyTimeSection />
            </div>
        </div>
    );
});

RightSidebar.displayName = "RightSidebar";

export default RightSidebar;
