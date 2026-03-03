import { CheckCircle, XCircle, MinusCircle, MessageSquare } from 'lucide-react';

/**
 * Single stat item
 */
const StatItem = ({ icon: Icon, iconClass, label, value, valueClass }) => (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0 p-3 sm:p-4">
        <Icon className={`w-5 h-5 ${iconClass}`} />
        <span className={`text-head-5 font-bold ${valueClass}`}>
            {value ?? '—'}
        </span>
        <span className="text-text-5 text-gray-500 text-center leading-tight">{label}</span>
    </div>
);

/**
 * StatsBar
 * Thống kê nhanh – chỉ render khi rules.showResultDetail = true
 */
const StatsBar = ({ result }) => {
    if (!result?.rules?.showResultDetail) return null;

    const {
        totalAnswers,
        correctAnswers,
        incorrectAnswers,
        unansweredQuestions,
        rules,
    } = result;

    const showScore = rules?.allowViewScore;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex divide-x divide-gray-100">
                {/* Total */}
                <StatItem
                    icon={MessageSquare}
                    iconClass="text-blue-500"
                    label="Đã trả lời"
                    value={totalAnswers}
                    valueClass="text-blue-700"
                />

                {/* Correct – only if allowViewScore */}
                {showScore && (
                    <StatItem
                        icon={CheckCircle}
                        iconClass="text-green-500"
                        label="Đúng"
                        value={correctAnswers}
                        valueClass="text-green-700"
                    />
                )}

                {/* Incorrect – only if allowViewScore */}
                {showScore && (
                    <StatItem
                        icon={XCircle}
                        iconClass="text-red-500"
                        label="Sai"
                        value={incorrectAnswers}
                        valueClass="text-red-700"
                    />
                )}

                {/* Unanswered */}
                <StatItem
                    icon={MinusCircle}
                    iconClass="text-gray-400"
                    label="Bỏ qua"
                    value={unansweredQuestions}
                    valueClass="text-gray-600"
                />
            </div>
        </div>
    );
};

export default StatsBar;
