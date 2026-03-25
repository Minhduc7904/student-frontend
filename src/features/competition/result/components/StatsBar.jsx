import { CheckCircle, XCircle, MinusCircle, MessageSquare } from 'lucide-react';

/**
 * Single stat item
 */
const StatItem = ({ icon: Icon, iconClass, label, value, valueClass }) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
        <div className="mb-1 flex items-center justify-center">
            <Icon className={`h-4.5 w-4.5 ${iconClass}`} />
        </div>
        <span className={`text-subhead-4 font-semibold ${valueClass}`}>
            {value ?? '—'}
        </span>
        <p className="mt-0.5 text-text-5 leading-tight text-slate-600">{label}</p>
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
        <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
            <h2 className="mb-3 text-subhead-4 font-semibold text-gray-900">Thống kê nhanh</h2>

            <div className={`grid gap-2 ${showScore ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
                <StatItem
                    icon={MessageSquare}
                    iconClass="text-blue-500"
                    label="Đã trả lời"
                    value={totalAnswers}
                    valueClass="text-blue-700"
                />

                {showScore && (
                    <StatItem
                        icon={CheckCircle}
                        iconClass="text-green-500"
                        label="Đúng"
                        value={correctAnswers}
                        valueClass="text-green-700"
                    />
                )}

                {showScore && (
                    <StatItem
                        icon={XCircle}
                        iconClass="text-red-500"
                        label="Sai"
                        value={incorrectAnswers}
                        valueClass="text-red-700"
                    />
                )}

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
