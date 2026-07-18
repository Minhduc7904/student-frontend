import { CheckCircle, XCircle, MinusCircle, MessageSquare } from 'lucide-react';

/**
 * Single stat item
 */
const StatItem = ({ icon: Icon, iconClass, label, value, valueClass }) => (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3 text-left">
        <div className="mb-2 flex items-center justify-between">
            <Icon className={`h-4.5 w-4.5 ${iconClass}`} />
        </div>
        <span className={`text-h4 font-bold tabular-nums ${valueClass}`}>
            {value ?? '—'}
        </span>
        <p className="mt-0.5 text-xs leading-tight text-slate-600">{label}</p>
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
        <section className="rounded-3xl border border-blue-100 bg-white p-4 shadow-[0_12px_30px_rgba(25,77,182,0.06)] md:p-5">
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
        </section>
    );
};

export default StatsBar;
