import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MarkdownRenderer from '../../../../../shared/components/markdown/MarkdownRenderer';
import { CustomRadio, CustomTextInput } from '../../../../../shared/components';
import { useDebounce } from '../../../../../shared/hooks';
import {
    selectPracticeByChapterSubmitAnswerErrorByQuestionId,
    selectPracticeByChapterSubmitAnswerLoadingByQuestionId,
    submitPracticeByChapterQuestionAnswer,
} from '../../store/practiceByChapterSlice';
import PracticeByChapterQuestionCardBase from './PracticeByChapterQuestionCardBase';
import {
    getSortedStatements,
    resolveCurrentAnswer,
    resolveQuestionAnswerId,
    getStatementContent,
    getStatementPrefix,
    resolveSelectedStatementId,
    resolveShortAnswer,
    resolveTrueFalseMap,
} from './questionUtils';

const DECIMAL_INPUT_PATTERN = /^-?\d*(?:[.,]\d*)?$/;
const DECIMAL_FINAL_PATTERN = /^-?\d+(?:[.,]\d+)?$/;
const ANSWER_SUBMIT_DEBOUNCE_MS = 500;

const submitAnswer = (dispatch, payload) => {
    if (!payload?.questionId) return;
    dispatch(submitPracticeByChapterQuestionAnswer(payload));
};

const resolveTrueFalseAnswers = (question) => {
    const map = resolveTrueFalseMap(question);
    return Array.from(map.entries()).map(([statementId, isTrue]) => ({ statementId, isTrue }));
};

const StatementContent = memo(({ statement }) => {
    const content = getStatementContent(statement);

    if (!content) {
        return <p className="text-sm text-gray-500">Không có nội dung mệnh đề.</p>;
    }

    return <MarkdownRenderer content={content} className="min-w-0 flex-1 text-sm text-gray-700" />;
});

export const PracticeByChapterSingleChoiceQuestionCard = ({ question, index }) => {
    const dispatch = useDispatch();
    const statements = useMemo(() => getSortedStatements(question), [question]);
    const questionId = question?.questionId;
    const submitLoading = useSelector((state) => selectPracticeByChapterSubmitAnswerLoadingByQuestionId(state, questionId));
    const submitError = useSelector((state) => selectPracticeByChapterSubmitAnswerErrorByQuestionId(state, questionId));
    const [selectedStatementId, setSelectedStatementId] = useState(() => resolveSelectedStatementId(question));
    const debouncedSelectedStatementId = useDebounce(selectedStatementId, ANSWER_SUBMIT_DEBOUNCE_MS);
    const lastSubmittedRef = useRef(resolveSelectedStatementId(question));

    useEffect(() => {
        const initialSelected = resolveSelectedStatementId(question);
        setSelectedStatementId(initialSelected);
        lastSubmittedRef.current = initialSelected;
    }, [question]);

    useEffect(() => {
        if (debouncedSelectedStatementId == null) return;
        if (String(lastSubmittedRef.current) === String(debouncedSelectedStatementId)) return;

        lastSubmittedRef.current = debouncedSelectedStatementId;
        const questionAnswerId = resolveQuestionAnswerId(question);
        submitAnswer(dispatch, {
            questionId,
            questionAnswerId: questionAnswerId ?? undefined,
            selectedStatementIds: [debouncedSelectedStatementId],
        });
    }, [debouncedSelectedStatementId, dispatch, questionId, question]);

    const hasAnswered = Boolean(resolveCurrentAnswer(question));

    const handleSelect = (statementId) => {
        if (statementId == null) return;
        setSelectedStatementId(statementId);
    };

    return (
        <PracticeByChapterQuestionCardBase question={question} index={index} statementPrefixType="SINGLE_CHOICE">
            <div className="mt-4 space-y-3">
                {statements.map((statement, statementIndex) => {
                    const statementId = statement?.statementId;
                    const statementPrefix = getStatementPrefix('SINGLE_CHOICE', statementIndex);
                    const isSelected = String(selectedStatementId) === String(statementId);
                    const isCorrect = statement?.isCorrect === true;

                    const optionClassName = hasAnswered
                        ? isSelected && isCorrect
                            ? 'border-emerald-400 bg-emerald-50'
                            : isSelected
                                ? 'border-rose-400 bg-rose-50'
                                : isCorrect
                                    ? 'border-emerald-200 bg-emerald-50/60'
                                    : 'border-slate-200 bg-white'
                        : isSelected
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40';

                    const indicatorClassName = hasAnswered
                        ? isSelected && isCorrect
                            ? 'border-emerald-600 bg-emerald-600'
                            : isSelected
                                ? 'border-rose-600 bg-rose-600'
                                : isCorrect
                                    ? 'border-emerald-500 bg-emerald-100'
                                    : 'border-slate-300 bg-white'
                        : isSelected
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-slate-300 bg-white';

                    return (
                        <div
                            key={statementId ?? `single-choice-${statementIndex + 1}`}
                            onClick={() => handleSelect(statementId)}
                            className={`w-full cursor-pointer rounded-xl border px-3 py-2 text-left transition-colors ${optionClassName}`}
                        >
                            <div className="flex items-start gap-2">
                                <CustomRadio
                                    checked={isSelected}
                                    onChange={() => handleSelect(statementId)}
                                    ariaLabel={`chon dap an ${statementPrefix}`}
                                    className="mt-0.5 shrink-0"
                                />
                                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full border ${indicatorClassName}`} />
                                <span className="mt-0.5 shrink-0 text-sm font-semibold text-gray-900">
                                    {statementPrefix}
                                </span>
                                <StatementContent statement={statement} />

                                {hasAnswered ? (
                                    <div className="ml-auto flex shrink-0 items-center gap-1.5">
                                        {isSelected ? (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                Bạn chọn
                                            </span>
                                        ) : null}
                                        {isCorrect ? (
                                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                Đáp án đúng
                                            </span>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>

            {submitLoading ? <p className="mt-2 text-xs text-blue-600">Đang lưu đáp án...</p> : null}
            {submitError ? <p className="mt-2 text-xs text-red-600">{String(submitError)}</p> : null}
        </PracticeByChapterQuestionCardBase>
    );
};

export const PracticeByChapterTrueFalseQuestionCard = ({ question, index }) => {
    const dispatch = useDispatch();
    const statements = useMemo(() => getSortedStatements(question), [question]);
    const questionId = question?.questionId;
    const submitLoading = useSelector((state) => selectPracticeByChapterSubmitAnswerLoadingByQuestionId(state, questionId));
    const submitError = useSelector((state) => selectPracticeByChapterSubmitAnswerErrorByQuestionId(state, questionId));

    const [trueFalseAnswers, setTrueFalseAnswers] = useState(() => resolveTrueFalseAnswers(question));
    const latestAnswersRef = useRef(trueFalseAnswers);
    const submitTimerRef = useRef(null);
    const lastSubmittedSerializedRef = useRef(JSON.stringify(resolveTrueFalseAnswers(question)));

    const answerMap = useMemo(() => {
        const map = new Map();
        (Array.isArray(trueFalseAnswers) ? trueFalseAnswers : []).forEach((item) => {
            if (item?.statementId != null && typeof item?.isTrue === 'boolean') {
                map.set(String(item.statementId), item.isTrue);
            }
        });
        return map;
    }, [trueFalseAnswers]);

    useEffect(() => {
        const initialAnswers = resolveTrueFalseAnswers(question);
        setTrueFalseAnswers(initialAnswers);
        latestAnswersRef.current = initialAnswers;
        lastSubmittedSerializedRef.current = JSON.stringify(initialAnswers);

        if (submitTimerRef.current) {
            clearTimeout(submitTimerRef.current);
        }
    }, [question]);

    useEffect(() => {
        latestAnswersRef.current = trueFalseAnswers;

        if (submitTimerRef.current) {
            clearTimeout(submitTimerRef.current);
        }

        submitTimerRef.current = setTimeout(() => {
            const normalizedAnswers = [...(latestAnswersRef.current || [])]
                .filter((item) => item?.statementId != null && typeof item?.isTrue === 'boolean')
                .sort((a, b) => String(a.statementId).localeCompare(String(b.statementId)));

            const REQUIRED_TRUE_FALSE_COUNT = 4;
            if (normalizedAnswers.length < REQUIRED_TRUE_FALSE_COUNT) return;

            const serialized = JSON.stringify(normalizedAnswers);
            if (serialized === lastSubmittedSerializedRef.current) return;

            lastSubmittedSerializedRef.current = serialized;
            const questionAnswerId = resolveQuestionAnswerId(question);
            submitAnswer(dispatch, {
                questionId,
                questionAnswerId: questionAnswerId ?? undefined,
                trueFalseAnswers: normalizedAnswers,
            });
        }, 800);

        return () => {
            if (submitTimerRef.current) {
                clearTimeout(submitTimerRef.current);
            }
        };
    }, [trueFalseAnswers, dispatch, questionId, question]);

    const handleSelect = (statementId, isTrue) => {
        setTrueFalseAnswers((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const next = [...safePrev];
            const targetKey = String(statementId);

            const existingIndex = next.findIndex((item) => String(item?.statementId) === targetKey);
            const nextItem = { statementId, isTrue };

            if (existingIndex >= 0) {
                next[existingIndex] = nextItem;
            } else {
                next.push(nextItem);
            }

            return next;
        });
    };

    const hasAnswered = Boolean(resolveCurrentAnswer(question));
    const selectedTrueFalseCount = answerMap.size;
    const requiredTrueFalseCount = 4;

    return (
        <PracticeByChapterQuestionCardBase question={question} index={index} statementPrefixType="TRUE_FALSE">
            <div className="mt-4 space-y-3">
                {statements.map((statement, statementIndex) => {
                    const statementId = statement?.statementId;
                    const statementPrefix = getStatementPrefix('TRUE_FALSE', statementIndex);

                    const statementKey = String(statementId);
                    const hasAnsweredForStatement = answerMap.has(statementKey);
                    const currentValue = hasAnsweredForStatement ? answerMap.get(statementKey) : null;
                    const isTrueSelected = currentValue === true;
                    const isFalseSelected = currentValue === false;
                    const statementCorrect = typeof statement?.isCorrect === 'boolean' ? statement.isCorrect : null;
                    const isAnsweredCorrect =
                        hasAnsweredForStatement && statementCorrect != null && currentValue === statementCorrect;
                    const isAnsweredWrong =
                        hasAnsweredForStatement && statementCorrect != null && currentValue !== statementCorrect;

                    const rowClassName = !hasAnsweredForStatement
                        ? 'border-slate-200 bg-white'
                        : isAnsweredCorrect
                            ? 'border-emerald-300 bg-emerald-50'
                            : isAnsweredWrong
                                ? 'border-rose-300 bg-rose-50'
                                : 'border-blue-300 bg-blue-50';

                    return (
                        <div
                            key={statementId ?? `true-false-${statementIndex + 1}`}
                            className={`rounded-xl border px-3 py-2 ${rowClassName}`}
                        >
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 shrink-0 flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={submitLoading}
                                        onClick={() => handleSelect(statementId, true)}
                                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors ${submitLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isTrueSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50'}`}
                                    >
                                        Đúng
                                    </button>
                                    <button
                                        type="button"
                                        disabled={submitLoading}
                                        onClick={() => handleSelect(statementId, false)}
                                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors ${submitLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFalseSelected ? 'border-rose-600 bg-rose-600 text-white' : 'border-rose-300 bg-white text-rose-700 hover:bg-rose-50'}`}
                                    >
                                        Sai
                                    </button>
                                </div>

                                <span className="mt-0.5 shrink-0 text-sm font-semibold text-gray-900">
                                    {statementPrefix}
                                </span>
                                <StatementContent statement={statement} />
                            </div>

                            {hasAnsweredForStatement ? (
                                <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-18.5">
                                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${isAnsweredWrong ? 'border-rose-300 bg-rose-100 text-rose-700' : isAnsweredCorrect ? 'border-emerald-300 bg-emerald-100 text-emerald-700' : 'border-blue-300 bg-blue-100 text-blue-700'}`}>
                                        Bạn chọn: {currentValue ? 'Đúng' : 'Sai'}
                                    </span>

                                    {statementCorrect != null ? (
                                        <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                            Đáp án đúng: {statementCorrect ? 'Đúng' : 'Sai'}
                                        </span>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            {submitLoading ? <p className="mt-2 text-xs text-blue-600">Đang lưu đáp án...</p> : null}
            {!submitLoading && selectedTrueFalseCount < requiredTrueFalseCount ? (
                <p className="mt-2 text-xs text-slate-500">
                    Chọn đủ {requiredTrueFalseCount} mệnh đề Đúng/Sai để gửi đáp án ({selectedTrueFalseCount}/{requiredTrueFalseCount}).
                </p>
            ) : null}
            {submitError ? <p className="mt-2 text-xs text-red-600">{String(submitError)}</p> : null}
        </PracticeByChapterQuestionCardBase>
    );
};

export const PracticeByChapterShortAnswerQuestionCard = ({ question, index }) => {
    const dispatch = useDispatch();
    const questionId = question?.questionId;
    const initialAnswer = resolveShortAnswer(question);
    const submitLoading = useSelector((state) => selectPracticeByChapterSubmitAnswerLoadingByQuestionId(state, questionId));
    const submitError = useSelector((state) => selectPracticeByChapterSubmitAnswerErrorByQuestionId(state, questionId));
    const [inputValue, setInputValue] = useState(() => initialAnswer);
    const [inputError, setInputError] = useState(null);
    const debouncedInputValue = useDebounce(inputValue, ANSWER_SUBMIT_DEBOUNCE_MS);
    const lastSubmittedRef = useRef(initialAnswer);

    useEffect(() => {
        const nextValue = resolveShortAnswer(question);
        setInputValue(nextValue);
        setInputError(null);
        lastSubmittedRef.current = nextValue;
    }, [questionId, question]);

    useEffect(() => {
        commitSubmit(debouncedInputValue, { force: false });
    }, [debouncedInputValue]);

    const commitSubmit = (rawValue, { force = false } = {}) => {
        const trimmedValue = String(rawValue || '').trim();

        if (!trimmedValue) {
            setInputError(null);
            if (lastSubmittedRef.current === '') return;

            lastSubmittedRef.current = '';
            const questionAnswerId = resolveQuestionAnswerId(question);
            submitAnswer(dispatch, {
                questionId,
                questionAnswerId: questionAnswerId ?? undefined,
                answer: '',
            });
            return;
        }

        if (!DECIMAL_FINAL_PATTERN.test(trimmedValue)) {
            if (force) {
                setInputError('Chi duoc nhap so am/duong dang -3,14 hoac -3.14');
            }
            return;
        }

        setInputError(null);
        if (lastSubmittedRef.current === trimmedValue) return;

        lastSubmittedRef.current = trimmedValue;
        const questionAnswerId = resolveQuestionAnswerId(question);
        submitAnswer(dispatch, {
            questionId,
            questionAnswerId: questionAnswerId ?? undefined,
            answer: trimmedValue,
        });
    };

    const handleInputChange = (event) => {
        const nextValue = event.target.value;
        if (!DECIMAL_INPUT_PATTERN.test(nextValue)) return;

        setInputValue(nextValue);
        if (inputError) {
            setInputError(null);
        }
    };

    const answer = resolveCurrentAnswer(question);
    const shortAnswer = String(resolveShortAnswer(question) || '').trim();
    const isAnswered = Boolean(answer) && shortAnswer.length > 0;
    const isCorrect = answer?.isCorrect;
    const shouldShowCorrectAnswer = Boolean(question?.correctAnswer) && isAnswered && isCorrect === false;

    const answerInputClassName = isCorrect === true
        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
        : isCorrect === false
            ? 'border-rose-300 bg-rose-50 text-rose-800'
            : 'border-slate-200 bg-white text-slate-800';

    return (
        <PracticeByChapterQuestionCardBase question={question} index={index} statementPrefixType="SHORT_ANSWER">
            <div className="mt-3 space-y-2">
                <CustomTextInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            commitSubmit(inputValue, { force: true });
                        }
                    }}
                    placeholder="Nhap so, vi du: -3,14 hoac -3.14"
                    inputMode="decimal"
                    className={answerInputClassName}
                />

                {inputError ? <p className="mt-2 text-xs text-rose-600">{inputError}</p> : null}
                {submitLoading ? <p className="mt-2 text-xs text-blue-600">Đang lưu đáp án...</p> : null}
                {submitError ? <p className="mt-2 text-xs text-red-600">{String(submitError)}</p> : null}

                {shouldShowCorrectAnswer ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                        <p className="text-xs font-semibold text-emerald-700">Đáp án đúng</p>
                        <p className="mt-1 text-sm font-medium text-emerald-800">{String(question.correctAnswer)}</p>
                    </div>
                ) : null}
            </div>
        </PracticeByChapterQuestionCardBase>
    );
};

export const PracticeByChapterGenericQuestionCard = ({ question, index }) => (
    <PracticeByChapterQuestionCardBase question={question} index={index} statementPrefixType={question?.type}>
        {question?.answer?.answerText || question?.answer?.answer ? (
            <p className="mt-2 text-sm text-slate-700">
                Trả lời: {String(question?.answer?.answerText ?? question?.answer?.answer)}
            </p>
        ) : null}
    </PracticeByChapterQuestionCardBase>
);
