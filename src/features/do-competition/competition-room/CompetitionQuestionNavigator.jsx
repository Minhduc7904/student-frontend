import { AlertTriangle, CheckCircle2, Circle, Flag, Send, X } from 'lucide-react';
import { getQuestionSyncState } from './questionUtils';

const StatusCount = ({ icon: Icon, label, value, className }) => <div className={`rounded-xl px-3 py-2 ${className}`}><div className="flex items-center gap-1.5 text-xs font-semibold"><Icon size={14} /> {label}</div><p className="mt-1 text-xl font-bold">{value}</p></div>;

const CompetitionQuestionNavigator = ({ groups, currentQuestionId, flaggedIds, onSelect, onToggleFlag, onSubmit, onClose, mobileOpen, theme }) => {
    const questions = groups.flatMap((group) => group.items);
    const saved = questions.filter(({ question }) => getQuestionSyncState(question) === 'saved').length;
    const errors = questions.filter(({ question }) => getQuestionSyncState(question) === 'error').length;
    const pending = questions.filter(({ question }) => getQuestionSyncState(question) === 'pending').length;
    const notStarted = questions.length - saved - errors - pending;
    const isDark = theme === 'dark';
    const panelClass = isDark ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-black/25' : 'border-blue-100 bg-white text-blue-950 shadow-blue-950/10';
    const divider = isDark ? 'border-slate-700' : 'border-blue-100';
    const idleColor = isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:border-blue-500' : 'border-blue-100 bg-white text-gray-600 hover:border-blue-300';

    const content = <aside className={`flex h-full min-h-0 flex-col border shadow-lg lg:rounded-2xl ${panelClass}`}>
        <div className={`flex items-center justify-between border-b px-4 py-4 ${divider}`}>
            <div><p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Điều hướng</p><h2 className="mt-1 text-lg font-bold">Câu hỏi</h2></div>
            <button type="button" onClick={onClose} className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg lg:hidden ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-500 hover:bg-blue-50'}`} aria-label="Đóng điều hướng"><X size={19} /></button>
        </div>
        <div className={`grid grid-cols-2 gap-2 border-b p-4 ${divider}`}>
            <StatusCount icon={CheckCircle2} label="Đã lưu" value={saved} className="bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300" />
            <StatusCount icon={AlertTriangle} label="Lỗi" value={errors} className="bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300" />
            <StatusCount icon={Circle} label="Chưa làm" value={notStarted} className={isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'} />
            <StatusCount icon={Flag} label="Đánh dấu" value={flaggedIds.size} className="bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-5">
                {groups.map((group, index) => <section key={group.id}>
                    <div className="mb-2 flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Phần {index + 1}</p><h3 className="truncate text-sm font-bold">{group.title}</h3></div><span className={`shrink-0 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{group.items.length} câu</span></div>
                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
                        {group.items.map((item) => {
                            const { question, number } = item;
                            const status = getQuestionSyncState(question);
                            const isCurrent = currentQuestionId === question.questionId;
                            const flagged = flaggedIds.has(question.questionId);
                            const color = status === 'error' ? 'border-red-500 bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300' : status === 'saved' ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300' : status === 'pending' ? 'border-yellow-400 bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300' : idleColor;
                            return <button key={question.questionId} type="button" onClick={() => onSelect(question.questionId)} className={`relative flex aspect-square cursor-pointer items-center justify-center rounded-xl border text-sm font-bold transition hover:-translate-y-0.5 ${color} ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`} aria-label={`${group.title}, câu ${number}`}>{number}{flagged ? <Flag size={11} className="absolute right-1 top-1 fill-yellow-500 text-yellow-600 dark:text-yellow-300" /> : null}</button>;
                        })}
                    </div>
                </section>)}
            </div>
        </div>
        <div className={`border-t p-4 ${divider}`}>
            <button type="button" onClick={() => onToggleFlag(currentQuestionId)} disabled={!currentQuestionId} className={`mb-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'border-yellow-600/60 bg-yellow-500/15 text-yellow-200 hover:bg-yellow-500/25' : 'border-yellow-300 bg-yellow-50 text-yellow-900 hover:bg-yellow-100'}`}><Flag size={16} /> Đánh dấu câu này</button>
            <button type="button" onClick={onSubmit} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 text-sm font-bold text-white transition hover:bg-blue-900"><Send size={16} /> Nộp bài</button>
        </div>
    </aside>;

    return <><div className="hidden lg:block lg:sticky lg:top-20 lg:h-[calc(100dvh-6rem)]">{content}</div>{mobileOpen ? <div className="fixed inset-0 z-40 bg-slate-950/55 lg:hidden"><div className="ml-auto h-full w-full max-w-sm">{content}</div></div> : null}</>;
};

export default CompetitionQuestionNavigator;
