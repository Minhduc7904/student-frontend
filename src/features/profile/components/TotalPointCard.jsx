import { memo } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import PointIcon from "../../../assets/icons/Point.svg";
import { CustomTooltip, SvgIcon } from "../../../shared/components";

const TotalPointCard = memo(({ totalPoint = 0, onClick }) => {
    const safePoint = Number.isFinite(Number(totalPoint)) ? Number(totalPoint) : 0;

    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative h-full w-full cursor-pointer overflow-hidden rounded-xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-yellow-50 px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/30 active:scale-[0.99]"
        >
            <div className="absolute -right-7 -top-7 z-0 h-20 w-20 rounded-full bg-blue-100/70" />
            <div className="absolute -bottom-10 -left-10 z-0 h-24 w-24 rounded-full bg-yellow-100/70" />
            <span className="pointer-events-none absolute inset-y-[-2rem] left-[-7rem] z-10 w-14 rotate-12 bg-white/70 opacity-0 blur-sm transition-all duration-700 ease-out group-hover:translate-x-[26rem] group-hover:opacity-100" />

            <div className="relative z-20 flex h-full items-start justify-between">
                <div className="flex h-full flex-col items-start justify-between">
                    <div>
                        <p className="text-text-5 font-medium text-gray-600">Tổng điểm</p>
                        <p className="mt-2 text-3xl font-bold leading-none text-blue-800">
                            {safePoint.toLocaleString("vi-VN")}
                        </p>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-2 py-1 text-[11px] font-semibold text-blue-950">
                        <Sparkles size={12} />
                        Xem chi tiết điểm
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </p>
                </div>

                <div className="flex h-full cursor-pointer items-center justify-center p-0.5">
                    <CustomTooltip text="Tích cực học tập để kiếm điểm">
                        <SvgIcon src={PointIcon} size={60} />
                    </CustomTooltip>
                </div>
            </div>
        </button>
    );
});

TotalPointCard.displayName = "TotalPointCard";

export default TotalPointCard;
