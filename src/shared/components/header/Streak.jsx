import { memo } from "react";
import { Flame } from "lucide-react";
import FireVideo from "../../../assets/Fire.mp4";

/**
 * Streak Component
 * Hiển thị streak của user. Nếu streak > 0 thì hiển thị video lửa động.
 */
const Streak = memo(({ streak = 0, compact = false }) => {
    const safeStreak = Number.isFinite(Number(streak)) ? Number(streak) : 0;
    const iconSize = compact ? 16 : 20;

    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex items-center justify-center p-0.5">
                {safeStreak > 0 ? (
                    <video
                        src={FireVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={compact ? "h-4 w-4 rounded-sm object-cover" : "h-6 w-6 rounded-sm object-cover"}
                    />
                ) : (
                    <Flame size={iconSize} className="text-orange-500" />
                )}
            </div>
            <div className="flex items-end justify-center p-0.5">
                <span className={`text-gray-900 font-680 ${compact ? "text-xs" : "text-h4"}`}>
                    {safeStreak}
                </span>
            </div>
        </div>
    );
});

Streak.displayName = "Streak";

export default Streak;
