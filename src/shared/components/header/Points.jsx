import { memo } from "react";
import { SvgIcon } from "..";
import PointIcon from "../../../assets/icons/Point.svg";

const Points = memo(({ points = 0, compact = false, onClick }) => {
    const safePoints = Number.isFinite(Number(points)) ? Number(points) : 0;

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex cursor-pointer flex-row items-center justify-center rounded-lg px-1 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/30"
            aria-label="Xem điểm của tôi"
        >
            <div className="flex items-center justify-center p-0.5">
                <SvgIcon src={PointIcon} size={compact ? 16 : 20} />
            </div>
            <div className="flex items-center justify-center p-0.5">
                <span className={`text-gray-900 font-680 ${compact ? "text-xs" : "text-h4"}`}>
                    {safePoints.toLocaleString("vi-VN")}
                </span>
            </div>
        </button>
    );
});

Points.displayName = "Points";

export default Points;
