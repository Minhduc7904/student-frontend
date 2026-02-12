import { memo } from "react";
import StudyStatsCard from "../StudyStatsCard";

/**
 * StudyTimeSection Component
 * Section hiển thị thời gian học tập
 */
const StudyTimeSection = memo(() => {
    return (
        <div className="w-full flex flex-col items-center gap-5">
            <div className="w-full pl-6">
                <span className="text-h3 font-680 text-blue-900">
                    Thời gian học tập
                </span>
            </div>
            <StudyStatsCard />
        </div>
    );
});

StudyTimeSection.displayName = "StudyTimeSection";

export default StudyTimeSection;
