import { memo, useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Layers, BookOpen } from 'lucide-react';
import { QuestionCard } from './QuestionCard';

// ─── Tab Loading Skeleton ────────────────────────────────────────────────────
const TabSkeleton = () => (
    <div className="flex gap-2 px-4 md:px-6 lg:px-8 py-3 border-b border-gray-100">
        {[100, 80, 90].map((w, i) => (
            <div
                key={i}
                className="h-8 rounded-lg bg-gray-200 animate-pulse shrink-0"
                style={{ width: w }}
            />
        ))}
    </div>
);

// ─── Question Loading Skeleton ───────────────────────────────────────────────
const QuestionSkeleton = () => (
    <div className="flex flex-col gap-5 px-4 md:px-6 lg:px-8 py-6">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                <div className="flex flex-col gap-2 mt-1">
                    {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-9 w-full bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// ─── Section Tabs ────────────────────────────────────────────────────────────
const SectionTabs = memo(({ tabs, activeIndex, onChange }) => (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex overflow-x-auto custom-scrollbar px-4 md:px-6 lg:px-8">
            {tabs.map((tab, idx) => {
                const isActive = idx === activeIndex;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(idx)}
                        className={`
                            relative shrink-0 flex items-center gap-1.5
                            px-4 py-3 text-text-5 font-semibold
                            transition-colors whitespace-nowrap
                            ${
                                isActive
                                    ? 'text-blue-800'
                                    : 'text-gray-500 hover:text-gray-800'
                            }
                        `}
                    >
                        {tab.icon && <tab.icon className="w-3.5 h-3.5 shrink-0" />}
                        <span>{tab.label}</span>
                        {tab.count != null && (
                            <span
                                className={`
                                    text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                                    ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-500'
                                    }
                                `}
                            >
                                {tab.count}
                            </span>
                        )}
                        {/* Active underline */}
                        {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-800" />
                        )}
                    </button>
                );
            })}
        </div>
    </div>
));

SectionTabs.displayName = 'SectionTabs';

// ─── Question List ───────────────────────────────────────────────────────────
const QuestionList = memo(({ questions, globalOffset, onAnswerSelect, onSelect, currentQuestionId }) => {
    if (!questions || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <BookOpen className="w-10 h-10 mb-3 opacity-40" />
                <span className="text-text-5">Không có câu hỏi nào trong phần này</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 px-4 md:px-6 lg:px-8 py-6">
            {questions.map((question, idx) => (
                <QuestionCard
                    key={question.questionId}
                    question={question}
                    questionNumber={globalOffset + idx + 1}
                    isCurrent={currentQuestionId === question.questionId}
                    onSelect={onSelect}
                    onAnswerSelect={onAnswerSelect}
                />
            ))}
        </div>
    );
});

QuestionList.displayName = 'QuestionList';
QuestionList.propTypes = {
    questions: PropTypes.array,
    globalOffset: PropTypes.number,
    onAnswerSelect: PropTypes.func,
    onSelect: PropTypes.func,
    currentQuestionId: PropTypes.number,
};

// ─── CompetitionContent ──────────────────────────────────────────────────────
/**
 * CompetitionContent
 * Vùng nội dung bên trái
 * - Tab sticky căn chỉnh đúng với scroll container
 * - Nội dung cuộn độc lập sidebar
 */
export const CompetitionContent = memo(({ sections, unassignedQuestions, loading, onAnswerSelect, onSelect, currentQuestionId, scrollToRef }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    // Build tab list
    const tabs = useMemo(() => {
        const result = (sections ?? []).map((s, i) => ({
            key: `section-${s.sectionId ?? i}`,
            label: s.title ?? `Phần ${i + 1}`,
            icon: Layers,
            count: s.questions?.length ?? 0,
            questions: s.questions ?? [],
        }));

        if (unassignedQuestions?.length > 0) {
            result.push({
                key: 'unassigned',
                label: 'Câu hỏi còn lại',
                icon: BookOpen,
                count: unassignedQuestions.length,
                questions: unassignedQuestions,
            });
        }

        return result;
    }, [sections, unassignedQuestions]);

    // Global offset: số câu hỏi của các tab trước
    const globalOffset = useMemo(() => {
        let offset = 0;
        for (let i = 0; i < activeIndex; i++) {
            offset += tabs[i]?.count ?? 0;
        }
        return offset;
    }, [activeIndex, tabs]);

    const activeQuestions = tabs[activeIndex]?.questions ?? [];

    // Expose scrollToQuestion so parent can trigger scroll+tab-switch on sidebar click
    const SCROLL_OFFSET = 64;
    useEffect(() => {
        if (!scrollToRef) return;
        scrollToRef.current = (questionId) => {
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].questions.some((q) => q.questionId === questionId)) {
                    setActiveIndex(i);
                    setTimeout(() => {
                        const container = scrollContainerRef.current;
                        const el = document.getElementById(`question-${questionId}`);
                        if (!el || !container) return;
                        const containerRect = container.getBoundingClientRect();
                        const elRect = el.getBoundingClientRect();
                        const targetScrollTop =
                            container.scrollTop + (elRect.top - containerRect.top) - SCROLL_OFFSET;
                        container.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
                    }, 60);
                    break;
                }
            }
        };
    }, [tabs, scrollToRef]);

    return (
        // overflow-y-auto → scroll container — sticky top-0 bên trong sẽ dính vào đầu container này
        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {loading ? (
                <>
                    <TabSkeleton />
                    <QuestionSkeleton />
                </>
            ) : (
                <>
                    {tabs.length > 0 && (
                        <SectionTabs
                            tabs={tabs}
                            activeIndex={activeIndex}
                            onChange={setActiveIndex}
                        />
                    )}
                    <QuestionList
                        questions={activeQuestions}
                        globalOffset={globalOffset}
                        onAnswerSelect={onAnswerSelect}
                        onSelect={onSelect}
                        currentQuestionId={currentQuestionId}
                    />
                </>
            )}
        </main>
    );
});

CompetitionContent.propTypes = {
    sections: PropTypes.array,
    unassignedQuestions: PropTypes.array,
    loading: PropTypes.bool,
    onAnswerSelect: PropTypes.func,
    onSelect: PropTypes.func,
    currentQuestionId: PropTypes.number,
    scrollToRef: PropTypes.object,
};

CompetitionContent.displayName = 'CompetitionContent';

export default CompetitionContent;
