import { memo } from "react";
import { SvgIcon } from "../../../../../shared/components";
import PointIcon from "../../../../../assets/icons/Point.svg";

/**
 * Points Component
 * Hiển thị điểm của user
 */
const Points = memo(({ points = 0, compact = false }) => {
    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex items-center justify-center p-0.5">
                <SvgIcon src={PointIcon} size={compact ? 16 : 24} />
            </div>
            <div className="flex items-center justify-center p-0.5">
                <span className={`text-gray-900 font-680 ${compact ? 'text-xs' : 'text-h4'}`}>
                    {points}
                </span>
            </div>
        </div>
    );
});

Points.displayName = "Points";

export default Points;
