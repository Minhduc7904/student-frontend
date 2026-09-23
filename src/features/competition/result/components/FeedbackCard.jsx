import { MessageSquare } from 'lucide-react';

/**
 * FeedbackCard
 * Hiển thị nhận xét – ưu tiên nhận xét của homeworkSubmit (BTVN) nếu có,
 * fallback về nhận xét của competitionSubmit. Backend đã tính sẵn độ ưu tiên
 * này vào `result.feedback` / `result.feedbackSource`.
 */
const FeedbackCard = ({ result }) => {
    if (!result?.feedback) return null;

    const isHomeworkFeedback = result.feedbackSource === 'homework_submit';

    return (
        <section className="rounded-3xl border border-blue-100 bg-white p-4 shadow-[0_12px_30px_rgba(25,77,182,0.06)] sm:p-5">
            <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <MessageSquare className="h-4 w-4" />
                </span>
                <h2 className="text-subhead-4 font-semibold text-gray-900">
                    {isHomeworkFeedback ? 'Nhận xét bài tập về nhà' : 'Nhận xét'}
                </h2>
            </div>
            <p className="whitespace-pre-line text-text-5 text-slate-700">{result.feedback}</p>
        </section>
    );
};

export default FeedbackCard;
