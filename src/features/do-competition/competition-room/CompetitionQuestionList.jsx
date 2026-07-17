import { Send } from 'lucide-react';
import CompetitionQuestionPanel from './CompetitionQuestionPanel';

const CompetitionQuestionList = ({ groups, currentQuestionId, flaggedIds, onAnswer, onRetry, onToggleFlag, onSubmit, theme, fontScale }) => {
    const isDark = theme === 'dark';

    return <div className="space-y-8">
        {groups.map((group, index) => (
            <section key={group.id} id={`competition-group-${group.id}`} className="scroll-mt-24">
                <header className={`mb-4 border-b pb-3 ${isDark ? 'border-slate-700' : 'border-blue-100'}`}>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Phần {index + 1}</p>
                    <h2 className={`mt-1 text-xl font-bold ${isDark ? 'text-slate-100' : 'text-blue-950'}`}>{group.title}</h2>
                    <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{group.items.length} câu hỏi</p>
                </header>
                <div className="space-y-4">
                    {group.items.map((item) => <CompetitionQuestionPanel key={item.question.questionId} item={item} onAnswer={(change) => onAnswer(item, change)} onRetry={() => onRetry(item.question.questionId)} onToggleFlag={() => onToggleFlag(item.question.questionId)} isFlagged={flaggedIds.has(item.question.questionId)} isCurrent={currentQuestionId === item.question.questionId} theme={theme} fontScale={fontScale} />)}
                </div>
            </section>
        ))}
        <button type="button" onClick={onSubmit} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 text-sm font-bold text-white transition hover:bg-blue-900 sm:hidden"><Send size={16} /> Nộp bài</button>
    </div>;
};

export default CompetitionQuestionList;
