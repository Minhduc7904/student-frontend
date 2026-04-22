import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Lightbulb, User, X, XCircle, Youtube } from 'lucide-react';
import { Modal } from '../../../../../shared/components/modal/Modal';
import MarkdownRenderer from '../../../../../shared/components/markdown/MarkdownRenderer';
import { YoutubeEmbed } from '../../../../../shared/components';
import { resolveDifficultyMeta } from '../../../../../shared/constants';
import { getQuestionContent } from './questionUtils';
import PracticeByChapterQuestionStatements from './PracticeByChapterQuestionStatements';

const mapQuestionTypeLabel = (type) => {
    if (type === 'SINGLE_CHOICE') return 'Trắc nghiệm 1 đáp án';
    if (type === 'TRUE_FALSE') return 'Đúng/Sai';
    if (type === 'SHORT_ANSWER') return 'Tự luận ngắn';
    return type || 'Câu hỏi';
};

const resolveChapterLabels = (question) => {
    if (Array.isArray(question?.chapters)) {
        return question.chapters
            .map((item) => {
                if (typeof item === 'string') return item;
                return item?.name || item?.title || item?.chapterName || null;
            })
            .filter(Boolean);
    }

    if (question?.chapter && typeof question.chapter === 'object') {
        const value = question.chapter.name || question.chapter.title || question.chapter.chapterName;
        return value ? [value] : [];
    }

    if (typeof question?.chapter === 'string') {
        return [question.chapter];
    }

    return [];
};

const resolveAnswerState = (answer) => {
    if (!answer) {
        return {
            label: 'Bạn chưa chọn',
            className: 'bg-slate-100 text-slate-700 border-slate-200',
            icon: <User size={14} />,
        };
    }

    const isCorrect = answer?.isCorrect;

    if (isCorrect === true) {
        return {
            label: 'Đúng',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            icon: <CheckCircle2 size={14} />,
        };
    }

    if (isCorrect === false) {
        return {
            label: 'Sai',
            className: 'bg-red-50 text-red-700 border-red-100',
            icon: <XCircle size={14} />,
        };
    }

    return {
        label: 'Chưa chấm',
        className: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: <Circle size={14} />,
    };
};

const PracticeByChapterQuestionCardBase = ({ question, index, statementPrefixType, children = null }) => {
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

        updateViewport();

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', updateViewport);
            return () => mediaQuery.removeEventListener('change', updateViewport);
        }

        mediaQuery.addListener(updateViewport);
        return () => mediaQuery.removeListener(updateViewport);
    }, []);

    useEffect(() => {
        if (!isMobileViewport && isVideoModalOpen) {
            setIsVideoModalOpen(false);
        }
    }, [isMobileViewport, isVideoModalOpen]);

    const questionContent = getQuestionContent(question);
    const answer = question?.answer;
    const answerState = resolveAnswerState(answer);
    const typeLabel = mapQuestionTypeLabel(question?.type);
    const difficultyMeta = resolveDifficultyMeta(question?.difficulty);
    const gradeLabel = question?.grade?.name || question?.gradeName || question?.grade || null;
    const chapterLabels = resolveChapterLabels(question);
    const solutionContent = question?.processedSolution || question?.solution || null;
    const solutionYoutubeUrl = question?.solutionYoutubeUrl || question?.youtubeUrl || null;

    return (
        <article className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">Câu {question?.order ?? index + 1}</p>

                    {typeLabel ? (
                        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            {typeLabel}
                        </span>
                    ) : null}

                    {difficultyMeta ? (
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${difficultyMeta.className}`}>
                            {difficultyMeta.code} - {difficultyMeta.label}
                        </span>
                    ) : null}

                    {gradeLabel ? (
                        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                            Lớp {gradeLabel}
                        </span>
                    ) : null}

                    {chapterLabels.slice(0, 2).map((chapter) => (
                        <span
                            key={chapter}
                            className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700"
                        >
                            Chương: {chapter}
                        </span>
                    ))}

                    {chapterLabels.length > 2 ? (
                        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            +{chapterLabels.length - 2} chương
                        </span>
                    ) : null}
                </div>

                <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${answerState.className}`}>
                    {answerState.icon}
                    {answerState.label}
                </div>
            </div>

            {questionContent ? (
                <MarkdownRenderer content={questionContent} className="mt-2 text-sm text-slate-900" />
            ) : (
                <p className="mt-2 text-sm text-slate-600">Câu hỏi chưa có nội dung.</p>
            )}

            {children || (
                <PracticeByChapterQuestionStatements
                    statements={question?.statements}
                    statementPrefixType={statementPrefixType}
                />
            )}

            {solutionContent && question?.answer ? (
                <details className="group mt-3">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-blue-700 transition-colors hover:text-blue-900 select-none">
                        <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
                        Xem giải thích
                        <span className="ml-auto text-[10px] text-slate-400 group-open:hidden">▼</span>
                        <span className="ml-auto hidden text-[10px] text-slate-400 group-open:inline">▲</span>
                    </summary>
                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-slate-800">
                        <MarkdownRenderer content={solutionContent} />
                    </div>
                </details>
            ) : null}

            {solutionYoutubeUrl && question?.answer && isMobileViewport ? (
                <div className="mt-3">
                    <button
                        type="button"
                        onClick={() => setIsVideoModalOpen(true)}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                    >
                        <Youtube className="h-4 w-4 shrink-0" />
                        Mở video giải thích
                    </button>
                </div>
            ) : null}

            {solutionYoutubeUrl && question?.answer && !isMobileViewport ? (
                <details className="group mt-3">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700 select-none">
                        <Youtube className="h-4 w-4 shrink-0" />
                        Xem video giải thích
                        <span className="ml-auto text-[10px] text-slate-400 group-open:hidden">▼</span>
                        <span className="ml-auto hidden text-[10px] text-slate-400 group-open:inline">▲</span>
                    </summary>

                    <div className="mt-2">
                        <YoutubeEmbed
                            url={solutionYoutubeUrl}
                            title={`Video giải thích câu ${index + 1}`}
                        />
                    </div>
                </details>
            ) : null}

            <Modal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                overlayClassName="bg-black/30 backdrop-blur-sm"
            >
                <div
                    className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-700">
                            <Youtube className="h-4 w-4 shrink-0" />
                            Video giải thích
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsVideoModalOpen(false)}
                            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
                            aria-label="Đóng video giải thích"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <YoutubeEmbed
                        url={solutionYoutubeUrl}
                        title={`Video giải thích câu ${index + 1}`}
                    />
                </div>
            </Modal>
        </article>
    );
};

export default PracticeByChapterQuestionCardBase;
