import { memo } from "react";
import SessionItem from "./SessionItem";
import { LoadingText } from "../../../../shared/components/loading/Spinner";

/**
 * SessionList - Danh sách buổi học
 */
const SessionList = memo(({ sessions, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-4">
                <LoadingText 
                    text="Đang tải buổi học..." 
                    size="sm"
                    color="blue"
                    textClassName="text-text-5 text-gray-subtle"
                />
            </div>
        );
    }

    if (!sessions || sessions.length === 0) {
        return (
            <div className="text-gray-subtle text-text-5">
                Không có buổi học trong tháng này
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar">
            {sessions.map((item) => (
                <SessionItem key={item.id} item={item} />
            ))}
        </div>
    );
});

SessionList.displayName = "SessionList";

export default SessionList;
