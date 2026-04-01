import { memo } from "react";
import { CustomTooltip } from "../../../../shared/components";

const toSafeNumber = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

const toChapterStats = (chapter) => {
    const totalQuestions = Math.max(
        0,
        toSafeNumber(chapter?.totalQuestionsInChapter ?? chapter?.totalQuestions)
    );
    const answeredCount = Math.max(
        0,
        toSafeNumber(chapter?.answeredCount ?? chapter?.totalAnswered)
    );
    const correctCount = Math.max(
        0,
        toSafeNumber(chapter?.correctCount ?? chapter?.totalCorrect)
    );
    const incorrectCount = Math.max(
        0,
        toSafeNumber(chapter?.incorrectCount ?? chapter?.totalIncorrect)
    );

    const fallbackRate =
        answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;
    const rawCorrectRate = toSafeNumber(chapter?.correctRate);
    const correctRate = Math.max(
        0,
        Math.min(100, rawCorrectRate > 0 ? rawCorrectRate : fallbackRate)
    );

    return {
        totalQuestions,
        answeredCount,
        correctCount,
        incorrectCount,
        correctRate,
    };
};

const QuestionChapterCard = ({ byChapter }) => {
    const chapters = Array.isArray(byChapter) ? byChapter : [];

    return (
        <div>
            {chapters.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center text-xs text-slate-500">
                    Chưa có dữ liệu theo chương.
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {chapters.map((chapter, index) => {
                        const {
                            totalQuestions,
                            answeredCount,
                            correctCount,
                            incorrectCount,
                            correctRate,
                        } = toChapterStats(chapter);
                        const chapterLabel =
                            chapter?.chapterName || `Chương ${chapter?.chapterId}`;

                        return (
                            <CustomTooltip
                                key={`${chapter?.chapterId ?? "no-id"}-${index}`}
                                text={(
                                    <div className="flex min-w-44 flex-col gap-1 text-left text-[11px] leading-relaxed">
                                        <p className="text-xs font-semibold text-slate-900">
                                            {chapterLabel}
                                        </p>
                                        <p>Tổng câu: {totalQuestions}</p>
                                        <p>Đã trả lời: {answeredCount}</p>
                                        <p>Đúng: {correctCount}</p>
                                        <p>Sai: {incorrectCount}</p>
                                        <p>Tỷ lệ đúng: {correctRate.toFixed(2)}%</p>
                                    </div>
                                )}
                            >
                                <div className="cursor-default px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                    {chapterLabel}
                                </div>
                            </CustomTooltip>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default memo(QuestionChapterCard);