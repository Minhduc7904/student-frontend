import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, CloudUpload, Flag, RotateCw } from 'lucide-react';
import { MarkdownRenderer } from '../../../shared/components';
import { getQuestionSyncState } from './questionUtils';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const AnswerState = ({ state, onRetry, theme }) => {
    if (state === 'saved') return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400"><CheckCircle2 size={15} /> Đã lưu</span>;
    if (state === 'pending') return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-700 dark:text-yellow-300"><CloudUpload size={15} className="animate-pulse" /> Đang lưu</span>;
    if (state === 'error') return <button type="button" onClick={onRetry} className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400"><AlertTriangle size={15} /> Chưa lưu, thử lại <RotateCw size={14} /></button>;
    return <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Chưa chọn đáp án</span>;
};

const CompetitionQuestionPanel = ({ item, onAnswer, onRetry, onToggleFlag, isFlagged, theme, fontScale }) => {
    const { question, number, sectionName } = item;
    const [textValue, setTextValue] = useState(question.answer?.answer ?? '');
    const syncState = getQuestionSyncState(question);
    const selectedIds = useMemo(() => new Set(question.answer?.selectedStatementIds ?? []), [question.answer]);
    const trueFalseAnswers = useMemo(() => new Map((question.answer?.trueFalseAnswers ?? []).map((answer) => [answer.statementId, answer.isTrue])), [question.answer]);
    const isText = question.type === 'SHORT_ANSWER' || question.type === 'ESSAY';
    const isDark = theme === 'dark';

    useEffect(() => {
        setTextValue(question.answer?.answer ?? '');
    }, [question.questionId]);

    useEffect(() => {
        if (!isText || textValue === (question.answer?.answer ?? '')) return undefined;
        const timer = window.setTimeout(() => onAnswer({ type: question.type, answer: textValue }), 650);
        return () => window.clearTimeout(timer);
    }, [isText, onAnswer, question.answer?.answer, question.type, textValue]);

    const surface = isDark ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-black/20' : 'border-blue-100 bg-white text-blue-950 shadow-blue-950/5';
    const divider = isDark ? 'border-slate-700' : 'border-blue-100';
    const muted = isDark ? 'text-slate-400' : 'text-gray-600';
    const statements = [...(question.statements ?? [])].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

    return (
        <article id={`competition-question-${question.questionId}`} className={`scroll-mt-24 overflow-hidden rounded-2xl border shadow-sm ${surface}`} style={{ fontSize: `${fontScale}rem` }}>
            <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 ${divider}`}>
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">{sectionName}</p>
                    <p className={`mt-1 text-sm ${muted}`}>Câu {number}</p>
                </div>
                <div className="flex items-center gap-2">
                    <AnswerState state={syncState} onRetry={onRetry} theme={theme} />
                    <button type="button" onClick={onToggleFlag} className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition ${isFlagged ? 'border-yellow-400 bg-yellow-100 text-yellow-800 dark:border-yellow-500 dark:bg-yellow-500/15 dark:text-yellow-300' : isDark ? 'border-slate-700 text-slate-400 hover:border-yellow-500 hover:text-yellow-300' : 'border-blue-100 text-gray-500 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-800'}`} aria-label={isFlagged ? 'Bỏ đánh dấu câu hỏi' : 'Đánh dấu câu hỏi'} title={isFlagged ? 'Bỏ đánh dấu' : 'Đánh dấu câu hỏi'}>
                        <Flag size={16} className={isFlagged ? 'fill-current' : ''} />
                    </button>
                </div>
            </div>
            {syncState === 'error' ? <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/45 dark:text-red-300"><AlertTriangle size={17} /> Đáp án bạn đang chọn chưa được lưu. Hệ thống không khôi phục về đáp án cũ.</div> : null}
            <div className="px-4 py-5 sm:px-6 sm:py-7">
                <div className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-sm font-bold text-white">{number}</span>
                    <div className={`min-w-0 flex-1 leading-7 ${isDark ? 'text-slate-100' : 'text-blue-950'}`}>
                        <MarkdownRenderer content={question.processedContent ?? question.content ?? `Câu hỏi ${number}`} imgClassNameSize="max-w-full max-h-[30rem]" />
                    </div>
                </div>
                {isText ? (
                    <textarea value={textValue} onChange={(event) => setTextValue(event.target.value)} rows={question.type === 'ESSAY' ? 10 : 4} placeholder={question.type === 'ESSAY' ? 'Nhập bài làm của bạn...' : 'Nhập câu trả lời...'} className={`mt-6 w-full resize-y rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 ${isDark ? 'border-slate-600 bg-slate-800 text-white placeholder:text-slate-500' : 'border-blue-100 bg-white text-blue-950 placeholder:text-gray-400'}`} />
                ) : question.type === 'TRUE_FALSE' ? (
                    <div className="mt-6 space-y-3">
                        {statements.map((statement, index) => {
                            const value = trueFalseAnswers.get(statement.statementId);
                            const statementSurface = isDark ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-blue-50/50';
                            const optionSurface = isDark ? 'bg-slate-700 text-blue-200' : 'bg-white text-blue-800';
                            const neutralButton = isDark ? 'border-slate-600 bg-slate-900 text-slate-200 hover:border-green-500' : 'border-blue-100 bg-white text-gray-600 hover:border-green-400';
                            return <div key={statement.statementId} className={`flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-start ${statementSurface}`}><div className="flex min-w-0 flex-1 gap-3"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${optionSurface}`}>{OPTION_LABELS[index] ?? index + 1}</span><div className="min-w-0"><MarkdownRenderer content={statement.processedContent ?? statement.content ?? ''} imgClassNameSize="max-w-full max-h-56" /></div></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => onAnswer({ type: question.type, statementId: statement.statementId, isTrue: true })} className={`h-9 cursor-pointer rounded-lg px-3 text-sm font-bold ${value === true ? 'bg-green-600 text-white' : neutralButton}`}>Đúng</button><button type="button" onClick={() => onAnswer({ type: question.type, statementId: statement.statementId, isTrue: false })} className={`h-9 cursor-pointer rounded-lg px-3 text-sm font-bold ${value === false ? 'bg-red-600 text-white' : neutralButton.replace('hover:border-green-500', 'hover:border-red-500').replace('hover:border-green-400', 'hover:border-red-400')}`}>Sai</button></div></div>;
                        })}
                    </div>
                ) : (
                    <div className="mt-6 space-y-3">
                        {statements.map((statement, index) => {
                            const selected = selectedIds.has(statement.statementId);
                            const optionClass = selected
                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200 dark:bg-blue-950/60 dark:ring-blue-700'
                                : isDark ? 'border-slate-700 bg-slate-800 hover:border-blue-500' : 'border-blue-100 bg-white hover:border-blue-300 hover:bg-blue-50/60';
                            return <button key={statement.statementId} type="button" onClick={() => onAnswer({ type: question.type, statementId: statement.statementId })} className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition ${optionClass}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${selected ? 'bg-blue-800 text-white' : isDark ? 'bg-slate-700 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>{OPTION_LABELS[index] ?? index + 1}</span><div className="min-w-0 flex-1"><MarkdownRenderer content={statement.processedContent ?? statement.content ?? ''} imgClassNameSize="max-w-full max-h-56" /></div></button>;
                        })}
                    </div>
                )}
            </div>
        </article>
    );
};

export default CompetitionQuestionPanel;
