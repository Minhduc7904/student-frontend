import { BookOpen, CheckCircle2, CircleAlert, Layers3, MinusCircle, TrendingUp, XCircle } from 'lucide-react';
import { resolveDifficultyMeta } from '../../../../shared/constants';

const getOutcome = (answer) => {
    if (answer?.isCorrect === true) return 'correct';
    if (answer?.isCorrect === false) return 'incorrect';
    return 'skipped';
};

const createSummary = (id, name, meta = {}) => ({
    id,
    name,
    total: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    ...meta,
});

const addAnswerToSummary = (summary, answer) => {
    summary.total += 1;
    summary[getOutcome(answer)] += 1;
};

const getDifficulty = (question) => {
    const meta = resolveDifficultyMeta(question?.difficulty);

    if (question?.difficulty == null || question.difficulty === '') {
        return {
            id: '__other_difficulty__',
            name: 'Khác',
            className: 'border-slate-200 bg-slate-50 text-slate-600',
        };
    }

    const fallback = question?.difficulty ?? 'Chưa xác định';

    return {
        id: meta?.code ?? String(fallback),
        name: meta ? `${meta.code} · ${meta.label}` : String(fallback),
        className: meta?.className ?? 'border-slate-200 bg-slate-50 text-slate-600',
    };
};

const deriveAnalytics = (answers = []) => {
    const chapterMap = new Map();
    const difficultyMap = new Map();

    answers.forEach((answer) => {
        const question = answer?.question;
        const chapters = Array.isArray(question?.chapters) ? question.chapters : [];
        const validChapters = chapters.filter((chapter) => (chapter?.chapterId ?? chapter?.id) != null);

        if (validChapters.length === 0) {
            if (!chapterMap.has('__other_chapter__')) {
                chapterMap.set('__other_chapter__', createSummary('__other_chapter__', 'Khác'));
            }
            addAnswerToSummary(chapterMap.get('__other_chapter__'), answer);
        }

        validChapters.forEach((chapter) => {
            const id = chapter?.chapterId ?? chapter?.id;
            if (id == null) return;

            if (!chapterMap.has(id)) {
                chapterMap.set(id, createSummary(id, chapter?.name ?? 'Chương chưa đặt tên'));
            }
            addAnswerToSummary(chapterMap.get(id), answer);
        });

        const difficulty = getDifficulty(question);
        if (!difficultyMap.has(difficulty.id)) {
            difficultyMap.set(difficulty.id, createSummary(difficulty.id, difficulty.name, {
                className: difficulty.className,
            }));
        }
        addAnswerToSummary(difficultyMap.get(difficulty.id), answer);
    });

    return {
        chapters: Array.from(chapterMap.values()),
        difficulties: Array.from(difficultyMap.values()),
    };
};

const getInsight = (items) => {
    const mostStruggled = [...items].sort((left, right) => {
        const leftMissed = left.incorrect + left.skipped;
        const rightMissed = right.incorrect + right.skipped;
        return rightMissed - leftMissed || right.total - left.total;
    })[0] ?? null;

    const best = [...items]
        .filter((item) => item.correct > 0)
        .sort((left, right) => {
            const leftRate = left.correct / left.total;
            const rightRate = right.correct / right.total;
            return rightRate - leftRate || right.correct - left.correct;
        })[0] ?? null;

    return { mostStruggled, best };
};

const Count = ({ value, label, className }) => (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${className}`}>
        <strong className="tabular-nums">{value}</strong> {label}
    </span>
);

const BreakdownRow = ({ item, showScore, badgeClassName }) => (
    <li className="rounded-xl border border-blue-100 bg-white px-3 py-3">
        <div className="flex items-start justify-between gap-3">
            <span className={`min-w-0 rounded-md border px-2 py-1 text-xs font-semibold ${badgeClassName}`}>
                {item.name}
            </span>
            <span className="shrink-0 text-xs font-semibold text-blue-950">{item.total} câu</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {showScore && <Count value={item.correct} label="đúng" className="text-emerald-700" />}
            {showScore && <Count value={item.incorrect} label="sai" className="text-red-600" />}
            <Count value={item.skipped} label="bỏ qua" className="text-slate-500" />
        </div>
    </li>
);

const BreakdownCard = ({ icon: Icon, title, subtitle, items, showScore, getBadgeClassName }) => (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3 sm:p-4">
        <div className="mb-3 flex items-start gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-800 shadow-sm">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-blue-950">{title}</h3>
                <p className="mt-0.5 text-xs text-slate-600">
                    {title === 'Theo chương' ? 'Số câu thuộc mỗi chương trong bài này.' : subtitle}
                </p>
            </div>
        </div>
        {items.length > 0 ? (
            <ul className="space-y-2">
                {items.map((item) => (
                    <BreakdownRow
                        key={item.id}
                        item={item}
                        showScore={showScore}
                        badgeClassName={getBadgeClassName(item)}
                    />
                ))}
            </ul>
        ) : (
            <p className="rounded-xl border border-dashed border-blue-200 bg-white px-3 py-4 text-center text-xs text-slate-500">
                Chưa có dữ liệu phân loại.
            </p>
        )}
    </section>
);

const InsightItem = ({ icon: Icon, label, item, type }) => {
    const missed = item ? item.incorrect + item.skipped : 0;
    const description = type === 'struggled'
        ? item ? `${missed} câu sai hoặc bỏ qua` : 'Chưa có dữ liệu'
        : item ? `${item.correct}/${item.total} câu đúng` : 'Chưa có câu đúng để so sánh';

    return (
        <div className={`rounded-xl border p-3 ${type === 'struggled'
            ? 'border-amber-200 bg-amber-50'
            : 'border-emerald-200 bg-emerald-50'}`}>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Icon className={`h-3.5 w-3.5 ${type === 'struggled' ? 'text-amber-600' : 'text-emerald-600'}`} />
                {label}
            </div>
            <p className="mt-1 truncate text-sm font-bold text-blue-950">{item?.name ?? 'Chưa có dữ liệu'}</p>
            <p className="mt-0.5 text-[11px] text-slate-600">{description}</p>
        </div>
    );
};

const ResultInsights = ({ answers, rules }) => {
    if (!rules?.showResultDetail) return null;

    const { chapters, difficulties } = deriveAnalytics(answers);
    const showScore = rules?.allowViewScore;
    const chapterInsight = getInsight(chapters);
    const difficultyInsight = getInsight(difficulties);

    return (
        <section className="rounded-3xl border border-blue-100 bg-white p-4 shadow-[0_12px_30px_rgba(25,77,182,0.06)] sm:p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Phân tích bài làm</p>
                    <h2 className="mt-1 text-h4 font-bold text-blue-950">Nhìn lại theo từng phần kiến thức</h2>
                </div>
                <span className="w-fit rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                    {chapters.length} chương
                </span>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
                <BreakdownCard
                    icon={BookOpen}
                    title="Theo chương"
                    subtitle="Số câu thuộc mỗi chapter trong bài này."
                    items={chapters}
                    showScore={showScore}
                    getBadgeClassName={() => 'border-blue-200 bg-blue-50 text-blue-800'}
                />
                <BreakdownCard
                    icon={Layers3}
                    title="Theo độ khó"
                    subtitle="So sánh kết quả giữa các mức độ câu hỏi."
                    items={difficulties}
                    showScore={showScore}
                    getBadgeClassName={(item) => item.className}
                />
            </div>

            {showScore && (
                <section className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-3 sm:p-4">
                    <h3 className="text-sm font-bold text-blue-950">Gợi ý ôn tập</h3>
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                        <InsightItem icon={CircleAlert} label="Chương cần xem lại" item={chapterInsight.mostStruggled} type="struggled" />
                        <InsightItem icon={TrendingUp} label="Chương làm tốt nhất" item={chapterInsight.best} type="best" />
                        <InsightItem icon={CircleAlert} label="Độ khó cần xem lại" item={difficultyInsight.mostStruggled} type="struggled" />
                        <InsightItem icon={TrendingUp} label="Độ khó làm tốt nhất" item={difficultyInsight.best} type="best" />
                    </div>
                </section>
            )}

            {showScore && (
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-blue-50 pt-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Đúng</span>
                    <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="h-3.5 w-3.5" /> Sai</span>
                    <span className="inline-flex items-center gap-1 text-slate-500"><MinusCircle className="h-3.5 w-3.5" /> Bỏ qua hoặc chưa chấm</span>
                </div>
            )}
        </section>
    );
};

export default ResultInsights;
