import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

const CompetitionQuestionControls = ({ hasPrevious, hasNext, onPrevious, onNext, onSubmit, theme }) => {
    const isDark = theme === 'dark';
    const secondaryClass = isDark ? 'border-slate-700 bg-slate-900 text-blue-200 hover:bg-slate-800' : 'border-blue-100 bg-white text-blue-800 hover:bg-blue-50';

    return <nav className="mt-4 flex items-center justify-between gap-3" aria-label="Điều hướng câu hỏi">
        <button type="button" onClick={onPrevious} disabled={!hasPrevious} className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:px-4 ${secondaryClass}`} aria-label="Câu trước">
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Câu trước</span>
        </button>
        <button type="button" onClick={onSubmit} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 text-sm font-bold text-white transition hover:bg-blue-900 sm:hidden">
            <Send size={16} /> Nộp bài
        </button>
        <button type="button" onClick={onNext} disabled={!hasNext} className="inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:px-4" aria-label="Câu sau">
            <span className="hidden sm:inline">Câu sau</span>
            <ArrowRight size={17} />
        </button>
    </nav>;
};

export default CompetitionQuestionControls;
