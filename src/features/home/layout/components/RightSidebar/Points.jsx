import { memo } from "react";
import { SvgIcon } from "../../../../../shared/components";
import PointIcon from "../../../../../assets/icons/Point.svg";

/**
 * Points Component
 * Hiển thị điểm của user
 */
const Points = memo(({ points = 0 }) => {
    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex items-center justify-center p-[2px]">
                <SvgIcon src={PointIcon} />
            </div>
            <div className="flex items-center justify-center p-[2px]">
                <span className="text-gray-900 font-680 text-h4">
                    {points}
                </span>
            </div>
        </div>
    );
});

Points.displayName = "Points";

export default Points;
