import { memo } from "react";
import { Check } from "lucide-react";

/**
 * CircularProgress - Component hiển thị progress dạng vòng tròn
 */
const CircularProgress = ({
    size = 60,
    strokeWidth = 6,
    progress = 75,
    color = "#194DB6",
    trackColor = "#DFE9FF",
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    // Clamp progress
    const safeProgress = Math.min(Math.max(progress, 0), 100);

    if (safeProgress === 100) {
        return (
            <div
                style={{ width: size, height: size }}
                className="flex items-center justify-center bg-[#80C7FD] rounded-full"
            >
                <Check
                    size={size * 0.6}
                    className="text-white"
                />
            </div>
        );
    }

    return (
        <svg
            width={size}
            height={size}
            className="rotate-[-90deg]"
        >
            {/* Background track */}
            <circle
                stroke={trackColor}
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />

            {/* Progress */}
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{
                    transition: "stroke-dashoffset 0.4s ease",
                }}
            />
        </svg>
    );
};

export default memo(CircularProgress);
