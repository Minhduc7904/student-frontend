import { memo } from "react";
import { Award, Sparkles } from "lucide-react";
import PointIcon from "../../../assets/icons/Point.svg";
import { CustomTooltip, SvgIcon } from "../../../shared/components";

/**
 * TotalPointCard
 * Hiển thị tổng điểm của học sinh.
 */
const TotalPointCard = memo(({ totalPoint = 0 }) => {
    const safePoint = Number.isFinite(Number(totalPoint)) ? Number(totalPoint) : 0;

    return (
        <div className="relative h-full overflow-hidden rounded-xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-sky-50 px-4 py-4">
            <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-emerald-100/60" />
            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-sky-100/60" />

            <div className="relative h-full flex items-start justify-between">
                <div className="flex h-full flex-col items-start justify-between">
                    <div>
                        <p className="text-text-5 font-medium text-gray-600">Tổng điểm</p>
                        <p className="mt-2 text-3xl font-bold leading-none text-emerald-700">
                            {safePoint.toLocaleString("vi-VN")}
                        </p>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                        <Sparkles size={12} />
                        Point Balance
                    </p>
                </div>

                <div className="flex cursor-pointer items-center h-full justify-center p-0.5">
                    <CustomTooltip text="Tích cực làm bài để kiếm điểm">
                        <SvgIcon src={PointIcon} size={60} />
                    </CustomTooltip>
                </div>
            </div>
        </div>
    );
});

TotalPointCard.displayName = "TotalPointCard";

export default TotalPointCard;
