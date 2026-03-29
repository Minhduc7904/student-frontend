import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomRadio, CustomTextInput } from '../../../../../shared/components';
import { useDebounce } from '../../../../../shared/hooks';
import {
    selectPracticeSubmitAnswerErrorByQuestionId,
    selectPracticeSubmitAnswerLoadingByQuestionId,
    submitPublicStudentQuestionAnswer,
} from '../../store/practiceAttemptSlice';
import PracticeAttemptQuestionCardBase from './PracticeAttemptQuestionCardBase';
import MarkdownRenderer from '../../../../../shared/components/markdown/MarkdownRenderer';
import { getStatementContent, getStatementPrefix } from './questionUtils';

const DECIMAL_INPUT_PATTERN = /^-?\d*(?:[.,]\d*)?$/;
const DECIMAL_FINAL_PATTERN = /^-?\d+(?:[.,]\d+)?$/;
const ANSWER_SUBMIT_DEBOUNCE_MS = 500;

const getSortedStatements = (question) => {
    const statements = Array.isArray(question?.statements) ? question.statements : [];
    return [...statements].sort((a, b) => {
        const aOrder = Number.isFinite(Number(a?.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
        const bOrder = Number.isFinite(Number(b?.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
    });
};

const resolveSelectedStatementId = (question) => {
    if (question?.answer?.statementId != null) return question.answer.statementId;

    const selectedStatementIds = Array.isArray(question?.answer?.selectedStatementIds)
        ? question.answer.selectedStatementIds
        : [];
    if (selectedStatementIds.length) return selectedStatementIds[0];

    return null;
};

const resolveTrueFalseMap = (question) => {
    const map = new Map();
    const trueFalseAnswers = Array.isArray(question?.answer?.trueFalseAnswers)
        ? question.answer.trueFalseAnswers
        : [];

    trueFalseAnswers.forEach((item) => {
        if (item?.statementId != null && typeof item?.isTrue === 'boolean') {
            map.set(String(item.statementId), item.isTrue);
        }
    });

    // API can return TRUE_FALSE answer as a JSON object string in `answer`, e.g.:
    // "{\"4033\":false,\"4034\":true}"
    const rawAnswer = question?.answer?.answer;
    if (typeof rawAnswer === 'string' && rawAnswer.trim()) {
        try {
            const parsed = JSON.parse(rawAnswer);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                Object.entries(parsed).forEach(([statementId, isTrue]) => {
                    if (typeof isTrue === 'boolean') {
                        map.set(String(statementId), isTrue);
                    }
                });
            }
        } catch {
            // Ignore malformed JSON and keep available values from trueFalseAnswers.
        }
    }

    return map;
};

const resolveTrueFalseAnswers = (question) => {
    const map = resolveTrueFalseMap(question);
    return Array.from(map.entries()).map(([statementId, isTrue]) => ({ statementId, isTrue }));
};

const resolveShortAnswer = (question) => {
    return question?.answer?.answerText ?? question?.answer?.answer ?? '';
};

const StatementContent = memo(({ statement }) => {
    const content = getStatementContent(statement);

    if (!content) {
        return <p className="text-sm text-gray-500">Không có nội dung mệnh đề.</p>;
    }

    return (
        <MarkdownRenderer
            content={content}
            className="min-w-0 flex-1 text-sm text-gray-700"
        />
    );
});

const submitAnswer = (dispatch, payload) => {
    if (!payload?.attemptId || !payload?.questionId) return;
    dispatch(submitPublicStudentQuestionAnswer(payload));
};

const submitAnswerWithCallback = ({ dispatch, payload, onSubmitQuestionAnswer }) => {
    if (!payload?.attemptId || !payload?.questionId) return;

    if (typeof onSubmitQuestionAnswer === 'function') {
        onSubmitQuestionAnswer(payload);
        return;
    }

    submitAnswer(dispatch, payload);
};

export const PracticeAttemptSingleChoiceQuestionCard = ({
    question,
    index,
    attemptId = null,
    onQuestionInteraction,
    onSubmitQuestionAnswer,
}) => {
    const dispatch = useDispatch();
    const statements = useMemo(() => getSortedStatements(question), [question]);
    const questionId = question?.questionId;
    const submitLoading = useSelector((state) => selectPracticeSubmitAnswerLoadingByQuestionId(state, questionId));
    const submitError = useSelector((state) => selectPracticeSubmitAnswerErrorByQuestionId(state, questionId));
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
        submitAnswerWithCallback({
            dispatch,
            onSubmitQuestionAnswer,
            payload: {
            attemptId,
            questionId,
            selectedStatementIds: [debouncedSelectedStatementId],
            },
        });
    }, [attemptId, debouncedSelectedStatementId, dispatch, onSubmitQuestionAnswer, questionId]);

    const handleSelect = (statementId) => {
        if (questionId != null) {
            onQuestionInteraction?.(questionId);
        }
        setSelectedStatementId(statementId);
    };

    return (
        <PracticeAttemptQuestionCardBase question={question} index={index} statementPrefixType="SINGLE_CHOICE">
            <div className="mt-4 space-y-3" role="radiogroup" aria-label={`single-choice-${questionId ?? index}`}>
                {statements.map((statement, statementIndex) => {
                    const statementId = statement?.statementId;
                    const isSelected = String(selectedStatementId) === String(statementId);
                    const statementPrefix = getStatementPrefix('SINGLE_CHOICE', statementIndex);

                    return (
                        <div
                            key={statementId ?? `single-choice-${statementIndex + 1}`}
                            onClick={() => handleSelect(statementId)}
                            className={`w-full cursor-pointer rounded-xl border px-3 py-2 text-left transition-colors ${isSelected
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                                }`}
                        >
                            <div className="flex items-start gap-2">
                                <CustomRadio
                                    checked={isSelected}
                                    onChange={() => handleSelect(statementId)}
                                    ariaLabel={`chon dap an ${statementPrefix}`}
                                    className="mt-0.5 shrink-0"
                                />
                                <span className="mt-0.5 shrink-0 text-sm font-semibold text-gray-900">
                                    {statementPrefix}
                                </span>
                                <StatementContent statement={statement} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {submitLoading ? <p className="mt-2 text-xs text-blue-600">Đang lưu đáp án...</p> : null}
            {submitError ? <p className="mt-2 text-xs text-red-600">{String(submitError)}</p> : null}
        </PracticeAttemptQuestionCardBase>
    );
};

export const PracticeAttemptTrueFalseQuestionCard = ({
    question,
    index,
    attemptId = null,
    onQuestionInteraction,
    onSubmitQuestionAnswer,
}) => {
    const dispatch = useDispatch();
    const statements = useMemo(() => getSortedStatements(question), [question]);
    const questionId = question?.questionId;
    const submitLoading = useSelector((state) => selectPracticeSubmitAnswerLoadingByQuestionId(state, questionId));
    const submitError = useSelector((state) => selectPracticeSubmitAnswerErrorByQuestionId(state, questionId));
    const [trueFalseAnswers, setTrueFalseAnswers] = useState(() => resolveTrueFalseAnswers(question));
    const debouncedTrueFalseAnswers = useDebounce(trueFalseAnswers, ANSWER_SUBMIT_DEBOUNCE_MS);
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
        lastSubmittedSerializedRef.current = JSON.stringify(initialAnswers);
    }, [question]);

    useEffect(() => {
        const normalizedAnswers = [...(Array.isArray(debouncedTrueFalseAnswers) ? debouncedTrueFalseAnswers : [])]
            .filter((item) => item?.statementId != null && typeof item?.isTrue === 'boolean')
            .sort((a, b) => String(a.statementId).localeCompare(String(b.statementId)));

        const serialized = JSON.stringify(normalizedAnswers);
        if (serialized === lastSubmittedSerializedRef.current) return;

        lastSubmittedSerializedRef.current = serialized;
        submitAnswerWithCallback({
            dispatch,
            onSubmitQuestionAnswer,
            payload: {
            attemptId,
            questionId,
            trueFalseAnswers: normalizedAnswers,
            },
        });
    }, [attemptId, debouncedTrueFalseAnswers, dispatch, onSubmitQuestionAnswer, questionId]);

    const handleSelect = (statementId, isTrue) => {
        if (questionId != null) {
            onQuestionInteraction?.(questionId);
        }
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

    return (
        <PracticeAttemptQuestionCardBase question={question} index={index} statementPrefixType="TRUE_FALSE">
            <div className={`mt-4 space-y-3 transition-opacity ${submitLoading ? 'opacity-70' : 'opacity-100'}`}>
                {statements.map((statement, statementIndex) => {
                    const statementId = statement?.statementId;
                    const statementPrefix = getStatementPrefix('TRUE_FALSE', statementIndex);
                    const currentValue = answerMap.get(String(statementId));
                    const isTrueSelected = currentValue === true;
                    const isFalseSelected = currentValue === false;

                    return (
                        <div
                            key={statementId ?? `true-false-${statementIndex + 1}`}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                        >
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 shrink-0 flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={submitLoading}
                                        onClick={() => handleSelect(statementId, true)}
                                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors ${submitLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isTrueSelected
                                            ? 'border-emerald-600 bg-emerald-600 text-white'
                                            : 'border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50'
                                            }`}
                                    >
                                        Đúng
                                    </button>
                                    <button
                                        type="button"
                                        disabled={submitLoading}
                                        onClick={() => handleSelect(statementId, false)}
                                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors ${submitLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFalseSelected
                                            ? 'border-rose-600 bg-rose-600 text-white'
                                            : 'border-rose-300 bg-white text-rose-700 hover:bg-rose-50'
                                            }`}
                                    >
                                        Sai
                                    </button>
                                </div>
                                <span className="mt-0.5 shrink-0 text-sm font-semibold text-gray-900">
                                    {statementPrefix}
                                </span>
                                <StatementContent statement={statement} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {submitLoading ? (
                <p className="mt-2 inline-flex items-center gap-2 text-xs text-blue-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                    Đang lưu đáp án...
                </p>
            ) : null}
            {submitError ? <p className="mt-2 text-xs text-red-600">{String(submitError)}</p> : null}
        </PracticeAttemptQuestionCardBase>
    );
};

export const PracticeAttemptShortAnswerQuestionCard = ({
    question,
    index,
    attemptId = null,
    onQuestionInteraction,
    onSubmitQuestionAnswer,
}) => {
    const dispatch = useDispatch();
    const questionId = question?.questionId;
    const initialAnswer = resolveShortAnswer(question);
    const submitLoading = useSelector((state) => selectPracticeSubmitAnswerLoadingByQuestionId(state, questionId));
    const submitError = useSelector((state) => selectPracticeSubmitAnswerErrorByQuestionId(state, questionId));
    const [inputValue, setInputValue] = useState(() => initialAnswer);
    const [inputError, setInputError] = useState(null);
    const debouncedInputValue = useDebounce(inputValue, ANSWER_SUBMIT_DEBOUNCE_MS);
    const lastSubmittedRef = useRef(initialAnswer);

    useEffect(() => {
        const nextValue = resolveShortAnswer(question);
        setInputValue(nextValue);
        setInputError(null);
        lastSubmittedRef.current = nextValue;
    }, [questionId]);

    useEffect(() => {
        commitSubmit(debouncedInputValue, { force: false });
    }, [debouncedInputValue]);

    const commitSubmit = (rawValue, { force = false } = {}) => {
        const trimmedValue = String(rawValue || '').trim();

        if (!trimmedValue) {
            setInputError(null);
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
        submitAnswerWithCallback({
            dispatch,
            onSubmitQuestionAnswer,
            payload: {
            attemptId,
            questionId,
            answer: trimmedValue,
            },
        });
    };

    const handleInputChange = (event) => {
        const nextValue = event.target.value;

        if (!DECIMAL_INPUT_PATTERN.test(nextValue)) return;

        if (questionId != null) {
            onQuestionInteraction?.(questionId);
        }
        setInputValue(nextValue);
        if (inputError) {
            setInputError(null);
        }
    };

    return (
        <PracticeAttemptQuestionCardBase question={question} index={index} statementPrefixType="SHORT_ANSWER">
            <div className="mt-4 ">
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
                />
                {inputError ? <p className="mt-2 text-xs text-rose-600">{inputError}</p> : null}
                {submitLoading ? <p className="mt-2 text-xs text-blue-600">Đang lưu đáp án...</p> : null}
                {submitError ? <p className="mt-2 text-xs text-red-600">{String(submitError)}</p> : null}
            </div>
        </PracticeAttemptQuestionCardBase>
    );
};

export const PracticeAttemptGenericQuestionCard = ({ question, index }) => (
    <PracticeAttemptQuestionCardBase
        question={question}
        index={index}
        statementPrefixType={question?.type}
    />
);
