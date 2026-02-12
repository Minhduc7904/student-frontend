import { memo } from "react";
import { COLOR_MAP } from "./Calendar";
import { formatTime, getDay } from "../../../../shared/utils";

/**
 * SessionItem - Một item buổi học
 */
const SessionItem = memo(({ item }) => {
    if (!item) return null;

    const {
        color,
        sessionData,
    } = item;

    // Fallback nếu color không tồn tại
    const colorConfig = COLOR_MAP?.[color] ?? {
        bg: "bg-gray-100",
        text: "text-gray-500",
    };

    const className = sessionData.courseClass?.className ?? "Chưa có lớp";

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div
                    className={`w-10 h-10 rounded-full flex justify-center items-center ${colorConfig.bg}`}
                >
                    <span
                        className={`text-[24px] font-semibold leading-none ${colorConfig.text}`}
                    >
                        {getDay(sessionData.sessionDate) || "--"}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-subhead-4 text-gray-900">
                        {sessionData.name || "Chưa có tên"}
                    </span>
                    <span className="text-text-5 text-gray-subtle">
                        {className}
                    </span>
                </div>
            </div>

            <div className="text-gray-900 text-text-4">
                {formatTime(sessionData.startTime) || "--:--"} - {formatTime(sessionData.endTime) || "--:--"}
            </div>
        </div>
    );
});

SessionItem.displayName = "SessionItem";

export default SessionItem;
