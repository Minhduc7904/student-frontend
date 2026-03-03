import { CheckCircle, XCircle, MinusCircle, Youtube, Lightbulb, User, BookCheck } from 'lucide-react';
import { MarkdownRenderer } from '../../../shared/components/markdown';

// ─── Question type labels ────────────────────────────────────────────────────
const TYPE_LABEL = {
    SINGLE_CHOICE: 'Một đáp án',
    MULTIPLE_CHOICE: 'Nhiều đáp án',
    TRUE_FALSE: 'Đúng / Sai',
    SHORT_ANSWER: 'Trả lời ngắn',
    ESSAY: 'Tự luận',
};

const DIFFICULTY_LABEL = {
    EASY: { label: 'Dễ', className: 'text-green-600 bg-green-50 border-green-200' },
    MEDIUM: { label: 'Trung bình', className: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    HARD: { label: 'Khó', className: 'text-red-600 bg-red-50 border-red-200' },
};

// ─── Correctness icon ────────────────────────────────────────────────────────
const CorrectnessIcon = ({ isCorrect }) => {
    if (isCorrect === true)
        return <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
    if (isCorrect === false)
        return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
    return <MinusCircle className="w-4 h-4 text-gray-400 shrink-0" />;
};

// ─── Statement row (SINGLE/MULTIPLE) ────────────────────────────────────────
/**
 * Trạng thái hiển thị:
 *  selected + correct  → nền xanh lá, badge "Bạn chọn ✓ Đúng"
 *  selected + wrong    → nền đỏ,     badge "Bạn chọn ✗ Sai"  + badge "Đáp án đúng" nếu showAnswer
 *  not selected + correct + showAnswer → nền xanh lá mờ, badge "Đáp án đúng"
 *  not selected + wrong / null  → nền xám
 */
const StatementRow = ({ statement, isSelected, isCorrect, showAnswer }) => {
    const isSelectedCorrect  = isSelected && showAnswer && isCorrect === true;
    const isSelectedWrong    = isSelected && showAnswer && isCorrect === false;
    const isMissedCorrect    = !isSelected && showAnswer && isCorrect === true;

    let containerClass = 'border-gray-200 bg-white';
    if (isSelectedCorrect)  containerClass = 'border-green-400 bg-green-50';
    else if (isSelectedWrong) containerClass = 'border-red-400 bg-red-50';
    else if (isMissedCorrect) containerClass = 'border-green-300 bg-green-50/60';
    else if (isSelected)     containerClass = 'border-blue-300 bg-blue-50';

    return (
        <div className={`flex flex-col gap-2 p-3 rounded-xl border ${containerClass} transition-colors`}>
            <div className="flex items-start gap-3">
                {/* Radio/checkbox dot */}
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                    ${isSelected
                        ? isSelectedCorrect  ? 'border-green-500 bg-green-500'
                        : isSelectedWrong    ? 'border-red-500 bg-red-500'
                        : 'border-blue-500 bg-blue-500'
                        : isMissedCorrect    ? 'border-green-400 bg-white'
                        : 'border-gray-300 bg-white'
                    }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    {isMissedCorrect && <div className="w-2 h-2 rounded-full bg-green-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <MarkdownRenderer content={statement.processedContent ?? statement.content} />
                </div>
            </div>

            {/* Bottom badges */}
            {(isSelected || isMissedCorrect) && (
                <div className="flex flex-wrap items-center gap-1.5 pl-8">
                    {isSelected && (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
                            ${isSelectedCorrect ? 'bg-green-100 text-green-700 border border-green-300'
                            : isSelectedWrong   ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-blue-100 text-blue-700 border border-blue-300'}`}>
                            <User className="w-3 h-3 shrink-0" />
                            Bạn chọn
                            {showAnswer && (
                                isSelectedCorrect ? ' · Đúng ✓'
                                : isSelectedWrong  ? ' · Sai ✗'
                                : ''
                            )}
                        </span>
                    )}
                    {isMissedCorrect && showAnswer && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300">
                            <BookCheck className="w-3 h-3 shrink-0" />
                            Đáp án đúng
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── True/False statement row ────────────────────────────────────────────────
const TrueFalseRow = ({ statement, selectedAnswer, showAnswer }) => {
    const isTrue    = selectedAnswer?.isTrue;   // null/undefined = chưa trả lời
    const correct   = statement.isCorrect;       // đáp án đúng từ server
    const answered  = isTrue != null;
    const isRight   = answered && isTrue === correct;
    const isWrong   = answered && isTrue !== correct;

    let containerClass = 'border-gray-200 bg-white';
    if (showAnswer) {
        if (!answered)      containerClass = 'border-gray-200 bg-gray-50';
        else if (isRight)   containerClass = 'border-green-400 bg-green-50';
        else                containerClass = 'border-red-400 bg-red-50';
    } else if (answered) {
        containerClass = 'border-blue-300 bg-blue-50';
    }

    return (
        <div className={`flex items-start gap-3 p-3 rounded-xl border ${containerClass} transition-colors`}>
            {/* Content */}
            <div className="flex-1 min-w-0">
                <MarkdownRenderer content={statement.processedContent ?? statement.content} />
            </div>

            {/* Answer area */}
            <div className="shrink-0 flex flex-col items-end gap-1.5">
                {/* Student's choice */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400 font-medium">Bạn chọn:</span>
                    {!answered ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                            Bỏ qua
                        </span>
                    ) : (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border
                            ${isTrue
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                : 'bg-red-100 text-red-600 border-red-300'
                            }`}>
                            {isTrue ? 'Đúng' : 'Sai'}
                        </span>
                    )}
                    {showAnswer && answered && (
                        isRight
                            ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    )}
                </div>

                {/* Correct answer (only show when wrong or skipped) */}
                {showAnswer && correct != null && (!answered || isWrong) && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-green-600 font-medium">Đáp án:</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300">
                            {correct ? 'Đúng' : 'Sai'}
                        </span>
                        <BookCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Answer Card ─────────────────────────────────────────────────────────────

/**
 * AnswerCard
 * Hiển thị một câu hỏi + câu trả lời của học sinh
 *
 * @param {{ answer: StudentAnswerResultDto, index: number, rules: StudentResultRulesDto }} props
 */
const AnswerCard = ({ answer, index, rules }) => {
    const { allowViewScore, showResultDetail, allowViewAnswer } = rules ?? {};
    const question = answer?.question;

    // Build card border accent based on correctness
    let accentClass = 'from-gray-300 to-gray-300';
    if (allowViewScore && answer?.isCorrect != null) {
        accentClass = answer.isCorrect
            ? 'from-green-400 to-green-500'
            : 'from-red-400 to-red-500';
    }

    // Build selectedStatementIds set for O(1) lookup
    const selectedSet = new Set(answer?.selectedStatementIds ?? []);

    // Find trueFalseanswers map: statementId → { isTrue }
    const tfMap = {};
    // Note: trueFalseAnswers is not in the DTO from the API (backend sends selectedStatementIds for true=selected)
    // Here we assume selectedStatementIds indicates "true" statements for TRUE_FALSE type

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Top accent */}
            <div className={`h-1 bg-linear-to-r ${accentClass}`} />

            <div className="px-5 sm:px-6 py-4 sm:py-5 flex flex-col gap-4">
                {/* Question header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-text-5 font-semibold text-gray-400">#{index + 1}</span>
                        {question?.type && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-gray-500">
                                {TYPE_LABEL[question.type] ?? question.type}
                            </span>
                        )}
                        {question?.difficulty && DIFFICULTY_LABEL[question.difficulty] && (
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${DIFFICULTY_LABEL[question.difficulty].className}`}>
                                {DIFFICULTY_LABEL[question.difficulty].label}
                            </span>
                        )}
                    </div>

                    {/* Score per question */}
                    {allowViewScore && answer?.maxPoints != null && (
                        <div className="flex items-center gap-1.5 shrink-0">
                            <CorrectnessIcon isCorrect={answer.isCorrect} />
                            <span className={`text-text-5 font-semibold
                                ${answer.isCorrect === true ? 'text-green-600' : answer.isCorrect === false ? 'text-red-600' : 'text-gray-500'}`}>
                                {answer.points ?? 0}/{answer.maxPoints} điểm
                            </span>
                        </div>
                    )}
                </div>

                {/* Question content */}
                {showResultDetail && question && (
                    <div className="text-gray-800">
                        <MarkdownRenderer content={question.processedContent ?? question.content} />
                    </div>
                )}

                {/* Statements – SINGLE_CHOICE / MULTIPLE_CHOICE */}
                {showResultDetail && question && ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(question.type) && (
                    <div className="flex flex-col gap-2">
                        {(question.statements ?? []).map((stmt) => (
                            <StatementRow
                                key={stmt.statementId}
                                statement={stmt}
                                isSelected={selectedSet.has(stmt.statementId)}
                                isCorrect={stmt.isCorrect}
                                showAnswer={allowViewAnswer}
                            />
                        ))}
                    </div>
                )}

                {/* Statements – TRUE_FALSE */}
                {showResultDetail && question && question.type === 'TRUE_FALSE' && (
                    <div className="flex flex-col gap-2">
                        {(question.statements ?? []).map((stmt) => (
                            <TrueFalseRow
                                key={stmt.statementId}
                                statement={stmt}
                                selectedAnswer={selectedSet.has(stmt.statementId) ? { isTrue: true } : null}
                                showAnswer={allowViewAnswer}
                            />
                        ))}
                    </div>
                )}

                {/* Short answer / Essay */}
                {showResultDetail && question && ['SHORT_ANSWER', 'ESSAY'].includes(question.type) && (
                    <div className="flex flex-col gap-2">
                        <span className="text-text-5 font-medium text-blue-700 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 shrink-0" /> Câu trả lời của bạn:
                        </span>
                        <div className={`p-3 rounded-xl border text-text-4 text-gray-800
                            ${!answer?.answer ? 'text-gray-400 italic border-gray-100 bg-gray-50' : 'border-blue-200 bg-blue-50/50'}`}>
                            {answer?.answer
                                ? <MarkdownRenderer content={answer.answer} />
                                : 'Không có câu trả lời'}
                        </div>

                        {/* Correct answer */}
                        {allowViewAnswer && question.correctAnswer && (
                            <div className="flex flex-col gap-1.5 mt-1">
                                <span className="text-text-5 text-green-600 font-medium flex items-center gap-1.5">
                                    <BookCheck className="w-3.5 h-3.5 shrink-0" /> Đáp án đúng:
                                </span>
                                <div className="p-3 rounded-xl border border-green-200 bg-green-50">
                                    <MarkdownRenderer content={question.correctAnswer} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Solution / Giải thích */}
                {allowViewAnswer && question?.solution && (
                    <details className="group">
                        <summary className="flex items-center gap-2 cursor-pointer text-text-5 font-medium text-blue-700 hover:text-blue-900 transition-colors list-none select-none">
                            <Lightbulb className="w-4 h-4 shrink-0 text-yellow-500" />
                            Xem giải thích
                            <span className="ml-auto text-[10px] text-gray-400 group-open:hidden">▼</span>
                            <span className="ml-auto text-[10px] text-gray-400 hidden group-open:inline">▲</span>
                        </summary>
                        <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-text-4 text-gray-800">
                            <MarkdownRenderer content={question.processedSolution ?? question.solution} />
                        </div>
                    </details>
                )}

                {/* YouTube solution */}
                {allowViewAnswer && question?.solutionYoutubeUrl && (
                    <a
                        href={question.solutionYoutubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-text-5 text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                        <Youtube className="w-4 h-4 shrink-0" />
                        Xem video giải thích
                    </a>
                )}
            </div>
        </div>
    );
};

export default AnswerCard;
