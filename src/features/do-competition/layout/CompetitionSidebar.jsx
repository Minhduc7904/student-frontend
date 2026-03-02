import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Clock, Send, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, CircleDot, CircleAlert } from 'lucide-react';
import { useState } from 'react';

/**
 * QuestionButton
 * Nút điều hướng cho từng câu hỏi
 */
const QuestionButton = memo(({ index, questionId, isCurrent, isAnswered, isError, onClick }) => {
    const base = 'w-full aspect-square flex items-center justify-center rounded-lg text-text-5 font-semibold transition-all cursor-pointer select-none';

    const style = isError
        ? 'bg-red-100 text-red-700 hover:bg-red-200 ring-1 ring-red-300'
        : isCurrent
            ? 'bg-blue-800 text-white shadow-sm ring-2 ring-blue-300'
            : isAnswered
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

    return (
        <button
            type="button"
            className={`${base} ${style}`}
            onClick={() => onClick?.(questionId)}
            title={isError ? `Câu ${index} — lỗi lưu câu trả lời` : `Câu ${index}`}
        >
            {index}
        </button>
    );
});

QuestionButton.displayName = 'QuestionButton';

/**
 * SectionNavigator
 * Một section với danh sách câu hỏi dạng grid
 */
const SectionNavigator = memo(({ title, questions, currentQuestionId, answeredIds, onQuestionClick, globalOffset }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            {/* Section header */}
            <button
                type="button"
                className="cursor-pointer flex items-center justify-between gap-2 w-full group"
                onClick={() => setCollapsed(v => !v)}
            >
                <span className="text-text-5 font-semibold text-gray-700 truncate text-left">
                    {title}
                </span>
                <span className="shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors">
                    {collapsed
                        ? <ChevronDown className="w-3.5 h-3.5" />
                        : <ChevronUp className="w-3.5 h-3.5" />
                    }
                </span>
            </button>

            {/* Question grid */}
            {!collapsed && (
                <div className="grid grid-cols-5 gap-1.5">
                    {questions.map((q, idx) => (
                        <QuestionButton
                            key={q.questionId}
                            index={idx + 1}
                            questionId={q.questionId}
                            isCurrent={currentQuestionId === q.questionId}
                            isAnswered={answeredIds?.has(q.questionId)}
                            isError={!!q.isSubmitError}
                            onClick={onQuestionClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

SectionNavigator.displayName = 'SectionNavigator';

/**
 * QuestionNavigator
 * Toàn bộ phần điều hướng câu hỏi theo section
 */
const QuestionNavigator = memo(({ sections, unassignedQuestions, currentQuestionId, answeredIds, onQuestionClick }) => {
    // Tính global offset cho từng section để index câu hỏi là liên tục
    const sectionOffsets = useMemo(() => {
        const offsets = [];
        let count = 0;
        sections.forEach(s => {
            offsets.push(count);
            count += (s.questions?.length ?? 0);
        });
        return offsets;
    }, [sections]);

    const hasSections = sections.length > 0;
    const hasUnassigned = unassignedQuestions.length > 0;
    const unassignedOffset = useMemo(
        () => sections.reduce((sum, s) => sum + (s.questions?.length ?? 0), 0),
        [sections]
    );

    if (!hasSections && !hasUnassigned) return null;

    return (
        <div className="flex flex-col gap-4">
            <span className="text-text-5 font-semibold text-gray-500 uppercase tracking-wide">
                Danh sách câu hỏi
            </span>

            {/* Sections */}
            {sections.map((section, i) => (
                <SectionNavigator
                    key={section.sectionId ?? i}
                    title={section.title ?? `Phần ${i + 1}`}
                    questions={section.questions ?? []}
                    currentQuestionId={currentQuestionId}
                    answeredIds={answeredIds}
                    onQuestionClick={onQuestionClick}
                    globalOffset={sectionOffsets[i]}
                />
            ))}

            {/* Unassigned questions */}
            {hasUnassigned && (
                <SectionNavigator
                    key="unassigned"
                    title="Câu hỏi còn lại"
                    questions={unassignedQuestions}
                    currentQuestionId={currentQuestionId}
                    answeredIds={answeredIds}
                    onQuestionClick={onQuestionClick}
                    globalOffset={unassignedOffset}
                />
            )}
        </div>
    );
});

QuestionNavigator.displayName = 'QuestionNavigator';

/**
 * TimerCard
 * Hiển thị đồng hồ đếm ngược ở đầu sidebar
 */
const TimerCard = memo(({ formattedTime, remainingSeconds, totalMinutes, elapsedMinutes, isOverTime, loading }) => {
    // Tính % thời gian đã dùng
    const totalSeconds = totalMinutes * 60;
    const progressPercent = totalSeconds > 0
        ? Math.min(100, Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100))
        : 0;

    // Màu theo mức urgency
    const urgency = useMemo(() => {
        if (isOverTime) return 'overtime';
        if (remainingSeconds <= 5 * 60) return 'critical';   // <= 5 phút
        if (remainingSeconds <= 10 * 60) return 'warning';  // <= 10 phút
        return 'normal';
    }, [isOverTime, remainingSeconds]);

    const colorMap = {
        normal:   { bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',  bar: 'bg-blue-500',  icon: 'text-blue-500'  },
        warning:  { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', bar: 'bg-yellow-400', icon: 'text-yellow-500' },
        critical: { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',   bar: 'bg-red-500',   icon: 'text-red-500'   },
        overtime: { bg: 'bg-red-50',    border: 'border-red-300',   text: 'text-red-700',   bar: 'bg-red-600',   icon: 'text-red-600'   },
    };
    const c = colorMap[urgency];

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-3">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-40 bg-gray-200 rounded-xl animate-pulse mx-auto" />
                <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse" />
            </div>
        );
    }

    return (
        <div className={`rounded-2xl border ${c.border} ${c.bg} p-4 flex flex-col gap-3`}>
            {/* Label */}
            <div className={`flex items-center gap-1.5 ${c.icon}`}>
                <Clock
                    className={`w-4 h-4 shrink-0 ${
                        urgency === 'critical' || urgency === 'overtime' ? 'animate-pulse' : ''
                    }`}
                />
                <span className={`text-text-5 font-semibold ${c.text}`}>
                    {isOverTime ? 'Hết thời gian' : 'Thời gian còn lại'}
                </span>
            </div>

            {/* Countdown */}
            <div className="flex justify-center">
                <span
                    className={`
                        font-bold tabular-nums tracking-widest
                        text-[28px] md:text-[32px] leading-none
                        ${c.text}
                        ${urgency === 'critical' || urgency === 'overtime' ? 'animate-pulse' : ''}
                    `}
                >
                    {isOverTime ? '00:00' : formattedTime}
                </span>
            </div>

            {/* Progress bar */}
            {totalMinutes > 0 && (
                <div className="flex flex-col gap-1">
                    <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${c.bar}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-5 text-gray-400">0</span>
                        <span className={`text-text-5 font-medium ${c.text}`}>
                            {elapsedMinutes}/{totalMinutes} phút
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
});

TimerCard.displayName = 'TimerCard';

/**
 * StatsCard
 * Hiển thị thống kê: đã trả lời / chưa trả lời / lỗi
 */
const StatsCard = memo(({ totalQuestions, totalAnswered, totalErrors }) => {
    const unanswered = Math.max(0, (totalQuestions ?? 0) - (totalAnswered ?? 0));

    const items = [
        {
            icon: CheckCircle,
            label: 'Đã trả lời',
            value: totalAnswered ?? 0,
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-50',
            valueColor: 'text-emerald-700',
        },
        {
            icon: CircleDot,
            label: 'Chưa trả lời',
            value: unanswered,
            iconColor: 'text-gray-400',
            bgColor: 'bg-gray-50',
            valueColor: 'text-gray-600',
        },
        ...(totalErrors > 0
            ? [{
                icon: CircleAlert,
                label: 'Lỗi',
                value: totalErrors,
                iconColor: 'text-red-500',
                bgColor: 'bg-red-50',
                valueColor: 'text-red-600',
            }]
            : []),
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-3.5 flex flex-col gap-2.5">
            <span className="text-text-5 font-semibold text-gray-500 uppercase tracking-wide">
                Tiến độ
            </span>
            <div className="flex flex-col gap-1.5">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${item.bgColor}`}
                    >
                        <item.icon className={`w-4 h-4 shrink-0 ${item.iconColor}`} />
                        <span className="text-text-5 text-gray-700 flex-1">{item.label}</span>
                        <span className={`text-subhead-5 ${item.valueColor}`}>
                            {item.value}/{totalQuestions ?? 0}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
});

StatsCard.displayName = 'StatsCard';

/**
 * CompetitionSidebar
 * Thanh bên phải của trang làm bài thi
 * - Desktop (md+): luôn hiển thị dạng panel tĩnh
 * - Mobile (<md): overlay slide-in từ phải, có backdrop mờ
 */
export const CompetitionSidebar = memo(({
    competition,
    sections,
    unassignedQuestions,
    formattedTime,
    remainingSeconds,
    isOverTime,
    currentQuestionId,
    answeredIds,
    onQuestionClick,
    loading,
    isOpen,
    onClose,
    onSubmit,
    submitLoading = false,
    totalQuestions = 0,
    totalAnswered = 0,
    totalErrors = 0,
}) => {
    const totalMinutes = competition?.durationMinutes ?? 0;
    // elapsedMinutes tính từ durationMinutes và remainingSeconds
    const elapsedMinutes = useMemo(() => {
        if (!totalMinutes || remainingSeconds == null) return 0;
        return Math.max(0, totalMinutes - Math.ceil(remainingSeconds / 60));
    }, [totalMinutes, remainingSeconds]);

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                shrink-0
                overflow-y-auto custom-scrollbar
                border-l border-gray-200
                bg-white
                flex flex-col
                transition-transform duration-300 ease-in-out
                fixed top-20 right-0 z-50 w-72 h-[calc(100dvh-5rem)]
                md:relative md:top-auto md:translate-x-0 md:w-60 md:h-full lg:w-75 xl:w-80
                ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
            {/* Scrollable area */}
            <div className="flex-1 flex flex-col gap-4 px-4 md:px-5 py-5">
                {/* Timer */}
                <TimerCard
                    formattedTime={formattedTime}
                    remainingSeconds={remainingSeconds ?? 0}
                    totalMinutes={totalMinutes}
                    elapsedMinutes={elapsedMinutes}
                    isOverTime={isOverTime}
                    loading={loading}
                />

                {/* Stats */}
                {!loading && (
                    <StatsCard
                        totalQuestions={totalQuestions}
                        totalAnswered={totalAnswered}
                        totalErrors={totalErrors}
                    />
                )}

                {/* Question navigator */}
                {loading ? (
                    <div className="flex flex-col gap-3">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="grid grid-cols-5 gap-2">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <QuestionNavigator
                        sections={sections ?? []}
                        unassignedQuestions={unassignedQuestions ?? []}
                        currentQuestionId={currentQuestionId}
                        answeredIds={answeredIds}
                        onQuestionClick={onQuestionClick}
                    />
                )}
            </div>

            {/* Submit button - fixed at bottom */}
            <div className="shrink-0 px-4 md:px-5 py-4 border-t border-gray-100 bg-white">
                {isOverTime && (
                    <div className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="text-text-5 text-red-600 font-medium">Đã hết thời gian làm bài</span>
                    </div>
                )}
                <button
                    onClick={onSubmit}
                    disabled={submitLoading}
                    className="
                        cursor-pointer
                        w-full flex items-center justify-center gap-2
                        px-4 py-2.5 rounded-2xl
                        bg-blue-800 hover:bg-blue-900 active:scale-[0.98]
                        text-white text-text-4 font-semibold
                        transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >
                    <Send className="w-4 h-4 shrink-0" />
                    {submitLoading ? 'Đang nộp...' : 'Nộp bài'}
                </button>
            </div>
            </aside>
        </>
    );
});

CompetitionSidebar.propTypes = {
    competition: PropTypes.object,
    sections: PropTypes.array,
    unassignedQuestions: PropTypes.array,
    formattedTime: PropTypes.string,
    remainingSeconds: PropTypes.number,
    isOverTime: PropTypes.bool,
    currentQuestionId: PropTypes.number,
    answeredIds: PropTypes.instanceOf(Set),
    onQuestionClick: PropTypes.func,
    loading: PropTypes.bool,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    submitLoading: PropTypes.bool,
    totalQuestions: PropTypes.number,
    totalAnswered: PropTypes.number,
    totalErrors: PropTypes.number,
};

CompetitionSidebar.displayName = 'CompetitionSidebar';

export default CompetitionSidebar;
