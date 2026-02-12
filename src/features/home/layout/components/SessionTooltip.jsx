import { memo } from "react";
import { createPortal } from "react-dom";
import { formatTime } from "../../../../shared/utils";

const SessionTooltip = ({ session, position }) => {
    if (!position) return null;
    const style = {
        position: "fixed",
        left: position.left,
        top: position.top,
        transform: "translate(-50%, -100%)",
        marginTop: "-8px",
        zIndex: 9999,
    };
    const sessionData = session.sessionData || {};

    return createPortal(
        <div style={style} className="px-3 py-2 bg-gray-900 text-white rounded-lg shadow-lg">
            <div className="flex flex-col gap-1">
                <span className="font-semibold">{sessionData.name}</span>
                <span className="text-gray-300">{sessionData.courseClass?.className}</span>
                <span className="text-gray-400 whitespace-nowrap">Thời gian: {formatTime(sessionData.startTime)} - {formatTime(sessionData.endTime)}</span>
            </div>
        </div>,
        document.body
    );
};

export default memo(SessionTooltip);
