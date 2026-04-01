import { memo, useState } from "react";
import { SmoothLineChartCard } from "../../../../shared/components";
import { Modal } from "../../../../shared/components/modal/Modal";
import QuestionStatsSummaryDonutCard from "./QuestionStatsSummaryDonutCard";
import QuestionChapterBubbleClusterCard from "./QuestionChapterBubbleClusterCard";
import QuestionDifficultyStatsCard from "./QuestionDifficultyStatsCard";
import QuestionChapterCard from "./QuestionChapterCard";
const normalizeHistoryItems = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.history)) return data.history;
    if (Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const normalizeStatus = (status) => String(status || "").trim().toUpperCase();


const isSubmittedItem = (item) => {
    const status = normalizeStatus(item?.status);
    return status === "SUBMITTED" || status === "SUBMITED";
};

export const CompetitionHistoryStatsSidebar = memo(({ submittedHistory }) => {
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const items = normalizeHistoryItems(submittedHistory);
    const submittedCount = items.filter((item) => isSubmittedItem(item)).length;

    return (
        <>
            <SmoothLineChartCard
                title="Thống kê cuộc thi"
                subtitle={`Đã nộp ${submittedCount} bài`}
                items={items}
                chartType="competition"
                onlySubmitted
                onExpand={() => setIsChartModalOpen(true)}
            />

            <Modal isOpen={isChartModalOpen} onClose={() => setIsChartModalOpen(false)}>
                <div
                    className="w-full max-h-[90vh] max-w-[96vw] overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-[92vw] lg:max-w-6xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="max-h-[calc(90vh-64px)] overflow-y-auto">
                        <SmoothLineChartCard
                            title="Thống kê cuộc thi"
                            subtitle={`Đã nộp ${submittedCount} bài`}
                            items={items}
                            chartType="competition"
                            onlySubmitted
                            variant="modal"
                            showExpandButton={false}
                            onClose={() => setIsChartModalOpen(false)}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
});

CompetitionHistoryStatsSidebar.displayName = "CompetitionHistoryStatsSidebar";

export const QuestionHistoryStatsSidebar = memo(({ questionHistory, questionStatistics, onOpenChapterModal }) => {
    const items = normalizeHistoryItems(questionHistory);
    const summary = questionStatistics?.summary || null;
    const answeredCount = summary?.totalAnswered ?? items.length;
    const correctCount = summary?.totalCorrect ?? items.filter((item) => item?.isCorrect === true).length;
    const incorrectCount = summary?.totalIncorrect ?? items.filter((item) => item?.isCorrect === false).length;
    const byChapter = Array.isArray(questionStatistics?.byChapter) ? questionStatistics.byChapter : [];
    const byDifficulty = Array.isArray(questionStatistics?.byDifficulty) ? questionStatistics.byDifficulty : [];

    return (
        <div className="space-y-4">
            <QuestionStatsSummaryDonutCard
                summary={summary}
                fallbackAnswered={answeredCount}
                fallbackCorrect={correctCount}
                fallbackIncorrect={incorrectCount}
            />
            <QuestionDifficultyStatsCard byDifficulty={byDifficulty} />
            <QuestionChapterBubbleClusterCard byChapter={byChapter} onExpand={onOpenChapterModal} />
            <QuestionChapterCard byChapter={byChapter} />
        </div>
    );
});

QuestionHistoryStatsSidebar.displayName = "QuestionHistoryStatsSidebar";

export const ExamHistoryStatsSidebar = memo(({ examHistory }) => {
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const items = normalizeHistoryItems(examHistory);
    const submittedCount = items.filter((item) => isSubmittedItem(item)).length;

    return (
        <>
            <SmoothLineChartCard
                title="Thống kê đề mẫu"
                subtitle={`Đã nộp ${submittedCount} lượt`}
                items={items}
                chartType="exam"
                onlySubmitted
                onExpand={() => setIsChartModalOpen(true)}
            />

            <Modal isOpen={isChartModalOpen} onClose={() => setIsChartModalOpen(false)}>
                <div
                    className="w-full max-h-[90vh] max-w-[96vw] overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-[92vw] lg:max-w-6xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="max-h-[calc(90vh-64px)] overflow-y-auto">
                        <SmoothLineChartCard
                            title="Thống kê đề mẫu"
                            subtitle={`Đã nộp ${submittedCount} lượt`}
                            items={items}
                            chartType="exam"
                            onlySubmitted
                            variant="modal"
                            showExpandButton={false}
                            onClose={() => setIsChartModalOpen(false)}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
});

ExamHistoryStatsSidebar.displayName = "ExamHistoryStatsSidebar";
