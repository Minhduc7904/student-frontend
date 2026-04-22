import { memo, useState } from "react";
import RedoWrongSummaryDonutCard from "./RedoWrongSummaryDonutCard";
import RedoWrongDifficultyStatsCard from "./RedoWrongDifficultyStatsCard";
import RedoWrongChapterBubbleClusterCard from "./RedoWrongChapterBubbleClusterCard";
import RedoWrongChapterCard from "./RedoWrongChapterCard";
import RedoWrongChapterBubbleClusterModal from "./RedoWrongChapterBubbleClusterModal";

const RedoWrongStatsSidebar = ({ statistics, statisticsLoading, statisticsError, onRetry }) => {
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

    const summary = statistics?.summary || null;
    const byChapter = Array.isArray(statistics?.byChapter) ? statistics.byChapter : [];
    const byDifficulty = Array.isArray(statistics?.byDifficulty) ? statistics.byDifficulty : [];

    const answeredCount = summary?.totalAnswered ?? 0;
    const correctCount = summary?.totalCorrect ?? 0;
    const incorrectCount = summary?.totalIncorrect ?? 0;

    if (statisticsLoading) {
        return (
            <div className="space-y-4">
                <div className="h-56 animate-pulse rounded-2xl border border-pink-100 bg-pink-50/50" />
                <div className="h-48 animate-pulse rounded-2xl border border-pink-100 bg-pink-50/50" />
                <div className="h-64 animate-pulse rounded-2xl border border-pink-100 bg-pink-50/50" />
            </div>
        );
    }

    if (statisticsError) {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                <p className="font-medium">Không tải được thống kê</p>
                <p className="mt-1 text-xs">{statisticsError}</p>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-3 cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                    >
                        Tải lại
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <RedoWrongSummaryDonutCard
                    summary={summary}
                    fallbackAnswered={answeredCount}
                    fallbackCorrect={correctCount}
                    fallbackIncorrect={incorrectCount}
                />
                <RedoWrongDifficultyStatsCard byDifficulty={byDifficulty} />
                <RedoWrongChapterBubbleClusterCard
                    byChapter={byChapter}
                    onExpand={() => setIsChapterModalOpen(true)}
                />
                <RedoWrongChapterCard byChapter={byChapter} />
            </div>

            <RedoWrongChapterBubbleClusterModal
                isOpen={isChapterModalOpen}
                onClose={() => setIsChapterModalOpen(false)}
                byChapter={byChapter}
            />
        </>
    );
};

export default memo(RedoWrongStatsSidebar);
