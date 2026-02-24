import { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { MarkdownRenderer } from '../../../shared/components';
import { useDebounce } from '../../../shared/hooks';

// ─── Statement Option (SINGLE_CHOICE / MULTIPLE_CHOICE) ──────────────────────
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const StatementOption = memo(({ statement, index, selected, onClick }) => {
    const label = OPTION_LABELS[index] ?? String(index + 1);
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left
                transition-all duration-150 group
                ${
                    selected
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-400'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
                }
            `}
        >
            <span
                className={`
                    shrink-0 w-6 h-6 flex items-center justify-center rounded-full
                    text-[11px] font-bold mt-0.5 transition-colors
                    ${
                        selected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                    }
                `}
            >
                {label}
            </span>
            <div className="flex-1 min-w-0">
                <MarkdownRenderer
                    content={statement.processedContent ?? statement.content ?? ''}
                    imgClassNameSize="max-w-full max-h-48"
                />
            </div>
        </button>
    );
});

StatementOption.displayName = 'StatementOption';
StatementOption.propTypes = {
    statement: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
};

// ─── True/False Statement Row (TRUE_FALSE) ────────────────────────────────────
const TrueFalseRow = memo(({ statement, index, currentValue, onSelect }) => {
    const label = OPTION_LABELS[index] ?? String(index + 1);
    const isTrue = currentValue === true;
    const isFalse = currentValue === false;
    const answered = currentValue !== undefined;

    return (
        <div
            className={`
                flex items-start gap-3 px-4 py-3 rounded-xl border
                transition-colors duration-150
                ${answered ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}
            `}
        >
            {/* Index badge */}
            <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold mt-0.5">
                {label}
            </span>

            {/* Statement content */}
            <div className="flex-1 min-w-0">
                <MarkdownRenderer
                    content={statement.processedContent ?? statement.content ?? ''}
                    imgClassNameSize="max-w-full max-h-48"
                />
            </div>

            {/* True / False toggle buttons */}
            <div className="shrink-0 flex gap-1.5 mt-0.5">
                <button
                    type="button"
                    onClick={() => onSelect(statement.statementId, true)}
                    className={`
                        px-3 py-1 rounded-lg text-[12px] font-semibold border transition-all duration-150
                        ${
                            isTrue
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                : 'bg-white border-gray-300 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }
                    `}
                >
                    Đúng
                </button>
                <button
                    type="button"
                    onClick={() => onSelect(statement.statementId, false)}
                    className={`
                        px-3 py-1 rounded-lg text-[12px] font-semibold border transition-all duration-150
                        ${
                            isFalse
                                ? 'bg-red-500 border-red-500 text-white shadow-sm'
                                : 'bg-white border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50'
                        }
                    `}
                >
                    Sai
                </button>
            </div>
        </div>
    );
});

TrueFalseRow.displayName = 'TrueFalseRow';
TrueFalseRow.propTypes = {
    statement: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    currentValue: PropTypes.bool,
    onSelect: PropTypes.func,
};

// ─── Short Answer / Essay Input (SHORT_ANSWER, ESSAY) ─────────────────────────
const ShortAnswerInput = memo(({ question, onAnswerSelect }) => {
    const isEssay = question.type === 'ESSAY';
    const savedAnswer = question.answer?.answer ?? '';

    const [inputValue, setInputValue] = useState(savedAnswer);
    const lastSubmittedRef = useRef(savedAnswer);
    const debouncedValue = useDebounce(inputValue, 1000);

    // Sync state if the saved answer changes from outside (e.g. initial load)
    useEffect(() => {
        setInputValue(savedAnswer);
        lastSubmittedRef.current = savedAnswer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.questionId]);

    // Submit when debounced value settles and actually changed
    useEffect(() => {
        if (debouncedValue === lastSubmittedRef.current) return;
        lastSubmittedRef.current = debouncedValue;
        onAnswerSelect?.({
            questionId: question.questionId,
            questionType: question.type,
            answerText: debouncedValue,
        });
    }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const isPending = inputValue !== debouncedValue;

    return (
        <div className="flex flex-col gap-2">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={isEssay ? 8 : 3}
                placeholder={isEssay ? 'Nhập bài làm của bạn...' : 'Nhập câu trả lời...'}
                className="
                    w-full resize-y rounded-xl border px-4 py-3
                    text-[14px] text-gray-800 placeholder-gray-400
                    outline-none transition-all duration-150
                    bg-white border-gray-200
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                "
            />
            {/* Debounce status indicator */}
            <div className="flex items-center gap-1.5 h-4">
                {isPending ? (
                    <>
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
                        <span className="text-[11px] text-gray-400">Tự động lưu sau 1 giây...</span>
                    </>
                ) : inputValue !== '' ? (
                    <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="text-[11px] text-gray-400">Đã lưu</span>
                    </>
                ) : null}
            </div>
        </div>
    );
});

ShortAnswerInput.displayName = 'ShortAnswerInput';
ShortAnswerInput.propTypes = {
    question: PropTypes.object.isRequired,
    onAnswerSelect: PropTypes.func,
};

// ─── Question Card ────────────────────────────────────────────────────────────
export const QuestionCard = memo(({ question, questionNumber, isCurrent, onSelect, onAnswerSelect }) => {
    const isTrueFalse = question.type === 'TRUE_FALSE';
    const isShortAnswer = question.type === 'SHORT_ANSWER' || question.type === 'ESSAY';

    // SINGLE_CHOICE / MULTIPLE_CHOICE: set of selected statement IDs
    const selectedIds = useMemo(
        () => new Set(question.answer?.selectedStatementIds ?? []),
        [question.answer]
    );

    // TRUE_FALSE: map statementId -> boolean
    const trueFalseMap = useMemo(() => {
        const map = new Map();
        (question.answer?.trueFalseAnswers ?? []).forEach(({ statementId, isTrue }) => {
            map.set(statementId, isTrue);
        });
        return map;
    }, [question.answer]);

    const statements = useMemo(
        () => [...(question.statements ?? [])].sort((a, b) => a.order - b.order),
        [question.statements]
    );

    // SINGLE_CHOICE / MULTIPLE_CHOICE click
    const handleStatementClick = useCallback(
        (statement) => {
            if (!onAnswerSelect) return;
            onAnswerSelect({
                questionId: question.questionId,
                questionType: question.type,
                statementId: statement.statementId,
            });
        },
        [question.questionId, question.type, onAnswerSelect]
    );

    // TRUE_FALSE: pass statementId + isTrue
    const handleTrueFalseSelect = useCallback(
        (statementId, isTrue) => {
            if (!onAnswerSelect) return;
            onAnswerSelect({
                questionId: question.questionId,
                questionType: 'TRUE_FALSE',
                statementId,
                isTrue,
            });
        },
        [question.questionId, onAnswerSelect]
    );

    return (
        <div
            id={`question-${question.questionId}`}
            onClick={() => onSelect?.(question.questionId)}
            className={`
                bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-200
                ${
                    question.isSubmitError
                        ? 'border-red-300 shadow-red-100'
                        : isCurrent
                            ? 'border-blue-400 shadow-md shadow-blue-100 ring-1 ring-blue-200'
                            : 'border-gray-100'
                }
            `}
        >
            {/* Current indicator strip */}
            {isCurrent && !question.isSubmitError && (
                <div className="h-1 w-full bg-linear-to-r from-blue-600 to-blue-400" />
            )}
            {/* Error banner */}
            {question.isSubmitError && (
                <div className="flex items-center gap-2 px-5 py-2 bg-red-50 border-b border-red-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="text-[12px] font-medium text-red-600">
                        Lưu câu trả lời thất bại — vui lòng thử lại
                    </span>
                </div>
            )}
            {/* Question content */}
            <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
                <span className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-white text-[11px] font-bold mt-0.5 transition-colors ${
                    isCurrent ? 'bg-blue-600 ring-2 ring-blue-300 ring-offset-1' : 'bg-blue-800'
                }`}>
                    {questionNumber}
                </span>
                <div className="flex-1 min-w-0 text-gray-900">
                    <MarkdownRenderer
                        content={question.processedContent ?? question.content ?? `Câu hỏi ${questionNumber}`}
                        imgClassNameSize="max-w-full max-h-[500px]"
                    />
                </div>
            </div>

            {/* Answer options */}
            {isShortAnswer ? (
                <div className="px-5 py-4">
                    <ShortAnswerInput question={question} onAnswerSelect={onAnswerSelect} />
                </div>
            ) : statements.length > 0 && (
                <div className="flex flex-col gap-2 px-5 py-4">
                    {isTrueFalse ? (
                        statements.map((stmt, idx) => (
                            <TrueFalseRow
                                key={stmt.statementId}
                                statement={stmt}
                                index={idx}
                                currentValue={trueFalseMap.get(stmt.statementId)}
                                onSelect={handleTrueFalseSelect}
                            />
                        ))
                    ) : (
                        statements.map((stmt, idx) => (
                            <StatementOption
                                key={stmt.statementId}
                                statement={stmt}
                                index={idx}
                                selected={selectedIds.has(stmt.statementId)}
                                onClick={() => handleStatementClick(stmt)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
});

QuestionCard.displayName = 'QuestionCard';
QuestionCard.propTypes = {
    question: PropTypes.object.isRequired,
    questionNumber: PropTypes.number.isRequired,
    isCurrent: PropTypes.bool,
    onSelect: PropTypes.func,
    onAnswerSelect: PropTypes.func,
};

export default QuestionCard;
